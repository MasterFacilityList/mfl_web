(function (angular, _) {
    "use strict";

    angular.module("mfl.facility_filter.controllers", [
        "mfl.facility_filter.services",
        "mfl.facility_filter.states"
    ])

    .directive("indeterminateValue", function () {
        var link_fxn = function (scope, elem, attrs) {
            var truthy = scope.$eval(attrs.ngTrueValue);
            var falsy = scope.$eval(attrs.ngFalseValue);

            scope.$watch(attrs.ngModel, function (n) {
                if (n !== truthy && n !== falsy) {
                    elem[0].indeterminate = true;
                }
            });
        };
        return {
            "require": "ngModel",
            "restrict": "A",
            "link": link_fxn
        };
    })

    .controller("mfl.facility_filter.controllers.form",
        ["$stateParams", "$scope", "$state", "$location",
        "mfl.facility_filter.services.wrappers", "FACILITY_SEARCH_PARAMS",
        function ($stateParams, $scope, $state, $location, wrappers, FACILITY_SEARCH_PARAMS) {
            $scope.filters = {
                single: {
                    name: "",
                    code: "",
                    search: "",
                    number_of_beds: "",
                    number_of_cots: "",
                    open_public_holidays: "",
                    open_weekends: "",
                    open_whole_day: ""
                },
                multiple: {
                    county: [],
                    facility_type: [],
                    constituency: [],
                    ward: [],
                    operation_status: [],
                    service_category: [],
                    owner_type: [],
                    owner: [],
                    service: [],
                    keph_level: []
                }
            };

            $scope.bool_clear = function () {
                $scope.filters.single.open_weekends = "";
                $scope.filters.single.open_whole_day = "";
                $scope.filters.single.open_public_holidays = "";
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
                subFilter: function (a) {
                    var county_ids = _.pluck($scope.filters.multiple.county, "id");
                    return _.contains(county_ids, a.county);
                },
                wardFilter: function (a) {
                    var const_ids = _.pluck($scope.filters.multiple.constituency, "id");
                    return _.contains(const_ids, a.constituency);
                },
                ownerFilter: function (a) {
                    var owner_types = _.pluck($scope.filters.multiple.owner_type, "id");
                    return (_.isEmpty(owner_types)) ?
                        true :
                        _.contains(owner_types, a.owner_type);
                },
                serviceFilter: function (a) {
                    var categories = _.pluck($scope.filters.multiple.service_category, "id");
                    return (_.isEmpty(categories)) ?
                        true :
                        _.contains(categories, a.category);
                }
            };

            wrappers.filters.filter({"fields": ["county", "facility_type",
                "constituency", "ward", "operation_status", "service_category",
                "owner_type", "owner", "service", "keph_level","sub_county"
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

            $scope.filterFacilities = function () {
                var multiple = dumpMultipleFilters($scope.filters.multiple);
                var single = dumpSingleFilters($scope.filters.single);
                var params = _.extend(single, multiple);
                params.page = undefined;
                params.page_size = undefined;
                $state.go("facility_filter.results", params);
            };

            $scope.clearFilters = function () {
                var params = {};
                _.each(FACILITY_SEARCH_PARAMS, function (a) {
                    params[a] = undefined;
                });
                // TODO : cancel filter_promise defined in L120
                $state.go("facility_filter", params);
            };
        }]
    )

    .controller("mfl.facility_filter.controllers.results",
        ["$scope", "$state", "$window", "filterParams",
        "mfl.facility_filter.services.wrappers", "api.auth",
        function ($scope, $state, $window, filterParams, wrappers, auth) {
            var filter_keys = _.keys(filterParams);
            var params = _.reduce(filter_keys, function (memo, b) {
                if (filterParams[b]) {
                    memo[b] = filterParams[b];
                }
                return memo;
            }, {
                "fields": "id,code,name,regulatory_status_name," +
                          "facility_type_name,owner_name,county,constituency,"+
                          "ward_name,keph_level,operation_status_name"
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
            $scope.filter_promise = wrappers.facilities.filter(params)
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
                    wrappers.facilities.makeUrl(wrappers.facilities.apiBaseUrl),
                    helpers.makeGetParam(helpers.makeParams(download_params))
                ]);

                $window.location.href = url;
            };

            $scope.nextPage = function () {
                if ($scope.results.total_pages === $scope.results.current_page) {
                    return;
                }
                params.page = $scope.results.current_page + 1 ;
                $state.go("facility_filter.results", params);
            };

            $scope.prevPage = function () {
                if ($scope.results.current_page === 1) {
                    return;
                }
                params.page = $scope.results.current_page - 1;
                $state.go("facility_filter.results", params);
            };
        }]
    );

})(window.angular, window._);
