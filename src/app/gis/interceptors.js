angular
    .module("mfl.gis.interceptors", [])

// register the interceptor as a service
    .factory("gisInterceptor", ["$q", "SERVER_URL", function ($q, server_url) {
        return {
                "response": function(response){
//                    console.log(response);
                    if (response.config.url.startsWith(server_url + "api/gis/county_boundaries/")) {
//                        console.log(response);
                        response.data = response.data.results;
                    }
                    if (response.config.url.startsWith(server_url +
                               "api/gis/constituency_boundaries/")) {
                        response.data = response.data.results;
                    }
                    return response;
                },
                "responseError": function(rejection){
                    return $q.reject(rejection);
                }
            };
    }])

    .config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push("gisInterceptor");
}]);