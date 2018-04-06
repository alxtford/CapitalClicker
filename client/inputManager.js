var modifierTotal = 1;
var click;
var lastclick;
var clickmarker;


function firstClick() {
  fadeScreen.destroy();
  startText.destroy();
}

function clickListener(sprite){

  if(startFlag)
  {

  currencyTotal += 1 + Math.round(1 * (modifierTotal * btcPlusMinus(1+btcDayPercentChange)));

  userDataLocal.totalClicks ++;
  // if(startFlag == true)
  // {
  //   userDataLocal.totalClicks ++;
  // }
  lastclick = sprite.name;
  storeUpdate(frameGet());

  clickmarker = uiLayer.create(0,0,"clickmarker");
  clickmarker.scale.setTo(4);
  click = clickmarker.animations.add("click");
  clickmarker.x = clientGame.input.activePointer.x - 32;
  clickmarker.y = clientGame.input.activePointer.y - 32;
  clickmarker.animations.play("click", 20, false, true);
  clickEffect.play();
}

}

function inputListenerStart(){
  clientGame.input.onDown.add(clickListener, this);
  fadeScreen.events.onInputDown.add(firstClick, this);

  //Listener for menu open button
  menubutton.events.onInputDown.add(menubuttonClickDown, this);
  menubutton.events.onInputUp.add(menubuttonClickUp, this);

}

function helpButtonListener(){
  //Listener for menu exit button
  menuHelpButton.events.onInputDown.add(OnmenuhelpbuttonClickDown,this);
  menuHelpButton.events.onInputUp.add(OnmenuhelpbuttonClickUp,this);
}

function helpExitButtonListener(){
  menuHelpExitbutton.events.onInputDown.add(OnmenuHelpExitbuttonClickDown,this);
  menuHelpExitbutton.events.onInputUp.add(OnmenuHelpExitbuttonClickUp,this);
}

function exitButtonListener(){
  //Listener for menu exit button
  menuexitbutton.events.onInputDown.add(OnmenuexitbuttonClickDown,this);
  menuexitbutton.events.onInputUp.add(OnmenuexitbuttonClickUp,this);
}

function listButtonListener(){

  menuItemsGroup.onChildInputDown.add(onMenuOptionsDown, this);
  menuItemsGroup.onChildInputUp.add(onMenuOptionsUp, this);
}

function likertToggleListener(){
  toggleGroup.onChildInputDown.add(onLikertToggleDown,this);
}

function commentSubmitListener(){
  commentSubmit.events.onInputDown.add(onCommentSubmitDown,this);
  commentSubmit.events.onInputUp.add(onCommentSubmitUp,this);
}
