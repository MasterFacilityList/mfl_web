(function(angular){
    angular.module("mfl.adminunits.wrapper", ["sil.api.wrapper"])
    .provider("countiesApi", function(){
        var self = this;
        self.baseUrl = "api/common/counties/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("constsApi", function(){
        var self = this;
        self.baseUrl = "api/common/constituencies/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("wardsApi", function(){
        var self = this;
        self.baseUrl = "api/common/wards/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("townsApi", function(){
        var self = this;
        self.baseUrl = "api/common/towns/";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);