var dataDrivenView=function(dataDrivenModel){
//private properties
    var model=dataDrivenModel;
    runButton = $("#runButton"),
    stepButton =$("#stepButton"),
    stopButton =$("#stopButton"),
    resetButton =$("#resetButton"),
    stopSelect =$("#stopSelect"),
    animationSpeed=$("#animationSpeed"),
    datasetCanvas = $("#distCanvas"),
    dotPlot=$("#dotPlot"),
    countSize=$("#countSize"),
    nSize=$('#nSize');
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
		alert('1');
		$('#sampleList').empty();
	} ,
	update:function(sample,count){
		//count value changed on top
		$('#displayCount').text(count+1);
		//alert(model.count);
		//new sample to the list added
		$('.accordion').append('<dt><a href="">Sample '+count+'</a></dt><dd style="display: block; "><pre>'+sample+'</pre></dd>');
		this.accordion();
		return true;
	},
	accordion:function(){
		var allPanels = $('.accordion > dd').hide();
		//first remove the previous click binding
		$('.accordion > dt > a').off('click');
		$('.accordion > dt > a').on('click',function() {
		allPanels.slideUp();
		$(this).parent().next().slideDown();
		return false;
		});
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

