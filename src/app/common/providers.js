"use strict";

angular
    .module("mfl.common.providers", ["mfl.settings"])

    .provider("mfl.common.providers.requests", function () {
        this.$get = ["$http", "SERVER_URL", function ($http, SERVER_URL) {
            return {
                api_url: SERVER_URL,

                makeUrl: function (uri_fragment) {
                    return this.api_url + uri_fragment;
                },

                callApi: function (method, uri_fragment, data) {
                    if (["GET", "POST", "DELETE", "PATCH"].indexOf(method) === -1){
                        throw "HTTP method: " + method + " not supported";
                    }
                    var url = this.makeUrl(uri_fragment);
                    var http_options = {
                        url: url,
                        method: method
                    };
                    if (!_.isUndefined(data)) {
                        if (method === "GET") {
                            var params = this.makeParams(data);
                            http_options.url += "?";
                            http_options.url += params;
                        } else if (method !== "DELETE") {
                            http_options.data = data;
                        }
                    }
                    return $http(http_options);
                },
                /**
                 * usage:
                 * var t = [{"name":"q", "value":"text"}, {"name":"p", "value":"te"}]
                 * var y = makeParams(t)
                 * // returns q=text&p=te
                 */
                makeParams: function (filters) {
                    if (_.isUndefined(filters)) {
                        throw "Filters not provided";
                    }
                    var query_parameters = [];

                    if (!_.isArray(filters)) {
                        throw "provided filters parameter is not an array";
                    }
                    for (var index = 0; index < filters.length; index++) {
                        var filter = filters[index];
                        if (_.isUndefined(filter) || _.isUndefined(filter.name) ||
                            _.isUndefined(filter.value)) {
                            throw "filter was incorrectly configured";
                        }
                        var query_param = filter.name + "=" + filter.value;
                        query_parameters.push(query_param);
                    }
                    return query_parameters.join("&");
                }

            };
        }];
    })

    //begining of provider interceptor
    .provider("myCSRF",[function(){
        var headerName = "X-CSRFToken";
        var cookieName = "csrftoken";
        var allowedMethods = ["GET"];
        this.$get = ["$cookies", function($cookies){
            return {
                "request": function(config) {
                    if(allowedMethods.indexOf(config.method) === -1) {
                        // do something on success
                        config.headers[headerName] = $cookies[cookieName];
                    }
                    return config;
                }
            };
        }];
    }]);
    //end of provider interceptor

