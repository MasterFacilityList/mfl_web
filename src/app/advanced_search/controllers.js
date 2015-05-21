
(function(angular,_){
    "use strict";
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
        //variable to id if  on search or facility listings view
        $scope.no_search_query = false;
        $scope.no_err = false;
        $scope.query_results = [];
        var initFilterModel = function(){
            $scope.filter = {
                search: "",
                county: [],
                constituency: [],
                ward: [],
                operation_status: [],
                service_category: [],
                facility_type: [],
                number_of_beds: [],
                number_of_cots: []
            };
        };
        initFilterModel();

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
            },
            service_category: {
                buttonDefaultText: "Select Service Category"
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
                        getChildren(api,label,filter);
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
        $scope.pagination = {};
        var addPagination = function(page_count, url_next, url_prev){
            $scope.pagination.active = true;
            $scope.pagination.page_count = Math.ceil(page_count/25);
            var makeParams = function(url, next){
                var params = url.substring(url.indexOf("?")+1, url.length).split("&");
                _.each(params, function(param){
                    var p = param.split("=");
                    if(param.indexOf("page")!==-1){
                        if(next){
                            $scope.pagination.next_page = p[1];
                        }
                        else{
                            $scope.pagination.prev_page = p[1];
                        }
                    }
                });
            };
            if(url_next){
                $scope.pagination.next=true;
                makeParams(url_next, true);
            }else{
                $scope.pagination.next = false;
                $scope.pagination.current_page = $scope.pagination.page_count;
            }
            if(url_prev){
                $scope.pagination.prev = true;
                if(url_prev.indexOf("page")=== -1){
                    url_prev = url_prev+"?page=1";
                }
                makeParams(url_prev, false);
            }else{
                $scope.pagination.prev = false;
                $scope.pagination.current_page = 1;
            }
            if($scope.pagination.next){
                $scope.pagination.current_page = $scope.pagination.next_page-1;
            }
        };
        $scope.paginate = function(page_count){
            $scope.filter.page = page_count;
            $scope.filterFacility($scope.filter);
        };

        var resolves = {
            startSpinner: function(){
                $scope.spinneractive = true;
            },
            stopSpinner: function(){
                $scope.spinneractive = false;
            },
            success: function(data){
                if(_.has($scope.filter, "format")){
                    $window.location.href =
                        SERVER_URL + "api/common/download/download/xlsx/";
                    delete $scope.filter.format;
                }else{
                    $scope.hits = data.count;
                    if($scope.hits >= 1) {
                        $scope.no_err = true;
                    }
                    else{
                        $scope.no_err = false;
                    }
                    addPagination(data.count, data.next, data.previous);
                    $scope.search_results = false;
                    $scope.query_results = data.results;
                    if($scope.query_results.length===0){
                        $scope.no_result = true;
                    }
                }
                resolves.stopSpinner();
            },
            error: function(err){
                $scope.alert = err.error;
                resolves.stopSpinner();
            }
        };
        resolves.startSpinner();
        _.each(["county", "operation_status", "constituency", "facility_type", "service_category"],
        function(key){
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
            $scope.no_search_query = true;
            filterApi.facilities.list().success(resolves.success).error(resolves.error);
        }else{
            $scope.query = $stateParams.search;
            var filters = removeEmptyFilters($stateParams);
            $scope.no_search_query = false;
            filterApi.facilities.filter(filters).success(resolves.success).error(resolves.error);
        }
        //end of search results listing
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
            if(!_.isArray($scope.filter[key])){
                $scope.filter[key] = value;
            }else{
                var vals = value.split(",");
                _.each(vals, function(val){
                    $scope.filter[key].push({id: val});
                });
            }

        };
        // pre-select filters
        var setFilters = function(){
            $stateParams = removeEmptyFilters($stateParams);
            _.each(_.keys($stateParams), function(key){
                addFilter(key, $stateParams[key]);
            });
            // child pre-select filters
            _.each(_.keys($stateParams), function(key){
                if(_.contains(["county", "constituency"], key)){
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
            });
            if(!_.isEmpty($scope.filter.ward)){
                getChildren(filterApi.wards, "ward",
                    {id: constructParams($scope.filter.ward).join(",")});
            }
        };
        setFilters();
        $scope.clearFilters = function(){
            initFilterModel();
            $scope.filterFacility($scope.filter);
        };
        $scope.filterFacility = function(filters){
            var changes= constructParams(filters);
            delete filters.page;
            resolves.startSpinner();
            if(!_.isEmpty(changes)){
                if(_.has(changes, "ward")){
                    delete changes.county;
                    delete changes.constituency;
                }else{
                    if(_.has(changes, "constituency")){
                        delete changes.county;
                    }
                }
                changes = removeEmptyFilters(changes);
                filterApi.facilities.filter(changes)
                    .success(resolves.success).error(resolves.error);
            }else{
                filterApi.facilities.list()
                    .success(resolves.success).error(resolves.error);
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
        //declaring offcanvas
        $scope.activate_offcanvas = false;
        $scope.offCanvas = function () {
            if(!$scope.activate_offcanvas) {
                $scope.activate_offcanvas = !$scope.activate_offcanvas;
            }
            else {
                $scope.activate_offcanvas = !$scope.activate_offcanvas;
            }
        };
    }]);
})(angular, _);
