module.exports = (grunt) ->
  
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

	  jasmine:
	    src: ["js/*.js","js/**/*.js"]
	    options:
	      specs: "test/spec/*Spec.js"

  
  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  # Default task(s).
  grunt.registerTask "default", ["jasmine"]

