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