let dino;
let gravity = 1.1;
let jumpForce = -18.5;
let groundY;
let obstacles = [];

let score = 0;
let scoreEl;
let highScore = 0;
let highScoreEl;

let dImg;
let cImg;
let fontC;

let gameStarted = false;
let gameOver = false;
let lastScoreTime = 0;

function setup() {
  const canvas = createCanvas(800, 300);
  canvas.parent("game-container");
  groundY = height - 50;

  dino = new Dino();

  obstacles.push(new Obstacle());

  scoreEl = document.getElementById("score");
  highScoreEl = document.getElementById("highscore");
}

function draw() {
  background(157, 181, 192);

  // Ground
  fill(59, 85, 93);
  noStroke();
  rect(0, groundY, width, 50);
  dino.show();
  // Dino

  if (!gameStarted) {
    return;
  }
  if (gameOver) {
    return;
  }
  dino.update();

  // Obstacles
  if (frameCount % 90 === 0) {
    obstacles.push(new Obstacle());
  }

  for (let obs of obstacles) {
    obs.update();
    obs.show();

    if (dino.hits(obs)) {
      gameOver = true;
      noLoop();
      console.log("Game Over");

      fill(59, 85, 93);
      textAlign(CENTER);
      textSize(34);
      textFont("underdog");
      text("GAME OVER", width / 2, height / 2);
      fill(0);
      text("GAME OVER", width / 2 - 2, height / 2 - 2);
      text("GAME OVER", width / 2 + 2, height / 2 + 2);
      if (score > highScore) {
        highScore = score;
        highScoreEl.innerText = "HI " + highScore.toString().padStart(5, "0");
      }
      return;
    }
  }

  // Score update

  function formatScore(score) {
    return score.toString().padStart(5, "0");
  }
  if (millis() - lastScoreTime > 95) {
    //every 100 ms
    score += 1;
    scoreEl.innerText = formatScore(score);
    lastScoreTime = millis();
  }
}
function keyPressed() {
  if (key === " " || key === "ArrowUp") {
    if (!gameStarted) {
      gameStarted = true;
      obstacles.push(new Obstacle()); // the first obstacle
      return;
    }
    if (gameOver) {
      restartGame(); // If the game is over, restart it
      return;
    }
    dino.jump();
  }
}
function restartGame() {
  // Скидаємо все і починаємо нову гру
  gameOver = false;
  score = 0;
  scoreEl.innerText = score.toString().padStart(5, "0");
  obstacles = [];
  dino = new Dino();
  loop(); // Поновлюємо гру
}
class Dino {
  constructor() {
    this.r = 58;
    this.h = 60;
    this.x = 50;
    this.y = groundY - this.r;
    this.vy = 0;
    this.isJumping = false;
  }

  jump() {
    if (!this.isJumping) {
      this.vy = jumpForce;
      this.isJumping = true;
    }
  }

  update() {
    this.vy += gravity;
    this.y += this.vy;

    if (this.y >= groundY - this.r) {
      this.y = groundY - this.r;
      this.vy = 0;
      this.isJumping = false;
    }
  }

  show() {
    image(dImg, this.x, this.y, this.r, this.h);
  }

  hits(obstacle) {
    return collideRectRect(
      this.x + 10,
      this.y + 10,
      this.r - 20,
      this.h - 20,
      obstacle.x + 5,
      obstacle.y + 5,
      obstacle.w - 10,
      obstacle.h - 10
    );
  }
}
class Obstacle {
  constructor() {
    this.w = 42;
    this.h = 58;
    this.x = width;
    this.y = groundY - this.h + 3;
    this.speed = 6;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    image(cImg, this.x, this.y, this.w, this.h);
  }
}

// Add collision library
function preload() {
  dImg = loadImage("/public/assets/images/dino100.png");
  cImg = loadImage("/public/assets/images/cactus.png");
  fontC = loadFont("/public/fonts/Underdog/Underdog-Regular.ttf");
  // p5 doesn't have built-in rect collision like this, so we'll use this quick hack:
  window.collideRectRect = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  };
}
