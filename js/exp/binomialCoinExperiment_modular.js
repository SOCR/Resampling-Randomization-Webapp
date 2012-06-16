//Binomial Coin Experiment
var BinomialCoinExperiment=(function(){

//::::::: PRIVATE PROPERTIES :::::::::::::::
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tY\tM";;
var binomialDist, scaleDist, distGraph, pParam, nParam;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck;
var p = 0.5, n = 10, N = 50, sum, average, count;
var coin = new Array(N);


//::::::PRIVATE METHODS:::::::::::::
//update,tossCoin,tossCoins,coinCount
function update(){
	runCount++;
	binomialDist.setValue(sum);
	average = sum / n;
	scaleDist.setValue(average);
	currentRecord = runCount + "\t" + sum + "\t" + average.toFixed(3);
	completeRecord = completeRecord + "\n" + currentRecord;
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

//returned object with the 
//:::::::::::: PUBLIC METHODS :::::::::::::
return{
    
    //need to create method to return the generated samples
    
    initialize: function(){
	runButton = $("#runButton");
        stepButton =$("#runButton");
	recordTable =$("#runButton"); 
	distCanvas = $("#distCanvas");
	distTable = $("#distTable");
	stopSelect =$("#stopSelect");
	rvSelect = $("#rvSelect");
	showCheck = $("#showCheck");
        
	//if u dont use var while defining a variable it is global!!
	    self=this;
        
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
            //if u dont use var while defining a variable it is global!!
	    ref=this;
	    stepButton.attr('disabled',"true");
            runButton.attr('disabled',"true");
            count = 0;
            sum = 0;
            for (var i = 0; i < N; i++){
                    if (i < n) coin[i].setValue(-1);
                    else coin[i].setValue(-2);
            }
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
            stepButton.attr('disabled','false');
            runButton.attr('disabled','false');
            stopSelect.attr('disabled','false');
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


