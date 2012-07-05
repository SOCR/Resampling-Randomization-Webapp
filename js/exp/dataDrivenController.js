var dataDrivenController=(function(){
//private properties
    //for accessing public methods in private methods
    self=this;
    //intial state
    stopSelect.attr('value',"10");
    dataDrivenView.disableButtons();
	this.reset();
return{
    setInput:function(array){
	if(isempty(array))
	    return false;
	else
	    {
	    dataSet=array;
	    //enable the buttons
	    dataDrivenView.enableButtons();
	    return true;
	    }
	},
    step: function(){
        //disabling buttons
	dataDrivenView.disableButtons();   //stepButton.attr('disabled',"true"); runButton.attr('disabled',"true");
        //generate one sample
	var data=dataDrivenModel.generateSample();
	//render the visualization
	dataDrivenView.createPlot(data,speed);	
	//enabling buttons
	dataDrivenView.enableButtons();
    },
    run:function(){
        //disabling buttons
	dataDrivenView.disableButtons();   //stepButton.attr('disabled',"true"); runButton.attr('disabled',"true");
        //generate one sample
	var data=dataDrivenModel.generateSamples();
	//render the visualization
	dataDrivenView.createPlot(data,speed);	
	//enabling buttons
	dataDrivenView.enableButtons();
    
    },
    
    stop:function(){
	//enable buttons
	dataDrivenView.enableButtons();
        //raise the stop flag    
	dataDrivenModel.setStop();
	
    },
    
    reset: function(){
        runCount = 0; stopCount = 0;
        dataDrivenModel.setSamples=[];	//empty the bootstrap samples
	dataDrivenView.clearAll();		//clearing all canvas
	dataDrivenView.clearSamples();
    },
        
    
    setDotPlot:function(){
	//alert that the app will be reset first
	
    },
    
    getDotPlot:function(){
	
    },
    
    changeSpeed:function(){
	speed=$('speed').val();
    }
    
    }//return
    

}());

