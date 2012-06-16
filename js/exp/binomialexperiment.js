//Binomial Coin Experiment
function binomialExperiment() {
this.stepID=0;
this.runID=0;

//this.runCount = 0;
//this.stopCount = 0;
this.stopFreq = 10;
this.currentRecord;
//this.completeRecord = "";
this.header = "Run\tY\tM";;

//this.pParam;
//this.nParam;

//this.p = 0.5;
//this.n = 10;
this.N = 50;
this.sum;this.average;this.count;
this.coin = new Array(this.N);

        
        /*intialize should
                1).render the view
                2).set the variables
                3).Bind user actions to functions.
        */
        this.initialize=function(){
                //Rendering
                //array of tools in the toolbar
                tools=[];
                //array of devices that the specific distribution wants for example. ['ballPanel','recordTable','distCanvas'];         
                devices=['ballPanel','recordTable','distCanvas'];
                //Find out whether rewriting the whole is better or searching and adding/deleting components is.
                
                //Binding
                // DOM is much much faster than jquery....so not using $('xxxx').val();
                this.runButton = document.getElementById("runButton");
                this.stepButton = document.getElementById("stepButton");
                this.recordTable = document.getElementById("recordTable");
                this.distCanvas = document.getElementById("distCanvas");
                this.distTable = document.getElementById("distTable");
                this.stopSelect = document.getElementById("stopSelect");
                this.rvSelect = document.getElementById("rvSelect");
                this.showCheck = document.getElementById("showCheck");
                
                //Setting 
                this.stopSelect.value = "10";
                this.rvSelect.value = "0";
                this.showCheck.checked = true;
                for (var i = 0; i < N; i++)
                //coin is an object...need to check it
                this.coin[i] = new Coin(document.getElementById("coin" + i));
                this.nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
                this.nParam.setProperties(1, N, 1, n, "<var>n</var>");
                this.pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
                this.pParam.setProperties(0, 1, 0.01, p, "<var>p</var>");
                
                //starting afresh
                this.reset();
        }
        
        this.step=function(){
                this.stepButton.disabled = "true";
                this.runButton.disabled = "true"
                this.count = 0;
                this.sum = 0;
                for (var i = 0; i < N; i++){
                        if (i < n) this.coin[i].setValue(-1);
                        else this.coin[i].setValue(-2);
                }
                this.stepID = setInterval(this.tossCoin, 50);
        }
        
        this.run=function(){
                this.runID = setInterval(this.tossCoins, 20);
                this.stepButton.disabled = true;
                this.stopSelect.disabled = true;
        }
        
        this.stop=function(){
                this.stopCount = 0;
                clearInterval(this.runID);
                clearInterval(this.stepID);
                this.stepButton.disabled = false;
                this.runButton.disabled = false;
                this.stopSelect.disabled = false;
                if (this.runCount > 0) this.recordTable.value = this.header + this.completeRecord;
        }
        
        this.reset=function(){
                this.stop();
                this.runCount = 0; this.stopCount = 0;
                this.p = this.pParam.getValue();
                this.n = this.nParam.getValue();
                for (var i = 0; i < this.N; i++){
                        this.coin[i].prob = this.p;
                        if (i < this.n)
                                this.coin[i].setValue(-1);
                        else
                                this.coin[i].setValue(-2);
                }
                this.completeRecord = "";
                this.recordTable.value = this.header;
                this.binomialDist = new BinomialDistribution(n, p);
                this.scaleDist = new LocationScaleDistribution(this.binomialDist, 0, 1 / n);
                this.setDist();
        }
        
        this.setCoinCount=function(){
                coinCount = coinSelect.value;
                this.reset();
        }
        
        this.setDist= function (){
                if (this.rvSelect.value == 0){
                        this.distGraph = new DistributionGraph(this.distCanvas, this.binomialDist, "Y");
                        this.distGraph.xFormat = 0;
                }
                else {
                        this.distGraph = new DistributionGraph(this.distCanvas, this.scaleDist, "M");
                        this.distGraph.xFormat = 3;
                }
                this.distGraph.showDist(this.showCheck.checked);
                this.distTable.value = this.distGraph.text;
        }
        
        this.tossCoins=function(){
                this.stopCount++;
                this.sum = 0;
                for (var i = 0; i < this.n; i++){
                        this.coin[i].toss();
                        this.sum = this.sum + this.coin[i].value;
                }
                this.update();
                this.recordTable.value = this.header + "\n" + this.currentRecord;
                if (this.stopCount == this.stopFreq) this.stop();
        }
        
        this.tossCoin= function(){
                if (this.count < this.n){
                        this.coin[count].toss();
                        this.sum = this.sum + this.coin[count].value;
                        this.count++;
                }
                else{
                        this.update();
                        this.stop();
                }
        }
        
        this.showDist=function(b){
                this.distGraph.showDist(b);
                this.distTable.value = this.distGraph.text;
        }
        
        this.update= function(){
                this.runCount++;
                this.binomialDist.setValue(sum);
                this.average = this.sum / this.n;
                this.scaleDist.setValue(average);
                this.currentRecord = this.runCount + "\t" + this.sum + "\t" + this.average.toFixed(3);
                this.completeRecord = this.completeRecord + "\n" + this.currentRecord;
                this.distGraph.showDist(this.showCheck.checked);
                this.distTable.value = this.distGraph.text;
        }       
}