const canvas = document.querySelector("canvas");
const ctext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

class Sprite {
  constructor({ position, velocity, color = "green" }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastHit;
    this.color = color;
    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50,
    };
  }

  draw() {
    ctext.fillStyle = this.color;
    ctext.fillRect(this.position.x, this.position.y, this.width, this.height);

    ctext.fillStyle = "red";
    ctext.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
  }

  update() {
    this.draw();
    /* this.velocity.y += gravity; */
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

/* player.draw(); */

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },

  color: "yellow",
});

/* enemy.draw(); */

/* console.log(player); */

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

let lastHit;

const animation = () => {
  window.requestAnimationFrame(animation);
  /* console.log("loop working?"); */
  ctext.fillStyle = "blue";
  ctext.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastHit === "a") {
    player.velocity.x = -3;
  } else if (keys.d.pressed && player.lastHit === "d") {
    player.velocity.x = 3;
  }
  if (keys.ArrowLeft.pressed && enemy.lastHit === "ArrowLeft") {
    enemy.velocity.x = -3;
  } else if (keys.ArrowRight.pressed && enemy.lastHit === "ArrowRight") {
    enemy.velocity.x = 3;
  }

  if (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width
  ) {
    console.log("attack works?");
  }
};

animation();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastHit = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastHit = "a";
      break;
    case "w":
      player.velocity.y = -10;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastHit = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastHit = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -10;
      break;
  }
  /* console.log("event works", event);
  console.log("key work", event.key); */
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
