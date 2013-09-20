// SHOW POP-OVER
    function showPopOver(divID, year) {
        var popUpDiv, w, h, left, top;
        var popUpDiv = document.getElementById(divID), w = popUpDiv.offsetWidth, h = popUpDiv.offsetHeight;

        var left = "250px"; (window.innerWidth/2)-(w/2);
        var top = "100px";        console.log(top);
        console.log(left);
        popUpDiv.style.left = left;
        popUpDiv.style.top = top;
        popUpDiv.innerHTML = '<h1>' + year + '</h1><div id="chartZoom"><a href="#" id="zoomIn">Zoom In</a> <a href="#" id="zoomOut">Zoom Out</a><a href="javascript:closePopOver(\'pop1\');" title="Close window">Close me</a></div><div id="chart1" class="with-transitions"><svg></svg></div>';

        drawLineChart(year);
        // SHOW THE DIV
        popUpDiv.style.display = "block";


    }
    /**
    * Close poppover
    **/
    function closePopOver(divID) {
        // HIDE THE DIV
        document.getElementById(divID).style.display = "none";
    }