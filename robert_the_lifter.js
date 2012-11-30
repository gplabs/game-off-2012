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

robert_the_lifter.start = function() {
   
   var music = new robert_the_lifter.Audio("music/music.ogg", true);
          
  // For chrome, images doesn't load on first hit. We show a warning message.
  if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    document.getElementById("chrome_warning").style.display = 'inline-block';
  }
    
  var game = new robert_the_lifter.Game();

  robert_the_lifter.Director = new lime.Director(document.getElementById('game'), game.width, game.height);
  robert_the_lifter.Director.isPaused = false;
  robert_the_lifter.Director.setDisplayFPS(false);
  // This will probably be the only scene of the game (beside a menu ?)
  this.gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
  // The upper parking layer
  var truckParkingLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  var truckParkingArea = new robert_the_lifter.ParkingArea(game, truckParkingLayer);
  this.gameScene.appendChild(truckParkingLayer);
  
  // The factory layer.
  var factoryLayer = new lime.Layer()
    .setAnchorPoint(0, 0);
  this.gameScene.appendChild(factoryLayer);
  var factoryTile = new lime.fill.Frame('images/sprites.png', game.tileWidth, game.tileHeight*4, game.tileWidth, game.tileHeight);
  
  for(var i = 0; i < game.factoryNbTileWidth + game.rightAreaTileWidth; i ++) {
    for(var j = 0; j < game.factoryNbTileHeight; j ++) {
      var y = (j)*game.tileHeight+game.factoryY;
      var factorySprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition((i)*game.tileWidth + game.factoryX, y)
        .setSize(game.tileWidth, game.tileHeight)
        .setFill(factoryTile);
      factoryLayer.appendChild(factorySprite);
    }
  }
  
  game.factoryLayer = factoryLayer;
  
  // start game loops.
  game.start();
  // set current scene active
  robert_the_lifter.Director.replaceScene(this.gameScene);
  
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
      .setPosition(game.factoryWidth / 2, 300)
      .setFontSize(50);
    layer.appendChild(gameOver);
    
    // Let the player input his name.
    var labelCurrentScore = new lime.Label("Your score : " + game.score.getScore())
      .setPosition(game.factoryWidth / 2, 350)
      .setFontSize(30);
    layer.appendChild(labelCurrentScore);
    var labelInstruction = new lime.Label("Type your name and press 'enter'")
      .setPosition(game.factoryWidth / 2, 400)
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
  
  // Build the walls
  this.buildWalls = function() {
    var wallTile = new lime.fill.Frame('images/wall.png', 0, 0, game.tileWidth, game.wallWidth);
    var cornerWallTile = new lime.fill.Frame('images/wall.png', game.tileWidth, 0, game.wallWidth, game.wallWidth);
    var rightWallX = (game.factoryNbTileWidth + game.rightAreaTileWidth)*game.tileWidth + game.wallWidth;
    // Add upper right corner.
    var upRightCornerSprite = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(rightWallX, game.factoryY - game.wallWidth)
      .setSize(game.wallWidth, game.wallWidth)
      .setFill(cornerWallTile);
    factoryLayer.appendChild(upRightCornerSprite);
    
    // Add upper left corner
    var upLeftCornerSprite = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(0, game.parkingHeight*game.tileHeight + game.truckParkingY+game.wallWidth)
      .setRotation(90)
      .setSize(game.wallWidth, game.wallWidth)
      .setFill(cornerWallTile);
    factoryLayer.appendChild(upLeftCornerSprite);
    
    // Add bottom right corner.
    var downRightCornerSprite = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(rightWallX + game.wallWidth, game.factoryHeight + game.factoryY)
      .setRotation(270)
      .setSize(game.wallWidth, game.wallWidth)
      .setFill(cornerWallTile);
    factoryLayer.appendChild(downRightCornerSprite);
    
    // Add bottom left corner
    var downLeftCornerSprite = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(game.wallWidth, game.factoryY + game.factoryHeight+game.wallWidth)
      .setRotation(180)
      .setSize(game.wallWidth, game.wallWidth)
      .setFill(cornerWallTile);
    factoryLayer.appendChild(downLeftCornerSprite);
    
    for(var i = 0; i < game.factoryNbTileWidth + game.rightAreaTileWidth; i ++) {
      var horizontalWallsX = (i)*game.tileWidth + game.truckParkingX;
      // Bottom part of the wall.
      var bottomWallSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(horizontalWallsX, game.factoryY + game.factoryHeight)
        .setSize(game.tileWidth, game.wallWidth)
        .setFill(wallTile);
      factoryLayer.appendChild(bottomWallSprite);
      
      // The upper wall
      var upperWallSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(horizontalWallsX, game.parkingHeight*game.tileHeight + game.truckParkingY)
        .setSize(game.tileWidth, game.wallWidth)
        .setFill(wallTile);
      truckParkingLayer.appendChild(upperWallSprite);
    }
    
    for(var j = 0; j < game.factoryNbTileHeight; j ++) {
      var y = (j)*game.tileHeight+game.factoryY;
      // Add right wall part.
      var rightWallSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(rightWallX, y + game.tileHeight)
        .setRotation(90)
        .setSize(game.tileWidth, game.wallWidth)
        .setFill(wallTile);
      factoryLayer.appendChild(rightWallSprite);
       
      // Add the left wall part.
      var leftWallSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(0, y + game.tileHeight) // add tileheight because of rotation.
        .setRotation(90)
        .setSize(game.tileWidth, game.wallWidth)
        .setFill(wallTile);
      factoryLayer.appendChild(leftWallSprite);
    }
    
    game.blackFog = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(game.factoryWidth + game.factoryX + game.tileWidth, game.factoryY)
      .setSize(game.tileWidth*2, game.tileHeight*game.factoryNbTileHeight)
      .setFill("#000");
    factoryLayer.appendChild(game.blackFog);
    
    var gradiantFogTile = new lime.fill.Frame('images/sprites.png', game.tileWidth*3, game.tileHeight*4, game.tileWidth, game.tileHeight);
    game.gradiantFog = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(game.factoryWidth + game.factoryX, game.factoryY) // add tileheight because of rotation.
      .setSize(game.tileWidth, game.tileHeight*game.factoryNbTileHeight)
      .setFill(gradiantFogTile);
    factoryLayer.appendChild(game.gradiantFog);
  }
  this.buildWalls();
}
//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('robert_the_lifter.start', robert_the_lifter.start);


