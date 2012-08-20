/**
*  appController.js is the controller object for the SOCR app.
*
*@author: selvam , ashwini 
*
*SOCR - Statistical Online Computational Resource
*/

var appController=function(appModel,view){
/* PRIVATE PROPERTIES   */
	model=appModel;
	view=view || new appView();
	
	var _id=0;					//stores the id for setInterval in run mode
	var _runsElasped=0;			//keeps count of number of resamples generated
	var _this;
	var _noOfSteps=0;
	var _datapoints=model.getN();		//this can create problems...if the n value is changed after the intialization of the app
	var _stopCount=model.stopCount;
	var _count=model.getCount();		//number of resamples already generated in the app...can create problems

/* PRIVATE METHODS   */

/*this function generates 1000 resamples by calling the generateSample() of model.*/
function _generate(){
	if(_runsElasped!=_noOfSteps)
		{
		var i=1000;
		while(i--)
			{			
			model.generateSample();
			//console.log(model.bootstrapSamples[i]);
			}
		//alert(model);
		//console.log(model.bootstrapSamples[4]);
		view.updateCounter();	
		_runsElasped++;
		}
	else
		{
		_this.stop();
		
		}
	}

/* PUBLIC METHODS   */	
return{
	
/*initializes the app..binds all the buttons...create the show slider*/
	initialize:function(){
		_this=this;
		console.log('initialization started');
		//add event listeners
		
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
		_this.setDotplot();
		});
		$("#doneButton").on('click',function(){
		console.log('Done Pressed');
		if(_this.setInput()==false)
			alert('Input some correct data!');
		});
		
		//create a slider
		view.createSlider();
		$('.dropdown-toggle').dropdown();
		$('.popups').popover();
		
		// Twitter Feed
		$('#tweetFeed').jTweetsAnywhere({
				searchParams: 'q=simulation',
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
		
			$('#inputEditButton').on('click',function(){
				$('#accordion').accordion( "activate" , 0);
			});
			
			/*
			 * Bind show button to createList function in appView.js
			 */
			$("#showButton").on('click',function(){
				//a check to see if the sample count is 0 or not
				view.createList($('#showCount').text());
			});
			
			$('#startApp').on('click',function(){
				console.log('Start App button clicked');
				$('#welcome').animate({
					left:-2999},
					1000,
					'easeInCubic');
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
			
			
			/**
			*Slide out feature ends
			*/
			$('#accordion').accordion();
			$('.dropdown-toggle').dropdown();
			$('.popups').popover();
			
			/*  Adding tab feature to the input tile   */
			$('#myTab a').click(function (e) {
			  e.preventDefault();
			  $(this).tab('show');
			});
		 
			$('#dataDriven-tab').on('click',function(){
			  //WARNING PROMPT
			  $("#accordion").accordion( "activate" , 0);
				$(this).update({to:'dataDriven'});
			});
			
			$('#simulationDriven-tab').on('click',function(){
			  //WARNING PROMPT
			  var self=this;
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
		
			});
		
		
		console.log('initialization done');
	},
	/*not used till now....currently the input/js/script.js file calls setDataset function directly when the done button is pressed*/
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
	
	step: function(){
		if(controllerSliderState==1)
				{
				console.log("controllerSliderState:"+controllerSliderState);
				$('.controller-handle').trigger('click');
				}
		view.disableButtons();					//disabling buttons
		model.setN(nSize.val());				// save the datapoints size
	    var keys=model.generateStep();				//generate one sample
		view.updateCounter();					//update counter
		view.animate({
		stopCount:$('#nSize').val(),
		speed:$('#speed').val(),
		keys:keys
		});						//show sample generation animation
		view.enableButtons();					//enabling buttons
		view.updateSlider();					//update slider count
	},

	run:function(){
        	view.disableButtons();			//disabling buttons
		model.setStopCount($("#countSize").val());	//save the stopcount provided by user
		model.setN($("#nSize").val());		// save the datapoints size
			
	//generate samples
		var _temp=model.getStopCount()/1000;
		_noOfSteps=Math.ceil(_temp);
		var d=Date();
		console.log('start'+_runsElasped+d);
		_generate();
		_id=setInterval(_generate,0);
		//this.stop();
	},
	
	stop:function(){
		//for(var i=0;i<model.bootstrapSamples.length;i++)
		//console.log(model.bootstrapSamples[i]);
		var d=Date();
		console.log('end'+_runsElasped+d);
		view.updateSlider();
		clearInterval(_id);		//stop the setinterval function
		_runsElasped=0;			//reset the runelapsed count
		view.enableButtons();		//enable buttons
        },
    
	reset: function(){
	var self=this;
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
							self.stop();
							model.setCount(0);		//reset the total count
							model.setSamples=[];	//empty the bootstrap samples
							view.clearAll();		//clearing all the canvas
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
	view.createDotplot({variable:'mean'});
	//focus on dotplot
	//$('#dotplot').addclass('ui-state-active');
	//$('#dotplot').addclass('ui-state-active');
	},
	getDotPlot:function(){
	
	},
	loadController:function(x){
		if(x=='simulationDriven')
			{
				Experiment.createControllerView();
				Experiment.initialize();
				
			}
		else
			{
				view.createControllerView();
				this.initialize();
				//check for input
				if(Experiment)
					{
					if(Experiment.getDataset()!='')
						{	console.log('simulation drive has some data');
						//alert(Experiment.getDataset());
							model.setDataset({
								data:Experiment.getDataset('calculation'),
								processed:true
								});	
							console.log(model.getDataset());
							//call to loadInputSheet to input the generated simulation data if any
						}	
						
					}
				//set the input
				
			}
	
	}
 
    }//return
}