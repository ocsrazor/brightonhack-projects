//habitat.js
var chart = {

    config: {
        width: 600,
        height: 650,
    },

    constructed: false,
    popAndGeoData: null,
    quarters2: [],
    projection: null,
    path: null,
    // extent: null,
    colorScale: null,
    g: null, // group element for chart
    popAndGeo: [],
    total: 0.0,
    lastTotal:0.0,

    // Helper functions
    translate: function (x, y) {
        return 'translate(' + x + ',' + y + ')';
    },

    drawMap: function (quarter) {
        this.drawCounties("bgcounty", false); // draw actual geoData
        this.drawCounties("county", true, quarter); // init draw of homeless data
    },

    initData: function () {

        var that = this;

        this.popAndGeo = _.map(this.popAndGeoData, function(v, k) {
            return v;
        });
        console.log(this.popAndGeo);

        this.quarters2 = ["2011 Q2", "2011 Q3", "2011 Q4", "2012 Q1", "2012 Q2", "2012 Q3", "2012 Q4", "2013 Q1"];

    },

    init: function () {
        this.g = d3.select('#chart')
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height)
            .append('g')
            .attr('transform', this.translate(50, 50));


        projection = d3.geo.albers()
            .center([0, 53.25])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(5700)
            .translate([100, 250]);

        path = d3.geo.path()
            .projection(projection);

        // this.extent = d3.extent(this.data, function (d) {
        //     return d["2011 Q2"];
        // });
        this.colorScale = d3.scale.linear().domain([0,1]).range(['red', 'forestgreen']);
    },

    make: function () {
        this.drawMap(0);
    },


    drawCounties: function (className, scaleCounties, quarter) {
        
        this.g.selectAll("." + className)
        //.data(chart.geodata) //TODO: delete after testing
        .data(chart.popAndGeo)
            .enter()
            .append("path")
            .classed(className, true)
            .attr("d", function (d) {
                return path(d.geo_json)
            })
        // .on("click", function(d){
        //   alert(d["2011 Q2"]);
        // })

        if (scaleCounties) {
            this.drawHomelessData(quarter);
        }

    },

    // call this to update data, with 0...n based index, which will map to earliest to latest date of data
    drawHomelessData: function (quarter) {

        var that = this; 
        var textCol = "red"; 

        total = 0;
        
        this.g.selectAll(".county")
            .transition()
            .duration(150)
            .style('fill', function(d) {
                return that.colorScale(d[that.quarters2[quarter]]);
            })
            .attr("transform", function (d) {
                console.log(d[that.quarters2[quarter]]);
                total += d[that.quarters2[quarter]];
                var centroid = path.centroid(d.geo_json),
                    x = centroid[0],
                    y = centroid[1];
                return "translate(" + x + "," + y + ")" + "scale(" + (d[that.quarters2[quarter]] || 0) + ")" + "translate(" + -x + "," + -y + ")";
            });

        // give some feedback to user:
        if(total > that.lastTotal){
            textCol = "red";
        }
        else{
            textCol = "green";
        }

        d3.select(".homeless_data")
            .transition()
            .duration(500)
            .style("background-color", textCol)
            .text(total.toFixed(4));

            that.lastTotal = total;
    },


}


// only using this data now, delete other json loads after testing.
d3.json('data/countyPopAndGeo.json', function (err, jsonPopAndGeoData) {
    chart.popAndGeoData = jsonPopAndGeoData;

    chart.initData();
    chart.init();
    chart.make();
});
