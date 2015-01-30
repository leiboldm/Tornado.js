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