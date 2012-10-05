var bootstrap=(function(){
//private properties
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tY\tM";;
var binomialDist, scaleDist, distGraph, pParam, nParam;
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck;
var dataPresent=0;

//private functions
function generate(){
    //once i have the data array
    for(i=0;i<N;i++){
        //generate a random index
        samples[i]=data[randomKey];
    }
    //update values
    update();
    self.stop();
}

function update(){
    createCanvas(sample);
}

function generates(){
    
}

function error(x){
    switch (x){
    case(1):alert("Missing data!");    
    }
    
}


return{
    intialize:function(){
        runButton = $("#runButton");
        stepButton =$("#runButton");
	recordTable =$("#runButton"); 
	distCanvas = $("#distCanvas");
	distTable = $("#distTable");
	stopSelect =$("#stopSelect");
	rvSelect = $("#rvSelect");
	showCheck = $("#showCheck");
        //for accessing public methods in private methods
	 self=this;
        
        showCheck.attr('checked','true');
	stopSelect.attr('value',"10");
        rvSelect.attr('value',"0");
        
        },
    checkInput: function(){
        data=$('#data').val();
        if(isset(data))
            dataPresent=1;
        else
            dataPresent=0;
        this.reset();
        },
    step: function(){
        //need to check for the data
        if(dataPresent==0)
            error('1');
        else{    
            stepButton.attr('disabled',"true");
            runButton.attr('disabled',"true");
            
            count = 0;
            sum = 0;
            //need to reset the sample space    
            for (var i = 0; i < N; i++){
                    if (i < n) coin[i].setValue(-1);
                    else coin[i].setValue(-2);
            }
            
            stepID = setInterval(generate, 50);
        }
    },
    run:function(){
        //need to check for the data
        if(dataPresent==0)
            error('1');
        else{    
            runID = setInterval(generate, 20);
            stepButton.attr('disabled',"true");
            stopSelect.attr('disabled',"true");
        }
    },
    
     stop:function(){
	    
            stopCount = 0;
            clearInterval(runID);
            clearInterval(stepID);
            stepButton.attr('disabled','false');
            runButton.attr('disabled','false');
            stopSelect.attr('disabled','false');
            //if (runCount > 0) recordTable.attr('value', header + completeRecord);
		
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
    }}//return
    
}());

