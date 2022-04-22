const canvas = document.querySelector("canvas");
const ctext = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
ctext.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
  draw() {
    ctext.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }
  animationFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animationFrames();
  }
}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "green",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
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
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 12;
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    /* console.log("sprites show?", this.sprites); */
  }
  update() {
    this.draw();
    this.animationFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    ctext.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );
    /* this.velocity.y += gravity; */
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.position.y = 426;
    } else {
      this.velocity.y += gravity;
    }
    /* console.log("position", this.position.y); */
  }
  attack() {
    this.switchSprites("attack1");
    this.isAttacking = true;
  }
  switchSprites(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./Backgroud222.jpg",
});
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
  imageSrc: "./Sprites/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 150,
    y: 125,
  },
  sprites: {
    idle: { imageSrc: "./Sprites/Idle.png", framesMax: 8 },
    run: { imageSrc: "./Sprites/Run.png", framesMax: 8 },
    jump: { imageSrc: "./Sprites/Jump.png", framesMax: 2 },
    fall: { imageSrc: "./Sprites/Fall.png", framesMax: 2 },
    attack1: { imageSrc: "./Sprites/Attack1.png", framesMax: 4 },
  },
  attackBox: {
    offset: { x: 100, y: 50 },
    width: 100,
    height: 50,
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
  imageSrc: "./Sprites2/Idle.png",
  framesMax: 10,
  scale: 2.5,
  offset: {
    x: 150,
    y: 115,
  },
  sprites: {
    idle: { imageSrc: "./Sprites2/Idle.png", framesMax: 10 },
    run: { imageSrc: "./Sprites2/Run.png", framesMax: 8 },
    jump: { imageSrc: "./Sprites2/Jump.png", framesMax: 3 },
    fall: { imageSrc: "./Sprites2/Fall.png", framesMax: 3 },
    attack1: { imageSrc: "./Sprites2/Attack1.png", framesMax: 7 },
  },
  attackBox: {
    offset: { x: -150, y: 50 },
    width: 100,
    height: 50,
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
  background.update();
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  /* player.switchSprites("idle") */ if (
    keys.a.pressed &&
    player.lastHit === "a"
  ) {
    player.velocity.x = -3;
    player.switchSprites("run");
  } else if (keys.d.pressed && player.lastHit === "d") {
    player.velocity.x = 3;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }
  if (keys.ArrowLeft.pressed && enemy.lastHit === "ArrowLeft") {
    enemy.velocity.x = -3;
    enemy.switchSprites("run");
  } else if (keys.ArrowRight.pressed && enemy.lastHit === "ArrowRight") {
    enemy.velocity.x = 3;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  if (
    recCollision({
      rec1: player,
      rec2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 3
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
