(function(angular){
    "use strict";
    angular.module("mfl.gis", [
        "ui.router",
        "mfl.gis_country.controllers",
        "mfl.gis_county.controllers",
        "mfl.gis_const.controllers",
        "mfl.gis_ward.controllers",
        "mfl.gis.routes"
    ]);
})(angular);
