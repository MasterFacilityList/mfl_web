(function (angular, _){
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.gis_const.controllers
     *
     * @description
     * Contains the controller used in the constituency view
     */
    angular.module("mfl.gis_const.controllers", [
        "leaflet-directive",
        "nemLogging",
        "mfl.gis.wrapper"
    ])

    /**
     * @ngdoc controller
     *
     * @name mfl.gis.controllers.gis_const
     *
     * @description
     * Controller for the constituency view
     */
    .controller("mfl.gis.controllers.gis_const", ["$scope","leafletData",
        "$http","$state","$stateParams","SERVER_URL",
        "$timeout","gisAdminUnitsApi",
        function ($scope, leafletData, $http, $state,
                   $stateParams,SERVER_URL,
                  $timeout,gisAdminUnitsApi) {
        $scope.county_code = $stateParams.county_code;
        $scope.constituency_code = $stateParams.constituency_code;
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: "",
                dragging:true
            },
            events: {
                map: {
                    enable: ["click"],
                    logic: "emit"
                }
            },
            layers:{
                overlays:{
                    wards:{
                        name:"Wards",
                        type:"group",
                        visible: true
                    }
                }
            }
        });

        $scope.county_code = $stateParams.county_code;
        $scope.constituency_code = $stateParams.constituency_code;
        gisAdminUnitsApi.constituency.get($scope.constituency_code)
        .success(function (constituency_data) {
            $scope.constituency = constituency_data;
            $scope.spinner = false;
            leafletData.getMap("constmap")
                .then(function (map) {
                    var coords = constituency_data.meta.bound.coordinates[0];
                    var bounds = _.map(coords, function(c) {
                        return [c[1], c[0]];
                    });
                    map.fitBounds(bounds);
                    map.spin(true,  {lines: 13, length: 20,corners:1,
                        radius:30,width:10});
                    $timeout(function() {map.spin(false);}, 500);
                },function(err){
                console.log(err);
            });
            //Get Facility Coordinates
            gisAdminUnitsApi.getFacCoordinates()
            .then(function (data){
                var heats = _.filter(data,{4:$scope.constituency_code});
                $scope.facility_count = heats.length;
                var heatpoints = _.map(heats, function(heat){
                    return [
                            heat[2],
                            heat[1]
                        ];
                });
                var constituency_marks = constituency_data.geojson.features;
                var markers = _.mapObject(constituency_marks, function(mark){
                    return {
                            layer:"constituencies",
                            id:mark.id,
                            lat: mark.properties.center.coordinates[1],
                            lng: mark.properties.center.coordinates[0],
                            label: {
                                message: mark.properties.name,
                                options: {
                                    noHide: false
                                }
                            },
                            riseOnHover: true
                        };
                });
                angular.extend($scope, {
                    geojson: {
                        data: constituency_data.geojson,
                        style: {
                            fillColor: "rgba(255, 255, 255, 0.27)",
                            weight: 2,
                            opacity: 1,
                            color: "rgba(0, 0, 0, 0.52)",
                            dashArray: "3",
                            fillOpacity: 0.7
                        }
                    },
                    layers:{
                        overlays:{
                            constituencies:{
                                name:"Constituencies",
                                type:"group",
                                visible: true
                            },
                            heat:{
                                name: "Facilities",
                                type: "heat",
                                data: heatpoints,
                                layerOptions: {
                                    radius: 25,
                                    opacity:1,
                                    blur: 1,
                                    gradient: {0.2: "lime", 0.3: "orange",0.4: "red"}
                                },
                                visible: true
                            }
                        },
                        selectedConst: {}
                    },
                    markers: markers
                });
            },function(err) {
                $scope.alert = err.error;
            });
            $scope.$on("leafletDirectiveGeoJson.constmap.click", function(ev, ward) {
                $scope.spinner = true;
                $state.go("gis_county.gis_const.gis_ward",
                           {county_code:$stateParams.county_code,
                            constituency_code:$stateParams.constituency_code,
                            ward_code:ward.model.id});
            });
            $scope.$on("leafletDirectiveMarker.constmap.click", function(ev, ward) {
                $scope.spinner = true;
                $state.go("gis_county.gis_const.gis_ward",
                           {county_code:$stateParams.county_code,
                            constituency_code:$stateParams.constituency_code,
                            ward_code: ward.model.id});
            });
        })
        .error(function (err) {
            console.log(err);
        });
    }]);
})(window.angular, window._);
