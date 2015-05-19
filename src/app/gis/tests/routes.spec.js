"use strict";

describe("tests for GIS Routes:", function() {

    var data,state,injector,SERVER_URL,scope,
        rootScope;//initialize dependencies

    beforeEach(function() {
        module("mflwebApp");
        module("mfl.gis.wrapper");
        module("mfl.gis.routes");
        inject(["$state","$stateParams","$rootScope",
                "gisCountiesApi","gisConstsApi","gisWardsApi","$injector","SERVER_URL",
                function ($state,$stateParams,$rootScope,
                  gisCountiesApi,gisConstsApi,gisWardsApi,$injector,url) {
            rootScope =  $rootScope;
            scope = rootScope.$new();
            injector =  $injector;
            state = $state;
            SERVER_URL = url;
            gisCountiesApi = gisCountiesApi;
            gisConstsApi = gisConstsApi;
            gisWardsApi = gisWardsApi;
            data = {
                $state: $state,
                $stateParams: $stateParams,
                gisCountiesApi: gisCountiesApi,
                gisConstsApi: gisConstsApi,
                gisWardsApi: gisWardsApi,
                SERVER_URL: url
            };
        }]);
    });
    it("should respond to /gis", inject(["$state",function ($state) {
        expect($state.href("gis", { id: 1 })).toEqual("#/gis");
    }]));
        /*Tests for resolves within routes*/
    it("should resolve gisCounty",
            inject(["$httpBackend","$state",function ($httpBackend,$state) {
        var data = {
            results:{
                id :"",
                type:"",
                geometry:{},
                properties: {}
            }
        };
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/county_boundaries/34/")
            .respond(200, data);
        $state.go("gis_county", {"county_id": "34"});
//        controller("mfl.gis.controllers.gis");

        $httpBackend.flush();
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
        SERVER_URL + "api/gis/constituency_boundaries/34/")
            .respond(200, data);
        $state.go("gis_const", {"const_id": "34"});
    }]));


    /*Ward resolve test*/
    it("should resolve gisWard",
            inject(["$httpBackend","$state",function ($httpBackend,$state) {
        var data = {
            id:"",
            type:"",
            geometry:{},
            properties:{}
        };
        $httpBackend.expectGET(
        SERVER_URL + "api/gis/ward_boundaries/34/")
            .respond(200, data);
        $state.go("gis_ward", {"ward_id": "34"});
    }]));

});
