//(function () {
//    "use strict";
//    describe("Test storage module:", function () {
//        var localStorage;
//        var backend;
//        beforeEach(function () {
//            module("mfl.common.services");
//            localStorage = {
//                getItem: null,
//                setItem: null,
//                removeItem: null,
//                clear: null
//            };
//            module(["$provide", function (p) {
//                p.value("$window", {
//                    "localStorage" : localStorage
//                });
//            }]);
//        });
// 
//        beforeEach(inject(["mfl.common.services.localStorage", function(ls) {
//            backend = ls;
//        }]));
// 
//        it("should define interface functions", function () {
//            var checker = angular.isFunction;
//            expect(checker(backend.getItem)).toBe(true);
//            expect(checker(backend.setItem)).toBe(true);
//            expect(checker(backend.removeItem)).toBe(true);
//            expect(checker(backend.clear)).toBe(true);
//        });
// 
//        it("should get an item", function () {
////            spyOn(localStorage, "getItem").andCallThrough().andReturn(1);
//            var b = backend.getItem("a");
//            expect(localStorage.getItem).toHaveBeenCalledWith("a");
//            expect(b).toBe(1);
//        });
// 
//        it("should set an item", function () {
//            spyOn(localStorage, "setItem");
//            backend.setItem("K", "V");
//            expect(localStorage.setItem).toHaveBeenCalledWith("K", "\"V\"");
//        });
// 
//        it("should remove an item", function () {
//            spyOn(localStorage, "removeItem");
//            backend.removeItem("a");
//            expect(localStorage.removeItem).toHaveBeenCalledWith("a");
//        });
// 
//        it("should clear items", function () {
//            spyOn(localStorage, "clear");
//            backend.clear();
//            expect(localStorage.clear).toHaveBeenCalled();
//        });
//    });
//})();