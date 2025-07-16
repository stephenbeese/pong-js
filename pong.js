const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 18;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_COLOR = '#00e676';
const AI_COLOR = '#ff1744';
const BALL_COLOR = '#ffd600';
const NET_COLOR = '#555';
const PLAYER_SCORE_COLOR = '#00e676';
const AI_SCORE_COLOR = '#ff1744';

// Game state
let player = {
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  score: 0
};

let ai = {
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  score: 0
};

let ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: canvas.height / 2 - BALL_SIZE / 2,
  vx: 6 * (Math.random() > 0.5 ? 1 : -1),
  vy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

// Mouse event for player paddle
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  player.y = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle inside canvas
  player.y = Math.max(Math.min(player.y, canvas.height - PADDLE_HEIGHT), 0);
});

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 30) {
    drawRect(canvas.width / 2 - 2, i, 4, 20, NET_COLOR);
  }
}

function drawScore() {
  ctx.font = "bold 36px Arial";
  ctx.fillStyle = PLAYER_SCORE_COLOR;
  ctx.fillText(player.score, canvas.width / 2 - 80, 50);
  ctx.fillStyle = AI_SCORE_COLOR;
  ctx.fillText(ai.score, canvas.width / 2 + 60, 50);
}

function resetBall() {
  ball.x = canvas.width / 2 - BALL_SIZE / 2;
  ball.y = canvas.height / 2 - BALL_SIZE / 2;
  ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Simple AI for right paddle
function aiMove() {
  const center = ai.y + PADDLE_HEIGHT / 2;
  if (center < ball.y + BALL_SIZE / 2 - 10) {
    ai.y += 4;
  } else if (center > ball.y + BALL_SIZE / 2 + 10) {
    ai.y -= 4;
  }
  // Clamp AI paddle inside canvas
  ai.y = Math.max(Math.min(ai.y, canvas.height - PADDLE_HEIGHT), 0);
}

// Collision detection between ball and paddle
function collide(paddleX, paddleY) {
  return (
    ball.x < paddleX + PADDLE_WIDTH &&
    ball.x + BALL_SIZE > paddleX &&
    ball.y < paddleY + PADDLE_HEIGHT &&
    ball.y + BALL_SIZE > paddleY
  );
}

// Game update
function update() {
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Collision with top/bottom walls
  if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
    ball.vy = -ball.vy;
    ball.y = Math.max(0, Math.min(ball.y, canvas.height - BALL_SIZE));
  }

  // Collision with player paddle
  if (collide(PLAYER_X, player.y)) {
    ball.vx = Math.abs(ball.vx);
    // Add a bit of "spin" based on where it hit the paddle
    let hitPos = (ball.y + BALL_SIZE / 2) - (player.y + PADDLE_HEIGHT / 2);
    ball.vy = hitPos * 0.2;
  }
  // Collision with AI paddle
  if (collide(AI_X, ai.y)) {
    ball.vx = -Math.abs(ball.vx);
    let hitPos = (ball.y + BALL_SIZE / 2) - (ai.y + PADDLE_HEIGHT / 2);
    ball.vy = hitPos * 0.2;
  }

  // Score detection
  if (ball.x < 0) {
    ai.score++;
    resetBall();
  } else if (ball.x + BALL_SIZE > canvas.width) {
    player.score++;
    resetBall();
  }

  aiMove();
}

// Game render
function render() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawNet();
  drawScore();

  // Draw paddles
  drawRect(PLAYER_X, player.y, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
  drawRect(AI_X, ai.y, PADDLE_WIDTH, PADDLE_HEIGHT, AI_COLOR);

  // Draw ball
  drawBall(ball.x, ball.y, BALL_SIZE, BALL_COLOR);
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();