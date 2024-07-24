// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const $score = document.querySelector("#score")
let score = 0;
const balls = [];

$score.innerHTML =  `score: ${score}`

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape{

  constructor(x, y, velX, velY){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }

}

class EvilCircle extends Shape{
  constructor(x, y){
    super(x, y, 20, 20);
    this.color = `rgb(255,255,255)`;
    this.size = 30;
  
    window.addEventListener("keydown", (e) => {
      console.log(e.key)
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

   draw(){
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

   checkBounds(){
    if ((this.x + this.size) >= width) {
      this.x = -(this.x);
    }
  
    if ((this.x - this.size) <= 0) {
      this.x = -(this.x);
    }
  
    if ((this.y + this.size) >= height) {
      this.y = -(this.y);
    }
  
    if ((this.y - this.size) <= 0) {
      this.y = -(this.y);
    }
    }

  collisionDetect(){
    for(const ball of balls){
      
      if(!(this === ball) && ball.exists){
        const dx = this.x - ball.x
        const dy = this.y - ball.y
        const distance = Math.sqrt(dx * dx + dy * dy);


        if(distance < this.size + ball.size){
          ball.exists = false;
          score -= 1;
        }
      }
    }
  }
  
}

class Ball extends Shape{
    constructor(x, y, velX, velY, color, size) {
      super(x, y, velX, velY)  
      this.color = color;
      this.size = size;
      this.exists = true;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        if ((this.x + this.size) >= width) {
          this.velX = -(this.velX);
        }
      
        if ((this.x - this.size) <= 0) {
          this.velX = -(this.velX);
        }
      
        if ((this.y + this.size) >= height) {
          this.velY = -(this.velY);
        }
      
        if ((this.y - this.size) <= 0) {
          this.velY = -(this.velY);
        }
      
        this.x += this.velX;
        this.y += this.velY;
      }

    collisionDetect(){
      for(const ball of balls){
        
        if(!(this === ball) && ball.exists){
          const dx = this.x - ball.x
          const dy = this.y - ball.y
          const distance = Math.sqrt(dx * dx + dy * dy);


          if(distance < this.size + ball.size){
            ball.color = this.color = randomRGB();
          }
        }
      }
    }
}

const evilBall = new EvilCircle(20, 20);

while(balls.length < 25) {
  const size = random(10, 20)
  const ball = new Ball (
    random(0+size, width - size),
    random(0+size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
  );

  balls.push(ball);

}




score = balls.length;

function loop(){
  $score.innerHTML =  `score: ${score}`
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls){
    if(ball.exists){
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }

    evilBall.draw();   
    evilBall.checkBounds();
    evilBall.collisionDetect();
    
  }

  requestAnimationFrame(loop);
}

loop()