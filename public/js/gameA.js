if (!isAuthenticated()) {
  alert("You must be logged in to play this mode.");
  window.location.href = "login.html";
}

fetch("http://localhost:5000/api/score", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json"
  }
})
  .then((res) => {
    if (res.status === 403) {
      alert("Session expired. Please log in again.");
      window.location.href = "login.html";
      throw new Error("Unauthorized");
    }
    return res.json();
  })
  .then((data) => {
    document.getElementById("highScoreDisplay").innerText =
      "HI " + data.high_score.toString().padStart(5, "0");
    highScore = data.high_score;
  })
  .catch((err) => {
    console.error("Failed to load score", err);
    alert("Failed to load your score. Please log in again.");
    window.location.href = "login.html";
  });

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
  highScoreEl = document.getElementById("highScoreDisplay");

  resetObstacleSpawn();
}

function draw() {
  background(157, 181, 192);

  //ground
  fill(59, 85, 93);
  noStroke();
  rect(0, groundY, width, 50);

  dino.show();

  if (!gameStarted || gameOver) {
    return;
  }
  //update the base speed
  gameSpeed = min(gameSpeed + speedIncreaseRate, maxSpeed);
  dino.update();

  //update and display obstacles
  obstacleTimer += gameSpeed;

  if (obstacleTimer > nextObstacleDistance) {
    obstacles.push(new Obstacle());
    resetObstacleSpawn();
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.update();
    obs.show();

    if (dino.hits(obs)) {
      gameOver = true;
      noLoop();
      console.log("Game Over");

      if (score > highScore) {
        highScore = score;
      }

      endGame(highScore);

      fill(59, 85, 93);
      textAlign(CENTER);
      textSize(34);
      textFont("underdog");
      text("GAME OVER", width / 2, height / 2);
      fill(0);
      text("GAME OVER", width / 2 - 2, height / 2 - 2);
      text("GAME OVER", width / 2 + 2, height / 2 + 2);
      return;
    }
    //remove obstacles beyond the screen
    if (obs.x + obs.w < 0) {
      obstacles.splice(i, 1);
    }
  }
  //score update
  if (millis() - lastScoreTime > 95) {
    //every 95 milliseconds
    score += 1;
    scoreEl.innerText = score.toString().padStart(5, "0");
    lastScoreTime = millis();
  }
}

function endGame(finalScore) {
  gameOver = true;
  console.log("Sending score:", finalScore);

  fetch("http://localhost:5000/api/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ score: finalScore })
  })
    .then((res) => {
      if (res.status === 403) {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then(() =>
      fetch("http://localhost:5000/api/score", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      })
    )
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("highScoreDisplay").innerText =
        "HI " + data.high_score.toString().padStart(5, "0");
    })
    .catch((err) => {
      console.error("Failed to send or fetch score", err);
      alert("Failed to save or reload your score.");
    });
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
  //smooth increase in distance using the logarithmic function
  let speedFactor = log(gameSpeed + 1);

  let minGap = 210 + speedFactor * 25;
  let maxGap = 750 + speedFactor * 25;

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
//download pictures and fonts
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
