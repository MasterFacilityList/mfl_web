"use strict";
angular
    .module("mfl.gis.controllers", ["openlayers-directive",
        "mfl.gis.countries.wrapper","mfl.gis.counties.wrapper",
        "mfl.gis.interceptors"])
    .controller("mfl.gis.controllers.gis", ["$scope", "olData",
        "gisCountriesApi","$http","olHelpers",
        function ($scope, olData, countriesApi, $http, olHelpers) {
        var extent, gis_counties;
        // Get the counties data from a JSON
        $http.get("assets/counties.json").success(function (data) {
            // Put the counties on an associative array
            $scope.counties = {};
            for (var i = 0; i < data.length; i++) {
                var county = data[i];
                $scope.counties[county.name] = county;
            }
        });
        $http.get("/assets/counties.all.geo.json",{
            cache:true
        })
            .success(function (response) {
            gis_counties = response;
            angular.extend($scope, {
                    layers: [{
                            name: "counties_fill",
                            source: {
                                type: "JSON",
                                url: "/assets/counties.all.geo.json"
                            },
                            style: getStyle,
                            index: 0
                        }
                    ],
                        defaults: {
                            events: {
                                layers: ["mousemove", "click"]
                            }
                        }
                    });
            console.dir(response);
        });
        var getColor = function(county_code) {
            console.log(county_code);
            if (!county_code) {
                return "#80ff00";
            }
            var colors = [ "rgba(0, 102, 153, 0.59)", "#336666", "#003366", "#3399CC", "#6699CC" ];
            var index = county_code % colors.length ;
            return colors[index];
        };
        var getStyle = function(feature) {
            var style = olHelpers.createStyle({
                fill: {
                    color: getColor(feature.n.code),
                    opacity: 0.4
                },
                stroke: {
                    color: "red",
                    width: 3
                }
            });
            return [ style ];
        };
//        console.log($http);
        countriesApi.api
            .get("b992e9c4-15fb-4039-85d2-86829e21ebed")
            .success(function (data) {
                $scope.country = data;
                angular.extend($scope, {
                    KEN: {
                        lat: data.properties.latitude,
                        lon: data.properties.longitude,
                        zoom: 6
                    }
                });
            })
            .error(function (error) {
                console.log(error);
            });
        $scope.$on("openlayers.layers.counties_fill.mousemove", function (event, feature) {
                $scope.$apply(function ($scope) {
                    if (feature) {
                        $scope.mouseMoveCounty = feature.n.name;
                    }
                });
            });

        $scope.$on("openlayers.layers.counties_stroke.click", function (event, feature) {
                $scope.$apply(function ($scope) {
                    if (feature) {
                        console.dir(feature);
                        $scope.mouseClickCounty = feature.n.name;
                    }
                });
            });
        $scope.centerJSON = function (name) {
                olData.getMap().then(function (map) {
                    var layers = map.getLayers();
                    layers.forEach(function (layer) {
                        if (layer.get("name") === "KEN" && "KEN" === name) {
                            extent = layer.getSource().getExtent();
                            map.getView().fitExtent(extent, map.getSize());
                        }
                    });
                });
            };
    }])
    .controller("mfl.gis.controllers.gis.county", ["$scope", "olData",
        "gisCountiesApi","$http",
        function ($scope, olData, countiesApi, $http) {
        // Get the counties data from a JSON
        $http.get("assets/counties.json").success(function (data) {
            // Put the counties on an associative array
            $scope.counties = {};
            for (var i = 0; i < data.length; i++) {
                var county = data[i];
                $scope.counties[county.name] = county;
            }
        });
        countiesApi.api
            .get("b992e9c4-15fb-4039-85d2-86829e21ebed")
            .success(function (data) {
                $scope.country = data;
                angular.extend($scope, {
                    KEN: {
                        lat: data.properties.latitude,
                        lon: data.properties.longitude,
                        zoom: 6
                    },
                    layers: [{
                            name: "counties_fill",
                            source: {
                                type: "GeoJSON",
                                url: "assets/counties.all.geo.json"
                            },
                            style: {
                                fill: {
                                    color: "rgba(242, 255, 92, 0.43)"
                                }
                            }
                        },{
                            name: "counties_stroke",
                            source: {
                                type: "GeoJSON",
                                url: "assets/counties.all.geo.json"
                            },
                            style: {
                                stroke: {
                                    color: "red",
                                    width: 3
                                }
                            }
                        }
                    ],
                        defaults: {
                            events: {
                                layers: ["mousemove", "click"]
                            }
                        }
                    });
                $scope.$on("openlayers.layers.counties_fill.mousemove", function (event, feature) {
                    $scope.$apply(function ($scope) {
                        if (feature) {
                            $scope.mouseMoveCounty = feature.n.name;
                        }
                    });
                });

                $scope.$on("openlayers.layers.counties_stroke.click", function (event, feature) {
                    $scope.$apply(function ($scope) {
                        if (feature) {
                            $scope.mouseClickCounty = feature.n.name;
                        }
                    });
                });
            })
            .error(function (error) {
                console.log(error);
            });
    }]);