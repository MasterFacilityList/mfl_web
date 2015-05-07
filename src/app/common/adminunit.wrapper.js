"use strict";

(function(angular){
    angular.module("mfl.counties.wrapper", ["sil.api.wrapper"])
    .provider("countiesApi", function(){
        var self = this;
        self.baseUrl = "api/common/counties";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
    angular.module("mfl.constituencies.wrapper", ["sil.api.wrapper"])
    .provider("constituenciesApi", function(){
        var self = this;
        self.baseUrl = "api/common/constituencies";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
    angular.module("mfl.wards.wrapper", ["sil.api.wrapper"])
    .provider("wardsApi", function(){
        var self = this;
        self.baseUrl = "api/common/wards";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
    angular.module("mfl.towns.wrapper", ["sil.api.wrapper"])
    .provider("townsApi", function(){
        var self = this;
        self.baseUrl = "api/common/towns";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);