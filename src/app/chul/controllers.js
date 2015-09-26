(function(angular, _){
    "use strict";

    angular.module("mfl.chul.controllers", [
        "mfl.chul.services",
        "mfl.facility_filter.services"
    ])

    .controller("mfl.chul.controllers.view", ["$scope","mfl.chul.services.wrappers","$stateParams",
        "gisAdminUnitsApi","leafletData",
        function ($scope,wrappers,$stateParams,gisAdminUnitsApi,leafletData) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            /*Setup for map data*/
            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false
                },
                layers:{},
                tiles:{
                    openstreetmap: {
                        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        options: {
                            opacity: 0.7,
                            attribution: "&copy; <a href='http://www.openstreetmap.org/"+
                            "copyright'>OpenStreetMap</a> contributors"
                        }
                    }
                }
            });
            wrappers.chul.get($stateParams.unit_id)
            .success(function (unit) {
                $scope.spinner = false;
                $scope.unit = unit;
                /*ward coordinates*/
                gisAdminUnitsApi.wards.get(unit.boundaries.ward_boundary)
                .success(function(data){
                    $scope.spinner = false;
                    $scope.ward_gis = data;
                    leafletData.getMap("wardmap")
                        .then(function (map) {
                            var coords = data.properties.bound.coordinates[0];
                            var bounds = _.map(coords, function(c) {
                                return [c[1], c[0]];
                            });
                            map.fitBounds(bounds);
                        });
                    var gis = data;
                    angular.extend($scope, {
                        markers: {
                            mainMarker: {
                                layer:"facility",
                                lat: unit.geo_features.geometry.coordinates[1],
                                lng: unit.geo_features.geometry.coordinates[0],
                                message: "Facility location"
                            }
                        },
                        geojson: {
                            data: gis,
                            style: {
                                fillColor: "rgb(255, 135, 32)",
                                weight: 2,
                                opacity: 1,
                                color: "rgba(0, 0, 0, 0.52)",
                                dashArray: "3",
                                fillOpacity: 0.8
                            }
                        },
                        layers:{
                            baselayers:{
                                ward: {
                                    name: "Ward",
                                    url: "/assets/img/transparent.png",
                                    type:"group"
                                }
                            },
                            overlays:{
                                facility:{
                                    name:"Facility Location",
                                    type:"group",
                                    visible: true
                                }
                            }
                        }
                    });
                })
                .error(function(error){
                    console.error(error);
                });
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ])

    .controller("mfl.chul.controllers.search_form",
        ["$stateParams", "$scope", "$state", "$location",
        "mfl.chul.services.wrappers", "CHU_SEARCH_PARAMS",
        function ($stateParams, $scope, $state, $location, wrappers, CHU_SEARCH_PARAMS) {
            $scope.filters = {
                single: {
                    name: "",
                    code: "",
                    search: ""
                },
                multiple: {
                    county: [],
                    constituency: [],
                    ward: [],
                    status: [],
                    service: []
                }
            };

            var updateSingleFilters = function (params) {
                // update single inputs
                _.each(_.keys($scope.filters.single), function (a) {
                    $scope.filters.single[a] = params[a] || "";
                });
            };
            updateSingleFilters($stateParams);
            var updateMultipleFilters = function (params, filter_summaries) {
                // update ui-select inputs
                _.each(_.keys($scope.filters.multiple),function (a) {
                    var val = params[a];
                    if (val) {
                        $scope.filters.multiple[a] = _.filter(
                            filter_summaries[a],
                            function (b) {
                                return val.indexOf(b.id) !== -1;
                            }
                        );
                    }
                });

                // update ui-select with relationships
                var relationships = [
                    {child: "ward", parent: "constituency"},
                    {child: "constituency", parent: "county"}
                ];
                _.each(relationships, function (r) {
                    _.each($scope.filters.multiple[r.child], function (w) {
                        var x = _.findWhere(filter_summaries[r.parent], {"id": w[r.parent]});
                        if (!_.isUndefined(x)) {
                            $scope.filters.multiple[r.parent].push(x);
                        }
                    });
                });

                // remove duplicates in ui-select repeat sources
                _.each(_.keys($scope.filters.multiple), function (a) {
                    $scope.filters.multiple[a] = _.uniq($scope.filters.multiple[a]);
                });
            };

            $scope.filterFxns = {
                constFilter: function (a) {
                    var county_ids = _.pluck($scope.filters.multiple.county, "id");
                    return _.contains(county_ids, a.county);
                },
                wardFilter: function (a) {
                    var const_ids = _.pluck($scope.filters.multiple.constituency, "id");
                    return _.contains(const_ids, a.constituency);
                }
            };

            wrappers.filters.filter({"fields": [
                "county", "constituency", "ward", "status", "service"
            ]})
            .success(function (data) {
                $scope.filter_summaries = data;
                updateMultipleFilters($stateParams, data);
            });

            var dumpMultipleFilters = function (src) {
                return _.reduce(_.keys(src), function (memo, b) {
                    memo[b] = _.pluck(src[b], "id").join(",");
                    return memo;
                }, {});
            };

            var dumpSingleFilters = function (src) {
                var k = _.keys(src);
                return _.reduce(k, function (memo, b) {
                    memo[b] = src[b];
                    return memo;
                }, {});
            };

            $scope.filterCHUs = function () {
                var multiple = dumpMultipleFilters($scope.filters.multiple);
                var single = dumpSingleFilters($scope.filters.single);
                var params = _.extend(single, multiple);
                params.page = undefined;
                params.page_size = undefined;
                $state.go("chul_filter.results", params);
            };

            $scope.clearFilters = function () {
                var params = {};
                _.each(CHU_SEARCH_PARAMS, function (a) {
                    params[a] = undefined;
                });
                $state.go("chul_filter", params);
            };
        }]
    )

    .controller("mfl.chul.controllers.search_results",
        ["$scope", "$state", "$window", "filterParams",
        "mfl.chul.services.wrappers", "api.auth",
        function ($scope, $state, $window, filterParams, wrappers, auth) {
            var filter_keys = _.keys(filterParams);
            var params = _.reduce(filter_keys, function (memo, b) {
                if (filterParams[b]) {
                    memo[b] = filterParams[b];
                }
                return memo;
            }, {
                "fields": "id,code,name,status_name,date_established,facility,facility_name," +
                          "facility_county,facility_subcounty,facility_ward"
            });

            $scope.spinner = true;
            $scope.filter_promise = wrappers.chul.filter(params)
            .success(function (data) {
                $scope.spinner = false;
                $scope.results = data;
            })
            .error(function (e) {
                $scope.alert = e.detail ||
                               "Sorry, a server connection error occured.";
                $scope.spinner = false;
            });

            $scope.excelExport = function () {
                var download_params = {
                    "format": "excel",
                    "access_token": auth.getToken().access_token,
                    "page_size": $scope.results.count
                };
                _.extend(download_params, _.omit(params, "page"));

                var helpers = wrappers.helpers;
                var url = helpers.joinUrl([
                    wrappers.chul.makeUrl(wrappers.chul.apiBaseUrl),
                    helpers.makeGetParam(helpers.makeParams(download_params))
                ]);

                $window.location.href = url;
            };

            $scope.nextPage = function () {
                if ($scope.results.total_pages === $scope.results.current_page) {
                    return;
                }
                params.page = $scope.results.current_page + 1 ;
                $state.go("chul_filter.results", params);
            };

            $scope.prevPage = function () {
                if ($scope.results.current_page === 1) {
                    return;
                }
                params.page = $scope.results.current_page - 1;
                $state.go("chul_filter.results", params);
            };
        }]
    );

})(window.angular, window._);
