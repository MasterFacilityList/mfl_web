(function(angular){
    "use strict";
    angular.module("mfl.filtering.services", ["sil.api.wrapper"])


    .factory("mfl.filtering.data.controller", ["$q", "filteringApi", function($q, filterApi){
        return function(){
            var filter = {"page_size": 200};
            var counties = filterApi.counties.filter(filter);
            var consts = filterApi.constituencies.filter(filter);
            var fType = filterApi.facility_types.filter(filter);
            var op = filterApi.operation_status.filter(filter);
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
    }]);
})(angular);
