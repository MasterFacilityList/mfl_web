(function(angular){
    "use strict";
    angular
    .module("mfl.gis", [
        //3rd party modules
        "ui.router",
        //mfl application modules
        "mfl.gis_country.controllers",
        "mfl.gis_county.controllers",
        "mfl.gis_const.controllers",
        "mfl.gis_ward.controllers",
        "mfl.common.controllers",
        "mfl.gis.routes",
        "mfl.common.directives"
    ]);
})(angular);