var likertBackground;
var likertBGFlash;
var likertQuestion;
var likertData;
var toggle = [];
var toggleSelect = [];
var toggleGroup;
var toggleOffset = 40;
var currentTime;

function createLikert(){
  uiLayer.add(toggleGroup);

  likertBackground = toggleGroup.create(180, 725, "likertBackground");
  likertBackground.scale.setTo(4.5);
  likertBGFlash = likertBackground.animations.add("flash");
  likertBackground.animations.play("flash", 10, true);

  likertQuestion = clientGame.add.text(270, 728, "How satisfied are you with the game experience?\n(1 = Not at all, 5 = Very)",likertStyle);
  likertQuestion.lineSpacing = -8

  for (var i = 0; i < 5; i++)
  {
    toggle[i] = toggleGroup.create(355 + (i * toggleOffset), 770, "likertToggle");
    toggle[i].scale.setTo(2);
    toggle[i].inputEnabled = true;
    toggle[i].input.useHandCursor = true;
    console.log(toggle[i]);

    toggleSelect[i] = toggle[i].animations.add("select");

  }
  toggleGroup.add(likertQuestion);

  likertToggleListener();
}

function onLikertToggleDown(){
  console.log(clientGame.input.activePointer.positionDown.x);
  var normalisedX = (clientGame.input.activePointer.positionDown.x - 350.7)/(525.6 - 350.7);
  var buttonNum = Math.floor(Math.floor(normalisedX * 10)/2);

  toggle[buttonNum].animations.play("select", 0, false);

  resetToggle(buttonNum);

  var dateNow = new Date();

  var likertData = {_id: userName, likertOption: buttonNum, timeSubmitted: dateNow.toDateString()}

  socket.emit("likertResult", likertData);
  likertHide();

  resetToggle(buttonNum);
}

function likertShow(){
  var likertBackgroundTween = clientGame.add.tween(likertBackground).to({y:525}, 1000,Phaser.Easing.Bounce.Out, false);
  likertBackgroundTween.start();
  var likertQuestionTween = clientGame.add.tween(likertQuestion).to({y:528}, 1000,Phaser.Easing.Bounce.Out, false);
  likertQuestionTween.start();

  for(var i = 0; i < toggle.length; i++)
  {
  var toggleTween = clientGame.add.tween(toggle[i]).to({y:570}, 1000,Phaser.Easing.Bounce.Out, false);
  toggleTween.start();
  }
}

function likertHide(){
  var likertBackgroundTween = clientGame.add.tween(likertBackground).to({y:725}, 1000,Phaser.Easing.Bounce.Out, false);
  likertBackgroundTween.start();
  var likertQuestionTween = clientGame.add.tween(likertQuestion).to({y:728}, 1000,Phaser.Easing.Bounce.Out, false);
  likertQuestionTween.start();

  for(var i = 0; i < toggle.length; i++)
  {
  var toggleTween = clientGame.add.tween(toggle[i]).to({y:770}, 1000,Phaser.Easing.Bounce.Out, false);
  toggleTween.start();
  }
}
function resetToggle (buttonNum){
  if(toggle[buttonNum].animations.frame == 1)
    toggle[buttonNum].animations.frame = 0;
  else
  toggle[buttonNum].animations.frame = 1;
}
