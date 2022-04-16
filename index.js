const canvas = document.querySelector("canvas");
const ctext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.5;

class Sprite {
  constructor({ position, imageSrc }) {
    this.position = position;

    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {}

  update() {
    this.draw();
  }
}
class Fighter {
  constructor({ position, velocity, color = "green", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastHit;
    this.color = color;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };

    this.isAttacking;
    this.health = 100;
  }

  draw() {
    ctext.fillStyle = this.color;
    ctext.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.isAttacking) {
      ctext.fillStyle = "red";
      ctext.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    /* this.velocity.y += gravity; */
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

/* player.draw(); */

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },

  color: "yellow",
  offset: {
    x: -50,
    y: 0,
  },
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

const recCollision = ({ rec1, rec2 }) => {
  return (
    rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
    rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
    rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
    rec1.attackBox.position.y <= rec2.position.y + rec2.height
  );
};

const endGame = ({ player, enemy, timer }) => {
  clearTimeout(timer);
  document.querySelector("#result").style.display = "flex";
  if (player.health === enemy.health) {
    /* console.log("draw") */
    document.querySelector("#result").innerHTML = "draw";
  } else if (player.health > enemy.health) {
    document.querySelector("#result").innerHTML = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#result").innerHTML = "Player 2 Wins";
  }
};

let time = 30;
let timer;
const decreaseTime = () => {
  if (time > 0) {
    timer = setTimeout(decreaseTime, 1000);
    time--, (document.querySelector("#time").innerHTML = time);
  }
  if (time === 0) {
    /* document.querySelector("#result").style.display = "flex"; */
    endGame({ player, enemy, timer });
    /* if (player.health === enemy.health) { */
    /* console.log("draw") */
    /*  document.querySelector("#result").innerHTML = "draw";
    } else if (player.health > enemy.health) {
      document.querySelector("#result").innerHTML = "Player 1 Wins";
    } else if (player.health < enemy.health) {
      document.querySelector("#result").innerHTML = "Player 2 Wins";
    } */
  }
};

decreaseTime();

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
    recCollision({
      rec1: player,
      rec2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    console.log("Attack works?");
  }

  if (
    recCollision({
      rec1: enemy,
      rec2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    console.log("enemy attack works?");
  }
  if (enemy.health <= 0 || player.health <= 0) {
    endGame({ player, enemy, timer });
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
    case "s":
      player.attack();
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
    case "ArrowDown":
      enemy.attack();
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
