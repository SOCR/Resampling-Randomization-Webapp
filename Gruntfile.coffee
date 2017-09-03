module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    coffee:
      compile:
        files:
          "test/spec/modelSpec.js": "test/spec/modelSpec.coffee"
          "test/spec/dataSpec.js": "test/spec/dataSpec.coffee"
      glob_to_multipe:
        # options:
          # sourceMap: true
        expand: true
        src: ['src/*.coffee']
        dest: 'build/'
        ext: '.js'

    concat:
      css:
        src:[
          "css/bootstrap.css"
          "css/bootstrap-responsive.css"
          "css/stylePagination.css"
          "css/jquery-ui.css"
          "css/input/table.css"
          "css/jquery.jtweetsanywhere-1.3.1.css"
          "css/common.css"
          "css/bootstrapSwitch.css"
          "css/vis.css"
          "css/default-table.css"
          "css/input/jquery.handsontable.full.css"
          "css/chardinjs/chardinjs.css"
          "css/SOCR_Tools_style.css"
          "css/loading.css"
          "bower_components/please-wait/build/please-wait.css"
        ]
        dest:"dist/app.css"
      js:
        src:[
          "src/init.js"
          "src/lib/jquery.min.js"
          "src/lib/async.js"
          "src/bootstrap/bootstrap.min.js"
          "src/exp/core.js"
          "src/exp/binomialCoin.js"
          "src/exp/ballAndUrn.js"
          "src/exp/cardExp.js"
          "src/exp/betaBinomial.js"
          "src/input/inputtable.js"
          "build/src/appModel.js"
          "build/src/appView.js"
          "build/src/appController.js"
          "build/src/appData.js"
          "src/lib/jquery-ui.min.js"
          "src/vis/d3.v2.min.js"
          "src/vis/vis.js"
          "src/jquery.paginate.js"
          "src/update.js"
          "src/lib/jtweet/jquery.jtweetsanywhere-1.3.1.min.js"
          "src/lib/jquery.transit.min.js"
          "src/lib/jquery.easing.1.3.js"
          "src/lib/jquery.pubsub.js"
          "src/lib/jquery.handsontable.full.js"
          "src/input/data.js"
          "src/input/worldbank.js"
          "src/vis/tooltip.js"
          "src/tools/FCal.js"
          "src/tools/ZCal.js"
          "src/lib/mustache/mustache.js"
          "src/lib/chardinjs/chardinjs.min.js"
          "src/tutorial/tutorial.js"
          "src/utils.js"          
          "src/bootstrap/bootstrapSwitch.js"
          "src/config.js"
          "src/bootstrap/bootstrap.min.js"
        ]
        dest:"dist/bundle.js"
    copy:
      main:
        files:[
          { 
            expand: true
            cwd: 'src'
            src: ['exp/*']
            dest: 'dist/'
            filter: 'isFile'
          }
          {
            expand: true
            cwd: 'src'
            src:'tutorial/tutorial-data.json'
            dest:'dist/'
            filter: 'isFile'
          }
        ]

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
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-copy"

  # Default task(s).
  grunt.registerTask "build", ["coffee","concat"]
  grunt.registerTask "compile", ["coffee"]
  grunt.registerTask "test", ["coffee","jasmine"]
  grunt.registerTask "default", ["coffee","concat","copy"]

