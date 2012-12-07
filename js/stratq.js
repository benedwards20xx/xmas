
oCanvas.domReady(function () {
var canvas = oCanvas.create({
    canvas: "#canvas",
    background: "#222",
    fps: 60
});

var data = [25, 65, 10];

var prototype = canvas.display.arc({
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 75,
    strokeWidth: 150
});

var pieces = [], end, lastEnd;
for (var i = 0; i < data.length; i++) {

    end = (i > 0 ? lastEnd : 0) + 360 / (100 / data[i]) - (i < 1 ? 90 : 0);

    pieces.push(prototype.clone({
        start: (i < 1 ? -90 : lastEnd),
        end: end,
        strokeColor: "hsl(195, "+ (100 - i*10) +"%, "+ (50 - i*10) +"%)"
    }));

    canvas.addChild(pieces[i]);
    lastEnd = end;

    pieces[i]._start = pieces[i].start;
    pieces[i]._end = pieces[i].end;

    pieces[i].bind("mouseenter touchenter", function () {
        this.radius = 77;
        this.strokeWidth = 154;
        canvas.redraw();
    }).bind("mouseleave touchleave", function () {
        this.radius = 75;
        this.strokeWidth = 150;
        canvas.redraw();
    }).bind("click tap", function () {
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].animate({
                start: 0,
                end: 0,
                opacity: 0
            }, 500, function () {
                this.animate({
                    start: this._start,
                    end: this._end,
                    opacity: 1
                }, 500);
            });
        }
    });
}
    });