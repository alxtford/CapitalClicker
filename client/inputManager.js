var modifierTotal = 1;
var autoClick = 0;

function firstClick() {
  fadeScreen.destroy();
  startText.destroy();
}

function clickListener(sprite){

  if(startFlag)
  {
  currencyTotal += Math.round(1 * (modifierTotal * (1-btcDayPercentChange)));

  // if(startFlag == true)
  // {
  //   userDataLocal.totalClicks ++;
  // }
  lastclick = sprite.name;

  clickmarker = uiLayer.create(0,0,"clickmarker");
  clickmarker.scale.setTo(4);
  click = clickmarker.animations.add("click");
  clickmarker.x = clientGame.input.activePointer.x - 32;
  clickmarker.y = clientGame.input.activePointer.y - 32;
  clickmarker.animations.play("click", 20, false, true);
  console.log("CLICK");
}

}

function inputListenerStart(){
  clientGame.input.onDown.add(clickListener, this);
  fadeScreen.events.onInputDown.add(firstClick, this);

  //Listener for menu open button
  menubutton.events.onInputDown.add(menubuttonClickDown, this);
  menubutton.events.onInputUp.add(menubuttonClickUp, this);

}

function exitButtonListener(){
  //Listener for menu exit button
  menuexitbutton.events.onInputDown.add(OnmenuexitbuttonClickDown,this);
  menuexitbutton.events.onInputUp.add(OnmenuexitbuttonClickUp,this);
}

function listButtonListener(){
  // for(var i = 0; i < userDataLocal.upgradeList.length; i++)
  // {
  //   menuItemsButtons[i].events.onInputDown.add(onMenuOptionsDown,this, 0, i);
  //   menuItemsButtons[i].events.onInputUp.add(onMenuOptionsUp,this, 0, i);
  //   console.log("Listening!");
  // }

  menuItemsGroup.onChildInputDown.add(onMenuOptionsDown, this);
  menuItemsGroup.onChildInputUp.add(onMenuOptionsUp, this);
}
