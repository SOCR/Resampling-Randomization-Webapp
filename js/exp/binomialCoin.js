//Binomial Coin Experiment
var binomialCoin=(function(){


this.ExpName='Binomial Coin Toss';
//::::::: PRIVATE PROPERTIES :::::::::::::::

var stepID, runID;		//these ID used for terminating the setInterval func during step and run functions
var runCount = 0;		//Keeps track of number of runs elapsed 
var stopCount = 0;		//Keeps the number of steps elapsed
var stopFreq = 10;		//Number of steps in a Run
var currentRecord, completeRecord = "", header = "Run\tY\tM"; // Used in the record table 
var binomialDist, scaleDist, distGraph, pParam, nParam; // binomialDist is the distribution object
var recordTable,distTable; 	//reference to the tables
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck; // Reference to buttons,checkboxs
var p = 0.5;	  		//Probability of heads
var N = 50;			//Maximum number of trials 
var sum;			//Keeps count of number of heads(H)
var average;
var count;			//keeps count of number of samples(coin tosses)generated
var n = 10; 			//Number of samples generated (coin tosses) for each step OR the number of trails in a step 
var coin = new Array(N);


//::::::PRIVATE METHODS:::::::::::::
//update,tossCoin,tossCoins,coinCount
function update(){
	runCount++;
	//saving the number of Heads value into the binomialDist object
	binomialDist.setValue(sum);
	average = sum / n;
	scaleDist.setValue(average);
	
	currentRecord = runCount + "\t" + sum + "\t" + average.toFixed(3);	//values corresponding to the current run
	completeRecord = completeRecord + "\n" + currentRecord;			//appending the current record to the complete record list
	
	//plotting graph....Ashwini's code will replace this
	distGraph.showDist(showCheck.attr('checked'));
	distTable.attr('value',distGraph.text);
}

function tossCoins(){
	stopCount++;
	sum = 0;
	for (var i = 0; i < n; i++){
		coin[i].toss();
		sum = sum + coin[i].value;
	}
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq)
            self.stop();
}

function tossCoin(){
	if (count < n){
		coin[count].toss();
		sum = sum + coin[count].value;
		count++;
	}
	else{
		update();
		self.stop();
	}
}
//this method is never used anywhere???
function setCoinCount(){
	coinCount = coinSelect.value;
	self.reset();
}

//returned object 
//:::::::::::: PUBLIC METHODS :::::::::::::
return{
    
    //need to create method to return the generated samples
    
    initialize: function(){
	//binding all buttons and divs to a reference variable
	runButton = $("#runButton");
        stepButton =$("#runButton");
	recordTable =$("#recordTable"); 
	//distCanvas = $("#distCanvas");
	distCanvas = document.getElementById('distCanvas');
	distTable = $("#distTable");
	stopSelect =$("#stopSelect");
	rvSelect = $("#rvSelect");
	showCheck = $("#showCheck");
        
	//if u dont use var while defining a variable it is global!!
	    self=this;
        
        //setting the start values 
	showCheck.attr('checked','true');
	stopSelect.attr('value',"10");
        rvSelect.attr('value',"0");
        
        for (var i = 0; i < N; i++) coin[i] = new Coin(document.getElementById("coin" + i));
            nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
            nParam.setProperties(1, N, 1, n, "<var>n</var>");
            pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
            pParam.setProperties(0, 1, 0.01, p, "<var>p</var>");
            this.reset();
	   
    },

    step: function(){
            
	    stepButton.attr('disabled',"true");
            runButton.attr('disabled',"true");
            
	    count = 0; 
            sum = 0;					
            //resetting the sample space Coin array
	    for (var i = 0; i < N; i++){
                    if (i < n) coin[i].setValue(-1);
                    else coin[i].setValue(-2);
            }
            //run the Coin toss
	    stepID = setInterval(tossCoin, 50);
    },
    
    run:function(){
            runID = setInterval(tossCoins, 20);
            stepButton.attr('disabled',"true");
            stopSelect.attr('disabled',"true");
    },
    
     stop:function(){
	    
            stopCount = 0;
            clearInterval(runID);
            clearInterval(stepID);
	    runButton.removeAttr("disabled");
            stepButton.removeAttr("disabled");
	    stopSelect.removeAttr("disabled");
            if (runCount > 0) recordTable.attr('value', header + completeRecord);
		
    },
    
    reset: function(){
	
            this.stop();
            runCount = 0; stopCount = 0;
            p = pParam.getValue();
            n = nParam.getValue();
            for (var i = 0; i < N; i++){
                    coin[i].prob = p;
                    if (i < n) coin[i].setValue(-1);
                    else coin[i].setValue(-2);
            }
            completeRecord = "";
            recordTable.attr('value', header );
            
	    binomialDist = new BinomialDistribution(n, p);
            scaleDist = new LocationScaleDistribution(binomialDist, 0, 1 / n);
            this.setDist();
    },
    
    
     setDist:function(){
            if (rvSelect.val() == 0){
                    distGraph = new DistributionGraph(distCanvas, binomialDist, "Y");
		    distGraph.xFormat = 0;
            }
            else {
                    distGraph = new DistributionGraph(distCanvas, scaleDist, "M");
                    distGraph.xFormat = 3;
            }
            distGraph.showDist(showCheck.attr('checked'));
            distTable.attr('value', distGraph.text) ;
    },
    
    
    showDist:function(b){
            distGraph.showDist(b);
            distTable.attr('value', distGraph.text) ;
    }
            
}//return
}());


