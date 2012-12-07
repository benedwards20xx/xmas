// single block has size: width == 30 pxl, height == 30 pxl
var NUM_COLS = 10;
var NUM_ROWS = 20;

// grid defined x by y, aka col by row
var grid = [];

var curBlock;
var curX;
var curY;

var blocks = [
    [1, 1, 1, 1],
    [1, 1, 0, 0, 
     1, 1],
    [0, 1, 0, 0, 
     1, 1, 1],
    [0, 1, 1, 0, 
     1, 1],
    [1, 1, 0, 0, 
     0, 1, 1],
    [1, 1, 1, 0, 
     0, 0, 1]
    [1, 1, 1, 0, 
     1]
];

var colors = [
	'cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange'
];

function newBlock() {
    var num = Math.floor(Math.random() * blocks.length );
    var block = blocks[num];

    curBlock = [];
    for (var y = 0; y < 4; ++y) {
        curBlock[y] = [];
        for (var x = 0; x < 4; ++x) {
            var t = 4 * y + x;
            if (typeof block[t] != 'undefined' && block[t]) {
                curBlock[y][x] = num + 1;
            } else {
                curBlock[y][x] = 0;
            }
        }
    }
    curX = 5;
    curY = 0;
}

function init() {
    for (var y = 0; y < NUM_ROWS; ++y ) {
        grid[y] = [];
        for (var x = 0; x < NUM_COLS; ++x ) {
            grid[y][x] = 0;
        }
    }
}

function tick() {
    if ( valid(0, 1) ) {
        ++curY;
    } else {
        freeze();
        clearLines();
        newBlock();
    }
}

function freeze() {
    for (var y = 0; y < 4; ++y ) {
        for (var x = 0; x < 4; ++x ) {
            if (curBlock[y][x]) {
                grid[y + curY][x + curX] = curBlock[y][x];
            }
        }
    }
}

function clearLines() {
    for (var y = NUM_ROWS - 1; y >= 0; --y) {
        var thisRow = true;
        for (var x = 0; x < NUM_COLS; ++x) {
            if (grid[y][x] == 0) {
                thisRow = false;
                break;
            }
        }
        if (thisRow) {
            for (var newY = y; newY > 0; --newY) {
                for (var x = 0; x < NUM_COLS; ++x) {
                    grid[newY][x] = grid[newY - 1][x];
                }
            }
            ++y;
        }
    }
}

function valid(offsetX, offsetY, newCurBlock) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = curX + offsetX;
    offsetY = curY + offsetY;
    newCurBlock = newCurBlock || curBlock;

    for (var y = 0; y < 4; ++y ) {
        for (var x = 0; x < 4; ++x ) {
            if (newCurBlock[y][x]) {
                if ( typeof grid[y + offsetY] == 'undefined' 
                    || typeof grid[y + offsetY][x + offsetX] == 'undefined' 
                    || grid[y + offsetY][x + offsetX] 
                    || x + offsetX < 0 
                    || y + offsetY >= NUM_ROWS 
                    || x + offsetX >= NUM_COLS) {
                        return false;
                }
            }
        }
    }
    return true;
}

function doKeyPress(event) {
    switch (event.keyCode) {
        case 37: //left
            if (valid(-1)) {
                --curX;
            }
            break;
        case 39: //right
            if (valid(1)) {
                ++curX;
            }
            break;
        case 40: //down
            if (valid(0, 1)) {
                ++curY;
            }
            break;
        case 38: //up
            var rotated = rotate(curBlock);
            if (valid(0, 0, rotated)) {
                curBlock = rotated;
            }
            break;
    }
}

function rotate(curBlock) {
    var newCurBlock = [];
    for (var y = 0; y < 4; ++y) {
        newCurBlock[y] = [];
        for (var x = 0; x < 4; ++x) {
            newCurBlock[y][x] = curBlock[3 - x][y];
        }
    }
    return newCurBlock;
}


init();
window.addEventListener('keydown',doKeyPress,true);
newBlock();
setInterval(tick, 250);