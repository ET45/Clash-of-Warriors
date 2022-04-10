const canvas = document.querySelector("canvas");
const ctext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw() {
    ctext.fillStyle = "red";
    ctext.fillRect(this.position.x, this.position.y, 50, this.height);
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
});

/* enemy.draw(); */

console.log(player);

const animation = () => {
  window.requestAnimationFrame(animation);
  /* console.log("loop working?"); */
  ctext.fillStyle = "black";
  ctext.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
};

animation();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      player.velocity.x = 1;
      break;
  }
  /* console.log("event works", event);
  console.log("key work", event.key); */
});
