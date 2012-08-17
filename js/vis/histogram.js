function vis(config){

 //Some default variables

    var defaults = {
      'range' : [0,10],
      'height' : $(config.parent).height(),
      'width' : $(config.parent).innerWidth()
    };

    var settings = $.extend({}, defaults, config);

    //removing the padding from the parent
    $(config.parent).css('padding','0px');

  function chart(){

   // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 50};
    /*
        h = config.height ? config.height :  $(config.parent).height(),
        w = config.width ? config.width : $(config.parent).width() ;
    */
    var width = settings.width - margin.left - margin.right - 30,
        height = settings.height - margin.top - margin.bottom -30;

    var x = d3.scale.linear()
        .domain( settings.range )
        .range([0, width]);

    // chart a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        .range( settings.range )
        (settings.data);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(6,3,0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(settings.parent).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")

        .attr("class", "bar");

    bar.append("rect")
        .attr("x", function(d,i){ return x(d.x); })
        .attr("width", x(data[0].dx) - 1)
        .attr('y',height)    
      .transition()
      .delay( function(d,i){ return i*50; } )
        .attr('y',function(d){  return y(d.y) })
        .attr("height", function(d) { return height - y(d.y); });


        /*
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });
        Removed the text on top functionality as of now
        */


/* For plotting of the location of the current sample 
      var sample = settings.data
        var sum =0;
        for (i=0;i<sample.length;i++){
            sum += parseInt(sample[i]);
        }
       
       var avg = sum / (sample.length);
       var meanArray = [];
       for(i=0;i<5;i++){
        meanArray.push(avg)
       }

      var mean = svg.selectAll('.mean')
                .data(d3.layout.histogram()([3,4,5,5,5,5,8,8,8,8,8,8,8]))
                .enter()
              //  
                .append('rect')
                .attr('class','mean')
                .attr("x", function(d,i){ return x(d.x); })
                .attr("width", x(data[0].dx) - 1)
                .attr('y',height)    
              .transition()
              .delay( function(d,i){ return i*50; } )
                .attr('y',function(d){  return y(d.y) })
                .attr("height", function(d) { return height - y(d.y); });

*/
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis); 

    svg.append("g")
        .attr("class","y axis")
        .call(yAxis);
   
  }

  //Default methods
  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
    };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  return chart;
}  