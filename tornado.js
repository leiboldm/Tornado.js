console.log("buenos dias senor");

var Lightning = function(options) {
    var lightning = {};
    var x = options.start_x || window.innerWidth / 2;
    var y = options.start_y || 0;
    var end_x = options.end_x || 0;
    var end_y = options.end_y || window.innerHeight;
    var forking = options.forking || true;
    var pieces = [];
    var color = '#ffcc00';
    var parentElt = 'body';

    var pieceLength = 25;

    lightning.randomStrike = function() {
        var strikeHolder = $("<div/>").appendTo(parentElt);
        (function drawNextPiece() {
            var next_x = Math.random() * pieceLength * 2 - pieceLength;
            var next_y = Math.sqrt(Math.pow(pieceLength, 2) - Math.pow(next_x, 2));
            drawPiece(x, y, next_x + x, next_y + y, strikeHolder);
            x += next_x;
            y += next_y;
            if (x > 0 && x < window.innerWidth && y < window.innerHeight) drawNextPiece();
        })();
        var opacity = 1;
        setTimeout(function() {
            (function fadeOut() {
                setTimeout(function() {
                    strikeHolder.css("opacity", opacity);
                    opacity -= 0.1;
                    if (opacity > 0) fadeOut();
                    else strikeHolder.remove();
                }, 20);
            })();
        }, 200);
    };

    lightning.guidedStrike = function() { // draws a bolt that start at (x, y) and ends at (end_x, end_y)
        var strikeHolder = $("<div/>").appendTo(parentElt);
        (function divideAndConquer(x1, y1, x2, y2) {
            var lineLength = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            if (lineLength <= pieceLength) {
                drawPiece(x1, y1, x2, y2, strikeHolder);
                return;
            }
            var offset = Math.random() * lineLength/2 - lineLength/4;
            var dx = x2 - x1;
            var dy = y2 - y1;
            var dist = Math.sqrt((dy*dy) + (dx*dx));
            var center_x = (x1 + x2) / 2;
            var center_y = (y1 + y2) / 2;
            var rx = -dy * (offset / dist);
            var ry = dx * (offset / dist);
            var x_mid = center_x + rx;
            var y_mid = center_y + ry;
            if (forking && Math.random() * 10 > 9) {
                var fork_end_x = (Math.random() - 0.5 < 0) ? ((x2 - x1) + x1) : ((x1 - x2) + x1);
                divideAndConquer(x1, y1, fork_end_x, y2);
            }
            if (isNaN(x_mid) || isNaN(y_mid)) return;
            divideAndConquer(x1, y1, x_mid, y_mid);
            divideAndConquer(x_mid, y_mid, x2, y2);
        })(x, y, end_x, end_y);
        var opacity = 1;
        setTimeout(function() {
            (function fadeOut() {
                setTimeout(function() {
                    strikeHolder.css("opacity", opacity);
                    opacity -= 0.1;
                    if (opacity > 0) fadeOut();
                    else strikeHolder.remove();
                }, 20);
            })();
        }, 250);
    };

    function drawPiece(x1, y1, x2, y2, holder) {
        var delta_x = x2 - x1;
        var delta_y = y2 - y1;
        var len = Math.sqrt(delta_x*delta_x + delta_y*delta_y);
        var deg = Math.asin(delta_x / len) * 180 / Math.PI;
        deg *= -1;
        if (delta_y < 0 && deg > 0) deg = 180 - deg;
        else if (delta_y < 0 && deg <= 0) deg = -180 - deg;
        $("<div style='height: " + (len*2) + "px; width: 2px; position: absolute; " + 
          " left: " + x1 + "px; top: " + (y1 - len) + "px; transform: rotate(" + deg + "deg);'>" +
                "<div style='width: 100%; height: 50%;'/>" + 
                "<div style='width: 100%; height: 50%; background-color: " + color + "; border: 1px solid " + color + 
                "; border-radius: 2px; z-index: 100;'/>" +
          "</div>").appendTo(holder);
    }

    return lightning;
};

var Tornado = function(options) {
    var tornado = {};
    var element = options.element || 'body';
    var height = options.height || 250;
    var width = options.width || 100;
    var swirls = options.swirls || 30;
    var color = options.color || '#555555';
    var position = options.position || 'absolute';
    var debrisCount = options.debris || 4;
    var peopleCount = options.people || 0;
    var parts = [];
    var debris = [];
    var people = [];

    var holder = $("<div style='height: " + height + "px; width: " + width + "px; position: " + position + "; left: " + x + "px; top: " + y + "px;'></div>").appendTo(element);
    tornado.init = function() {
        for (var i = 0; i < swirls - 1; i++) {
            var r = (swirls - i) / swirls;
            var w = Math.round(width * r);
            var bH = Math.round(width / 100);
            var bV = Math.round(height / 150);
            var left = Math.round((width / 2) - w * 0.5);
            var style = 
                "width: " + w + "px;" + 
                "height: " + Math.round(height / swirls * 3 * (r / 1.5 + 0.1)) + "px;" +
                "border-radius: 50%;" +
                "box-shadow: " + bH + "px " + bV + "px 1px 1px " + color + ";" +
                "position: " + position + ";" +
                "background-color: rgba(100, 100, 100, 0.5); " + 
                "z-index: 3;" +
                "left: " + left + "px;" + 
                "top: " + Math.round(i / swirls * height) + "px;";
            var id = "tSwirl" + i.toString();
            $("<div style='" + style + "' id='" + id + "'></div>").appendTo(holder),
            document.getElementById(id).style.boxShadow = Math.round(width / 100) + "px " + Math.round(height / 150) + "px 1px 1px " + color;
            parts.push({
                id: id,
                bsHor: bH,
                bsVert: bV,
                left: left,
                width: w, 
                iter: 0
            });
        }
        /*for (var i = 0; i < debrisCount; i++) {
            var w = Math.round(Math.random() * width / 20) + 1;
            var h = Math.round(Math.random() * height / 10) + 1;
            var left = Math.round(Math.random() * (width / 7) - (width / 14) + (width / 2));
            var top = Math.round(height - (Math.random() * height / 7));
            var deg = 0;
            if (left < width / 2) deg = Math.round(Math.random() * -60) - 15;
            else deg = Math.round(Math.random() * 60) + 15;
            var style = 
                "width: " + w + "px;" +
                "height: " + h + "px;" +
                "left: " + left + "px;" + 
                "top: " + top + "px;" +
                "background-color: rgba(100, 100, 100, 0.9);" +
                "position: absolute; " +
                "transform: rotate(" + deg + "deg); ";
            debris.push($("<div style='" + style + "'/>").appendTo(holder));
        }*/
        for (var i = 0; i < peopleCount; i++) {
            var w = Math.round(width / 10) + 1;
            var h = 2 * w;
            var p = Person({
                width: w,
                height: h,
                element: holder
            }).animate();
            var top = Math.round(Math.random() * 3/4 * height);
            p.move(width / 2, top);
            //p.rotate3d(0, 0, 1, 90, 300);
            people.push({
                person: p,
                top: top,
                iter: Math.random() * 10
            });
        }
        return tornado;
    };

    var x = 0;
    var y = 0;
    tornado.getX = function() {
        return x;
    };
    tornado.getY = function() {
        return y;
    };
    tornado.move = function(x_in, y_in) {
        x = x_in;
        y = y_in;
        holder.css("left", x + "px").css("top", y + "px"); 
    };
    tornado.getWidth = function() {
        return width;
    };
    tornado.setWidth = function(w_in) {
        var wRatio = w_in / width;
        width = w_in;
        holder.css("width", width);
        for (var i = 0; i < parts.length; i++) {
            document.getElementById(parts[i].id).style.width *= wRatio;
        }
    };
    tornado.getHeight = function() {
        return height;
    };
    tornado.setHeight = function(h_in) {
        height = h_in; 
        holder.css("height", height);
        for (var i = 0; i < parts.length; i++) {

        }
    }


    var animateInterval = null;
    tornado.animate = function() {
        var intCount = 0;
        animateInterval = setInterval(function() {
            /*for (var i = 0; i < parts.length; i++) {
                cycleShadow(parts[i]);
                var newShadow = "rgb(85, 85, 85) " + parts[i].bsHor + "px " + parts[i].bsVert + "px 1px 1px";
                var element = document.getElementById(parts[i].id);
                element.style.boxShadow = newShadow;
            }*/
            var i = 0;
            if (intCount % 3 == 0 || true) { 
                var move = Math.round((Math.random() * width / 10) - width / 20);
                var elt = Math.round(Math.random() * (parts.length - 1));
                parts[elt].left += move;
                document.getElementById(parts[elt].id).style.left = parts[elt].left + "px";
            }
            var center = 0;
            for (var i = 0; i < parts.length - 1; i++) {
                var c1 = parts[i].left + parts[i].width / 2;
                var c2 = parts[i + 1].left + parts[i + 1].width / 2;
                if (c1 > c2) {
                    parts[i].left -= 1;
                    document.getElementById(parts[i].id).style.left = parts[i].left + "px";
                } else if (c2 > c1) {
                    parts[i].left += 1;
                    document.getElementById(parts[i].id).style.left = parts[i].left + "px";
                }
                center += (parts[i].left + parts[i].width / 2);
            }
            // the tornado moves randomly so the center of the tornado can be different from the center of the div
            // the center variable holds the center of the tornado
            // the centerOffset variable is the difference between the tornado center and the div center
            center /= parts.length; 
            var centerOffset = center - (width / 2);
            //for (var i = 0; i < debris.length; i++) moveDebris(debris[i]);
            for (var i = 0; i < people.length; i++) movePerson(people[i], centerOffset);
            intCount++;
        }, 60);
        function cycleShadow(p) { 
            p.bsVert = Math.round(Math.sin(p.iter) * 4) + 3;
            p.bsHor = Math.round(Math.cos(p.iter) * 6) + 3;
            p.iter += 0.5;
        }
        function moveDebris(elt) {
            var left = Math.round(Math.random() * (width / 7) - (width / 14) + (width / 2));
            elt.css("left", left + "px");
            var deg = 0;
            if (left < width / 2) deg = Math.round(Math.random() * -60) - 15;
            else deg = Math.round(Math.random() * 60) + 15;
            elt.css("transform", "rotate(" + deg + "deg)");
        }
        function movePerson(p, centerOffset) {
            centerOffset = Math.round(centerOffset);
            var mult = (height - p.top) / height * 3 * width / 8 + width / 8;
            var newLeft = Math.round(Math.sin(p.iter / 3) * mult + width / 2) + centerOffset;
            var newTop = Math.round(Math.cos(p.iter / 3) * height / 15) + p.top;
            p.iter += (p.top / height) / 2 + 0.5;
            /*if (newLeft < width / 2) {
                p.person.rotate3d(0,0,1,-90,300);
            } else p.person.rotate3d(0,0,1,90,300);*/
            if (newTop > p.top) {
                p.person.css("z-index", 2);
            } else p.person.css("z-index", 4);
            p.person.move(newLeft, newTop);
        }
        return tornado;
    };
    tornado.stopAnimation = function() {
        if (animateInterval) {
            clearInterval(animateInterval);
            animateInterval = null;
        }
        return tornado;
    };
    tornado.remove = function() {
        tornado.stopAnimation();
        holder.remove();
        console.log('removing tornado');
    };
    return tornado;
};

var Person = function(options) {
    var person = {};
    options = options || {};
    var height = options.height || 100;
    var width = options.width || 25;
    var color = options.color || '#000';
    var parentElt = options.element || 'body';

    var holder = $("<div style='height: " + height + "px; width: " + width + "px; position: absolute; left: 0px; top: 0px;'/>").appendTo(parentElt);
    var headSize = Math.round((width + height / 3) / 2);
    var head =  $("<div style='background-color: " + color + "; width: " + headSize + "px; height: " + headSize +
                     "px; position: absolute; left: " + (width / 2 - headSize / 2) + "px; border-radius: 50%;'/>").appendTo(holder);
    var exWidth = Math.round(width / 5);
    var legHeight = Math.round(height / 2);
    var torsoTop = headSize - 2;
    var torsoLength = legHeight;
    var torso = $("<div style='background-color: " + color + "; width: " + exWidth + "px; height: " + torsoLength +
        "px; position: absolute; top: " + torsoTop + "px; left: " + Math.round((width / 2) - (exWidth / 2)) + 
        "px;'/>").appendTo(holder);

    var armWidth = Math.round(legHeight * 0.75); // arms are this many pixels long
    var rightArm = $("<div style='width: " + armWidth*2 + "px; height: " + exWidth + "px;" +
                    "position: absolute; top: " + Math.round(headSize + legHeight / 4) + "px; left: " +
                    (width / 2 - armWidth) + "px;'>" + 
                        "<div style='position: relative; float: left; width: 50%; height: 100%;'/>" +
                        "<div style='position: relative; float: right; width: 50%; background-color: " + color + "; height: 100%;'/>" +
                    "</div>").appendTo(holder);
    var leftArm = $("<div style='width: " + armWidth*2 + "px; height: " + exWidth + "px;" +
                    "position: absolute; top: " + Math.round(headSize + legHeight / 4) + "px; left: " +
                    (width / 2 - armWidth) + "px;'>" + 
                        "<div style='position: relative; float: left; width: 50%; background-color: " + color + "; height: 100%;'/>" +
                        "<div style='position: relative; float: right; width: 50%; height: 100%;'/>" +
                    "</div>").appendTo(holder);

    var leftLeg =  $("<div style='width: " + exWidth + "px; height: " + (legHeight*2) +
                     "px; position: absolute; top: " + (torsoTop + torsoLength - legHeight) + "px; left: " + Math.round((width / 2) - (exWidth / 2)) +
                     "px; transform: rotate(30deg);'>" + 
                        "<div style='width: 100%; height: 50%;'/>" + 
                        "<div style='width: 100%; height: 50%; background-color: " + color + ";'/>" +
                    "</div>").appendTo(holder);
    var rightLeg =  $("<div style='width: " + exWidth + "px; height: " + (legHeight*2) +
                     "px; position: absolute; top: " + (torsoTop + torsoLength - legHeight) + "px; left: " + Math.round((width / 2) - (exWidth / 2)) +
                     "px; transform: rotate(-30deg);'>" + 
                        "<div style='width: 100%; height: 50%;'/>" + 
                        "<div style='width: 100%; height: 50%; background-color: " + color + ";'/>" +
                    "</div>").appendTo(holder);
    var animationInterval = null;
    person.animate = function() {
        if (animationInterval == null) {
            var count = 0;
            animationInterval = setInterval(function(){
                var deg = Math.round(Math.sin(count / 2) * 45);
                leftArm.css("transform", "rotate(" + deg + "deg)");
                rightArm.css("transform", "rotate(" + (0 - deg) + "deg)");
                count++;
            }, 50);
        }
        return person;
    };
    person.stopAnimation = function() {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        return person;
    }
    person.move = function(x_in, y_in) {
        holder.css("left", x_in + "px").css("top", y_in + "px");
        return person;
    };
    person.rotate = function(deg) {
        holder.css("transform", "rotate(" + deg + "deg)");
        holder.css("-webkit-tranform", "rotate(" + deg + "deg)");
        holder.css("-ms-transform", "rotate(" + deg + "deg)");
        return person;
    };
    person.rotate3d = function(x_vec, y_vec, z_vec, angle, perspective) {
        var perStr = perspective.toString() + "px";
        var rotStr = "rotate3d(" + x_vec + "," + y_vec + "," + z_vec + "," + angle + "deg)";
        var styStr = "preserve-3d";
        holder.css("transform", rotStr).css("perspective", perStr).css("transform-style", styStr);
        holder.css("-ms-tranform", rotStr).css("-ms-perspective", perStr).css("-ms-transform-style", styStr);
        holder.css("-webkit-transform", rotStr).css("-webkit-perspective", perStr).css("-webkit-transform-style", styStr);
        return person;
    };
    person.remove = function() {
        person.stopAnimation();
        holder.remove();
    };
    person.css = function(a, b) {
        holder.css(a, b);
    };
    return person;
};
