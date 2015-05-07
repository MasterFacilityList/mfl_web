"user script";

describe("Directives: Test the Action Bar directive", function() {
    var $compile, $rootScope, action;
    //We"ll use this template for our tests
    var directiveTpl = "<actionbar action='action'></actionbar>";

    beforeEach(function() {
        //Require the module our directive is attached to
        module("mfl.common.directives");

        inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        //We want to set this before each test, so we can manipulate it
        action = [
            {
                func: "fa-user",
                class: "btn",
                color: ""
            },
            {
                func: "fa-user-md",
                class:"btn-primary",
                color:""
            }
        ];
    });

    it("should create a Action Bar element", function() {
        var $scope = $rootScope.$new();
        //The passing a template into $compile returns a "linking" function that can
        //be used to take a scope and apply it to the template
        var $element = $compile(directiveTpl)($scope);
        $scope.$digest();
        //Actual test
        expect($element.hasClass("action-container")).toBeTruthy();
    });
    
    it("should scope action to the directive action", function () {
        var $parent = $rootScope.$new();
        $parent.action = action;
        var $element = $compile(directiveTpl)($parent);
        //Angular provides the scope() method to retrieve an element"s scope
        var $directiveScope = $element.scope();
        //Confirm we have a new property action
        expect($directiveScope.action).toBeDefined();
        //Confirm our action lists are of the same length
        expect($directiveScope.action.length).toEqual(action.length);
    });

    it("should generate name and link elements for each action", function () {
        var $scope = $rootScope.$new();
        $scope.action = action;
        var $element = $compile(directiveTpl)($scope);
        //We're outside of the angular $watch loop here, so we need to call $digest manually
        $scope.$digest();
        //the jQLite wrapper provided by angular can only find elements by tag name. 
        var $links = $element.find("a");
        expect($links.length).toEqual(action.length);
        //Testing the genarated link names

        expect($links.eq(0).attr("class")).toContain("btn");
        expect($links.eq(1).attr("class")).toContain("btn-primary");
    });
});