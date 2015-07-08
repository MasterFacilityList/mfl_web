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
            var filter_fields = ["county", "facility_type", "constituency",
                "ward", "operation_status", "service_category", "owner_type", "owner"
            ];
            wrappers.filters.filter({"fields": filter_fields})
            .success(function (data) {
                $scope.filter_summaries = data;
            });

            $scope.filters = {
                single: {
                    name: "",
                    code: "",
                    search: "",
                    page: "",
                    page_size: ""
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
                }
            };

            $scope.filterFacilities = function () {
                var filter_keys = _.keys($scope.filters.multiple);
                var params = _.reduce(filter_keys, function (memo, b) {
                    memo[b] = _.pluck($scope.filters.multiple[b], "id").join(",");
                    return memo;
                }, {});
                $state.go("facility_filter.results", params);
            };

            $scope.clearFilters = function () {
                var params = {};
                _.each(URL_SEARCH_PARAMS, function (a) {
                    params[a] = undefined;
                });
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
            $scope.spinner = true;
            wrappers.facilities.filter(params)
            .success(function (data) {
                $scope.spinner = false;
                $scope.results = data;
                $scope.results.from_index = data.page_size * data.current_page;
                $scope.results.to_index = $scope.results.from_index + data.results.length;
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
