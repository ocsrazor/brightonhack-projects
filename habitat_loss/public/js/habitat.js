//habitat.js
var chart = {

    config: {
        width: 800,
        height: 1000,
    },

    data: null, //TODO: delete after testing
    geodata: null, //TODO: delete after testing
    popAndGeoData: null,
    ukGeoLookup: null, //TODO: delete after testing
    ukPopAndGeoLookup: [],
    ukHomeless: null, //TODO: delete after testing
    quarters2: [],
    projection: null,
    path: null,
    extent: null,
    scale: null,
    g: null, // group element for chart

    // Helper functions
    translate: function (x, y) {
        return 'translate(' + x + ',' + y + ')';
    },

    drawMap: function (quarter) {
        this.drawCounties("bgcounty", false); // draw actual geoData
        this.drawCounties("county", true, quarter); // init draw of homeless data
        //this.drawHomelessData(0...n); // subseuent data updatees - draw geoData scaled by homelessness
    },

    initData: function () {

        var that = this;
        var ranOnce = false;

        //TODO: delete after testing
        // Make lookup hash for geojson data
        // var ukGeoLookup = {};
        // _.each(this.geodata, function (v) {
        //     ukGeoLookup[v.county] = v.geo_json;
        //     this.ukGeoLookup = ukGeoLookup;
        //     //console.log(this.ukGeoLookup);
        // });

        //TODO: delete after testing
        // // Convert data into array
        // this.ukHomeless = _.map(this.data, function (countyData, county) {
        //     countyData.county = countyData.county.replace("UA", "");
        //     countyData.county = countyData.county.replace(/\(.*\)/, "");
        //     countyData.county = countyData.county.trim();
        //     return countyData;
        // });

        // now have homeless and geoJson data in popAndGeoData - parse this into list of objects
        _.each(this.popAndGeoData, function (v) {
            var index = 0;
            var ukPopAndGeoLookup = {};
            var quarterLookup = {};
            ukPopAndGeoLookup["county"] = v.county;

            var keys = _.keys(v);
            
            _.each(keys, function (v2) { // for all keys containing "Q", ie: quarterly data
                if (v2.indexOf("Q") != -1) {
                    
                    if(!ranOnce){  // one time only execution: // create lookup array: 0...n : "2011 Q1", ... n
                        ukPopAndGeoLookup[v2] = v[v2]; // ...create new entry with original key and value
                        quarterLookup[index++] = v2;
                    }
                }

            });
            ukPopAndGeoLookup["geo_json"] = v.geo_json;

            //add all the objects to the member data array 
            that.ukPopAndGeoLookup.push(ukPopAndGeoLookup);
            if(!ranOnce){
                that.quarters2.push(quarterLookup);
                ranOnce = true;
            }

            
        });
        //console.log(this.ukPopAndGeoLookup);
        //console.log(that.quarters2);

        quarters = ["2011 Q4", "2011 Q3", "2011 Q4", "2012 Q1", "2012 Q2", "2012 Q3", "2012 Q4", "2013 Q1"];

    },

    init: function () {
        this.g = d3.select('.map')
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

        this.extent = d3.extent(this.data, function (d) {
            return d["2011 Q2"];
        });
        this.scale = d3.scale.linear().domain(this.extent).range(['white', 'blue']);
    },

    make: function () {
        //TODO: delete after testing:
        // var that = this;
        // console.log( this.data); // <-- this is "County name" : "homeless data..." (ie: with no geoJson data)
        // this.g
        //   .selectAll('.county')
        //   .data(this.data) // <-- this is blowing my mind... how is this passing geoJson data to all the path elements?  
        //   .enter()
        //   .append('path')
        //   .classed('county', true)
        //   .attr('d', function(d) {
        //     console.log(d);
        //     return path(d.geo_json);
        //   })
        //   .style('fill', function(d) {
        //     // console.log(d['2011 Q2'], that.scale(d['2011 Q2']));
        //     return that.scale(d['2011 Q2']);
        //   });

        this.drawMap(0);
    },


    drawCounties: function (className, scaleCounties, quarter) {
        
        this.g.selectAll("." + className)
        //.data(chart.geodata) //TODO: delete after testing
        .data(chart.ukPopAndGeoLookup)
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

            //TODO: del after testing
            // this.g.selectAll("." + className).attr("transform", function (d) {
            //     var centroid = path.centroid(d.geo_json),
            //         x = centroid[0],
            //         y = centroid[1];

            //     return "translate(" + x + "," + y + ")" + "scale(" + (d[quarters[quarter]] || 0) + ")" + "translate(" + -x + "," + -y + ")";
            // })
        }

    },

    // call this to update data, with 0...n based index, which will map to earliest to latest date of data
    drawHomelessData: function (quarter) {

        //console.log(that.quarters2[0][quarter]); 
        var that = this;
        
        this.g.selectAll("." + "county")
        //.data(chart.geodata) //TODO: delete after testing
        .data(chart.ukPopAndGeoLookup)
        .attr("transform", function (d) {
            var centroid = path.centroid(d.geo_json),
                x = centroid[0],
                y = centroid[1];

            //TODO: delete after testing:
            //return "translate(" + x + "," + y + ")" + "scale(" + (d[quarters[quarter]] || 0) + ")" + "translate(" + -x + "," + -y + ")";
            return "translate(" + x + "," + y + ")" + "scale(" + (d[that.quarters2[0][quarter]] || 0) + ")" + "translate(" + -x + "," + -y + ")";
        })

    },

}

//TODO: delete after testing
d3.json('data/HouseholdHomeless2.json', function (err, jsonHomeless) {
    chart.data = jsonHomeless;

    //TODO: delete after testing
    d3.json('data/uk2.json', function (err, jsonGeoData) {
        chart.geodata = jsonGeoData;

        // only using this data now, delete other json loads after testing.
        d3.json('data/countyPopAndGeo.json', function (err, jsonPopAndGeoData) {
            chart.popAndGeoData = jsonPopAndGeoData;

            chart.initData();
            chart.init();
            chart.make();
        });
    }); //TODO: delete after testing 
}); //TODO: delete after testing