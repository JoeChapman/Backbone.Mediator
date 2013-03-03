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
			customTask: {
				src : ['mediator', 'events', 'utils'],
				options : {
					specs : '<%= meta.spec %>',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: {
							baseUrl: './src'
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
						beautify: false,
						max_line_length: 100,
						no_mangle: false
					},
					baseUrl: "./src",
					// ship with almond to remove need for requirejs
					name: 'vendor/almond',
					include: ['<%= pkg.main %>'],
					wrap: {
						start: "(function(global, define) {\n"+
						// check for amd loader on global namespace
						"  var globalDefine = global.define;\n",

						// main 'require's all library dependencies
						end:   "  var library = require('<%= pkg.main %>');\n"+
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
						"    global[ '<%= pkg.name %>' ] = library;\n"+
						"  }\n"+
						"}(this));\n"
					},
					out: '<%= pkg.name %>-min.js'
				}
			},
			concat: {
				options: {
					optimize: "none",
					baseUrl: "./src",
					// ship with almond to remove need for requirejs
					name: 'vendor/almond',
					include: ['<%= pkg.main %>'],
					wrap: {
						start: "(function(global, define) {\n"+
						// check for amd loader on global namespace
						"  var globalDefine = global.define;\n",

						// main 'require's all library dependencies
						end:   "  var library = require('<%= pkg.main %>');\n"+
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
						"    global[ '<%= pkg.name %>' ] = library;\n"+
						"  }\n"+
						"}(this));\n"
					},
					out: '<%= pkg.name %>.js'
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
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Custom tasks
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('test', ['jasmine']);
	grunt.registerTask('build', ['requirejs']);
	grunt.registerTask('default', ['lint', 'test', 'build']);

};
