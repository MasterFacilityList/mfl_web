"use strict";

describe("tests for GIS Routes:", function() {

    var data,state,injector,SERVER_URL,scope, rootScope;

    beforeEach(function() {
        module("mflAppConfig");
        module("mfl.gis.wrapper");
        module("mfl.gis.routes");
        module("mfl.auth.service");
        module("templates-app");

        inject(["$state","$stateParams","$rootScope", "$injector","SERVER_URL",
                function ($state,$stateParams,$rootScope,$injector,url) {
            rootScope =  $rootScope;
            scope = rootScope.$new();
            injector =  $injector;
            state = $state;
            SERVER_URL = url;
            data = {
                $state: $state,
                $stateParams: $stateParams
            };
        }]);
    });
    it("should respond to /gis/drilldown", inject(["$state",function ($state) {
        expect($state.href("gis", { id: 1 })).toEqual("#/gis");
    }]));

    it("should resolve gisConst",
            inject(["$httpBackend","$state",function ($httpBackend,$state) {
        var data = {
            id:"",
            type:"",
            geometry:{},
            properties:{}
        };
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/drilldown/constituency/34/")
            .respond(200, data);
        $state.go("gis_county.gis_const", {"constituency_code": "34"});
    }]));

    it("should resolve gisWard",
            inject(["$httpBackend","$state",function ($httpBackend,$state) {
        var data = {
            id:"",
            type:"",
            geometry:{},
            properties:{}
        };
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/drilldown/ward/34/")
            .respond(200, data);
        $state.go("gis_county.gis_const.gis_ward", {"ward_code": "34"});
    }]));

    describe("Test gis auth states", function () {
        var testAuthed, testUnAuthed;

        beforeEach(function () {

            inject(["$rootScope", "$state", "api.auth",
                function ($rootScope, $state, auth) {
                    testAuthed = function (name) {
                        spyOn(auth, "getToken").andReturn({access_token: "DSA"});
                        spyOn(auth, "fetchToken");
                        $state.go(name);
                        $rootScope.$digest();
                        expect($state.current.name).toEqual(name);
                        expect(auth.fetchToken).not.toHaveBeenCalled();
                    };
                    testUnAuthed = function (name) {
                        spyOn(auth, "getToken").andReturn(null);
                        spyOn(auth, "fetchToken");
                        $state.go(name);
                        $rootScope.$digest();
                        expect($state.current.name).toEqual(name);
                        expect(auth.fetchToken).toHaveBeenCalled();
                    };
                }]
            );
        });

        it("should load gis state (authed)", function () {
            testAuthed("gis");
        });

        it("should load gis state (unauthed)", function () {
            testUnAuthed("gis");
        });

        it("should load gis county state (authed)", function () {
            testAuthed("gis_county", {"county_code": 3});
        });

        it("should load gis county state (unauthed)", function () {
            testAuthed("gis_county", {"county_code": 3});
        });

        it("should load gis const state (authed)", function () {
            testAuthed("gis_county.gis_const", {
                "county_code": 3,
                "constituency_code": 3
            });
        });

        it("should load gis const state (unauthed)", function () {
            testAuthed("gis_county.gis_const", {
                "county_code": 3,
                "constituency_code": 6
            });
        });

        it("should load gis ward state (authed)", function () {
            testAuthed("gis_county.gis_const.gis_ward", {
                "county_code": 3,
                "constituency_code":4,
                "ward_code":4
            });
        });

        it("should load gis ward state (unauthed)", function () {
            testAuthed("gis_county.gis_const", {
                "county_code": 3,
                "constituency_code":4,
                "ward_code": 7
            });
        });
    });
});
