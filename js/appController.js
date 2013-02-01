/**
* socr.controller is the controller object for the SOCR app.
*
*@author: selvam , ashwini 
*
*SOCR - Statistical Online Computational Resource
*/

socr.controller=function(model,view){
/* PRIVATE PROPERTIES   */
	view=view || new socr.view();		// [OBJECT] Reference to the Global App view object.
	var _id=0;						// Stores the id for setInterval in run mode
	var _runsElasped=0;				// Keeps count of number of resamples generated
	var _this;						// [OBJECT] contains reference to this obect.				
	var _noOfSteps=0;
	var _datapoints=model.getN();		//this can create problems...if the n value is changed after the intialization of the app
	var _stopCount=model.stopCount;
	var _count=model.getCount();	//Number of resamples already generated in the app...can create problems
	var _currentMode="dataDriven";  //App starts with dataDriven mode [default value]

/* PRIVATE METHODS   */

	/**
	*@method: [private] _generate()
	*@description:   This function generates 1000 resamples by calling the generateSample() of model.
	*@dependencies: generateSample()
	*/ 
	function _generate(){
	if(_runsElasped!=_noOfSteps)
		{
		var i=1000;
		while(i--)
			{			
			model.generateSample();
			}
		view.updateCounter();	
		_runsElasped++;
		}
	else
		{
		console.log(model.bootstrapGroupKeys);
		//view.updateSimulationInfo();
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
		/*ADDING EVENT LISTENERS STARTS*/
		$("#runButton").on('click',function(){
			console.log('Run Started');
			_this.run();
		});
		
		$("#stepButton").on('click',function(){
			console.log('Step pressed ');
			_this.step();
		});
		
		$("#stopButton").on('click',function(){
			console.log('Stop Pressed ');
			_this.stop();
		});
		
		$("#resetButton").on('click',function(){
			console.log('Reset pressed');
			_this.reset();
		});
		
		$("#infer").on('click',function(){
		/*^^^^^create loading gif ^^^^^^^^*/
			if(model.bootstrapGroupKeys.length==0)
				view.handleResponse('<h4 class="alert-heading">No Random samples to infer From!</h4>Please generate some random samples. Click "back" button on the controller to go to the "Generate Random Samples!" button.','error','controller-content');
			else
			_this.setDotplot();
		});
		
		$('#inputEditButton').on('click',function(){
			$('#accordion').accordion( "activate" , 0);
			$('.input-handle').trigger('click');
		});
		
		$("#showButton").on('click',function(){
			//a check to see if the sample count is 0 or not
			view.createList($('.show-list-start').val(),$('.show-list-end').val());
		});
		
		$('#startApp').on('click',function(){
			console.log('Launch button clicked');
			$('#welcome').animate({
				left:-2999},
				1000,
				'easeInCubic');
		});
		/*ADDING EVENT LISTENERS ENDS*/
	
		// Twitter Feed
		$('#tweetFeed').jTweetsAnywhere({
				searchParams: 'q=socr,doubt',
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
					refreshInterval: 15
					}
				}
			}); 
		$('#tweetbox').jTweetsAnywhere({
			showTweetBox:{
				counter: true,
				width: 380,
				height: 65,
				label: '<span style="color: #A4A4A4">Post your doubts here!</span>',
				defaultContent: '#simulation #socr',
				onTweet: function(textTweet, htmlTweet){
					alert('You tweeted: ' + textTweet);
				}
			}
		});

		//REDUNDENT....AS THE INPUT AND CONTROLLER TILE WILL NEVER OVERLAP
		//For deciding which tile should come over which one!
		$('#slide-out-input').on('click',function(){
			$('#slide-out-controller').css('z-index',0).css('opacity','0.8');
			$(this).css('z-index',20).css('opacity','1');
		});
		
		$('#slide-out-controller').on('click',function(){
			$('#slide-out-input').css('z-index',0).css('opacity','0.8');
			$(this).css('z-index',20).css('opacity','1');
		});
			
		$('#accordion').accordion();
		$('.dropdown-toggle').dropdown();
		$('.popups').popover();
		$('.tooltips').tooltip();
		view.createShowSlider();	
		
		/*  Adding tab feature to the input tile   */
		/*$('#myTab a').click(function (e) {
			
			
		});
		 */
		//$('#dataDriven-tab').unbind('click');
		//$('#simulationDriven-tab').unbind('click');

		$('#dataDriven-tab, #simulationDriven-tab').on('click',function(e){
			e.preventDefault();
			$(this).tab('show');
			console.log("current:"+_currentMode);
			console.log("future:"+e.target.id.split("-")[0]);
			if(e.target.id.split("-")[0] !== _currentMode)
					{
						console.log("mode being changed!");
						console.log("getdataset:"+model.getDataset());
					//check if model.getDataset() is true
						if(model.getDataset()!='')
							{console.log("Entered the loop");
								$('<div></div>').appendTo('body')
			                    .html('<div><h6>Moving from Data drive to Simulation Drive will reset the app!You want to continue?</h6></div>')
			                    .dialog({
			                        modal: true, 
									title: 'Reset Data?', 
									zIndex: 10000, 
									autoOpen: true,
			                        width: 'auto', 
									resizable: false,
			                        buttons: {
			                            Yes: function () {
			                            	_currentMode=e.target.id.split("-")[0];
			                            	if(e.target.id==="dataDriven-tab")
										  		{

										  			$("#accordion").accordion( "activate" , 0);
													$(this).update({to:'dataDriven'});		
										  		}
											else
												$(this).update({to:'simulationDriven'});
										$(this).dialog("close");					//close the confirmation window
			                            },
			                            No: function () {
										$('#myTab li:eq(0) a').tab('show');
			                                $(this).dialog("close");
			                            }
			                        },
			                        close: function (event, ui) {
			                            $(this).remove();
			                        }
                   				 });					
							}
						else
							{
								_currentMode=e.target.id.split("-")[0];
								if(e.target.id==="dataDriven-tab")
									{
							  			$("#accordion").accordion( "activate" , 0);
										$(this).update({to:'dataDriven'});		
									}
								else
									$(this).update({to:'simulationDriven'});
							}
							
					}

		});
	},
	
	/**
	*@method: setInput()
	*@description:not used till now....currently the input/js/script.js file calls setDataset function directly when the done button is pressed
	*/
	setInput:function(array){
	if(array.length === 0)
		return false;
	else
		{
		model.setDataset(array);
		//enable the buttons
		view.enableButtons();
		return true;
		}
	},
	
	/**
	*@method: step()
	*@description: It generates 1 random sample with animation effect showing the generation.
	*@dependencies: view.animate()
	*/
	step: function(){
		$("#accordion").accordion( "activate" , 1);
		if(socr.exp.controllerSliderState==1)
				{
				$('.controller-handle').trigger('click');
				}
		view.disableButtons();					//disabling buttons
		model.setN(nSize.val());				// save the datapoints size
	    var keys=model.generateStep();			//generate one sample
	    view.updateCounter();					//update counter
		$(".removable").remove();				//remove the previously generated canvas during animation
		view.animate({
			stopCount:$('#nSize').val(),
			speed:$('#speed').val(),
			indexes:keys.indexes,
			datasetIndexes:keys.datasetIndexes
		});										//show sample generation animation
		view.updateSlider();					//update slider count
		view.updateSimulationInfo();
	},
	
	/**
	*@method: run()
	*@description:It generates X random sample with animation effect showing the generation.
	*@param: X - gets it dynamically using DOM.
	*/
	run:function(){
        view.disableButtons();					//disabling buttons
		model.setStopCount($("#countSize").val());	//save the stopcount provided by user
		model.setN($("#nSize").val());				// save the datapoints size
		//generate samples
		var _temp=model.getStopCount()/1000;
		_noOfSteps=Math.ceil(_temp);
		var d=Date();
		console.log('start'+_runsElasped+d);
		_generate();
		_id=setInterval(_generate,0);
	},
	
	/**
	*@method: stop()
	*@description:It generates X random sample with animation effect showing the generation.
	*@param: X - gets it dynamically using DOM.
	*/
	stop:function(){
		var d=Date();
		console.log('end'+_runsElasped+d);
		view.updateSlider();
		clearInterval(_id);		//stop the setinterval function
		_runsElasped=0;			//reset the runelapsed count
		view.enableButtons();		//enable buttons
        },
	
	/**
	*@method: reset()
	*@description:It generates X random sample with animation effect showing the generation.
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
							model.setRSampleCount(0);		//reset the total count
							model.bootstrapGroupKeys={};
							model.bootstrapGroupValues={};
							model.resetVariables();
							view.reset();		//clearing all the canvas
							$('#showCount').html('');
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
		if(x=='simulationDriven')
			{
				socr.exp.current.createControllerView();
				socr.exp.current.initialize();
				
			}
		else
			{
				view.createControllerView();
				this.initialize();
				//check for input
				if(socr.exp.current)
					{
					if(socr.exp.current.getDataset()!='')
						{	console.log('simulation drive has some data');
						//alert(Experiment.getDataset());
							model.setDataset({
								keys:socr.exp.current.getDatasetKeys(),
								values:socr.exp.current.getDatasetValues(),
								processed:true
								});	
							//console.log(model.getDataset());
							//call to loadInputSheet to input the generated simulation data if any
						}	
						
					}
				else
					console.log("Experiment object not defined!");
				//set the input
				
			}
	
	}
 
    }//return
};