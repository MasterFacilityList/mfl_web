"user script";

describe("Directives: Test the breadcrumbs directive", function() {
    var $compile, $rootScope, path;
    //We"ll use this template for our tests
    var directiveTpl = "<breadcrumbs path='path'></breadcrumbs>";

    beforeEach(function() {
        //Require the module our directive is attached to
        module("mfl.common.directives");

        inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        //We want to set this before each test, so we can manipulate it
        path = [
            {
                name: "name",
                route: "route"
            },
            {
                name: "name1",
                route:"route.route1"
            }
        ];
    });

    it("should create a breadcrumb element", function() {
        var $scope = $rootScope.$new();
        //The passing a template into $compile returns a "linking" function that can
        //be used to take a scope and apply it to the template
        var $element = $compile(directiveTpl)($scope);
        $scope.$digest();
        //Actual test
        expect($element.hasClass("breadcrumb")).toBeTruthy();
    });
    
    it("should scope path to the directive path", function () {
        var $parent = $rootScope.$new();
        $parent.path = path;
        var $element = $compile(directiveTpl)($parent);
        //Angular provides the scope() method to retrieve an element"s scope
        var $directiveScope = $element.scope();
        //Confirm we have a new property path
        expect($directiveScope.path).toBeDefined();
        //Confirm our path lists are of the same length
        expect($directiveScope.path.length).toEqual(path.length);
    });

    it("should generate name and link elements for each path", function () {
        var $scope = $rootScope.$new();
        $scope.path = path;
        var $element = $compile(directiveTpl)($scope);
        //We"re outside of the angular $watch loop here, so we need to call $digest manually
        $scope.$digest();
        //the jQLite wrapper provided by angular can only find elements by tag name. 
        var $links = $element.find("li");
        expect($links.length).toEqual(path.length);
        //Testing the genarated link names
        expect($links.eq(0).text()).toContain("name");
        expect($links.eq(1).text()).toContain("name1");
    });
});