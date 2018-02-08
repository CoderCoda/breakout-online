/* Mitchell Li */

var canvas = document.getElementById("gui");
var context = canvas.getContext("2d");

/*
DRAWING FUNCTIONS
Ball, Paddle, Bricks
Score, Lives, etc.
*/
// BALL
var x = canvas.width/2;
var y = canvas.height-40;
var dx = 2;
var dy = -2;
var radius = 5;
function drawBall() {
	context.beginPath();
	context.arc(x,y,radius,0,Math.PI*2);
	context.fillStyle = "white";
	context.fill();
	context.closePath();
}

// PADDLE
var paddleHeight = 5;
var paddleWidth = 50;
var paddleX = (canvas.width-paddleWidth)/2; //starts in the middle
var paddleY = canvas.height-20;
function drawPaddle() {
	context.beginPath();
	context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	context.fillStyle = "white";
	context.fill();
	context.closePath();
}

// BRICKS BRICKS BRICKS
var rows = 5;
var columns = 10;
var brickWidth = 42.5;
var brickHeight = 10;
var brickSpacing = 5;
var brickTopMargin = 30;
var brickLeftMargin = 5;
var colors = ["red", "orange", "yellow", "green", "blue"];

var bricks = []; // initialize brick array
for (var c=0; c<columns; c++){
	bricks[c] = [];
	for (var r=0; r<rows; r++){
		bricks[c][r] = {x:0, y:0, status:1} // status=0 indicates brick has been hit
	}
}

function drawBricks() {
	for (var c=0; c<columns; c++){
		for (var r=0; r<rows; r++){
			if (bricks[c][r].status===1){ // draw if it hasn't been hit
				var brickX = (c*(brickWidth+brickSpacing))+brickLeftMargin;
				var brickY = (r*(brickHeight+brickSpacing))+brickTopMargin;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				context.beginPath();
				context.rect(brickX,brickY,brickWidth,brickHeight);
				context.fillStyle = colors[r];
				context.fill();
				context.closePath();
			}
		}
	}
}

// SCORE & LIVES
var score = 0;
function drawScore() {
	context.font = "12px Arial";
	context.fillStyle = "white";
	context.fillText("SCORE  "+score,8,20);
}

var lives = 3;
function drawLives() {
	context.font = "12px Arial";
	context.fillStyle = "white";
	context.fillText("LIVES  "+lives,canvas.width-55,20);
}

// TITLE SCREEN
function drawTitle() {
	context.font = "18px Arial";
	context.fillStyle = "white";
	context.fillText("PRESS SPACE TO START",canvas.width/2-110,canvas.height/2+10);
}


// Making the game run
var rightDown = false; // right arrow key
var leftDown = false; // left arrow key
var spaceDown = false; // start game when true
var infiniteLives = false;
function draw() {
	if (!spaceDown){
		context.clearRect(0,0,canvas.width,canvas.height);
		drawBall();
		drawPaddle();
		drawBricks();
		drawScore();
		drawTitle();
		if (!infiniteLives){
			drawLives();
		}
	}
	if (spaceDown){
		context.clearRect(0,0,canvas.width,canvas.height); // clear "trail"
		drawBall();
		drawPaddle();
		drawBricks();
		drawScore();
		if (!infiniteLives){	
			drawLives();
		}
		collisionDetection();
		
		if (x+dx<radius || x+dx>canvas.width-radius){ // bounce off side
			dx = -dx;
		}
		if (y+dy<radius){ // bounce off top
			dy = -dy;
		}
		else if (y+dy>canvas.height+radius){ // ball hit bottom
			if (!infiniteLives){
				lives--;
			}
			if (!lives){ // out of lives
				alert("GAME OVER");
				document.location.reload();
			} else { // reset ball and paddle positions
				x = canvas.width/2;
				y = canvas.height - 30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
		else if (x>paddleX && x<paddleX+paddleWidth && y+dy>paddleY-radius && y+dy<paddleY+paddleHeight-radius){ // bounce off paddle
			dy = -dy;
		}

		if (rightDown && paddleX<canvas.width-paddleWidth) {
			paddleX += 5;
		}
		else if (leftDown && paddleX>0) {
			paddleX -= 5;
		}
		x += dx;
		y += dy;
	}
}


/*
CONTROLS AND COLLISIONS
Event handlers
Collision detection
*/
// CONTROLS
document.getElementById("enter").addEventListener("click", cheatCode, false);
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

function keyDown(e) {
	if (e.keyCode === 32) {
		spaceDown = true;
	}
	if (e.keyCode === 39) {
		rightDown = true;
	} else if (e.keyCode === 37) {
		leftDown = true;
	}
}

function keyUp(e) {
	if (e.keyCode === 39) {
		rightDown = false;
	} else if (e.keyCode === 37) {
		leftDown = false;
	}
}

// COLLISIONS
function collisionDetection() {
	for (var c=0; c<columns; c++){
		for (var r=0; r<rows; r++){
			var b = bricks[c][r];
			if (b.status===1){ // brick hasn't been hit
				if (x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
					dy = -dy;
					b.status = 0;
					score++;
					if (score===rows*columns) {
						drawTitle();
						alert("WINNER WINNER CHICKEN DINNER");
						document.location.reload();
					}
				}
			}
		}
	}
}

function cheatCode(e) {
	var cheat = document.getElementById("entry").value;
	if (cheat==="sizematters") {
		paddleWidth = paddleWidth*2;
		paddleX = (canvas.width-paddleWidth)/2;
	}
	if (cheat==="toinfinityandbeyond") {
		infiniteLives = true;
	}
	document.getElementById("entry").value = "";
}


// START GAME
setInterval(draw, 10);