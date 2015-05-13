"use strict";
(function(angular){
    angular.module("mfl.filtering.services", ["sil.api.wrapper"])

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
        this.data = {};
        var self = this;

        this.filter = {"page_size": 10000};
        this.getData = function(){
            this.facility_types.filter(this.filter).success(function(data){
                self.data.facility_types = data.results;
            }).error(function(){
                self.data.facility_types = [];
            });

            // this.officers.filter(this.filter).success(function(data){
            //     self.data.officers = data.results;
            // }).error(function(){
            //     self.data.officers = [];
            // });

            // this.owners.filter(this.filter).success(function(data){
            //     self.data.owners = data.results;
            // }).error(function(){
            //     self.data.owners = [];
            // });

            this.operation_status.filter(this.filter).success(function(data){
                self.data.operation_status = data.results;
            }).error(function(){
                self.data.operation_status = [];
            });

            this.counties.filter(this.filter).success(function(data){
                self.data.counties = data.results;
            }).error(function(){
                self.data.counties = [];
            });

            this.constituencies.filter(this.filter).success(function(data){
                self.data.consts = data.results;
            }).error(function(){
                self.data.consts = [];
            });

            this.wards.filter(this.filter).success(function(data){
                self.data.wards = data.results;
            }).error(function(){
                self.data.wards = [];
            });

            return self.data;
        };
    }]);
})(angular);
