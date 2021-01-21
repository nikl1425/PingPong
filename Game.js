
var canvas;
var canvasContext;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showingWinScreen = false;

var ball = {
    X : 50,
    Y : 50,
    speedX : 10,
    speedY : 2
}

var player = {
    paddle1Y : 250,
    paddleWidth : 10,
    paddleHeight : 100
}

var enemy = {
    paddle2Y : 400,
    paddleWidth : 10,
    paddleHeight : 100
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    }
}

function handleMouseClick(evt){
    if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    // all programming languages have this function, slows down the program. 
    var framePerSecond = 30;
    setInterval(function(){
        movement();
        draw();
    }, 1000 / framePerSecond)

    canvas.addEventListener('mousemove',
    function(evt){
        var mousePos = calculateMousePos(evt);
        player.paddle1Y = mousePos.y-player.paddleHeight/2
    });
    console.log(mousePos.y)

    canvas.addEventListener('mousedown', handleMouseClick);
    
}

function ballReset(){

    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
    }

    ball.X = canvas.width / 2;
    ball.Y = canvas.height / 2;
}

function movement(){
    ball.X += ball.speedX;
    ball.Y += ball.speedY;

    if(showingWinScreen == true){
        return;
    }

    computerMovement();

    if(ball.X > canvas.width){
        if(ball.Y > enemy.paddle2Y && ball.Y < enemy.paddle2Y+enemy.paddleHeight){
            ball.speedX = -ball.speedX
            var deltaY = ball.Y - (enemy.paddle2Y + enemy.paddleHeight/2);
            ball.speedY = deltaY * 0.1;
        } else {
            player1Score += 1;
            ballReset();
        }
    }
    if(ball.X < 0){
        if(ball.Y > player.paddle1Y && ball.Y < player.paddle1Y + player.paddleHeight){
            ball.speedX = -ball.speedX

            var deltaY = ball.Y - (player.paddle1Y + player.paddleHeight/2);
            ball.speedY = deltaY * 0.35;
        } else {
            player2Score += 1;
            ballReset();
        }
        
    }
    if(ball.Y > canvas.height){
        ball.speedY = -ball.speedY
    }
    if(ball.Y < 0){
        ball.speedY = -ball.speedY
    }
}

function drawNet(){
    for(var i=0; i<canvas.height; i+=40){
        rectConstructor(canvas.width/2-1, i,2,20,'white')
    }
}

function draw(){

    
    
    // Canvas
    console.log("Call: draw()");
    rectConstructor(0,0,canvas.width, canvas.height, 'black')

    // left player paddle
    rectConstructor(5,player.paddle1Y,player.paddleWidth,player.paddleHeight,'white');

    // right player paddle
    rectConstructor(canvas.width-15, enemy.paddle2Y, enemy.paddleWidth, enemy.paddleHeight, 'red')

    // Ball
    colorCircle(ball.X, ball.Y, 10, 'blue');

    // score
    canvasContext.fillStyle = 'white'
    canvasContext.fillText(player1Score, 100,100);
    canvasContext.fillText(player2Score, canvas.width-100,100);

    drawNet();

    if(showingWinScreen){
        canvasContext.fillText("click to continue",300,300)

        if(player2Score >= WINNING_SCORE){
            canvasContext.fillText("right player won!");
        } else if(player1Score >= WINNING_SCORE){
            canvasContext.fillText("left player won!")
        }
        return;
    }
}

// make functions always
// rect function
function rectConstructor(leftX, topY, width, height, color){
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}

// circle function
function colorCircle(centerX, centerY, radius, color){
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY,radius,0,Math.PI*2,true);
    canvasContext.fill();
}

function computerMovement(){
    if(enemy.paddle2Y < ball.Y - enemy.paddleHeight/2){
        enemy.paddle2Y += 5;
    } else {
        enemy.paddle2Y -= 3;
    }
}