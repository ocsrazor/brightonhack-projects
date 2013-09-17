//slider.js

//TODO: get the JS out of main html file and wrap it in here.
var sliderObj = {
    leapFrame: null,
    slider: null,
    handle: null,

    margin: {
        top: 200,
        right: 50,
        bottom: 200,
        left: 50,
    },

    width: 960 - this.margin.left - this.margin.right,
    height: 500 - this.margin.bottom - this.margin.top,


    x: d3.scale.linear().domain([0, 180]).range([0, width]).clamp(true),

    brush: d3.svg.brush().x(x).extent([0, 0]).on("brush", brushed),

    svg: d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

    init: function () {
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height / 2 + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(function (d) {
                    return d + "°";
                })
                .tickSize(0)
                .tickPadding(12))
            .select(".domain")
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "halo")


        slider: svg.append("g")
            .attr("class", "slider")
            .call(brush);

        slider.selectAll(".extent,.resize")
            .remove();

        slider.select(".background")
            .attr("height", height);

        handle: slider.append("circle")
            .attr("class", "handle")
            .attr("transform", "translate(0," + height / 2 + ")")
            .attr("r", 9),

        slider
            .call(brush.event)
            .transition() // gratuitous intro!
        .duration(750)
            .call(brush.extent([70, 70]))
            .call(brush.event);
    },



    brushed: function () {
        var value = brush.extent()[0];

        //if (d3.event.sourceEvent) { // not a programmatic event
        //  value = x.invert(d3.mouse(this)[0]);
        //  brush.extent([value, value]);
        //}
        if (leapFrame) { // not a programmatic event
            if (leapFrame.pointables[0]) {
                value = leapFrame.pointables[0].tipPosition[0];
                brush.extent([value, value]);
            }
        }

        handle.attr("cx", x(value));
        d3.select("body").style("background-color", d3.hsl(value, .8, .8));
    },

    leapMotionListener : function(frame){
    	this.leapFrame=frame;
    	if (this.leapFrame) { // not a programmatic event
        	if(this.leapFrame.pointables[0]){
        		sliderObj.slider
        		.call(brush.event)
        		.call(brush.extent(frame.pointables[0].tipPosition[0]))
        		.call(brush.event);
        	}
        }
    },
};

Leap.loop(function (frame) {
    sliderObj.leapFrame = frame;
    if (leapFrame) { // not a programmatic event
        if (leapFrame.pointables[0]) {
            sliderObj.slider
                .call(brush.event)
                .call(brush.extent(frame.pointables[0].tipPosition[0]))
                .call(brush.event);
        }
    }
});