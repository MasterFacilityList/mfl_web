//angular.module("mfl.gis.services",[])
//.service("mfl.gis.services.gis", [function () {
//    this.getPoints = function(data) {
//        var bounds = {}, coords, latitude, longitude;
//        // We want to use the “features” key of the FeatureCollection (see above)
//        data = data.features;
//        // Loop through each “feature”
//        for (var i = 0; i < data.length; i++) {
//            // Pull out the coordinates of this feature
//            coords = data[i].geometry.coordinates[0];
//            // For each individual coordinate in this feature's coordinates…
//            for (var j = 0; j < coords.length; j++) {
//                longitude = coords[j][0];
//                latitude = coords[j][1];
//                // Update the bounds recursively by comparing the current
//                // xMin/xMax and yMin/yMax with the coordinate 
//                // we're currently checking
//                bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
//                bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
//                bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
//                bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
//            }
//        }
//        // Returns an object that contains the bounds of this GeoJSON
//        // data. The keys of this object describe a box formed by the
//        // northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
//        return bounds;
//    };
//    this.getExps = function (bnds){
//        var s,w,n,e,sw = [s,w],ne = [n,e];
//        sw[0] = bnds.xMin[1] > bnds.yMin[1] ? bnds.xMin[1] : bnds.yMin[1];
//        sw[1] = bnds.yMin[0] > bnds.yMin[0] ? bnds.xMin[0] : bnds.yMin[0];
//        ne[0] = bnds.xMax[1] > bnds.yMax[1] ? bnds.xMax[1] : bnds.yMax[1];
//        ne[1] = bnds.yMax[0] > bnds.yMax[0] ? bnds.xMax[0] : bnds.yMax[0];
//        return [sw,ne];
//    };
//}]);