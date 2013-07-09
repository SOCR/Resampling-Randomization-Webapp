/**
* socr.controller is the controller object for the SOCR app.
*
*@author: selvam , ashwini 
*@return: {object}
*SOCR - Statistical Online Computational Resource
*/

socr.controller=function(model,view){
/* PRIVATE PROPERTIES   */
//	view=view || new socr.view();   // Reference to the Global App view object.
	var _id=0;						// Stores the id for setInterval in run mode
	var _runsElapsed=0;				// Keeps count of number of resamples generated
	var _this = this;						// contains reference to this object.
	var _noOfSteps=0;
	var _currentMode="Experiment";  //App starts with dataDriven mode [default value]

/* PRIVATE METHODS   */

	/**
	 *@method: [private] _generate()
	 *@description:   This function generates 1000 resamples by calling the generateSample() of model.
	 *@dependencies: generateSample()
	*/
	function _generate(){
        if(_runsElapsed!=_noOfSteps){
            var i=1000;
            while(i--){
                model.generateSample();
            }
            view.updateCounter();
            _runsElapsed++;
            var percent=Math.ceil((_runsElapsed/_noOfSteps)*100);
            view.updateStatus("update",percent);
        }
        else{
            view.updateCtrlMessage("samples generated sucessfully.","success",2000);
            view.updateStatus("finished");
            view.updateSimulationInfo();
            PubSub.publish("Random samples generated");
            _this.stop();
	    }
	}

/* PUBLIC METHODS */	
	return{
		currentMode:_currentMode,
	/**
	 *@method: [private] initialize()
	 *@description:Initializes the app..binds all the buttons...create the show slider
	*/
	initialize:function(){
		_this=this;
		console.log('initialize() invoked ');
		
		/*ADDING EVENT LISTENERS STARTS
		--------------------------------*/
		$('.controller-handle').on('click',view.toggleControllerHandle);

        $(".help").on("change click",function(e){
            e.preventDefault();
            socr.tutorial.toggleStatus();
            (socr.tutorial.getStatus() === "on")?$(".help").css("background-color","green").html("<a href='#'>Help : ON</a>"):$(".help").css("background-color","").html("<a href='#'>Help : OFF</a>");
        });

		$("#showButton").on('click',function(){
			//a check to see if the sample count is 0 or not
			view.createList($('.show-list-start').val(),$('.show-list-end').val());
		});
		PubSub.subscribe("Random samples generated",function(){
			var start = model.getRSampleCount()*0.5;
			var end = model.getRSampleCount();
			$( "#showCount" ).html( start + " - " + end );
			$('.show-list-start').val(start);
			$('.show-list-end').val(end);
			$("#showButton").trigger("click");
		});
		$('#startApp').on('click',function(){
			console.log('Launch button clicked');
			$('#welcome').animate({
				left:-2999},
				1000,
				'easeInCubic');
			$('#main').css('visibility', 'visible')
		});

		$("#share-instance-button").on('click',function(){
			$('.generate-response').html('');
			var html="<p>Dataset:<strong>"+model.getDataset()+"</strong></p>";
			html+="<p>Count Size:<strong>"+$("#countSize").val()+"</strong></p>";
			html+="<p>datapoints:<strong>"+$("#nSize").val()+"</strong></p>";
			$("#settings").html(html);
			
		});
		
		$("#generate-url-button").on('click',function(){
			if(model.getDataset()!=''){
				$("#url").val(baseUrl+"index.html?"+"type=url&dataset="+model.getDataset()+"&countSize="+$("#countSize").val()+"&nSize="+$("#nSize").val());
			}
			else{
				console.log('Dataset not initialised');
				var alertblock = '<div class="alert alert-block">Dataset not initialised</div>';
				$('.generate-response').html(alertblock);
			}
		});

		$("#reset-button").on("click",function() {
			_this.reset();
		});

		$('.input-controls').delegate('td','mousedown',function(){
  				table.startEdit( $(this) );
  				//console.log('Logging function called')
		});
		$('.input-controls').delegate('input#generateMatrix','click',function(){
			 console.log('Table Generated');
			 console.log(table.getMatrix());
			 //console.log(table.getMatrix)
		});
		$('.input-controls').delegate('input#submatrix','click',function(){
			var start = $('.input-controls').find('input[name="start"]').val(),
			end =   $('.input-controls').find('input[name="end"]').val();
			table.generateSub(start, end);
		});

		/*ADDING EVENT LISTENERS ENDS*/
	
		// Twitter Feed
		$('#tweetFeed').jTweetsAnywhere({
				searchParams: 'q=%23socrWebapp',
				count: 10,
				showTweetFeed: {
					autorefresh: {
						mode: 'trigger-insert',
						interval: 60
					},
					paging: {
					mode: 'more'
					},
					showTimestamp: {
					refreshInterval: 30
					}
				}
			}); 
			
		$('#accordion').accordion();
		$('.dropdown-toggle').dropdown();
		$('.popups').popover({
			html:true,
			trigger:'click',
			animation:true
		});
		$('.tooltips').tooltip();
		
		view.createShowSlider();	

	},

	initController:function(){
		
		$('.tooltips').tooltip();

        $('.controller-back').on('click',function(e){
            e.preventDefault();
            try{
            	console.log("exp_"+socr.exp.current.name);
                socr.dataTable.simulationDriven.init("exp_"+socr.exp.current.name);
            	socr.exp.current.initialize();
            }
            catch(err){
                console.log(err.message);
            }
        });
		$("#runButton").on('click',function(e){
            e.preventDefault();
			console.log('Run Started');
			socr.controller.run();
		});
		
		$("#stepButton").on('click',function(e){
            e.preventDefault();
            console.log('Step pressed ');
			socr.controller.step();
		});
		
		$("#stopButton").on('click',function(e){
            e.preventDefault();
            console.log('Stop Pressed ');
			socr.controller.stop();
		});
		
		$("#resetButton").on('click',function(e){
            e.preventDefault();
            console.log('Reset pressed');
			socr.controller.reset();
		});
		
		$("#infer").on('click',function(e){
            e.preventDefault();
            /*^^^^^create loading gif ^^^^^^^^*/
			if(model.getSample(1)==false){
				view.handleResponse('<h4 class="alert-heading">No Random samples to infer From!</h4>Please generate some random samples. Click "back" button on the controller to go to the "Generate Random Samples!" button.','error','controller-content');
            }
			else{
			    setTimeout(socr.controller.setDotplot,50);
                view.toggleControllerHandle("hide");
                setTimeout(function(){PubSub.publish("Dotplot generated")},500);
            }
		});

        $('#variable').on('change',function(){
	        if($(this).val()=='Mean' || $(this).val()=='Count'){
	            $("#index").attr("disabled",false);
	        }
    	    else{
    	        $("#index").attr("disabled",true);
    	    }
    	});

        $('#analysis').on('change',function(){
        	if($(this).val() === "Difference-Of-Proportions"){
        		socr.controller.setAnalysis({name:"Difference-Of-Proportions"});
        	}
	        if(socr.analysis[$(this).val()] !== "undefined"){
	        	var el="";
	        	$.each(socr.analysis[$(this).val()]["variables"],function(key,value){
	        		 el+='<option value="'+value+'">'+value.replace("-"," ")+'</option>';
	        	});
	        	$("#variable").html(el);
	        }
    	});

        try{
        	$('.controller-popups').popover({
			html:true
        	});
        }
        catch(e){
        	console.log(e.message)
        }

	},

	/**
	*@method: step()
	*@description: It generates 1 random sample with animation effect showing the generation.
	*@dependencies: view.animate()
	*/
	step: function(){
		$("#accordion").accordion( "activate" , 1);
        //socr.view.toggleControllerHandle("hide");
		view.disableButtons();					//disabling buttons
	    try{
            model.generateSample();			//generate one sample
            view.updateCounter();					//update counter
            $(".removable").remove();				//remove the previously generated canvas during animation
            view.updateSlider();					//update slider count
            view.updateSimulationInfo();
        }
        catch(e){
            console.log(e);
        }
        view.enableButtons();
		/*view.animate({
			stopCount:$('#nSize').val(),
			speed:$('#speed').val(),
			indexes:keys.indexes,
			datasetIndexes:keys.datasetIndexes
		});	*/									//show sample generation animation

	},
	
	/**
	*@method: run()
	*@description:It generates X random sample with animation effect showing the generation.
	*/
	run:function(){
        view.disableButtons();					//disabling buttons
        view.updateStatus("started");
		model.setStopCount($("#countSize").val());	//save the stopcount provided by user
		//generate samples
		var _temp=model.getStopCount()/1000;
		_noOfSteps=Math.ceil(_temp);
		var d=Date();
		console.log('start'+_runsElapsed+d);
		_generate();
		_id=setInterval(_generate,0);
	},
	
	/**
	*@method: stop()
	*@description:It resets the setInterval for _generate() ans halts the random sample generation immediately.
	*/
	stop:function(){
		var d=Date();
		console.log('end'+_runsElapsed+d);
		view.updateSlider();
		clearInterval(_id);		//stop the setinterval function
		_runsElapsed=0;			//reset the runelapsed count
		view.enableButtons();		//enable buttons
        },
	
	/**
	*@method: reset()
	*@description:It resets the application by clearing the appModel and appView.
	*/
	reset: function(){
	$('<div></div>').appendTo('body')
                    .html('<div><h6>Are you sure you want to reset? Data will be lost!</h6></div>')
                    .dialog({
                        modal: true, 
						title: 'Reset Data?', 
						zIndex: 10000, 
						autoOpen: true,
                        width: 'auto', 
						resizable: false,
                        buttons: {
                            Yes: function () {
							_this.stop();
							model.reset();
							view.reset();		    //clearing all the canvas
                            socr.exp.current={};    //deleting the current experiment instance
							view.toggleControllerHandle('hide');
							socr.dataTable.simulationDriven.resetScreen();
                            $(this).dialog("close");					//close the confirmation window
                            },
                            No: function () {
                                $(this).dialog("close");
                            }
                        },
                        close: function (event, ui) {
                            $(this).remove();
                        }
                    });
		},
    
	setDotplot:function(){
		$('#dotplot').html('');
        var index = parseInt($("#index").val());
        //create dotplot
		console.log("setdotplot started");
		console.log("variable:"+$('#variable').val());
		view.createDotplot({
            variable:$('#variable').val(),
            index:index
        });
	},
	
	loadController:function(setting){
		if(typeof setting !== "object"){
			return false;
		}
		if(setting.to === "dataDriven"){
			if(setting.from !== "undefined"){
	            socr.controller.setCurrentMode(setting.from);
	        }
	       	console.log('DataSet: '+model.getDataset());
        	PubSub.publish("Datadriven controller loaded");
			//checking for any dataset generated from experiment. If yes, they take priority and get loaded.
            if(!$.isEmptyObject(socr.exp.current)){
				if(socr.exp.current.getDataset()!=''){	
					console.log('simulation drive has some data');
					var result=model.setDataset({
							keys:socr.exp.current.getDatasetKeys(),
							values:socr.exp.current.getDatasetValues(),
							processed:true
						});
					if(result === true){
					    view.toggleControllerHandle('show');
                        view.updateSimulationInfo();
					}
				}	
			}
			else{
				console.log("Experiment object not defined!");
            }
            //set N to default values	
            model.setN();
            view.createControllerView();
		}
	},

	setCurrentMode:function(mode){
		if(mode != undefined){
			_currentMode = mode;
		}
		return true;
	},
	getCurrentMode:function(){
		return _currentMode;
	},

	setAnalysis:function(option){
		if(option.name !== "undefined" && option.name === "Difference-Of-Proportions"){
			//reset the random samples
			//socr.dataStore.removeObject("bootstrapGroup");
			/*
			TODO : warning - dataset will be modified .
			*/
			view.reset("samples");
			model.reset("samples");
			//merge the datasets
			var ma1 = $.merge(socr.dataStore.dataset[1].values.util.getData(),socr.dataStore.dataset[2].values.util.getData());
			var ma2 = $.merge(socr.dataStore.dataset[1].keys.util.getData(),socr.dataStore.dataset[2].keys.util.getData());
			//save the common dataset in both
			// Now the random samples generated will be from the common data pool.
			socr.dataStore.dataset[1].values.util.setData(ma1);
			socr.dataStore.dataset[2].values.util.setData(ma1);

			socr.dataStore.dataset[1].keys.util.setData(ma2);
			socr.dataStore.dataset[2].keys.util.setData(ma2);



		}

	}
 
    }//return
};