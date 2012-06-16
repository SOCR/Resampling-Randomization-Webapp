/*
JavaScript file for Distributome project.  See www.distributome.org 
*/

//A six-sided die
function Die(canvas){
    //Properties
	this.value = 1;
	this.backColor = "red";
	this.spotColor = "white";
	this.prob = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];
	//Local variables
	var ctx = canvas.getContext("2d");
	var size = canvas.width;
	var r = Math.round(size / 9);
	var s = Math.round(size / 12);
	var d1 = s + r;
	var d2 = 2 * s + 3 * r;
	var d3 = 3 * s + 5 * r;
	
	//Methods
	this.setValue = function(v) {
		this.value = v;
		if (v === 0) ctx.fillStyle = "rgb(100,100,100)";
		else if (v > 0) ctx.fillStyle = this.backColor;
		else ctx.fillStyle = "rgba(200, 200, 200, 1)";
		ctx.fillRect(0, 0, size, size);
		ctx.fillStyle = this.spotColor;
		switch(v){
		case 1:
			ctx.beginPath(); ctx.arc(d2, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 2:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 3:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d2, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 4:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 5:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d2, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 6:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		}
	};
	
	this.roll = function(){
		var p = Math.random(), sum = 0, x;
		for (var i = 0; i < 6; i++){
			if ((sum < p) && (p <= sum + this.prob[i])) x = i + 1;
			sum = sum + this.prob[i];
		}
		this.setValue(x);
	};
}

//A coin
function Coin(canvas){
	//Properties
	this.backColor = "red";
	this.labelColor = "white";
	this.label = "";
	this.value = -1; //1 heads, 0 tails, otherwise not tossed
	this.prob = 0.5;
	//Local variables
	var ctx = canvas.getContext("2d");
	var size = canvas.width, r = size / 2;
	
	//Methods
	this.setValue = function(v) {
		ctx.clearRect(0, 0, size, size);
		this.value = v;
		if (this.value == 1){
			this.backColor = "red";
			this.label = "H";
		}
		else if (this.value === 0){
			this.backColor = "green";
			this.label = "T";
		}
		else if (this.value == -1){
			this.backColor = "rgb(100,100,100)";
			this.label = "";
		}
		else{
			this.backColor = "rgba(200, 200, 200, 1)";
			this.label = "";
		}
		ctx.fillStyle = this.backColor;
		ctx.beginPath();
		ctx.arc(r, r, r, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.fillStyle = this.labelColor;
		ctx.fillText(this.label, r - 5, r + 5);
	};
	
	this.toss = function(){
		var p = Math.random(), v;
		if (p <= this.prob) v = 1; else v = 0;
		this.setValue(v);
	};
}

//Ball
function Ball(canvas){
	//Properties
	this.ballColor = "red";
	this.labelColor = "white";
	this.value = -1;
	//Local variables
	var ctx = canvas.getContext("2d");
	var size = canvas.width, r = size / 2;
	var label;
	//Methods
	this.setValue = function(v) {
		ctx.clearRect(0, 0, size, size);
		this.value = v;
		if (v >= 0){
			ctx.fillStyle = this.ballColor;
			label = v;
		}
		else if (v == -1){
			ctx.fillStyle = "rgb(100, 100, 100)";
			label = "";
		}
		else{
			ctx.fillStyle = "rgba(200, 200, 200, 1)";
			label = "";
		}
		ctx.beginPath();
		ctx.arc(r, r, r, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.fillStyle = this.labelColor;
		ctx.fillText(label, r - 5, r + 5);
	};
}
	
//A playing card
function Card(canvas){
	//Properties
	this.value = 1;
	this.suit = 1;
	this.suitSymbol = "\u2663";
	this.denomination = 1;	
	var ctx = canvas.getContext("2d");
	var cardImages =  new Image(1027, 615);
	var width = 79, height = 123;
	var symbol = ["\u2663", "\u2666", "\u2665", "\u2660"];
	cardImages.src = "cards.png";
	ctx.fillStyle = "gray";

	cardImages.onload = function(){
		ctx.drawImage(cardImages, 2 * width, 4 * height, width, height, 0, 0, width, height);
	};
	
	this.setValue = function(x){
		this.value = Math.round(x);
		if (this.value > 0 && this.value < 53){
			this.suit = Math.ceil(this.value / 13);
			this.suitSymbol = symbol[this.suit - 1];
			this.denomination = this.value - 13 * (this.suit - 1);
			ctx.drawImage(cardImages, (this.denomination - 1) * width, (this.suit - 1) * height, width, height, 0, 0, width, height);
		}
		else if (this.value === 0) ctx.drawImage(cardImages, 2 * width, 4 * height, width, height, 0, 0, width, height);
		else ctx.clearRect(0, 0, width, height);
	};
}

//A basic graph
function graph(canvas, x0, x1, y0, y1){
	//Properties
	this.xMin = x0; this.xMax = x1; this.yMin = y0; this.yMax = y1;
	this.leftMargin = 30; this.rightMargin = 20; this.bottomMargin = 20; this.topMargin = 20;
	this.xFormat = 2; this.yFormat = 2;
	this.context = canvas.getContext("2d");
	//Local variables
	var ctx = canvas.getContext("2d");
	var width = canvas.width, height = canvas.height;

	this.clear = function(){
		ctx.clearRect(0, 0, width, height);
	};
	
	this.setMargins = function(lm, rm, bm, tm){
		this.leftMargin = lm; this.rightMargin = rm; this.bottomMargin = bm; this.topMargin = tm;
	};
	
	//This function returns the horizontal coordinate in cavnas units for a given x in scaled units
	this.xCanvas = function(x){
		return this.leftMargin + Math.round(((x - this.xMin)/(this.xMax - this.xMin)) * (width - this.leftMargin - this.rightMargin));
	};
	
	//This function returns the vertical coordinate in canvas units for a given y in scaled units
	this.yCanvas = function(y){
		return height - this.bottomMargin - Math.round(((y - this.yMin)/(this.yMax - this.yMin)) * (height - this.bottomMargin - this.topMargin));
	};
	
	//This function returns the horizontal coordinate in scaled units for a given x in canvas units.
	this.xScale = function(x){
		return this.xMin + ((x - this.leftMargin)/(width - this.leftMargin - this.rightMargin)) * (this.xMax - this.xMin);
	};
	
	//This funciton returns the vertical coordinate in scaled units for a given y in canvas units.
	this.yScale = function(y){
		return this.yMin + ((height - y - this.bottomMargin)/(height  - this.bottomMargin - this.topMargin)) * (this.yMax - this.yMin);
	};
	
	this.beginPath = function(){
		ctx.beginPath();
	};
	
	this.strokeStyle = function(c){
		ctx.strokeStyle = c;
	};
	
	this.stroke = function(){
		ctx.stroke();
	};

	this.moveTo = function(x, y){
		ctx.moveTo(this.xCanvas(x), this.yCanvas(y));
	};

	this.lineTo = function(x, y){
		ctx.lineTo(this.xCanvas(x), this.yCanvas(y));
	};

	this.drawLine = function(x0, y0, x1, y1){
		ctx.beginPath();
		ctx.moveTo(this.xCanvas(x0), this.yCanvas(y0));
		ctx.lineTo(this.xCanvas(x1), this.yCanvas(y1));
		ctx.stroke();
	};
	
	this.drawAxis = function(l, u, p, s, b){
		//l: lower bound, u: upper bound, p: position, s: step size, b: boolean (true horizontal)
		var x, y, k;
		var tickWidth = 3;
		ctx.beginPath();
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";
		ctx.lineWidth = 1;
		if (b){
			y = this.yCanvas(p);
			k = this.xFormat + 1;
			ctx.fillText(l.toFixed(this.xFormat), this.xCanvas(l) - 5 * k, y + 15);
			ctx.fillText(u.toFixed(this.xFormat), this.xCanvas(u) - 5 * k, y + 15);
			ctx.moveTo(this.xCanvas(l), y);
			ctx.lineTo(this.xCanvas(u), y);
			for (var t = l; t <= u; t = t + s){
				x = this.xCanvas(t);
				ctx.moveTo(x, y - tickWidth);
				ctx.lineTo(x, y + tickWidth);
			}
		}
		else {
			k = this.yFormat + 3;
			x = this.xCanvas(p);
			ctx.fillText(l.toFixed(this.yFormat), x - 5 * k, this.yCanvas(l) + 5);
			ctx.fillText(u.toFixed(this.yFormat), x - 5 * k, this.yCanvas(u) + 5);
			ctx.moveTo(x, this.yCanvas(l));
			ctx.lineTo(x, this.yCanvas(u));
			for (var t1 = l; t1 <= u; t1 = t1 + s){
				y = this.yCanvas(t1);
				ctx.moveTo(x - tickWidth, y);
				ctx.lineTo(x + tickWidth, y);
			}
		}
		ctx.stroke();
	};
	
	this.drawPoint = function(x, y, r, c){
		//(x, y): position in scale units, r: radius in pixels, c: color
		ctx.beginPath();
		ctx.fillStyle = c;
		ctx.arc(this.xCanvas(x), this.yCanvas(y), r, 0, 2 * Math.PI, true);
		ctx.fill();
	};
	
	this.fillCircle = function(x, y, r, c){
		ctx.beginPath();
		ctx.fillStyle = c;
		var x0 = this.xCanvas(x), y0 = this.yCanvas(y), r0 = this.xCanvas(x + r) - x0;
		ctx.arc(x0, y0, r0, 0, 2 * Math.PI, true);
		ctx.fill();
	};
		
	this.strokeCircle = function(x, y, r, c){
		ctx.beginPath();
		ctx.strokeStyle = c;
		var x0 = this.xCanvas(x), y0 = this.yCanvas(y), r0 = this.xCanvas(x + r) - x0;
		ctx.arc(x0, y0, r0, 0, 2 * Math.PI, true);
		ctx.stroke();
	};
	
	this.strokeRect = function(x0, y0, x1, y1, c){
		ctx.beginPath();
		ctx.strokeStyle = c;
		var x = this.xCanvas(x0), y = this.yCanvas(y0), w = this.xCanvas(x1) - x, h = this.yCanvas(y1) - y; 
		ctx.strokeRect(x, y, w, h);
	};
}

function DistributionGraph(canvas, dist, label){
	//Properties
	this.dist = dist; this.label = label;
	this.distColor = "blue"; this.dataColor = "rgba(255, 0, 0, 0.7)";
	if (this.dist.type == 0) {
		this.xFormat = 0;
		this.xAxisFormat = 0;
	}
	else{
		this.xFormat = 2;
		this.xAxisFormat = 2;
	} 
	this.momentFormat = 3;
	this.yFormat = 3; this.yAxisFormat = 3;
	var leftMargin = 30, rightMargin = 20, topMargin = 20, bottomMargin = 30;
	var yMax = dist.maxDensity();
	//Local variables
	var moments = true, showDist = true;
	var data = this.dist.data;
	var ctx = canvas.getContext("2d");
	var width = canvas.width, height = canvas.height;
	var minValue = this.dist.minValue, maxValue = this.dist.maxValue, step = this.dist.step;
	var xMin = minValue - step / 2, xMax = maxValue + step / 2;
	var type = dist.type;
		
	//This function returns the horizontal coordinate in cavnas units for a given x in scaled units
	this.xCanvas = function(x){
		return leftMargin + Math.round(((x - xMin)/(xMax - xMin)) * (width - leftMargin - rightMargin));
	}


	//This function returns the horizontal coordinate in cavnas units for a given x in scaled units
	function xCanvas(x){
		return leftMargin + Math.round(((x - xMin)/(xMax - xMin)) * (width - leftMargin - rightMargin));
	}
	
	//This function returns the vertical coordinate in canvas units for a given y in scaled units
	function yCanvas(y){
		return height - bottomMargin - Math.round((y / yMax) * (height - bottomMargin - topMargin));
	}
	
	this.draw = function(){
		var xc, yc, x, y, xc1, y1, yc1, w, h, n;
		ctx.clearRect(0, 0, width, height);
		//Axes
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";
		//Horizontal axis
		ctx.beginPath();
		yc = yCanvas(0);
		ctx.moveTo(xCanvas(xMin), yc);
		ctx.lineTo(xCanvas(xMax), yc);
		for (x = minValue; x < maxValue + step / 2; x = x + step){
			xc = xCanvas(x);
			ctx.moveTo(xc, yc - 5);
			ctx.lineTo(xc, yc + 5);
		}
		ctx.stroke();
		n = this.xAxisFormat;
		ctx.fillText(minValue.toFixed(n), xCanvas(minValue) - 3 * (n + 1), yc + 15);
		ctx.fillText(maxValue.toFixed(n), xCanvas(maxValue) - 3 * (n + 1), yc + 15);
		//Vertical axis
		n = this.yAxisFormat;
		ctx.beginPath();
		xc = xCanvas(xMin);
		yc = yCanvas(yMax);
		ctx.moveTo(xc, yCanvas(0));
		ctx.lineTo(xc, yc);
		ctx.moveTo(xc - 5, yc);
		ctx.lineTo(xc + 5, yc);
		ctx.stroke();
		ctx.fillText(0, xc - 10, yCanvas(0) + 5);
		ctx.fillText(yMax.toFixed(n), xc - 5 * (n + 3), yc + 5);
		//Distribution graph
		w = xCanvas(xMin + step) - xCanvas(xMin);		
		if (showDist){
			ctx.strokeStyle = this.distColor;
			if (type === 0){
				for (x = minValue; x < maxValue + step / 2; x = x + step){
					y = this.dist.density(x);
					xc = xCanvas(x - step / 2);
					yc = yCanvas(y); 
					h = yCanvas(0) - yc;
					ctx.strokeRect(xc, yc, w, h);
				}
			}
			else if (type == 1){
				ctx.beginPath();
				x = minValue;
				y = this.dist.density(x);
				xc = xCanvas(x);
				yc = yCanvas(y);
				ctx.moveTo(xc, yc);
				for (x = minValue; x < maxValue; x = x + step){
					y = this.dist.density(x);
					var x1 = x + step;
					y1 = this.dist.density(x1);
					xc = xCanvas(x);
					xc1 = xCanvas(x1);
					yc1 = yCanvas(y1);
					ctx.lineTo(xc1, yc1);
				}
				ctx.stroke();
			}
		}
		//Data graph
		ctx.fillStyle = this.dataColor;
		if (data.getSize() > 0){
			for (x = minValue; x < maxValue + step / 2; x = x + step){
				if (type === 0) y = data.relFreq(x);
				else if (type == 1) y = data.density(x);
				xc = xCanvas(x - step / 2);
				yc = yCanvas(y); 
				h = yCanvas(0) - yc;
				ctx.fillRect(xc, yc, w, h);
			}
		}
			
		//Moments
		if (moments){
			yc = height - 15;
			if (showDist){
				ctx.strokeStyle = this.distColor;
				xc = xCanvas(this.dist.mean() - this.dist.stdDev());
				w = xCanvas(this.dist.mean() + this.dist.stdDev()) - xc;
				ctx.strokeRect(xc, yc, w, 10);
				xc = xCanvas(this.dist.mean());
				ctx.beginPath();
				ctx.moveTo(xc, yc + 15);
				ctx.lineTo(xc, yc - 5);
				ctx.stroke();
			}
			if (data.getSize() > 1){
				ctx.strokeStyle = this.dataColor;
				xc = xCanvas(data.mean() - data.stdDev());
				w = xCanvas(data.mean() + data.stdDev()) - xc;
				ctx.fillRect(xc, yc, w, 10);
				xc = xCanvas(data.mean());
				ctx.beginPath();
				ctx.moveTo(xc, yc + 15);
				ctx.lineTo(xc, yc - 5);
				ctx.stroke();
			}
		}
		//Text
		this.text = label;
		if (showDist) this.text = this.text + "\tDist";
		this.text = this.text + "\tData";
		for (var x2 = minValue; x2 <= maxValue; x2 = x2 + step){
			this.text = this.text + "\n" + x2.toFixed(this.xFormat);
			if (showDist) this.text = this.text + "\t" + dist.density(x2).toFixed(this.yFormat);
			if (data.getSize() > 0){
				if (type === 0) y = data.relFreq(x2);
				else y = data.density(x2);
				this.text = this.text + "\t" + y.toFixed(this.yFormat);
			}
		}
		if (moments){
			this.text = this.text + "\nMean";
			if (showDist) this.text = this.text + "\t" + dist.mean().toFixed(this.momentFormat);
			if (data.getSize() > 0) this.text = this.text + "\t" + data.mean().toFixed(this.momentFormat);
			this.text = this.text + "\nSD";
			if (showDist) this.text = this.text + "\t" + dist.stdDev().toFixed(this.momentFormat);
			if (data.getSize() > 1) this.text = this.text + "\t" + data.stdDev().toFixed(this.momentFormat);
		}
	};
	
	this.showMoments = function(b){
		moments = b;
		if (moments) this.bottomMargin = 30;
		else this.bottomMargin = 20;
	};
	
	this.showDist = function(b){
		showDist = b;
		this.draw();
	};
}
		
function showCopyright(title){
	alert(title + "\n\n" + "Copyright (c) 2010-2011, Kyle Siegrist.\n\nThis program is free software; you can redistribute it and/or modify it under the terms of the Creative Commons License (http://creativecommons.org/licenses/by/2.0/).\n\nThis program is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.\n\nThis program is part of Virtual Laboratories in Probability and Statistics (http://www.math.uah.edu/stat) developed with support from the National Science Foundation under grants  DUE-9652870 and DUE-0089377");
}

function QuantileGraph(canvas, dist){
	var distColor = "blue", dataColor = "rgba(255, 0, 0, 0.7)";
	var leftMargin = 30, rightMargin = 20, topMargin = 20, bottomMargin = 30;
	var ctx = canvas.getContext("2d");
	var width = canvas.width, height = canvas.height;
	var minValue = dist.minValue, maxValue = dist.maxValue, step = dist.step;
	var xMin = minValue - step / 2, xMax = maxValue + step / 2;
	var value = xMin, prob = 0;
	var xFormat = Math.max(Math.round(Math.log(1 / step) / Math.log(10)), 0);
	var yFormat = 3;
	var graphType = "pdf";
	var yMax = dist.maxDensity();
		
	//This function returns the horizontal coordinate in cavnas units for a given x in scaled units
	function xCanvas(x){
		return leftMargin + Math.round(((x - xMin)/(xMax - xMin)) * (width - leftMargin - rightMargin));
	}
	
	//This function returns the vertical coordinate in canvas units for a given y in scaled units
	function yCanvas(y){
		return height - bottomMargin - Math.round((y / yMax) * (height - bottomMargin - topMargin));
	}
	
	this.draw = function(){
		var xc, yc, x, y, y1, w, h;
		ctx.clearRect(0, 0, width, height);
		//Draw axes
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";
		//Horizontal axis
		ctx.beginPath();
		ctx.moveTo(xCanvas(xMin), yCanvas(0));
		ctx.lineTo(xCanvas(xMax), yCanvas(0));
		for (x = minValue; x < maxValue + step / 2; x = x + step){
			xc = xCanvas(x); yc = yCanvas(0);
			ctx.moveTo(xc, yc - 5);
			ctx.lineTo(xc, yc + 5);
		}
		ctx.stroke();
		ctx.fillText(minValue.toFixed(xFormat), xCanvas(minValue) - 3 * (xFormat + 1), yc + 15);
		ctx.fillText(maxValue.toFixed(xFormat), xCanvas(maxValue) - 3 * (xFormat + 1), yc + 15);
		//Vertical axis
		ctx.beginPath();
		xc = xCanvas(xMin);
		yc = yCanvas(yMax);
		ctx.moveTo(xc, yCanvas(0));
		ctx.lineTo(xc, yc);
		ctx.moveTo(xc - 5, yc);
		ctx.lineTo(xc + 5, yc);
		ctx.stroke();
		ctx.fillText(0, xc - 10, yCanvas(0) + 5);
		ctx.fillText(yMax.toFixed(yFormat), xc - 5 * (yFormat + 3), yc + 5);
		//Draw distribution graph
		ctx.strokeStyle = distColor;
		ctx.fillStyle = dataColor;
		w = xCanvas(xMin + step) - xCanvas(xMin);
		if (dist.type === 0){
			for (x = minValue; x < maxValue + step / 2; x = x + step){
				if (graphType == "cdf") y = dist.CDF(x); else y = dist.density(x);
				xc = xCanvas(x - step / 2);
				yc = yCanvas(y); 
				h = yCanvas(0) - yc;
				ctx.strokeRect(xc, yc, w, h);
			}
			ctx.beginPath();
			if (graphType == "cdf"){
				ctx.strokeStyle = dataColor;
				ctx.moveTo(xCanvas(minValue - step / 2), yCanvas(dist.CDF(value)));
				ctx.lineTo(xCanvas(value), yCanvas(dist.CDF(value)));
				ctx.lineTo(xCanvas(value), yCanvas(0));
				ctx.stroke();
			}
			else{
				ctx.fillStyle = dataColor;
				for (x = minValue; x < value + step / 2; x = x + step){
					y = dist.density(x);
					xc = xCanvas(x - step / 2);
					yc = yCanvas(y); 
					h = yCanvas(0) - yc;
					ctx.fillRect(xc, yc, w, h);
				}
			}
		}
		else{
			ctx.beginPath();
			x = minValue;
			if (graphType == "cdf") y = dist.CDF(x); else y = dist.density(x);
			ctx.moveTo(xCanvas(x), yCanvas(y));
			for (x = minValue; x < maxValue; x = x + step){
				var x1 = x + step;
				if (graphType == "cdf") y1 = dist.CDF(x1); else y1 = dist.density(x1);
				ctx.lineTo(xCanvas(x1), yCanvas(y1));
			}
			ctx.stroke();
			ctx.beginPath();
			if (graphType == "cdf"){
				ctx.strokeStyle = dataColor;
				ctx.moveTo(xCanvas(minValue), yCanvas(dist.CDF(value)));
				ctx.lineTo(xCanvas(value), yCanvas(dist.CDF(value)));
				ctx.lineTo(xCanvas(value), yCanvas(0));
				ctx.stroke();
			}
			else{
				x = minValue;
				ctx.moveTo(xCanvas(x), yCanvas(0));
				y = dist.density(x);
				ctx.lineTo(xCanvas(x), yCanvas(y));
				for (x = minValue; x < value; x = x + step){
					var x2 = x + step;
					y1 = dist.density(x2);
					ctx.lineTo(xCanvas(x2), yCanvas(y1));
				}
				ctx.lineTo(xCanvas(x), yCanvas(0));
				ctx.fill();
			}
		}
	};

	this.setValue = function(x){
		value = x;
		prob = dist.CDF(x);
		this.draw();
	};

	this.setProb = function(p){
		prob = p;
		value = dist.quantile(p);
		this.draw();
	};

	this.setXFormat = function(n){
		xFormat = n;
		this.draw();
	};

	this.setYFormat = function(n){
		yFormat = n;
		this.draw();
	};

	this.setColors = function(c1, c2){
		distColor = c1;
		dataColor = c2;
		this.draw();
	};

	this.setMargins = function(l, r, t, b){
		leftMargin = l;
		rightMargin = r;
		topMargin = t;
		bottomMargin = b;
		this.draw();
	};

	this.setGraphType = function(t){
		graphType = t;
		if (graphType == "cdf") yMax = 1;
		else yMax = dist.maxDensity();
		this.draw();
	};
}

function Parameter(input, label){
	var min, max, step, value, text, format;
	
	this.setProperties = function(mn, mx, st, v, t){
		min = mn; max = mx; step = st; text = t;
		input.min = min;
		input.max = max;
		input.step = step;
		format = Math.round(Math.log(1 / step) / Math.log(10));
		this.setValue(v);
	};
	
	this.setValue = function(x){
		if (min <= x && x <= max){
			var n = Math.round((x - min) / step);
			value = min + n * step;
		}
		else if (x < min) value = min;
		else if (x > max) value = max;
		input.value = value.toFixed(format);
		if (input.type == "range") label.innerHTML = text + " = " + value.toFixed(format);
		else if (input.type == "hidden") label.innerHTML = "";
		else label.innerHTML = text + " = ";
	};
	
	this.getValue = function(){
		this.setValue(Number(input.value));
		return value;
	};
	
	this.setType = function(t){
		input.type = t;
		this.setValue(Number(input.value));
	};
	
	this.setDisabled = function(b){
		input.disabled = b;
	};
}

function Timeline(canvas, min, max, step){
	var ctx = canvas.getContext("2d");
	var width = canvas.width, height = canvas.height;
	var arrival = new Array(0);
	var color = new Array(0);
	var n = 0;
	var r = 2;
	var leftMargin = 10, rightMargin = 10;
	var xFormat = Math.max(Math.round(Math.log(1 / step) / Math.log(10)), 0);
	
	
	this.addArrival = function(t, c){
		n++;
		arrival.length = n;
		arrival[n - 1] = t;
		color.length = n;
		color[n - 1] = c;
	};
	
	this.reset = function(){
		n = 0;
		arrival.length = 0;
		color.length = 0;
	};
	
	function xCanvas(x){
		return leftMargin + Math.round(((x - min)/(max - min)) * (width - leftMargin - rightMargin));
	}
	
	this.draw = function(t){
		if (t > max) t = max;
		var y = height / 2;
		ctx.clearRect(0, 0, width, height);
		//Axis
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";
		ctx.beginPath();
		ctx.moveTo(xCanvas(min), y);
		ctx.lineTo(xCanvas(max), y);
		for (var x = min; x <= max; x = x + step){
			var xc = xCanvas(x);
			ctx.moveTo(xc, y - 5);
			ctx.lineTo(xc, y + 5);
		}
		ctx.stroke();
		ctx.fillText(min.toFixed(xFormat), xCanvas(min) - 3 * (xFormat + 1), y + 15);
		ctx.fillText(max.toFixed(xFormat), xCanvas(max) - 3 * (xFormat + 1), y + 15);
		//Arrivals
		for (var i = 0; i < n; i++){
			if (arrival[i] <= t){
				ctx.beginPath();
				ctx.fillStyle = color[i];
				ctx.arc(xCanvas(arrival[i]), y, r, 0, 2 * Math.PI, true);
				ctx.fill();
			}
		}
		//current time
		ctx.beginPath();
		ctx.strokeStyle = "blue";
		var x2 = xCanvas(t);
		ctx.moveTo(x2, y - 10);
		ctx.lineTo(x2, y + 10);
		ctx.stroke();
	};
	
	this.setPointSize = function(s){
		r = s;
	};
	
	this.setXFormat = function(n){
		xFormat = n;
	};
	
	this.setMargins = function(l, r){
		leftMargin = l;
		rightMargin = r;
	};
}
		
//Galton Board
function GaltonBoard(canvas, n){
	var ctx = canvas.getContext("2d");
	var w = canvas.width, h = canvas.height;
	var lm = 30, rm = 20, bm = 20, tm = 20;
	var x, y, r = 2;
	var xMin = -1/2, xMax = n + 1/2, yMin = 0, yMax = n/2;
	
	this.setMargins = function(l, r, t, b){
		lm = l; rm = r; tm = t; bm = b;
	};
	
	this.setRadius = function(t){
		r = t;
	};
	
	function xCanvas(x){
		return  lm + Math.round(((x - xMin)/(xMax - xMin)) * (w - lm - rm));
	}
	
	function yCanvas(y){
		return h - bm - Math.round(((y - yMin)/(yMax - yMin)) * (h - bm - tm));
	}
	
	this.reset = function(){
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = "blue";
		for (y = 0; y <= n / 2; y = y + 1/2) {
			for (x = y; x <= n - y; x++){
				ctx.beginPath();
				ctx.arc(xCanvas(x), yCanvas(y), r, 0, 2 * Math.PI, true);
				ctx.fill();
			}
		}
		x = n/2; y = n/2;
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(xCanvas(x), yCanvas(y) - 2 * r, r, 0, 2 * Math.PI, true);
		ctx.fill();
	};
	
	this.setPath = function(p){
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(xCanvas(x), yCanvas(y) - 2 * r, r, 0, 2 * Math.PI, true);
		ctx.fill();
		for (var i = 0; i < n; i++){
			y = y - 1/2;
			x = x - 1/2 + p[i];
			ctx.beginPath();
			ctx.arc(xCanvas(x), yCanvas(y) - 2 * r, r, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	};
	
	this.move = function(j){
		x = x - 1/2 + j;
		y = y - 1/2;
		ctx.beginPath();
		ctx.arc(xCanvas(x), yCanvas(y) - 2 * r, r, 0, 2 * Math.PI, true);
		ctx.fill();
	};
}

function StateSpace(canvas, min, max, step){
	var ctx = canvas.getContext("2d");
	var width = canvas.width, height = canvas.height;
	var r = 3;
	var currentState = min, initialState = min;
	var currentColor = "rgba(255, 0, 0, 0.7)";
	var initialColor = "blue";
	var leftMargin = 10, rightMargin = 10;
	var xMin = min, xMax = max;
	var xFormat = Math.max(Math.round(Math.log(1 / step) / Math.log(10)), 0);
	
	function xCanvas(x){
		return leftMargin + Math.round(((x - xMin)/(xMax - xMin)) * (width - leftMargin - rightMargin));
	}
	
	this.setInitialState = function(x){
		initialState = x;
		this.setState(x);
	};
	
	this.setState = function(x){
		currentState = x;
		var y = height / 2, xc;
		ctx.clearRect(0, 0, width, height);
		//Axis
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";
		ctx.beginPath();
		ctx.moveTo(xCanvas(xMin), y);
		ctx.lineTo(xCanvas(xMax), y);
		for (var t = min; t <= max; t = t + step){
		var tc = xCanvas(t);
			ctx.moveTo(tc, y - 5);
			ctx.lineTo(tc, y + 5);
		}
		ctx.stroke();
		ctx.fillText(min.toFixed(xFormat), xCanvas(min) - 3 * (xFormat + 1), y + 15);
		ctx.fillText(max.toFixed(xFormat), xCanvas(max) - 3 * (xFormat + 1), y + 15);
		//Initial state
		ctx.beginPath();
		ctx.fillStyle = initialColor;
		xc = xCanvas(initialState);
		ctx.arc(xc, y, r, 0, 2 * Math.PI, true);
		ctx.fill();
		//current state
		ctx.beginPath();
		ctx.fillStyle = currentColor;
		xc = xCanvas(currentState);
		ctx.arc(xc, y, r, 0, 2 * Math.PI, true);
		ctx.fill();
	};
	
	this.setPointSize = function(s){
		r = s;
	};
	
	this.setXFormat = function(n){
		xFormat = n;
	};
	
	this.setMargins = function(l, r){
		leftMargin = l;
		rightMargin = r;
	};
	
	this.setBounds = function(a, b){
		xMin = a;
		xMax = b;
	};	
}

function DataGraph(canvas, data, label){
	//Properties
	this.data = data; this.label = label;
	this.dataColor = "red";
	this.xFormat = 0; this.xAxisFormat = 0; this.momentFormat = 3;
	this.yFormat = 3; this.yAxisFormat = 3;
	this.type = 0;
	var leftMargin = 30, rightMargin = 20, topMargin = 20, bottomMargin = 30;
	var yMax = 1;
	//Local variables
	var moments = true;
	var ctx = canvas.getContext("2d");
	var width = canvas.width, height = canvas.height;
	var minValue = this.data.lowerValue, maxValue = this.data.upperValue, step = this.data.step;
	var xMin = minValue - step / 2, xMax = maxValue + step / 2;
		
	//This function returns the horizontal coordinate in cavnas units for a given x in scaled units
	function xCanvas(x){
		return leftMargin + Math.round(((x - xMin)/(xMax - xMin)) * (width - leftMargin - rightMargin));
	}
	
	//This function returns the vertical coordinate in canvas units for a given y in scaled units
	function yCanvas(y){
		return height - bottomMargin - Math.round((y / yMax) * (height - bottomMargin - topMargin));
	}
	
	this.draw = function(){
		var xc, yc, x, y, xc1, y1, yc1, w, h, n;
		ctx.clearRect(0, 0, width, height);
		//Axes
		ctx.strokeStyle = "gray";
		ctx.fillStyle = "gray";
		//Horizontal axis
		ctx.beginPath();
		yc = yCanvas(0);
		ctx.moveTo(xCanvas(xMin), yc);
		ctx.lineTo(xCanvas(xMax), yc);
		for (x = minValue; x < maxValue + step / 2; x = x + step){
			xc = xCanvas(x);
			ctx.moveTo(xc, yc - 5);
			ctx.lineTo(xc, yc + 5);
		}
		ctx.stroke();
		n = this.xAxisFormat;
		ctx.fillText(minValue.toFixed(n), xCanvas(minValue) - 3 * (n + 1), yc + 15);
		ctx.fillText(maxValue.toFixed(n), xCanvas(maxValue) - 3 * (n + 1), yc + 15);
		//Vertical axis
		n = this.yAxisFormat;
		ctx.beginPath();
		xc = xCanvas(xMin);
		yc = yCanvas(yMax);
		ctx.moveTo(xc, yCanvas(0));
		ctx.lineTo(xc, yc);
		ctx.moveTo(xc - 5, yc);
		ctx.lineTo(xc + 5, yc);
		ctx.stroke();
		ctx.fillText(0, xc - 10, yCanvas(0) + 5);
		ctx.fillText(yMax.toFixed(n), xc - 5 * (n + 3), yc + 5);
		//Data graph
		w = xCanvas(xMin + step) - xCanvas(xMin);		
		ctx.fillStyle = this.dataColor;
		if (data.getSize() > 0){
			for (x = minValue; x < maxValue + step / 2; x = x + step){
				if (this.type == 0) y = data.relFreq(x);
				else if (this.type == 1) y = data.density(x);
				xc = xCanvas(x - step / 2);
				yc = yCanvas(y); 
				h = yCanvas(0) - yc;
				ctx.fillRect(xc, yc, w, h);
			}
		}
		//Moments
		if (moments){
			yc = height - 15;
			if (data.getSize() > 1){
				ctx.strokeStyle = this.dataColor;
				xc = xCanvas(data.mean() - data.stdDev());
				w = xCanvas(data.mean() + data.stdDev()) - xc;
				ctx.fillRect(xc, yc, w, 10);
				xc = xCanvas(data.mean());
				ctx.beginPath();
				ctx.moveTo(xc, yc + 15);
				ctx.lineTo(xc, yc - 5);
				ctx.stroke();
			}
		}
		//Text
		this.text = label;
		this.text = this.text + "\tData";
		for (var x2 = minValue; x2 <= maxValue; x2 = x2 + step){
			this.text = this.text + "\n" + x2.toFixed(this.xFormat);
			if (data.getSize() > 0){
				if (this.type === 0) y = data.relFreq(x2);
				else y = data.density(x2);
				this.text = this.text + "\t" + y.toFixed(this.yFormat);
			}
		}
		if (moments){
			this.text = this.text + "\nMean";
			if (data.getSize() > 0) this.text = this.text + "\t" + data.mean().toFixed(this.momentFormat);
			this.text = this.text + "\nSD";
			if (data.getSize() > 1) this.text = this.text + "\t" + data.stdDev().toFixed(this.momentFormat);
		}
	};
	
	this.showMoments = function(b){
		moments = b;
		if (moments) this.bottomMargin = 30;
		else this.bottomMargin = 20;
	};
}

function Door(canvas){
	var ctx = canvas.getContext("2d");
	var width = canvas.width, height = canvas.height;
	
	this.close = function(label, color){
		ctx.font = "16pt Helvetica";
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "yellow";
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(width / 2, 0);
		ctx.lineTo(width / 2, height);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(width / 2 - 20, height / 2, 5, 0, 2 * Math.PI, true);
		ctx.arc(width / 2 + 20, height / 2, 5, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.fillStyle = color;
		ctx.fillText(label, 20, 20);
	};
	
	this.open = function(img){
		ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
	};
 }