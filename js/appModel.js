/**
*  appModel.js is the model object for the SOCR app.
*
*@author: selvam , ashwini 
*
*SOCR - Statistical Online Computational Resource
*/

var appModel=function(){
/*
 *FOR DATA DRIVEN
 *
 */
//::::::: PRIVATE PROPERTIES :::::::::::::::
	var _stopCount = 1000;			//Number of runs to be made when 'run' button is pressed 
	var _count=0;				//keeps count of number of samples generated from start
	var _dataset=['1','2','3','4','5','6','7','8','9','10'];			// All the input datapoints from wich bootstrap sample is generated
	var _n=50;				//Number of datapoints in a bootstrap sample or Sample Size
	var bootstrapSamples=new Array();	//Contains all the bootstrap samples generated
	//var variables;				//number of variables
	var _data;
	var sample=[];
	var keys=[];
	var _temp;
	var _sampleMean=[];
	var coin = new Array(N);
/*
 *FOR SIMULATION DRIVEN
 *
 */
	var N=100;
	var p = 0.5;	  		//Probability of heads
	var N = 50;			//Maximum number of trials 

/*
 IF EVENT DISPATCH MODEL IS TO BE IMPLEMENTED
	subject = new LIB_makeSubject(['generateSamples','generateSample']); //list of all the events with observer pattern
*/

/* PRIVATE METHODS   */

	/**
	*@method: [private] _getRandomInt()
	*@desc:  returns a random number in the range [min,max]
	*/
	function _getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min )) + min;
		}

	/**
	*@method: [private] _generateMean()
	*@param:  sampleNumber - the random sample number for which the mean is to be calculated
	*@desc:  returns a random number in the range [min,max]
	*@return: the calculated mean value
	*/
	function _generateMean(sampleNumber){
		var x=bootstrapSamples[parseInt(sampleNumber)];
		var total=0;
		for(var i=0;i<x.length;i++) 
			{ total += parseInt(x[i]); }
		//console.log("total :"+total);	
		return total/x.length;
	}

return{
	/* PUBLIC PROPERTIES   */
	bootstrapSamples:bootstrapSamples,
	sample:sample,
	
	/* PUBLIC METHODS   */
	/*
	addObserver:subject.addObserver(),
	removeObserver:subject.removeObserver()
	*/    
    //i think this should be a private function
	/**
	*@method: [public] generateTrail()
	*@desc:  rgenerating a random number between 0 and dataSet size 
	*/
	generateTrail:function(){
		randomKey=_getRandomInt(0, _dataset.length);	//generating a random number between 0 and dataSet size 
		return {data:_dataset[randomKey],key:randomKey};			//returning the generated trail into a bootstrap sample array
	},
    
	/**
	*@method: [public] generateSample()
	*@desc:  rgenerating a random number between 0 and dataSet size 
	*/
	generateSample:function(){
		var j=_n;
		//bootstrapSamples[_count]=new Array();			//initializing the new sample array
		var sample=[];
		while(j--)
			{
			//bootstrapSamples[_count][j]=this.generateTrail();
			var temp=this.generateTrail();
			//alert(temp.data);
			sample[j]=temp.data;	//inserting the new sample
			}
		bootstrapSamples[_count]=sample;
		//bootstrapSamples[_count]= new Array(sample);
		//console.log(_count+':'+bootstrapSamples[_count]);
		_count++;		//incrementing the total count - number of samples generated from start of simulation
		
	},
	
	/**
	*@method: [public] generateStep()
	*@desc:  executed when the user presses step button in the controller tile. The click binding of the step button is done in the {experiment}.js
	*@dependencies: generateTrail()
	*/
	generateStep:function(){
		var j=$('#nSize').val();
		var sample=[];
		while(j--)
			{
			//bootstrapSamples[_count][j]=this.generateTrail();
			var temp=this.generateTrail();
			sample[j]=temp.data;	//inserting the new sample
			keys[j]=temp.key;
			}
		bootstrapSamples[_count]=sample;
		//bootstrapSamples[_count]= new Array(sample);
		console.log(_count+':'+bootstrapSamples[_count]);
		_count++;
		return keys;
	},
	
	/**
	*@method: [public] getMean()
	*@desc:  executed when the user presses "infer" button in the controller tile. The click binding of the step button is done in the {experiment}.js
	*@dependencies: generateTrail()
	*/
	getMean:function(){
		for(var j=0;j<_count;j++)
			{
			_sampleMean[j]=_generateMean(j);
			console.log(_sampleMean[j]);
			}
			return _sampleMean;
			
		},
	/**
	*@method: [public] getMeanOf()
	*@desc:  executed when the user presses "infer" button in the controller tile. The click binding of the step button is done in the {experiment}.js
	*@dependencies: generateTrail()
	*/	
	getMeanOf:function(sampleNo){
		return _generateMean(sampleNo);
	},
	
	/**
	*   NOT USED ANYWHERE
	*/
	error:function(x){
		switch (x){
		case('inputMissing'):
		alert("Missing input data!");    
		break;
	
		case('inputMissing'):
		alert("Missing data!");    
		break;
		}
	},
	
	/**
	*@method: [public] getDataset()
	*@desc:  getter and setter funtion for dataSet variable. 
	*@dependencies: generateTrail()
	*/
	getDataset:function(){
		return _dataset;
	},
	/**
	*@method: setDataset
	*@param: input 
	*@description: sets the data from the input sheet into the app model
	*/
	setDataset:function(input){
	console.log('setDataSet() invoked!');
	console.log(input.range);
		if(input.processed)
			{
				_dataset=input.data;
				console.log('Simulation data is loaded now.');
				return false;
			}
		else 
			{
			_dataset=[];			//emptying the array
			console.log('Input Data :'+input.data);
			for (var i = 0; i < input.data.length; i++)
				{
				for(var j = 0; j < input.data[i].length; j++)
					{
						if (input.data[i][j] != '')
						{         
							_dataset.push(input.data[i][j]);
							
						}
					}
				
				}		
			console.log('Data is loaded now. Data :' + _dataset);
			if(_dataset.length!=0)
				return false;
			else
				return true;
		}
		
	},
    
	/**
	*@method: [public] getSample()
	*@desc:  getter and setter funtion for dataSet variable. 
	*@dependencies: generateTrail()
	*/
	getSample:function(index){
		return bootstrapSamples[index];
	},
	setSample:function(data,index){
		bootstrapSamples[index]=sampleModel(data,index);
	},
	
	
	getSamples:function(){
		return bootstrapSamples;
	},
	
	
	/*  getter and setter for variable '_stopCount'  */
	setStopCount:function(y){
		//alert(y);
		_stopCount=y;
	},
	getStopCount:function(){
		return _stopCount;
	},
	
	/*  getter and setter for variable '_n'  */
	setN:function(z){
		_n=z;
	},
	getN:function(){
		return _n;
	},
	/*  getter and setter for variable '_count'  */
	setCount:function(v){
		_count=v;
	},
	getCount:function(){
		return _count;
	},
	reset:function(){
		_dataset=[];
		//this.bootstrapSamples=[];
		this.setCount(0);
	}
	
}//return
};



/*
INCOMPLETE FUNCTIONS

error

*/
