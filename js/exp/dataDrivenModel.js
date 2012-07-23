var dataDrivenModel=function(){
//::::::: PRIVATE PROPERTIES :::::::::::::::

//var runCount = 0;			//Keeps track of number of runs elapsed 
var _stopCount = 1000;			//Number of runs to be made when 'run' button is pressed 
var _count=0;				//keeps count of number of samples generated from start
var _dataSet=['1','2','3','4','5','6','7','8','9','10'];			// All the input datapoints from wich bootstrap sample is generated
var _n=50;				//Number of datapoints in a bootstrap sample or Sample Size
var bootstrapSamples=new Array();	//Contains all the bootstrap samples generated
//var variables;				//number of variables
var _data;
var sample=[];
/*
 IF EVENT DISPATCH MODEL IS TO BE IMPLEMENTED
 
subject = new LIB_makeSubject(['generateSamples','generateSample']); //list of all the events with observer pattern

*/

/* PUBLIC METHODS   */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min )) + min;
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
	generateTrail:function(){
		randomKey=getRandomInt(0, _dataSet.length);	//generating a random number between 0 and dataSet size 
		return _dataSet[randomKey];			//returning the generated trail into a bootstrap sample array
	},
        
	generateSample:function(){
		var j=_n;
		//bootstrapSamples[_count]=new Array();			//initializing the new sample array
		var sample=[];
		while(j--)
			{
			//bootstrapSamples[_count][j]=this.generateTrail();
			sample[j]=this.generateTrail();	//inserting the new sample
			}
		bootstrapSamples[_count]=sample;
		//bootstrapSamples[_count]= new Array(sample);
		//console.log(_count+':'+bootstrapSamples[_count]);
		_count++;		//incrementing the total count - number of samples generated from start of simulation
		
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
		return _dataSet;
	},
	setDataset:function(_data){
		if(_data)
		{//alert(data);
		//emptying the array
			_dataSet=[];
		//sorting out the first column
			for(i=0;i<_data.length-1;i++)
				{
					_dataSet[i]=_data[i+1][0];
					//alert(dataSet[i]);
				}
		//splicing the empty cells	
			for (var i = 0; i < _dataSet.length; i++) {
				if (_dataSet[i] == '') {         
					_dataSet.splice(i, 1);
					i--;
					}
			}	
			if(_dataSet.length==0)
				return true;
			else
				return false;
		}
		else
			return error('inputMissing');
			//alert('bad');
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
	}
	
}//return
};



/*
INCOMPLETE FUNCTIONS

error

*/
