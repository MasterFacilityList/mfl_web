"use strict";
(function(angular){
    angular.module("mfl.filtering.controllers", [
        "mfl.filtering.services",
        "mfl.search.utils"
    ])

    .controller("mfl.filtering.controller", ["$scope","filteringApi",
                "mfl.search.filters.changes", function($scope,
                filterApi, changedFilters){
        $scope.filter = {
            county: undefined,
            constituency: undefined
        };
        $scope.disabled = {
            wards: true,
            consts: true
        };
        $scope.default_filter = {page_size: 2000};
        $scope.filter_data = filterApi.getData();
        var getChildren = function(api, key, filter){
            api.filter(
                _.extend(filter, $scope.default_filter))
                .success(function(data){
                    $scope.filter_data[key] = data.results;
                    $scope.disabled[key] = false;
                }).error(function(err){
                    $scope.alert =err.error;
                    $scope.filter_data[key] = [];
                    $scope.disabled[key] = true;
                });
        };
        $scope.$watch("filter.county", function(county){
            if(!_.isUndefined(county)){
                getChildren(filterApi.constituencies, "consts", {county: county.id});
            }
        });

        $scope.$watch("filter.constituency", function(constituency){
            if(!_.isUndefined(constituency)){
                getChildren(filterApi.wards, "wards", {constituency: constituency.id});
            }
        });

        $scope.filterFacility = function(frm){
            var changes= changedFilters.whatChanged(frm);
            if(!_.isEmpty(changes)){
                if(_.has(changes, "ward")){
                    changes.ward = changes.ward.id;
                    delete changes.county;
                    delete changes.constituency;
                }else{
                    if(_.has(changes, "constituency")){
                        changes.constituency = changes.constituency.id;
                        delete changes.county;
                    }else{
                        if(_.has(changes, "county")){
                            changes.county = changes.county.id;
                        }
                    }
                }
                console.log(changes);
                filterApi.facilities.filter(changes).success(function(data){
                    $scope.query_results = data.results;
                }).error(function(error){
                    $scope.alert = error.error;
                });
            }
        };
    }]);
})(angular);
