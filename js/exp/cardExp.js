/**Card Experiment
 *Dependencies on view.js
 *
*/

socr.exp.cardExp = function(){
//::::::: PRIVATE PROPERTIES :::::::::::::::
var _stepID;
var _nParam;		//User defined Parameters..bound to the buttons on the controller tile
var  _n = 12;
var _deck, _hand, _suit, _value;
var _d, _count;
var _keys=[];
var _values=[];
var _width='79';
var _height='123';
//::::::PRIVATE METHODS:::::::::::::

function _dealCard(){
	if (_count < _n){
	_hand[_count].setValue(_d[_count]);
		_keys[_count]=_d[_count];
		_values[_count]=_d[_count];
		_count++;
	}
	else{
		console.log("Card Generated Dataset : "+_values + "-- socr.exp.cardExp.js");
		//view.loadInputSheet(_values);
		socr.exp.cardExp.reset();
	}
}



return{
	name:'Card Experiment',
	type:'card',
	initialize: function(){
		//socr.exp.cardExp=socr.exp.cardExp;
		
		_nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		_nParam.setProperties(1, 10, 1, _n, "<var>n</var>");
		socr.exp.cardExp.reset();
		$("#sdbutton").on('click',function(){
			socr.exp.current.generate();
			$("#accordion").accordion( "activate" , 1);
			if(socr.exp.inputSliderState==1){
				$('.input-handle').trigger('click');
				}
		});
		$('#nInput').on('change',function(){
			socr.exp.current.setVariable();
		});
		$('#grsbutton').on('click',function(){
			$('#dataDriven-tab').update({to:'dataDriven'});
		});
	},
	
	generate: function(){
		view.updateSimulationInfo();		//updates experiment info into third tile in the accordion
		//_n=$("#nInput").val();
		socr.exp.cardExp.setVariable();
		socr.exp.cardExp.createDataPlot(_n);			//create the canvas fro the dataset
		$(".device-container").width(_width);
		$(".device-container").height(_height);
		_hand = new Array(_n);
		for (var i = 0; i < _n; i++) 
			_hand[i] = new Card(document.getElementById("device" + i));
		_deck = new Array(52);
		for (var i = 0; i < 52; i++) 
			_deck[i] = i + 1;
		_count = 0;
		_d = sample(_deck, _n, 0);
		_stepID = setInterval(_dealCard, 50);
	},

	reset:function(){
		clearInterval(_stepID);
		socr.exp.cardExp.setVariable();
		/*
		for (var i = 0; i < 14; i++){
			if (i < n) 
				_hand[i].setValue(0);
			else 
				_hand[i].setValue(-1);
		}
		*/
	},
	createControllerView:function(){
	console.log("createControllerView for socr.exp.cardExp executed!");
	var html='<p class="toolbar"></p><p class="tool"><span id="nLabel" class="badge badge-warning" for="nInput"><var><var>n</var></var> = 10</span><span id="nvalue"></span><input id="nInput" type="range" tabindex="7" class="parameter" min="1" max="100" step="1"></p><button class="btn" id="sdbutton">Generate DataSet!</button><button class="btn btn-danger" id="grsbutton">Generate Random Samples!</button></div>';
	$('#controller-content').html(html);
	},
	createDataPlot:function(x){
		var temp=[];
		for(var i=0;i<x;i++)
			{
				temp.push('<div class="device-container" id="device');
				temp.push(i);
				temp.push('-container">');
				temp.push('<canvas id="device');
				temp.push(i);
				temp.push('" class="device ');
				temp.push(i);
				temp.push('" width="79" height="123" title="sample');
				temp.push(i);
				temp.push('">Card');
				temp.push(i);
				temp.push('</canvas>');
				temp.push('</div>');
			}
		$('#dataset').html(temp.join(''));
	},
	setVariable:function(){
	_n = _nParam.getValue();
	},
	getDataset:function(){
		return _keys;
	},
	getDatasetKeys:function(){
		return _keys;
	},
	getDatasetValues:function(){
		return _values;
	},
	getDatasetSize:function(){
	return _n;
	},
	getSampleHW:function(){
	return {"height":_height,"width":_width};
	}
  }//return	
}();