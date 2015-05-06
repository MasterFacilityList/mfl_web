"use strict";

(function(angular){
    angular.module("mfl.gis.consts.wrapper", ["sil.api.wrapper"])
    .provider("gisContsApi", function(){
        var self = this;
        self.baseUrl = "/api/gis/constituency_boundaries/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);