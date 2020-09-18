/* Setting up local environment and hosting game online
*/

var trex, trexI,ground, groundI, groundI2, invisibleground, cloudI, gamestate = "initial", gameover, velup=-6;
var score=0;
var score1 = "00000";

function preload(){  
  trexI = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex1 = loadAnimation("trex1.png");
  trexC = loadAnimation("trex_collided.png");
  groundI = loadImage("ground2.png");
  cloudI = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  gameoverI = loadImage("gameOver.png");
  restartI = loadImage("restart.png");
  jumpsound = loadSound ("jump.mp3");
  diesound = loadSound("die.mp3");
  speedup = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(40,100,20,60);
  trex.addAnimation("t",trexI);
  trex.scale = 0.5;
  
   ground1 = createSprite(300,130,400,10);      
   ground1.addImage(groundI);
  
  
  invisibleground = createSprite(200,140,400,10)
  invisibleground.visible = false;
  
  obs_group = new Group();
  cloud_group = new Group();
  
  //setCollider(type, xOffset, yOffset, width/radius, height, rotationOffset)
  //trex.setCollider("circle",0,-40,100);
  //trex.debug = true;
  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true;
  
  gameover= createSprite (300,80);
  gameover.addAnimation ("go",gameoverI);
  gameover.scale = 0.5;
  
  restart= createSprite (300,50);
  restart.addAnimation ("r",restartI);
  restart.scale = 0.5;
  
}

function draw() {
  
    background(180);
  if(keyDown("space")){
    gamestate = "play";
     }
 
if(gamestate == "initial"){
  ground1.velocityX = 0;
  gameover.visible=false;
  restart.visible=false;
  trex.addAnimation("t",trex1);
}
else if(gamestate == "play"){
trex.addAnimation("t",trexI);
 playGame();
}
  
 else if(gamestate == "end"){  
   endGame();
 }
  trex.collide(invisibleground);
  //trex.collide(ground1);
  text("Score: "+ score1, 480,20); 
  
  // console.log("Score: "+score);
 
  drawSprites();
 
}
function playGame(){
    // ground1.velocityX =  -(6 + score/100); 
    // console.log(ground1.velocityX);
  trex.addAnimation("t",trexI);
  ground1.velocityX = -6;
      if(ground1.x<200){
        ground1.x = 500;
      }
    //trex movement
      if(keyDown("space") && trex.y >= 100 ){
        trex.velocityY = -10;
        jumpsound.play();
      }
    //to add gravity
      trex.velocityY = trex.velocityY + 1; 
    //to add the clouds
      clouds();
      obstacles();
      
     score = score + (Math.round(getFrameRate()/60));
    score1 = scoreF()+score;
     console.log(score1);
  // if(score%10 == 0){
  //   console.log(".....",score);
  // }
  //*******************************************************
    if(score>0 && score%100 == 0){
      // velup = velup - 1;
       console.log(ground1.velocityX);
      speedup.play();
       ground1.velocityX = ground1.velocityX - 0.1;
       obs_group.setVelocityXEach(ground1.velocityX);
    }
  //***********************************************************
     if(trex.isTouching(obs_group)){  
       gamestate = "end";
       diesound.play();
       //trex.velocityY = -7;
       }
    gameover.visible = false;
    restart.visible = false; 
    //console.log(obs_group.velocityX);
  
}
function endGame(){
   //trex.changeAnimation ("tr",trexC);  
  trex.addAnimation("t",trexC); 
  obs_group.setLifetimeEach(-1);
  cloud_group.setLifetimeEach(-1);                                        
    ground1.velocityX = 0;
    trex.velocityY = 0;
    obs_group.setVelocityXEach(0);
    cloud_group.setVelocityXEach(0);
   
   gameover.visible = true;
   restart.visible = true;
  
   if(mousePressedOver(restart)){
     reset();
   }
}
function reset(){
    gamestate = "play";
     //gameover.visible = false;
     // restart.visible = false;
     obs_group.destroyEach();
     cloud_group.destroyEach();
     score = 0;
     ground1.velocityX = -6;
  }
function clouds(){
  var rand = Math.round(random(10,60));
  var ran = Math.round(random(4,10))*20;
 // console.log("Random: "+ ran);
  if (frameCount % ran == 0){
  var cloud = createSprite(700,rand,40,10);
    cloud.velocityX = -3;
   cloud.addImage(cloudI);
    cloud.scale = 0.4;
    
    trex.depth = trex.depth + 1;
    cloud.depth = 1;
    
    cloud.lifetime = 300;
    cloud_group.add(cloud);
    
    
  }
}
function obstacles(){
    
    if(frameCount % 60==0){
       var obs = createSprite(700,110,20,80);
        obs.velocityX= -(6 + score/100); 
        
      var r = Math.round(random(1,6));
      
      switch(r){
          case 1: obs.addImage(ob1);
          break;
          case 2: obs.addImage(ob2);
          break;
          case 3: obs.addImage(ob3);
          break;
          case 4: obs.addImage(ob4);
          break;
          case 5: obs.addImage(ob5);
          break;
          case 6: obs.addImage(ob6); 
          break;
          default: break;
          }
       obs.scale = 0.5;
       obs.lifetime = 400;
         obs_group.add(obs);
       }    
 
  }
function scoreF(){
  var score2="";
  if(score>=0 && score<=9){
    return "0000";
  }
  if(score>=10 && score<=99){
    return "000";
  }
  if(score>=100 && score<=999){
    return "00";
  }
  if(score>=1000 && score<=9999){
    return "0";
  }
  if(score>=10000 && score<=99999){
    return "";
  }
}

