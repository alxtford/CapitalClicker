//class DayNight {

  var dayLengthInternal;
  var sunTween;
  var moonTween;

  // function sunInit(sprite, daySpeed){
  //   this.sun = sprite;
  //   this.sunset(sprite, daySpeed);
  // }
  //
  // function moonInit(sprite, daySpeed){
  //   this.moon = sprite;
  //   this.moonrise(sprite, daySpeed);
  // }
  //
  // function shadingInit(sprite){
  //   this.shading = sprite;
  // }
  //
  // function sunrise(sprite, daySpeed){
  //   console.log("SUNRISE");
  //
  //   sprite.position.x = this.clientGame.width - (this.clientGame.width / 4);
  //
  //   sunTween = this.clientGame.add.tween(sprite).to( { y: -250 }, daySpeed, null, true);
  //   sunTween.onComplete.add(sunset, this, 0, sprite, daySpeed);
  //
  //   if(this.shading){
  //     this.shading.forEach((sprite) => {
  //       this.tweenTint(sprite.sprite, sprite.from, sprite.to, daySpeed);
  //     });
  //   }
  // }
  //
  // function sunset(sprite, daySpeed){
  //   console.log("SUNSET");
  //
  //   sprite.position.x = this.clientGame.width / 4;
  //
  //   sunTween = this.clientGame.add.tween(sprite).to( { y: this.clientGame.world.height }, daySpeed, null, true);
  //   sunTween.onComplete.add(sunrise, this, 0, sprite, daySpeed);
  //
  //   if(this.shading){
  //     this.shading.forEach((sprite) => {
  //       this.tweenTint(sprite.sprite, sprite.to, sprite.from, daySpeed);
  //     });
  //   }
  // }
  //
  // function moonrise(sprite, daySpeed){
  //   console.log("MOONRISE");
  //
  //   sprite.position.x = this.clientGame.width - (this.clientGame.width / 4);
  //
  //   moonTween = this.clientGame.add.tween(sprite).to( { y: -350 }, daySpeed, null, true);
  //   moonTween.onComplete.add(moonset, this, 0, sprite, daySpeed);
  // }
  //
  // function moonset(sprite, daySpeed){
  //   console.log("MOONSET");
  //
  //
  //   sprite.position.x = this.clientGame.width / 4;
  //
  //   moonTween = this.clientGame.add.tween(sprite).to( { y: this.clientGame.world.height }, daySpeed, null, true);
  //   moonTween.onComplete.add(moonrise, this, 0, sprite, daySpeed);
  // }
  //
  // function tweenTint(spriteToTween, startColor, endColor, duration) {
  //
  //   let colorBlend = {step: 0};
  //
  //   this.clientGame.add.tween(colorBlend).to({step: 100}, duration, Phaser.Easing.Default, false)
  //   .onUpdateCallback(() => {
  //     spriteToTween.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
  //   })
  //   .start()
  //
  // }
//}

//module.exports = DayNight;
