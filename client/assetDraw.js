var sunSprite;
var moonSprite;

var ground;
var groundSway;

var style = {font: "28px VT323", fill: "#fff", tabs: 150};
var menuStyle = {font: "20px VT323", fill: "#fff", tabs: 40, align: "left"};
var notificationStyle = {font: "64px VT323", fill: "#fff", tabs: 150};
var likertStyle = {font: "18px VT323", fill: "#fff", tabs: 20, align: "center"};


var activeTimeText;
var clickmarker;
var startText;
var submit

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

function fade(){
  fadeScreen = clientGame.add.graphics(0,0);

  fadeScreen.beginFill(0x000000);
  fadeScreen.drawRect(0,0, 800, 600 );
  fadeScreen.endFill();

}


function createText(){
  console.log("Text Created");
  currencyTotalText = clientGame.add.text(20,25, userName + "'s Clicks: 0", style);
  currencyTotalText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

  btcText = clientGame.add.text(20,50, "BTC day change: 0%", style);
  btcText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  // activeTimeText = clientGame.add.text(20,60, ("Current Time: " + localTime.toDateString()), style);
  // activeTimeText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

}

function createStartText(){
  console.log("Start Text Created");
  startText = clientGame.add.text(225, 200, "ENTER USERNAME", notificationStyle);
  startText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

  userNameText = clientGame.add.inputField(clientGame.width / 2 - 100, 300, {
                font: '28px VT323',
                fill: '#212121',
                fillAlpha: 1,
                fontWeight: 'bold',
                forceCase: PhaserInput.ForceCase.upper,
                width: 200,
                max: 20,
                padding: 8,
                borderWidth: 1,
                borderColor: '#000',
                borderRadius: 6,
                placeHolder: '',
                textAlign: 'center',
                zoom: false
            });
            userNameText.setText("");
            userNameText.blockInput = false;
            userNameText.startFocus();


            submit = clientGame.add.text(clientGame.width / 2 - 65, 380, 'Submit', {
              font: '64px VT323',
              fill: '#212121',
              backgroundColor: "#FFFFFF",
            });
            submit.inputEnabled = true;
            submit.input.useHandCursor = true;
            submit.events.onInputDown.add(destroyStartText, this);

}

function destroyStartText() {
    userName = userNameText.value;
    submit.destroy();
    userNameText.destroy();
    startText.setText("CLICK");
    startText.x = 250;
    saveName(userName);
    fadeScreen.inputEnabled = true;
    }

function updateText(){
  //console.log("Text Updated")
  currencyTotalText.setText(userName + "'s Wealth: §"+ intStringFormatter(currencyTotal));
  btcText.setText("BTC day change: " + btcDayPercentChange + "%");
}

function crtDraw(){
  crtFilter = new Phaser.Filter(clientGame, null, CRTFragmentSrc);
  crtFilter.setResolution(canvas_width, canvas_height);

  crtScreen = clientGame.add.sprite();
  crtScreen.width = canvas_width;
  crtScreen.height = canvas_height;
  crtScreen.filters = [ crtFilter ];
  //console.log(crtScreen.filters);
}
