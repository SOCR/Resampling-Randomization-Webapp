/**
* appView.js is the view object for the SOCR app.
*
*@author: selvam , ashwini 
*
*SOCR - Statistical Online Computational Resource
*/

socr.view = function( model ){

/* private properties */
	var model = model;					// [OBJECT] Reference to the App's model object.
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

	var inputHandle = $('.input-handle'),controllerHandle = $('.controller-handle') ;

	/**


	
	/**
	*@method: [private] _create
	*@param :  start: the first sample number to be displayed
	*@param :  size: how many samples to be displayed
	*@desc:   populates the sampleList div with random samples
	*/ 
	function _create(start,size){
		console.log("_create("+start+","+size+") funtion started");
		y=parseInt(start)+size;
		$('#sampleList').html('');		//first empty the sample list
		_datapoints=$('#nSize').val();
		//change the loop to a inverse while loop
		for(var i=start;i<y;i++)
			{
			var temp=['<div class="entry"><div class="header">Sample<span class="values"> '];
			temp.push(i);
			temp.push('</span> &nbsp;&nbsp;  Datapoints:<span class="values">');
			temp.push(_datapoints);
			temp.push('</span>&nbsp;&nbsp;<a data-toggle="modal" href="#plot" class="tooltips" rel="tooltip" data-original-title="plot"><i class="icon-fullscreen plot" id="'+i+'"></i></a> &nbsp; <a href="#" class="tooltips" rel="tooltip" data-original-title="contribution"><i class="icon-filter contribution" id="'+i+'"></i></a>&nbsp; <a href="#" class="tooltips" rel="tooltip" data-original-title="toggle"><i class="icon-retweet toggle-sample" data-type="sample" id="'+i+'"></i></a></span>');
			temp.push('<ul class="nav nav-tabs" id="sample-tabs'+i+'" ><li class="active"><a href="#sample-'+i+'1">1</a></li>');
  			var j=2;
  			while(j<=model.getK())
  				{
  					temp.push('<li><a href="#sample-'+i+j+'">'+j+'</a></li>');	
  					j++;
  				}
		  	temp.push('</ul><div class="tab-content"><div class="tab-pane active" id="sample-1"><pre>'+model.bootstrapGroupKeys[i][1]+'</pre></div>');
 			var j=2;
 			while(j<=model.getK())
  				{
  					temp.push('<div class="tab-pane" id="sample-'+i+j+'"><pre>'+model.bootstrapGroupKeys[i][j]+'</pre></div>');
  					j++;
  				}
		  	temp.push("</div>");
			$('#sampleList').append(temp.join(''));
			}
		$('.tooltips').tooltip();
		
		/*plot icon is present on each child of the sampleList Div . It basically opens a popup and plots a bar chart of that particular sample.*/
		$('.plot').on('click',function(e){
			$('.chart').html('');
			var sampleID=$(this).attr('id');
			//var sampleID=e.target.id;
			console.log("test"+sampleID);
			var values=model.getSampleValue(sampleID);
			//console.log("values for plot click:"+values);
			var temp=values.sort(function(a,b){return a-b});
			var start=Math.floor(temp[0]);
			var stop=Math.ceil(temp[values.length-1])+1;
			$('#plot').find('h3').text(' Sample : ' + sampleID );
			socr.vis.generate({
				parent : '.chart',
			    data : values,
			    height: 380,
			    width: 500,
			    nature: 'discreete'
				//range:[start,stop]
	        	})();
		});//click binding for .plot

		/**toggle-sample icon is present on each child of the sampleList Div . It basically toggles the data if the sample and sampleValue are different.
		*	TODO : disable this button if the app is data driven mode (as the sample and sampleValues are same.)
		*/
		$('.toggle-sample').on('click',function(){
				var id=$(this).attr('id');
				if($(this).attr('data-type')==='value')
					{
						$(this).parent().parent().find('pre').text(model.getSample(id));
						$(this).attr('data-type','sample');
					}
				else
					{
						//console.log("qwe:"+model.getSampleValue(id));
						$(this).parent().parent().find('pre').text(model.getSampleValue(id));
						$(this).attr('data-type','value');
					}
		});//click binding for .toggle-sample
			
		$('.contribution').on('click',function(){
			console.log("Mean of this sample:"+model.getMeanOf($(this).attr('id')));
			$("#accordion").accordion( "activate" , 2);
			console.log("dataset mean:"+model.getMeanOfDataset(1));
			console.log("standard deviation:"+ model.getStandardDevOf($(this).attr('id')));
			$('#dotplot').html('');
			createDotplot({
				variable : 'mean',
				sample : {
					mean : model.getMeanOf($(this).attr('id')),
					meanDataset : model.getMeanOfDataset(1),
					standardDev : model.getStandardDevOf($(this).attr('id'))
				}
			});

			/*
			 Renders the dotplot, 
  			 @ToDo : show individual contributions on a box chart
			 */
			function createDotplot(setting){	
				if(setting.variable=='mean')
					{
						var values = model.getMean();
						var datum = model.getMeanOfDataset(1);
						console.log("Mean Values:"+ values );
					}
				else if (setting.variable=='standardDev')
					{
						var values = model.getStandardDev();
						var datum=model.getStandardDevOfDataset(1);
						console.log("SD Values:"+ values );
					}
				else
					{
						var values = model.getPercentile();
						//var datum=model.getStandardDevOfDataset();
					}
				
				var histogram = socr.vis.generate({
					parent : '#dotplot',
					data : values,
					height:390,
					range: [0,10],
					dataSetMean :datum,
					sample : setting.sample,
					nature: 'continuous'
				})();
			}
			
			var html = '<div> Mean of Sample :'+ model.getMeanOf($(this).attr('id')) +' Mean of DataSet : '+ model.getMeanOfDataset() +' Standard Deviation :'+ model.getStandardDevOf($(this).attr('id')) +'</div>';
				
			var table =['<table class="table table-striped>"'];
			table.push('<tr><td>Mean Of Sample</td><td></td></tr>')
				$('#contribution-details').html(html)
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
		var count=Math.ceil((y-x)/500);		//count=number of pages. 500 samples per page.
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
	*	@method - toggleInputHandle
	*	@description - Method to toggle the input slider
	*
	**/
	toggleInputHandle: function(){
		$target = $('#slide-out-input');
		//console.log($(this).attr('href'));
		if(!$target.hasClass('active'))	{
			$target.addClass('active').show().css({left:-425}).animate({left: 0}, 500);
			$(this).css({left:-20}).animate({left: 410}, 500);
			socr.exp.inputSliderState=1;
		}
		else{
			$target.removeClass('active').animate({
				left: -425}, 500);
			$(this).css({left:400}).animate({left: -20}, 500);
			socr.exp.inputSliderState=0;
		}
	},
		/** 
	*	@method - toggleInputHandle
	*	@description - Method to toggle the input slider
	*
	**/
	toggleControllerHandle: function(){
		$target = $('#slide-out-controller');
		//console.log($(this).attr('href'));
		if(!$target.hasClass('active'))
		{
			$target.addClass('active').show().css({left:-425}).animate({left: 0}, 500);
			$(this).css({left:-30}).animate({left: 394}, 500);
			socr.exp.controllerSliderState=1;
		}
		else{
		$target.removeClass('active').animate({
					left: -425
				}, 500);
			$(this).css({left:400}).animate({left: -30}, 500);
			socr.exp.controllerSliderState=0;
		}
	},

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
     *@method - reset()
	 *@description: Clears all canvas and div. Resetting the view of the whole App
     * @dependencies : none
     */
	reset:function(){
		$('#displayCount').html('0');	//resetting the count to 0
		$('#sampleList').html('');		//clear the sample List dive
		$('#dataPlot').html('');		//clear dataPlot div
		$('#dotplot').empty();			//clear dotPlot div
		$('#accordion').accordion( "activate" , 0);
		$('.pagination').html('');
		$('#details').html('');
		$('#dataset').html('');
		// $("#input").inputtable('clear'); 
		_currentValues=[];
	},
	
	/**
     * Dont know where its called?
     *
     */
	createDatasetPlot:function(){
		var values=[0.1,0.5];
		var histogram = socr.vis.generate({
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
		if(model.bootstrapGroupKeys.length==0)
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
		$('#displayCount').text(model.getRSampleCount());
		return true;
	},
	/**
     *@method : updateSlider()
	 *@description:update the slider value
     * @dependencies : none
     */
	updateSlider:function(){
		//get the count and set it as the maximum value
		$( "#range" ).slider( "option", "max", model.getRSampleCount());
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
		var html='<div id="buttonPanel"><a href="#" class="tooltips" rel="tooltip" title="Step"><button class="btn" type="button" id="stepButton" tabindex="1" title="Step"><i class="icon-step-forward"></i></button></a> <a href="#" class="tooltips" rel="tooltip" title="Run"><button class="btn btn-success" type="button" id="runButton" tabindex="2" title="Run" ><i class="icon-fast-forward"></i></button></a><a href="#" class="tooltips" rel="tooltip" title="Stop"><button class="btn btn-danger" type="button" id="stopButton" tabindex="3" title="Stop" ><i class="icon-stop" ></i></button></a><a href="#" class="tooltips" rel="tooltip" title="Reset"><button class="btn" type="button" id="resetButton" tabindex="4" title="Reset" ><i class="icon-refresh" ></i></button></a><span><i class="icon-question-sign popups" rel="popover" data-content="<ul><li>Step Button : generates 1 sample</li><li>Run Button : generates X sample..X can be set from the option below</li><li>Stop Button :Stops the sample generation</li><li>Reset Button : Resets all values</li></ul>" data-original-title="Controls"></i></span>&nbsp;&nbsp;<a href="#"><button class="btn controller-back"><i class="icon-arrow-left" ></i></button></a></div><div id="speed-controller"><div><span class="badge badge-warning" style="float:left;">Animation Time: <span id="speed-value">200</span>ms</span></div><div id="speed-selector"></div></div><div class="tool"><span>Generate</span><input type="text" id="countSize" class="input-mini" value="1000"> <span>Samples with </span><input type="text" id="nSize" class="input-mini" value="50"><span>Datapoint per sample.</span></div><div><form class="form form-inline"><select id="variable" style="width:30%"><option value="f-value">F-Value</option><option value="mean">Mean</option><option value="count">Count</option><option value="standardDev">Standard Dev.</option><option value="Percentile">Percentile</option></select><input type="text" placeholder="binsize" name="binsize" class="input-mini"><span><a href="#" class="btn btn-danger popups" rel="popover" data-content="This will create a plot of the variable for each generated sample. Click this once you have generated some samples!" data-original-title="Inference" id="infer">Infer!</a></span></form></div>';
		$('#controller-content').html(html);
		$( "#speed-selector" ).slider({
			value:400,
			min: 100,
			max: 2000,
			step: 50,
			slide: function( event, ui ) {
			$( "#speed-value" ).html( ui.value );
			}
		});
		$('.controller-back').on('click',function(){
			socr.exp.current.createControllerView();
			socr.exp.current.initialize();
		});

		$('#variable').on('click',function(){
			var _percentile=$('#percentile-control');
			if($(this).val()=='Percentile')
			{
				if(_percentile.length)
					_percentile.show();
				else
					$('#controller-content').append('<div id="percentile-control"><div><span class="badge badge-warning" style="float:left;">Percentile: <span id="percentile-value">10</span>%</span></div><div id="percentile-selector"></div></div>');
				//create a slider
				$('#percentile-selector').slider({
				value:20,
				min: 10,
				max: 90,
				step: 5,
				slide: function( event, ui ) {
					$( "#percentile-value" ).html( ui.value );
					}
				});
			}
			else
				_percentile.hide();
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
		// Add the class ui-state-disabled to the headers that you want disabled
		$( ".ui-accordion-header").addClass("ui-state-disabled");
		// Now the hack to implement the disabling functionnality
		var accordion = $( "#accordion" ).data("accordion");
		accordion._std_clickHandler = accordion._clickHandler;
		accordion._clickHandler = function( event, target ) {
    	var clicked = $( event.currentTarget || target );
    	if (! clicked.hasClass("ui-state-disabled"))
    		{
        		this._std_clickHandler(event, target);
	    	}
		};
		//disable the back button in the controller tile
		var data=socr.exp.current.getDatasetValues();		// data is in the form of an array!
		var datakeys=socr.exp.current.getDatasetKeys();		// data is in the form of an array!
		var stopCount=setting.stopCount;		// Number of datapoints in a generated random sample
		var keys=setting.indexes;					// keys=array indexs of the datapoints in the dataset which are present in the current random sample 
		var i=0;
		var _dimensions=socr.exp.current.getSampleHW();
		setTimeout(animation);					//first call
				
		function animation(){
			var speed=$('#speed-value').html();	//calculate the speed currently set from the browser itself
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
					
				if(socr.exp.current.type=='coin')
					{
					var k = new Coin(document.getElementById("device"+sampleNumber));
					k.setValue(data[sampleNumber]);
					}
				else if(socr.exp.current.type=='card')
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
						$( ".ui-accordion-header" ).removeClass("ui-state-disabled");
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
		if(setting.variable=='mean'){
			var values = model.getMean();			//Mean values of all the generated random samples
			var datum = model.getMeanOfDataset(1);	//datum is the dataset mean value
			console.log("Mean Values:"+ values );	
		}
		else if (setting.variable=='standardDev'){
			var values = model.getStandardDev();	//Standard deviation values of all the generated random samples
			var datum=model.getStandardDevOfDataset(1);		//datum is the dataset SD value
			console.log("SD Values:"+ values );
		}
		else if (setting.variable=='count'){
			var values = model.getCount();	//Standard deviation values of all the generated random samples
			var datum=model.getCountOfDataset(1);		//datum is the dataset SD value
			console.log("Count Values:"+ values );
		}
		else if(setting.variable == 'percentile'){
			try{
				var pvalue=parseInt($('#percentile-value').html());
				//console.log(pvalue);
			}
			catch(err)
			{
				console.log("unable to read the percentile value from DOM. setting default value to 50%");
				var pvalue=50;
			}
			var values = model.getPercentile(pvalue);
			var datum=model.getPercentileOfDataset(pvalue);
			//var datum=model.getStandardDevOfDataset();
			console.log("Percentile Values:"+ values );
		}
		else{
			var values=model.getF();
			var datum=model.getFof("dataset");
			console.log(values);
		}
			
		//var values = [4,2,3,4,1,5,6,7];
		//var start=Math.floor(Array.min(values));
		//var stop=Math.ceil(Array.max(values));
		var temp=values.sort(function(a,b){return a-b});
		var start=Math.floor(temp[0]);
		var stop=Math.ceil(temp[values.length-1]);
		console.log("start"+start+"stop"+stop);
		console.log(values);


		var binNo = $('input[name="binno"]').val() != '' ? $('input[name="binno"]').val() : 10;

		_currentValues=values;
		socr.vis.generate({
			parent : '#dotplot',
			data : values,
			height:390,
			range: [start,stop],
			datum :datum,
			bins : binNo,
			variable: setting.variable	,
			nature: 'continuous'			
		})();
		
	},
	
	/**
	*@method: updateSimulationInfo
	*@description: Called when the 'step button' or 'run button' is pressed in the controller tile. Call is made in appController.js
	*@return : none
	*/
	updateSimulationInfo:function(){
		console.log('updateSimulationInfo() invoked');
		try{
			var array=['<table class="table table-striped">'];
			array.push('<tr><td>Experiment Name</td><td><strong>'+socr.exp.current.name+'</strong></td></tr>');
			array.push('<tr><td>DataSet Size </td><td><strong>'+socr.exp.current.getDatasetSize()+'</strong></td></tr>');
			array.push('<tr><td>Number of Random Samples : </td><td><strong>'+model.bootstrapSamples.length+'</strong></td></tr>');
			//dont show mean and standard deviation in info tab when there is no mean or sd.
			if(model.getMeanOfDataset()!=false)
				{
					array.push('<tr><td>DataSet Mean : </td><td><strong>'+model.getMeanOfDataset()+'</strong></td></tr>');
					array.push('<tr><td>DataSet Standard Deviation: </td><td><strong>'+model.getStandardDevOfDataset()+'</strong></td></tr>');
				}
			array.push('</table>');
		}
		catch(err){
			console.log("error:"+err.message);
		}
		$('#details').html(array.join(''));
	},
	
	/**
	*@method: CoverPage
	*@description: Called from the index.html page. Called whenever the window is resized!
	*@return : none
	*/
	CoverPage:function(){
		//console.log('CoverPage() invoked!');
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
	handleResponse:function(content,type,id){
		console.log('handleResponse');
		console.log($("#"+id+"-message"));
	if($("#"+id+"-message").length==0)
		{
		console.log($("#"+id));	
			$("#"+id).append("<div id='"+id+"-message'></div>");
			$response=$("#"+id+"-message") ;
		}

	//$response=$("#"+id+"-message") || $("#"+id).append("<div id='"+id+"-message'></div>");
	console.log($response);
	$response.html('').slideUp(300);
    $response.append(
    $('<div></div>')
      .addClass('alert')
      .html(content)
      ).slideDown(300);

    var $alertbox = $response.children('div');
	    switch(type) {
	  	  case "success":
	        $alertbox.addClass('alert-success');
	        $alertbox.append(' <i class="icon-ok"></i> ');
	        break;

	      case "error":
	        $alertbox.addClass('alert-error');
	        break;
	    }
 	}
	/*
	setPercentile:function(x){
		var N=_currentValues.length;
		console.log("N"+N);
		_currentValues=_currentValues.sort(function(a,b){return a-b});
		//console.log("_currentValues"+_currentValues);
		var index=((x)/100)*N;
		console.log("index: "+index);
		console.log("value: "+_currentValues[Math.floor(index)]);
		return _currentValues[Math.floor(index)];
	}
	*/
	}//return
}
