//set main namespace
goog.provide('robert_the_lifter');
goog.provide('robert_the_lifter.Director');

//get requirements
goog.require('lime.audio.Audio');
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('robert_the_lifter.Audio');
goog.require('robert_the_lifter.Game');
goog.require('robert_the_lifter.PauseMenu');
goog.require('robert_the_lifter.Robert');
goog.require('robert_the_lifter.Piece');
goog.require('robert_the_lifter.ParkingArea');
goog.require('robert_the_lifter.Score');
goog.require('robert_the_lifter.Media');
goog.require('robert_the_lifter.Constants');

robert_the_lifter.start = function() {
  var constants = new robert_the_lifter.Constants();
  var media = new robert_the_lifter.Media(constants, robert_the_lifter.startGame);
  
  var game = new robert_the_lifter.Game(constants);
  this.gameObject = game;
  game.Media = media;

  game.music = new robert_the_lifter.Audio("music/music.ogg", true);

  // This will probably be the only scene of the game (beside a menu ?)
  this.gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
  
  // The upper parking layer
  var truckParkingLayer = new robert_the_lifter.ParkingArea(game);
  this.gameScene.appendChild(truckParkingLayer);
  
  // The factory layer.
  var factoryLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  this.gameScene.appendChild(factoryLayer);
  
  // Building the factory working area.
  for(var i = 0; i < constants.FactoryNbTileWidth + constants.RightAreaTileWidth; i ++) {
    for(var j = 0; j < constants.FactoryNbTileHeight; j ++) {
      var y = (j)*constants.TileHeight + constants.FactoryY;
      var factorySprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition((i) * constants.TileWidth + constants.FactoryX, y)
        .setSize(constants.TileWidth, constants.TileHeight)
        .setFill(media.FactoryTile);
      factoryLayer.appendChild(factorySprite);
    }
  }
  
  game.factoryLayer = factoryLayer;
  
  // Build the walls
  this.buildWalls = function() {
    var rightWallX = (constants.FactoryNbTileWidth + constants.RightAreaTileWidth)*constants.TileWidth + constants.WallWidth;
    // Add upper right corner.
    var upRightCornerSprite = game.Media.GetWallCornerSprite(rightWallX, constants.FactoryY - constants.WallWidth, 0);
    factoryLayer.appendChild(upRightCornerSprite);
    
    // Add upper left corner
    var upLeftCornerSprite = game.Media.GetWallCornerSprite(0, constants.ParkingHeight * constants.TileHeight + constants.TruckParkingY + constants.WallWidth, 90);
    factoryLayer.appendChild(upLeftCornerSprite);
    
    // Add bottom right corner.
    var downRightCornerSprite = game.Media.GetWallCornerSprite(rightWallX + constants.WallWidth, constants.FactoryHeight + constants.FactoryY, 270);
    factoryLayer.appendChild(downRightCornerSprite);
    
    // Add bottom left corner
    var downLeftCornerSprite = game.Media.GetWallCornerSprite(constants.WallWidth, constants.FactoryY + constants.FactoryHeight+constants.WallWidth, 180);
    factoryLayer.appendChild(downLeftCornerSprite);
    
    for(var i = 0; i < constants.FactoryNbTileWidth + constants.RightAreaTileWidth; i ++) {
      var horizontalWallsX = (i)*constants.TileWidth + constants.TruckParkingX;
      // Bottom part of the wall.
      var bottomWallSprite = game.Media.GetWallSprite(horizontalWallsX, constants.FactoryY + constants.FactoryHeight);
      factoryLayer.appendChild(bottomWallSprite);
      
      // The upper wall
      var upperWallSprite = game.Media.GetWallSprite(horizontalWallsX, constants.ParkingHeight*constants.TileHeight + constants.TruckParkingY);
      truckParkingLayer.appendChild(upperWallSprite);
    }
    
    for(var j = 0; j < constants.FactoryNbTileHeight; j ++) {
      var y = (j)*constants.TileHeight+constants.FactoryY;
      // Add right wall part.
      var rightWallSprite = game.Media.GetWallSprite(rightWallX, y + constants.TileHeight)
        .setRotation(90);
      factoryLayer.appendChild(rightWallSprite);
       
      // Add the left wall part.
      var leftWallSprite = game.Media.GetWallSprite(0, y + constants.TileHeight)// add tileheight because of rotation.
        .setRotation(90);
      factoryLayer.appendChild(leftWallSprite);
    }
    
    game.blackFog = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(constants.FactoryWidth + constants.FactoryX + constants.TileWidth, constants.FactoryY)
      .setSize(constants.TileWidth*2, constants.TileHeight*constants.FactoryNbTileHeight)
      .setFill("#000");
    factoryLayer.appendChild(game.blackFog);
    
    // add tileheight because of rotation.
    game.gradiantFog = game.Media.GetGradiantFogSprite(constants.FactoryWidth + constants.FactoryX, constants.FactoryY);
    factoryLayer.appendChild(game.gradiantFog);
  }
  this.buildWalls();
  
  /**
   * End game behavior.
   */
  this.endGame = function() {
    var layer = new lime.Layer()
      .setAnchorPoint(0, 0);

    // blur
    var area = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(0, 0)
      .setSize(game.width, game.height)
      .setFill(255,255,255,.5);
    layer.appendChild(area);
    
    // Game Over.
    var gameOver = new lime.Label("Game Over")
      .setPosition(constants.FactoryWidth / 2, 300)
      .setFontSize(50);
    layer.appendChild(gameOver);
    
    // Let the player input his name.
    var labelCurrentScore = new lime.Label("Your score : " + game.score.getScore())
      .setPosition(constants.FactoryWidth / 2, 350)
      .setFontSize(30);
    layer.appendChild(labelCurrentScore);
    var labelInstruction = new lime.Label("Type your name and press 'enter'")
      .setPosition(constants.FactoryWidth / 2, 400)
      .setFontSize(20);
    layer.appendChild(labelInstruction);
    
    var input = document.createElement('input');
    input.type = "text";
    input.id = "highscore-name";
    input.onkeydown = function(event) {
      var keyCode = ('which' in event) ? event.which : event.keyCode;
      if (keyCode == 13) { //Enter
        game.score.logNewScore(input.value);
        showHighscores();
      }
      
    }
    document.getElementById('game').appendChild(input);
    
    function showHighscores() {
      // remove input + labels.
      layer.removeChild(labelInstruction);
      layer.removeChild(labelCurrentScore);
      input.parentNode.removeChild(input);
      
      var highscores = game.score.getHighscores();
      if (!highscores) {
        var label = new lime.Label("Your browser does not support HTML5 Local Storage.")
            .setPosition(525, 375)
            .setAnchorPoint(0,0)
            .setFontSize(20);
          layer.appendChild(label);
      } else {
        var nextScoreY = 375;
        for (var i in highscores) {
          var noLabel = new lime.Label(parseInt(i)+1)
            .setPosition(525, nextScoreY)
            .setAnchorPoint(0,0)
            .setFontSize(20);
          layer.appendChild(noLabel);

          var nameLabel = new lime.Label(highscores[i].name)
            .setPosition(555, nextScoreY)
            .setAnchorPoint(0,0)
            .setFontSize(20);
          layer.appendChild(nameLabel);

          // Make sure the score never overlap the name.
          var scoreXPos = 725;
          if (nameLabel.getPosition().x + nameLabel.measureText().width > scoreXPos) {
            scoreXPos = nameLabel.getPosition().x + nameLabel.measureText().width +15;
          }

          var scoreLabel = new lime.Label(highscores[i].score)
            .setPosition(scoreXPos, nextScoreY)
            .setAnchorPoint(0,0)
            .setFontSize(20);
          layer.appendChild(scoreLabel);

          nextScoreY += (scoreLabel.measureText().height * 1.1);
        }
      }
    }
    
    this.gameScene.appendChild(layer);
  }
}

robert_the_lifter.startGame = function() {
  // start game loops.
  robert_the_lifter.gameObject.start();
  robert_the_lifter.Director = new lime.Director(document.getElementById('game'), robert_the_lifter.gameObject.width, robert_the_lifter.gameObject.height);
  robert_the_lifter.Director.isPaused = false;
  robert_the_lifter.Director.setDisplayFPS(false);
  robert_the_lifter.Director.replaceScene(robert_the_lifter.gameScene);
}
//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('robert_the_lifter.start', robert_the_lifter.start);


