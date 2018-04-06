var likertBackground;
var likertBGFlash;
var likertQuestion;
var likertData;

var commentBackground;
var commentBGFlash;
var commentQuestion;
var commentQuestionText = ["What are your opinions on the gameplay experience?",
                           "What keeps you coming back?",
                           "Are there any strategies you have employed when playing the game?",
                           "Have you used any tools to place yourself at an advantage over other players?",
                           "Have you tried to \"break\" the game?",
                           "Does the use of external data impact your strategy for the game?",
                           "Do you find your opinion of the game changing depending on the local data used?"];
var commentQuestionTextRange;
var commentResponse;
var commentSubmit;
var commentData;

var toggle = [];
var toggleSelect = [];
var toggleGroup;
var toggleOffset = 40;

var likertStyle = {font: "18px VT323", fill: "#fff", tabs: 20, align: "center"};

function createComment(){
  uiLayer.add(toggleGroup);

  commentBackground = toggleGroup.create(450, 100, "likertBackground");
  commentBackground.scale.setTo(4.5);
  commentBGFlash = commentBackground.animations.add("flash");
  commentBackground.animations.play("flash", 10, true);

  commentQuestion = clientGame.add.text(270, 728, commentQuestionText[0], likertStyle);
  commentQuestion.lineSpacing = -8;

  commentResponse = clientGame.add.inputField(280, 120, {
                font: "28px VT323",
                fill: "#212121",
                fillAlpha: 1,
                width: 200,
                padding: 6,
                borderWidth: 0,
                borderColor: "#000",
                borderRadius: 6,
                placeHolder: "",
                textAlign: "left",
                zoom: false
              });
   commentResponse.setText("");
   commentResponse.blockInput = false;

}

function createLikert(){
  uiLayer.add(toggleGroup);

  likertBackground = toggleGroup.create(180, 725, "likertBackground");
  likertBackground.scale.setTo(4.5);
  likertBGFlash = likertBackground.animations.add("flash");
  likertBackground.animations.play("flash", 10, true);

  likertQuestion = clientGame.add.text(270, 728, "How satisfied are you with the game experience?\n(1 = Not at all, 5 = Very)",likertStyle);
  likertQuestion.lineSpacing = -8;

  for (var i = 0; i < 5; i++)
  {
    toggle[i] = toggleGroup.create(355 + (i * toggleOffset), 770, "likertToggle");
    toggle[i].scale.setTo(2);
    toggle[i].inputEnabled = true;
    toggle[i].input.useHandCursor = true;

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

  likertData = {_id: userName, likertOption: buttonNum, timeSubmitted: dateNow.toDateString()};

  socket.emit("likertResult", likertData);
  likertHide();

  userDataLocal.surveysCompleted++;

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

  clientGame.time.events.add(Phaser.Timer.MINUTE * 5, likertShow, this);

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
  if(toggle[buttonNum].animations.frame == 1){
    toggle[buttonNum].animations.frame = 0;
  }
  else{
  toggle[buttonNum].animations.frame = 1;
  }
}
