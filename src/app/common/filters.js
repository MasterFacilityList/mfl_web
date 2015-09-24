(function (angular) {
    "use strict";

    angular.module("mfl.common.filters", [])

    .filter("titlecase", function() {
        return function (input) {
            var smallWords = /^(a|an|am|and|as|at|but|by|for|in|nor|of|on|or|per|the|to?\.?|via)$/i;
            input = ( input === undefined || input === null ) ? "" : input;
            input = (input.toString()).toLowerCase();
            return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,
                function(match, index, title) {
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                    (title.charAt(index + match.length) !== "-" ||
                     title.charAt(index - 1) === "-") &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }

                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        };
    })
    .filter("dateFilter", ["$filter", function ($filter) {
        return function (input) {
            return $filter("date")(input, "EEE, dd-MM-yyyy");
        };
    }]);
})(window.angular);
