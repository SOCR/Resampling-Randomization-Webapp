/*

	Ball and Urn Experiment
 	Revised from Distributome Ball And Urn Experiment by Selvam into a separate module

 	Notes:
 		1. Avoid using this in private/public methods.There is only a single instance and its methods can be accessed using the name,ie, socr.exp.ballAndUrn
 		2. No need to immediately invoke it
 		
 	@dependencies:
 		1. Uses methods of core.js,appController.js,appModel.js,appView.js
 		2. Uses intrinsic names of Element Ids mentioned in index.html
*/

socr.exp.ballAndUrn = function(){

//::::::: PRIVATE PROPERTIES :::::::::::::::	
var _stepID;
var _mParam,_nParam,rParam,_type=0;		//User defined Parameters..bound to the buttons on the controller tile
var  _m = 50;					//Total number of balls in the urn
var  _r = 25;					//Number of RED balls in the urn
var  _n = 10;					//Number of balls to be drawn in one sample
var  _N = 50;					//Max number of balls that can be drawn in one sample --> max(_n)=_N.
var _count;						//keeps count of number of balls drawn

var _width='30';
var _height='30';

var _ball = new Array(_N);
var _pop = new Array(_m);

var _K=null;
var _keys=[];
var _values=[];

var _datasetValues=[];
var _datasetKeys=[];

var clickFlag = false;

//::::::PRIVATE METHODS:::::::::::::


function _selectBall(){
	if (_tempK < _K){
		if (_s[_tempK][_tempN] <= _r){
			_ball[_count].ballColor = "red";
			_values[_count]="1";
			_datasetValues[_tempK][_tempN]="1";
			}
		else {
			_ball[_count].ballColor = "green";
			_values[_count]="0";
			_datasetValues[_tempK][_tempN]="0";
			}
		_keys[_count]=_s[_tempK][_tempN];
		_datasetKeys[_tempK][_tempN]=_s[_tempK][_tempN];
		_ball[_count].setValue(_datasetKeys[_tempK][_tempN],_datasetValues[_tempK][_tempN]);
		_tempN++;
		_count++;
		if (_tempN==_n) {
			_tempK++;_tempN=0;
			if(_tempK!=_K){
				_datasetValues[_tempK]=[];
				_datasetKeys[_tempK]=[];
			}
		}
	}
	else{
		console.log("temp values "+_datasetValues);
		console.log("temp keys "+ _datasetKeys);
		PubSub.publish("Initial dataset generated");
		socr.view.updateCtrlMessage("dataset generated successfully.","success");
		$("#grsbutton").removeClass("disabled");
		$("#sdbutton").removeClass("disabled"); 
		clickFlag = false;
		socr.exp.ballAndUrn.reset();
	}
}

//returned object 
//:::::::::::: PUBLIC METHODS :::::::::::::
return{
	name:'ballAndUrn',
	type:'ball',
	initialize: function(){
		_mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
		_mParam.setProperties(1, 100, 1, _m, "<var>Total M Balls </var>");
		_nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		_nParam.setProperties(1, _N, 1, _n, "<var>Draw N Balls</var>");
		_rParam = new Parameter(document.getElementById("rInput"), document.getElementById("rLabel"));
		_rParam.setProperties(1, _m, 1, _r, "<var>Red Balls </var>");
		
		console.log('Experiment Ball and Urn initialized');
		socr.exp.ballAndUrn.reset();
		
		$("#sdbutton").on('click',function(){
			//clicking this button only generates the dataset
			//doesnt load it into the appModel. Clicking the grsbutton does that.
			if( clickFlag === false){
				clickFlag = true;
			}
			else {
				console.log(clickFlag);
				return false;
			}
			$("#sdbutton").addClass("disabled"); 
			$("#grsbutton").addClass("disabled");	
			socr.exp.current.generate();
			$("#accordion").accordion( "activate" , 1);
		});
		$("#rInput,#nInput").on('change',function(){socr.exp.current.setVariable()});
		
		$('#mInput').on('change',function(){socr.exp.current.setPopulation()});
		
		$('#type').on('click',function(){socr.exp.current.setType()});
		
		$('#grsbutton').on('click',function(){
			if(_datasetValues.length!=0){
					socr.controller.loadController({to:'dataDriven',from:'Experiment'});	//Loads the data into the appModel .
					socr.view.updateSimulationInfo();		//updates experiment info into third tile in the accordion
				}
			else
				$('.controller-warning').html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">x</a><h4 class="alert-heading">Dataset NOT generated!</h4>Please click the adjacent "Generate Dataset!" button first.</div>');
		});
		PubSub.unsubscribe(socr.exp.current.initialize);
	},
	
	generate:function(){
		socr.view.updateSimulationInfo();		//updates experiment info into third tile in the accordion
		
		socr.exp.ballAndUrn.setVariable();
		socr.exp.ballAndUrn.createDataPlot(_n);
		
		$(".device-container").width(_width);
		$(".device-container").height(_height);
		
		//variable initialization
		_count = 0; _arrCount=0;_values=[];_keys=[];_datasetValues={};_datasetKeys=[];_datasetValues=[];_datasetKeys=[],_y=0,_s=[],_tempN=0,_tempK=0;
		_datasetValues[0]=[];_datasetKeys[0]=[];
		//initializing the bag containing all the balls 
		for (var i = 0; i < _m; i++){
                _pop[i] = i+1;       
            }
        //creating the canvas for all the devices(cards)
		for(var i=0;i<_K;i++){
			for (var j=0;j< _n;j++){
				_ball[_arrCount] = new Ball(document.getElementById("device" + i+j));
				//console.log(i+"---"+j+_coin[_arrCount]);	
				_arrCount++;	
				}
				_s[i] = sample(_pop, _n, _type);	
			}
		
		
		_stepID = setInterval(_selectBall, 20);
	},

	reset:function(){
		clearInterval(_stepID);
		socr.exp.ballAndUrn.setVariable();
	},
	setPopulation:function() {
		_m = _mParam.getValue();
		_pop = new Array(_m);
		for (var i = 0; i < _m; i++) 
			_pop[i] = i + 1;
		if (_type == 0) 
			_nParam.setProperties(1, Math.min(_m, _N), 1, Math.min(_n, _m), "<var>n</var>");
		else 
			_nParam.setProperties(1, _N, 1, _n, "<var>n</var>");
		_n = _nParam.getValue();	
		_rParam.setProperties(1, _m, 1, Math.round(_m / 2), "<var>r</var>");
		_r = _rParam.getValue();
		//socr.exp.ballAndUrn.reset();	
	},
	setType:function(){
		if (document.getElementById('type').checked) 
			_type = 1; 
		else 
			_type = 0;
		if (_type == 0) 
			_nParam.setProperties(1, Math.min(_m, _N), 1, Math.min(_n, _m), "n");
		else 
			_nParam.setProperties(1, _N, 1, _n, "<var>Draw N Balls </var>");
		_n = _nParam.getValue();
		
	},

	createControllerView:function(){
		console.log("createControllerView for Ball and Urn executed!");
		$.get("partials/exp/ballAndUrn.tmpl",function(data){
			var config = {};
			var html = Mustache.render(data,config);
			$('#controller-content').delay(1000).html(html);
			$('.popups').popover();
			try{
				$('.tooltips').tooltip('destroy');	// destroy first and bind tooltips again. UI bug: the "back to generateDataset" (back button) tooltip doesnt vanish after mouse click.
			}
			catch(err){
				console.log(err.message);
			}
			$('.tooltips').tooltip();
			$( "#kValue-slider" ).slider({
				value: 1,
				min: 1,
				max: 10,
				step: 1,
				slide: function( event, ui ) {
					$( "#kValue" ).html( ui.value );
				}
			});
			PubSub.publish("controller view for ballAndUrn created");
		});
	},
	createDataPlot:function(size){
	console.log("createDataPlot() invoked");
		var temp=[];
		for(var i=0;i<_K;i++){
			temp.push('<div class="dataset-container ');
			if(i%2===0){
				temp.push(' highlight');
			}
			temp.push('" id="dataset-');
			temp.push(i);
			temp.push('">');
			for(var j=0;j<size;j++){
				temp.push('<div class="device-container ');
				temp.push('" id="device');
				temp.push(i);temp.push(j);
				temp.push('-container">');
				temp.push('<canvas id="device');
				temp.push(i);temp.push(j);
				temp.push('" class="device panel front');
				temp.push(i);temp.push(j);
				temp.push('" width="');
				temp.push(_width);
				temp.push('" height="');
				temp.push(_height);
				temp.push('" title="sample');
				temp.push(i);temp.push(j);
				temp.push('">Coin');
				temp.push(i);temp.push(j);
				temp.push('</canvas>');
				temp.push('</div>');
			}//for loop
			temp.push("</div>");
		}//for loop
		$('#dataset').html(temp.join(''));
		console.log("createDataPlot() invoked . Dataplot created!");
	},
	
	setVariable:function(){
		console.log("setVariable() invoked");
		//_m = _mParam.getValue();
		_n = _nParam.getValue();
		_r = _rParam.getValue();
		_m = _mParam.getValue();
		try{
			_K=parseInt($("#kValue").html());
			console.log("k value"+_K);
		}
		catch(err){
			console.log(err.message);
			_K=null;
		}
	},
	
	getDataset:function(){
		//console.log("getDataset called:"+ _datasetKeys);
		return {"keys":_datasetKeys,"values":_datasetValues,"processed":true};
	},
	getDatasetKeys:function(){
		//console.log("getDatasetKeyscalled:"+ _datasetKeys);
		return _datasetKeys;
	},
	getDatasetValues:function(){
		//console.log("getDatasetValues called:"+ _datasetValues);
		return _datasetValues;
	},
	
	getDatasetSize:function(){
		return _n;
	},
	
	getSampleHW:function(){
	return {"height":_height,"width":_width};
	}
	
	}//return
}();