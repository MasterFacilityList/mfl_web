"use strict";

angular.module("mfl.facilities.wrapper", ["sil.api.wrapper", "mfl.settings"])

    .service("facilitiesApi", ["api", function (api) {
        this.facilities = api.setBaseUrl("api/facilities/facilities/");
        this.services = api.setBaseUrl("api/facilities/services");
    }])
    .service("downloadApi", ["$http", "SERVER_URL", function ($http, SERVER_URL) {
        var request_uri = SERVER_URL;
        var url = "api/common/download/download/xlsx/";
        this.downLoad = function () {
            return $http.get(request_uri + url);
        };
    }])
    .service("searchService", ["mfl.common.providers.requests", "sil-typeahead",
        function (requests,typeahead) {
            var uri_list = {
                facilities : "api/facilities/facilities/"
            };
            var initDoctors = function () {
                return typeahead.initTT(
                    "facilities",
                    "Name",
                    requests.makeUrl(uri_list.facilities),
                    15
                );
            };
            this.typeaheadDoctors = function (fieldclass) {
                var f = initDoctors();
                //call the init function you created above
                var name = fieldclass || "facilities";
                //just incase its not sepecified
                typeahead.typeaheadUI(name, {
                //call the typeadUI function
                    displayKey: "Name",
                    //the name of the field in your results to be displayed
                    source: f.ttAdapter()
                    //standard to access the source from the adapter object
                });
            //}
            };
        }]);
