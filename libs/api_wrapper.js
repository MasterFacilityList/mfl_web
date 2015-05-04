"use strict";
(function(angular, _){
    angular.module("sil.api.wrapper", [])
    // CRUD API wrapper to be used by specific API wrappers

    .provider("apiConfig", function(){
        this.SERVER_URL = undefined;
        this.SNOMED_URL = undefined;
        this.$get = [function(){
            return {
                SERVER_URL: this.SERVER_URL,
                SNOMED_URL: this.SNOMED_URL
            };
        }];
    })
    .provider("api", function(){
        function Helpers(){}
        Helpers.prototype.hasTrailingSlash = function(url){
            // check ir url has a trailing slash
            if(url[url.length-1]==='/'){
                return true;
            }
            return false;
        };
        Helpers.prototype.hasLeadingSlash = function(url){
            // check ir url has a trailing slash
            if(url[0]==='/'){
                return true;
            }
            return false;
        };
        Helpers.prototype.removeTrailingSlash = function(url){
            // remove trailing slash from url
            if (this.hasTrailingSlash(url)){
                return url.substring(0, url.length-1);
            }
            return url;
        };
        Helpers.prototype.removeLeadingSlash = function(url){
            // remove trailing slash from url
            if (this.hasLeadingSlash(url)){
                return url.substring(1, url.length);
            }
            return url;
        };
        Helpers.prototype.removeSlashes = function(url){
            return this.removeTrailingSlash(this.removeLeadingSlash(url));
        };
        Helpers.prototype.joinUrl = function(url_frags){
            /**
                Given a list of url fragments, return concatenated url fragment
            */
            var self = this;
            return _.reduce(url_frags, function(memo, url_frag){
                return self.removeSlashes(memo) +"/"+ self.removeSlashes(url_frag);
            }, "");
        };
        Helpers.prototype.makeParams = function(filters){
            var url_frags = [];
            _.each(_.keys(filters), function(key){
                url_frags.push(key+"="+filters[key]);
            });
            return url_frags.join("&");
        };

        Helpers.prototype.makeGetParam = function(url_param){
            return "?"+url_param;
        };
        this.helpers = new Helpers();
        this.$get = ["$http","apiConfig",  function($http, apiConfig){
            var self = this;
            self.SERVER_URL = apiConfig.SERVER_URL;
            self.SNOMED_URL = apiConfig.SNOMED_URL;
            function Api(){}
            Api.apiUrl = self.SERVER_URL;
            Api.snomedUrl = self.SNOMED_URL;
            Api.apiBaseUrl = undefined;
            Api.prototype.setBaseUrl = function(url){
                this.apiBaseUrl = url;
                return this;
            };
            Api.prototype.callApi = function(method, url, data){
                /***
                    Calls backend api.
                    returns a promise
                **/
                var options = {
                    url: url,
                    method: method
                };
                if(!_.isUndefined(data)){
                    options.data = data;
                }
                return $http(options);
            };
            Api.prototype.makeUrl = function(url_fragment, is_snomed){
                //createUrl
                var base_url = _.isUndefined(is_snomed)?self.SERVER_URL: self.SNOMED_URL;
                if(is_snomed && _.isUndefined(self.SNOMED_URL)){
                    throw "SNOMED_URL not set";
                }
                if(_.isUndefined(self.SERVER_URL)){
                    throw ("SERVER_URL not set");
                }
                var urls = [
                    self.helpers.removeTrailingSlash(base_url),
                    self.helpers.removeTrailingSlash(url_fragment)
                ];
                return urls.join("/")+"/";

            };
            Api.prototype.create = function(data){
                return this.callApi("POST", this.makeUrl(this.apiBaseUrl), data);
            };
            Api.prototype.update = function(id, data){
                var url_frag = self.helpers.joinUrl([this.apiBaseUrl, id]);
                return this.callApi("PATCH", this.makeUrl(url_frag), data);
            };
            Api.prototype.list = function(){
                return this.callApi("GET", this.makeUrl(this.apiBaseUrl));
            };
            Api.prototype.get = function(id){
                var url_frag =  self.helpers.joinUrl([this.apiBaseUrl, id]);
                return this.callApi("GET", this.makeUrl(url_frag));
            };
            Api.prototype.remove = function(id){
                var url_frag = self.helpers.joinUrl([this.apiBaseUrl, id]);
                return this.callApi("DELETE", this.makeUrl(url_frag));
            };
            /**
                filter params in the format:
                {key: value, key2: value2}
            */
            Api.prototype.filter = function(filter_params){
                var params_url_frag = self.helpers.makeParams(filter_params);
                var url = self.helpers.joinUrl([
                    this.makeUrl(this.apiBaseUrl),
                    self.helpers.makeGetParam(params_url_frag)]);
                return this.callApi("GET", url);

            };
            Api.prototype.search = function(url_frag, search_term){
                var filter_param = {"q": search_term};
                var params_url_frag = self.helpers.makeParams(filter_param);
                var url = self.helpers.joinUrl([
                    this.makeUrl("search"),
                    url_frag,
                    self.helpers.makeGetParam(params_url_frag)]);
                return this.callApi("GET", url);
            };
            Api.prototype.snomedSearch = function(search_term){
                var filter_param = self.helpers.makeParams({"q": search_term});
                var url = self.helpers.joinUrl([
                    this.makeUrl(this.apiBaseUrl, true),
                    self.helpers.makeGetParam(filter_param)
                ]);
                return this.callApi("GET", url);
            };
            return {
                setBaseUrl: function(url){
                    var api = new Api();
                    api.setBaseUrl(url);
                    return api;
                },
                validators: (function(){
                    var fxns = {
                        args: function(req, passd){
                            if(req!==passd){
                                throw "Invalid function call";
                            }
                        },
                        empty: function(obj){
                            _.each(_.keys(obj), function(key){
                                var val = obj[key];
                                if(_.isUndefined(val)||val===""||_.isEmpty(obj)){
                                    throw key+ ' is required';
                                }
                            });
                        },
                        required: function(what, obj_list, required_list){
                            if(obj_list.length===0){
                                throw what+" cannot be empty list";
                            }
                            _.each(obj_list, function(obj){
                                _.each(required_list, function(req){
                                    if(!_.has(obj, req)){
                                        throw what+" : "+req+ ' is required';
                                    }
                                    fxns.empty(obj);
                                });
                            });
                        }
                    };
                    return fxns;
                })()
            };
        }];
    });
})(angular, _);
