
function initTornado() {
	var tornadoDestruction = {};
	var tornadoWidth = 100;
	var tornadoHeight = 200;
	var all = document.getElementsByTagName("*");
	var leafNodes = [];
	for (var i = 0; i < all.length; i++) {
		if (all[i].childElementCount == 0 && all[i].tagName != "SCRIPT" && all[i].tagName != "META"
			&& all[i].tagName != "LINK" && all[i].tagName != "TITLE" && all[i].tagName != "BR" && all[i].tagName != "STYLE"
			&& !all[i].attributes.notornado) {
			all[i].animationActive = false;
			leafNodes.push(all[i]);
		}
	}
	console.log(leafNodes);
	var tornado = Tornado({
        element: 'body',
        height: tornadoHeight,
        width: tornadoWidth,
        swirls: 30,
        color: '#555',
        position: 'absolute',
        people: 2
    }).init().animate();
    var x = 0;
	var y = 0;
	tornado.move(x, y);
	var up_or_down = 1;
	var left_or_right = 1;
	var interval = setInterval(function() {
		if (y > ( window.innerHeight - 200 ) || y < 0) up_or_down *= -1;
		if (x > ( window.innerWidth - 100 ) || x < 0) left_or_right *= -1;
		x += Math.ceil(10 * left_or_right);
		y += Math.ceil(10 * up_or_down);
		var windowTop = $(document).scrollTop();
		var windowLeft = $(document).scrollLeft();
		for (var i = 0; i < leafNodes.length; i++) {
			var myX = findPos(leafNodes[i])[0] + windowLeft;
			var myY = findPos(leafNodes[i])[1]
			 + windowTop;
			var myW = leafNodes[i].width || leafNodes[i].offsetWidth;
			var myH = leafNodes[i].height || leafNodes[i].offsetHeight;
			if (x + tornadoWidth/2 > myX && x - tornadoWidth/2 < myX + myW && 
				y + tornadoHeight/2 > myY && y - tornadoHeight/2 < myY + myH && !leafNodes[i].animationActive) {
				var node = leafNodes[i];
				node.animationActive = true;
				$(function() {
				    var $elie = $( leafNodes[i] ), degree = 0, timer;
				    rotate();
				    function rotate() {
				        //$elie.css("font-size", degree + "px");
				        $elie.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});  
				        $elie.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
				        if (degree < 360) {                  
					        timer = setTimeout(function() {
					            degree += 2; rotate();
					        },10);
					    } else {
					    	//$elie.css("font-size", "12px");
					    	node.animationActive = false;
					    }
				    }
				});
			}
		}
		tornado.move(x, y);
	}, 80);
	tornadoDestruction.stop = function() {
		clearInterval(interval);
		tornado.remove();
	};
	return tornadoDestruction;
}

function lightningStorm(timeout) {
	var storm = {}
	Lightning({
		x: Math.random() * window.innerWidth,
		end_x: Math.random() * window.innerWidth,
		forking: true
	}).guidedStrike();
	var interval = setInterval(function() {
		Lightning({
			x: Math.random() * window.innerWidth,
			end_x: Math.random() * window.innerWidth,
			forking: true
		}).guidedStrike();
	}, timeout);
	storm.stop = function() {
		clearInterval(interval);
	}
	return storm;
}

function spawnTornado() {
	var t = initTornado();
	$('body').css("overflow-y", "scroll");
	return t;
}

function findPos(obj) {
    var curleft = 0;
    var curtop = 0;
    if(obj.offsetLeft) curleft += parseInt(obj.offsetLeft);
    if(obj.offsetTop) curtop += parseInt(obj.offsetTop);
    if(obj.scrollTop && obj.scrollTop > 0) curtop -= parseInt(obj.scrollTop);
    if(obj.offsetParent) {
        var pos = findPos(obj.offsetParent);
        curleft += pos[0];
        curtop += pos[1];
    } else if(obj.ownerDocument) {
        var thewindow = obj.ownerDocument.defaultView;
        if(!thewindow && obj.ownerDocument.parentWindow)
            thewindow = obj.ownerDocument.parentWindow;
        if(thewindow) {
            if(thewindow.frameElement) {
                var pos = findPos(thewindow.frameElement);
                curleft += pos[0];
                curtop += pos[1];
            }
        }
    }
    return [curleft,curtop];
}