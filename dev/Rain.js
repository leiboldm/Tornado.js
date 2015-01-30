function makeItRain(options) {
    options = options || {};
    options.frequency = Number(options.frequency) || 20; // units: drops per second
    options.frequency = Math.round(1 / options.frequency * 1000); // convert to milliseconds / drop
    options.updateRate = Number(options.updateRate) || 20; // units: updates per second
    options.updateRate = Math.round(1 / options.updateRate * 1000); // convert to milliseconds / frame
    options.dropSize = Number(options.dropSize) || 30; // units: pixels
    options.rainColor = options.rainColor || "#08F";
    if (options.rainColor.indexOf("#") !== 0 || 
        !(options.rainColor.length == 4 || options.rainColor.length == 7)) {
        if (window.console) console.log("Invalid rainColor");
        return {};
    }
    options.dropSpeed = Number(options.dropSpeed) || 800; // units: pixels per second
    options.dropSpeed = Math.round(options.dropSpeed * options.updateRate / 1000); // convert to pixels per frame
    console.log(options);
    var relPosHolder = null;
    if (options.hasOwnProperty('parentElement')) {
        options.parentElt = options.parentElement;
        if (!(options.parentElt instanceof jQuery)) options.parentElt = $(options.parentElt);
        relPosHolder = document.createElement("div");
        relPosHolder.style.position = "relative";
        relPosHolder.style.height = "0px";
        relPosHolder.style.width = "0px";
        options.parentElt.append(relPosHolder);
        var rainHolder = document.createElement("div");
        rainHolder.style.overflow = "hidden";
        rainHolder.style.width = options.parentElt.width().toString() + "px";
        rainHolder.style.height = options.parentElt.height().toString() + "px";
        rainHolder.style.position = "absolute";
        rainHolder.style.bottom = "0px";
        relPosHolder.appendChild(rainHolder);
        options.parentElt = rainHolder;
        options.position = "absolute";
    } else {
        options.parentElt = document.body;
        options.position = "fixed";
    }
    // convert to jquery object to find overflowX value
    if (!(options.parentElt instanceof jQuery)) options.parentElt = $(options.parentElt);
    // should have some advanced option to disable this if necessary
    if (options.parentElt.css("overflowX") != "scroll") options.parentElt.css("overflowX", "hidden"); 
    options.splash = (options.hasOwnProperty('splash')) ? options.splash : true;
    var rain = {};
    var mt = mouseTracker();
    var int1 = null;
    rain.stop = function () {
        if (int1) clearInterval(int1);
    }
    rain.start = function () {
        int1 = setInterval(function() {
            var mouse_x = mt.getMouseX();
            var x = Math.round(Math.random() * options.parentElt.width());
            var rot = 0;
            if (mouse_x < options.parentElt.offset().left) rot = 30;
            else if (mouse_x > options.parentElt.offset().left + options.parentElt.width()) rot = -30;
            else {
                rot = ((options.parentElt.width() + options.parentElt.offset().left) / 2 - mouse_x)
                        * 60 / options.parentElt.width();
            }
            makeRainDrop(x, rot, options);
        }, options.frequency);
    }
    rain.remove = function () {
        rain.stop();
        if (relPosHolder) {
            if (options.parentElement instanceof jQuery) options.parentElement.get(0).removeChild(relPosHolder);
            else options.parentElement.removeChild(relPosHolder);
        }
    }
    rain.start();
    return rain;
}

function makeRainDrop(x_pos, rotation, options) {
    var drop_length = Math.round(Math.random() * options.dropSize + options.dropSize);
    //console.log(options.dropSize, drop_length);
    var drop = document.createElement("div");
    drop.style.height = drop_length + "px";
    drop.style.width = "0px";
    drop.style.border = "2px solid " + options.rainColor;
    drop.style.borderRadius = "50%";
    drop.style.backgroundColor = options.rainColor;
    drop.style.position = options.position;
    drop.style.left = x_pos.toString() + "px";
    drop.style.transform = "rotate(" + rotation + "deg)";
    drop.style.top = "0px";
    drop.style.opacity = "0.5";
    options.parentElt.append(drop);
    var top = 0;
    var left = x_pos;
    var interval = null;
    var dy = options.dropSpeed;
    var dx = 0 - Math.round(Math.tan(rotation*6.28/360) * dy);
    interval = setInterval(function() {
        if (top > options.parentElt.innerHeight || top > window.innerHeight) {
            clearInterval(interval);
            options.parentElt.get(0).removeChild(drop);
            var splashTop = (options.position == "fixed") ? window.innerHeight : $( options.parentElt ).innerHeight();
            if (options.splash) splashDrop(left, splashTop, options);
        }
        moveDrop(drop, top, left, dy, dx);
        top += dy;
        left += dx;
    }, options.updateRate);
    return drop;
}

function splashDrop(left, top, options) {
    var partCount = 5;
    for (var i = 0; i < 5; i++) {
        (function() { // self-invoking function to work around weird javascript scoping
            var p = document.createElement('div');
            p.style.height = "0px";
            p.style.width = "0px";
            p.style.border = "3px solid " + options.rainColor;
            p.style.borderRadius = "50%";
            p.style.position = options.position;
            p.style.left = left + "px";
            p.style.top = top + "px";
            p.style.opacity = "0.1";
            options.parentElt.append(p);
            /*// code to visualize where splash drop is starting from
            var cross = document.createElement("div");
            cross.style.height="10px";
            cross.style.width="10px";
            cross.style.backgroundColor = "#F00";
            cross.style.position = "fixed";
            cross.style.left = left + "px";
            cross.style.top = top + "px";
            options.parentElt.append(cross);*/
            var dropLeft = left;
            var dropTop = top;
            var speedNormFactor = 30;
            var dx = Math.round(Math.random() * 10 - 5) * options.updateRate / speedNormFactor;
            var dy = Math.round(Math.random() * -5 - 5);
            var interval = setInterval(function(){
                if (dropTop > window.innerHeight) {
                    p.parentNode.removeChild(p);
                    clearInterval(interval);
                    return;
                }
                moveDrop(p, dropTop, dropLeft, dy, dx);
                dropTop += (dy * options.updateRate / speedNormFactor);
                dropLeft += dx;
                dy += (options.updateRate / speedNormFactor);
            }, options.updateRate);
        })();
    }
}

function moveDrop(mydrop, mytop, myleft, dy, dx) {
    mydrop.style.top = (mytop + dy) + "px";
    mydrop.style.left = (myleft + dx) + "px";
}

// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
function mouseTracker() {
    var IE = document.all?true:false;
    if (!IE) document.captureEvents(Event.MOUSEMOVE);
    document.onmousemove = getMouseXY;
    var tempX = 0;
    var tempY = 0;
    function getMouseXY(e) {
      if (IE) { // grab the x-y pos.s if browser is IE
        tempX = event.clientX + document.body.scrollLeft;
        tempY = event.clientY + document.body.scrollTop;
      } else {  // grab the x-y pos.s if browser is NS
        tempX = e.pageX;
        tempY = e.pageY;
      }  
      if (tempX < 0){tempX = 0}
      if (tempY < 0){tempY = 0}  
      return true;
    }
    var mt = {};
    mt.getMouseX = function() {
        return tempX;
    }
    mt.getMouseY = function() {
        return tempY;
    }
    return mt;
}