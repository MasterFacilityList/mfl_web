(function (angular) {
    "use strict";
    angular.module("mflAppConfig", [
        "ui.router",
        "ngCookies",
        "sil.api.wrapper",
        "mfl.gis.interceptor"
    ])

    .constant("SERVER_URL", angular.copy(window.MFL_SETTINGS.SERVER_URL))

    .constant("CREDZ", angular.copy(window.MFL_SETTINGS.CREDZ))

    .config(["$urlRouterProvider", function ($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    }])

    .config(["$httpProvider",function ($httpProvider) {
        $httpProvider.interceptors.push("mfl.gis.interceptor.headers");
        $httpProvider.defaults.withCredentials = false;
        $httpProvider.defaults.headers.common = {
            "Content-Type":"application/json",
            "Accept" : "application/json, */*"
        };
    }])

    .run(["$http","$cookies","$rootScope","$state","$stateParams",
          function ($http, $cookies,$rootScope,$state,$stateParams) {
        // apparently the angular doesn"t do CSRF headers using
        // CORS across different domains thereby this hack
        var csrftoken = $cookies.csrftoken;
        var header_name = "X-CSRFToken";
        $http.defaults.headers.common[header_name] = csrftoken;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
})(angular);
