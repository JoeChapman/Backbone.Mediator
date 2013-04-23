"use strict";

module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig({

        meta : {
            src   : 'src/*.js',
            spec : 'specs/*.spec.js'
        },

        jasmine : {
            task: {
                src : 'src/mediator.js',
                options : {
                    specs : 'specs/mediator.spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './',
                            paths: {
                              'underscore': 'libs/underscore',
                              'backbone': 'libs/backbone'
                            },
                            shim: {
                                underscore: {
                                    exports: '_'
                                },
                                backbone: {
                                    deps: ["underscore"],
                                    exports: "Backbone"
                                }
                            }
                        }
                    }
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    uglify: {
                        toplevel: true,
                        ascii_only: true,
                        max_line_length: 100
                    },
                    baseUrl: './',
                    name : 'src/mediator.js',
                    paths: {
                      'underscore': 'libs/underscore',
                      'backbone': 'libs/backbone'
                    },
                    out: 'Backbone.Mediator-min.js'
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'src/mediator.js',
                'specs/mediator.spec.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('build', ['requirejs']);
    grunt.registerTask('default', ['lint', 'test', 'build']);

};
