var dataDrivenView=function(dataDrivenModel){
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
	
	//self=this;
	function _create(start,size){
		console.log("_create funtion started");
		console.log(model.bootstrapSamples);
		y=parseInt(start)+size;
		//$('#sampleList').html('');		//first empty the sample list
		//change the loop to a inverse while loop
		
		for(var i=start;i<y;i++)
			{
			var temp=['<div class="entry"><div class="header">Sample<span class="values"> '];
			temp.push(i);temp.push('</span> &nbsp;&nbsp;  Datapoints:<span class="values">');
			temp.push(_datapoints);
			temp.push('</span>&nbsp;&nbsp;<a data-toggle="modal" href="#plot"><i class="icon-fullscreen plot" id="'+i+'"></i></a> &nbsp; <a href="#"><i class="icon-filter" id="'+i+'"></i></a></span><pre>');
			temp.push(model.bootstrapSamples[i+1]);
			temp.push('</pre></div>');
			$('#sampleList').append(temp.join(''));
			}
		$('.plot').on('click',function(){
			//$('.modal-body').html('');
			//alert('1');
			var values=model.bootstrapSamples[$(this).attr('id')];
			var values=[2,3,5,4,3];
			
			var histogram = vis({
			height: 400, 
			width: 300,
			parent : '.device',
			data : values,
			range:[1,10]
			});
			histogram();
			});
	}
	/*	
	function _create1Pagination(x,y){
		var count=Math.ceil((y-x)/500);		//number of pages
		alert('count:'+count)
		$("#pagination").paginate({
				count 			:count,
				start 			:1,
				display     		:10,
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
			alert('1');
			var start=$(this).text()*500-500;
			_create(start,500);
			});
	}
	*/
	function _createPagination(x,y){
		var count=Math.ceil((y-x)/500);		//number of pages
		$(".pagination").paginate({
				count 		: count,
				start 		: 1,
				display     : 7,
				border					: true,
				border_color			: '#fff',
				text_color  			: '#fff',
				background_color    	: 'black',	
				border_hover_color		: '#ccc',
				text_hover_color  		: '#000',
				background_hover_color	: '#fff', 
				images					: false,
				mouse					: 'press',
				onChange     			: function(page){
											$('._current','#paginationdemo').removeClass('_current').hide();
											$('#p'+page).addClass('_current').show();
										  }
			});
		$('.pagination li').on('click',function(){
			alert('1');
			var start=$(this).text()*500-500;
			_create(start,500);
			});
	}
	/*
	function _create21Pagination(x,y){
		
		var count=Math.ceil((y-x)/500);		//number of pages
		var html=['<ul>'];
		html.push('<li><a href="#"><<</a></li>');
		for(var i=1;i<count;i++)
			{
			var temp='<li><a href="#">'+i+'</a></li> ';
			html.push(temp);
			}
		html.push('<li><a href="#">>></a></li>');
		html.push('</ul>');
		$('.pagination').append(html.join(''));
	}
	*/
	function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
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
		$('#pagination').html('');
		$('#details').html('');
		//also clear the canvas
	},
	
	createDatasetPlot:function(){
		var values=[0.1,0.5];
		var histogram = vis({
			height: 400, 
			width: 300,
			parent : '#dataPlot',
			data : values,
			range: [0,10]
			});
			histogram();
		},
	
	createList:function(x){
		var range=x.split('-');
		//alert(range[1]);
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
	
	updateCounter:function(){
		//count value changed on top
		$('#displayCount').text(model.getCount());
		return true;
	},
	
	updateSlider:function(){
		//get the count and set it as the maximum value
		//$( "#range" ).slider({ disabled: false });
		$( "#range" ).slider( "option", "max", model.getCount());
		$( "#range" ).slider( "option", "min", 0);
		//$( "#showCount" ).html($( "#range" ).slider( "values",0 )+" - " + $( "#range" ).slider( "values", 1 ) );
		//alert($( "#range" ).slider( "value"));
	},
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
	createControllerView:function(){
		var html='<button class="btn" type="button" id="stepButton" tabindex="1" title="Step"><img src="img/step.png" alt="Step" title="Step" /> </button> <button class="btn btn-success" type="button" id="runButton" tabindex="2" title="Run" ><img id="runImage" src="img/run.png" alt="Run" title="Run" /></button><button class="btn btn-danger" type="button" id="stopButton" tabindex="3" title="Stop" ><img id="stopImage" src="img/stop.png" alt="Stop" title="Stop" /></button><button class="btn" type="button" id="resetButton" tabindex="4" title="Reset" ><img src="img/reset.png" alt="Reset" title="Reset" /></button><span><i class="icon-question-sign popups" rel="popover" data-content="<ul><li>Step Button : generates 1 sample</li><li>Run Button : generates X sample..X can be set from the option below</li><li>Stop Button :Stops the sample generation</li><li>Reset Button : Resets all values</li></ul>" data-original-title="Controls"></i></span><p><span>Speed:  </span><select id="speed" style="width:100px" tabindex="3" title="Animation Speed"><option value="slow">slow</option><option value="medium">medium</option><option value="fast">fast</option></select></p><p class="tool"><span>Generate</span><input type="text" id="countSize" class="input-small" value="1000"> <span>Samples with </span><input type="text" id="nSize" class="input-small" value="50"><span>Datapoint per sample.</span></p><p><select id="variable" style="width:100px;margin-top:10px"><option value="slow">Mean</option><option value="medium">S.D</option><option value="fast">Percentile</option></select><span><a href="#" class="btn btn-danger popups" rel="popover" data-content="This will create a plot of the variable for each generated sample. Click this once you have generated some samples!" data-original-title="Inference" id="infer">Infer!</a></span></p>';
		$('#controller-content').html(html);
	},
	/*animates the resample generation process....input is the resample datapoints array indexes*/
	animate:function(x){
	//clear old
	//for(var i=0;i<;)
	console.log('indexes of resample: '+x);
	var data=Experiment.getDataset();
	for(var i=0;i<x.length;i++)
		{	alert(model.bootstrapSamples[model.getCount()-1]);
			var y='#coin'+x[i];
			var z='#coin-container'+x[i];
			y=$(y).clone();
			$(z).append(y).css('z-index','10');
			$(y).addClass('click');
			$(y).css('-webkit-transition','all 5s');
			$(y).css('-webkit-transform','translate(0px,150px)');
			var k = new Coin(document.getElementsByClassName("coin"+x[i])[1]);
			k.setValue(data[x[i]]);
			/*
			$(y).css('-webkit-transition','all 1s');
			$(y).css('-webkit-transform','translate(400px)');
			
			$('#dataPlot').append('<canvas id="coin5" class="coin panel click" title="Coin5" width="30" height="30">Coin7</canvas>');
			
			var d = $('#coin5');
			d.style.position = "absolute";
			x=getPos(document.getElementById('coin5'));
			d.style.left =x.lx;
			d.style.top = x.ly;
			*/
		
		}
	},
	createDotplot:function(setting){
		console.log('createDotplot started');
		//setting.variable;
		
		var values=model.getMean();
		//alert(values);
		console.log(values);
		//get the mean array
		var histogram = vis({
			height: 400, 
			width: 300,
			parent : '#dotplot',
			data : values,
			range:[0,1]
			});
			histogram();
		
	},
	updateDetails:function(){
		$('#experimentName').html(Experiment.name);
		t=new Date();
		$('#startTime').html(t.getTime());
	}
	
    }//return
};

/*
INCOMPLETE FUNCTIONS

clear
getMean

*/

