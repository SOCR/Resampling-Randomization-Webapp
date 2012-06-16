//Binomial Coin Experiment
var BinomialCoinExperiment=(function(){

//private properties
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tY\tM";;
var binomialDist, scaleDist, distGraph, pParam, nParam;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck;
var p = 0.5, n = 10, N = 50, sum, average, count;
var coin = new Array(N);


//private methods
//update,tossCoin,tossCoins,coinCount
function update(){
	runCount++;
	binomialDist.setValue(sum);
	average = sum / n;
	scaleDist.setValue(average);
	currentRecord = runCount + "\t" + sum + "\t" + average.toFixed(3);
	completeRecord = completeRecord + "\n" + currentRecord;
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
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
            self.stopExperiment();
}

function tossCoin(){
	if (count < n){
		coin[count].toss();
		sum = sum + coin[count].value;
		count++;
	}
	else{
		update();
		self.stopExperiment();
	}
}
//this method is never used anywhere???
function setCoinCount(){
	coinCount = coinSelect.value;
	self.resetExperiment();
}

//returned object with the public methods
return{
    
    //need to create method to return the generated samples
    
    initializeExperiment: function(){
	/*runButton = $("#runButton");
        stepButton =$("#runButton");
	recordTable =$("#runButton"); 
	distCanvas = $("#distCanvas");
	distTable = $("#distTable");
	stopSelect =$("#stopSelect");
	rvSelect = $("#rvSelect");
	showCheck = $("#showCheck");
        */
	//for accessing public methods in private methods
	 self=this;
        runButton = document.getElementById("runButton");
        stepButton = document.getElementById("stepButton");
        recordTable = document.getElementById("recordTable");
        distCanvas = document.getElementById("distCanvas");
        distTable = document.getElementById("distTable");
        stopSelect = document.getElementById("stopSelect");
        rvSelect = document.getElementById("rvSelect");
        showCheck = document.getElementById("showCheck");
        
        showCheck.checked = true;
	stopSelect.value = "10";
        rvSelect.value = "0";
        
        for (var i = 0; i < N; i++) coin[i] = new Coin(document.getElementById("coin" + i));
            nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
            nParam.setProperties(1, N, 1, n, "<var>n</var>");
            pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
            pParam.setProperties(0, 1, 0.01, p, "<var>p</var>");
            this.resetExperiment();
    },

    stepExperiment: function(){
            stepButton.disabled = "true";
            runButton.disabled = "true"
            count = 0;
            sum = 0;
            for (var i = 0; i < N; i++){
                    if (i < n) coin[i].setValue(-1);
                    else coin[i].setValue(-2);
            }
            stepID = setInterval(tossCoin, 50);
    },
    
    runExperiment:function(){
            runID = setInterval(tossCoins, 20);
            stepButton.disabled = true;
            stopSelect.disabled = true;
    },
    
     stopExperiment:function(){
            stopCount = 0;
            clearInterval(runID);
            clearInterval(stepID);
            stepButton.disabled = false;
            runButton.disabled = false;
            stopSelect.disabled = false;
            if (runCount > 0) recordTable.value = header + completeRecord;
    },
    
    resetExperiment: function(){
            this.stopExperiment();
            runCount = 0; stopCount = 0;
            p = pParam.getValue();
            n = nParam.getValue();
            for (var i = 0; i < N; i++){
                    coin[i].prob = p;
                    if (i < n) coin[i].setValue(-1);
                    else coin[i].setValue(-2);
            }
            completeRecord = "";
            recordTable.value = header;
            binomialDist = new BinomialDistribution(n, p);
            scaleDist = new LocationScaleDistribution(binomialDist, 0, 1 / n);
            this.setDist();
    },
    
    
     setDist:function(){
            if (rvSelect.value == 0){
                    distGraph = new DistributionGraph(distCanvas, binomialDist, "Y");
                    distGraph.xFormat = 0;
            }
            else {
                    distGraph = new DistributionGraph(distCanvas, scaleDist, "M");
                    distGraph.xFormat = 3;
            }
            distGraph.showDist(showCheck.checked);
            distTable.value = distGraph.text;
    },
    
    
    showDist:function(b){
            distGraph.showDist(b);
            distTable.value = distGraph.text;
    }
            
}//return
}());


