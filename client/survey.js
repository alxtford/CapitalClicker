var likertBackground;
var likertBGFlash;

function createLikert(){
  likertBackground = uiLayer.create(200, 525, "likertBackground");
  likertBackground.scale.setTo(4);
  likertBGFlash = likertBackground.animations.add("flash");
  likertBackground.animations.play("flash", 10, true);
}
