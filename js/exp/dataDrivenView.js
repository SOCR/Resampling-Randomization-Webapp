var dataDrivenView=function(dataDrivenModel){
//private properties
    runButton = $("#runButton"),
    stepButton =$("#stepButton"),
    stopButton =$("#stopButton"),
    resetButton =$("#resetButton"),
    stopSelect =$("#stopSelect"),
    animationSpeed=$("#animationSpeed"),
    datasetCanvas = $("#distCanvas"),
    dotPlot=$("#dotPlot");
	//input tile
	doneButton=$("#doneButton");
	
	//self=this;
		
return{
    ////stepButton.attr('disabled',"true"); runButton.attr('disabled',"true");
	disableButtons:function(){
	stepButton.attr('disabled',"true"); 
	runButton.attr('disabled',"true");
	},
	enableButtons:function(){
	stepButton.removeAttr('disabled'); 
	runButton.removeAttr('disabled');
	},
	clearAll:function(){
	$('sampleList').text='';
	} ,
	create:function(){
	//alert('created');
	}	
    }//return
};

/*
Sample view for the list of generated samples on the right hand side of the mockup! 
Created on 2nd jul 2012
*/

var sampleListView = function(sampleModel,sampleController){
	//put all binding here
	$('enlarge').on('click',function(){
	dataDrivenController.enlarge();
	});
	
	return{
	create:function(){
	//$('').append();
	//generate();
	var id='sample'+sampleModel.getNumber();
	$().on()
	},
	
	generate:function(){
	//d3 code for generating the plot
	//for data use sampleModel.data(); returns an array
	//for sample number user sampleModel.number();
	},
	
	clear:function(){
	
	},
	
	enlarge:function(){
	//opens a new modal window with the generated sample
	},
	
	toggleView:function(number){
	var id='sample'+number;
	$(id).toggle();
	}
	}//return

}

/*
INCOMPLETE FUNCTIONS

clear
getMean

*/

