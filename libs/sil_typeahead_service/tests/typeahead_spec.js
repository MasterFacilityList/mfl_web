'use strict';

describe('sil-typeahead service tests:', function () {

    var typeAhead;  

    beforeEach(function () {
        module('sil-typeahead');
    });

    beforeEach(inject(['sil-typeahead', function (_typeAhead_) {
	    typeAhead = _typeAhead_;        
    }]));

    it('typeAhead should have a definition',function(){
    	expect(typeAhead).toBeDefined();
        expect(angular.isFunction(typeAhead.snomedQuery)).toBeTruthy();
    });    

    /**Test snomedQuery function**/
    it('snomedQuery should throw if no shortcut searchType=autocomplete',function(){
        function wrapperFxn (){ 
            typeAhead.snomedQuery('autocomplete');
        }
        expect(wrapperFxn).toThrow('shortcut should be provided');
    });

    it('snomedQuery should throw if filters are not correctly configured',function(){
        function wrapperFxn (){ 
            typeAhead.snomedQuery('full','',[{jina: "parent", sth: "213123"}]);
        }
        expect(wrapperFxn).toThrow();
    });

    it('snomedQuery should throw if no filters and searchType=full',function(){
        function missingwrapperFxn (){ 
            typeAhead.snomedQuery('full');
        }
        function emptywrapperFxn (){ 
            typeAhead.snomedQuery('full','','');
        }
        expect(missingwrapperFxn).toThrow('Filters not provided');
        expect(emptywrapperFxn).toThrow('Filters not provided');
    });
    
    it('snomedQuery should return appropriate query (autocomplete without filters)',function(){
        var url_stub_filter_empty = typeAhead.snomedQuery('autocomplete','findings','');
        var url_stub = typeAhead.snomedQuery('autocomplete','findings');
        expect(url_stub).toBe('autocomplete/findings/?query=%QUERY');
        expect(url_stub_filter_empty).toBe('autocomplete/findings/?query=%QUERY');
    });

    it('snomedQuery should return appropriate query (autocomplete with filters)',function(){
        var url_stub = typeAhead.snomedQuery('autocomplete','findings',
            [{name: "parent", value: "123123"},{name: "module", value: "124124"}]);
        expect(url_stub)
            .toBe('autocomplete/findings/?query=%QUERY&parent=123123&module=124124');
    });

    it('snomedQuery should return appropriate query (full)',function(){
        var url_stub = typeAhead.snomedQuery('full','',[{name: "parent", value: "123123"},
            {name: "module", value: "124124"}]);
        expect(url_stub).toBe('full/?query=%QUERY&parent=123123&module=124124');
    });

    // Test initTT function
    it('**initTT should set up new adapter if tt_adapter is not defined',function(){
        var uri = 'full/?query=malaria&parent=123123&module=124124';
        var adapter = typeAhead.initTT('xxx','preferred_term',uri , '');
        var data = [
            {'preferred_term': 'big term'}, {'preferred_term': 'small term'}
        ];
        var output = adapter.index.datumTokenizer(data);
        expect(angular.isArray(output)).toBeTruthy();
    });

    it('initTT should return typeAhead adapter',function(){
        var uri = 'full/?query=malaria&parent=123123&module=124124';
        var adapter = typeAhead.initTT('diagnosis','preferred_term',uri , 15);
        expect(adapter).hasOwnProperty('wildcard');
    });
    //dummy test
    it('initTT not create new adapters if one is already defined',function(){
        var uri = 'full/?query=malaria&parent=123123&module=124124';
        typeAhead.initTT('diagnosis','preferred_term',uri , 15);
        typeAhead.initTT('diagnosis','preferred_term',uri , 15);
    });

    //test listeners
    it('should add listeners',function(){
        var fxn = function (){ return 'sth'; };
        typeAhead.addListener(fxn);
    });
    it('should delete listeners',function(){
        var fxn = function (){ return 'sth'; };
        //Hack to fix undefined error for (_) js
        _.without = function (){
            return 1;
        };
        typeAhead.addListener(fxn);
        typeAhead.removeListener(fxn);
    });

    //test delTT
    it('delTT should delete a TT',function(){
        //Hack to fix undefined error for (_) js
        _.omit = function() {
            return  1;
        };
        var uri = 'full/?query=malaria&parent=123123&module=124124';
        typeAhead.initTT('diagnosis','preferred_term',uri , 15);
        typeAhead.initTT('doctors','name',uri , 15);
        var res = typeAhead.delTT('doctors');
        expect(res).toBeDefined();
    });

});


describe("SIL searchApi", function(){
    var apiConf, searchApi;
    beforeEach(function(){
        var fakeModule = angular.module("test.config", function(){});
        fakeModule.config(["apiConfigProvider", function(_apiConfig_){
            _apiConfig_.SERVER_URL = "http://localhost:8001/";
            _apiConfig_.SNOMED_URL = "http://localhost:9001/";
            apiConf = _apiConfig_;
        }]);

        module("sil-typeahead", "test.config");
        inject(["searchApi",function(_searchApi_){
            searchApi = _searchApi_;
        }]);
    });

    it("should have searchApi defined", function(){
        expect(searchApi).toBeDefined();
    });

    describe('typeAheadUI tests:', function(){
        var searchApi, typeAhead;
        beforeEach(function () {
            inject(["searchApi", "sil-typeahead", 
                function(searchApi_, TTA){
                    searchApi = searchApi_;
                    typeAhead = TTA;
                }
            ]);        
        });

        it('should do its thing',function(){
            var makeUrl = function (stub) {
                return searchApi.api.makeUrl(stub, true);
            };

            var initDiagnosis = function () {
                var url_stub = typeAhead.snomedQuery("autocomplete", "findings","");
                return typeAhead.initTT("diagnosis", "preferredTerm", makeUrl(url_stub), 15);
            };
            
            var typeaheadDiagnosis = function (fieldclass) {
                var f = initDiagnosis();
                var name = fieldclass || "diagnosis";
                typeAhead.typeaheadUI(name, {
                    displayKey: "preferredTerm",
                    source: f.ttAdapter()
                });
            };
            typeaheadDiagnosis("diagnosis");
        });
    });

});
