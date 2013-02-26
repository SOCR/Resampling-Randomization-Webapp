/*
*Card Experiment
*Dependencies on appview.js
*
*/

socr.exp.cardExp = function(){
//::::::: PRIVATE PROPERTIES :::::::::::::::
var _stepID;
var _nParam;		//User defined Parameters..bound to the buttons on the controller tile
var  _n = 12;
var _deck, _hand, _suit, _value;
var _d, _count;
var _K=null;

var _width='79';
var _height='123';
//::::::PRIVATE METHODS:::::::::::::

function _dealCard(){
	if (_tempK < _K){
		var _datum=_d[_tempK][_tempN];
		_hand[_count].setValue(_datum);
		_datasetValues[_tempK][_tempN]=_datasetKeys[_tempK][_tempN]=_datum;
		_count++;
		_tempN++;
		if (_tempN==_n) {
			_tempK++;_tempN=0;
			if(_tempK!=_K){
				_datasetKeys[_tempK]=[];
				_datasetValues[_tempK]=[];
			}
		}
	}
	else{
		console.log("Card Generated Dataset : "+_datasetValues + "-- socr.exp.cardExp.js");
		console.log(_datasetKeys); 
		console.log(_datasetValues);
		$("#grsbutton").removeClass("disabled"); 
		//view.loadInputSheet(_datasetValues);
		socr.exp.cardExp.reset();
	}
}



return{
	name:'Card Experiment',
	type:'card',
	description:'he card experiment consists of dealing n cards at random (and without replacement) from a standard deck of 52 cards. The cards (X1,X2,…,Xn) are recorded on each run. The parameter n can be varied from 1 to 12 with the input control.',
	initialize: function(){
		//socr.exp.cardExp=socr.exp.cardExp;
		self=this;
		_nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		_nParam.setProperties(1, 10, 1, _n, "<var>n</var>");
		self.reset();
		$("#sdbutton").on('click',function(){
			$("#grsbutton").addClass("disabled");	
			socr.exp.current.generate();
			$("#accordion").accordion( "activate" , 1);
			view.updateCtrlMessage("dataset generated successfully.","success");
		});
		$('#nInput').on('change',function(){
			socr.exp.current.setVariable();
		});
		$('#grsbutton').on('click',function(){
			$('#dataDriven-tab').update({to:'dataDriven'});
			view.updateSimulationInfo();
		});
	},
	
	generate: function(){
		view.updateSimulationInfo();		//updates experiment info into third tile in the accordion
		self.setVariable();
		self.createDataPlot(_n);			//create the canvas fro the dataset
		$(".device-container").width(_width);
		$(".device-container").height(_height);
		
		// variable initialization
		_count = 0; _arrCount=0;_datasetValues=[];_datasetKeys=[],_d=[],_tempK=0,_tempN=0,_datasetValues[0]=[],_datasetKeys[0]=[];

		// initializing the deck	
		_deck = new Array(52);
		for (var i = 0; i < 52; i++){
			_deck[i] = i + 1;
		}
		//initializing the hand for all the K datasets of size _n each
		_hand = new Array(_n*_K);
		
		//creating the canvas for all the devices(cards)
		for(var i=0;i<_K;i++){
			for (var j=0;j< _n;j++){
				_hand[_arrCount] = new Card(document.getElementById("device" + i+j));
				_arrCount++;	
				}	
			//creating the sample 
			_d[i] = sample(_deck, _n, 0);		
			}
		
		_stepID = setInterval(_dealCard, 20);
	},

	reset:function(){
		clearInterval(_stepID);
		socr.exp.cardExp.setVariable();
	},

	createControllerView:function(){
	console.log("createControllerView for socr.exp.cardExp executed!");
	var html='<p class="toolbar"></p><p class="tool"><span id="nLabel" class="badge badge-warning" for="nInput"><var><var>n</var></var> = 10</span><span id="nvalue"></span><input id="nInput" type="range" tabindex="7" class="parameter" min="1" max="100" step="1"></p><p><div><span class="badge badge-warning"> K=<span id="kValue">1</span></span><div id="kValue-slider" style="display:inline-block;width:50%;margin-left:5%"></div></p><button class="btn" id="sdbutton">Generate DataSet!</button><button class="btn btn-danger" id="grsbutton">Generate Random Samples!</button></div>';
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
				temp.push('">Card');
				temp.push(i);temp.push(j);
				temp.push('</canvas>');
				temp.push('</div>');
			}//for loop
			temp.push("</div>");
		}//for loop	
		$('#dataset').html(temp.join(''));
	},
	setVariable:function(){
	_n = _nParam.getValue();
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
		return {"keys":_datasetKeys,"values":_datasetValues,"processed":true};
	},
	getDatasetKeys:function(){
		return _datasetKeys;
	},
	getDatasetValues:function(){
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