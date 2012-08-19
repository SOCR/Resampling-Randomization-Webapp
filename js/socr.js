/*Global Vairable
 *contains general information , user details
 *handles content
 *
 *LGPL Licence
 *Created on 7/18/2012 
 */

var SOCRApp=(function(){
    var _experimentName;
    var _currentDrive;
    
    var _footer='';
    var _localStorage;
    
    //var _binomialCoin=' <div class="navbar navbar-fixed-top"> <div class="navbar-inner"> <div class="container-fluid"> <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </a> <a class="brand" href="#">SOCR</a> <div class="nav-collapse"> <ul class="nav"> <li class="active"><a href="#">Home</a></li> <li><a href="#about">About</a></li> <li><a href="#contact">Simulations</a></li> </ul> <p class="navbar-text pull-right">Logged in as <a href="#">username</a></p> </div><!--/.nav-collapse --> </div> </div> </div><div class="container-fluid"> <div class="row-fluid"> <div class="row-fluid"> <div class="span4"> <!-- Add data-toggle="buttons-radio" for radio style toggling on btn-group --> <ul class="nav nav-tabs"> <li><a href="#home" data-toggle="tab">Data Driven</a></li> <li><a href="#profile" data-toggle="tab">Simulation Driven</a></li> </ul> <div id="myTabContent" class="tab-content"> <div class="tab-pane fade" id="home"> <div id="input-table" class="dataTable"> </div> <!--<p> OR</p> <p><a class="btn" href="#">More Info &raquo;</a></p> --> </div> <div class="tab-pane fade active in" id="profile"> <p>There are many experiments available which generate samples and dont require the user to enter the sample set/data.</p> <p> <div class="btn-group"> <button class="btn btn-success">Choose</button> <button class="btn btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button> <ul class="dropdown-menu"> <li><a href="#" id="binomialCoin">Binomial Coin Toss</a></li> <li><a href="#" id="ballAndUrn">Ball And Urn</a></li> <li><a href="#" id="dice">Dice</a></li> </ul> </div> </p> </div> </div> </div><!--/span--> <div class="span3" > <h3> Visualization</h3> <canvas id="distCanvas" title="Distribution graph" width="300" height="162">Distribution graph</canvas> </div><!--/span--> <div class="span3" > <h3> Distribution Table</h3> <p class="device"><textarea id="distTable" readonly="true" wrap="off" class="table" rows="7"></textarea></p> </div><!--/span--> </div><!--/row--> <div class="row-fluid"> <div class="span3" > <h3>Controller</h3> <p class="toolbar"> <button class="btn" type="button" id="stepButton" tabindex="1" title="Step"> <img src="img/step.png" alt="Step" title="Step" /> </button> <button class="btn btn-success" type="button" id="runButton" tabindex="2" title="Run" > <img id="runImage" src="img/run.png" alt="Run" title="Run" /> </button> <button class="btn btn-danger" type="button" id="stopButton" tabindex="3" title="Stop" > <img id="stopImage" src="img/stop.png" alt="Stop" title="Stop" /> </button> <button class="btn" type="button" id="resetButton" tabindex="4" title="Reset" > <img src="img/reset.png" alt="Reset" title="Reset" /> </button> </p> <p> <select id="stopSelect" tabindex="5" title="Stop frequency" onchange="stopFreq = value;"> <option value="10">Stop: 10</option> <option value="100">Stop: 100</option> <option value="1000">Stop: 1000</option> <option value="10000">Stop: 10000</option> <option value="0">Stop: never</option> </select> </p> <p> <span class="tool">Show Distribution: <input type="checkbox" id="showCheck" tabindex="6" onchange="showDist(this.checked)" /> </span> </p><p class="toolbar"> <p class="tool"> <span id="nLabel" class="badge badge-warning" for="nInput">N = </span><span id="nvalue"></span> <input id="nInput" type="range" tabindex="7" class="parameter"/> </p> <p class="tool"> <span id="pLabel" class="badge badge-warning" for="pInput">P = </span><span id="pvalue"></span> <input id="pInput" type="range" tabindex="8" class="parameter"/> </p> <select id="rvSelect" tabindex="9" title="Random variable" > <option value="0" selected="true">Y: Number of heads</option> <option value="1">M: Proportion of heads</option> </select> </p> </div><!--/span--> <div class="span4"> <h3> Record Table</h3> <p class="device"><textarea id="recordTable" readonly="true" wrap="off" class="table" rows="7" style="height:200px"></textarea></p> </div><!--/span--> <div class="span4"> <h3> Samples Generated</h3> <table class="coinPanel"> <tr> <td class="device"><canvas id="coin0" class="coin" title="Coin 1" width="30" height="30">Coin 1</canvas></td> <td class="device"><canvas id="coin1" class="coin" title="Coin 2" width="30" height="30">Coin 2</canvas></td> <td class="device"><canvas id="coin2" class="coin" title="Coin 3" width="30" height="30">Coin 3</canvas></td> <td class="device"><canvas id="coin3" class="coin" title="Coin 4" width="30" height="30">Coin 4</canvas></td> <td class="device"><canvas id="coin4" class="coin" title="Coin 5" width="30" height="30">Coin 5</canvas></td> <td class="device"><canvas id="coin5" class="coin" title="Coin 6" width="30" height="30">Coin 6</canvas></td> <td class="device"><canvas id="coin6" class="coin" title="Coin 7" width="30" height="30">Coin 7</canvas></td> <td class="device"><canvas id="coin7" class="coin" title="Coin 8" width="30" height="30">Coin 8</canvas></td> <td class="device"><canvas id="coin8" class="coin" title="Coin 9" width="30" height="30">Coin 9</canvas></td> <td class="device"><canvas id="coin9" class="coin" title="Coin 10" width="30" height="30">Coin 10</canvas></td> </tr> <tr> <td class="device"><canvas id="coin10" class="coin" title="Coin 11" width="30" height="30">Coin 11</canvas></td> <td class="device"><canvas id="coin11" class="coin" title="Coin 12" width="30" height="30">Coin 12</canvas></td> <td class="device"><canvas id="coin12" class="coin" title="Coin 13" width="30" height="30">Coin 13</canvas></td> <td class="device"><canvas id="coin13" class="coin" title="Coin 14" width="30" height="30">Coin 14</canvas></td> <td class="device"><canvas id="coin14" class="coin" title="Coin 15" width="30" height="30">Coin 15</canvas></td> <td class="device"><canvas id="coin15" class="coin" title="Coin 16" width="30" height="30">Coin 16</canvas></td> <td class="device"><canvas id="coin16" class="coin" title="Coin 17" width="30" height="30">Coin 17</canvas></td> <td class="device"><canvas id="coin17" class="coin" title="Coin 18" width="30" height="30">Coin 18</canvas></td> <td class="device"><canvas id="coin18" class="coin" title="Coin 19" width="30" height="30">Coin 19</canvas></td> <td class="device"><canvas id="coin19" class="coin" title="Coin 20" width="30" height="30">Coin 20</canvas></td> </tr> <tr> <td class="device"><canvas id="coin20" class="coin" title="Coin 21" width="30" height="30">Coin 21</canvas></td> <td class="device"><canvas id="coin21" class="coin" title="Coin 22" width="30" height="30">Coin 22</canvas></td> <td class="device"><canvas id="coin22" class="coin" title="Coin 23" width="30" height="30">Coin 23</canvas></td> <td class="device"><canvas id="coin23" class="coin" title="Coin 24" width="30" height="30">Coin 24</canvas></td> <td class="device"><canvas id="coin24" class="coin" title="Coin 25" width="30" height="30">Coin 25</canvas></td> <td class="device"><canvas id="coin25" class="coin" title="Coin 26" width="30" height="30">Coin 26</canvas></td> <td class="device"><canvas id="coin26" class="coin" title="Coin 27" width="30" height="30">Coin 27</canvas></td> <td class="device"><canvas id="coin27" class="coin" title="Coin 28" width="30" height="30">Coin 28</canvas></td> <td class="device"><canvas id="coin28" class="coin" title="Coin 29" width="30" height="30">Coin 29</canvas></td> <td class="device"><canvas id="coin29" class="coin" title="Coin 30" width="30" height="30">Coin 30</canvas></td> </tr> <tr> <td class="device"><canvas id="coin30" class="coin" title="Coin 31" width="30" height="30">Coin 31</canvas></td> <td class="device"><canvas id="coin31" class="coin" title="Coin 32" width="30" height="30">Coin 32</canvas></td> <td class="device"><canvas id="coin32" class="coin" title="Coin 33" width="30" height="30">Coin 33</canvas></td> <td class="device"><canvas id="coin33" class="coin" title="Coin 34" width="30" height="30">Coin 34</canvas></td> <td class="device"><canvas id="coin34" class="coin" title="Coin 35" width="30" height="30">Coin 35</canvas></td> <td class="device"><canvas id="coin35" class="coin" title="Coin 36" width="30" height="30">Coin 36</canvas></td> <td class="device"><canvas id="coin36" class="coin" title="Coin 37" width="30" height="30">Coin 37</canvas></td> <td class="device"><canvas id="coin37" class="coin" title="Coin 38" width="30" height="30">Coin 38</canvas></td> <td class="device"><canvas id="coin38" class="coin" title="Coin 39" width="30" height="30">Coin 39</canvas></td> <td class="device"><canvas id="coin39" class="coin" title="Coin 40" width="30" height="30">Coin 40</canvas></td> </tr> <tr> <td class="device"><canvas id="coin40" class="coin" title="Coin 41" width="30" height="30">Coin 41</canvas></td> <td class="device"><canvas id="coin41" class="coin" title="Coin 42" width="30" height="30">Coin 42</canvas></td> <td class="device"><canvas id="coin42" class="coin" title="Coin 43" width="30" height="30">Coin 43</canvas></td> <td class="device"><canvas id="coin43" class="coin" title="Coin 44" width="30" height="30">Coin 44</canvas></td> <td class="device"><canvas id="coin44" class="coin" title="Coin 45" width="30" height="30">Coin 45</canvas></td> <td class="device"><canvas id="coin45" class="coin" title="Coin 46" width="30" height="30">Coin 46</canvas></td> <td class="device"><canvas id="coin46" class="coin" title="Coin 47" width="30" height="30">Coin 47</canvas></td> <td class="device"><canvas id="coin47" class="coin" title="Coin 48" width="30" height="30">Coin 48</canvas></td> <td class="device"><canvas id="coin48" class="coin" title="Coin 49" width="30" height="30">Coin 49</canvas></td> <td class="device"><canvas id="coin49" class="coin" title="Coin 50" width="30" height="30">Coin 50</canvas></td> </tr> </table> </div> </div><!--/row--> </div><!--/row--> <hr> <a class="btn" data-toggle="modal" href="#myModal" >Launch Modal</a> <div id="myModal" class="modal hide fade"> <div class="modal-header"> <a class="close" data-dismiss="modal">X</a> <h3>Modal header</h3> </div> <div class="modal-body"> <p>One fine body…</p> </div> <div class="modal-footer"> <a href="#" class="btn">Close</a> <a href="#" class="btn btn-primary">Save changes</a> </div> </div> <footer> <p>&copy; Company 2012</p> </footer> </div><!--/.fluid-container-->';
    
    
    var _header='<div class="navbar navbar-fixed-top"><div class="navbar-inner"><div class="container-fluid"><a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a><a class="brand" href="#">SOCR</a><div class="nav-collapse"><ul class="nav"><li class="active"><a href="#">Home</a></li><li><a data-toggle="modal" href="#aboutDesc">About</a></li> <li><a data-toggle="modal" href="#simulationDesc">Simulations</a></li></ul></div><!--/.nav-collapse --></div></div></div>';
    
    var _skeleton='<html><body><div id="header"></div><div id="main"></div></body></html>';
    
   
    function _driveView(x){
            if(x==='dataDriven')
                {   //TODO check for data. Save it in localStorage of SOCR.
                    alert(x);
                    $('#main').html('');             //ALl html removed!
                    //$('body').append(_skeleton);
                    //$('#header').html(_header);     //Place the header
                    $('#main').load('views/dataDriven.html');
                    //$('body').append(_body);
                    //$('body').append(_footer);
                }
            else if(x==='simulationDriven')
                {   //TODO check for data. Save it in localStorage of SOCR.
                    //$('.container-fluid').html('');             //ALl html removed!
                    //$('body').append(_skeleton);
                    //$('#header').html(_header);     //Place the header
                    $('#main').html(''); 
                    $('#main').load('views/binomialCoin.php');
                }
            
        }
    function _initDrive(x){
        if(x==='dataDriven')
            {
                model=new dataDrivenModel();
                view=new dataDrivenView(model);
                controller=new dataDrivenController(model,view);
                controller.initialize();    
            }
        else
        {
            //Load the default experiment
            Experiment=binomialCoin;
            Experiment.initialize();   //Initializing
            //bind all the experiments
        }
        
    }
	return{
        
        changeDrive:function(x){
            //TODO change the view first
            _driveView(x);    
            //TODO intialize the drive
            _initDrive(x);
        }
        
    }
})();