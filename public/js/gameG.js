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

let obstacleTimer = 0;
let nextObstacleDistance = 0;
let gameSpeed = 6;
let maxSpeed = 100;
let speedIncreaseRate = 0.001;

function setup() {
  const canvas = createCanvas(800, 300);
  canvas.parent("game-container");
  groundY = height - 50;

  dino = new Dino();

  scoreEl = document.getElementById("score");
  highScoreEl = document.getElementById("highscore");

  resetObstacleSpawn();
}

function draw() {
  background(157, 181, 192);

  // Ground
  fill(59, 85, 93);
  noStroke();
  rect(0, groundY, width, 50);

  dino.show();

  if (!gameStarted) {
    return;
  }
  if (gameOver) {
    return;
  }

  //Update the base speed, limit the maximum speed
  gameSpeed = min(gameSpeed + speedIncreaseRate, maxSpeed);

  dino.update();

  //Update obstacles
  obstacleTimer += gameSpeed;

  if (obstacleTimer > nextObstacleDistance) {
    obstacles.push(new Obstacle());
    resetObstacleSpawn();
  }

  //Update and display obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
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
      console.log("Game speed:", gameSpeed);

      return;
    }

    //Remove obstacles beyond the screen
    if (obs.x + obs.w < 0) {
      obstacles.splice(i, 1);
    }
  }

  // Score update
  function formatScore(score) {
    return score.toString().padStart(5, "0");
  }
  if (millis() - lastScoreTime > 95) {
    //every 95 milliseconds
    score += 1;
    scoreEl.innerText = formatScore(score);
    lastScoreTime = millis();
  }
  if (score > highScore) {
    highScore = score;
    highScoreEl.innerText = "HI " + highScore.toString().padStart(5, "0");
  }
}

function keyPressed() {
  if (key === " " || key === "ArrowUp") {
    if (!gameStarted) {
      gameStarted = true;
      obstacles.push(new Obstacle()); //first obstacle
      return;
    }
    if (gameOver) {
      restartGame(); //restart the game
      return;
    }
    dino.jump();
  }
}

function restartGame() {
  gameOver = false;
  score = 0;
  scoreEl.innerText = score.toString().padStart(5, "0");
  obstacles = [];
  dino = new Dino();
  gameSpeed = 6;
  resetObstacleSpawn();
  loop(); //restart draw ()
}

function resetObstacleSpawn() {
  //Smooth increase in distance using the logarithmic function
  let speedFactor = log(gameSpeed + 1);

  let minGap = 210 + speedFactor * 25;
  let maxGap = 750 + speedFactor * 25;

  //Add random coefficient to minimum and maximum distance
  let randomFactor = random(0.815, 1.311);
  nextObstacleDistance = random(minGap, maxGap) * randomFactor;

  obstacleTimer = 0;
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
    this.speed = gameSpeed;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    image(cImg, this.x, this.y, this.w, this.h);
  }
}

//Download pictures and fonts
function preload() {
  console.log("Loading images and fonts...");
  dImg = loadImage("/assets/images/dino100.png", () => {
    console.log("Dino image loaded");
  });
  cImg = loadImage("/assets/images/cactus.png", () => {
    console.log("Cactus image loaded");
  });
  fontC = loadFont("/fonts/Underdog/Underdog-Regular.ttf", () => {
    console.log("Font loaded");
  });

  window.collideRectRect = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h1 && y1 + h1 > y2;
  };
}
