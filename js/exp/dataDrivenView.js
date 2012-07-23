var dataDrivenView=function(dataDrivenModel){
/* private properties */
	var model=dataDrivenModel;
	var _datapoints;
/*public properties */	
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
	showButton=$("#showButton");
	
	//self=this;
	function _create(start,size){
		$('#sampleList').html('');
		//change the loop to a inverse while loop
		for(var i=start;i<(start+size);i++)
			{
			var temp=['<div class="entry"><div class="header">Sample<span class="values"> '];
			temp.push(i);temp.push('</span> &nbsp;&nbsp;  Datapoints:<span class="values">');
			temp.push(_datapoints);
			temp.push('</span>&nbsp;&nbsp;<a data-toggle="modal" href="#plot"><i class="icon-search plot" id="'+i+'"></i></a></span><pre>');
			temp.push(model.bootstrapSamples[i]);
			temp.push('</pre></div>');
			$('#sampleList').append(temp.join(''));
			}
		$('.plot').on('click',function(){
			var values=model.bootstrapSamples[$(this).attr('id')];
			var values=[0.1,0.2,0.1,0.3];
			var histogram = vis({
			height: 400, 
			width: 300,
			parent : '.device',
			data : values
			});
			histogram();
			});
	}
		
	function _createPagination(x){
		var count=Math.floor(x/1000);		//number of pages
		$("#pagination").paginate({
				count 			:count,
				start 			:1,
				display     		: 10,
				border				: true,
				border_color			: '#BEF8B8',
				text_color  			: '#68BA64',
				background_color    	: '#E3F2E1',	
				border_hover_color		: '#68BA64',
				text_hover_color  		: 'black',
				background_hover_color	: '#CAE6C6', 
				rotate      : false,
				images		: false,
				mouse		: 'press'
			});
		$('.page').on('click',function(){
			var start=$(this).text()*1000;
			_create(start,1000);
			});
	}
return{
    	disableButtons:function(){
	stepButton.attr('disabled',"true"); 
	runButton.attr('disabled',"true");
	showButton.attr('disabled',"true");
	},
	
	enableButtons:function(){
	stepButton.removeAttr('disabled'); 
	runButton.removeAttr('disabled');
	showButton.removeAttr('disabled');
	},
	
	clearAll:function(){
		$('#displayCount').html('0');	//resetting the count to 0
		$('#sampleList').html('');	//clear the sample List dive
		$('#dataPlot').html('');	//clear dataPlot div
		$('#dotPlot').html('');		//clear dotPlot div
		//also clear the canvas
	},
	
	createDatasetPlot:function(){
		var values=[0.1,0.5];
		var histogram = vis({
			height: 400, 
			width: 300,
			parent : '#dataPlot',
			data : values
			});
			histogram();
		},
	
	createList:function(x){
		if(x<1000)
			{
				_create(0,x);
			}
		else
			{
				_createPagination(x);
				_create(0,1000);
			}
		},
	
	updateCounter:function(){
		//count value changed on top
		$('#displayCount').text(model.getCount());
		return true;
	},
	
	updateSlider:function(){
		//get the count and set it as the maximum value
		//$( "#range" ).slider({ disabled: false });
		$( "#range" ).slider( "option", "max", model.getCount());	
		
		//alert($( "#range" ).slider( "value"));
	},
	createSlider:function(){
		
		$( "#range" ).slider({
			range: "min",
			value: 0,
			min: 0,
			max: 0,
			slide: function( event, ui ) {
				$("#showCount").html(ui.value );
				
			}
		});
		$( "#showCount" ).html($( "#range" ).slider( "value" ) );
		//$("#amount" ).val( "$" + $( "#range" ).slider( "value" ) );
		$("slider").hide();
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

