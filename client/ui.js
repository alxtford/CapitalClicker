var menubutton;
var menuexitbutton;
var menubuttonText;
var menubuttonClickAnim;
var menuback;
var menuTween = [];
var menuButtonTween;
var textOptions;
var itemTween = [];
var menuItems = [];
var menuItemName;
var menuItemModifier;
var menuItemsPrice = [];
var menuItemsPriceTween = [];

var modifierEffect;

var menuItemsButtons = [];
var menuItemsGroup;

var menuItemOffset = 48;

function menuAssetsCreate(){
  menuItemsGroup = clientGame.add.group();

  toggleGroup = clientGame.add.group();

  menubutton = uiLayer.create(10, 80, "menubutton");
  menubutton.scale.setTo(8);
  menubuttonClickAnim = menubutton.animations.add("click");

  menubutton.inputEnabled = true;
  menubutton.input.priorityID = 1;
  menubutton.input.useHandCursor = true;

  menubuttonText = clientGame.add.text(60,85, "Menu", style);
  menubuttonText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  uiLayer.add(menubuttonText);

  menuback = uiLayer.create(-400, 20, "menuback");
  menuback.scale.setTo(8);

}

function menuOptionsCreate()
{
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
    menuItems[i - 1].setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    menuItems[i - 1].lineSpacing = -8;
    uiLayer.add(menuItems[i - 1]);

    modifierEffect = menuData.data[i-1].multiplier * userDataLocal.upgradeList[i - 1].timesClicked;

    menuItemsPrice[i - 1] = clientGame.add.text(-100, 37 + (menuItemOffset * i), menuData.data[i-1].currentPrice + "\n" + modifierEffect + "/s", menuStyle);
    menuItemsPrice[i - 1].setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    menuItemsPrice[i - 1].lineSpacing = -8;
    uiLayer.add(menuItemsPrice[i - 1]);
  }
  listButtonListener();
  uiLayer.bringToTop(toggleGroup);
}

function menubuttonClickDown(){
  console.log("MOUSE DOWN ON MENU BUTTON");
  menubutton.animations.play("click", 30, false);
}

function menubuttonClickUp(){
  console.log("MOUSE UP ON MENU BUTTON");
  menuTween = clientGame.add.tween(menuback);
  menuTween.to({x:-10}, 1000,Phaser.Easing.Bounce.Out, false);
  menuTween.onComplete.add(menuexitbuttonCreate, this);
  menuTween.start();
  menubutton.visible = false;
  menubuttonText.visible = false;

  var currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:320}, 1000,Phaser.Easing.Bounce.Out, false);
  var btcTextTween = clientGame.add.tween(btcText).to({x:320}, 1000,Phaser.Easing.Bounce.Out, false);
  menuOptionsDraw();
  currencyTotalTextTween.start();
  btcTextTween.start();

}

function menuexitbuttonCreate(){
  menuexitbutton = uiLayer.create(270, 36, "menuexitbutton");
  menuexitbutton.scale.setTo(8);
  menuexitbutton.animations.add("Click");
  menuexitbutton.inputEnabled = true;
  menuexitbutton.input.useHandCursor = true;
  exitButtonListener();
}

function OnmenuexitbuttonClickDown(){
  menuexitbutton.animations.play("click", 30, false);
}

function OnmenuexitbuttonClickUp(){
  console.log("MOUSE UP non-menu Item");
  var menuTween = clientGame.add.tween(menuback).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, true);
  var currencyTotalTextTween = clientGame.add.tween(currencyTotalText).to({x:20}, 1000,Phaser.Easing.Bounce.Out, false);
  var btcTextTween = clientGame.add.tween(btcText).to({x:20}, 1000,Phaser.Easing.Bounce.Out, false);

  currencyTotalTextTween.start();
  btcTextTween.start();

  menubutton.visible = true;
  menubuttonText.visible = true;
  menuexitbutton.visible = false

  for(var i = 1; i < userDataLocal.upgradeList.length + 1; i++)
  {
    itemTween[i-1] =  clientGame.add.tween(menuItems[i - 1]).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, false);
    itemTween[i-1].start();
    menuItemsPriceTween[i-1] =  clientGame.add.tween(menuItemsPrice[i - 1]).to({x:-100}, 1000,Phaser.Easing.Bounce.Out, false);
    menuItemsPriceTween[i-1].start();
    menuButtonTween=  clientGame.add.tween(menuItemsButtons[i - 1]).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, false);
    menuButtonTween.start();
  }
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

function onMenuOptionsDown(sprite){


}

function onMenuOptionsUp(){
  var normalisedY = (clientGame.input.activePointer.positionDown.y - 84.5)/(554.5 - 84.5);
  var buttonNum = Math.floor(normalisedY * 10);

  //console.log(buttonNum);

  currencyLocal = currencyTotal - menuData.data[buttonNum].currentPrice
  if(currencyLocal > 0)
  {
    userDataLocal.upgradeList[buttonNum].timesClicked ++;
    currencyTotal -= menuData.data[buttonNum].currentPrice;

    menuData.data[buttonNum].bought ++;
    modifierTotal+= menuData.data[buttonNum].multiplier;

    updatePrice(buttonNum);

    userDataLocal.totalBought ++;
  }

}

function updatePrice(i){
  menuData.data[i].currentPrice = (menuData.data[i].basePrice * menuData.data[i].bought) * 1.5 + menuData.data[i].currentPrice;

  modifierEffect = menuData.data[i].multiplier * userDataLocal.upgradeList[i].timesClicked;

  menuItemsPrice[i].setText("§" + menuData.data[i].currentPrice + "\n" + (Math.round(modifierEffect * 10)/10) + "/s");
}
