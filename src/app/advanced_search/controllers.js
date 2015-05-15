"use strict";
(function(angular){
    angular.module("mfl.filtering.controllers", [
        "mfl.filtering.services",
        "mfl.search.utils"
    ])
    .controller("mfl.filtering.controller", ["$scope","$rootScope",
        "$stateParams", "filteringApi", "facilitiesApi", "downloadApi",
        "mfl.search.filters.changes","filteringData",
        function($scope, $rootScope, $stateParams,filterApi,
            facilitiesApi, downloadApi, changedFilters, filteringData){
        $scope.filter_data = {};
        var initFilterModel = function(){
            $scope.filter = $stateParams;
        };
        initFilterModel();
        $scope.filter = {
            county: [],
            constituency: [],
            ward: [],
            operation_status: [],
            facility_type: [],
            number_of_beds: [],
            number_of_cots: []
        };
        $scope.numbers = _.range(2000);
        $scope.disabled = {
            ward: true,
            consts: true
        };
        $scope.selectTitles = {
            county:{
                buttonDefaultText: "Select County"
            },
            constituency:{
                buttonDefaultText: "Select Constituency"
            },
            ward: {
                buttonDefaultText: "Select Ward"
            },
            operation_status: {
                buttonDefaultText: "Select Operation Status"
            },
            facility_type: {
                buttonDefaultText: "Select Facility Type"
            }
        };
        $scope.selected = {
            county: [],
            constituency: []
        };
        $scope.default_filter = {page_size: 2000};
        $scope.events = {
            utils: (function(){
                return{
                    addSelected: function(key, value, label, filterKey,api){
                        $scope.selected[key].push(value);
                        $scope.selected[key] = _.uniq($scope.selected[key]);
                        var filter = {};
                        filter[filterKey]= $scope.selected[key].join(",");
                        getChildren(
                            api,
                            label,
                            filter
                        );
                    },
                    removeSelected: function(key, value, label,filterKey, api){
                        $scope.selected[key].pop(value);
                        var fs = $scope.selected[key].join(",");
                        var pass_filter = {};
                        pass_filter[filterKey] = fs;
                        var filter = _.isEmpty(fs)?{}:pass_filter;
                        getChildren(
                            api,
                            label,filter);
                    }
                };
            })(),
            county: {
                onItemSelect: function(item){
                    $scope.events.utils.addSelected(
                        "county", item.id, "constituency", "county",
                        filterApi.constituencies);
                },
                onItemDeselect: function(item){
                    $scope.events.utils.removeSelected(
                        "county", item.id, "constituency", "county",
                        filterApi.constituencies);
                }
            },
            constituency: {
                onItemSelect: function(item){
                    $scope.events.utils.addSelected(
                        "constituency", item.id, "ward", "constituency",
                        filterApi.wards);
                    $scope.disabled.ward = false;
                },
                onItemDeselect: function(item){
                    $scope.events.utils.removeSelected(
                        "constituency", item.id, "ward", "constituency",
                        filterApi.wards);
                    if( _.isEmpty($scope.filter_data.ward)){
                        $scope.disabled.ward = true;
                    }else{
                        $scope.disabled.ward = false;
                    }
                }
            }
        };
        $scope.dropDownSettings = {
            displayProp: "name",
            showCheckAll: false,
            showUncheckAll: false,
            closeOnSelect: true,
            closeOnDeselect: true,
            enableSearch: true,
            smartButtonMaxItems: 5
        };
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.page = true;
        $scope.search_results = true;
        $scope.no_result = false;
        $scope.err = "";
        _.each(["county", "operation_status", "constituency", "facility_type"], function(key){
            $scope.filter_data[key] = filteringData[key].data.results;
            $scope.filter_data.ward = [];
            $rootScope.mfl_filter_data = $scope.filter_data;
        });
        var removeEmptyFilters = function(filters){
            _.each(_.keys(filters), function(key){
                if(_.isUndefined(filters[key])){
                    delete filters[key];
                }
            });
            return filters;
        };
        if(_.isEmpty($stateParams)){
            filterApi.facilities.list().success(function(res){
                $scope.search_results = false;
                $scope.query_results = res.results;
                if($scope.query_results.length === 0) {
                    $scope.no_result = true;
                }
            }).error(function(err){
                $scope.alert = err.error;
                $scope.err = err.error;
                $scope.search_results = false;
            });
        }else{
            $scope.query = $stateParams.search;
            var filters = removeEmptyFilters($stateParams);
            filterApi.facilities.filter(filters).success(function(res){
                $scope.search_results = false;
                $scope.query_results = res.results;
                if($scope.query_results.length === 0) {
                    $scope.no_result = true;
                }
            }).error(function(err){
                $scope.err = err.error;
                $scope.search_results = false;
                $scope.alert = err.error;
            });
        }
        var getChildren = function(api, key, filter){
            api.filter(
                _.extend(filter, $scope.default_filter))
                .success(function(data){
                    $scope.filter_data[key] = [];
                    $scope.filter_data[key] = data.results;
                    $scope.disabled[key] = false;
                }).error(function(err){
                    $scope.alert =err.error;
                    $scope.filter_data[key] = [];
                    $scope.disabled[key] = true;
                });
        };
        var constructParams = function(items){
            var changes = JSON.parse(JSON.stringify(items)); // deep clone
            _.each(_.keys(changes), function(key){
                if(_.isArray(changes[key])){
                    changes[key] = _.reduce(changes[key],
                        function(memo, item){
                            if(_.has(item, "id")){
                                return memo+item.id+",";
                            }else{
                                return memo+item+",";
                            }
                        }, "");
                }
                if(_.has(changes[key], "id")){
                    changes[key] = changes[key].id;
                }
                if(_.isEmpty(changes[key])){
                    if(!_.contains([true, false], changes[key])){
                        delete changes[key];
                    }
                }
                try{
                    if(changes[key][changes[key].length-1]===","){
                        changes[key] = changes[key].substring(0, changes[key].length-1);
                    }
                }catch(error){}

            });
            return changes;
        };
        // pre-select filters
        var setFilters = function(){
            _.each(_.keys($stateParams), function(key){
                if(!_.isUndefined($stateParams[key])){
                    if(_.contains(_.keys($scope.filter), key)){
                        var res = _.findWhere($scope.filter[key], {id:$stateParams[key]});
                        if(_.isEmpty(res)){
                            $scope.filter[key].push({id:$stateParams[key]});
                        }else{
                            $scope.filter[key] = {id:$stateParams[key]};
                        }

                    }else{
                        $scope.filter[key] = $stateParams[key];
                    }
                }

            });
            // child pre-select filters
            _.each(_.keys($stateParams), function(key){
                if(_.contains(["county", "constituency"], key)){
                    if(!_.isUndefined($stateParams[key])){
                        switch(key){
                        case "county":
                            getChildren(
                                filterApi.constituencies,
                                "constituency",
                                {"county": $stateParams[key]});
                            break;
                        case "constituency":
                            getChildren(
                                    filterApi.wards,
                                    "ward",
                                    {"constituency": $stateParams[key]});
                            break;
                        }
                    }
                }
            });
            if(!_.isEmpty($scope.filter.ward)){
                getChildren(filterApi.wards, "ward",
                    {id: constructParams($scope.filter.ward).join(",")});
            }
        };
        setFilters();

        $scope.filterFacility = function(){
            var changes= constructParams($scope.filter);
            if(!_.isEmpty(changes)){
                if(_.has(changes, "ward")){
                    delete changes.county;
                    delete changes.constituency;
                }else{
                    if(_.has(changes, "constituency")){
                        delete changes.county;
                    }
                }
                changes.search = $stateParams.search;
                changes = removeEmptyFilters(changes);
                filterApi.facilities.filter(changes).success(function(data){
                    $scope.search_results = false;
                    $scope.query_results = data.results;
                    if($scope.query_results.length === 0) {
                        $scope.no_result = true;
                    }
                }).error(function(error){
                    $scope.alert = error.error;
                    $scope.err = error.error;
                    $scope.search_results = false;
                });
            }
        };
        //exporting to excel functionality
        $scope.excelExport = function () {
            console.log("Called");
            $scope.excel_filters = {
                search : $stateParams.search,
                format : "excel"
            };
            facilitiesApi.facilities.filter($scope.excel_filters)
                .success(function (data) {
                    console.log(data, downloadApi);
                    window.location.href =
                    "http://localhost:8061/api/common/download/download/xlsx/";
                })
                .error(function (e) {
                    console.log(e.error);
                });
        };
    }]);
})(angular);
