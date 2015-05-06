"use strict";

(function(angular){
    angular.module("mfl.gis.counties.wrapper", ["sil.api.wrapper"])
    .provider("gisCountiesApi", function(){
        var self = this;
        self.baseUrl = "/api/gis/county_boundaries/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);