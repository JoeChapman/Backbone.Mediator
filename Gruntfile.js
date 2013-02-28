"use strict";

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		dirs: {
			src: 'src',
			spec: 'specs',
			dest: 'dist/<%= pkg.name %>/<%= pkg.version %>'
		},

		meta : {
			src   : '<%= dirs.src %>/*.js',
			spec : '<%= dirs.spec %>/*.spec.js'
		},

		watch: {
			test : {
				files: ['<%= meta.src %>','<%= meta.spec %>'],
				tasks: 'test'
			}
		},

		jasmine : {
			src : ['mediator', 'events', 'utils'],
			options : {
				specs : '<%= meta.spec %>',
				// host : 'http://127.0.0.1:8000',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfig: {
						baseUrl: './src'
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
						beautify: false,
						max_line_length: 100,
						no_mangle: false
					},
					baseUrl: "./src",
					name: 'vendor/almond',
					include: ['mediator', 'events', 'utils'],
					wrap: {
						start: "(function(global, define) {\n"+
						// check for amd loader on global namespace
						"  var globalDefine = global.define;\n",

						// require the first item in the includes array as the library
						// TODO - replzce this with a main.js script to load all dependencies.
						end:   "  var library = require(<%= requirejs.compile.options.include[0] %>);\n"+
						"  if(typeof module !== 'undefined' && module.exports) {\n"+
						// export library for node
						"    module.exports = library;\n"+
						"  } else if(globalDefine) {\n"+
						// define library for global amd loader that is already present
						"    (function (define) {\n"+
						"      define(function () { return library; });\n"+
						"    }(globalDefine));\n"+
						"  } else {\n"+
						// define the library as the project name on the global namespace for inline script loading
						"    global[ <%= pkg.name %> ] = library;\n"+
						"  }\n"+
						"}(this));\n"
					},
					out: '<%= pkg.name %>-min.js'
				}
			}
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'<%= meta.src %>',
				'<%= meta.spec %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Custom tasks
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('test', ['jasmine']);
	grunt.registerTask('build', ['requirejs']);
	grunt.registerTask('default', ['lint', 'test', 'build']);

};
