var dataDrivenModel=function(){
//::::::: PRIVATE PROPERTIES :::::::::::::::

/*
 *FOR DATA DRIVEN 
 *
 */

//var runCount = 0;			//Keeps track of number of runs elapsed 
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

/* PUBLIC METHODS   */

/* returns a random number in the range [min,max]*/
function _getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min )) + min;
    }

function _generateMean(j){
		var x=bootstrapSamples[j];
		var total=0;
		for(var i in x) { total += parseInt(x[i]); }
		//alert(total);
		_sampleMean[j]=total/x.length;
		
	
}

return{
	/* PUBLIC PROPERTIES   */
	//stopCount:stopCount,
	//count:count,
	bootstrapSamples:bootstrapSamples,
	sample:sample,
	/* PUBLIC METHODS   */
	
	/*
	addObserver:subject.addObserver(),
	removeObserver:subject.removeObserver()
	*/    
        //i think this should be a private function
	/*generates*/
	generateTrail:function(){
		randomKey=_getRandomInt(0, _dataset.length);	//generating a random number between 0 and dataSet size 
		return {data:_dataset[randomKey],key:randomKey};			//returning the generated trail into a bootstrap sample array
	},
        
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
	generateStep:function(){
		var j=_n;
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
		//console.log(_count+':'+bootstrapSamples[_count]);
		_count++;
		return keys;
	},
	getMean:function(){
		for(var j=0;j<_count;j++)
			{
			_generateMean(j);
			//this.stop();
			//alert(bootstrapSamples[j]);
			//console.log(_sampleMean[j]);
			}
			return _sampleMean;
			
		},
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
	
	/*  getter and setter for variable 'dataSet'  */
	getDataset:function(){
		return _dataset;
	},
	setDataset:function(input){
		if(input.processed)
			{//alert(input.data);
				_dataset=input.data;
			}
		else if(input.data)
			{
		//emptying the array
			_dataset=[];
			console.log('input data :'+input.data);
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
			console.log('final data :' + _dataset);
		}
		
	},
        
	getSample:function(index){
		return bootstrapSamples[index];
	},
	getSamples:function(){
		return bootstrapSamples;
	},
	setSample:function(data,index){
		bootstrapSamples[index]=sampleModel(data,index);
	},
	
	/*  getter and setter for variable 'n'  */
	setStopCount:function(y){
		//alert(y);
		_stopCount=y;
	},
	getStopCount:function(){
		return _stopCount;
	},
	/*  getter and setter for variable 'n'  */
	setN:function(z){
		_n=z;
	},
	getN:function(){
		return _n;
	},
	/*  getter and setter for variable 'n'  */
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
