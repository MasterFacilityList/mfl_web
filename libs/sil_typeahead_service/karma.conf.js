// Karma configuration
// Generated on Sat Feb 07 2015 15:28:52 GMT+0300 (EAT)


// base path, that will be used to resolve files and exclude
module.exports = function(config) {
  config.set({
    // your config
    basePath : '',

    //testing framework
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files : [
      'bower_components/angular/angular.js',
      'bower_components/underscore/underscore.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/typeahead.js/src/common/utils.js',
      'bower_components/typeahead.js/src/bloodhound/version.js',
      'bower_components/typeahead.js/src/bloodhound/tokenizers.js',
      'bower_components/typeahead.js/src/bloodhound/lru_cache.js',
      'bower_components/typeahead.js/src/bloodhound/persistent_storage.js',
      'bower_components/typeahead.js/src/bloodhound/transport.js',
      'bower_components/typeahead.js/src/bloodhound/search_index.js',
      'bower_components/typeahead.js/src/bloodhound/options_parser.js',
      'bower_components/typeahead.js/src/bloodhound/bloodhound.js',
      'bower_components/typeahead.js/src/typeahead/html.js',
      'bower_components/typeahead.js/src/typeahead/css.js',
      'bower_components/typeahead.js/src/typeahead/event_bus.js',
      'bower_components/typeahead.js/src/typeahead/event_emitter.js',
      'bower_components/typeahead.js/src/typeahead/highlight.js',
      'bower_components/typeahead.js/src/typeahead/input.js',
      'bower_components/typeahead.js/src/typeahead/dataset.js',
      'bower_components/typeahead.js/src/typeahead/dropdown.js',
      'bower_components/typeahead.js/src/typeahead/typeahead.js',
      'bower_components/typeahead.js/src/typeahead/plugin.js',
      'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      'bower_components/jasmine-ajax/lib/mock-ajax.js',
      'bower_components/sil-api-wrapper/src/api_wrapper.js',
      'src/*.js',
      'tests/*.js',
    ],

    // list of files to exclude
    exclude: [

    ],

    //register preprocessors
    preprocessors : {
      'src/*.js': 'coverage'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit'
    reporters: ['progress','coverage'],


    // web server port
    port : 9876,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,


    plugins: [
        'karma-jasmine',
        'karma-phantomjs-launcher',
        'karma-threshold-reporter',
        'karma-coverage'
    ],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
          {
              type: 'html',
              subdir: 'html/'
          },
          {
              type: 'text'
          },
          {
              type: 'text-summary'
         }
      ]
    },

    thresholdReporter: {
      statements: 85,
      branches: 85,
      lines: 85,
      functions: 65
    }

 });
};
