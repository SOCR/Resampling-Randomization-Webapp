var dataDrivenView = function(dataDrivenModel){
/* private properties */
	var model=dataDrivenModel;
	var _datapoints=$('#nSize').val();
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
	
	/*
	 populates the sampleList div with random samples
	 start: the first sample number to be displayed
	 size: how many samples to be displayed
	*/
	 
	function _create(start,size){
		console.log("_create funtion started");
		console.log(model.bootstrapSamples);
		y=parseInt(start)+size;
		$('#sampleList').html('');		//first empty the sample list
		//change the loop to a inverse while loop
		for(var i=start;i<y;i++)
			{
			var temp=['<div class="entry"><div class="header">Sample<span class="values"> '];
			temp.push(i);
			temp.push('</span> &nbsp;&nbsp;  Datapoints:<span class="values">');
			temp.push(_datapoints);
			temp.push('</span>&nbsp;&nbsp;<a data-toggle="modal" href="#plot"><i class="icon-fullscreen plot" id="'+i+'"></i></a> &nbsp; <a href="#"><i class="icon-filter contribution" id="'+i+'"></i></a></span><pre>');
			//alert(i+' :'+model.bootstrapSamples[i-1]);
			temp.push(model.bootstrapSamples[i-1]);
			temp.push('</pre></div>');
			$('#sampleList').append(temp.join(''));
			}
		$('.plot').on('click',function(){
			$('.chart').html('');
			//var values=model.bootstrapSamples[$(this).attr('id')];
			//var values=[1,2,3];
			//alert(values);
			//$('.vis').find('h3').html('Sample No. ' + sampleID );
			var values = $(this).parent().parent().find('pre').text().split(',');
			var sampleID = $(this).parent().parent().find('span.values').filter(':eq(0)').text();

			$('#plot').find('h3').text(' Sample : ' + sampleID);

			console.log(values);

				vis({
					  parent : '.chart',
			          data : values,
			       height: 380,
			          width: 500,
					  range:[0,10]

		           })();
			});
			
			$('.contribution').on('click',function(){
			console.log(model.getMeanOf($(this).attr('id')));
			$("#accordion").accordion( "activate" , 2);
			
			});
	}
	/*
	 creates interactive pagination depending upon the number of samples being shown
	*/
	function _createPagination(x,y){
		var count=Math.ceil((y-x)/500);		//number of pages
		$(".pagination").paginate({
				count 				: count,
				start 				: 1,
				display     			: 8,
				border				: true,
				border_color			: '#fff',
				text_color  			: '#fff',
				background_color    		: 'black',	
				border_hover_color		: '#ccc',
				text_hover_color  		: '#000',
				background_hover_color		: '#fff', 
				images				: false,
				mouse				: 'press',
				onChange     			: function(page){
									$('._current','#paginationdemo').removeClass('_current').hide();
									$('#p'+page).addClass('_current').show();
								  }
			});
		$('.pagination li').on('click',function(){
			//alert('1');
			var start=$(this).text()*500-500;
			console.log(start);
			_create(start,500);
			});
	}
	
	function getPos(el) {
		// yay readability
		for (var lx=0, ly=0;
			el != null;
			lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
		return {x: lx,y: ly};
	}
return{
    
	/**
     * Disables step,run and show buttons
    */
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
	
	/**
     * Clears all canvas and div. Resetting the view of the whole App
     *
     */
	clearAll:function(){
		$('#displayCount').html('0');	//resetting the count to 0
		$('#sampleList').html('');		//clear the sample List dive
		$('#dataPlot').html('');		//clear dataPlot div
		$('#dotPlot').html('');			//clear dotPlot div
		$('#pagination').html('');
		$('#details').html('');
		$('#dataset').html('');
		//also clear the canvas
	},
	
	/**
     * Dont know where its called?
     *
     */
	createDatasetPlot:function(){
		var values=[0.1,0.5];
		var histogram = vis({
			parent : '#dataPlot',
			data : values,
			range: [0,10]
			})();
		},
		
	/**
     * It generates all the samples List
     * @dependencies : _create(start,stop)
     */
	createList:function(x){
		console.log('createList invoked (view.js ln 131)');
		var range=x.split('-');
		if((range[1]-range[0])<500)
			{	
				_create(range[0],range[1]-range[0]);
			}
		else
			{	
				_createPagination(range[0],range[1]);
				_create(range[0],500);
			}
		},
		
	/**
     * update the counter display
     *
     */
	updateCounter:function(){
		//count value changed on top
		$('#displayCount').text(model.getCount());
		return true;
	},
	
	/**
     * update the slider value
     *
     */
	updateSlider:function(){
		//get the count and set it as the maximum value
		//$( "#range" ).slider({ disabled: false });
		$( "#range" ).slider( "option", "max", model.getCount());
		$( "#range" ).slider( "option", "min", 0);
		//$( "#showCount" ).html($( "#range" ).slider( "values",0 )+" - " + $( "#range" ).slider( "values", 1 ) );
		//alert($( "#range" ).slider( "value"));
	},
	
	/**
     * Create the slider for show option
     *
     */
	createSlider:function(){
		$( "#range" ).slider({
			range: true,
			min: 0,
			max: 500,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#showCount" ).html( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			}
		});
		$( "#showCount" ).html($( "#range" ).slider( "values",0 )+" - " + $( "#range" ).slider( "values", 1 ) );
		//$("#amount" ).val( "$" + $( "#range" ).slider( "value" ) );
		//$("slider").hide();
	},
	
	/**
	*@method: createControllerView
	*@description: called for replacing the controller div with data driven controls.
	*@return : none
	*/
	createControllerView:function(){
		$( "#amount" ).val( "$" + $( "#slider" ).slider( "value" ) );
		var html='<div id="buttonPanel"><button class="btn" type="button" id="stepButton" tabindex="1" title="Step"><img src="img/step.png" alt="Step" title="Step" /> </button> <button class="btn btn-success" type="button" id="runButton" tabindex="2" title="Run" ><img id="runImage" src="img/run.png" alt="Run" title="Run" /></button><button class="btn btn-danger" type="button" id="stopButton" tabindex="3" title="Stop" ><img id="stopImage" src="img/stop.png" alt="Stop" title="Stop" /></button><button class="btn" type="button" id="resetButton" tabindex="4" title="Reset" ><img src="img/reset.png" alt="Reset" title="Reset" /></button><span><i class="icon-question-sign popups" rel="popover" data-content="<ul><li>Step Button : generates 1 sample</li><li>Run Button : generates X sample..X can be set from the option below</li><li>Stop Button :Stops the sample generation</li><li>Reset Button : Resets all values</li></ul>" data-original-title="Controls"></i></span></div><div id="speedSlider"><div><span class="badge badge-warning">Speed: <span id="speedCount">200</span>ms</span></div><div id="speed"></div></div><div class="tool"><span>Generate</span><input type="text" id="countSize" class="input-small" value="1000"> <span>Samples with </span><input type="text" id="nSize" class="input-small" value="50"><span>Datapoint per sample.</span></div><div><select id="variable" style="width:100px;margin-top:10px"><option value="slow">Mean</option><option value="medium">S.D</option><option value="fast">Percentile</option></select><span><a href="#" class="btn btn-danger popups" rel="popover" data-content="This will create a plot of the variable for each generated sample. Click this once you have generated some samples!" data-original-title="Inference" id="infer">Infer!</a></span></div>';
		$('#controller-content').html(html);
		$( "#speed" ).slider({
			value:400,
			min: 200,
			max: 2000,
			step: 50,
			slide: function( event, ui ) {
			$( "#speedCount" ).html( ui.value );
			}
		});
	},
	
	/**
	*@method: animate
	*@description: animates the resample generation process....input is the resample datapoints array indexes
	*@return : none
	*/
	animate:function(setting){
		var data=Experiment.getDataset();		// data is in the form of an array!
		var stopCount=setting.stopCount;		// Number of datapoints in a generated random sample
		var keys=setting.keys;					// keys=array indexs of the datapoints in the dataset which are present in the current random sample 
		var i=0;
		var _dimensions=Experiment.getSampleHW();
		setTimeout(animation);					//first call
				
		function animation(){
			var speed=$('#speedCount').html();	//calculate the speed currently set from the browser itself
			var sampleNumber=keys[i];			
			var count=i;
			var self = $("#device"+sampleNumber);	//reference to the device (i.e. coin , card, dice) canvas
			var content=self.clone();				// make a copy of the sample canvas
			currentX=$("#device"+sampleNumber+"-container").position().left; //get the X position of current sample canvas
			console.log('currentX:'+currentX);
			currentY=$("#device"+sampleNumber+"-container").position().top;  //get the Y position of current sample canvas
			console.log('currentY:'+currentY);
			
			samplesInRow=$('#generatedSamples').width()/_dimensions['width'] -1;				//number of samples in a row
			
			/*Block to adjust the generatedSamples div height*/
			var divHeight=(stopCount/samplesInRow)*_dimensions['height'];
			$("#generatedSamples").height(divHeight);
			//alert(divHeight);
			//
			if(count<samplesInRow)
				destinationX=count*_dimensions['width']+$('#generatedSamples').position().left;
			else 
				destinationX=(count%samplesInRow)*_dimensions['width']+$('#generatedSamples').position().left;
			
			console.log('destinationX:'+destinationX);
			destinationY=Math.floor(count/samplesInRow)*_dimensions['height']+$('#generatedSamples').position().top;	//calculate the destination Y
			console.log('destinationY:'+destinationY);
			//self.css('-webkit-transition','all 0.5s');
			self.transition({
				perspective: '100px',
				rotateY: '360deg',
				duration:speed/4+'ms'
			});
			self.transition({
				x:(destinationX-currentX),
				y:(destinationY-currentY),
				duration:speed/4+'ms'
				},function(){
					content.appendTo("#device"+sampleNumber+'-container');
					self.removeAttr('id');					//remove the id on the moved coin
					
				if(Experiment.type=='coin')
					{
					var k = new Coin(document.getElementById("device"+sampleNumber));
					k.setValue(data[sampleNumber]);
					}
				else if(Experiment.type=='card')
					{
					var k = new Card(document.getElementById("device"+sampleNumber));
					k.setValue(data[sampleNumber]);
					}
				else
					{
					var k = new Ball(document.getElementById("device"+sampleNumber));
					k.setValue(data[sampleNumber]);
					}
				}); //self.transition
				
				i=i+1;
				if(i<stopCount)
					setTimeout(animation,speed*1.2);
		}
	},
	
	/**
	*@method: createDotPlot
	*@description: Dot plot section in the accordion is populated by this call. call invoked when "infer" button pressed in the controller div.
	*@return : none
	*/
	createDotplot:function(setting){
		console.log('createDotplot invoked (dataDrivenView.js)');
		$("#accordion").accordion( "activate" , 2);
		//setting.variable;
		var values = model.getMean();
		//alert(values);
		console.log("Mean Values:"+ values );
		//var values = [4,2,3,4,1,5,6,7];
		//get the mean array
		var histogram = vis({
			parent : '#dotplot',
			data : values,
			range: [0,10]
		})();
	},
	
	/**
	*@method: updateSimulationInfo
	*@description: Called when the 'step button' is pressed in the controller div. Call is made in dataDrivenController.js
	*@return : none
	*/
	updateSimulationInfo:function(){
		console.log('updateDetails (dataDrivenView.js ln 319) invoked');
		var array=['<table class="table table-striped">'];
		array.push('<tr><td>Experiment Name</td><td><strong>'+Experiment.name+'</strong></td></tr>');
		t=new Date();
		array.push('<tr><td>Start Time </td><td><strong>'+t.getTime()+'</strong></td></tr>');
		array.push('<tr><td>DataSet Size </td><td><strong>'+Experiment.getDatasetSize()+'</strong></td></tr>');
		array.push('</table>');
		$('#details').html(array.join(''));
	},
	
	/**
	*@method: CoverPage
	*@description: Called from the index.html page.
	*@return : none
	*/
	CoverPage:function(){
		console.log('CoverPage() (view.js ln 240) invoked');
		$('#welcome').css('height',$(window).height()).css('width',$(window).width());
		$('.welcome-container').css('padding-top',$(window).height()/3).css('padding-left',$(window).height()/3);
		$('div.main-wrap').show();
	},
	
	/**
	*@method: loadInputSheet
	*@description: Called from the {experiment}.js at the {Experiment}.generate() function.
	*@return : none
	*/
	loadInputSheet:function(data){
		console.log("loadInputSheet() has been called....data is : " +data);
		$('#input').inputtable('loadData',data);
		
	}
	
    }//return
};

/*
INCOMPLETE FUNCTIONS

clear
getMean

*/

