// var hireling1;
// var hireling2;
//
// var employee1;
// var employee2;
//
// var trader1;
// var trader2;

var chicken;
var chickenBonus;
var chest;

var traderTween = [];
var employeeTween = [];
var hirelingTween = [];

function createChicken(){

  var rand = Math.round(Math.random() * (60000 - (menuData.data[6].multiplier * menuData.data[6].bought))) + 1000; // generate new time (between 1min and 1s)
  setTimeout(createChicken, rand);

  if(!chicken){
    if(coinFlip() < 1){
      chicken = characterLayer.create(830,460, "characters");
      chicken.anchor.setTo(0.5);
      chicken.scale.setTo(-5,5);

      tween = clientGame.add.tween(chicken).to({ x: -30 }, 2000, Phaser.Easing.Linear.None, false);
      tween.onComplete.add(function (){
        //chicken.destroy();
        chicken= null;

      }, this);
    }
    else{
      chicken = characterLayer.create(-30,460, "characters");
      chicken.anchor.setTo(0.5);
      chicken.scale.setTo(5,5);

      tween = clientGame.add.tween(chicken).to({ x: 830 }, 2000, Phaser.Easing.Linear.None, false);
      tween.onComplete.add(function (){
        //chicken.destroy();
        chicken= null;
      }, this);
    }

    chicken.animations.add("walk", [72,73,74,75], 15, true);
    chicken.animations.add("explode", [78,79,80,81,82,83], 15, false);

    chicken.inputEnabled = true;
    chicken.input.priorityID = 2;
    chicken.useHandCursor = true;

    chicken.events.onInputDown.add(function(){
      chicken.animations.stop();
      chicken.animations.play("explode", 20, false, true);
      chicken.inputEnabled = false;
      explodeEffect.play();

      chickenBonus = 1+((menuData.data[6].multiplier * userDataLocal.upgradeList[6].timesClicked) * (menuData.data[6].currentPrice /100000)) + userDataLocal.totalClicks;
      currencyTotal += chickenBonus;
      chicken= null;

      chickenWrite();
      //chicken.destroy();

      tween.stop();
    }, this);

    tween.start();
    chicken.animations.play("walk");
  }
}

function createChest(){
  chest = characterLayer.create(randPos(),410, "characters");
  chest.frame = 76;
  chest.scale.setTo(8);
}

function randPos() {
  return Math.floor(Math.random() * (clientGame.width - 100));
}

function createTrader(totalTrader){
  for(var i = 0; i< totalTrader; i++)
  {
    console.log("CREATING " + totalTrader + " TRADERS");

  if(coinFlip() < 1){
    var trader1;
    if(coinFlip() < 1){
      trader1 = characterLayer.create(-30,410, "characters");
      trader1.anchor.setTo(0.5);
      trader1.scale.setTo(8,8);
    }
    else {
      trader1 = characterLayer.create(830,410, "characters");
      trader1.anchor.setTo(0.5);
      trader1.scale.setTo(-8,8);
    }
    trader1.animations.add("walk", [0,1,2,3,4,5], 10, true);
    trader1.animations.add("idle", [6,7,8,9,10,11], 2, true);

    traderTween[i] = clientGame.add.tween(trader1).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    traderTween[i].onComplete.add(function (){
      trader1.animations.play("idle");
    }, this);
    traderTween[i].start();
    trader1.animations.play("walk");
  }
  else{
    var trader2;
    if(coinFlip() < 1){
      trader2 = characterLayer.create(-30,410, "characters");
      trader2.anchor.setTo(0.5);
      trader2.scale.setTo(8,8);
    }
    else {
      trader2 = characterLayer.create(830,410, "characters");
      trader2.anchor.setTo(0.5);
      trader2.scale.setTo(-8,8);
    }
    trader2.animations.add("walk", [12,13,14,15,16,17], 10, true);
    trader2.animations.add("idle", [18,19,20,21,22,23], 2, true);

    traderTween[i] = clientGame.add.tween(trader2).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    traderTween[i].onComplete.add(function (){
      trader2.animations.play("idle");
    }, this);
    traderTween[i].start();
    trader2.animations.play("walk");
  }
}
}

function createHireling(totalHireling){
  for(var i = 0; i<totalHireling; i++)
  {
  console.log("CREATING HIRELING");
  if(coinFlip() < 1){
    var hireling1;

    if(coinFlip() < 1){
      hireling1 = characterLayer.create(-30,410, "characters");
      hireling1.anchor.setTo(0.5);
      hireling1.scale.setTo(8,8);
    }
    else {
      hireling1 = characterLayer.create(830,410, "characters");
      hireling1.anchor.setTo(0.5);
      hireling1.scale.setTo(-8,8);

    }
    hireling1.animations.add("walk", [24,25,26,27,28,29], 10, true);
    hireling1.animations.add("idle", [30,31,32,33,34,35], 2, true);

    hirelingTween[i] = clientGame.add.tween(hireling1).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    hirelingTween[i].onComplete.add(function (){
      hireling1.animations.play("idle");
    }, this);
    hirelingTween[i].start();
    hireling1.animations.play("walk");
  }
  else{
    var hireling2;

    if(coinFlip() < 1){
      hireling2 = characterLayer.create(-30,410, "characters");
      hireling2.anchor.setTo(0.5);
      hireling2.scale.setTo(8,8);
    }
    else {
      hireling2 = characterLayer.create(830,410, "characters");
      hireling2.anchor.setTo(0.5);
      hireling2.scale.setTo(-8,8);
    }
    hireling2.animations.add("walk", [36,37,38,39,40,41], 10, true);
    hireling2.animations.add("idle", [42,43,44,45,46,47], 2, true);

    hirelingTween[i] = clientGame.add.tween(hireling2).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    hirelingTween[i].onComplete.add(function (){
      hireling2.animations.play("idle");
    }, this);
    hirelingTween[i].start();
    hireling2.animations.play("walk");
  }
}
}

function createEmployee(totalEmployee){
  for(var i = 0; i<totalEmployee; i++)
  {
  console.log("CREATING EMPLOYEE");
  if(coinFlip() < 1){
    var employee1;
    if(coinFlip() < 1){
      employee1 = characterLayer.create(-30,410, "characters");
      employee1.anchor.setTo(0.5);
      employee1.scale.setTo(8,8);
    }
    else {
      employee1 = characterLayer.create(830,410, "characters");
      employee1.anchor.setTo(0.5);
      employee1.scale.setTo(-8,8);
    }
    employee1.animations.add("walk", [48,49,50,51,52,53], 10, true);
    employee1.animations.add("idle", [54,55,56,57,58,59], 2, true);

    employeeTween[i] = clientGame.add.tween(employee1).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    employeeTween[i].onComplete.add(function (){
      employee1.animations.play("idle");
    }, this);
    employeeTween[i].start();
    employee1.animations.play("walk");
  }
  else{
    var employee2;

    if(coinFlip() < 1){
      employee2 = characterLayer.create(-30,410, "characters");
      employee2.anchor.setTo(0.5);
      employee2.scale.setTo(8,8);
    }
    else {
      employee2 = characterLayer.create(830,410, "characters");
      employee2.anchor.setTo(0.5);
      employee2.scale.setTo(-8,8);
    }
    employee2.animations.add("walk", [60,61,62,63,64,65], 10, true);
    employee2.animations.add("idle", [66,67,68,69,70,71], 2, true);

    employeeTween[i] = clientGame.add.tween(employee2).to({ x: randPos() }, 5000, Phaser.Easing.Linear.None, false);
    employeeTween[i].onComplete.add(function (){
      employee2.animations.play("idle");
    }, this);
    employeeTween[i].start();
    employee2.animations.play("walk");
  }
}
}
