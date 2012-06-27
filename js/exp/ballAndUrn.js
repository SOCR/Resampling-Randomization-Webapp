//Ball and Urn Experiment
var ballAndUrn=(function(){

this.ExpName='Ball and Urn';
//::::::: PRIVATE PROPERTIES :::::::::::::::	

var stepID, runID;		//these ID used for terminating the setInterval func during step and run functions
var runCount = 0;		//Keeps track of number of runs elapsed 
var stopCount = 0;		//Keeps the number of steps elapsed
var stopFreq = 10;		//Number of steps in a Run
var currentRecord, completeRecord = "", header = "Run\tY\tM"; // Used in the record table 
var binomialDist, scaleDist, distGraph, pParam, nParam; // binomialDist is the distribution object
var recordTable,distTable; 	//reference to the tables
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck; // Reference to buttons,checkboxs
var m = 50, r = 25, n = 10, N = 50, type = 0;
var ball = new Array(N);
var pop = new Array(m);
var y, u, v, s;

//::::::PRIVATE METHODS:::::::::::::
function selectBalls(){
	stopCount++;
	s = sample(pop, n, type);
	y = 0;
	for (var i = 0; i < n; i++){
		if (s[i] <= r) {
			y++;
			ball[i].ballColor = "red";
		}
		else ball[i].ballColor = "green";
		ball[i].setValue(s[i]);
	}
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq)
		self.stop();
}

function selectBall(){
	if (count < n){
		if (s[count] <= r){
			ball[count].ballColor = "red";
			y++;
		}
		else ball[count].ballColor = "green";
		ball[count].setValue(s[count]);
		count++;
	}
	else{
		update();
		self.stop();
	}
}

function update(){
	runCount++;
	u = m * y / n;
	if (y > 0) v = n * r / y; else v = Infinity;
	currentRecord = runCount + "\t" + y + "\t" + u.toFixed(1) +"\t" + v.toFixed(1);
	completeRecord = completeRecord + "\n" + currentRecord;
	dist.setValue(y);
	distGraph.draw();
	distTable.value = distGraph.text;
}


//returned object 
//:::::::::::: PUBLIC METHODS :::::::::::::
return{
	initialize: function(){
		runButton = document.getElementById("runButton");
		stepButton = document.getElementById("stepButton");
		recordTable = document.getElementById("recordTable");
		distCanvas = document.getElementById("distCanvas");
		distTable = document.getElementById("distTable");
		stopSelect = document.getElementById("stopSelect");
		stopSelect.value = "10";
		replaceCheck = document.getElementById("replaceCheck");
		replaceCheck.checked = false;
		showCheck = document.getElementById("showCheck");
		showCheck.checked = true;
		for (var i = 0; i < N; i++) ball[i] = new Ball(document.getElementById("ball" + i));
		for (var i = 0; i < m; i++) pop[i] = i + 1;
		mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
		mParam.setProperties(1, 100, 1, m, "<var>m</var>");
		nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
		nParam.setProperties(1, N, 1, n, "<var>n</var>");
		rParam = new Parameter(document.getElementById("rInput"), document.getElementById("rLabel"));
		rParam.setProperties(1, m, 1, r, "<var>r</var>");
		//if u dont use var while defining a variable it is global!!
		    self=this;
		this.reset();
	},
	
	 step:function(){
		stepButton.disabled = true;
		runButton.disabled = true;
		s = sample(pop, n, type);
		y = 0;
		count = 0;
		for (var i = 0; i < N; i++){
			if (i < n) ball[i].setValue(-1);
			else ball[i].setValue(-2);
		}
		stepID = setInterval(selectBall, 50);
	},
	
	 run:function(){
		runID = setInterval(selectBalls, 20);
		stepButton.disabled = true;
		stopSelect.disabled = true;
	},
	
	stop: function(){
		stopCount = 0;
		clearInterval(runID);
		clearInterval(stepID);
		stepButton.disabled = false;
		runButton.disabled = false;
		stopSelect.disabled = false;
		if (runCount > 0) recordTable.value = header + completeRecord;
	},
	
	 reset:function(){
		this.stop();
		runCount = 0; stopCount = 0;
		for (var i = 0; i < N; i++){
			if (i < n) ball[i].setValue(-1);
			else ball[i].setValue(-2);
		}
		completeRecord = "";
		recordTable.value = header;
		if (type == 0) dist = new HypergeometricDistribution(m, r, n);
		else dist = new BinomialDistribution(n, r / m);
		distGraph = new DistributionGraph(distCanvas, dist, "Y");
		distGraph.showDist(showCheck.checked);
		distTable.value = distGraph.text;
	},
	
	 setPopulation:function(){
		m = mParam.getValue();
		pop = new Array(m);
		for (var i = 0; i < m; i++) pop[i] = i + 1;
		if (type == 0) nParam.setProperties(1, Math.min(m, N), 1, Math.min(n, m), "<var>n</var>");
		else nParam.setProperties(1, N, 1, n, "<var>n</var>");
		n = nParam.getValue();	
		rParam.setProperties(1, m, 1, Math.round(m / 2), "<var>r</var>");
		r = rParam.getValue();
		this.reset();
	},
	
	 setSample:function(){
		n = nParam.getValue();
		this.reset();
	},
	
	 setReds:function(){
		r = rParam.getValue();
		this.reset();
	},
	
	 setType:function(){
		if (replaceCheck.checked) type = 1; else type = 0;
		if (type == 0) nParam.setProperties(1, Math.min(m, N), 1, Math.min(n, m), "n");
		else nParam.setProperties(1, N, 1, n, "<var>n</var>");
		n = nParam.getValue();
		this.reset();
	},
	
	
	 showDist:function(b){
		distGraph.showDist(b);
		distTable.value = distGraph.text;
	}


}//return
}());