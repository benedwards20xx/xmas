oCanvas.domReady(function () {
var canvas = oCanvas.create({
    canvas: "#canvas",
    background: "#000",
    fps: 60
});

var santa = canvas.display.image({
    image: "img/santaman.png",
    width: 60,
    height: 80,
    origin: { x: "center", y: "center" }
});

var house = canvas.display.image({
    image: "img/roof.png",
    origin: { x: "left", y: "bottom" },
    width: 300,
    height: 100,
    x: canvas.width,
    y: canvas.height
});

var chimney = canvas.display.image({
    image: "img/chimney1.png",
    origin: { x: "left", y: "bottom" },
    width: 60,
    height: 200,
    x: house.x + house.width,
    y: canvas.height,
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
    height: 30,
    origin: { x: "center", y: "center" },
    rotatingDirection: 0
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

var snowflake = canvas.display.rectangle({
    width: 1,
    height: 1,
    fill: "#fff"
});
var snowflakes = new Array();

canvas.scenes.create("start", function() {
    this.add(startText);
});
var gameScene = canvas.scenes.create("game", function() {
    this.add(scoreText).add(durationText).add(santa).add(house).add(chimney);
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
                    y: santa.y + santa.height,
                    rotatingDirection: Math.round(Math.random() * 6) - 3
                });
                //console.log(newPresent.rotatingDirection);
                presents.push(newPresent);
                gameScene.remove(chimney);
                gameScene.add(newPresent);
                // newPresent.fadeIn("long", "ease-in-out-cubic", function () {
                //     canvas.redraw();
                // });
                gameScene.add(chimney);
                scoreInc = canvas.height - santa.y - chimney.height;
                scoreInc *= Math.floor(scoreInc / 100);
            }
            break;
    }
});

canvas.setLoop(function () {
    santa.x = canvas.mouse.x;
    santa.y = Math.min(canvas.mouse.y, canvas.height * .5);

    if (house.x > -house.width) {
        house.x-=2;
    } else {
        house.moveTo(canvas.width, canvas.height);
    }
    
    if (chimney.x > -chimney.width) {
        chimney.x-=2;
    } else {
        chimney.moveTo(house.x + house.width, canvas.height);
    }

    if (presents.length > 0) {
        for (var i = 0; i < presents.length; i++) {
            if (presents[i].y <= canvas.height) {
                presents[i].y+=2;    
                presents[i].rotation+=presents[i].rotatingDirection;
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

    switch (canvas.scenes.current) {
        case "game":
        // var randomSnowX = Math.round(Math.random() * canvas.width * 2);
        // if (randomSnowX % 10 === 0) {
        //     //console.log(randomSnowX);
        //     var newSnowflake = snowflake.clone({
        //         x: randomSnowX,
        //         y: 0
        //     });
        //     gameScene.add(newSnowflake);
        //     // snowflakes.push(newSnowflake);
        //     newSnowflake.animate({
        //         x: newSnowflake.x - canvas.width,
        //         y: canvas.height
        //     }, {
        //         duration: "long",
        //         callback: moveTo(newSnowflake.x - canvas.width, canvas.height)
        //     });
        //     // gameScene.remove(newSnowflake);
        //     newSnowflake.destroy();
        // }
        break;
    }

    // for (var i = 0; i < snowflakes.length; i++) {
    //     snowflakes[i].x--;
    //     snowflakes[i].y++;
    //     if (snowflakes[i].x < 0) {
    //         gameScene.remove(snowflakes[i]);
    //         snowflakes.splice(i,i+1);
    //         console.log('a');
    //     }
        // if (snowflakes[i].x > 0 || snowflakes[i].y < canvas.height) {
        //     snowflakes[i].x--;
        //     snowflakes[i].y++;
        //     console.log('b');
        // } else {
        //     gameScene.remove(snowflakes[i]);
        //     snowflakes.splice(i,i+1);
        //     console.log('a');
        // }
    // }

    scoreText.text = score;
});

});
