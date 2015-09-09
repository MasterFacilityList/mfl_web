(function (angular) {

    "use strict";

    angular.module("mflAppConfig", [
        "ui.router",
        "api.wrapper",
        "mfl.common.interceptors",
        "LocalForageModule"
    ])

    .constant("SERVER_URL", angular.copy(window.MFL_SETTINGS.SERVER_URL))

    .constant("CREDZ", angular.copy(window.MFL_SETTINGS.CREDZ))

    .constant("LAST_UPDATE", angular.copy(window.MFL_SETTINGS.last_update))

    .constant("DB_NAME", angular.copy(window.MFL_SETTINGS.db_name))

    .config(["$urlRouterProvider", function ($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    }])

    .config(["$localForageProvider", "DB_NAME", function($localForageProvider, DB_NAME) {
        $localForageProvider.config({
            "name": DB_NAME // name of the database and prefix for your data
        });
    }])
    .config(["$httpProvider",function ($httpProvider) {
        $httpProvider.interceptors.push("mfl.common.interceptors.headers");
        $httpProvider.interceptors.push("mfl.common.interceptors.auth");
        $httpProvider.defaults.withCredentials = false;
        $httpProvider.defaults.headers.common = {
            "Content-Type":"application/json",
            "Accept" : "application/json, */*"
        };
    }]);

})(window.angular);
