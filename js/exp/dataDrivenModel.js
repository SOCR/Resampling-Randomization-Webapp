var dataDrivenModel=function(){
//::::::: PRIVATE PROPERTIES :::::::::::::::

//var runCount = 0;		//Keeps track of number of runs elapsed 
var stopCount = 5;		//Number of steps in a Run
var count;				//keeps count of number of samples generated from start
var dataSet=['1','2','3','4','5','6','7','8','9','10'];			// All the input datapoints from wich bootstrap sample is generated
var N=50;			//Number of datapoints in a bootstrap sample or Sample Size
var bootstrapSamples=new Array();	//Contains all the bootstrap samples generated
var sample=new Array();		//Contains the current bootstrap sample
var variables;				//number of variables

subject = new LIB_makeSubject(['generateSamples','generateSample']); //list of all the events with observer pattern

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min )) + min;
    }

return{

	stopCount:stopCount,
    //i think this should be a private function
	generateTrail:function(){
	    randomKey=getRandomInt(0, dataSet.length);	//generating a random number between 0 and dataSet size 
	    return dataSet[randomKey];			//returning the generated trail into a bootstrap sample array
    },
        
    generateSample:function(){
	for(var i=0;i<N;i++)
	    sample[i]=this.generateTrail();
	//return sample;
	//bootstrapSample[count]=sampleModel(sample,count);
    count++;
	return ({'data':sample,'count':count-1});
	},
	//this function is mostly not required//
    generateSamples:function(size){
	for(i=0;i<size;i++)
	    this.generateSample();
	//return bootstrapSamples;
    },
    
	error:function(x){
	switch (x){
	case(1):alert("Missing data!");    
	}
	
    },
    getDataset:function(){
	return dataSet;
    },
    setDataset:function(data){
	if(data)
	    {
		dataSet=data;
		return true;
	    }
	else
	    return false;
    },
        
    getSample:function(index){
	return bootstrapSamples[index];
    },

    getSamples:function(){
	return bootstrapSamples;
    },
	setSample:function(data,count){
	bootstrapSamples[count]=sampleModel(data,count);
	}
	//addObserver:subject.addObserver(),
	//removeObserver:subject.removeObserver()
	
}//return
};


//New data model for every sample being generated

var sampleModel= function(generatedSample,count){
var data=generatedSample;
var number=count;
var mean;
//calculate mean
return{
getData:function(){return data;},
getMean:function(){return mean;},
getNumber:function(){return number;}
}//return
}


/*
INCOMPLETE FUNCTIONS

error
getMean

*/
