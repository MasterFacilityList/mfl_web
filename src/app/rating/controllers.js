(function (angular, _, toastr) {
    "use strict";

    angular.module("mfl.rating.controllers", [])

    .controller("mfl.rating.controllers.rating", ["$scope", "$stateParams",
        "facilitiesApi", "$window", "mfl.rating.services.rating","gisAdminUnitsApi",
        function ($scope, $stateParams,facilitiesApi, $window, ratingService,gisAdminUnitsApi) {
            $scope.spinneractive = true;
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.fac_id = $stateParams.fac_id;
            $scope.oneFacility = {};
            $scope.getFacility = function () {
                facilitiesApi.chus.filter({
                    "facility" : $scope.fac_id,
                    "fields": "id,code,name,status,households_monitored"
                })
                .success(function (data) {
                    $scope.chus = data.results;
                })
                .error(function (e) {
                    $scope.alert = e.error;
                });
                facilitiesApi.facilities.get($scope.fac_id)
                .success(function (data) {
                    $scope.spinneractive = false;
                    $scope.rating = [
                        {
                            current: 3,
                            max: 5
                        }
                    ];
                    $scope.oneFacility = data;
                    /*get link for gis to go to county*/
                    gisAdminUnitsApi.counties.get(data.boundaries.county_boundary)
                        .success(function (data) {
                            $scope.const_boundaries =data.properties
                                                            .constituency_boundary_ids.join(",");
                        })
                        .error(function (error) {
                            $scope.error = error;
                        });
                    /*get link for gis to go to constituency*/
                    gisAdminUnitsApi.constituencies.get(data.boundaries.constituency_boundary)
                        .success(function (data) {
                            $scope.ward_boundaries =data.properties.ward_boundary_ids.join(",");
                        })
                        .error(function (error) {
                            $scope.error = error;
                        });
                    _.each($scope.oneFacility.facility_services,
                        function (service) {
                            var current_rate = "";
                            current_rate = ratingService.getRating(service.id);
                            if(!_.isNull(current_rate)) {
                                service.comment = current_rate[1];
                                service.ratings = [
                                    {
                                        current : current_rate[0],
                                        max: 5
                                    }
                                ];
                            }
                            else {
                                service.ratings = [
                                    {
                                        current : 0,
                                        max: 5
                                    }
                                ];
                            }
                        }
                    );
                })
                .error(function (e) {
                    $scope.alert_main = e.detail;
                    $scope.spinneractive = false;
                });
            };
            $scope.getFacility();

            $scope.getSelectedRating = function (rating, id) {
                $scope.fac_rating = {
                    facility_service : id,
                    rating : rating
                };
            };
            $scope.rateService = function (service_obj) {
                $scope.service_rating = {
                    facility_service : service_obj.id,
                    rating : service_obj.ratings[0].current,
                    comment : service_obj.ratings[0].comment
                };
                service_obj.spinner = true;
                facilitiesApi.ratings.create($scope.service_rating)
                    .success(function (data) {
                        //save rating in localStorage
                        var rating_val = [];
                        rating_val[0] = data.rating;
                        rating_val[1] = data.comment;
                        service_obj.spinner = false;
                        ratingService.storeRating(
                            data.facility_service, rating_val);
                        $scope.getFacility();
                        toastr.success("Successfully rated");
                    })
                    .error(function () {
                        service_obj.spinner = false;
                        $scope.alert = "Service can only be rated once a day";
                        toastr.error($scope.alert);
                    });
            };
            //printing function
            $scope.printing = function () {
                $window.print();
            };
        }
    ])
    .controller("mfl.rating.controllers.rating.map",["$scope","$log","gisAdminUnitsApi",
        "leafletData",
        function($scope,$log,gisAdminUnitsApi,leafletData){
        $scope.spinner = true;
        /*Setup for map data*/
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false
            },
            layers:{},
            tiles:{
                openstreetmap: {
                    url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    options: {
                        opacity: 0.7,
                        attribution: "&copy; <a href='http://www.openstreetmap.org/"+
                        "copyright'>OpenStreetMap</a> contributors"
                    }
                }
            }
        });

        /*Wait for facility to be defined*/
        $scope.$watch("oneFacility", function (f) {
            if (_.isUndefined(f)){
                return;
            }
            /*ward coordinates*/
            gisAdminUnitsApi.wards.get(f.boundaries.ward_boundary)
            .success(function(data){
                $scope.spinner = false;
                $scope.ward_gis = data;
                leafletData.getMap("wardmap")
                    .then(function (map) {
                        var coords = data.properties.bound.coordinates[0];
                        var bounds = _.map(coords, function(c) {
                            return [c[1], c[0]];
                        });
                        map.fitBounds(bounds);
                    });
                var gis = data;
                angular.extend($scope, {
                    geojson: {
                        data: gis,
                        style: {
                            fillColor: "rgb(255, 135, 32)",
                            weight: 2,
                            opacity: 1,
                            color: "rgba(0, 0, 0, 0.52)",
                            dashArray: "3",
                            fillOpacity: 0.8
                        }
                    },
                    layers:{
                        baselayers:{
                            ward: {
                                name: "Ward",
                                url: "/assets/img/transparent.png",
                                type:"group"
                            }
                        },
                        overlays:{
                            facility:{
                                name:"Facility Location",
                                type:"group",
                                visible: true
                            }
                        }
                    }
                });

                /*facility's coordinates*/
                gisAdminUnitsApi.facilities.get(f.coordinates)
                .success(function(data){
                    angular.extend($scope,{
                        markers: {
                            mainMarker: {
                                layer:"facility",
                                lat: data.properties.coordinates.coordinates[1],
                                lng: data.properties.coordinates.coordinates[0],
                                message: "Facility location"
                            }
                        }
                    });
                })
                .error(function(error){
                    $log.error(error);
                });
            })
            .error(function(error){
                $log.error(error);
            });

        });
    }]);
})(window.angular, window._, window.toastr);
