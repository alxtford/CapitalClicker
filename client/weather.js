var fog;
var fogSprite;
var fogTween;

var rainParticle;
var rainEmitter;

function addFog(){
  fog = clientGame.add.bitmapData(800, 600);
  fog.ctx.rect(0, 0, 800, 600);
  fog.ctx.fillStyle = "#cbc9c8";
  fog.ctx.fill();

  fogSprite = fogLayer.create(0, 0, fog);

  fogSprite.alpha = 0;
  fogTween = clientGame.add.tween(fogSprite).to( { alpha: 1-(visibility/10) }, 3000, Phaser.Easing.Linear.None, true);
  //fogTween.start();
  console.log(fogSprite);
}

function addRain(){
  rainParticle = clientGame.add.bitmapData(15, 50);
  //rainLayer.add(rainParticle);
  rainParticle.ctx.rect(0, 0, 15, 50);
  rainParticle.ctx.fillStyle = "#9cc9de";
  rainParticle.ctx.fill();

  rainEmitter = clientGame.add.emitter(400, -200, 400);
  rainLayer.add(rainEmitter);

    rainEmitter.width = 800;
    rainEmitter.angle = 10;

    rainEmitter.makeParticles(rainParticle);

    rainEmitter.minParticleScale = 0.1;
    rainEmitter.maxParticleScale = 0.3* precipProbability;

    rainEmitter.setYSpeed(600, 1000);
    rainEmitter.setXSpeed(-5, 5);

    rainEmitter.minRotation = 0;
    rainEmitter.maxRotation = 0;

    rainEmitter.start(false, 1600, 5* precipProbability, 0);
}
