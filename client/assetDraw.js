var ground;

var store;
var signs = [];
var signTexts = [];

var style = {font: "28px VT323", fill: "#fff", tabs: 150};
var signStyle = {font: "20px VT323", fill: "#fff", tabs: 150};


var noteStyle = {font: "27px VT323", fill: "#fff", align: "center", wordWrap: true, wordWrapWidth: 600};

var notificationStyle = {font: "64px VT323", fill: "#fff", tabs: 150, align: "center", wordWrap: true, wordWrapWidth: 600};

var disclaimerText;
var continueButton;

var chickenText;
var chickenTextArr = ["CLU*#ING HELL!\n+", "EGG-CELLENT!\n+", "FOWL-BULOUS!\n+", "YOU'RE THE NEST!\n+"];


var userNameText;
var startText;
var adviceText;
var submit;
var currencyTotalText;

var crtFilter;
var crtScreen;
var fadeScreen;

var bgSprite;

var btcText;

function bgDraw() {
bgSprite = backgroundLayer.create(0,0, "background");
bgSprite.height = clientGame.height;
bgSprite.width = clientGame.width;
bgSprite.inputEnabled = true;
}

function groundDraw() {
ground = groundLayer.create(0, 500, "ground");
ground.scale.setTo(10);
wind = ground.animations.add("wind");
ground.animations.play("wind", 1, true);
}

function storeDraw(frameNum) {
  store = storeLayer.create(50,60, "stores");
  store.scale.setTo(10);
  store.frame = frameNum;
}

function signDraw(){
  signs[0] = storeLayer.create(150,340, "sign");
  signs[0].scale.setTo(-6, 6);
  signTexts[0] = clientGame.add.text(15, 352, "City: " + "3km", signStyle);
  storeLayer.add(signTexts[0]);

  signs[1] = storeLayer.create(650,340, "sign");
  signs[1].scale.setTo(6);
  signTexts[1] = clientGame.add.text(655, 352, "City: " + "3km", signStyle);
  storeLayer.add(signTexts[1]);

}

function storeUpdate(frameNum) {
  store.frame = frameNum;
}

function fade(){
  fadeScreen = clientGame.add.graphics(0,0);

  fadeScreen.beginFill(0x000000);
  fadeScreen.drawRect(0,0, 800, 600 );
  fadeScreen.endFill();

  fadeLayer.add(fadeScreen);
}

function chickenWrite(){
  chickenText = clientGame.add.text(210,80, chickenTextArr[Math.floor(Math.random() * chickenTextArr.length)] + intStringFormatter(chickenBonus), notificationStyle);
  chickenText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  var chickenTextTween = clientGame.add.tween(chickenText).to({alpha:0}, 2000,Phaser.Easing.Linear.None, true);
}


function createText(){
  console.log("Text Created");
  currencyTotalText = clientGame.add.text(20,25, userName + "'s Clicks: 0", style);
  currencyTotalText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  uiLayer.add(currencyTotalText);
}

function destroyDisclaimerText(){
  continueButton.destroy();
  disclaimerText.destroy();
  createStartText();
}

function createDisclaimerText(){
  console.log("Disclaimer Text Created!");
  disclaimerText = clientGame.add.text(100, 70, "BY CLICKING YOU CONTINUE, YOU AGREE FOR YOUR GAMEPLAY AND SURVEY DATA TO BE COLLECTED AND STORED IN ACCORDANCE WITH DATA PROTECTION ACT 1998.\n\nTHIS DATA WILL BE USED PURELY FOR RESEARCH PURPOSES. QUESTIONS ABOUT THE STUDY MAY BE DIRECTED TO:\n14524308@students.lincoln.ac.uk.\n\nIF YOU WISH FOR YOUR SUBMISSIONS TO BE REMOVED OR RETRIEVED, PRESENT THE USERNAME YOU USE TO:\n14524308@students.lincoln.ac.uk. ", noteStyle);
  disclaimerText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  fadeLayer.add(disclaimerText);

  continueButton = clientGame.add.text(300, 460, "Continue", {
    font: "64px VT323",
    fill: "#212121",
    backgroundColor: "#FFFFFF",
  });
  continueButton.inputEnabled = true;
  continueButton.input.useHandCursor = true;
  continueButton.events.onInputDown.add(destroyDisclaimerText, this);
}

function destroyStartText() {
  if(userNameText.value){
    userName = userNameText.value;
    submit.destroy();
    userNameText.destroy();
    adviceText.destroy();
    startText.setStyle(noteStyle, true);
    startText.setText("");

    saveName(userName);
    fadeScreen.inputEnabled = true;

    setTimeout(function(){

    if(userDataLocal.coinflip !== 1)
    {
      startText.setText("//INFO:\nYou are now taking part in the study, " + userName + ".\n\nPlease note the game is still in development, so if an error occurs, refreshing the page should fix most issues.\n\n Click to continue, and Click for points!");
    }
    else{
      startText.setText("//INFO:\nYou are now taking part in the study, " + userName + ".\n\nVarious aspects of the game are being changed depending on your local time, location, and the current price of Bitcoin. The mechanics of the game adjust to how these value change.\nPlease note the game is still in development, so if an error occurs, refreshing the page should fix most issues.\n\nClick to continue, and Click for coin!");
    }
    startText.x = 110;
    startText.y = 100;
  }, 500);

    }
  }

function createStartText(){
  console.log("Start Text Created");
  startText = clientGame.add.text(210, 80, "ENTER USERNAME", notificationStyle);
  startText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  fadeLayer.add(startText);

  adviceText = clientGame.add.text(110, 380, "//NOTE:\nUSE A UNIQUE, MEMORABLE USERNAME. THIS WILL BE YOUR LOGIN SHOULD YOU WISH TO RETURN TO A PREVIOUS SAVE, AND WILL BE REQUIRED BY THE RESEARCHER SHOULD YOU WISH TO WITHDRAW FROM THE STUDY.", noteStyle);
  startText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  fadeLayer.add(startText);

  userNameText = clientGame.add.inputField(280, 200, {
                font: "28px VT323",
                fill: "#212121",
                fillAlpha: 1,
                fontWeight: "bold",
                forceCase: PhaserInput.ForceCase.upper,
                width: 200,
                max: 20,
                padding: 8,
                borderWidth: 1,
                borderColor: "#000",
                borderRadius: 6,
                placeHolder: "",
                textAlign: "center",
                zoom: false
              });
   userNameText.setText("");
   userNameText.blockInput = false;
   userNameText.startFocus();


   submit = clientGame.add.text(310, 280, "Submit", {
     font: "64px VT323",
     fill: "#212121",
     backgroundColor: "#FFFFFF",
   });
   submit.inputEnabled = true;
   submit.input.useHandCursor = true;
   submit.events.onInputDown.add(destroyStartText, this);

              // fadeLayer.add(submit);
              // fadeLayer.add(userNameText);
              // fadeLayer.add(startText);
}

function updateText(){
  //console.log("Text Updated")
  currencyTotalText.setText(userName + "'s Wealth: §"+ intStringFormatter(currencyTotal));
  if(studyFlag){
  btcText.setText("Bitcoin Today's change: " + btcDayPercentChange + "%");
  }
}

function crtDraw(){
  crtFilter = new Phaser.Filter(clientGame, null, CRTFragmentSrc);
  crtFilter.setResolution(canvasWidth, canvasHeight);

  crtScreen = clientGame.add.sprite();
  crtScreen.width = canvasWidth;
  crtScreen.height = canvasHeight;
  crtScreen.filters = [ crtFilter ];
  //console.log(crtScreen.filters);
}
