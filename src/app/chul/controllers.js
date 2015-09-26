(function(angular,_, toastr){
    "use strict";

    angular.module("mfl.chul.controllers", [
        "mfl.chul.services",
        "mfl.rating.services",
        "mfl.facility_filter.services"
    ])

    .controller("mfl.chul.controllers.list", ["$scope","mfl.chul.services.wrappers",
        function ($scope,wrappers) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            wrappers.chul.list()
            .success(function (data) {
                $scope.spinner = false;
                $scope.results = data;
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ])
    .controller("mfl.chul.controllers.view", ["$scope","mfl.chul.services.wrappers","$stateParams",
        "gisAdminUnitsApi","leafletData", "mfl.rating.services.rating",
        function ($scope,wrappers,$stateParams,gisAdminUnitsApi,leafletData,
            ratingService) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
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

            /*CHU rating*/
            $scope.rating = [
                {
                    current: 0,
                    max: 5
                }
            ];
            $scope.getSelectedRating = function (rating, id) {
                $scope.cu_rating = {
                    cu_id : id,
                    rating : rating
                };
            };
            $scope.getUnitRating = function () {
                wrappers.chul.get($stateParams.unit_id,
                    {"fields" : "avg_rating,number_of_ratings"})
                .success(function (data) {
                    $scope.unit.avg_rating = data.avg_rating;
                    $scope.unit.number_of_ratings = data.number_of_ratings;
                })
                .error(function (data) {
                    $scope.alert = data;
                });
            };
            $scope.rateCU = function (unit) {
                $scope.chu_rating = {
                    chu : unit.id,
                    rating : unit.ratings[0].current,
                    comment : unit.ratings[0].comment
                };
                $scope.unit.spinner = true;
                wrappers.chul_ratings.create($scope.chu_rating)
                .success(function (data) {
                    //save rating in localStorage
                    var rating_val = [];
                    rating_val[0] = data.rating;
                    rating_val[1] = data.comment;
                    $scope.unit.spinner = false;
                    ratingService.storeRating(unit.id, rating_val);
                    $scope.getUnitRating();
                    toastr.success("Successfully rated");
                })
                .error(function (data) {
                    $scope.unit.spinner = false;
                    $scope.alert = data;
                    toastr.error($scope.alert);
                });
            };
            wrappers.chul.get($stateParams.unit_id)
            .success(function (unit) {
                $scope.spinner = false;
                $scope.unit = unit;
                var current_rate = "";
                current_rate = ratingService.getRating($stateParams.unit_id);
                $scope.unit.ratings = [
                    {
                        current: current_rate ? current_rate[0] : 0,
                        max: 5
                    }
                ];
                /*ward coordinates*/
                gisAdminUnitsApi.wards.get(unit.boundaries.ward_boundary)
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
                        markers: {
                            mainMarker: {
                                layer:"facility",
                                lat: unit.geo_features.geometry.coordinates[1],
                                lng: unit.geo_features.geometry.coordinates[0],
                                message: "Facility location"
                            }
                        },
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
                })
                .error(function(error){
                    console.error(error);
                });
            })
            .error(function (error) {
                $scope.spinner = false;
                $scope.alert = error;
            });
        }
    ]);

})(window.angular,window._, window.toastr);
