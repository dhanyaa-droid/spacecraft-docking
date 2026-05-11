const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

// FULLSCREEN CANVAS

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// HUD ELEMENTS

const velocityText =
  document.getElementById("velocity");

const rotationText =
  document.getElementById("rotation");

const fuelText =
  document.getElementById("fuel");

const statusText =
  document.getElementById("status");

const restartBtn =
  document.getElementById("restartBtn");

// SPACECRAFT

const ship = {

  x: 300,
  y: canvas.height / 2,

  angle: 0,

  velocityX: 0,
  velocityY: 0,

  rotationSpeed: 0.05,

  thrust: 0.05,

  fuel: 100
};

// DOCKING STATION

const station = {

  x: canvas.width - 200,

  y: canvas.height / 2 - 40,

  width: 80,
  height: 80
};

// KEYBOARD CONTROLS

const keys = {};

window.addEventListener("keydown", (e) => {

  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {

  keys[e.key.toLowerCase()] = false;
});

// DRAW SPACECRAFT

function drawShip() {

  ctx.save();

  ctx.translate(ship.x, ship.y);

  ctx.rotate(ship.angle);

  ctx.shadowColor = "#38bdf8";

  ctx.shadowBlur = 20;

  ctx.beginPath();

  ctx.moveTo(30, 0);

  ctx.lineTo(-20, -15);

  ctx.lineTo(-10, 0);

  ctx.lineTo(-20, 15);

  ctx.closePath();

  ctx.fillStyle = "white";

  ctx.fill();

  // LABEL

  ctx.fillStyle = "#38bdf8";

  ctx.font = "14px Arial";

  ctx.fillText(
    "SPACECRAFT",
    -40,
    -25
  );

  ctx.restore();
}

// DRAW DOCKING STATION

function drawStation() {

  ctx.fillStyle = "#38bdf8";

  ctx.fillRect(
    station.x,
    station.y,
    station.width,
    station.height
  );

  // LABEL

  ctx.fillStyle = "white";

  ctx.font = "16px Arial";

  ctx.fillText(
    "DOCKING STATION",
    station.x - 10,
    station.y - 10
  );
}

// UPDATE SHIP MOVEMENT

function updateShip() {

  if (ship.fuel > 0) {

    // ROTATE LEFT

    if (keys["a"]) {

      ship.angle -= ship.rotationSpeed;
    }

    // ROTATE RIGHT

    if (keys["d"]) {

      ship.angle += ship.rotationSpeed;
    }

    // THRUST

    if (keys["w"]) {

      ship.velocityX +=
        Math.cos(ship.angle) * ship.thrust;

      ship.velocityY +=
        Math.sin(ship.angle) * ship.thrust;

      ship.fuel -= 0.05;
    }

    // SLOW DOWN

    if (keys["s"]) {

      ship.velocityX *= 0.98;

      ship.velocityY *= 0.98;
    }
  }

  // MOVE SHIP

  ship.x += ship.velocityX;

  ship.y += ship.velocityY;

  // VELOCITY

  const velocity = Math.sqrt(
    ship.velocityX ** 2 +
    ship.velocityY ** 2
  ).toFixed(2);

  // UPDATE HUD

  velocityText.textContent = velocity;

  rotationText.textContent =
    (ship.angle * 57.2958).toFixed(1);

  fuelText.textContent =
    ship.fuel.toFixed(0);

  checkDocking();
}

// DOCKING LOGIC

function checkDocking() {

  const withinX =
    ship.x > station.x &&
    ship.x < station.x + station.width;

  const withinY =
    ship.y > station.y &&
    ship.y < station.y + station.height;

  const speed = Math.sqrt(
    ship.velocityX ** 2 +
    ship.velocityY ** 2
  );

  if (withinX && withinY) {

    if (speed < 1) {

      statusText.textContent =
        "Status: Docking Successful ✅";

      statusText.style.color = "lime";

    } else {

      statusText.textContent =
        "Status: Crash ❌";

      statusText.style.color = "red";
    }
  }
}

// MAIN LOOP

function animate() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawStation();

  updateShip();

  drawShip();

  requestAnimationFrame(animate);
}

// START GAME

animate();

// RESTART BUTTON

restartBtn.addEventListener("click", () => {

  ship.x = 300;

  ship.y = canvas.height / 2;

  ship.angle = 0;

  ship.velocityX = 0;

  ship.velocityY = 0;

  ship.fuel = 100;

  statusText.textContent =
    "Status: Approaching";

  statusText.style.color = "white";
});