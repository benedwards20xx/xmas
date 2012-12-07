var canvas = document.getElementsByTagName('canvas')[0];
var context = canvas.getContext('2d');

//var WIDTH = canvas.width;
//var HEIGHT = canvas.height;
var WIDTH = 300;
var HEIGHT = 600;

var BLOCK_WIDTH = WIDTH / NUM_COLS;
var BLOCK_HEIGHT = HEIGHT / NUM_ROWS;

function drawBlock(x, y) {
    context.fillRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
    context.strokeRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
}

function render() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.strokeStyle = 'black';
    for (var x = 0; x < NUM_COLS; x++ ) {
        for (var y = 0; y < NUM_ROWS; y++ ) {
            if (grid[y][x]) {
                context.fillStyle = colors[grid[y][x] - 1];
                drawBlock(x, y);
            }
        }
    }

    context.fillStyle = 'blue';
    context.strokeStyle = 'black';
    for (var y = 0; y < 4; y++ ) {
        for (var x = 0; x < 4; x++ ) {
            if (curBlock[y][x]) {
                context.fillStyle = colors[curBlock[y][x] - 1];
                drawBlock(curX + x, curY + y);
            }
        }
    }
}

setInterval(render, 30);