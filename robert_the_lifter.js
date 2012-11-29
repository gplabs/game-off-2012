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
  var factoryTile = new lime.fill.Frame('images/tiles.png', game.tileWidth, 0, game.tileWidth, game.tileHeight);
  for(var i = 0; i < game.factoryNbTileWidth; i ++) {
    for(var j = 0; j < game.factoryNbTileHeight; j ++) {
      var factorySprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition((i)*game.tileWidth, (j)*game.tileHeight+game.truckParkingHeight)
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
}
//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('robert_the_lifter.start', robert_the_lifter.start);
