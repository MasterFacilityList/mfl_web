"use strict";

describe("Test requests provider", function () {
    var requests;
    var url;

    beforeEach(function () {
        module("mfl.common.providers");
        inject(["mfl.common.providers.requests", function (r) {
            requests = r;
            url = requests.api_url;
        }]);
    });
    // check to see if it has the expected function
    it("should have its function defined", function () {
        expect(angular.isDefined(requests)).toBe(true);
        expect(angular.isFunction(requests.makeUrl)).toBe(true);
        expect(angular.isFunction(requests.callApi)).toBe(true);
        expect(angular.isFunction(requests.makeParams)).toBe(true);
    });

    //test makeUrl
    it("should make an expected url", function () {
        var test_url = "/test/url/";
        var result = requests.makeUrl(test_url);
        expect(result).toBe(url + test_url);
    });

    //test callApi
    it("should throw if method is not supported", function () {
        var method = "KILL";
        var uri_fragment = "/test/";
        var data = {};

        function functionWrapper() {
            requests.callApi(method, uri_fragment, data);
        }

        expect(functionWrapper).toThrow("HTTP method: KILL not supported");
    });

    //test if data is defined in the callApi function in right format
    it("should successfully make a http  get request", function () {
        var method = "GET";
        var uri_fragement = "/test/place";
        var data = [
            {
                name : "test",
                value : "hakuna"
            }
        ];
        function wrapper(){
            return requests.callApi(method ,uri_fragement, data);
        }
        var res = wrapper();
        expect(res).toBeTruthy();
    });

    //test if data is defined but method is not GET
    it("it should successfully not make a http DELETE request", function(){
        var method = "POST";
        var uri_fragement = "test/delete";
        var data = [
            {
                name : "barboassa",
                value : "jack sparrow"
            }
        ];
        function wrap(){
            return requests.callApi(method, uri_fragement, data);
        }
        var res =  wrap();
        expect(res).toBeTruthy();
    });

    //test if data is defined and method is GET
    it("it should successfully  make a http DELETE request", function(){
        var method = "DELETE";
        var uri_fragement = "test/delete";
        var data = [
            {
                name : "barboassa",
                value : "jack sparrow"
            }
        ];
        function wrap(){
            return requests.callApi(method, uri_fragement, data);
        }
        var res =  wrap();
        expect(res).toBeTruthy();
    });
    //test makeParams
    it("should throw if filters are not provided", function () {
        var filters;

        function functionWrapper() {
            requests.makeParams(filters);
        }

        expect(functionWrapper).toThrow("Filters not provided");
    });

    it("should throw if filters are not provided", function () {
        var filters = {};

        function functionWrapper() {
            requests.makeParams(filters);
        }

        expect(functionWrapper).toThrow("provided filters parameter is not an array");
    });

    it("should throw if filters are not properly configured", function () {
        var filters = [
            {
                "jina": "workflow_state",
                "value": "DRAFT_PROVIDER"
            },
            {
                "name": "page",
                "value": 1
            }
        ];

        function functionWrapper() {
            requests.makeParams(filters);
        }

        expect(functionWrapper).toThrow("filter was incorrectly configured");
    });


});
