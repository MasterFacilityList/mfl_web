(function(angular, _, Bloodhound) {

    "use strict";

    angular.module("mfl.common.typeahead", [])

    .service("mfl.typeahead", [function () {

        var tt = {}; //holds the bloodhound adapters
        var listeners = []; // holds the typeahead event listeners
        this.addListener = function (fxn) {
            listeners.push(fxn);
        };
        this.removeListener = function (fxn) {
            listeners = _.without(listeners, fxn);
        };
        this.delTT = function(name){
            var prev = tt[name];
            tt = _.omit(tt, name);
            return prev;
        };

        /**
         * Generic bloodhound initializer
         * @param name
         * @param tokenize_field
         * @param search_url
         * @param limit
         * @param recreate
         * @returns {*}
         */
        this.initTT = function (name, tokenize_field, search_url, limit, recreate) {
            var tt_adapter = tt[name];
            var tt_limit = limit || 10;
            if (_.isUndefined(tt_adapter) || recreate) {
                tt_adapter = new Bloodhound({
                    datumTokenizer: function (d) {
                        return Bloodhound.tokenizers.whitespace(d[tokenize_field]);
                    },
                    limit: tt_limit,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: search_url,
                        wildcard: "%QUERY",
                        transform: function (response) {
                            return response.results;
                        }
                    }
                });
            }
            tt_adapter.initialize();
            tt[name] = tt_adapter;
            return tt_adapter;
        };

        var helpers = {
            /**
             * Get typeahead input field
             * @param event
             * @param obj
             * @param dataset_name
             */
            updateInput : function (event, obj, dataset_name) {
                _.each(listeners, function (val) {
                    if (_.isFunction(val)) {
                        val(event, obj, dataset_name);
                    }
                });
                $(event.target).trigger("input");
            },
            getSelector : function (classname) {
                return $("." + classname + ":not('.tt-hint'):not('.tt-input')");
            }
        };

        /**
         * @param fieldclass Class of input[type='text']
         * @param datasets Array|Object
         */
        this.typeaheadUI = function (fieldclass, datasets) {
            var selector = helpers.getSelector(fieldclass);
            selector
                .typeahead({
                    minLength: 2,
                    highlight: true,
                    hint: true
                }, datasets)
                .on("typeahead:autocompleted", function (a, b, c) {
                    helpers.updateInput(a, b, c);
                })
                .on("typeahead:selected", function (a, b, c) {
                    helpers.updateInput(a, b, c);
                });
            return selector;
        };
    }]);
})(angular, _, window.Bloodhound);
