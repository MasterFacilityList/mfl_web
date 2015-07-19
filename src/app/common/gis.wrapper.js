(function(angular){
    "use strict";
    angular.module("mfl.gis.wrapper", ["api.wrapper"])

    .service("gisAdminUnitsApi", ["$localForage","$http","$q","SERVER_URL", "api",
        function ($localForage, $http, $q, server_url, api) {
            var self = this;
            self.country_border = api.setBaseUrl("api/gis/country_borders/");
            self.counties = api.setBaseUrl("api/gis/county_boundaries/");
            self.constituencies = api.setBaseUrl("api/gis/constituency_boundaries/");
            self.wards = api.setBaseUrl("api/gis/ward_boundaries/");
            self.facilities = api.setBaseUrl("api/gis/coordinates/");

            this.getCounties = function () {
                var deferred = $q.defer();

                var success_fxn = function (keyName) {
                    if(_.isNull(keyName)){
                        self.counties.list()
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
})(angular);
