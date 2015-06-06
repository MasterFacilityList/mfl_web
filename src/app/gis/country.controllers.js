(function(angular){
    "use strict";
    angular
    .module("mfl.gis_country.controllers", ["leaflet-directive",
        "mfl.gis.wrapper"])
    .controller("mfl.gis.controllers.gis", ["$scope","leafletData",
        "$http","$stateParams","$state","SERVER_URL","gisCountiesApi","gisFacilitiesApi",
        "$timeout","leafletEvents",
        function ($scope,leafletData,$http, $stateParams,
                   $state,SERVER_URL, gisCountiesApi, gisFacilitiesApi,$timeout,leafletEvents) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        var bounds = [
            [-4.669618,33.907219],
            [-4.669618,41.90516700000012],
            [4.622499,41.90516700000012],
            [4.622499,33.907219],
            [-4.669618,33.907219]
        ];
        $scope.title = [
            {
                icon: "fa-map-marker",
                name: "Geographic Discovery"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
        $scope.selectedConst = {};
        $scope.markers = {};
        $scope.layers = {};
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: "",
                dragging:false
            },
            events: {
                map: {
                    enable: ["moveend", "popupopen"],
                    logic: "emit"
                },
                marker: {
                    disable : leafletEvents.getAvailableMarkerEvents()
                }
            }
        });
        /*Gets counties for boundaries*/
        gisCountiesApi.api.list()
        .success(function (data){
            var marks = data.results.features;
            var markers = _.mapObject(marks, function(mark){
                return  {
                        layer: "counties",
                        lat: mark.properties.center.coordinates[1],
                        lng: mark.properties.center.coordinates[0],
                        label: {
                            message: ""+mark.properties.name+"",
                            options: {
                                noHide: true
                            }
                        }
                    };
            });
            $scope.markers = markers;
            $scope.geodata = data.results;
            angular.extend($scope, {
                geojson: {
                    data: $scope.geodata,
                    style: {
                        fillColor: "rgba(255, 255, 255, 0.01)",
                        weight: 2,
                        opacity: 1,
                        color: "rgba(0, 0, 0, 0.52)",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                layers:{
                    baselayers:{
                        country: {
                            name: "Country",
                            url: "/assets/img/transparent.png",
                            type:"xyz"
                        }
                    },
                    overlays:{
                        counties:{
                            name:"Counties",
                            type:"markercluster",
                            visible: true
                        }
                    }
                }
            });
        })
        .error(function(err){
            $scope.alert = err.error;
        });
        leafletData.getMap("countrymap")
            .then(function (map) {
                map.fitBounds(bounds);
                map.spin(true,
                         {lines: 13, length: 20,corners:1,radius:30,width:10});
                $timeout(function() {map.spin(false);}, 1000);
            });
        /*Gets Facilities for heatmap*/
        gisFacilitiesApi.api
        .list()
        .success(function (data){
            var heats = data.results.features;
            var heatpoints = _.map(heats, function(heat){
                return [
                        heat.geometry.coordinates[1],
                        heat.geometry.coordinates[0]
                    ];
            });
            $scope.heatpoints = heatpoints;
            $scope.layers.overlays.heat = {
                name: "Facilities",
                type: "heat", 
                data: angular.copy($scope.heatpoints),
                layerOptions: {
                    radius: 25,
                    opacity:1,
                    blur: 1,
                    gradient: {0.2: "lime", 0.3: "orange",0.4: "red"}
                },
                visible: true
            };
        })
        .error(function(err){
            $scope.alert = err.error;
        });
        $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, county) {
            $scope.hoveredCounty = county.model;
        });
        $scope.$on("leafletDirectiveGeoJson.click", function(ev, county) {
            var boundary_ids = county.model.properties.constituency_boundary_ids.join(",");
            $stateParams.const_boundaries = boundary_ids;
            $state.go("gis.gis_county",{county_id: county.model.id,
                                    const_boundaries : boundary_ids});
        });
    }]);
})(angular);
