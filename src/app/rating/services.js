(function (angular) {
    "use strict";

    angular.module("mfl.rating.services", [])

    .service("mfl.rating.services.rating", ["$window", function ($window) {
        var storage = $window.localStorage;

        this.storeRating = function (rating_key, rating_value) {
            storage.setItem(rating_key, JSON.stringify(rating_value));
        };

        this.getRating = function (service_id) {
            var rate = JSON.parse(storage.getItem(service_id));
            return rate;
        };
    }]);
})(angular);
