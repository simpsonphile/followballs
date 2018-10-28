canvas = document.querySelector('#main-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "black";
c = canvas.getContext('2d');

//initialize
var isMouseDown = false;
var isRozpro = false;
var isGravitation = false;
var maxSpeed = 8;//max speed of ball
var minSpeed = 2;//min speed of ball
var maxSize = 2;//max size of ball
var minSize = 2;//min size of ball
var redKey ='n';
var blueKey = 'b';
var greenKey = 'm';
var rozproKey = 'h';
var gravitationKey = 'g';
var blueColors = [
  '#5BCAE2',
  '#28ABCA',
  '#0698BE',
  '#0083A6',
  '#00759A'
];

var greenColors = [
  '#44723A',
  '#9CF416',
  '#98D80A',
  '#95BF0A',
  '#BAF00E'
];

var redColors = [
  '#A6041E',
  '#720118',
  '#F20845',
  '#5A0318',
  '#42011C'
];

var explodeColors = blueColors.concat(redColors, greenColors);
var colors = blueColors;

var circlesFollowers = [];
var circlesToPointExploders = [];
var circlesFromExplosion = [];

//modal that changes variables
var modal = document.querySelector('#settings-wrapper');
var settingsSave = document.querySelector('#save');
var settingsBlue = document.querySelector('#blue');
var settingsGreen = document.querySelector('#green');
var settingsRed = document.querySelector('#red');
var settingsMinSize = document.querySelector('#min-size');
var settingsMaxSize = document.querySelector('#max-size');
var settingsMinSpeed = document.querySelector('#min-speed');
var settingsMaxSpeed = document.querySelector('#max-speed');

settingsSave.addEventListener('click', function(){
  if(settingsBlue.value && settingsBlue.value && settingsBlue.value!=settingsGreen.value
     && settingsBlue.value!=settingsRed.value){
       blueKey=settingsBlue.value;
       if(settingsGreen.value && settingsRed.value!=settingsGreen.value){
         greenKey=settingsGreen.value;
         if(settingsRed.value){
           redKey=settingsRed.value;
         }
       }
     }

  aMinSize=Number(settingsMinSize.value);
  aMaxSize=Number(settingsMaxSize.value);
  aMinSpeed=Number(settingsMinSpeed.value);
  aMaxSpeed=Number(settingsMaxSpeed.value);

  if(aMinSize<=aMaxSize && aMinSize>0){
    minSize=aMinSize;
    maxSize=aMaxSize;
  }

  if(aMinSpeed<=aMaxSpeed && aMaxSpeed>0){
    minSpeed=aMinSpeed;
    maxSpeed=aMaxSpeed;
  }

  modal.style.display = "none";
});

//info panel
var gravPanel = document.querySelector('#gravitation');
var rozproPanel = document.querySelector('#rozproszenie');

//cool handy functions
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

randomNumber = function(from, to){
  return Math.random()*(to-from)+from;
};

randomColor = function(aArray){
  return aArray[Math.floor(Math.random()*aArray.length)];
}
//end of cool handy functions*********************

//current mouse position
var MousePosition = function(x,y){
  this.x = this.lastX = x;
  this.y = this.lastY = y;
};
var mp = new MousePosition(undefined, undefined);

//event listeners
window.addEventListener('resize', function(){
  reset();
});

canvas.addEventListener('mousemove', function(e){
  mp.x = e.clientX;
  mp.y = e.clientY;
});

canvas.addEventListener('mousedown', function(e){
  isMouseDown = true;
});

canvas.addEventListener('mouseup', function(e){
  isMouseDown = false;
});

window.addEventListener('keypress', function(e){
  if(e.charCode==113){//if q pressed
  ms = randomNumber(minSpeed, maxSpeed);
  color = randomColor(colors);
  circlesToPointExploders.push(new Circle(0,0,2,ms,color,mp.x,mp.y));
  }

  else if(e.charCode==114){//if r is pressed
    reset();
  }

  else if(e.key =="s"){
    modal.style.display = "flex";
  }

  else if(e.key == blueKey){//if b is pressed
    colors = blueColors;
  }

  else if(e.key == redKey){//if n is pressed
    colors = redColors;
  }

  else if(e.key == greenKey){//if m is pressed
    colors = greenColors;
  }

  else if(e.key == rozproKey){
    isRozpro = !isRozpro;
    if(isRozpro)rozproPanel.innerHTML="rozproszenie: ON";
    else rozproPanel.innerHTML="rozproszenie: OFF";
  }

  else if(e.key== gravitationKey){
    isGravitation=!isGravitation;
    if(isGravitation)gravPanel.innerHTML="gravitation: ON";
    else gravPanel.innerHTML="gravitation: OFF";
  }



});



var explodeColors = blueColors.concat(redColors, greenColors);
var colors = blueColors;

var circlesFollowers = [];
var circlesToPointExploders = [];
var circlesFromExplosion = [];

var reset = function(){
  circlesFollowers = [];
  circlesToPointExploders = [];
  circlesFromExplosion = [];
}

//circle class
var Circle = function(x,y,r,ms,color,destinationX, destinationY, dx, dy){
  this.x = x;
  this.y = y;
  this.r = randomNumber(minSize, maxSize);
  this.dx = dx;
  this.dy = dy;
  this.ms = ms;
  this.directionX = undefined;
  this.directionY = undefined;
  this.color = color;
  this.destinationX = destinationX;
  this.destinationY = destinationY;
  this.exploded = false;
  this.rozproX = randomNumber(-2,2);
  this.rozproY = randomNumber(-2,2);
  this.gravAcce = 1;

  this.draw = function(){
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
    c.fillStyle = color;
    c.fill();
    c.stroke();
  }

  this.follow = function(){
    let xDirection = (mp.x + mp.lastX)/2;
    let yDirection = (mp.y + mp.lastY)/2;
    if(this.x>xDirection)this.directionX = -1;
    else if(this.x<xDirection)this.directionX = 1;
    else this.directionX = 0;
    if(this.y>yDirection)this.directionY = -1;
    else if(this.y<yDirection)this.directionY = 1;
    else this.directionY = 0;

    this.dx = ms * this.directionX * Math.abs(this.x-xDirection)/500;
    this.dy = ms * this.directionY * Math.abs(this.y-yDirection)/500;
    this.x+=this.dx;
    this.y+=this.dy;
    this.draw();
    mp.lastX = mp.x;
    mp.lastY = mp.y;
  }

  this.flyToPoint = function(){
    if(this.x>this.destinationX)this.directionX = -1;
    else if(this.x<this.destinationX)this.directionX = 1;
    else this.directionX = 0;
    if(this.y>this.destinationY)this.directionY = -1;
    else if(this.y<this.destinationY)this.directionY = 1;
    else this.directionY = 0;
    if(this.x==this.destinationX && this.y==this.destinationY)this.explode();

    this.dx = Math.ceil(ms * this.directionX * Math.abs(this.x-this.destinationX)/100);
    this.dy = Math.ceil(ms * this.directionY * Math.abs(this.y-this.destinationY)/100);
    this.x+=this.dx;
    this.y+=this.dy;
    this.draw();

  }

  this.explode = function(){
    for (var i = 0; i < 16; i++) {
      hx = randomNumber(-maxSpeed, maxSpeed);
      hy = randomNumber(-maxSpeed, maxSpeed);
      color = randomColor(explodeColors);
      circlesFromExplosion.push(new
        Circle(this.destinationX, this.destinationY,2,0,color,0,0,hx,hy));
    }
    this.exploded = true;
  }

  this.flyAway = function(){
    this.x+=this.dx;
    this.y+=this.dy;
    this.draw();
  }

  this.rozproEfect = function(){

    if(this.x+this.r+this.rozproX>=canvas.width)this.rozproX=-this.rozproX;
    else if(this.x-this.r+this.rozproX<=0)this.rozproX=-this.rozproX;
    if(this.y+this.r+this.rozproY>=canvas.height)this.rozproY=-this.rozproY;
    else if(this.y-this.r+this.rozproY<=0)this.rozproY=-this.rozproY;
     this.x+=this.rozproX;
     this.y+=this.rozproY;
     this.draw();
     console.log("hi");
  }

  this.gravitationEfect = function(){
    if(this.y+this.r+this.gravAcce>=canvas.height){
      this.gravAcce=-Math.floor(0.8*this.gravAcce);
    }
    else{
      this.gravAcce+=1;
    }
    console.log(this.gravAcce);
    this.y+=this.gravAcce;
    this.draw();
  }
}
//loop function
function animation(){
  requestAnimationFrame(animation);
  c.clearRect(0,0,innerWidth,innerHeight);

  if(isMouseDown){
    ms = randomNumber(minSpeed, maxSpeed);
    color = randomColor(colors);
    circlesFollowers.push(new Circle(mp.x, mp.y, 2, ms, color));
  }

  for (var i = 0; i < circlesFollowers.length; i++) {
    if(isRozpro || isGravitation){
      if(isRozpro)circlesFollowers[i].rozproEfect();
      if(isGravitation)circlesFollowers[i].gravitationEfect();
    }
    else circlesFollowers[i].follow();

  }

  for (var i = 0; i < circlesToPointExploders.length; i++) {
    circlesToPointExploders[i].flyToPoint();
    if(circlesToPointExploders[i].exploded){
      delete circlesToPointExploders[i];
      circlesToPointExploders.remove(i);
  }
}

  for (var i = 0; i < circlesFromExplosion.length; i++) {
    circlesFromExplosion[i].flyAway();
    if(circlesFromExplosion[i].x>innerWidth||circlesFromExplosion[i].x<0
    ||circlesFromExplosion[i].y>innerHeight||circlesFromExplosion[i].y<0){
      //if it fly out of the screen => delete
      delete circlesFromExplosion[i];
     circlesFromExplosion.remove(i);
   }
  }

}

animation();
