module.exports = (grunt) ->
  
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    coffee:
      compile:
        files:
          "js/appController.js": "js/appController.coffee"
          "js/appModel.js": "js/appModel.coffee"
          "js/appView.js": "js/appView.coffee"
          "js/appData.js": "js/appData.coffee"
    jasmine:
      #ideally the src should concatenated files.
      src: ["js/init.js","js/lib/jquery.min.js","js/utils.js","js/lib/jquery.pubsub.js","js/tools/Fcal.js","js/tools/Zcal.js","js/exp/core.js","js/appModel.js","js/appData.js"]
      options:
        specs: "test/spec/*Spec.js"

    jshint:
      files:"js/appController.js"


  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-jasmine"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-coffee"

  # Default task(s).
  #grunt.registerTask "build" , ["coffee","concat","minify"]
  grunt.registerTask "compile", ["coffee"]
  grunt.registerTask "test", ["coffee","jasmine"]

