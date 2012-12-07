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

var chimney = canvas.display.image({
    image: "img/chimney1.png",
    width: 60,
    height: 200,
    x: canvas.width - this.width,
    y: canvas.height - this.height,
});

var score = 0;
var scoreInc = 0;
var scoreText = canvas.display.text({
    x: canvas.width - 5,
    y: 5,
    origin: { x: "right", y: "top" },
    font: "bold 20px sans-serif",
    text: score,
    fill: "#f00"
});

var present = canvas.display.image({
    image: "img/present.png",
    width: 30,
    height: 30
});

var presents = new Array();
var presentsOnScreen = 1;

canvas.bind("click", function() {
    if (presents.length < presentsOnScreen) {
        var newPresent = present.clone({
            x: canvas.mouse.x - santa.width / 2,
            y: canvas.mouse.y + santa.height
        });
        presents.push(newPresent);
        canvas.addChild(newPresent);
        scoreInc = canvas.height - canvas.mouse.y - chimney.height;
        scoreInc *= Math.floor(scoreInc / 100);
        console.log(scoreInc);
        console.log(Math.floor(scoreInc / 100));
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
                    && (presents[i].y <= canvas.height - chimney.height * 3/4))) {
                score += scoreInc;
                canvas.removeChild(presents[i]);
                presents.splice(i,i+1);
            }
        }
    }
    scoreText.text = score;
});

canvas.timeline.start();

});