"use strict";

describe("Directives: Test the breadcrumbs directive", function() {
    var $compile, $rootScope; 
    var directiveTpl = "<div class='content'>" + 
    "<span id='mini' sidebar-toogle>toogle</span>" +
    "</div>";

    beforeEach(function() {
        module("mfl.common.directives");

        inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    it("should var click event defined", function() {
        var $scope = $rootScope.$new();
        var $element = $compile(directiveTpl)($scope);
        $scope.$digest();
        var toClick = $element.find("#mini");
        toClick.triggerHandler("click");
        expect($element).toBeDefined(); 
        expect($rootScope.offsetClass).toBe("left-col-hidden");
    });
    
    it("should var click event defined", function() {        
        var $scope = $rootScope.$new();
        $rootScope.offsetClass = "class";
        var $element = $compile(directiveTpl)($scope);
        $scope.$digest();
        var toClick = $element.find("#mini");
        toClick.triggerHandler("click");
        expect($element).toBeDefined(); 
        expect($rootScope.offsetClass).toBe("");
    });
});