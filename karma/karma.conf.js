module.exports = function ( config ) {
  config.set({
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: "../",

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
        "vendor/jquery/dist/jquery.js",
        "vendor/toastr/toastr.js",
        "vendor/underscore/underscore.js",
        "vendor/bootstrap/dist/js/bootstrap.js",
        "vendor/angular/angular.js",
        "vendor/spin.js/spin.js",
        "vendor/leaflet/dist/leaflet-src.js",
        "vendor/leaflet.markercluster/dist/leaflet.markercluster.js",
        "vendor/Leaflet.label/dist/leaflet.label.js",
        "vendor/leaflet-spin/leaflet.spin.js",
        "src/assets/js/leaflet-heat.js",
        "vendor/angular-animate/angular-animate.js",
        "vendor/angular-cookies/angular-cookies.js",
        "vendor/angular-resource/angular-resource.js",
        "vendor/angular-bootstrap/ui-bootstrap.js",
        "vendor/angular-bootstrap/ui-bootstrap-tpls.js",
        "vendor/angular-mocks/angular-mocks.js",
        "vendor/angular-ui-router/release/angular-ui-router.js",
        "vendor/angular-sanitize/angular-sanitize.js",
        "vendor/angular-leaflet-directive/dist/angular-leaflet-directive.js",
        "vendor/modernizr/modernizr.js",
        "vendor/typeahead.js/dist/bloodhound.js",
        "vendor/typeahead.js/dist/typeahead.bundle.js",
        "vendor/typeahead.js/dist/typeahead.jquery.js",
        "vendor/stacktrace-js/dist/stacktrace.js",
        "vendor/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect.js",
        "vendor/ng-tags-input/ng-tags-input.js",
        "vendor/moment/moment.js",
        "vendor/modernizr/modernizr.js",
        "vendor/d3/d3.js",
        "vendor/c3/c3.js",
        "libs/api_wrapper.js",
        "libs/sil_typeahead_service/src/sil-typeahead.js",
        "libs/sil_grid/sil_grid_tpls.js",
        "libs/sil_grid/sil_grid.js",
        "libs/error_handler.js",
        "src/settings.js",
        "src/**/*.js",
        "build/templates-common.js",
        "build/templates-app.js"
    ],
    exclude: [
      "src/assets/**/*.js"
    ],
    frameworks: [
        "jasmine"
    ],
    plugins: [
        "karma-jasmine",
        "karma-firefox-launcher",
        "karma-phantomjs-launcher",
        "karma-brackets"
    ],

    /**
     * How to report, by default.
     */
    reporters: [
        "brackets",
        "progress"

    ],


    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9030,
    runnerPort: 9120,
    urlRoot: "/",

    /**
     * Disable file watching by default.
     */
    autoWatch: true,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you"re running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      "Firefox","PhantomJS"
    ],

  });
};
