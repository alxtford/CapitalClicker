var menubutton;
var menuexitbutton;
var menubuttonText;
var menubuttonClickAnim;
var menuback;
var menuTween;
var textOptions;
var itemTween = [];
var menuItems = [];


function menuAssetsCreate(){

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
  for(var i = 1; i < userDataLocal.upgradeList.length + 1; i++)
  {
    menuItems[i - 1] = clientGame.add.text(-400, 38 + (48 * i), userDataLocal.upgradeList[i-1].name, menuStyle);
    menuItems[i - 1].setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    uiLayer.add(menuItems[i - 1]);
  }
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
  menuOptionsDraw();
  currencyTotalTextTween.start();

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
  currencyTotalTextTween.start();
  menubutton.visible = true;
  menubuttonText.visible = true;
  menuexitbutton.visible = false

  for(var i = 1; i < userDataLocal.upgradeList.length + 1; i++)
  {
    itemTween[i-1] =  clientGame.add.tween(menuItems[i - 1]).to({x:-400}, 1000,Phaser.Easing.Bounce.Out, false);
    itemTween[i-1].start();
  }
}

function menuOptionsDraw(){

  for(var i = 0; i < userDataLocal.upgradeList.length; i++)
  {
    itemTween[i] =  clientGame.add.tween(menuItems[i]).to({x:60}, 1000,Phaser.Easing.Bounce.Out, false);
    itemTween[i].start();
  }

  //userDataLocal.upgradeList.length()
}
