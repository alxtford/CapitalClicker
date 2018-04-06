var ground;

var store;

var style = {font: "28px VT323", fill: "#fff", tabs: 150};
var noteStyle = {font: "28px VT323", fill: "#fff", align: "center", wordWrap: true, wordWrapWidth: 600};

var notificationStyle = {font: "64px VT323", fill: "#fff", tabs: 150};

var disclaimerText;
var continueButton;

var chickenText;

var userNameText;
var startText;
var adviceText;
var submit;
var currencyTotalText;

var crtFilter;
var crtScreen;
var fadeScreen;

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


function createText(){
  console.log("Text Created");
  currencyTotalText = clientGame.add.text(20,25, userName + "'s Clicks: 0", style);
  currencyTotalText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
  uiLayer.add(currencyTotalText);
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

function destroyDisclaimerText(){
  continueButton.destroy();
  disclaimerText.destroy();
  createStartText();
}

function destroyStartText() {
  if(userNameText.value){
    userName = userNameText.value;
    submit.destroy();
    userNameText.destroy();
    adviceText.destroy();
    startText.setText("CLICK");
    startText.x = 315;
    startText.y = 200;

    saveName(userName);
    fadeScreen.inputEnabled = true;
    }
  }

function updateText(){
  //console.log("Text Updated")
  currencyTotalText.setText(userName + "'s Wealth: §"+ intStringFormatter(currencyTotal));
  if(studyFlag){
  btcText.setText("BTC day change: " + btcDayPercentChange + "%");
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
