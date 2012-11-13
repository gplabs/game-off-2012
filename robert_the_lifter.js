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
goog.require('robert_the_lifter.Game');
goog.require('robert_the_lifter.Robert');
goog.require('robert_the_lifter.Piece');
goog.require('robert_the_lifter.ParkingArea');

robert_the_lifter.start = function() {
  var game = new robert_the_lifter.Game();
  
  var director = new lime.Director(document.getElementById('game'), game.width, game.height);
  director.setDisplayFPS(false);
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
  director.replaceScene(gameScene);

  // This is the loop for spawning pieces.
//  this.timeToNextSpawning = 0;
//  game.pieces = [];
//  lime.scheduleManager.schedule(spawningPieceLoop, this);
//  function spawningPieceLoop(number) {
//    this.timeToNextSpawning -= number;
//    if (this.timeToNextSpawning <= 0) {
//      this.timeToNextSpawning += game.spawningSpeed;
      game.addPiece();
//    }
//  }

//  // Register to keyboard event for Robert to grab a piece.
//  goog.events.listen(game.robert, goog.events.EventType.KEYDOWN, function (ev) {
//    if (ev.event.keyCode == 32) { // 32 = spacebar.
//      if (! game.robert.hasPiece) {
//        var foundPiece = false;
//        for (var i = 0; i < game.pieces.length && !foundPiece; i++) {
//          foundPiece = game.robert.isThisPieceInFrontOfMe(game.pieces[i]);
//        }
//        if (foundPiece) {
//          game.pieces[i - 1].isFreeFalling = false;
//          game.robert.grabbedPiece = game.pieces[i - 1];
//          if (game.piecesBlock.pieces.indexOf(game.pieces[i - 1]) > -1) {
//            game.piecesBlock.removePiece(game.pieces[i - 1]);
//          }
//          game.robert.hasPiece = true;
//        }
//      } else {
//        game.robert.grabbedPiece.isFreeFalling = true;
//        game.robert.grabbedPiece = null;
//        game.robert.hasPiece = false;
//      }
//    }
//  });

  
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('robert_the_lifter.start', robert_the_lifter.start);
