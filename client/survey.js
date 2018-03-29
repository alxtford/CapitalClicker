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

  likertBackground = toggleGroup.create(180, 525, "likertBackground");
  likertBackground.scale.setTo(4.5);
  likertBGFlash = likertBackground.animations.add("flash");
  likertBackground.animations.play("flash", 10, true);

  likertQuestion = clientGame.add.text(270, 528, "How satisfied are you with the game experience?\n(1 = Not at all, 5 = Very)",likertStyle);
  likertQuestion.lineSpacing = -8

  for (var i = 0; i < 5; i++)
  {
    toggle[i] = toggleGroup.create(355 + (i * toggleOffset), 570, "likertToggle");
    toggle[i].scale.setTo(2);
    toggle[i].inputEnabled = true;
    toggle[i].input.useHandCursor = true;
    console.log(toggle[i]);

    toggleSelect[i] = toggle[i].animations.add("select");

  }

  likertToggleListener();
}

function onLikertToggleDown(){
  console.log(clientGame.input.activePointer.positionDown.x);
  var normalisedX = (clientGame.input.activePointer.positionDown.x - 350.7)/(525.6 - 350.7);
  var buttonNum = Math.floor(Math.floor(normalisedX * 10)/2);

  toggle[buttonNum].animations.play("select", 0, false);

  if(toggle[buttonNum].animations.frame == 1)
    toggle[buttonNum].animations.frame = 0;
  else
  toggle[buttonNum].animations.frame = 1;

  var dateNow = new Date();

  var likertData = {_id: userName, likertOption: buttonNum, timeSubmitted: dateNow.toDateString()}

  socket.emit("likertResult", likertData);


}
