function vis(config){

 //Some default variables

    var defaults = {
      'range' : [0,20],
      'height' : $(config.parent).height(),
      'width' : $(config.parent).width()
    };

    var settings = $.extend({}, defaults, config);

  function chart(){

   // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 50};
    /*
        h = config.height ? config.height :  $(config.parent).height(),
        w = config.width ? config.width : $(config.parent).width() ;
    */
    var width = settings.width - margin.left - margin.right,
        height = settings.height - margin.top - margin.bottom;

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
        .orient("bottom");

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
        .attr("height", function(d) { return height - y(d.y); })
        .on('mouseover', function(d){ 
          d3.select(this).classed('hover', true) 
          console.log(d3.select(this));

      })
        .on('mouseout', function(){ d3.select(this).classed('hover', false) });


    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

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