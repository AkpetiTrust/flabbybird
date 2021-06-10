const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let gameStart = false;
let isReplaying = false;
const bird = {
  image: document.querySelector("#bird"),
  x: 20,
  y: 20,
  dy: 2,
  speed: 2,
  width: 30,
  height: 30,
  update: function () {
    if (
      (this.y < 0 && this.dy < 0) ||
      (this.y + this.height > canvas.height && this.dy > 0)
    ) {
      return;
    }
    this.y += this.dy;
  },
  moveUp: function () {
    this.dy = this.speed * -1;
  },
  moveDown: function () {
    this.dy = this.speed;
  },
};

let obstacles = [];

class Obstacle {
  constructor(x, gapStart) {
    this.gapStart = gapStart;
    this.x = x;
    this.width = 10;
    this.gap = 80;
    this.dx = -5;
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, 0, this.width, this.gapStart);
    ctx.fillRect(
      this.x,
      this.gapStart + this.gap,
      this.width,
      canvas.height - (this.gapStart + this.gap)
    );
    this.x += this.dx;
  }

  collided() {
    return (
      bird.x + bird.width >= this.x &&
      bird.x + bird.width <= this.x + this.width &&
      !(
        bird.y >= this.gapStart &&
        bird.y + bird.height <= this.gapStart + this.gap
      )
    );
  }
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBird() {
  ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
  bird.update();
}

bird.image.src = "./images/bird.png";
bird.image.addEventListener("load", drawBird);

function generateObstacle() {
  const minSpacing = 100;
  let lastX = obstacles.length ? obstacles[obstacles.length - 1].x : 100;
  let randomX = Math.floor(Math.random() * canvas.width) + lastX + minSpacing;
  let randomGapStart = Math.floor(Math.random() * (canvas.height - 120)) + 40;
  let obstacle = new Obstacle(randomX, randomGapStart);
  if (obstacles.length < 4) {
    obstacles.push(obstacle);
  }
  obstacles.forEach((obstacle, index) => {
    obstacle.draw();
    if (!gameStart) {
      obstacle.dx = 0;
    }
    if (obstacle.collided()) {
      gameStart = false;
    }
    if (obstacle.x + obstacle.width < 0) {
      // Set timeout removes glitch
      setTimeout(() => {
        obstacles.splice(index, 1);
      }, 0);
    }
  });
}

function updateGame() {
  clear();
  drawBird();
  if (!gameStart) {
    bird.dy = 0;
    bird.speed = 0;
    gameOver();
  }
  generateObstacle();
  requestAnimationFrame(updateGame);
}

document.querySelector(".start").addEventListener("click", (e) => {
  // Reset
  gameStart = true;
  bird.speed = 2;
  bird.dy = 2;
  bird.y = 20;
  obstacles = [];

  if (!isReplaying) {
    updateGame();
  }
  e.target.disabled = true;
  e.target.classList.add("disabled");

  document.addEventListener("keydown", () => {
    bird.moveUp();
  });
  document.addEventListener("keyup", () => {
    bird.moveDown();
  });
  document.addEventListener("touchstart", () => {
    bird.moveUp();
  });
  document.addEventListener("touchend", () => {
    bird.moveDown();
  });
});

function gameOver() {
  document.querySelector(".start").disabled = false;
  document.querySelector(".start").classList.remove("disabled");
  isReplaying = true;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.font = "30px Poppins";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  ctx.font = "15px Poppins";
  ctx.fillText(
    "Click the start button to play again",
    canvas.width / 2,
    canvas.height / 2 + 50
  );
}
