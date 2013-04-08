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
	var _currentMode="dataDriven";  //App starts with dataDriven mode [default value]

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
            _this.stop();
	    }
	}

/* PUBLIC METHODS */	
	return{
	/**
	 *@method: [private] initialize()
	 *@description:Initializes the app..binds all the buttons...create the show slider
	*/
	initialize:function(){
		_this=this;
		console.log('initialize() invoked ');
		
		/*ADDING EVENT LISTENERS STARTS
		--------------------------------*/
		$('.controller-handle').on('click',socr.view.toggleControllerHandle);

		$("#showButton").on('click',function(){
			//a check to see if the sample count is 0 or not
			socr.view.createList($('.show-list-start').val(),$('.show-list-end').val());
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
		$('.popups').popover();
		$('.tooltips').tooltip();
		
		view.createShowSlider();	

	},

	initController:function(){
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
			if(socr.model.getSample(1)==false){
				socr.view.handleResponse('<h4 class="alert-heading">No Random samples to infer From!</h4>Please generate some random samples. Click "back" button on the controller to go to the "Generate Random Samples!" button.','error','controller-content');
            }
			else{
			    socr.controller.setDotplot();
                socr.view.toggleControllerHandle("hide");
            }
		});
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
		model.setN($("#nSize").val());				// save the datapoints size
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
		model.setN($("#nSize").val());				// save the datapoints size
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
		//create dotplot
		console.log("setdotplot started");
		console.log("variable:"+$('#variable').val());
		view.createDotplot({variable:$('#variable').val()});
	},
	
	loadController:function(x){
		if(x=='simulationDriven'){
			socr.exp.current.createControllerView();
			socr.exp.current.initialize();
		}
		else{

			//check for input
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
					}
					console.log(model.getDataset(1));
					//call to loadInputSheet to input the generated simulation data if any
				}	
			}
			else
				console.log("Experiment object not defined!");
				//set the input
            view.createControllerView();
        }
	}
 
    }//return
};