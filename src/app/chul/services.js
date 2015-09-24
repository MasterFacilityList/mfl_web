(function(angular){
    "use strict";

    angular.module("mfl.chul.services", [
        "api.wrapper",
        "mfl.auth.service"
    ])

    .service("mfl.chul.services.wrappers",
        ["api", function(api) {
            this.chul = api.setBaseUrl("api/chul/units/");
        }]
    );

})(window.angular);
