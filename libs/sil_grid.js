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
                actions: "="
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
                self.api = api;
                self.setLoading = function(start){
                    if(start){
                        $scope.$emit("silGrid.loader.start");
                    }else{
                        $scope.$emit("silGrid.loader.stop");
                    }
                };
                self.getData = function(){
                    // self.setLoading(true);
                    var promise;
                    if(_.isUndefined($scope.filters)){
                        if(_.has($scope.filters, "page")){
                            delete $scope.filters.page;
                        }
                        promise = api.api.list();
                    }else{
                        promise = api.api.filter($scope.filters);
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
                        msg: error.error.$$unwrapTrustedValue()
                    };
                };
                self.setError = function(error){
                    self.setLoading(false);
                    $scope.error = self.showError(error);
                    $scope.$apply();
                };
                self.addFilter = function(name, value){
                    $scope.filters[name] = value;
                    if(_.has($scope.filters, "page")){
                        $scope.dump = {page: $scope.filters.page};
                        delete $scope.filters.page;
                    }
                    self.getData();
                };
                self.removeFilter = function(name){
                    if(_.has($scope.filters, name)){
                        delete $scope.filters[name];
                        if(_.has($scope.dump, "page")){
                            $scope.filters.page = $scope.dump.page;
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
                            }else{
                                $scope.filters[p[0]] = p[1];
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
                    console.log($scope.filters);
                    $scope.filters.page = page_count;
                    $scope.getData();
                };
            },
            link: function(scope){
                scope.$watch("filters", function(filters){
                    if(_.has(filters, "page")){
                        delete filters.page;
                    }
                    scope.getData();
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
                    console.log("loader started");
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
                    console.log("loader stoppped");
                    if(!_.isUndefined(modal)){
                        modal.close();
                        modal.dismiss();
                    }
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
                        gridCtrl.getData();
                    }else{
                        gridCtrl.setLoading(true);
                        gridCtrl.api.search(scope.silGrid.searchQuery).
                        success(gridCtrl.setData).error(gridCtrl.setError);
                    }

                };
            }
        };

    })
    ;
})(angular, _);
