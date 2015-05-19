"use strict";
(function(angular){
    angular.module("mfl.filtering.controllers", [
        "mfl.filtering.services",
        "mflAppConfig"
    ])
    .controller("mfl.filtering.controller", ["$scope","$rootScope",
        "$stateParams", "filteringApi","filteringData", "SERVER_URL",
        "$window",
        function($scope, $rootScope, $stateParams,filterApi,
            filteringData,SERVER_URL, $window){
        $scope.filter_data = {};
        $scope.query_results = [];
        var initFilterModel = function(){
            $scope.filter = $stateParams;
        };
        initFilterModel();
        //initializing the counter
        $scope.counter = {
            hits : "",
            prev : "",
            next : ""
        };
        //end of initializing the counter
        $scope.filter = {
            county: [],
            constituency: [],
            ward: [],
            operation_status: [],
            facility_type: [],
            number_of_beds: [],
            number_of_cots: []
        };
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
                        getChildren(
                            api,
                            label,_.isEmpty(fs)?{}:pass_filter);
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

        var setNoResult = function(res){
            if(res === 0) {
                $scope.no_result = true;
            }
        };
        if(_.isEmpty($stateParams) || _.isUndefined($stateParams.search)){
            filterApi.facilities.list().success(function(res){
                $scope.search_results = false;
                $scope.query_results = res.results;
                setNoResult($scope.query_results.length);
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
                setNoResult($scope.query_results.length);
            }).error(function(err){
                $scope.search_results = false;
                $scope.alert = err.error;
            });
        }
        //end of search results listung
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
        var addFilter = function(key, value){
            var vals = value.split(",");
            if(_.isUndefined($scope.filter[key])){
                $scope.filter[key] = [];
            }
            _.each(vals, function(val){
                $scope.filter[key].push({id: val});
            });
        };
        // pre-select filters
        var setFilters = function(){
            _.each(_.keys($stateParams), function(key){
                if(!_.isUndefined($stateParams[key])){
                    addFilter(key, $stateParams[key]);
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

        $scope.filterFacility = function(filters){
            var changes= constructParams(filters);
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
                    if(_.has(filters, "format")){
                        $window.location.href =
                            SERVER_URL + "api/common/download/download/xlsx/";
                        delete $scope.filter.format;
                    }else{
                        $scope.search_results = false;
                        $scope.query_results = data.results;
                        setNoResult($scope.query_results.length);
                    }

                }).error(function(error){
                    $scope.alert = error.error;
                    $scope.err = error.error;
                    $scope.search_results = false;
                });
            }
        };

        $scope.class = {
            small : "menu",
            large : "displaced"
        };
        if(_.isUndefined($stateParams.search)) {
            $scope.no_search_query = false;
        }
        else{
            $scope.no_search_query = true;
        }

        //exporting to excel functionality
        $scope.excelExport = function () {
            $scope.filter.format = "excel";
            $scope.filterFacility($scope.filter);
        };
    }]);
})(angular);