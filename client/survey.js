var likertBackground;
var likertBGFlash;
var likertQuestion;
var likertData;

var commentBackground;
var commentBGFlash;
var commentQuestion;
var commentQuestionText = ["What keeps you coming back?",
"What are your opinions on the gameplay experience?",
"Are there any strategies you have employed when playing the game?",
"Have you used any tools to place yourself at an advantage over other players?",
"Have you tried to \"break\" the game?",
"Does the use of external data impact your strategy for the game?",
"Do you find your opinion of the game changing depending on the data used?"];
var commentQuestionNum = 0;
var commentQuestionTextRange = 5;
var commentResponse;
var commentSubmit;
var commentData;
var commentGroup;

var toggle = [];
var toggleSelect = [];
var toggleGroup;
var toggleOffset = 40;

var likertStyle = {font: "18px VT323", fill: "#fff", tabs: 20, align: "center"};
var commentStyle = {font: "20px VT323", fill: "#fff", tabs: 20, align: "center", wordWrap: true, wordWrapWidth:270};


function createComment(){
  uiLayer.add(commentGroup);

  if(studyFlag){
    commentQuestionTextRange = 7;
  }

  commentBackground = commentGroup.create(980, 70, "likertBackground");
  commentBackground.scale.setTo(6);
  commentBGFlash = commentBackground.animations.add("flash");
  commentBackground.animations.play("flash", 10, true);

  commentQuestion = clientGame.add.text(1090, 70, commentQuestionText[commentQuestionNum], commentStyle);
  commentQuestion.lineSpacing = -10;
  commentGroup.add(commentQuestion);

  commentResponse = clientGame.add.inputField(1080, 121, {
    font: "20px VT323",
    fill: "#212121",
    fillAlpha: 1,
    width: 250,
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
  commentGroup.add(commentResponse);

  commentSubmit = clientGame.add.sprite(1350, 123, "menuexitbutton");
  commentSubmit.scale.setTo(10);
  commentSubmit.animations.add("Click");
  commentSubmit.inputEnabled = true;
  commentSubmit.input.useHandCursor = true;
  commentGroup.add(commentSubmit);

  commentSubmitListener();
  clientGame.time.events.add(Phaser.Timer.MINUTE /4, commentShow, this);
}

function onCommentSubmitDown(){
  commentSubmit.animations.play("Click", 0, false);
}

function onCommentSubmitUp(){
  commentSubmit.frame = 0;

  if(commentResponse.value !== ""){
    var dateNow = new Date();

    commentData = {_id: userName, question: commentQuestionText[commentQuestionNum], response: commentResponse.value, timeSubmitted: dateNow.toDateString()};

    socket.emit("commentResult", commentData);

    userDataLocal.surveysCompleted++;
    commentHide();

  }
}

function commentHide(){
  var commentBackgroundTween = clientGame.add.tween(commentBackground).to({x:980}, 1000,Phaser.Easing.Bounce.Out, false);
  commentBackgroundTween.start();

  var commentQuestionTween = clientGame.add.tween(commentQuestion).to({x:1090}, 1000,Phaser.Easing.Bounce.Out, false);
  commentQuestionTween.start();

  var commentResponseTween = clientGame.add.tween(commentResponse).to({x:1080}, 1000,Phaser.Easing.Bounce.Out, false);
  commentResponseTween.start();

  var commentSubmitTween = clientGame.add.tween(commentSubmit).to({x:1350}, 1000,Phaser.Easing.Bounce.Out, false);
  commentSubmitTween.start();

  commentResponse.setText("");
}

function commentShow(){
  commentQuestionNum = Math.floor(Math.random(0) * commentQuestionTextRange);
  commentQuestion.setText(commentQuestionText[commentQuestionNum]);

  var commentBackgroundTween = clientGame.add.tween(commentBackground).to({x:380}, 1000,Phaser.Easing.Bounce.Out, false);
  commentBackgroundTween.start();

  var commentQuestionTween = clientGame.add.tween(commentQuestion).to({x:490}, 1000,Phaser.Easing.Bounce.Out, false);
  commentQuestionTween.start();

  var commentResponseTween = clientGame.add.tween(commentResponse).to({x:480}, 1000,Phaser.Easing.Bounce.Out, false);
  commentResponseTween.start();

  var commentSubmitTween = clientGame.add.tween(commentSubmit).to({x:750}, 1000,Phaser.Easing.Bounce.Out, false);
  commentSubmitTween.start();

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

  clientGame.time.events.add(Phaser.Timer.MINUTE * 3, likertShow, this);
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
