var Lightning = function(options) {
    var lightning = {};
    var x = Number(options.start_x) || window.innerWidth / 2;
    var y = Number(options.start_y) || 0;
    var end_x = Number(options.end_x) || 0;
    var end_y = Number(options.end_y) || window.innerHeight;
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