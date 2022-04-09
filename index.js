const canvas = document.querySelector("canvas");
const ctext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
  }

  draw() {
    ctext.fillStyle = "red";
    ctext.fillRect(this.position.x, this.position.y, 50, 150);
  }

  update() {
    this.draw();
    this.position.y += 10;
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
  console.log("loop working?");
  ctext.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
};

animation();
