oCanvas.domReady(function () {
var canvas = oCanvas.create({
    canvas: "#canvas",
    background: "#000",
    fps: 60
});

var santa = canvas.display.arc({
    radius: 40,
    start: 0,
    end: 360,
    fill: "red"
});

var chimney = canvas.display.rectangle({
    width: 60,
    height: 200,
    x: canvas.width - this.width,
    y: canvas.height - this.height,
    fill: "#f00"
});

var present = canvas.display.rectangle({
    width: 30,
    height: 30,
    fill: '#0f0'
});

canvas.addChild(santa);
canvas.addChild(chimney);
//canvas.addChild(present);
canvas.setLoop(function () {
    santa.x = canvas.mouse.x;
    santa.y = canvas.mouse.y;

    if (chimney.x > -chimney.width) {
        chimney.x--;
    } else {
        chimney.moveTo(canvas.width - chimney.width, canvas.height - chimney.height);
    }

});

canvas.bind("click", function() {
    canvas.addChild(present.clone({
        x: canvas.mouse.x - santa.radius / 2,
        y: canvas.mouse.y + santa.radius
    }));
});

canvas.timeline.start();

});