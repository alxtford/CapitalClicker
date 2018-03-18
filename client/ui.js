function menuAssetsCreate(){

  menubutton = uiLayer.create(10, 80, "menubutton");
  menubutton.scale.setTo(8);
  menubuttonClickAnim = menubutton.animations.add("click");

  menubutton.inputEnabled = true;
  menubutton.events.onInputDown.add(menubuttonClickDown, this);
  menubutton.events.onInputUp.add(menubuttonClickUp, this);
  menubutton.input.priorityID = 1;
  menubutton.input.useHandCursor = true;

  menubuttonText = clientGame.add.text(60,85, "Menu", style);
  menubuttonText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  uiLayer.add(menubuttonText);

  menuback = uiLayer.create(-400, 20, "menuback");
  menuback.scale.setTo(8);

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
  currencyTotalTextTween.start();
}

function menuexitbuttonCreate(){
  menuexitbutton = uiLayer.create(270, 36, "menuexitbutton");
  menuexitbutton.scale.setTo(8);
  menuexitbutton.animations.add("Click");
  menuexitbutton.inputEnabled = true;
  menuexitbutton.input.useHandCursor = true;
  menuexitbutton.events.onInputDown.add(OnmenuexitbuttonClickDown,this);
  menuexitbutton.events.onInputUp.add(OnmenuexitbuttonClickUp,this);
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
}
