//set main namespace
goog.provide('robert_the_lifter');

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
goog.require('robert_the_lifter.Robert');
goog.require('robert_the_lifter.Piece');

robert_the_lifter.start = function() {
  var game = {
    width: 960,
    height: 640,
    tileWidth: 32,
    tileHeight: 32,
    spawningSpeed: 8000,
    pieces: []
  };
  game.leftParkingHeight = game.tileWidth*20;
  game.leftParkingWidth = game.tileHeight*10;
  game.leftParkingX = 0;
  game.leftParkingY = 0;
  
  game.factoryHeight = game.tileWidth*20;
  game.factoryWidth = game.tileHeight*10;
  game.factoryX = game.leftParkingWidth;
  game.factoryY = 0;
  
  var director = new lime.Director(document.getElementById('game'), game.width, game.height);
  director.setDisplayFPS(false);
  // This will probably be the only scene of the game (beside a menu ?)
  var gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
  
  // The left parking layer
  var leftParkingLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  // Left parking area
  var leftParkingArea = new lime.Sprite()
    .setAnchorPoint(0,0)
    .setPosition(0, 0)
    .setSize(game.leftParkingWidth, game.leftParkingHeight)
    .setFill('#000');
  leftParkingLayer.appendChild(leftParkingArea);
  gameScene.appendChild(leftParkingLayer);  
  
  // The factory layer.
  var factoryLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  gameScene.appendChild(factoryLayer);
  
  // Init Robert :P
  var robert = new robert_the_lifter.Robert(game);
  factoryLayer.appendChild(robert);

  // This is the game main loop (For dropping down pieces.) Currently not working
  this.timeToNextSpawning = 0;
  game.pieces = [];
  lime.scheduleManager.schedule(spawningPieceLoop, this);

  function spawningPieceLoop(number) {
    this.timeToNextSpawning -= number;
    if (this.timeToNextSpawning <= 0) {
      this.timeToNextSpawning += game.spawningSpeed;
      var i = game.pieces.push(new robert_the_lifter.Piece(factoryLayer, game)) - 1;
      game.pieces[i].key = i;
    }
  }

  // Register to keyboard event for Robert to grab a piece.
  goog.events.listen(robert, goog.events.EventType.KEYDOWN, function (ev) {
    if (ev.event.keyCode == 32) { // 32 = spacebar.
      var foundPiece = false;
      for (var i = 0; i < game.pieces.length && !foundPiece; i++) {
        foundPiece = robert.isThisPieceInFrontOfMe(game.pieces[i]);
      }
      if (foundPiece) {
        game.pieces[i].isGrabbed = true;
        robert.grabbedPiece = game.pieces[i];
      }
    }
  });

  // set current scene active
  director.replaceScene(gameScene);
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('robert_the_lifter.start', robert_the_lifter.start);
