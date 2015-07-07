(function (angular, _) {
    "use strict";

    angular.module("mfl.facility_filter.controllers", [])

    .controller("mfl.facility_filter.controller",
        ["$stateParams", "$scope", "$state", "filteringApi",
        function ($stateParams, $scope, $state, filteringApi) {
            var filter_fields = ["county", "facility_type", "constituency",
                "ward", "operation_status", "service_category", "owner_type", "owner"
            ];
            filteringApi.filters.filter({"fields": filter_fields})
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
                $state.go("facility_filter", {});
            };
        }]
    )

    .controller("mfl.facility_filter.controller.results",
        ["$scope", "filterParams", "filteringApi",
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
