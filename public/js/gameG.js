let dino;
let gravity = 1.1;
let jumpForce = -18.5;
let groundY;
let obstacles = [];
let score = 0;
let scoreEl;
let dImg;
let cImg;
let gameStarted = false;
let fontC;
let gameOver = false;

function setup() {
  const canvas = createCanvas(800, 300);
  canvas.parent("game-container");
  groundY = height - 50;

  dino = new Dino();

  obstacles.push(new Obstacle());

  scoreEl = document.getElementById("score");
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
    }
  }

  // Score update
  score += 1;
  scoreEl.innerText = score;
}
function keyPressed() {
  if (key === " " || key === "ArrowUp") {
    if (!gameStarted) {
      gameStarted = true;
      obstacles.push(new Obstacle()); // перша перешкода
      return;
    }
    if (gameOver) {
      restartGame(); // Якщо гра закінчена, перезапускаємо її
      return;
    }
    dino.jump();
  }
}
function restartGame() {
  // Скидаємо все і починаємо нову гру
  gameOver = false;
  score = 0;
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
      this.x,
      this.y,
      this.r,
      this.r,
      obstacle.x,
      obstacle.y,
      obstacle.w,
      obstacle.h
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
