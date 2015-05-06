"use strict";

(function(angular){
    angular.module("mfl.gis.countries.wrapper", ["sil.api.wrapper"])
    .provider("gisCountriesApi", function(){
        var self = this;
        self.baseUrl = "/api/gis/country_borders/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);