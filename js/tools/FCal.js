//FCal.js - Footprint of the model from distributome

/*
Required elements
	#distCanvas - <canvas>
	#graphSelect - <select> <option> PDF, CDF
	#n* - dof in numerator <label> <input type="range">
	#d* - dof in denominator
	#x , #p parameters -same

*/

socr.tools.fCal = function(){
	// Private variables
	var dist, distGraph, nParam, dParam;
	var xParam, pParam, graphSelect;
	var x, p;

	return{
	//Public Methods
		initialize : function(){
			distCanvas = document.getElementById("distCanvas");
			graphSelect = document.getElementById("graphSelect");
			distSelect = document.getElementById("distSelect");
			nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
			nParam.setProperties(5, 50, 1, 1, "<var>n</var>");
			dParam = new Parameter(document.getElementById("dInput"), document.getElementById("dLabel"));
			dParam.setProperties(5, 50, 1, 1, "<var>d</var>");
			xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
			pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
			pParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>p</var>");
			setDist();
		},
		setDist : function(){
			dist = new FDistribution(nParam.getValue(), dParam.getValue());
			xParam.setProperties(dist.quantile(0.001), dist.quantile(0.999), 0.001, dist.quantile(0.5), "<var>x</var>");
			distGraph = new QuantileGraph(distCanvas, dist, "X");
			distGraph.xFormat = 2;
			distGraph.setGraphType(graphSelect.value);
			setProb();	
		},
		setValue : function(){
			x = xParam.getValue();
			p = dist.CDF(x);
			pParam.setValue(p);
			distGraph.setValue(x);
		},
		setProb : function(){
			p = pParam.getValue();
			x = dist.quantile(p);
			xParam.setValue(x);
			distGraph.setProb(p);
		}
	}
}();