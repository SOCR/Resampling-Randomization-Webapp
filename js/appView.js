/**
*  appView.js is the view object for the SOCR app.
*
*@author: selvam , ashwini 
*
*SOCR - Statistical Online Computational Resource
*/

var appView = function(appModel){

/* private properties */
	var model=appModel;					// [OBJECT] Reference to the App's model object.
	var _datapoints=$('#nSize').val();	// Reference to the number of datapoints in each random sample
	var _currentVariable;				// [ARRAY] Reference to current inference varaible [mean , SD , count , percentile]
	var _currentValues;					// [ARRAY] Reference to current inference variable's value of each random sample.

/* public properties */	
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
	
	/**
	*@method: [private] _create
	*@param :  start: the first sample number to be displayed
	*@param :  size: how many samples to be displayed
	*@desc:   populates the sampleList div with random samples
	*/ 
	function _create(start,size){
		console.log("_create("+start+","+size+") funtion started");
		//console.log(model.bootstrapSamples);
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
			temp.push(model.bootstrapSamples[i]);
			temp.push('</pre></div>');
			$('#sampleList').append(temp.join(''));
			}
		$('.plot').on('click',function(){
			$('.chart').html('');
		
			var values = $(this).parent().parent().find('pre').text().split(','),
				sampleID = $(this).parent().parent().find('span.values').filter(':eq(0)').text();

			$('#plot').find('h3').text(' Sample : ' + sampleID );

				vis({
					  parent : '.chart',
			          data : values,
			      	  height: 380,
			          width: 500,
					//  range:[0,10]

		           })();
			});
			
			$('.contribution').on('click',function(){
			
			console.log("Mean of this sample:"+model.getMeanOf($(this).attr('id')));
			$("#accordion").accordion( "activate" , 2);
			console.log("dataset mean:"+model.getMeanOfDataset());
			console.log("standard deviation:"+ model.getStandardDevOf($(this).attr('id')));
			$('#dotplot').html('');
			createDotplot({
				variable : 'mean',
				sample : {
					mean : model.getMeanOf($(this).attr('id')),
					meanDataset : model.getMeanOfDataset(),
					standardDev : model.getStandardDevOf($(this).attr('id'))
				}
			});

			function createDotplot(setting){	
					if(setting.variable=='mean')
					{
					var values = model.getMean();
					var datum = model.getMeanOfDataset();
					console.log("Mean Values:"+ values );
					
					}
				else if (setting.variable=='standardDev')
					{
					var values = model.getStandardDev();
					var datum=model.getSdOfDataset();
					console.log("SD Values:"+ values );
					}
				else
					{
					var values = model.getPercentile();
					//var datum=model.getSdOfDataset();
					}
				var histogram = vis({
					parent : '#dotplot',
					data : values,
					height:390,
					range: [0,1],
					dataSetMean :datum,
					sample : setting.sample
				})();
			}
				var html = '<div> Mean of Sample :'+ model.getMeanOf($(this).attr('id')) +' Mean of DataSet : '+ model.getMeanOfDataset() +' Standard Deviation :'+ model.getStandardDevOf($(this).attr('id')) +'</div>';
				$('#accordion').append(html)
			
			});
	}
	 
	/**
	*@method: [private] _createPagination
	*@param :  x: the first sample number to be displayed
	*@param :  y: how many samples to be displayed
	*@desc:  creates interactive pagination depending upon the number of samples being shown
	*/
	function _createPagination(x,y){
	console.log("_createPagination() invoked");
		var count=Math.ceil((y-x)/500);		//number of pages
		$(".pagination").paginate({
				count 				: count,
				start 				: 1,
				display     			: 8,
				border				: true,
				border_color			: '#fff',
				text_color  			: '#fff',
				background_color    	: 'black',	
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
			var start=$(this).text()*500-500;
			console.log(start);
			_create(start,500);
			});
	}

return{
 	/**
     *@method - disableButtons()
	 *@description: Disables step,run and show buttons
     * @dependencies : none
     */
  	disableButtons:function(){
		console.log("disableButtons invoked");
		$("#stepButton").attr('disabled',"true"); 
		$("#runButton").attr('disabled',"true");
		$("#showButton").attr('disabled',"true");
	},
	
	/**
     *@method - enableButtons()
	 *@description: Enables step,run and show buttons
     * @dependencies : none
     */
	enableButtons:function(){
		console.log("enableButtons invoked");
		$("#stepButton").removeAttr('disabled'); 
		$("#runButton").removeAttr('disabled'); 
		$("#showButton").removeAttr('disabled'); 
	},
	
	/**
     *@method - clearAll()
	 *@description: Clears all canvas and div. Resetting the view of the whole App
     * @dependencies : none
     */
	clearAll:function(){
		$('#displayCount').html('0');	//resetting the count to 0
		$('#sampleList').html('');		//clear the sample List dive
		$('#dataPlot').html('');		//clear dataPlot div
		$('#dotPlot').empty();			//clear dotPlot div
		$('#accordion').accordion( "activate" , 0);
		$('#pagination').html('');
		$('#details').html('');
		$('#dataset').html('');
		$("#input").inputtable('clear'); 
		//also clear the canvas
		_currentValues=[];
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
			range: [0,1]
			})();
	},
		
	/**
     *@method : createList(range)
	 *@param :start- start sample number
	 *@param : end -  stop sample number
	 *@description: It generates all the samples in the List
     * @dependencies : _create(start,stop)
     */
	createList:function(start,end){
		console.log('createList('+start+','+end+') invoked ');
		if(model.bootstrapSamples.length==0)
			{ 
			// if no random samples have been generated, display a alert message!
			$("#sampleList").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">x</a><h4 class="alert-heading">No Random samples to show!</h4>Please generate a dataset using the list of experiments or manually enter the data. Then generate some random samples from the controller tile before click "show"</div>');
			}
		else{
			if((end-start)<500)
				{	
					_create(start,end-start);
				}
			else
				{	
					_createPagination(start,end);
					_create(start,500);
				}
			}
	},
	/**
     *@method : updateCounter()
	 *@description: update the counter display
     * @dependencies : none
     */
	updateCounter:function(){
		//count value changed on top
		$('#displayCount').text(model.getCount());
		return true;
	},
	/**
     *@method : updateSlider()
	 *@description:update the slider value
     * @dependencies : none
     */
	updateSlider:function(){
		//get the count and set it as the maximum value
		$( "#range" ).slider( "option", "max", model.getCount());
		$( "#range" ).slider( "option", "min", 0);
		//$( "#showCount" ).html($( "#range" ).slider( "values",0 )+" - " + $( "#range" ).slider( "values", 1 ) );
	},
	
	/**
     *@method : createShowSlider()
	 *@description:Create the slider for show option
     * @dependencies : none
     */
	createShowSlider:function(){
		$( "#range" ).slider({
			range: true,
			min: 0,
			max: 500,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#showCount" ).html( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
				$(".show-list-start").val(ui.values[0]);
				$(".show-list-end").val(ui.values[1]);
			}
		});
		$( "#showCount" ).html($( "#range" ).slider( "values",0 )+" - " + $( "#range" ).slider( "values", 1 ) );
	},
	
	/**
	*@method: createControllerView
	*@description: called for replacing the controller div with data driven controls.
	*@return : none
	*/
	createControllerView:function(){
		$( "#amount" ).val( "$" + $( "#slider" ).slider( "value" ) );
		var html='<div id="buttonPanel"><button class="btn" type="button" id="stepButton" tabindex="1" title="Step"><img src="img/step.png" alt="Step" title="Step" /> </button> <button class="btn btn-success" type="button" id="runButton" tabindex="2" title="Run" ><img id="runImage" src="img/run.png" alt="Run" title="Run" /></button><button class="btn btn-danger" type="button" id="stopButton" tabindex="3" title="Stop" ><img id="stopImage" src="img/stop.png" alt="Stop" title="Stop" /></button><button class="btn" type="button" id="resetButton" tabindex="4" title="Reset" ><img src="img/reset.png" alt="Reset" title="Reset" /></button><span><i class="icon-question-sign popups" rel="popover" data-content="<ul><li>Step Button : generates 1 sample</li><li>Run Button : generates X sample..X can be set from the option below</li><li>Stop Button :Stops the sample generation</li><li>Reset Button : Resets all values</li></ul>" data-original-title="Controls"></i></span>&nbsp;&nbsp;<button class="btn controller-back">Back</button></div><div id="speedSlider"><div><span class="badge badge-warning">Animation Time: <span id="speedCount">200</span>ms</span></div><div id="speed"></div></div><div class="tool"><span>Generate</span><input type="text" id="countSize" class="input-small" value="1000"> <span>Samples with </span><input type="text" id="nSize" class="input-small" value="50"><span>Datapoint per sample.</span></div><div><select id="variable" style="width:100px;margin-top:10px"><option value="mean">Mean</option><option value="count">Count</option><option value="standardDev">Standard Dev.</option><option value="Percentile">Percentile</option></select><span><a href="#" class="btn btn-danger popups" rel="popover" data-content="This will create a plot of the variable for each generated sample. Click this once you have generated some samples!" data-original-title="Inference" id="infer">Infer!</a></span></div>';
		$('#controller-content').html(html);
		$( "#speed" ).slider({
			value:400,
			min: 100,
			max: 2000,
			step: 50,
			slide: function( event, ui ) {
			$( "#speedCount" ).html( ui.value );
			}
		});
		$('.controller-back').on('click',function(){
			Experiment.createControllerView();
			Experiment.initialize();
		});
	},
	
	/**
	*@method: animate
	*@param: setting
	*@description: animates the resample generation process....input is the resample datapoints array indexes
	*@return : none
	*/
	animate:function(setting){
		this.disableButtons();
		//disable the back button in the controller tile
		var data=Experiment.getDatasetValues();		// data is in the form of an array!
		var datakeys=Experiment.getDatasetKeys();		// data is in the form of an array!
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
			self.addClass('removable');
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
					//alert(data[sampleNumber]);
					}
				else
					{
					var k = new Ball(document.getElementById("device"+sampleNumber));
					k.setValue(datakeys[sampleNumber],data[sampleNumber]);
					}
				}); //self.transition
				
				i=i+1;
				if(i<stopCount)
					setTimeout(animation,speed);
				else
					{
						view.enableButtons();
						console.log("enableButtons() invoked");
					}
		}
	},
	
	/**
	*@method: createDotPlot
	*@description: Dot plot tab in the accordion is populated by this call. call invoked when "infer" button pressed in the controller tile.
	*@return : none
	*/
	createDotplot:function(setting){
	
		_currentVariable=setting.variable;
		$("#accordion").accordion( "activate" , 2);

		// Function to get the Max value in Array
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		// Function to get the Min value in Array
		Array.min = function( array ){
			return Math.min.apply( Math, array );
		};
		//setting.variable;
		if(setting.variable=='mean')
			{
			var values = model.getMean();			//Mean values of all the generated random samples
			var datum = model.getMeanOfDataset();	//datum is the dataset mean value
			console.log("Mean Values:"+ values );	
			}
		else if (setting.variable=='standardDev')
			{
			var values = model.getStandardDev();	//Standard deviation values of all the generated random samples
			var datum=model.getSdOfDataset();		//datum is the dataset SD value
			console.log("SD Values:"+ values );
			}
		else if (setting.variable=='count')
			{
			var values = model.getCounts();	//Standard deviation values of all the generated random samples
			var datum=model.getCountOfDataset();		//datum is the dataset SD value
			console.log("Count Values:"+ values );
			}
		else
			{
			var values = model.getPercentile();
			var datum=model.getPercentileOfDataset();
			//var datum=model.getSdOfDataset();
			console.log("Percentile Values:"+ values );
			}
			
		//var values = [4,2,3,4,1,5,6,7];
		//var start=Math.floor(Array.min(values));
		//var stop=Math.ceil(Array.max(values));
		var temp=values.sort(function(a,b){return a-b});
<<<<<<< HEAD
		var start=Math.floor(temp[0]);
		var stop=Math.ceil(temp[values.length-1]);
=======
		var start=(temp[0];
        var stop=temp[values.length-1];

>>>>>>> [UI] Minor Bug fixed. Controller view not activated when user inputs data.
		console.log("start"+start+"stop"+stop);
		console.log(values);
		_currentValues=values;
		var histogram = vis({
			parent : '#dotplot',
			data : values,
			height:390,
			range: [start,stop],
			datum :datum,
			variable: setting.variable				
		})();
		
	},
	
	/**
	*@method: updateSimulationInfo
	*@description: Called when the 'step button' or 'run button' is pressed in the controller tile. Call is made in appController.js
	*@return : none
	*/
	updateSimulationInfo:function(){
		console.log('updateSimulationInfo() invoked');
		var array=['<table class="table table-striped">'];
		array.push('<tr><td>Experiment Name</td><td><strong>'+Experiment.name+'</strong></td></tr>');
		array.push('<tr><td>DataSet Size </td><td><strong>'+Experiment.getDatasetSize()+'</strong></td></tr>');
		array.push('<tr><td>Number of Random Samples : </td><td><strong>'+model.bootstrapSamples.length+'</strong></td></tr>');
		array.push('<tr><td>DataSet Mean : </td><td><strong>'+model.getMeanOfDataset()+'</strong></td></tr>');
		array.push('<tr><td>DataSet Standard Deviation: </td><td><strong>'+model.getSdOfDataset()+'</strong></td></tr>');
		array.push('</table>');
		$('#details').html(array.join(''));
	},
	
	/**
	*@method: CoverPage
	*@description: Called from the index.html page. Called whenever the window is resized!
	*@return : none
	*/
	CoverPage:function(){
		console.log('CoverPage() invoked!');
		var height = $(window).height(),
			width = $(window).width();
		$('#welcome').css('height', height );
	//	$('.welcome-container').css('padding-top',height/3).css('padding-left', height/3);
		$('div.main-wrap').show();
	},
	
	/**
	*@method: loadInputSheet
	*@description: Called from the {experiment}.js at the {Experiment}.generate() function.
	*@return : none
	*/
	loadInputSheet:function(data){
		console.log("loadInputSheet() has been called....data is : " +data);
		/*
			Temporarily disabling it, I think we should leave the input matrix for data driven purposes only, perhaps the right place would be in the simulation info
		*/
		//$('#input').inputtable('loadData',data);
	},
	/*
	setPercentile:function(x){
		var N=_currentValues.length;
		//console.log("N"+N);
		_currentValues=_currentValues.sort(function(a,b){return a-b});
		//console.log("_currentValues"+_currentValues);
		var index=((x)/100)*N;
		console.log("index: "+index);
		console.log("value: "+_currentValues[Math.floor(index)]);
		return _currentValues[Math.floor(index)];
	}
	*/
	}//return
};
