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

var startText = canvas.display.text({
    x: canvas.width / 2,
    y: canvas.height / 2,
    align: "center",
    origin: { x: "center", y: "top" },
    font: "bold 20px sans-serif",
    text: "Click to start",
    fill: "#009900"
});


var endText = canvas.display.text({
    x: canvas.width / 2,
    y: canvas.height / 2,
    align: "center",
    origin: { x: "center", y: "top" },
    font: "bold 20px sans-serif",
    fill: "#009900"
});

var present = canvas.display.image({
    image: "img/present.png",
    width: 30,
    height: 30
});

var duration = 30;
var durationText = canvas.display.text({
    x: 5,
    y: 5,
    origin : { x: "left", y: "top" },
    font: "bold 20px sans-serif",
    text: duration,
    fill: "#f00"
});
var interval;

canvas.scenes.create("start", function() {
    this.add(startText);
});
var gameScene = canvas.scenes.create("game", function() {
    this.add(scoreText).add(durationText).add(santa).add(chimney);
});
canvas.scenes.create("end", function() {
    this.add(endText);
});
canvas.scenes.load("start");

var presents = new Array();
var presentsOnScreen = 1;

canvas.bind("click", function() {
    switch (canvas.scenes.current) {
        case "end":
            duration = 30;
            durationText.text = duration;
            score = 0;
            for (var i = 0; i < presents.length; i++) {
                gameScene.remove(presents[i]);
                presents.splice(i,i+1);
            }
        case "start":
            interval = window.setInterval(function() {
                duration = duration - 1;
                durationText.text = duration;
                if (duration == 0) {
                    window.clearInterval(interval);
                    canvas.timeline.stop();
                    endText.text = "Final Score: " + score;
                    canvas.scenes.load("end", true);
                }
            }, 1000);
            canvas.scenes.load("game", true);
            canvas.timeline.start();
            break;
        case "game":
            if (presents.length < presentsOnScreen) {
                var newPresent = present.clone({
                    x: santa.x - santa.width / 2,
                    y: santa.y + santa.height
                });
                presents.push(newPresent);
                gameScene.add(newPresent);
                scoreInc = canvas.height - santa.y - chimney.height;
                scoreInc *= Math.floor(scoreInc / 100);
                console.log(scoreInc);
                console.log(Math.floor(scoreInc / 100));
            }
            break;
    }
});

canvas.setLoop(function () {
    santa.x = canvas.mouse.x;
    santa.y = Math.min(canvas.mouse.y, canvas.height * .5);

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
                gameScene.remove(presents[i]);
                presents.splice(i,i+1);
                continue;
            }

            if ((presents[i].x >= chimney.x 
                    && presents[i].x <= chimney.x + chimney.width) 
                    && (presents[i].y >= canvas.height - chimney.height
                    && (presents[i].y <= canvas.height - chimney.height * 3/4))) {
                score += scoreInc;
                gameScene.remove(presents[i]);
                presents.splice(i,i+1);
            }
        }
    }
    scoreText.text = score;
});

});
