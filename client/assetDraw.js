var sunSprite;
var moonSprite;

var ground;
var groundSway;

var style = {font: "28px VT323", fill: "#fff", tabs: 150};
var notificationStyle = {font: "128px VT323", fill: "#fff", tabs: 150};

var activeTimeText;
var clickmarker;
var clickText;

var crtFilter;
var crtScreen;
var fadeScreen;

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
  fadeScreen.inputEnabled = true;

  fadeScreen.beginFill(0x000000);
  fadeScreen.drawRect(0,0, 800, 600 );
  fadeScreen.endFill();

  fadeScreen.inputEnabled = true;
}


function createText(){
  console.log("Text Created");
  currencyTotalText = clientGame.add.text(20,30, "Clicks: 0", style);
  currencyTotalText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  // activeTimeText = clientGame.add.text(20,60, ("Current Time: " + localTime.toDateString()), style);
  // activeTimeText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

}

function createStartText(){
  console.log("Start Text Created");
  clickText = clientGame.add.text(250, 200, "Click", notificationStyle);
  clickText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
}

function updateText(){
  //console.log("Text Updated")
  currencyTotalText.setText("Clicks: "+ currencyTotal);
}

function crtDraw(){
  crtFilter = new Phaser.Filter(clientGame, null, CRTFragmentSrc);
  crtFilter.setResolution(canvas_width, canvas_height);

  crtScreen = clientGame.add.sprite();
  crtScreen.width = canvas_width;
  crtScreen.height = canvas_height;
  crtScreen.filters = [ crtFilter ];
  //console.log(crtScreen.filters);

  console.log(shaderLayer);
}
