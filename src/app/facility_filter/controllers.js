(function (angular, _) {
    "use strict";

    angular.module("mfl.facility_filter.controllers", [
        "mfl.facility_filter.services",
        "mfl.facility_filter.states"
    ])

    .controller("mfl.facility_filter.controllers.form",
        ["$stateParams", "$scope", "$state", "$location",
        "mfl.facility_filter.services.wrappers", "URL_SEARCH_PARAMS",
        function ($stateParams, $scope, $state, $location, wrappers, URL_SEARCH_PARAMS) {
            $scope.filters = {
                single: {
                    name: $stateParams.name || "",
                    code: $stateParams.code || "",
                    search: $stateParams.search || "",
                    number_of_beds: $stateParams.number_of_beds || "",
                    number_of_cots: $stateParams.number_of_cots || "",
                    open_public_holidays: true,
                    open_weekends: true,
                    open_whole_day: true,
                    is_regulated: true,
                    is_active: true
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
                    service: []
                }
            };

            var updateSelectFilters = function (source) {
                console.log(source);
            };

            $scope.filterFxns = {
                constFilter: function (a) {
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

            wrappers.filters.filter({"fields": ["county", "facility_type", "constituency",
                "ward", "operation_status", "service_category", "owner_type", "owner", "service"
            ]})
            .success(function (data) {
                $scope.filter_summaries = data;
                updateSelectFilters(data);
            });

            $scope.dumpMultipleFilters = function (src) {
                var filter_keys = _.keys(src);
                var params = _.reduce(filter_keys, function (memo, b) {
                    memo[b] = _.pluck(src[b], "id").join(",");
                    return memo;
                }, {});
                return params;
            };
            $scope.dumpSimpleFilters = function (src) {
                var filter_keys = _.keys(src);
                var params = _.reduce(filter_keys, function (memo, b) {
                    memo[b] = src[b];
                    return memo;
                }, {});
                return params;
            };

            $scope.filterFacilities = function () {
                var multiple = $scope.dumpMultipleFilters($scope.filters.multiple);
                var simple = $scope.dumpSimpleFilters($scope.filters.single);
                $state.go("facility_filter.results", _.extend(simple, multiple));
            };

            $scope.clearFilters = function () {
                var params = {};
                _.each(URL_SEARCH_PARAMS, function (a) {
                    params[a] = undefined;
                });
                // also cancel filter_promise defined in L120
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
            }, {});
            var extractPageMeta = function(data) {
                var from_index = data.page_size * data.current_page;
                var to_index = from_index + data.results.length;
                return {
                    "from_index": from_index,
                    "to_index": to_index
                };
            };
            $scope.spinner = true;
            $scope.filter_promise = wrappers.facilities.filter(params)
            .success(function (data) {
                $scope.spinner = false;
                $scope.results = data;
                _.extend($scope.results, extractPageMeta(data));
            })
            .error(function (e) {
                $scope.alert = e.detail || "Sorry, a server connection error occured.";
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

})(angular, _);
