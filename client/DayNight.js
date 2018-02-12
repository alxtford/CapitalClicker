//class DayNight {

  var dayLengthInternal;

  function sunInit(sprite, daySpeed){
    this.sun = sprite;
    this.sunset(sprite, daySpeed);
  }

  function moonInit(sprite, daySpeed){
    this.moon = sprite;
    this.moonrise(sprite, daySpeed);
  }

  function shadingInit(sprite){
    this.shading = sprite;
  }

  function sunrise(sprite, daySpeed){
    sprite.position.x = this.clientGame.width - (this.clientGame.width / 4);

    this.sunTween = this.clientGame.add.tween(sprite).to( { y: -250 }, daySpeed, null, true);
    this.sunTween.onComplete.add(this.sunset, this, 0, sprite, daySpeed);

    if(this.shading){
      this.shading.forEach((sprite) => {
        this.tweenTint(sprite.sprite, sprite.from, sprite.to, daySpeed);
      });
    }
  }

  function sunset(sprite, daySpeed){
    sprite.position.x = this.clientGame.width / 4;

    this.sunTween = this.clientGame.add.tween(sprite).to( { y: this.clientGame.world.height }, daySpeed, null, true);
    this.sunTween.onComplete.add(this.sunrise, this, 0, sprite, daySpeed);

    if(this.shading){
      this.shading.forEach((sprite) => {
        this.tweenTint(sprite.sprite, sprite.to, sprite.from, daySpeed);
      });
    }
  }

  function moonrise(sprite, daySpeed){

    sprite.position.x = this.clientGame.width - (this.clientGame.width / 4);

    this.moonTween = this.clientGame.add.tween(sprite).to( { y: -350 }, daySpeed, null, true);
    this.moonTween.onComplete.add(this.moonset, this, 0, sprite, daySpeed);
  }

  function moonset(sprite, daySpeed){

    sprite.position.x = this.clientGame.width / 4;

    this.moonTween = this.clientGame.add.tween(sprite).to( { y: this.clientGame.world.height }, daySpeed, null, true);
    this.moonTween.onComplete.add(this.moonrise, this, 0, sprite, daySpeed);
  }

  function tweenTint(spriteToTween, startColor, endColor, duration) {

    let colorBlend = {step: 0};

    this.clientGame.add.tween(colorBlend).to({step: 100}, duration, Phaser.Easing.Default, false)
    .onUpdateCallback(() => {
      spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
    })
    .start()

  }
//}

//module.exports = DayNight;
