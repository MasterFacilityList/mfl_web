"use strict";

(function(angular){
    angular.module("mfl.gis.wards.wrapper", ["sil.api.wrapper"])
    .provider("gisWardsApi", function(){
        var self = this;
        self.baseUrl = "/api/gis/ward_boundaries/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);