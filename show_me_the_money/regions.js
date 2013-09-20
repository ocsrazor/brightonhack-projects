var all_data;
var map_svg;

function setupMap() {

  var scale = d3.scale.linear().domain([19000, 40000]).range(['#fc0', '#f00']);
  var w = parseInt(d3.select('#mapdiv').style('width'));
  var h = 700;

  //Define map projection
  // var projection = d3.geo.mercator()
  //                  .translate([w/2, h/2])
  //                  .scale([800]);

  var projection = d3.geo.mercator()
      .scale(2000)
      .translate([w*0.75,2600])
      .precision(0.1);

  //Define path generator
  var path = d3.geo.path()
             .projection(projection);

  //Create SVG element
  map_svg = d3.select("#mapdiv")
             .append("svg")
             .attr("width", w)
             .attr("height", h);

  // LOAD IN MONEY DATA
  d3.json("region_data.json", function(d){

    all_data = d;

    //Load in GeoJSON data
    d3.json("regions.json", function(json) {

      //Bind data and create one path per GeoJSON feature
      map_svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", function(d){
          return path(d.geometry);
        })
        .style('fill', '#ccc');
       colourRegions(2005, 'mean');
    });
  });
}

function colourRegions(year, field) {
  var data = all_data[year];
  if (!data) return false;
  var min=99999999999999999, max=0;
  var keys = Object.keys(data);
  for (i=0; i<keys.length; i++) {
    var n = keys[i];
    var v = data[n]['total'][field];
    if (v && v < min) min = v;
    if (v && v > max) max = v;
  }
  scale = d3.scale.linear().domain([min, 40000]).range(['#FFEE00', '#FF0000']);

  map_svg.selectAll('path')
   .transition()
   .duration(1200)
   .style("fill", function(d, i) {
     var n = d.properties.name;
     // console.log(n);
     if (data[n]) {
       // console.log(data[n]);
       var v = data[n]['total'][field];
       return scale(v);
     } else {
       // console.log('  not found');
       return '#ccc';
     }
    });
}
