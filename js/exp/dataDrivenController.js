var dataDrivenController=function(dataDrivenModel,view){
//private properties
	model=dataDrivenModel;
	//alert(model);
	view=view || new dataDrivenView();
	//view.disableButtons();
	var _id=0;
	var _runsElasped=0;
	var _this;
	var _noOfSteps=0;
	var _datapoints=model.getN();
	var _stopCount=model.stopCount;
	
function _generate1000(){
	if(_runsElasped!=_noOfSteps)
		{
			for(var i=0;i<1000;i++)
				{			
				sample=model.generateSample();
				//alert('generated sample:'+sample['data']'+'count:'+sample['count']);
			
				//saving the sample
				model.setSample(sample['data'],sample['count']);
				//alert(model.bootstrapSamples[sample['count']].getData());
			
				//render the visualization
				view.update(sample['data'],sample['count'],_datapoints);	
				}
		_runsElasped++;
		}
	else
		{
		_this.stop();
		
		}
	}
	
return{
	initialize:function(){
	
		_this=this;
	//add event listeners
	runButton.on('click',function(){
	controller.run();
	});
	
stepButton.on('click',function(){
	//alert('step');
	controller.step();
	});
	
	stopButton.on('click',function(){
	//alert('stop');
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
	//disabling buttons
		view.disableButtons();
	//get datapoint size
		var x=nSize.val();
		if(x=='')
			model.setN(50);
		else
			model.setN(x);
		var datapoints=model.getN();		
        //generate one sample
		var sample=model.generateSample();
		//alert('Sample:'+sample['data']+'........Count:'+sample['count']);
		
	//saving the sample
		model.setSample(sample['data'],sample['count']);
	//render the visualization
		view.update(sample['data'],sample['count'],datapoints);	
	//enabling buttons
		view.enableButtons();
	},

run:function(){
	
        //disabling buttons
		view.disableButtons();
	//get the stopcount and datapoints size
		model.setStopCount(countSize.val());
		model.setN(nSize.val());
			
	//generate samples
		/*
		var i=0;
		while(i<model.stopCount){
		var sample=model.generateSample();
		model.setSample(sample['data'],sample['count']);
		view.update(sample['data'],sample['count']);
		i++;
		}
		*/
		var temp=model.stopCount/1000;
		//alert(temp);
		
			_noOfSteps=Math.ceil(temp);
			//alert(noOfSteps);
			_id=setInterval(_generate1000,10);
		
		
		//for(i=0;i<5;i++)
		//console.log(model.bootstrapSamples[i].getNumber());
		//enabling buttons
		//var end=d.getTime();
		//alert('1');
		//alert('time elapsed:'+(end-start));
		
	},
	    
    stop:function(){
	clearInterval(_id);
	_runsElasped=0;
	//enable buttons
	view.enableButtons();
        
	
    },
    
	reset: function(){
		this.stop();
		model.count=0;		//reset the total count
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