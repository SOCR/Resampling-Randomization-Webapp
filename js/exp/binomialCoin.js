//Binomial Coin Experiment
var binomialCoin=(function(){

this.ExpName='Binomial Coin Toss';
//::::::: PRIVATE PROPERTIES :::::::::::::::
var _pParam, _nParam; // binomialDist is the distribution object
var _p = 0.5;	  		//Probability of heads
var _N = 50;			//Maximum number of trials 
var _count;			//keeps count of number of samples(coin tosses)generated
var _n = 10; 			//Number of samples generated (coin tosses) for each step OR the number of trails in a step 
var _coin = new Array(_N);
var _stepID;
var _dataset=[];
//::::::PRIVATE METHODS:::::::::::::

function _tossCoin(){
	//alert('count'+_count+'max:'+_n);
	if (_count < _n){
		_dataset[_count]=_coin[_count].toss();
		_count++;
	}
	else{
		
		self.reset();
	}
}

//:::::::::::: PUBLIC METHODS :::::::::::::
return{
    	initialize: function(){
		//if u dont use var while defining a variable it is global!!
		self=this;
		nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		nParam.setProperties(1, _N, 1, _n, "<var>n</var>");
		 pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
		pParam.setProperties(0, 1, 0.01, _p, "<var>p</var>");
		this.reset();
		$("#sdbutton").on('click',function(){
			Experiment.step();
			});
		$('#nInput,#pInput').on('change',function(){
			Experiment.setPN();
			});
	},

	step: function(){
		//_n=$("#nInput").val();
		this.setPN();
             	//create the divs
		this.createDataPlot(_n);
		//assign a coin object to each
		for (var i = 0; i < _n; i++)
		_coin[i] = new Coin(document.getElementById("coin" + i));
		for (var i = 0; i < _n; i++){
                    _coin[i].prob = _p;
                    
            }
		_count = 0; 
		//resetting the sample space Coin array
		for (var i = 0; i < _n; i++){
                    if (i < _n) _coin[i].setValue(-1);
                    else _coin[i].setValue(-2);
		}
		//run the Coin toss
		_stepID = setInterval(_tossCoin, 50);
	},
	reset: function(){
		clearInterval(_stepID);
		this.setPN();
            /*
	    for (var i = 0; i < _N; i++){
                    _coin[i].prob = _p;
                    if (i < _n) _coin[i].setValue(-1);
                    else _coin[i].setValue(-2);
            }
            */
	},
	createControllerView:function(){
		var html='<p class="toolbar"><p class="tool"><span id="nLabel" class="badge badge-warning" for="nInput">N = </span><span id="nvalue"></span><input id="nInput" type="range" tabindex="7" class="parameter"/></p><p class="tool"><span id="pLabel" class="badge badge-warning" for="pInput">P = </span><span id="pvalue"></span><input id="pInput" type="range" tabindex="8" class="parameter"/></p><select id="rvSelect" tabindex="9" title="Random variable" ><option value="0" selected="true">Y: Number of heads</option><option value="1">M: Proportion of heads</option></select></p><button class="btn" id="sdbutton">Generate!</button>';
		$('#controller-content').html(html);
	},
	createDataPlot:function(x){
		var temp=[];
		for(var i=0;i<x;i++)
			{
				temp.push('<canvas id="coin');
				temp.push(i);
				temp.push('" class="coin panel click" title="Coin 1" width="30" height="30">Coin');
				temp.push(i);
				temp.push('</canvas>');
			}
		$('#dataPlot').html(temp.join(''));
	},
	setPN:function(){
		_p = pParam.getValue();
		_n = nParam.getValue();
	},
	getDataset:function(){
		return _dataset;
	}
}//return
}());


