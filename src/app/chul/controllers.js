(function(angular, _ , toastr){
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.chul.controllers
     *
     * @description
     * Contains the controller used in CHU views
     */
    angular.module("mfl.chul.controllers", [
        "mfl.chul.services",
        "mfl.rating.services",
        "mfl.facility_filter.services"
    ])

    /**
     * @ngdoc controller
     *
     * @name mfl.chul.controllers.view
     *
     * @description
     * Controller for the CHU detail view
     */
    .controller("mfl.chul.controllers.view", ["$scope","mfl.chul.services.wrappers","$stateParams",
        "gisAdminUnitsApi","leafletData", "mfl.rating.services.rating", "$window", "$state",
        "api.auth",
        function ($scope,wrappers,$stateParams,gisAdminUnitsApi,leafletData,
            ratingService, $window, $state, auth) {
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

            /*CHU rating*/
            $scope.rating = [
                {
                    current: 0,
                    max: 5
                }
            ];
            $scope.getSelectedRating = function (rating, id) {
                $scope.cu_rating = {
                    cu_id : id,
                    rating : rating
                };
            };
            $scope.getUnitRating = function () {
                wrappers.chul.get($stateParams.unit_id,
                    {"fields" : "avg_rating,number_of_ratings"})
                .success(function (data) {
                    $scope.unit.avg_rating = data.avg_rating;
                    $scope.unit.number_of_ratings = data.number_of_ratings;
                })
                .error(function (data) {
                    $scope.alert = data;
                });
            };
            $scope.rateCU = function (unit) {
                $scope.chu_rating = {
                    chu : unit.id,
                    rating : unit.ratings[0].current,
                    comment : unit.ratings[0].comment
                };
                $scope.unit.spinner = true;
                wrappers.chul_ratings.create($scope.chu_rating)
                .success(function (data) {
                    //save rating in localStorage
                    var rating_val = [];
                    rating_val[0] = data.rating;
                    rating_val[1] = data.comment;
                    $scope.unit.spinner = false;
                    ratingService.storeRating(unit.id, rating_val);
                    $scope.getUnitRating();
                    toastr.success("Successfully rated");
                    $state.go("chul_view", {unit_id : unit.id},{reload: true});
                })
                .error(function () {
                    $scope.unit.spinner = false;
                    $scope.alert = "CHU can only be rated once a day";
                    toastr.error($scope.alert);
                });
            };
            $scope.printCU = function (unit_id) {
                var download_params = {
                    "format": "pdf",
                    "access_token": auth.getToken().access_token
                };
                $scope.file_url = wrappers.helpers.joinUrl([
                    wrappers.chul_pdf.makeUrl(wrappers.chul_pdf.apiBaseUrl),
                    unit_id, "/",
                    wrappers.helpers.makeGetParam(
                        wrappers.helpers.makeParams(download_params)
                    )
                ]);
            };
            $scope.unit_id = $stateParams.unit_id;
            $scope.printCU($scope.unit_id);
            wrappers.chul.get($stateParams.unit_id)
            .success(function (unit) {
                $scope.spinner = false;
                $scope.unit = unit;
                var current_rate = "";
                current_rate = ratingService.getRating($stateParams.unit_id);
                $scope.unit.ratings = [
                    {
                        current: current_rate ? current_rate[0] : 0,
                        max: 5
                    }
                ];
                /*ward coordinates*/
                gisAdminUnitsApi.ward.get(unit.ward_code)
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

    /**
     * @ngdoc controller
     *
     * @name mfl.chul.controllers.search_form
     *
     * @description
     * Controller for the search form in CHU advanced search
     */
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
                    status: []
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

            wrappers.filters.filter({"fields": ["county", "constituency", "ward", "chu_status"]})
            .success(function (data) {
                $scope.filter_summaries = data;
                $scope.filter_summaries.status = $scope.filter_summaries.chu_status;
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

    /**
     * @ngdoc controller
     *
     * @name mfl.chul.controllers.search_results
     *
     * @description
     * Controller for the results part of CHU advanced search
     */
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

            // transform search param into a query DSL
            if (params.search) {
                var dsl = {
                    "query": { }
                };
                if (_.isNaN(parseInt(params.search, 10))) {
                    dsl.query.query_string = {
                        "default_field": "name",
                        "query": params.search
                    };
                } else {
                    dsl.query.term = {
                        "code": params.search
                    };
                }
                params.search = JSON.stringify(dsl);
            }

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
})(window.angular,window._, window.toastr);
