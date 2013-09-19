(function($) {

    /**
     * Utility function: degrees to radiants.
     * @param {Number} degree
     * @returns {Number|@exp;Math@pro;PI}
     */
    var toRadiant = function toRadiant(degree){
        return Math.PI / 180 * degree;
    };



    $().ready(function() {

        var start, end, baskets, spiralSvg, width = 800, height = 600;
        baskets = {};
        var prevThickness = 50;
        var color = ['OliveDrab', 'Olive', 'Orange', 'OrangeRed', 'Red'];
        var index = [1.02, 1.04, 1.05, 0.98, 0.98, 0.96, 0.95, 0.97, 0.95, 0.97];
        var nShoppings = [173, 180, 189, 185, 181, 174, 165, 160, 152, 147];
        var s = 90;
        var i = 0;

        /**
         * Initializes basket data.
         **/
        var loadBaskets = function loadBaskets() {
            var index_counter = indexes_by_year.length;
            for (var i = 1; i < index_counter; ++i) {
                var year = indexes_by_year[i].Year;
                var name = "basket_" + year;
                var scale = nShoppings[i-1];//indexes_by_year[i].Index;
                baskets[name] = new FoodPriceEntity(name, year, scale, 'image/basketFull.svg');
            }
        }();

        console.log(baskets);
    /**
     * Adds a product image to an svg
     * @param {object} svg
     * @param {String} name
     * @param {String} img
     * @param {Number} position
     * @param {Number} size
     * @returns {undefined}
     */
     var loadProductImg = function loadProductImg(svg, name, img, position, size){
            svg.append("image")
                    .attr("id", name)
                    .attr("xlink:href", img)
                    .attr("x", position.x)
                    .attr("y", position.y)
                    .attr("width", size)
                    .attr("height", size);
     }
     /**
      * Initializes spiral svg and return s a ref. to it.
      * @returns {unresolved}
      **/
     var initSpiralSvg = function initSpiralSvg(){

          var svg = d3.select("#main-wrapper").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("align", "center")
                .style("background", '#333')
                .append("g")
                .attr("id", "spiral_inner")
                .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 8) + ")");
        return svg;

     };

     spiralSvg = initSpiralSvg();

        /*
         svg.append("svg:text")
         .attr("x", function(){return -width/2+20})
         .attr("y", function(){return -height/2+10})
         .attr("dx", ".12em")
         .attr("dy", ".12em")
         .attr("fill", 'White')
         .attr("align", 'middle')
         .attr("font-size",10)
         .text("");

         svg.append("svg:text")
         .attr("x", function(){return -width/2+20})
         .attr("y", function(){return -height/2+23})
         .attr("dx", ".12em")
         .attr("dy", ".12em")
         .attr("fill", 'White')
         .attr("align", 'middle')
         .attr("font-size",10)
         .text("");
         */

    /**
     *
     * @param {object} svg
     * @param {FoodPrice Entity} basket
     * @returns {undefined}
     */
     var drawBasket = function drawBasket(svg, basket) {
            svg.append("image")
                    .attr("id", "img_basket")
                    .attr("xlink:href", basket.sprite)
                    .attr("x", -30)
                    .attr("y", -50)
                    .attr("width", 130)
                    .attr("height", 130);
        };

        drawBasket(spiralSvg, baskets["basket_2003"]);

    var updateBasketSprite = function updateBasketSprite(year){

            var basket_key = "basket_" + year;
            var basket = baskets[basket_key];

            if(basket.scale >= 180){
               basket.setSprite('image/basketFull.svg');
            }else if(basket.scale>=170 && basket.scale <180){
               basket.setSprite('image/basketFiveItems.svg');
            }else if(basket.scale>=160 && basket.scale <175){
               basket.setSprite('image/basketFourItems.svg');
            }else if(basket.scale>=145 && basket.scale <160){
               basket.setSprite('image/basketTwoItems.svg');
            }else{
                //Default
               basket.setSprite('image/basketSixItems.svg');
            }

            //

            //spiralSvg.select("img_basket").attr("xlink:href", basket.sprite);
            spiralSvg.select("img_basket").remove();
            drawBasket(spiralSvg, basket);

        }


        var buildSpiral = function buildSpiral(start, end, color, year, index, nShoppings) {

            var pieces = d3.range(start, end + 0.001, (end - start) / 1000);
            var points = [];

            var calcSpiralData = function(piece) {
                var d = {};
                radiant = toRadiant(piece);
                var radius = 102 * Math.log(radiant);
                d.x = Math.cos(radiant) * radius;
                d.y = -Math.sin(radiant) * radius - 20;
                return d;
            }

            var lineFunction = d3.svg.line()
                    .x(function(d, i) {
                var point = calcSpiralData(d);
                points.push(point);
                return point.x;
            })
                    .y(function(d) {
                var point = calcSpiralData(d);
                return point.y;
            })
                    .interpolate("linear");

            var spiral_inner = d3.select("#spiral_inner")
                    .data(pieces);
            var thickness = 10;
            prevThickness = prevThickness * index;
            spiral_inner
                    .append("path")
                    .attr("id", "p" + i)
                    .attr("fill", "none")
                    .attr("stroke", color)
                    .attr("stroke-width", prevThickness)
                    .attr("d", function(d, i) {
                return lineFunction(pieces);
            });

            var segCenter = points[Math.floor(points.length * 0.5)];

            var dir = {"x": segCenter.x / Math.sqrt(segCenter.x * segCenter.x + segCenter.y * segCenter.y), "y": segCenter.y / Math.sqrt(segCenter.x * segCenter.x + segCenter.y * segCenter.y)};

            var angle = toRadiant((end - start) / 500)

            spiral_inner.append("svg:text")
                    .attr("x", function() {
                return segCenter.x + 60 * dir.x
            })
                    .attr("y", function() {
                return segCenter.y + 50 * dir.y
            })
                    .attr("dx", ".12em")
                    .attr("dy", ".12em")
                    .attr("fill", color)
                    .attr("font-weight", "bold")
                    .attr("font-size", 16)
                    .attr("text-anchor", "middle")
                    .text(year);

            spiral_inner.append("svg:text")
                    .attr("x", function() {
                return segCenter.x
            })
                    .attr("y", function() {
                return segCenter.y
            })
                    .attr("dx", ".12em")
                    .attr("dy", ".12em")
                    .attr("fill", color)
                    .attr("font-weight", "bold")
                    .attr("font-size", 12)
                    .attr("text-anchor", "middle")
                    .attr("stroke", 'black')
                    .attr("stroke-width", 1)
                    .text(nShoppings);

            var pathEl = d3.select("#p" + i);

            pathEl.attr("stroke-dasharray", 1000 + " " + 1000)
                    .attr("stroke-dashoffset", 1000)
                    .transition()
                    .duration(5000)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0);
			updateBasketSprite(year);
            pathEl.on("click", function() {
                d3.select(this).attr("stroke-width", prevThickness * 0.5 * index);
            });

            pathEl.on("mouseover", function() {
                d3.select(this).attr("stroke-width", prevThickness * 1.5 * index)
            });

            pathEl.on("mouseout", function() {
                d3.select(this).attr("stroke-width", prevThickness * index)
            });
        }


        var animate = function animate()
        {
            start = i * 36 + s;
            end = (i + 1) * 36 + s;
            var j;
            if (i >= 5)
            {
                j = 10 - i - 1;
            } else
            {
                j = i;
            }

            buildSpiral(start, end, color[j], 2003 + i, index[i], nShoppings[i]);

            updateBasketSprite(2003 + i);
            i++;
        }

        animate();
        window.setInterval(function() {
            if (i < 10)
                animate()
        }, 1000);
    });


})(jQuery);