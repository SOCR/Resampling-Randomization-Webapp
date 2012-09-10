/**Binomial Coin Experiment
 *Dependencies on view.js
 *
*/
var binomialCoin=(function(){


//::::::: PRIVATE PROPERTIES :::::::::::::::
var _stepID;
var _pParam, _nParam; // binomialDist is the distribution object
var _p = 0.5;	  		//Probability of heads (default value = 0.5)
var _N = 100;			//Maximum number of trials 
var _count;				//keeps count of number of coins tossed
var _n = 10; 			//Number of coin tossed for each step 
var _keys=[];
var _values=[];
var _width='30';
var _height='30';
var _coin = new Array(_N);

//::::::PRIVATE METHODS:::::::::::::

function _tossCoin(){
	//alert('count'+_count+'max:'+_n);
	if (_count < _n){
		_values[_count]=_coin[_count].toss();
		if(_values[_count]=='1')
			_keys[_count]='H';
		else
			_keys[_count]='T';
		_count++;
	}
	else{
		view.loadInputSheet(_values);
		self.reset();
	}
}

//:::::::::::: PUBLIC METHODS :::::::::::::
return{
	name:'Binomial Coin Toss',
	type:'coin',
    initialize: function(){
		//if u dont use var while defining a variable it is global!!
		self=this;
		_nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		_nParam.setProperties(1, _N, 1, _n, "<var>n</var>");
		_pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
		_pParam.setProperties(0, 1, 0.01, _p, "<var>p</var>");
		this.reset();
		
		// BINDING BUTTONS OF THE CONTROLLER
		$("#sdbutton").on('click',function(){
			Experiment.generate();
			$("#accordion").accordion( "activate" , 1);
			if(inputSliderState==1)
				{
				console.log("inputSliderState:"+inputSliderState);
				$('.input-handle').trigger('click');
				}
			});
		$('#nInput,#pInput').on('change',function(){
			Experiment.setVariable();
			});
		$('#grsbutton').on('click',function(){
			$('#dataDriven-tab').update({to:'dataDriven'});
			});
	},

	generate: function(){
			
		view.updateSimulationInfo();		//updates experiment info into third tile in the accordion
		//_n=$("#nInput").val();
		this.setVariable();
        this.createDataPlot(_n);			//create the canvas fro the dataset
		//assign a coin object to each
		for (var i = 0; i < _n; i++)
		_coin[i] = new Coin(document.getElementById("device" + i));
		for (var i = 0; i < _n; i++){
                    _coin[i].prob = _p;
                    
            }
		_count = 0; 
		//resetting the sample space Coin array
		for (var i = 0; i < _n; i++){
            if (i < _n)
				_coin[i].setValue(-1);
            else
				_coin[i].setValue(-2);
		}
		//run the Coin toss
		_stepID = setInterval(_tossCoin, 50);
	},
	reset: function(){
		clearInterval(_stepID);
		this.setVariable();
 	},
	createControllerView:function(){
	console.log("createControllerView for binomialCoin executed!");
		var html='<p class="toolbar"><p class="tool"><span id="nLabel" class="badge badge-warning" for="nInput">N = </span><span id="nvalue"></span><input id="nInput" type="range" tabindex="7" class="parameter"/></p><p class="tool"><span id="pLabel" class="badge badge-warning" for="pInput">P = </span><span id="pvalue"></span><input id="pInput" type="range" tabindex="8" class="parameter"/></p><select id="rvSelect" tabindex="9" title="Random variable" ><option value="0" selected="true">Y: Number of heads</option><option value="1">M: Proportion of heads</option></select></p><button class="btn" id="sdbutton">Generate DataSet!</button>&nbsp;<button class="btn btn-danger" id="grsbutton">Generate Random Samples!</button>';
		$('#controller-content').html(html);
	},
	
	createDataPlot:function(size){
		var temp=[];
		for(var i=0;i<size;i++)
			{
				temp.push('<div class="device-container" id="device');
				temp.push(i);
				temp.push('-container">');
				temp.push('<canvas id="device');
				temp.push(i);
				temp.push('" class="device panel front');
				temp.push(i);
				temp.push('" width="30" height="30" title="sample');
				temp.push(i);
				temp.push('">Coin');
				temp.push(i);
				temp.push('</canvas>');
				temp.push('</div>');
			}
		$('#dataset').html(temp.join(''));
		
	},
	
	setVariable:function(){
		_p = _pParam.getValue();
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
}());


