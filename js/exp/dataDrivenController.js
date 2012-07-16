var dataDrivenController=function(dataDrivenModel,view){
/* PRIVATE PROPERTIES   */
	model=dataDrivenModel;
	view=view || new dataDrivenView();
	var _id=0;
	var _runsElasped=0;
	var _this;
	var _noOfSteps=0;
	var _datapoints=model.getN();		//this can create problems...if the n value is changed after the intialization of the app
	var _stopCount=model.stopCount;
	var _count=model.getCount();

/* PRIVATE METHODS   */
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
	initialize:function(){
	
		_this=this;
		//add event listeners
		runButton.on('click',function(){
		controller.run();
		});
		stepButton.on('click',function(){
		controller.step();
		});
		stopButton.on('click',function(){
		controller.stop();
		});
		resetButton.on('click',function(){
		controller.reset();
		});
		dotPlot.on('change',function(){
		controller.dotplot();
		});
		doneButton.on('click',function(){
		if(controller.setInput()==false)
			alert('Input some correct data!');
		});
		showButton.on('click',function(){
			view.createList($('#showCount').text());
		});
		//create a slider
		view.createSlider();
	},
	
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
	        model.generateSample();					//generate one sample
		view.updateCounter();						//render the visualization
		view.enableButtons();					//enabling buttons
		view.updateSlider();
	},

	run:function(){
        	view.disableButtons();			//disabling buttons
		model.setStopCount(countSize.val());	//save the stopcount provided by user
		model.setN(nSize.val());		// save the datapoints size
			
	//generate samples
		var _temp=model.getStopCount()/1000;
		_noOfSteps=Math.ceil(_temp);
		//alert(_noOfSteps);
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
		
		},
        
    
	setDotPlot:function(){
	//alert that the app will be reset first
	
	},
	getDotPlot:function(){
	
	}
 
    }//return
}