###
  socr.controller is the controller object for the SOCR app.

  @author: selvam , ashwini
  @return: {object}
  SOCR - Statistical Online Computational Resource
###
socr.controller = (model, view) ->

  # PRIVATE PROPERTIES

  _id = 0 # Stores the id for setInterval in run mode
  _runsElapsed = 0 # Keeps count of number of resamples generated
  _this = this
  _noOfSteps = 0
  _currentMode = "Experiment" #App starts with dataDriven mode [default value]

  # PRIVATE METHODS

  ###
  @method: [private] _generate()
  @description:   This function generates 1000 resamples by calling the generateSample() of model.
  @dependencies: generateSample()
  ###
  _generate = ->
    unless _runsElapsed is _noOfSteps
      i = 1000
      model.generateSample()  while i--
      view.updateSlider()
      _runsElapsed++
      percent = Math.ceil((_runsElapsed / _noOfSteps) * 100)
      view.updateStatus "update", percent
    else
      PubSub.publish "random samples generated", {'sampleCount':model.getRSampleCount()}
      _this.stop()
    return

  # PUBLIC METHODS

  currentMode: _currentMode

  ###
  @method: [private] initialize()
  @description:Initializes the app..binds all the buttons...create the show slider
  ###
  initialize: ->
    _this = this
    console.log "initialize() invoked "

    #ADDING EVENT LISTENERS STARTS
    #--------------------------------
    $(".controller-handle").on "click", view.toggleControllerHandle

    $(".help").on "change click", (e) ->
      e.preventDefault()
      socr.tutorial.toggleStatus()
      (if (socr.tutorial.getStatus() is "on") then $(".help").css("background-color", "green").html("<a href='#'>Help : ON</a>") else $(".help").css("background-color", "").html("<a href='#'>Help : OFF</a>"))
      return

    $("#showButton").on "click", ->
      #a check to see if the sample count is 0 or not
      view.createList $(".show-list-start").val(), $(".show-list-end").val()
      return


    $("#startApp").on "click", ->
      console.log "Launch button clicked"
      $("#welcome").animate
        left: -2999
      , 1000, "easeInCubic"
      $("#main").css "visibility", "visible"
      return

    $("#share-instance-button").on "click", ->
      $(".generate-response").html ""
      html = "<p>Dataset:<strong>" + model.getDataset() + "</strong></p>"
      html += "<p>Count Size:<strong>" + $("#countSize").val() + "</strong></p>"
      html += "<p>datapoints:<strong>" + $("#nSize").val() + "</strong></p>"
      $("#settings").html html
      return

    $("#generate-url-button").on "click", ->
      unless model.getDataset() is ""
        $("#url").val baseUrl + "index.html?" + "type=url&dataset=" + model.getDataset() + "&countSize=" + $("#countSize").val() + "&nSize=" + $("#nSize").val()
      else
        console.log "Dataset not initialised"
        alertblock = "<div class=\"alert alert-block\">Dataset not initialised</div>"
        $(".generate-response").html alertblock
      return

    $("#reset-button").on "click", ->
      _this.reset()
      return

    $(".input-controls").delegate "td", "mousedown", ->
      table.startEdit $(this)
      return


    #console.log('Logging function called')
    $(".input-controls").delegate "input#generateMatrix", "click", ->
      console.log "Table Generated"
      console.log table.getMatrix()
      return


    #console.log(table.getMatrix)
    $(".input-controls").delegate "input#submatrix", "click", ->
      start = $(".input-controls").find("input[name=\"start\"]").val()
      end = $(".input-controls").find("input[name=\"end\"]").val()
      table.generateSub start, end
      return


    #ADDING EVENT LISTENERS ENDS

    # Twitter Feed
    # $('#tweetFeed').jTweetsAnywhere({
    #     searchParams: 'q=%23socrWebapp',
    #     count: 10,
    #     showTweetFeed: {
    #       autorefresh: {
    #         mode: 'trigger-insert',
    #         interval: 60
    #       },
    #       paging: {
    #       mode: 'more'
    #       },
    #       showTimestamp: {
    #       refreshInterval: 30
    #       }
    #     }
    #   });
    $("#accordion").accordion()
    $(".dropdown-toggle").dropdown()
    $(".popups").popover
      html: true
      trigger: "click"
      animation: true

    $(".tooltips").tooltip()
    view.createShowSlider()
    return

  initController: ->

    # set the K - value in model.
    model.setK()
    $(".tooltips").tooltip()
    $(".controller-back").on "click", (e) ->
      e.preventDefault()
      try
        model.reset()
        view.reset()
        console.log "exp_" + socr.exp.current.name
        socr.dataTable.simulationDriven.init "exp_" + socr.exp.current.name
        socr.exp.current.initialize()
      catch err
        console.log err.message
      return

    $("#runButton").on "click", (e) ->
      e.preventDefault()
      console.log "Run Started"
      setTimeout socr.controller.run, 500
      return

    $("#stepButton").on "click", (e) ->
      e.preventDefault()
      console.log "Step pressed "
      socr.controller.step()
      return

    $("#stopButton").on "click", (e) ->
      e.preventDefault()
      console.log "Stop Pressed "
      socr.controller.stop()
      return

    $("#resetButton").on "click", (e) ->
      e.preventDefault()
      console.log "Reset pressed"
      socr.controller.reset()
      return

    $("#infer").on "click", (e) ->
      e.preventDefault()

      #^^^^^create loading gif ^^^^^^^^
      if model.getSample(1) is false
        view.handleResponse "<h4 class=\"alert-heading\">No Random samples to infer From!</h4>Please generate some random samples. Click \"back\" button on the controller to go to the \"Generate Random Samples!\" button.", "error", "controller-content"
      else
        setTimeout socr.controller.setDotplot, 50
        view.toggleControllerHandle "hide"
        setTimeout (->
          PubSub.publish "Dotplot generated"
          return
        ), 500
      return

    $("#variable").on "change", ->
      if $(this).val() is "Mean" or $(this).val() is "Count"
        $("#index").attr "disabled", false
      else
        $("#index").attr "disabled", true
      return

    $("#analysis").on "change", ->
      if socr.analysis[$(this).val()] isnt "undefined"
        el = ""
        $.each socr.analysis[$(this).val()]["variables"], (key, value) ->
          el += "<option value=\"" + value + "\">" + value.replace("-", " ") + "</option>"
          return

        $("#variable").html el
      return

    $(".update").on "click", ->
      val = []
      $.each $(".nValues"), (k, v) ->
        val.push $(v).val()
        return

      socr.model.setN val
      return

    try
      $(".controller-popups").popover html: true
    catch e
      console.log e.message
    return


  ###
  @method: step()
  @description: It generates 1 random sample with animation effect showing the generation.
  @dependencies: view.animate()
  ###
  step: ->
    $("#accordion").accordion "activate", 1

    #socr.view.toggleControllerHandle("hide");
    view.disableButtons() #disabling buttons
    try
      model.generateSample() #generate one sample
      $(".removable").remove() #remove the previously generated canvas during animation
      PubSub.publish "random samples generated"
    catch e
      console.log e
    view.enableButtons()
    return


  #view.animate({
  #     stopCount:$('#nSize').val(),
  #     speed:$('#speed').val(),
  #     indexes:keys.indexes,
  #     datasetIndexes:keys.datasetIndexes
  #   });
  #show sample generation animation

  ###
  @method: run()
  @description:It generates X random sample with animation effect showing the generation.
  ###
  run: ->
    view.disableButtons() #disabling buttons
    view.updateStatus "started"
    model.setStopCount $("#countSize").val() #save the stopcount provided by user
    #generate samples
    _temp = model.getStopCount() / 1000
    _noOfSteps = Math.ceil(_temp)
    d = Date()
    console.log "start" + _runsElapsed + d
    _generate()
    _id = setInterval(_generate, 0)
    return


  ###
  @method: stop()
  @description:It resets the setInterval for _generate() ans halts the random sample generation immediately.
  ###
  stop: ->
    d = Date()
    console.log "end" + _runsElapsed + d
    view.updateSlider()
    clearInterval _id #stop the setinterval function
    _runsElapsed = 0 #reset the runelapsed count
    view.enableButtons() #enable buttons
    return


  ###
  @method: reset()
  @description:It resets the application by clearing the appModel and appView.
  ###
  reset: ->
    $("<div></div>").appendTo("body").html("<div><h6>Are you sure you want to reset everything? Data will be lost!</h6></div>").dialog
      modal: true
      title: "Reset Data?"
      zIndex: 10000
      autoOpen: true
      width: "auto"
      resizable: false
      buttons:
        Yes: ->
          _this.stop()
          model.reset()
          socr.exp.current = {} #deleting the current experiment instance
          view.toggleControllerHandle "hide"
          socr.dataTable.simulationDriven.resetScreen()
          $(this).dialog "close" #close the confirmation window
          return

        No: ->
          $(this).dialog "close"
          return

      close: (event, ui) ->
        $(this).remove()
        return

    return

  setDotplot: (precision)->
    $("#dotplot").html ""
    index = parseInt($("#index").val())
    precision = $('#result-precision').attr('checked')
    if precision is "checked"
      precision = 3
    #create dotplot
    console.log "setdotplot started"
    console.log "variable:" + $("#variable").val()
    view.createDotplot
      variable: $("#variable").val()
      precision: precision
      index: index

    return

  ###
	@method: loadController()
	@description: Single point of contact to load the controller tab and set the dataset
	###

  loadController: (setting) ->
    result = undefined
    return false  if typeof setting isnt "object"
    if setting.to is "dataDriven"
      socr.controller.setCurrentMode setting.from  if setting.from isnt "undefined"
      PubSub.publish "Datadriven controller loaded"

      #If experiment , then check for data
      _name = ""
      if setting.from is "Experiment" and not $.isEmptyObject(socr.exp.current) and socr.exp.current.getDataset() isnt ""
        console.log "simulation drive has some data"
        result = model.setDataset(
          keys: socr.exp.current.getDatasetKeys()
          values: socr.exp.current.getDatasetValues()
          processed: true
        )
      else if setting.from is "spreadSheet"
        _name = "Data Driven Experiment"
        result = model.setDataset(setting.data)
      else
        return
      if result is true
        view.updateSimulationInfo _name
        view.toggleControllerHandle "show"
        model.setN()
        view.createControllerView()
      return


  setCurrentMode: (mode) ->
    _currentMode = mode  unless mode is `undefined`
    true

  getCurrentMode: ->
    _currentMode
#return
