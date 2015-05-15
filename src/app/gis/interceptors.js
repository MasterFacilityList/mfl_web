// (function (angular) {
//     "use strict";
//     angular

//     .module("mfl.gis.interceptors", [])

//     // register the interceptor as a service
//     .factory("mfl.gis.interceptors.gis_boundaries",
//         ["$q", "SERVER_URL", "GIS_URLS",
//         function ($q, server_url, gis_urls) {
//             return {
//                     "response": function(response) {
//                         for (var i = 0; i < gis_urls.length; i++) {
//                             if (response.config.url.startsWith(server_url + gis_urls[i])) {
//                                 response.data = response.data.results;
//                                 break;
//                             }
//                         }
//                         return response;
//                     }
//                 };
//         }
//     ])

//     .config(["$httpProvider", function($httpProvider) {
//         $httpProvider.interceptors.push("mfl.gis.interceptors.gis_boundaries");
//     }])

//     .constant("GIS_URLS", [
//         "api/gis/county_boundaries/",
//         "api/gis/constituency_boundaries/",
//         "api/gis/ward_boundaries/"
//     ]);

// })(angular);
