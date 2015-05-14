"use strict";
(function(angular){
    angular.module("mfl.filtering.services", ["sil.api.wrapper"])


    .factory("mfl.filtering.data.controller", ["$q", "filteringApi", function($q, filterApi){
        return function(){
            var counties = filterApi.getData().county;
            var consts = filterApi.getData().constituency;
            var fType = filterApi.getData().facility_type;
            var op = filterApi.getData().operation_status;
            return $q.all([counties, consts, fType, op]).then(function(results){
                return {
                    county: results[0],
                    constituency: results[1],
                    facility_type: results[2],
                    operation_status: results[3]
                };
            });
        };
    }])

    .service("filteringApi", ["api", function(api){
        this.facilities = api.setBaseUrl("api/facilities/facilities");
        this.constituencies = api.setBaseUrl("api/common/constituencies");
        this.wards = api.setBaseUrl("api/common/wards");
        this.counties = api.setBaseUrl("api/common/counties");
        this.towns = api.setBaseUrl("api/common/towns");
        this.operation_status = api.setBaseUrl("api/facilities/facility_status");
        this.owners = api.setBaseUrl("api/facilities/owners");
        this.officers = api.setBaseUrl("api/facilities/officers");
        this.facility_types = api.setBaseUrl("api/facilities/facility_types");

        this.filter = {"page_size": 10000};
        this.getData = function(){
            return {
                county: this.counties.filter(this.filter),
                constituency: this.constituencies.filter(this.filter),
                facility_type: this.facility_types.filter(this.filter),
                operation_status: this.operation_status.filter(this.filter)
            };
        };
    }]);
})(angular);
