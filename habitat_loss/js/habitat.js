//habitat.js

var chart = {

  config: {
    width: 800,
    height: 1000,
  },

  data: null,
  geodata: null,
  ukGeoLookup: null,
  ukHomeless: null,
  quarters: null,
  projection: null,
  path: null,
  extent: null,
  scale: null,

  g: null, // group element for chart

  // Helper functions
  translate: function(x, y) {return 'translate('+x+','+y+')';},

drawMap: function (quarter){
  this.drawCounties("bgCounty", false);
  this.drawCounties("county", true, quarter);
},

initData: function() {
    // Make lookup hash for geojson data
     var ukGeoLookup = {};
    _.each(this.geodata, function(v) {
      ukGeoLookup[v.county] = v.geo_json;
      this.ukGeoLookup = ukGeoLookup;
    });

    // Convert data into array
    this.ukHomeless = _.map(this.data, function(countyData, county) {
    countyData.county = countyData.county.replace("UA", "");
    countyData.county = countyData.county.replace(/\(.*\)/,"");
    countyData.county = countyData.county.trim();

    quarters = ["2011 Q4", "2011 Q3", "2011 Q4", "2012 Q1", "2012 Q2", "2012 Q3", "2012 Q4", "2013 Q1"];

    return countyData;
    });

  },

  init: function() {
    this.g = d3.select('body')
      .append('svg')
      .append('g')
      .attr('transform', this.translate(50, 50));


    projection = d3.geo.albers()
      .center([0, 53.25])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(5700)
      .translate([250, 250]);

    path = d3.geo.path()
      .projection(projection);

    this.extent = d3.extent(this.data, function(d) {return d["2011 Q2"];});
    this.scale = d3.scale.linear().domain(this.extent).range(['white', 'blue']);
  },

make: function() {
    var that = this;

    this.g
      .selectAll('.county')
      .data(this.data)
      .enter()
      .append('path')
      .classed('county', true)
      .attr('d', function(d) {
        return path(d.geo_json);
      })
      .style('fill', function(d) {
        // console.log(d['2011 Q2'], that.scale(d['2011 Q2']));
        return that.scale(d['2011 Q2']);
      });
      this.drawMap(0);
  },



drawCounties: function (className, scaleCounties, quarter){
  this.g.selectAll("." + className)
        .data(chart.geodata)
        .enter()
        .append("path")
        .classed(className, true)
        .attr("d", function(d){
          return path(d.geo_json)
        })
        // .on("click", function(d){
        //   alert(d["2011 Q2"]);
        // })
  
      if (scaleCounties){

        this.g.selectAll("." + className).attr("transform", function(d) {
          var centroid = path.centroid(d.geo_json),
              x = centroid[0],
              y = centroid[1];

          return "translate(" + x + "," + y + ")"
              + "scale(" + (d[quarters[quarter]] || 0) + ")"
              + "translate(" + -x + "," + -y + ")";
        })
      }
      
}  

}

d3.json('data/HouseholdHomeless2.json', function(err, jsonHomeless) {
  chart.data = jsonHomeless;

  d3.json('data/uk2.json', function(err, jsonGeoData) {
    chart.geodata = jsonGeoData;

    chart.initData();
    chart.init();
    chart.make();
  });
});
