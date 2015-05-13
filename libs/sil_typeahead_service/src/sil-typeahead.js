(function(angular) {

"use strict";

angular.module('sil-typeahead', ['sil.api.wrapper'])

    .provider('searchApi', function(){
        this.$get = ["api", function(api){
            return {
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })

    .service('sil-typeahead', [function () {

        var tt = {}; //holds the bloodhound adapters
        window.TT = tt;
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
         * @returns {*}
         */
        this.initTT = function (name, tokenize_field, search_url, limit) {
            var tt_adapter = tt[name];
            var tt_limit = limit || 10;
            if (_.isUndefined(tt_adapter)) {
                tt_adapter = new Bloodhound({
                    datumTokenizer: function (d) {
                        return Bloodhound.tokenizers.whitespace(d[tokenize_field]);
                    },
                    limit: tt_limit,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: search_url,
                        filter: function (results) {
                            if(results.hasOwnProperty("hits")){
                                return (results.hits);
                            }
                            return results;
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
                $(event.target).trigger('input');
            },
            getSelector : function (classname) {
                return $('.' + classname + ':not(\'.tt-hint\'):not(\'.tt-input\')');
            }
        };
        /***
         * Function to assemble the snomed search url
         * Takes the following params
         * @param searchType (@string two options <full or autocomplete>)
         * @param shortcut (@string find the full list in the snomed Server docs)
         * @param filters
                - (@list of objects eg [{name:"parents",value: "233232,242423"}])
                - the 'value' can contain a comma separated list of SCTIDs;

         * @returns search query string
         * It is up to the creator of the search query to config the
         * search filters and pass them to the function
         */
        this.snomedQuery = function (searchType, shortcut, filters) {
            var query;
            var q = [];
            //function to compile filters
            function filtersPush(filters){
                for (var index = 0; index < filters.length; index++) {
                    var filter = filters[index];

                    if (  _.isUndefined(filter) ||
                          _.isUndefined(filter.name) ||
                          _.isUndefined(filter.value)) {
                        throw 'filter was incorrectly configured: ' + JSON.stringify(filter);
                    }
                    var query_param = filter.name + '=' + filter.value;
                    q.push(query_param);
                }
            }
            /**
             * If searchType is autocomplete, the query will look like
             * search/autocomplete/<theShortCut>/?query=<theQuery>
             * e.g. search/autocomplete/disease/?query=malaria
             * You can also choose to specify filters
             * Filters should take the form
             *      [{name: "parent", value: "123123"}]
             * e.g search/autocomplete/disease/?query=malaria&parent=123123
             */
            if (searchType === 'autocomplete') {
                var header = 'autocomplete/';

                if (_.isUndefined(shortcut) || shortcut === '') {
                    throw 'shortcut should be provided';
                }
                if(!_.isUndefined(filters) && filters !== ''){
                    filtersPush(filters);
                    var _qstr = '/?query=%QUERY';
                    query = header + shortcut + _qstr + '&' + q.join('&');
                }
                if(_.isUndefined(filters) || filters === ''){
                    query = header + shortcut + '/?query=%QUERY';
                }
            }
            /**
             * If searchType is autocomplete, the query will look like
             * search/full/?query=<theQuery>&<filter>&<filter>
             * Filters should take the form
                - [{name: "parent", value: "123123"}]
             * eg search/full/?query=heart&parent=123123
             */

            if (searchType === 'full') {
                if (_.isUndefined(filters) || filters === '') {
                    throw 'Filters not provided';
                }
                filtersPush(filters);
                query = 'full/?query=%QUERY' + '&' + q.join('&');

            }
            return query;
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
                    highlight: true
                }, datasets)
                .on('typeahead:autocompleted', function (a, b, c) {
                    helpers.updateInput(a, b, c);
                })
                .on('typeahead:selected', function (a, b, c) {
                    helpers.updateInput(a, b, c);
                });
            return selector;
        };

    }]);
})(angular);
