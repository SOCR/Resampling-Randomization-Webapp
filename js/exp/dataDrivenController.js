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
	alert('reset');
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
        //generate one sample
	var sample=model.generateSample();
		alert('Sample:'+sample['data']+'........Count:'+sample['count']);
		//alert();
	//saving the sample
	model.setSample(sample['data'],sample['count']);
	//render the visualization
	view.update(sample['data'],sample['count']);	
	//enabling buttons
	view.enableButtons();
    },
    run:function(){
	
        //disabling buttons
		view.disableButtons();
		if(countSize.val()!='')
		model.setStopCount(countSize.val());
		
		if(!nSize.val())
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
		
		for(var i=0;i<model.stopCount;i++)
			{
			sample=model.generateSample();
			//alert('generated sample:'+sample['data']);
			//alert('count:'+sample['count']);
			//saving the sample
			//console.log(sample['data']+'---'+sample['count']);
			model.setSample(sample['data'],sample['count']);
			alert(model.bootstrapSamples[sample['count']].getData());
			//render the visualization
			view.update(sample['data'],sample['count']);	
			}
		
		//for(i=0;i<5;i++)
		//console.log(model.bootstrapSamples[i].getNumber());
		//enabling buttons
		view.enableButtons();
	},
    
    stop:function(){
	//enable buttons
	view.enableButtons();
        //raise the stop flag    
	model.stopCount=0;
	model.stopCount=5;
	/*
		for(var i=0;i<10;i++)
		//alert(model.getSample(i).getData());
		{alert(model.bootstrapSamples[i].getData());
		alert(model.bootstrapSamples[i].getNumber());}
	*/
    },
    
    reset: function(){
	alert('1');
        count = 0; 
	stopCount = 0;
        //model.setSamples=[];	//empty the bootstrap samples
	//view.clearAll();		//clearing all canvas
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
