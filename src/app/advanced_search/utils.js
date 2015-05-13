(function (angular) {
    angular.module("mfl.search.utils", [])
    .service("mfl.search.filters.changes", [function () {

        this.whatChanged = function (frm) {
            var vals = {};
            if (frm.$dirty === true) {
                for (var f in frm) {
                    if (_.isUndefined(frm[f])) {
                        continue;
                    }
                    if (frm[f].$dirty === true) {
                        try{
                            vals[f] = frm[f].$modelValue.trim();

                        }catch(err){
                            vals[f] = frm[f].$modelValue;

                        }
                    }
                }
            }

            return vals;
        };

    }]);

})(angular);
