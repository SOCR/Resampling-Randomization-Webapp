var dataDrivenController=function(dataDrivenModel,view){
/* PRIVATE PROPERTIES   */
	model=dataDrivenModel;
	view=view || new dataDrivenView();
	
	var _id=0;				//stores the id for setInterval in run mode
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
		controller.run();
		
		});
		$("#stepButton").on('click',function(){
		console.log('Step pressed ');
		controller.step();
		});
		$("#stopButton").on('click',function(){
		console.log('Stop Pressed ');
		controller.stop();
		});
		$("#resetButton").on('click',function(){
		console.log('Reset pressed');
		controller.reset();
		});
		$("#infer").on('click',function(){
		controller.setDotplot();
		});
		$("#doneButton").on('click',function(){
		console.log('Done Pressed');
		if(controller.setInput()==false)
			alert('Input some correct data!');
		});
		
		//create a slider
		view.createSlider();
		$('.dropdown-toggle').dropdown();
		$('.popups').popover();
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
		view.disableButtons();					//disabling buttons
		model.setN(nSize.val());				// save the datapoints size
	        var keys=model.generateStep();					//generate one sample
		view.updateCounter();					//update counter
		view.animate(keys);						//show sample generation animation
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
		this.stop();
		model.setCount(0);		//reset the total count
		model.setSamples=[];	//empty the bootstrap samples
		view.clearAll();		//clearing all the canvas
		$('#showCount').html('');
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
								data:Experiment.getDataset(),
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