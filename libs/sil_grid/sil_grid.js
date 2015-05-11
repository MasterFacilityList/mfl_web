"use strict";
(function(angular, _){
    var PAGINATION_TPL = "sil.grid.pagination.tpl.html";
    var SEARCH_TPL = "sil.grid.search.tpl.html";
    angular.module("sil.grid",[
            PAGINATION_TPL,
            SEARCH_TPL,
            "ui.bootstrap"
        ]
    )
    .provider("silGridConfig", function(){
        /**
            apiMaps example:
            this.apiMaps = {
                claim: ["sil.claimApi.wrapper", "claimsApi"],
                visit: ["sil.encountersApi.wrapper", "encountersApi"],
                preauth: ["sil.preauthApi.wrapper", "preauthApi"]
            };

        **/
        this.apiMaps = {};
        this.appConfig = "providerConfig";
        this.itemsPerPage = 25;
        this.$get = [function(){
            return {
                apiMaps: this.apiMaps,
                appConfig: this.appConfig,
                bp: this.bp,
                itemsPerPage: this.itemsPerPage
            };
        }];
    })
    .directive("silGridPagination", [function(){
        return {
            require: "^silGrid",
            restrict: "EA",
            templateUrl: PAGINATION_TPL
        };
    }])
    .directive("silGrid",["$parse","$rootScope","$modal", "silGridConfig",
               function($parse, $rootScope, $modal, silGridConfig){
        return {
            restrict: "EA",
            scope: {
                filters:"=",
                gridFor: "@",
                data: "@",
                error: "=",
                actions: "=",
                apiKey: "@"
            },
            replace: false,
            templateUrl:function(elem, attrs){
                return attrs.template;
            },
            controller: function($scope){
                var self = this;
                $scope.pagination = {};
                var apiMaps = silGridConfig.apiMaps;
                if(!_.has(apiMaps, $scope.gridFor)){
                    throw "Must specify the grid for";
                }
                var api_conf = apiMaps[$scope.gridFor];
                var api = angular.injector(
                    ["ng",silGridConfig.appConfig, api_conf[0]]).get(api_conf[1]);

                if(!_.isUndefined($scope.apiKey)) {
                        self.api = api[$scope.apiKey];
                }else{
                    self.api = api.api;
                }
                self.setLoading = function(start){
                    if(start){
                        $scope.$emit("silGrid.loader.start");
                    }else{
                        $scope.$emit("silGrid.loader.stop");
                    }
                };
                self.getData = function(){
                    self.setLoading(true);
                    var promise;
                    if(_.isUndefined($scope.filters)){
                        promise = self.api.list();
                    }else{
                        promise = self.api.filter($scope.filters);
                    }
                    promise.success(self.setData).error(self.setError);
                };
                self.setData = function(data){
                    self.setLoading(false);
                    if(_.has(data, "results")){
                        $scope[$scope.data] = data.results;
                        addPagination(data.count, data.next, data.previous);
                    }else{
                        $scope[$scope.data] = data;
                        $scope.pagination.active = false;
                    }
                    $scope.$apply();
                };

                self.showError = function(error){
                    return {
                        title: "Error",
                        type:"danger",
                        msg: error.error
                    };
                };
                self.setError = function(error){
                    self.setLoading(false);
                    $scope.error = self.showError(error);
                    $scope.$apply();
                };

                var initFilters = function(){
                    if(_.isUndefined($scope.filters)){
                        $scope.filters = {};
                    }
                };
                self.addFilter = function(name, value){
                    initFilters();
                    $scope.filters[name] = value;
                    if(_.has($scope.filters, "page")){
                        $scope.dump = {page: $scope.filters.page};
                        $scope["q_dump"+name] = {page: $scope.filters.page};
                        delete $scope.filters.page;
                    }
                    self.getData();
                };
                self.removeFilter = function(name){
                    if(_.has($scope.filters, name)){
                        delete $scope.filters[name];
                        if(_.has($scope.dump, "page")){
                            if(name === "q_dump"+name){
                                $scope.filters.page = $scope["q_dump"+name].page;
                            }else{
                                $scope.filters.page = $scope.dump.page;
                            }

                        }
                        self.getData();
                    }
                };
                $scope.getData = self.getData;
                $scope.setLoading = self.setLoading;
                var addPagination = function(page_count, url_next, url_prev){
                    $scope.pagination.active = true;
                    $scope.pagination.page_count = Math.ceil(page_count/silGridConfig.itemsPerPage);
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
                    if(_.isUndefined($scope.filters)){
                        $scope.filters = {};
                    }
                    $scope.filters.page = page_count;
                    $scope.getData();
                };
            },
            link: function(scope){
                scope.$watch("filters", function(filters){
                    if(_.has(filters, "page")||
                       _.has(filters, "ordering")||_.has(filters, "search")){

                        delete filters.page;
                    }else{
                        scope.getData();
                    }
                });
                $rootScope.$on("silGrid.data.refresh", function(event){
                    event.stopPropagation();
                    scope.getData();
                });
                _.each(scope.actions, function(action){
                    scope[action.name] = $parse(action.actionFunction);
                });
                var modal;
                $rootScope.$on("silGrid.loader.start", function(event){
                    modal = $modal.open(
                        {
                            template:"<div>"+
                                    "<div class='modal-body'>Please wait.."+
                                    "<div class='panel-loader'>"+
                                    "<div class='loader-container'>"+
                                        "<div class='loader-spinner'></div>"+
                                    "</div>"+
                                    "</div>"+
                            "</div></div>",
                            backdrop: "static",
                            keyboard: false,
                            size: "sm",
                            windowClass: "sil-grid-loader"
                        });
                    event.stopPropagation();
                });

                $rootScope.$on("silGrid.loader.stop", function(event){
                    modal.close();
                    event.stopPropagation();
                });

            }
        };
    }])
    .directive("silGridSearch", function(){
        return {
            restrict: "EA",
            require: "^silGrid",
            templateUrl: SEARCH_TPL,
            link: function(scope, elem, attrs, gridCtrl){
                scope.silGrid = {searchQuery:""};
                scope.silGridSearch = function(clear){
                    if(clear){
                        scope.silGrid.searchQuery = "";
                        gridCtrl.removeFilter("search");
                    }else{
                         gridCtrl.addFilter("search", scope.silGrid.searchQuery);
                    }

                };
            }
        };

    })
    .directive("silGridSort",["$rootScope", function($rootScope){
        return {
            restrict : "A",
            require: "^silGrid",
            scope: {
                field: "@"
            },
            link: function($scope, elem, attrs, gridCtrl){
                elem.addClass("sil-orderable");
                if(_.isUndefined($rootScope.sil_orderings)){
                    $rootScope.sil_orderings  = {};
                }
                elem.on("click", function(){
                    if(elem.hasClass("sil-orderable")){
                        // assume default ordering is asceding
                        elem.removeClass("sil-orderable");
                        elem.addClass("sil-orderable-desc");
                        //order desc
                        $rootScope.sil_orderings[$scope.field] = "desc";
                    }else{
                        //if ordered asc, order desc
                        if(elem.hasClass("sil-orderable-desc")){
                            elem.removeClass("sil-orderable-desc");
                            elem.addClass("sil-orderable-asc");
                            // order asc
                            $rootScope.sil_orderings[$scope.field] = "asc";
                        }else{
                            elem.removeClass("sil-orderable-asc");
                            elem.addClass("sil-orderable-desc");
                            //order desc
                            $rootScope.sil_orderings[$scope.field] = "desc";
                        }
                    }
                    var orderKeys="";
                    _.each(_.keys($rootScope.sil_orderings), function(key, index){
                        var sortkey = $rootScope.sil_orderings[key] === "asc"?key: "-"+key;
                        if(index===0){
                            orderKeys = sortkey;
                        }else{
                            orderKeys += ","+sortkey;
                        }
                    });
                    gridCtrl.addFilter("ordering", orderKeys);
                });
            }
        };
    }])
    ;
})(angular, _);
