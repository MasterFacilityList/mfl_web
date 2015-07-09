(function(angular){
    "use strict";
    angular.module("mfl.gis.wrapper", ["sil.api.wrapper"])
    .provider("gisCountriesApi", function(){
        var self = this;
        self.baseUrl = "api/gis/country_borders/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("gisCountiesApi", function(){
        var self = this;
        self.baseUrl = "api/gis/county_boundaries/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("gisConstsApi", function(){
        var self = this;
        self.baseUrl = "api/gis/constituency_boundaries/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("gisWardsApi", function(){
        var self = this;
        self.baseUrl = "api/gis/ward_boundaries/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("gisFacilitiesApi", function(){
        var self = this;
        self.baseUrl = "api/gis/coordinates/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .service("gisAdminUnitsApi", ["$localForage","$http","$q","SERVER_URL", "api",
        function ($localForage, $http, $q, server_url, api) {
        // var country_border = api.setBaseUrl("api/gis/country_borders/");
        var counties = api.setBaseUrl("api/gis/county_boundaries/");
        // var constituencies = api.setBaseUrl("api/gis/constituency_boundaries/");
        // var wards = api.setBaseUrl("api/gis/ward_boundaries/");
        // var facilities = api.setBaseUrl("api/gis/coordinates/");

        this.getCounties = function () {
            var deferred = $q.defer();

            var success_fxn = function (keyName) {
                if(_.isNull(keyName)){
                    counties.list()
                    .success(function (data) {
                        deferred.resolve(data);
                        $localForage.setItem("mflApp.counties", data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                } else {
                    var success_fn =  function(data){
                        deferred.resolve(data);
                    };
                    $localForage.getItem("mflApp.counties").then(success_fn);
                }
            };

            $localForage.key(0).then(success_fxn);
            return deferred.promise;
        };
    }]);
})(angular);
