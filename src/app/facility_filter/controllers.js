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
                // https://github.com/angular/angular.js/blob/v1.3.x/src/ng/location.js#L537-L568
                _.each(URL_SEARCH_PARAMS, function (a) {
                    $location.search(a, null);
                });
                $location.$$compose();
                $state.go("facility_filter", {});
            };
        }]
    )

    .controller("mfl.facility_filter.controllers.results",
        ["$scope", "filterParams", "mfl.facility_filter.services.wrappers",
        function ($scope, filterParams, wrappers) {
            var filter_keys = _.keys(filterParams);
            var params = _.reduce(filter_keys, function (memo, b) {
                if (filterParams[b]) {
                    memo[b] = filterParams[b];
                }
                return memo;
            }, {});
            wrappers.facilities.filter(params)
            .success(function (data) {
                $scope.results = data;
            });
        }]
    );

})(angular, _);
