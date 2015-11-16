(function(angular, _){
    "use strict";
    angular.module("mfl.gis.wrapper", ["api.wrapper"])

    .service("gisAdminUnitsApi", ["$localForage","$http","$q","SERVER_URL", "api",
        function ($localForage, $http, $q, server_url, api) {
            var self = this;
            self.country = api.setBaseUrl("api/gis/drilldown/country/");
            self.county = api.setBaseUrl("api/gis/drilldown/county/");
            self.constituency = api.setBaseUrl("api/gis/drilldown/constituency/");
            self.ward = api.setBaseUrl("api/gis/drilldown/ward/");
            self.facilities = api.setBaseUrl("api/gis/drilldown/facility/");
            this.getCounties = function () {
                var deferred = $q.defer();

                var success_fxn = function (keyName) {
                    if(_.isNull(keyName)){
                        self.country.list()
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
            this.getFacCoordinates = function (){
                var deferred = $q.defer();
                var success_fn = function (keyName) {
                    if(_.isNull(keyName)){
                        self.facilities.list()
                        .success(function (data) {
                            deferred.resolve(data);
                            $localForage.setItem("mflApp.gis_facilities", data);
                        })
                        .error(function (error) {
                            deferred.reject(error);
                        });
                    } else {
                        var success_fxn = function (data){
                            deferred.resolve(data);
                        };
                        $localForage.getItem("mflApp.gis_facilities").then(success_fxn);
                    }
                };
                $localForage.key(1).then(success_fn);
                return deferred.promise;
            };
        }
    ]);
})(window.angular, window._);
