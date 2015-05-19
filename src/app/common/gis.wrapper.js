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
    });
})(angular);