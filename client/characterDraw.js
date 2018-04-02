var hireling1;
var hireling2;

var employee1;
var employee2;

var trader1;
var trader2;

var chicken;
var chest;

var tween;

// function characterSplit(){

//   chicken = characterLayer.add.sprite(100,100, "characters");
//   chest = characterLayer.add.sprite(100,100, "characters");
//
//   chest.frame = 76;
//
//   chicken.animations.add("walk", [72,73,74,75], 10, true);
//   chicken.animations.add("explode", [78,79,80,81,82,83], 10, true);
// }

function randPos() {
    return Math.floor(Math.random() * (clientGame.width - 100));
}

function createTrader(){
  console.log("CREATING TRADER");
  if(coinFlip() < 1){
    if(coinFlip() < 1){
      trader1 = characterLayer.create(-30,380, "characters");
      trader1.anchor.setTo(0.5);
      trader1.scale.setTo(10,10);
    }
    else {
      trader1 = characterLayer.create(630,380, "characters");
      trader1.anchor.setTo(0.5);
      trader1.scale.setTo(-10,10);
    }
    trader1.animations.add("walk", [0,1,2,3,4,5], 10, true);
    trader1.animations.add("idle", [6,7,8,9,10,11], 2, true);

    tween = clientGame.add.tween(trader1).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(function (){
      trader1.animations.play("idle");
    }, this);
    tween.start();
    trader1.animations.play("walk");
  }
  else{
    if(coinFlip() < 1){
      trader2 = characterLayer.create(-30,380, "characters");
      trader2.anchor.setTo(0.5);
      trader2.scale.setTo(10,10);
    }
    else {
      trader2 = characterLayer.create(630,380, "characters");
      trader2.anchor.setTo(0.5);
      trader2.scale.setTo(-10,10);
    }
    trader2.animations.add("walk", [12,13,14,15,16,17], 10, true);
    trader2.animations.add("idle", [18,19,20,21,22,23], 2, true);

    tween = clientGame.add.tween(trader2).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(function (){
      trader2.animations.play("idle");
    }, this);
    tween.start();
    trader2.animations.play("walk");
  }
}

function createHireling(){
  console.log("CREATING HIRELING");
  if(coinFlip() < 1){
    if(coinFlip() < 1){
      hireling1 = characterLayer.create(-30,380, "characters");
      hireling1.anchor.setTo(0.5);
      hireling1.scale.setTo(10,10);
    }
    else {
      hireling1 = characterLayer.create(630,380, "characters");
      hireling1.anchor.setTo(0.5);
      hireling1.scale.setTo(-10,10);

    }
    hireling1.animations.add("walk", [24,25,26,27,28,29], 10, true);
    hireling1.animations.add("idle", [30,31,32,33,34,35], 2, true);

    tween = clientGame.add.tween(hireling1).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(function (){
      hireling1.animations.play("idle");
    }, this);
    tween.start();
    hireling1.animations.play("walk");
  }
  else{
    if(coinFlip() < 1){
      hireling2 = characterLayer.create(-30,380, "characters");
      hireling2.anchor.setTo(0.5);
      hireling2.scale.setTo(10,10);
    }
    else {
      hireling2 = characterLayer.create(630,380, "characters");
      hireling2.anchor.setTo(0.5);
      hireling2.scale.setTo(-10,10);
    }
    hireling2.animations.add("walk", [36,37,38,39,40,41], 10, true);
    hireling2.animations.add("idle", [42,43,44,45,46,47], 2, true);

    tween = clientGame.add.tween(hireling2).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(function (){
      hireling2.animations.play("idle");
    }, this);
    tween.start();
    hireling2.animations.play("walk");
  }
}

function createEmployee(){
  console.log("CREATING EMPLOYEE");
  if(coinFlip() < 1){
    if(coinFlip() < 1){
      employee1 = characterLayer.create(-30,380, "characters");
      employee1.anchor.setTo(0.5);
      employee1.scale.setTo(10,10);
    }
    else {
      employee1 = characterLayer.create(630,380, "characters");
      employee1.anchor.setTo(0.5);
      employee1.scale.setTo(-10,10);
    }
    employee1.animations.add("walk", [48,49,50,51,52,53], 10, true);
    employee1.animations.add("idle", [54,55,56,57,58,59], 2, true);

    tween = clientGame.add.tween(employee1).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(function (){
      employee1.animations.play("idle");
    }, this);
    tween.start();
    employee1.animations.play("walk");
  }
  else{
    if(coinFlip() < 1){
      employee2 = characterLayer.create(-30,380, "characters");
      employee2.anchor.setTo(0.5);
      employee2.scale.setTo(10,10);
    }
    else {
      employee2 = characterLayer.create(630,380, "characters");
      employee2.anchor.setTo(0.5);
      employee2.scale.setTo(-10,10);
    }
    employee2.animations.add("walk", [60,61,62,63,64,65], 10, true);
    employee2.animations.add("idle", [66,67,68,69,70,71], 2, true);

    tween = clientGame.add.tween(employee2).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(function (){
      employee2.animations.play("idle");
    }, this);
    tween.start();
    employee2.animations.play("walk");
  }
}
