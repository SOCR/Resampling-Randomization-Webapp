/*

	Beta Binomial Experiment
 	Notes:
 		1. Avoid using this in private/public methods.There is only a single instance and its methods can be accessed using the name,ie, betaBinomial
 		2. No need to immediately invoke it
 		
 	@dependencies:
 		1. Uses methods of core.js,appController.js,appModel.js,appView.js
 		2. Uses intrinsic names of Element Ids mentioned in index.html
 		*/
socr.exp.betaBinomial = function(){
	//::::::: PRIVATE PROPERTIES :::::::::::::::
	var _stepID;
	var _aParam,_bParam, _nParam; 
	var _a=2,_b=2 ;
	var _N = 60;			//Maximum number of trials 
	var _count;				//keeps count of number of coins tossed
	var _n = 10; 			//Number of coin tossed for each step 
	var _K=null;
	var _keys=[];
	var _values=[];
	var _tempKeys=[];
	var _tempValues=[];
	var _datasetValues=[];
	var _datasetKeys=[];
	var clickFlag = false;
	var _width ='750',_height='40';
	var _timeline=[],_p,_val,_betaDist;

	function _doTrial(){
		if (_tempK < _K){
			_betaDist.data.reset();

			if (Math.random() < _betaDist.simulate()){
				_timeline[_tempK].addArrival(_tempN, "red");
				_val = '0';
			}
			else {
				_timeline[_tempK].addArrival(_tempN, "green");
				_val = '1';
			}
			_timeline[_tempK].draw(_tempN);
			_datasetValues[_tempK].push(_val);
			_datasetKeys[_tempK].push(_val);
			_count++;
			_tempN++;
			if (_tempN ==_n) {
				_tempK++;_tempN=0;
				if(_tempK!=_K){
					_datasetKeys[_tempK]=[];
					_datasetValues[_tempK]=[];
				}
			}
		}

		else {
			socr.view.updateCtrlMessage("dataset generated successfully.","success");
        	PubSub.publish("Initial dataset generated");
			$("#grsbutton").removeClass("disabled"); 
			$("#sdbutton").removeClass("disabled");
			clickFlag = false; 
			socr.exp.betaBinomial.reset();
		}
	}

	return{
		name:"betaBinomial",
		type:"timeline",
		description:"The random experiment consists of tossing n coins, each with probability of heads p. Random variable Y gives the number of heads, and random variable M gives the proportion of heads. These are recorded on each update in the data table. Either Y or M can be selected with the list box. The probability density function and moments of the selected variable are shown in blue in the distribution graph blue and are recorded in the distribution table. On each update, the empirical density function and moments of the selected variable are shown in red in the distribution graph and are recorded in the distribution table. The parameters n and p can be varied with scroll bars.",
	    
		initialize:function(){
			console.log("initialize started")
			_nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
			_nParam.setProperties(1, _N, 1, _n, "<var>n</var>");
			_aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
			_aParam.setProperties(0.5, 10, 0.1, _a, "<var>a</var>");
			_bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
			_bParam.setProperties(0.5, 10, 0.1, _b, "<var>b</var>");
			socr.exp.betaBinomial.reset();
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
				socr.exp.betaBinomial.generate();		
				$("#accordion").accordion( "activate" , 1);
			});

			$('#nInput,#aInput,#bInput').on('change',function(){
				socr.exp.betaBinomial.setVariable();
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
			socr.exp.betaBinomial.setVariable();
	        socr.exp.betaBinomial.createDataPlot(_n);			//create the canvas fro the dataset
			//assign a coin object to each
			_count = 0;_values=[];_keys=[];_tempK=0;_tempN=1;_tempValues=[];_tempKeys=[];_datasetValues=[],_datasetKeys=[],_datasetValues[0]=[],_datasetKeys[0]=[];
			for(var i=0;i<_K;i++){
				_timeline[i] = new Timeline(document.getElementById("device"+i),1,_n,1);
				_timeline[i].setPointSize(5);
			}
			//run the Coin toss
			_stepID = setInterval(_doTrial, 20);
		},
		reset: function(){
			clearInterval(_stepID);
			socr.exp.betaBinomial.setVariable();
 		},
		createControllerView:function(){
			config={};
			console.log("createControllerView for betaBinomial executed!");
			$.get("partials/exp/betaBinomial.tmpl",function(data){
            	var temp = Mustache.render(data,config);
            	$("#controller-content").delay(1000).html(temp);
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
			PubSub.publish("controller view for betaBinomial created")
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
					temp.push('<canvas id="device');
					temp.push(i);
					temp.push('" class="panel front');
					temp.push(i);
					temp.push('" width="');
					temp.push(_width);
					temp.push('" height="');
					temp.push(_height);
					temp.push('" title="sample');
					temp.push(i);
					temp.push('">Coin');
					temp.push(i);
					temp.push('</canvas>');
				temp.push("</div>");	
			}
			$('#dataset').html(temp.join(''));
		},
		setVariable:function(){
			_n = _nParam.getValue();
			_b = _bParam.getValue();
			_a = _aParam.getValue();
			_betaDist =new BetaDistribution(_a, _b);
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

