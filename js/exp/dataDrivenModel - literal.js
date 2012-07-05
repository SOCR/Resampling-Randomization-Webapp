var bootstrap={
//private properties
stepID:'',		//these ID used for terminating the setInterval func during step and run functions
runID: '',
runCount:0,		//Keeps track of number of runs elapsed 
stopCount:0,		//Keeps the number of steps elapsed
stopFreq : 10,		//Number of steps in a Run
currentRecord:'',
runButton:'',
stepButton:'', distCanvas:'', stopSelect:'', rvSelect:'', showCheck:'',
//var dataPresent=0;
dataSet:'',			// All the input datapoints from wich bootstrap sample is generated
N: 50,			//Number of datapoints in a bootstrap sample
bootstrapSamples:new Array(),	//Contains all the bootstrap samples generated
sample:new Array(),		//Contains the current bootstrap sample


 generateSample:function(){
    if(count<N)
	{
	    sample[count]=generateTrail();
	    count++;
	    //HERE COMES THE ANIMATION
	}
    else
        self.stop();
},

 update:function(){
    //HERE COMES THE ANIMATION 
    //createCanvas(sample);
},

 generateTrail:function(){
        randomKey=getRandomInt(0, dataSet.length);	//generating a random number between 0 and dataSet size 
	return dataSet[randomKey];			//returning the generated trail into a bootstrap sample array
},

 generateSamples:function(){
    for(i=0;i<N;i++)
	{
	    sample[i]=generateTrail();        
	}
    bootstrapSamples[stopCount]=sample;
    stopCount++;
    update();
    if (stopCount == stopFreq)
        self.stop();
},

 error:function(x){
    switch (x){
    case(1):alert("Missing data!");    
    }
    
},

 getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


};

