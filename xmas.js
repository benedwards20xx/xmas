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

var score = 0;
var scoreText = canvas.display.text({
    x: canvas.width - 5,
    y: 5,
    origin: { x: "right", y: "top" },
    font: "bold 20px sans-serif",
    text: score,
    fill: "#f00"
});

var present = canvas.display.rectangle({
    x: 200,
    y: 200,
    width: 30,
    height: 30,
    fill: '#0f0'
});

var presents = new Array();
var presentsOnScreen = 1;

canvas.bind("click", function() {
    
    //present.x = canvas.mouse.x - santa.radius / 2;
    //present.y = canvas.mouse.y + santa.radius;
    if (presents.length < presentsOnScreen) {
        var newPresent = present.clone({
            x: canvas.mouse.x - santa.radius / 2,
            y: canvas.mouse.y + santa.radius
        });
        presents.push(newPresent);
        canvas.addChild(newPresent);
    }
});

canvas.addChild(scoreText);
canvas.addChild(santa);
canvas.addChild(chimney);
canvas.setLoop(function () {
    santa.x = canvas.mouse.x;
    santa.y = canvas.mouse.y;

    if (chimney.x > -chimney.width) {
        chimney.x--;
    } else {
        chimney.moveTo(canvas.width - chimney.width, canvas.height - chimney.height);
    }

    if (presents.length > 0) {
        for (var i = 0; i < presents.length; i++) {
            if (presents[i].y <= canvas.height) {
                presents[i].y+=2;    
            } else {
                canvas.removeChild(presents[i]);
                presents.splice(i,i+1);
            }

            if ((presents[i].x >= chimney.x 
                    && presents[i].x <= chimney.x + chimney.width) 
                    && (presents[i].y >= canvas.height - chimney.height
                    && (presents[i].y <= canvas.height - chimney.height/2))) {
                score += 10;
                canvas.removeChild(presents[i]);
                presents.splice(i,i+1);
            }
        }
    }
    scoreText.text = score;
});

canvas.timeline.start();

});