module.exports = function ( karma ) {

    "use strict";

    var karma_config = {
        /**
         * From where to look for files, starting with the location of this file.
         */
        basePath: "../",

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
          <% scripts.forEach( function ( file ) { %>"<%= file %>",
          <% }); %>
          "src/**/*.js"
        ],

        exclude: [
        ],

        frameworks: [
            "jasmine"
        ],

        logLevel: karma.LOG_INFO,

        plugins: [
            "karma-jasmine",
            "karma-firefox-launcher",
            "karma-chrome-launcher",
            "karma-sauce-launcher",
            "karma-coverage",
            "karma-threshold-reporter",
            "karma-coffee-preprocessor",
            "karma-mocha-reporter",
            "karma-htmlfile-reporter"
        ],

        preprocessors: {
            "**/*.coffee": "coffee",
            "src/app/**/*.js": ["coverage"]
        },

        /**
         * How to report, by default.
         */
        reporters: [
            "progress",
            "coverage",
            "threshold",
            "mocha",
            "html"
        ],

        /**
         * On which port should the browser connect, on which port is the test runner
         * operating, and what is the URL path for the browser to use.
         */
        port: 9019,
        runnerPort: 9110,
        urlRoot: "/",

        /**
         * Disable file watching by default.
         */
        autoWatch: false,

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
            "Firefox",
            "Chrome"
        ],

        htmlReporter: {
            outputFile: "html_tests/units.html",

            // Optional
            pageTitle: "MFL Public Unit Tests",
            subPageTitle: "Unit Tests Results"
        },

        coverageReporter: {
            dir: "coverage/",
            reporters: [
                {
                    type: "html",
                    subdir: "html/"
                },
                {
                    type: "text"
                },
                {
                    type: "text-summary"
                }
            ]
        },

        thresholdReporter: {
            statements: 100,
            branches: 100,
            lines: 100,
            functions: 100
        }
    };

    var run_sauce_tests = process.env.RUN_SAUCE_TESTS === "true";

    if (run_sauce_tests) {
        if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
            throw new Error("SauceLabs credentials not set");
        }

        karma_config.customLaunchers = {
            SL_Chrome: {
                base: "SauceLabs",
                browserName: "chrome",
                version: "35",
                platform: "Windows 7"
            },
            SL_Firefox: {
                base: "SauceLabs",
                browserName: "firefox",
                version: "30",
                platform: "Windows 7"
            },
            SL_IE_11: {
                base: "SauceLabs",
                browserName: "internet explorer",
                version: "11"
            },
            SL_IE_10: {
                base: "SauceLabs",
                browserName: "internet explorer",
                version: "10"
            },
            SL_Opera: {
                base: "SauceLabs",
                browserName: "opera",
                version: "11",
                platform: "Windows 7"
            }
        };

        karma_config.captureTimeout = 120000;
        karma_config.sauceLabs = {
            testName: "MFL Public App JS Unit Testing"
        };
        karma_config.browsers = karma.browsers.concat(
            Object.keys(karma_config.customLaunchers)
        );
        karma_config.reporters.push("saucelabs");
    }

    karma.set(karma_config);
};
