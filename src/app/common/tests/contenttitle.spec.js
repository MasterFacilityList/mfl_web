"user script";

describe("Directives: Test the Content Title directive", function() {
    var $compile, $rootScope, title;
    //We"ll use this template for our tests
    var directiveTpl = "<content-title title='title'></content-title>";

    beforeEach(function() {
        //Require the module our directive is attached to
        module("mfl.common.directives");

        inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        //We want to set this before each test, so we can manipulate it
        title = [
            {
                icon: "fa-user",
                name: "Home"
            },
            {
                icon: "fa-user-md",
                name:"List"
            }
        ];
    });

    it("should create a Content Title element", function() {
        var $scope = $rootScope.$new();
        //The passing a template into $compile returns a "linking" function that can
        //be used to take a scope and apply it to the template
        var $element = $compile(directiveTpl)($scope);
        $scope.$digest();
        //Actual test
        expect($element.hasClass("main-title")).toBeTruthy();
    });

    it("should scope title to the directive title", function () {
        var $parent = $rootScope.$new();
        $parent.title = title;
        var $element = $compile(directiveTpl)($parent);
        //Angular provides the scope() method to retrieve an element"s scope
        var $directiveScope = $element.scope();
        //Confirm we have a new property title
        expect($directiveScope.title).toBeDefined();
        //Confirm our title lists are of the same length
        expect($directiveScope.title.length).toEqual(title.length);
    });

    it("should generate name and link elements for each title", function () {
        var $scope = $rootScope.$new();
        $scope.title = title;
        var $element = $compile(directiveTpl)($scope);
        //We're outside of the angular $watch loop here, so we need to call $digest manually
        $scope.$digest();
        //the jQLite wrapper provided by angular can only find elements by tag name.
        var $links = $element.find("i");
        expect($links.length).toEqual(title.length);
        //Testing the genarated link names

        expect($links.eq(0).attr("class")).toContain("fa-user");
        expect($links.eq(1).attr("class")).toContain("fa-user-md");
    });
});
