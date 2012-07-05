var dataDrivenController=function(dataDrivenModel,view){
//private properties
	model=dataDrivenModel;
	//alert(model);
	view=view || new dataDrivenView();
	//view.disableButtons();
	
return{
	initialize:function(){
	//add event listeners
    runButton.on('click',function(){
	//alert('run');
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
	//alert('reset');
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
	    dataSet=array;
	    //enable the buttons
	    view.enableButtons();
	    return true;
	    }
	},
    step: function(){
    //alert('1');
    //disabling buttons
	view.disableButtons();   
        //generate one sample
	var sample=model.generateSample();
		alert('generated sample:'+sample['data']);
		//saving the sample
	model.setSample(sample['data'],sample['count']);
	//render the visualization
	view.create(sample['data'],sample['count']);	
	//enabling buttons
	view.enableButtons();
    },
    run:function(){
	
        //disabling buttons
		view.disableButtons();   
        //generate samples
		for(var i=0;i<model.stopCount;i++)
			{
			var sample=model.generateSample();
			//saving the sample
			model.setSample(sample['data'],sample['count']);
			//render the visualization
			view.create(sample['data'],sample['count']);	
			}
		//enabling buttons
		view.enableButtons();
	},
    
    stop:function(){
	//enable buttons
	view.enableButtons();
        //raise the stop flag    
	model.stopCount=0;
	
    },
    
    reset: function(){
        count = 0; 
		stopCount = 0;
        model.setSamples=[];	//empty the bootstrap samples
		view.clearAll();		//clearing all canvas
	},
        
    
    setDotPlot:function(){
	//alert that the app will be reset first
	
    },
    
    getDotPlot:function(){
	
    }
    
        
    }//return
    

}

/*
Sample Controller
Created on 3rd jul 2012
*/
var sampleController=function(){
return{
enlarge:sampleView.enlarge(number),
toggleView:sampleView.toggleView(number)
}

};
