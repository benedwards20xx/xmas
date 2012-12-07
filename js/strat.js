oCanvas.domReady(function () {
    var canvas = oCanvas.create({
        canvas: "#canvas",
        background: "#ccc",
        fps: 60
    });

    var W = canvas.width;
    var H = canvas.height;
    var EDGE_RESTRICT = 60;

    // blue, red, green, grey
    var playerColors = [ '#00f', 'f00', '#0f0', '#888' ];

    var players = [];

    var baseText = canvas.display.text({
            font: '12px sans-serif',
            fill: '#000'
    });

    //var bases = [];
    var base = canvas.display.arc({
        radius: 20,
        start: 0,
        end: 360,
        stroke: '2px #000',
        numUnits: 1,
        unitRate: 1,
        maxUnitsPerBase: 25
    });

    var selectedBase;

    function player(color, score) {
        this.color = color;
        this.score = 0;
        this.bases = [];
        //for (var i = 0; i < numBases; i++) {
            //var randX = Math.floor(Math.random() * (W - EDGE_RESTRICT * 2));
            //var randY = Math.floor(Math.random() * (H - EDGE_RESTRICT * 2));
            //var baseX = randX + EDGE_RESTRICT;
            //var baseY = randY + EDGE_RESTRICT;
            //this.bases[i] = base.clone();
            //    x: baseX,
            //    y: baseY,
            //    fill: this.color,
            //    unitRate: this.parent.unitRate,
            //    numUnits: 25,
            //    unitRate: this.unitRate,
            //    maxUnitsPerBase: 50 / this.unitRate
            //});
            //this.bases[i].addChild(baseText.clone({
            //    x: -5,
            //    y: 22,
            //    text: this.bases[i].numUnits
            //}));
            //canvas.addChild(this.bases[i]);
        //}
    }

    function newBaseBasic(tX, tY, color) {
        var rBase = base.clone({
            x: tX,
            y: tY,
            fill: color
        });
        rBase.addChild(baseText.clone({
            x: -5,
            y: 22,
            text: rBase.numUnits
        }));
        canvas.addChild(rBase);
        return rBase;
    }

    function newBase(tX, tY, color, unitRate, maxUnitsPerBase) {
        var rBase = base.clone({
            x: tX,
            y: tY,
            fill: color,
            unitRate: unitRate,
            maxUnitsPerBase: maxUnitsPerBase
        });
        rBase.addChild(baseText.clone({
            x: -5,
            y: 22,
            text: rBase.numUnits
        }));
        canvas.addChild(rBase);
        return rBase;
    }

    function exampleLevel() {
        players[0] = new player(playerColors[0], 0);
        players[0].bases.push(newBase(W/4, H/2, players[0].color, 1, 50));
        players[1] = new player(playerColors[3], 0);
        players[1].bases.push(newBaseBasic(W*3/4, H/4, players[1].color));
        players[1].bases.push(newBaseBasic(W*3/4, H*3/4, players[1].color));
        //players[2] = new player(3, playerColors[2], 2, 0);
    }

    function setupBaseMouseFunctionality() {
        for (var i = 0; i < players.length; i++) {
            if (i == 0) {
                for (var j = 0; j < players[i].bases.length; j++) {
                    players[i].bases[j].bind('click', function() {
                        this.stroke = '2px #fff',
                        selectedBase = this
                    });
                }
            }
            else {
                //if (selectedBase) {
                    for (var j = 0; j < players[i].bases.length; j++) {
                        players[i].bases[j].bind('click', function() {
                            var numUnitsSent = selectedBase.numUnits / 2;
                            selectedBase.numUnits -= Math.round(numUnitsSent),
                            selectedBase.children[0].text = selectedBase.numUnits,
                            selectedBase.stroke = '2px #000',
                            this.numUnits -= Math.round(numUnitsSent),
                            this.children[0].text = this.numUnits,
                            this.numUnits <= 0 ? this.remove() : this.children[0].text = this.numUnits,
                            selectedBase = undefined
                        });
                    }
                //}
            } 
        }
    }

    exampleLevel();

    setupBaseMouseFunctionality();

    canvas.setLoop(function () {
        for (var i = 0; i < players.length; i++) {
            for (var j = 0; j < players[i].bases.length; j++) {
                var tBase = players[i].bases[j];
                if (canvas.timeline.currentFrame % (tBase.unitRate * 60) == 0) {
                    if (tBase.numUnits < tBase.maxUnitsPerBase) {
                        tBase.numUnits++;
                        tBase.children[0].text = tBase.numUnits;  
                    } 
                }
            //setInterval(baseLoop(tBase), 100000);
            ////canvas.setLoop(baseLoop(tBase));
            }
        }
    }).start();
    //            var tBase = players[i].bases[j];
    //            tBase.numUnits++;
    //            tBase.children[0].text = tBase.numUnits * players[i].unitRate;
    //        }
    //    }
        //for each(players) {

        //}
        //players[0].bases[0].numUnits++;
        //players[0].bases[0].children[0].text = players[0].bases[0].numUnits;
    //}).start();
});

/*
var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var context = canvas.getContext( '2d' );
var loop;

var W = canvas.width, H = canvas.height;
var EDGE_RESTRICT = 60;

//for mouse drag functionality
var drag = false;
//var mouseX, mouseY;
var clickX, clickY;
//mouseX = W / 2;
//mouseY = H / 2;
var mouseBase;
var mousePlayerNum;

var startUnits = 10;
var playerColors = [ "blue", "red", 'green', 'orange' ];
var maxUnitsPerBase = 50;

//object for each player base, should be in order of players, 
//ie. first in array is player 1, second is player 2, etc.
var players = [];
var baseRadius = 20;

function base(units, maxUnits, x, y, color) {
    this.units = units;
    this.maxUnits = maxUnits;
    this.x = x;
    this.y = y;
    this.color = color;
}

function player(numBases, color, unitRate, score) {
    this.numBases = numBases;
    this.color = color;
    this.bases = [numBases];
    this.unitRate = unitRate;
    this.score = 0;
    for (var i = 0; i < numBases; i++) {
        var randX = Math.floor(Math.random() * (W - EDGE_RESTRICT * 2));
        var randY = Math.floor(Math.random() * (H - EDGE_RESTRICT * 2));
        var baseX = randX + EDGE_RESTRICT;
        var baseY = randY + EDGE_RESTRICT;
        this.bases[i] = new base(startUnits * unitRate, maxUnitsPerBase * unitRate, baseX, baseY, this.color);
    }
    //setupBases(this.bases);
}

function drawCircle(x, y, inColor, outColor) {
    context.fillStyle = inColor;
    context.lineWidth = '5';
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(x, y, baseRadius, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
    context.fill();
}

function setupPlayerBases() {
    console.log('setupPlayerBases');

    for (var i = 0; i < players.length; i++) {
        for (var j = 0; j < players[i].bases.length; j++) {
            var tBase = players[i].bases[j];
            drawCircle(tBase.x, tBase.y, tBase.color, tBase.color);
            
            context.font = '12pt Helvetica';
            context.fillText(tBase.units, tBase.x - 7, tBase.y + 40);
        }
    }
}

function drawBases() {
    console.log('drawBases');
    for (var i = 0; i < players.length; i++) {
        for (var j = 0; j < players[i].bases.length; j++) {
            var tBase = players[i].bases[j];
            drawCircle(tBase.x, tBase.y, tBase.color, tBase.color);
            
            context.font = '12pt Helvetica';
            context.fillStyle = tBase.color;
            context.fillText(tBase.units, tBase.x - 7, tBase.y + 40);
        }
    }
}

function exampleLevel() {
    players[0] = new player(1, playerColors[0], 1, 0);
    players[1] = new player(2, playerColors[1], 0.5, 0);
    players[2] = new player(3, playerColors[2], 2, 0);
}

function game() {
    //drawBackground();
    context.clearRect(0, 0, W, H);

    context.save();

    exampleLevel();

    setupPlayerBases();

    context.restore();
}

function drawLoop() {
    context.clearRect(0, 0, W, H);
    drawBases();
}

function gameLoop() {
    for (var i = 0; i < players.length; i++) {
        for (var j = 0; j < players[i].bases.length; j++) {
            var tBase = players[i].bases[j];
            if (tBase.units < tBase.maxUnits) {
                tBase.units++;
            } 
        }
    }
}

function windowToCanvas(canvas, x, y) {
    var box = canvas.getBoundingClientRect();
    return { x: x - box.left * (canvas.width / box.width), 
             y: y - box.top  * (canvas.height / box.height)
           };
}

canvas.addEventListener('mousedown', function (e) {
    // react to mouse down
    for (var i = 0; i < players.length; i++) {
        if (!drag) {
            for (var j = 0; j < players[i].bases.length; j++) {
                var tBase = players[i].bases[j];
                var dx, dy, dist;
                dx = e.pageX - this.offsetLeft - tBase.x;
                dy = e.pageY - this.offsetTop  - tBase.y;
                dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < baseRadius) {
                    drag = true;
                    mouseBase = tBase;
                    mousePlayerNum = i;
                    clickX = dx;
                    clickY = dy;
                    break;
                } 
                else {
                    drag = false;
                }
            }
        }
    }
});

canvas.addEventListener('mouseup', function (e) {
    // react to mouse up    
    //var loc = windowToCanvas(canvas, e.clientX, e.clientY);
    if (drag) {
        for (var i = 0; i < players.length; i++) {
            for (var j = 0; j < players[i].bases.length; j++) {
                var tBase = players[i].bases[j];
                var dx, dy, dist;
                dx = e.pageX - this.offsetLeft - tBase.x;
                dy = e.pageY - this.offsetTop  - tBase.y;
                dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < baseRadius && tBase != mouseBase && i != mousePlayerNum) {
                    var numUnitsSent = mouseBase.units / 2;
                    mouseBase.units -= Math.round(numUnitsSent);
                    tBase.units -= Math.round(numUnitsSent);
                } 
                //else {
                    //var numUnitsSent = 2;
                    //tBase.units -= Math.round(numUnitsSent);
                //}
            }
        }
    }
    drag = false;
});

//canvas.addEventListener('mousemove', function (event) {
//    if(drag) {
//        x = event.pageX - this.offsetLeft - clickX;
//        y = event.pageY - this.offsetTop - clickY;
//        draw();
//   }
//});

game();
setInterval(drawLoop, 100);
setInterval(gameLoop, 1000);
*/