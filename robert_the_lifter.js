//set main namespace
goog.provide('robert_the_lifter');
goog.provide('robert_the_lifter.Director');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('robert_the_lifter.Game');
goog.require('robert_the_lifter.Oil');
goog.require('robert_the_lifter.PauseMenu');
goog.require('robert_the_lifter.Robert');
goog.require('robert_the_lifter.Piece');
goog.require('robert_the_lifter.ParkingArea');
goog.require('robert_the_lifter.Score');

robert_the_lifter.start = function() {
  var game = new robert_the_lifter.Game();

  robert_the_lifter.Director = new lime.Director(document.getElementById('game'), game.width, game.height);
  robert_the_lifter.Director.isPaused = false;
  robert_the_lifter.Director.setDisplayFPS(false);
  // This will probably be the only scene of the game (beside a menu ?)
    var gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
  
  // The upper parking layer
  var truckParkingLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  var truckParkingArea = new robert_the_lifter.ParkingArea(game);
  truckParkingLayer.appendChild(truckParkingArea);
  gameScene.appendChild(truckParkingLayer);  
  
  // The factory layer.
  var factoryTiles = new lime.fill.Frame('images/ground.png', game.factoryX, game.factoryY, game.factoryWidth, game.factoryHeight);
  var factoryLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  var factoryArea = new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(game.factoryX, game.factoryY)
    .setSize(game.factoryWidth, game.factoryHeight)
    .setFill(factoryTiles);
  factoryLayer.appendChild(factoryArea);
  game.factoryLayer = factoryLayer;
  gameScene.appendChild(factoryLayer);
  
  // start game loops.
  game.start();
  

  // set current scene active
  robert_the_lifter.Director.replaceScene(gameScene);

  var stopSpawning = false;

  // This is the loop for spawning pieces.
  this.timeToNextSpawning = 0;
  game.pieces = [];
  lime.scheduleManager.schedule(spawningPieceLoop, this);
  function spawningPieceLoop(number) {
    if (!robert_the_lifter.Director.isPaused && !stopSpawning) {
      this.timeToNextSpawning -= number;
      if (this.timeToNextSpawning <= 0) {
        this.timeToNextSpawning += game.spawningSpeed;
        game.addPiece();
      }
    }
  }
  
  // Debug event to stop spwning pieces.
  goog.events.listen(robert_the_lifter.Director, goog.events.EventType.KEYDOWN, function (ev) {
    if (ev.event.keyCode == 81) {
      stopSpawning = !stopSpawning;
    }
  });
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('robert_the_lifter.start', robert_the_lifter.start);
