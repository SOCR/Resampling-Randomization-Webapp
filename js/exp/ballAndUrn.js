/**Ball and Urn Experiment
 *Dependencies on view.js
 *
*/

var ballAndUrn=(function(){

//::::::: PRIVATE PROPERTIES :::::::::::::::	
var _stepID;
var _mParam,_nParam,rParam,_type=0;		//User defined Parameters..bound to the buttons on the controller tile
var  _m = 50;					//Total number of balls in the urn
var  _r = 25;					//Number of RED balls in the urn
var  _n = 10;					//Number of balls to be drawn in one sample
var  _N = 50;					//Max number of balls that can be drawn in one sample --> max(_n)=_N.
var _y;
var _count;						//keeps count of number of balls drawn
var _dataset=[];
var _userReadableDataset=[];
var _width='30';
var _height='30';
var _ball = new Array(_N);
var _pop = new Array(_m);

//::::::PRIVATE METHODS:::::::::::::


function _selectBall(){
	if (_count < _n){
		if (_s[_count] <= _r)
			{
			_ball[_count].ballColor = "red";
			_y++;
			_userReadableDataset[_count]="R";
			}
		else 
			{
			_ball[_count].ballColor = "green";
			_userReadableDataset[_count]="G";
			}
		_dataset[_count]=_s[_count];
		_ball[_count].setValue(_s[_count]);
		_count++;
	}
	else{
		view.loadInputSheet(_userReadableDataset);
		//process the _dataset and convert it into a human readable sample space (example instead of 0 and 1 show tail and head)
		_self.reset();
	}
}

//returned object 
//:::::::::::: PUBLIC METHODS :::::::::::::
return{
	name:'Ball and Urn',
	type:'ball',
	initialize: function(){
		_self=this;
		_mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
		_mParam.setProperties(1, 100, 1, _m, "<var>Total M Balls </var>");
		_nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		_nParam.setProperties(1, _N, 1, _n, "<var>Draw N Balls</var>");
		_rParam = new Parameter(document.getElementById("rInput"), document.getElementById("rLabel"));
		_rParam.setProperties(1, _m, 1, _r, "<var>Red Balls </var>");
		
		//if u dont use var while defining a variable it is global!!
		    self=this;
		console.log('Experiment Ball and Urn initialized');
		this.reset();
		$("#sdbutton").on('click',function(){
			Experiment.generate();
			$("#accordion").accordion( "activate" , 1);
			});
		$("#rInput,#nInput").on('change',function(){Experiment.setVariable()});
		$('#mInput').on('change',function(){Experiment.setPopulation()});
		$('#type').on('click',function(){Experiment.setType()});
		$('#grsbutton').on('click',function(){
			$('#dataDriven-tab').update({to:'dataDriven'});
			});
	},
	
	generate:function(){
		view.updateSimulationInfo();		//updates experiment info into third tile in the accordion
		this.setVariable();
		this.createDataPlot(_n);
		$(".device-container").width(_width);
		$(".device-container").height(_height);
		for (var i = 0; i < _n; i++)
			_ball[i] = new Ball(document.getElementById("device" + i));
		for (var i = 0; i < _m; i++)
			{
                _pop[i] = i+1;
                    
            }
		_count = 0; 
		_s = sample(_pop, _n, _type);
		_y = 0;
		_stepID = setInterval(_selectBall, 50);
	},

	reset:function(){
		clearInterval(_stepID);
		this.setVariable();
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
		//this.reset();	
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
		//this.reset();
		
	},

	createControllerView:function(){
	console.log("createControllerView for CardExp executed!");
	var html='<p class="toolbar"><p class="tool"><span id="nLabel" class="badge badge-warning" for="nInput">Draw N Balls = </span><span id="nvalue"></span><input id="nInput" type="range" tabindex="7" class="parameter"/></p><p class="tool"><span id="mLabel" class="badge badge-warning" for="pInput">Total M Balls = </span><span id="mvalue"></span><input id="mInput" type="range" tabindex="8" class="parameter"/></p><p class="tool"><span id="rLabel" class="badge badge-warning" for="rInput">Red Balls = </span><span id="rvalue"></span><input id="rInput" type="range" tabindex="8" class="parameter"/></p><p class="tool"><input type="checkbox" tabindex="7" id="type"><span for="replaceCheck">With replacement</span></p></p><button class="btn" id="sdbutton">Generate DataSet!</button>&nbsp;<button class="btn btn-danger" id="grsbutton">Generate Random Samples!</button>';
		$('#controller-content').html(html);
	},
	createDataPlot:function(size){
	console.log("createDataPlot() invoked");
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
				temp.push('">Ball');
				temp.push(i);
				temp.push('</canvas>');
				temp.push('</div>');
			}
		$('#dataset').html(temp.join(''));
		console.log("createDataPlot() invoked . Dataplot created!");
	},
	
	setVariable:function(){
		console.log("setVariable() invoked");
		//_m = _mParam.getValue();
		_n = _nParam.getValue();
		_r = _rParam.getValue();
		
	},
	
	getDataset:function(){
		return _dataset;
	},
	
	getDatasetSize:function(){
		return _n;
	},
	
	getSampleHW:function(){
	return {"height":_height,"width":_width};
	}





}//return
}());