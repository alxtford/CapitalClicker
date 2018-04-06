var menubutton;
var menuexitbutton;
var menubuttonText;
var menubuttonClickAnim;
var menuback;

var menubackHelp;
var menuHelpButton;
var menuHelpExitbutton;

var menuHelpText;
var menuHelpTextTween;

var menuTween = [];
var menuButtonTween;

var itemTween = [];
var menuItems = [];
var menuItemName;
var menuItemModifier;
var menuItemsPrice = [];
var menuItemsPriceTween = [];

var menuStyle = {font: "20px VT323", fill: "#fff", tabs: 40, align: "left"};

var modifierEffect;

var menuItemsButtons = [];
var menuItemsGroup;

var menuItemOffset = 48;

var menuTween;
var menuHelpTween;
var currencyTotalTextTween;
var btcTextTween;

function menuAssetsCreate(){
  menuItemsGroup = clientGame.add.group();

  toggleGroup = clientGame.add.group();
  commentGroup = clientGame.add.group();

  menubutton = uiLayer.create(10, 80, "menubutton");
  menubutton.scale.setTo(8);
  menubuttonClickAnim = menubutton.animations.add("click");

  menubutton.inputEnabled = true;
  menubutton.input.priorityID = 1;
  menubutton.input.useHandCursor = true;

  menubuttonText = clientGame.add.text(60,85, "Menu", style);
  menubuttonText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  uiLayer.add(menubuttonText);

  menubackHelp= uiLayer.create(-400, 20, "menuback");
  menubackHelp.frame = 2;
  menubackHelp.scale.setTo(8);

  helpTextCreate();

  menuback = uiLayer.create(-400, 20, "menuback");
  menuback.scale.setTo(8);

}

function menuOptionsCreate(){
  uiLayer.add(menuItemsGroup);
  console.log("CREATING MENU OPTIONS");
  for(var i = 1; i < userDataLocal.upgradeList.length + 1; i++)
  {
    menuItemsButtons[i-1] = menuItemsGroup.create(-400, 36.5 + (menuItemOffset * i), "menuItemButton");
    menuItemsButtons[i-1].scale.setTo(2);

    menuItemsButtons[i-1].inputEnabled = true;
    menuItemsButtons[i-1].input.priorityID = 1;
    menuItemsButtons[i-1].input.useHandCursor = true;

    menuItemName = userDataLocal.upgradeList[i-1].name;
    menuItemModifier = menuData.data[i-1].multiplier;

    menuItems[i - 1] = clientGame.add.text(-400, 37 + (menuItemOffset * i), userDataLocal.upgradeList[i-1].name + "\n" + menuData.data[i-1].multiplier + "\t" + userDataLocal.upgradeList[i - 1].type, menuStyle);
    menuItems[i - 1].setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    menuItems[i - 1].lineSpacing = -8;
    uiLayer.add(menuItems[i - 1]);

    menuData.data[i -1].currentPrice = ((menuData.data[i-1].basePrice * menuData.data[i-1].bought) * 1.5) *2;
    modifierEffect = menuData.data[i-1].multiplier * userDataLocal.upgradeList[i - 1].timesClicked;

    menuItemsPrice[i - 1] = clientGame.add.text(-100, 37 + (menuItemOffset * i), menuData.data[i-1].currentPrice + "\n" + modifierEffect + "/s", menuStyle);
    menuItemsPrice[i - 1].setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    menuItemsPrice[i - 1].lineSpacing = -8;
    uiLayer.add(menuItemsPrice[i - 1]);
  }
  listButtonListener();
  uiLayer.bringToTop(toggleGroup);
  menubuttonsCreate();
}

function menubuttonsCreate(){
  menuexitbutton = uiLayer.create(270, 36, "menuexitbutton");
  menuexitbutton.scale.setTo(8);
  menuexitbutton.animations.add("Click");
  menuexitbutton.inputEnabled = true;
  menuexitbutton.input.useHandCursor = true;
  menuexitbutton.visible = false;

  menuHelpButton = uiLayer.create(238, 36, "menuHelpButton");
  menuHelpButton.scale.setTo(2);
  menuHelpButton.animations.add("Click");
  menuHelpButton.inputEnabled = true;
  menuHelpButton.input.useHandCursor = true;
  menuHelpButton.visible = false;

  helpMenuExitButtonCreate();

  exitButtonListener();
  helpButtonListener();
}

function menuOptionsDraw(){

  for(var i = 0; i < userDataLocal.upgradeList.length; i++)
  {
    itemTween[i] =  clientGame.add.tween(menuItems[i]).to({x:50}, 1000,Phaser.Easing.Bounce.Out, false);
    itemTween[i].start();
    menuItemsPriceTween[i] =  clientGame.add.tween(menuItemsPrice[i]).to({x:220}, 1000,Phaser.Easing.Bounce.Out, false);
    menuItemsPriceTween[i].start();
    menuButtonTween =  clientGame.add.tween(menuItemsButtons[i]).to({x:10}, 1000,Phaser.Easing.Bounce.Out, false);
    menuButtonTween.start();
  }

  //userDataLocal.upgradeList.length()
}

function helpTextCreate(){
  menuHelpText = clientGame.add.text(-400, 40, "EACH UPGRADE OPTION\nHAS THE FOLLOWING:\n\nUpgrade Name \t |Price\nAmount | Type\t |Current Effect", menuStyle);
  menuHelpText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  uiLayer.add(menuHelpText);
}

function helpMenuExitButtonCreate(){
  menuHelpExitbutton = uiLayer.create(580, 36, "menuexitbutton");
  menuHelpExitbutton.scale.setTo(8);
  menuHelpExitbutton.animations.add("Click");
  menuHelpExitbutton.inputEnabled = true;
  menuHelpExitbutton.input.useHandCursor = true;

  menuHelpExitbutton.visible = false;

  helpExitButtonListener();
}

function menubuttonClickDown(){
  console.log("MOUSE DOWN ON MENU BUTTON");
  menubutton.animations.play("click", 30, false);

}

function menubuttonClickUp(){
  console.log("MOUSE UP ON MENU BUTTON");
  menuTween = clientGame.add.tween(menuback);
  menuTween.to({x:-10}, 1000,Phaser.Easing.Bounce.Out, false);
  menuTween.onComplete.add(function(){
    menuexitbutton.visible = true;
    menuHelpButton.visible = true;

    menuexitbutton.frame = 0;
    menuHelpButton.frame = 0;

  }, this);
  menuTween.start();

  menuHelpTween = clientGame.add.tween(menubackHelp);
  menuHelpTween.to({x:-10}, 1000,Phaser.Easing.Bounce.Out, false);
  menuHelpTween.start();

  menubutton.visible = false;
  menubuttonText.visible = false;

  var currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:320}, 1000,Phaser.Easing.Bounce.Out, false);
  var btcTextTween = clientGame.add.tween(btcText).to({x:320}, 1000,Phaser.Easing.Bounce.Out, false);
  menuOptionsDraw();
  currencyTotalTextTween.start();
  if(studyFlag){
    btcTextTween.start();
  }
  menuOpenEffect.play();
}

function OnmenuexitbuttonClickDown(){
  menuexitbutton.animations.play("Click", 30, false);
}

function OnmenuexitbuttonClickUp(){
  console.log("MOUSE UP non-menu Item");
  menuTween = clientGame.add.tween(menuback).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, true);
  menuHelpTween = clientGame.add.tween(menubackHelp).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, true);
  menuHelpTextTween = clientGame.add.tween(menuHelpText).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, true);

  currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:20}, 1000,Phaser.Easing.Bounce.Out, false);
  btcTextTween = clientGame.add.tween(btcText).to({x:20}, 1000,Phaser.Easing.Bounce.Out, false);

  currencyTotalTextTween.start();

  if(studyFlag){
    btcTextTween.start();
  }
  menubutton.visible = true;
  menubuttonText.visible = true;
  menuexitbutton.visible = false;
  menuHelpButton.visible = false;
  menuHelpExitbutton.visible = false;

  for(var i = 1; i < userDataLocal.upgradeList.length + 1; i++)
  {
    itemTween[i-1] =  clientGame.add.tween(menuItems[i - 1]).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, false);
    itemTween[i-1].start();
    menuItemsPriceTween[i-1] =  clientGame.add.tween(menuItemsPrice[i - 1]).to({x:-100}, 1000,Phaser.Easing.Bounce.Out, false);
    menuItemsPriceTween[i-1].start();
    menuButtonTween=  clientGame.add.tween(menuItemsButtons[i - 1]).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, false);
    menuButtonTween.start();
  }
  menuCloseEffect.play();
}

function OnmenuHelpExitbuttonClickDown(){
  menuHelpExitbutton.animations.play("Click", 30, false);
}

function OnmenuHelpExitbuttonClickUp(){
  console.log("MOUSE UP non-menu Item");
  menuHelpTween = clientGame.add.tween(menubackHelp).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, true);
  menuHelpTextTween = clientGame.add.tween(menuHelpText).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, true);

  currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:320}, 1000,Phaser.Easing.Bounce.Out, false);
  btcTextTween = clientGame.add.tween(btcText).to({x:320}, 1000,Phaser.Easing.Bounce.Out, false);

  menuHelpTween.start();
  currencyTotalTextTween.start();

  if(studyFlag){
    btcTextTween.start();
  }

  menuHelpExitbutton.visible = false;

  menuCloseEffect.play();
}

function OnmenuhelpbuttonClickDown(){
  menuHelpButton.animations.play("Click", 30, false);
}

function OnmenuhelpbuttonClickUp(){
  console.log("MOUSE UP non-menu Item");
  menuHelpTween = clientGame.add.tween(menubackHelp).to({x:300}, 1000,Phaser.Easing.Bounce.Out, true);
  menuHelpTween.onComplete.add(function(){
    menuHelpExitbutton.visible = true;
  }, this);
  menuHelpTween.start();
  menuHelpTextTween = clientGame.add.tween(menuHelpText).to({x:340}, 1000,Phaser.Easing.Bounce.Out, true);

  currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:620}, 1000,Phaser.Easing.Bounce.Out, false);
  btcTextTween = clientGame.add.tween(btcText).to({x:300}, 1000,Phaser.Easing.Bounce.Out, false);

  currencyTotalTextTween.start();

  if(studyFlag){
    btcTextTween.start();
  }

  menuHelpButton.frame = 0;
  menuHelpExitbutton.frame = 0;
  menuCloseEffect.play();
}

function onMenuOptionsDown(sprite){


}

function onMenuOptionsUp(){
  var normalisedY = (clientGame.input.activePointer.positionDown.y - 84.5)/(554.5 - 84.5);
  var buttonNum = Math.floor(normalisedY * 10);

  //console.log(buttonNum);

  currencyLocal = currencyTotal - menuData.data[buttonNum].currentPrice;
  if(currencyLocal > 0)
  {
    userDataLocal.upgradeList[buttonNum].timesClicked ++;
    currencyTotal -= menuData.data[buttonNum].currentPrice;

    menuData.data[buttonNum].bought ++;
    modifierTotal+= menuData.data[buttonNum].multiplier;

    updatePrice(buttonNum);

    userDataLocal.totalBought ++;
    selectEffect.play();

    if(buttonNum === 0 && userDataLocal.upgradeList[buttonNum].timesClicked % 10 === 0){
      createHireling();
    }
    else if(buttonNum === 1 && userDataLocal.upgradeList[buttonNum].timesClicked % 10 === 0){
      createEmployee();
    }
    else if(buttonNum === 2 && userDataLocal.upgradeList[buttonNum].timesClicked % 10 === 0){
      createTrader();
    }
  }
  else{
    menuItems[buttonNum].addColor("#ff0000",0);
    menuItemsPrice[buttonNum].addColor("#ff0000",0);
    clientGame.time.events.add(Phaser.Timer.QUARTER / 4, function(){
      menuItems[buttonNum].addColor("#ffffff",0);
      menuItemsPrice[buttonNum].addColor("#ffffff",0);
    }, this);
    invalidEffect.play();
  }

}

function updatePrice(i){
//  if(menuData.data[i].currentPrice == 0)
  //{
    menuData.data[i].currentPrice = (menuData.data[i].basePrice * (menuData.data[i].bought +1));
    menuData.data[i].currentPrice += menuData.data[i].currentPrice * menuData.data[i].bought;
    console.log(menuData.data[i].currentPrice);

  //}

  modifierEffect = menuData.data[i].multiplier * userDataLocal.upgradeList[i].timesClicked;

  menuItemsPrice[i].setText("§" + intStringFormatter(menuData.data[i].currentPrice) + "\n" + intStringFormatter(Math.round(modifierEffect * 10)/10) + "/s");
}

function intStringFormatter(num) {

  num = Math.round(num * 10)/10;
  if (num >= 1000000000000000000000000000000000000000000000){
    return (num / 1000000000000000000000000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "Qu";
  }
  if (num >= 1000000000000000000000000000000000000000000){
    return (num / 1000000000000000000000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "Tr";
  }
  if (num >= 1000000000000000000000000000000000000000){
    return (num / 1000000000000000000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "Du";
  }
  if (num >= 1000000000000000000000000000000000000){
    return (num / 1000000000000000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "U";
  }
  if (num >= 1000000000000000000000000000000000){
    return (num / 1000000000000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "D";
  }
  if (num >= 1000000000000000000000000000000){
    return (num / 1000000000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "N";
  }
  if (num >= 1000000000000000000000000000){
    return (num / 1000000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "O";
  }
  if (num >= 1000000000000000000000000){
    return (num / 1000000000000000000000000).toFixed(2).replace(/\.0$/, "") + "S";
  }
  if (num >= 1000000000000000000000){
    return (num / 1000000000000000000000).toFixed(2).replace(/\.0$/, "") + "s";
  }
  if (num >= 1000000000000000000){
    return (num / 1000000000000000000).toFixed(2).replace(/\.0$/, "") + "Q";
  }
  if (num >= 1000000000000000){
    return (num / 1000000000000000).toFixed(2).replace(/\.0$/, "") + "q";
  }
  if (num >= 1000000000000){
    return (num / 1000000000000).toFixed(2).replace(/\.0$/, "") + "T";
  }
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed().replace(/\.0$/, "") + "K";
  }
  return num;
}
