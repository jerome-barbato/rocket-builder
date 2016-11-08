/**
 * Created by dreimus on 01/09/16.
 */
module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files
        basePath: "..",

        frameworks: ['jasmine-jquery', 'jasmine'],

        // test results reporter to use
        reporters: ['spec'],

        browsers: ['PhantomJS'],

        // you can define custom flags
        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    settings: {
                        webSecurityEnabled: false
                    }
                },
                flags: ['--load-images=true'],
                debug: true
            }
        },

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        },

        // list of files / patterns to load in the browser
        files: [
            // serve html fixtures
            { pattern: "src/test/fixtures/*.html",
                watched: true,
                served: true,
                included: true },
            { pattern: "src/test/fixtures/*.js",
                watched: true,
                served: true,
                included: false
            },

            // serve core JS fixtures
            { pattern: "src/test/fixtures/core/libraries/*.js",
                watched: false,
                served: true,
                included: false
            },
            { pattern: "src/test/fixtures/core/polyfill/*.js",
                watched: false,
                served: true,
                included: false
            },
            { pattern: "src/test/fixtures/core/vendor/*.js",
                watched: false,
                served: true,
                included: false
            },

            // dependencies
            'src/js/vendor/jquery.min.js',

            "src/test/helpers/fixtures.js",

            // test
            'src/test/spec/*.js'
        ],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-jasmine-jquery'
        ]

    });
};