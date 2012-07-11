var dataDrivenModel=function(){
//::::::: PRIVATE PROPERTIES :::::::::::::::

//var runCount = 0;		//Keeps track of number of runs elapsed 
var stopCount = 1000;		//Number of runs to be elapsed 
var count=0;				//keeps count of number of samples generated from start
var dataSet=['1','2','3','4','5','6','7','8','9','10'];			// All the input datapoints from wich bootstrap sample is generated
var n=50;			//Number of datapoints in a bootstrap sample or Sample Size
var bootstrapSamples=new Array();	//Contains all the bootstrap samples generated
var sample=new Array();		//Contains the current bootstrap sample
var variables;				//number of variables
var data;
subject = new LIB_makeSubject(['generateSamples','generateSample']); //list of all the events with observer pattern

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min )) + min;
    }

return{
	/* PUBLIC PROPERTIES   */
	stopCount:stopCount,
	count:count,
	bootstrapSamples:bootstrapSamples,
	
	/* PUBLIC METHODS   */
    //i think this should be a private function
	generateTrail:function(){
	    randomKey=getRandomInt(0, dataSet.length);	//generating a random number between 0 and dataSet size 
	    return dataSet[randomKey];			//returning the generated trail into a bootstrap sample array
	},
        
	generateSample:function(){
		sample=[];
		for(var i=0;i<n;i++)
		    sample[i]=this.generateTrail();
		  
		//bootstrapSample[count]=sampleModel(sample,count);
		count++;		//incrementing the total count - number of samples generated from start of simulation
		return ({'data':sample,'count':count-1});
	},
	/*this function is mostly not required
	generateSamples:function(size){
		for(i=0;i<size;i++)
		this.generateSample();
		return bootstrapSamples;
	},
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
	getDataset:function(){
		return dataSet;
	},
	setDataset:function(data){
		if(data)
		{//alert(data);
		//emptying the array
			dataSet=[];
		//sorting out the first column
			for(i=0;i<data.length-1;i++)
				{
					dataSet[i]=data[i+1][0];
					//alert(dataSet[i]);
				}
		//splicing the empty cells	
			for (var i = 0; i < dataSet.length; i++) {
				if (dataSet[i] == '') {         
					dataSet.splice(i, 1);
					i--;
					}
			}	
			if(dataSet.length==0)
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
	//addObserver:subject.addObserver(),
	//removeObserver:subject.removeObserver()
	setStopCount:function(y){
		//alert(y);
		this.stopCount=y;
	},
	setN:function(z){
		n=z;
		
	},
	getN:function(){
		return n;
	}
	
}//return
};


//New data model for every sample being generated

var sampleModel= function(generatedSample,index){
var content=generatedSample;
//alert(content);
var number=index;
var mean;
//calculate mean
return{
	getData:function(){return content;},
	getMean:function(){return mean;},
	getNumber:function(){return number;}
	}//return
}


/*
INCOMPLETE FUNCTIONS

error
getMean

*/
