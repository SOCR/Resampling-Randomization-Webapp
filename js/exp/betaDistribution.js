/*

	Beta Distribution Experiment

 	Notes:
 		1. Avoid using this in private/public methods.There is only a single instance and its methods can be accessed using the name,ie, betaDistribution.
 		2. No need to immediately invoke it
 		
 	@dependencies:
 		1. Uses methods of core.js,appController.js,appModel.js,appView.js
 		2. Uses intrinsic names of Element Ids mentioned in index.html
 		*/
socr.exp.betaDistribution=function(){

//::::::: PRIVATE PROPERTIES :::::::::::::::
var _stepID;
var _nParam, _kParam; // betaDistribution is the distribution object
var _k = 1;	  		//Probability of heads (default value = 0.5)
var _count;				//keeps count of number of coins tossed
var _n = 10; 			//Number of coin tossed for each step 
var _K=null;
var _tempKeys=[];
var _tempValues=[];
var _datasetValues=[];
var _datasetKeys=[];
/*
*TODO : make the height and width dynamic according to the size of dataset generated.
*/
var _width='30';
var _height='30';
var _arrCount=0;

var clickFlag = false;

var _coin = [];
var _dist = null;

function _experiment(){
	if (_tempK < _K){
		var _val = _dist.simulate();
		_coin[_count].setValue(_val);
		_datasetValues[_tempK][_tempN]=_datasetKeys[_tempK][_tempN]=_val;
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
        socr.view.updateCtrlMessage("dataset generated successfully.","success");
        PubSub.publish("Initial dataset generated");
		$("#grsbutton").removeClass("disabled");
		$("#sdbutton").removeClass("disabled"); 
		clickFlag = false;
		socr.exp.betaDistribution.reset();
	}
}

return{
	name:"betaDistribution",
	initialize:function(){
		_nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		_nParam.setProperties(1, 50, 1, _n, "<var>n</var>");
		_kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
		_kParam.setProperties(1, _n, 1, Math.min(_n, _k), "<var>k</var>");
		socr.exp.betaDistribution.reset();
		// BINDING BUTTONS OF THE CONTROLLER
		$("#sdbutton").on('click',function(){
			//clicking this button only generates the dataset.
			//doesnt load it into the appModel. Clicking the grsbutton does that.
			if( clickFlag === false){
				clickFlag = true;
			}
			else {
				console.log(clickFlag);
				return false;
			}	
			$("#grsbutton").addClass("disabled");
			$("#sdbutton").addClass("disabled");	
			socr.exp.betaDistribution.generate();		
			$("#accordion").accordion( "activate" , 1);
		});

		$('#nInput,#kInput').on('change',function(){
			socr.exp.betaDistribution.setVariable();
			});

		$('#grsbutton').on('click',function(){
			if(_datasetValues.length!=0)
				{
					socr.controller.loadController({to:'dataDriven',from:'Experiment'});	//Loads the data into the appModel .
					socr.view.updateSimulationInfo();		//updates experiment info into third tile in the accordion
				}
			else
				$('.controller-warning').html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">x</a><h4 class="alert-heading">Dataset NOT generated!</h4>Please click the adjacent "Generate Dataset!" button first.</div>');
			});
		PubSub.unsubscribe(socr.exp.current.initialize);
	},

	generate: function(){
		socr.exp.betaDistribution.setVariable();
        socr.exp.betaDistribution.createDataPlot(_n);			//create the canvas fro the dataset
		//assign a coin object to each
		_count = 0; _arrCount=0;_values=[];_keys=[];_tempValues=[];_tempKeys=[];_datasetValues=[];_datasetKeys=[],_tempN=0,_tempK=0;
		_datasetValues[0]=[];_datasetKeys[0]=[];	
		_dist = new BetaDistribution(_k, _n - _k + 1);
		for(var i=0;i<_K;i++){
			for (var j=0;j< _n;j++){
				_coin[_arrCount] = new RSample(document.getElementById("device"+i+j));		
				_coin[_arrCount].setValue(-1);
				//console.log(i+"---"+j+_coin[_arrCount]);	
				_arrCount++;	
			}	
		}
		//run the Coin toss
		_stepID = setInterval(_experiment, 20);
	},
	reset: function(){
		clearInterval(_stepID);
		socr.exp.betaDistribution.setVariable();
 	},
	
	createControllerView:function(){
		//console.log("createControllerView for betaDistribution executed!");
		$.get("partials/exp/betaDistribution.tmpl",function(data){
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
				value:1,
				min: 1,
				max: 10,
				step: 1,
				slide: function( event, ui ) {
				$( "#kValue" ).html( ui.value );
				}
			});
			console.log("createControllerView for betaDistribution executed!");
			PubSub.publish("controller view for betaDistribution created");
		});
	},
	
	createDataPlot:function(size){
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
			}
			temp.push("</div>");	
		}
		
		$('#dataset').html(temp.join(''));
		
	},
	
	setVariable:function(){
		_n = _nParam.getValue();
		_k = _kParam.getValue();
		_kParam.setProperties(1, _n, 1, Math.min(_n, _k), "<var>k</var>");
		try
			{
				_K=parseInt($("#kValue").html());
			}
			catch(err)
			{
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
	},
	getK:function(){
		if(_K === null)
			return false;
		else
			return _K;
	}
}//return
}();
