goog.provide('robert_the_lifter.PauseMenu');

goog.require('lime.Scene');
goog.require('lime.Layer');

robert_the_lifter.PauseMenu = function(game) {
  goog.base(this);
  this.game = game;
  this.game.isPaused = false;

  function pauseEvent() {

    game.isPaused = !game.isPaused;

    if (game.isPaused) {
      robert_the_lifter.gameScene.appendChild(game.pauseMenu);
    } else {
      robert_the_lifter.gameScene.removeChild(game.pauseMenu);
    }
  }
  KeyboardJS.on("esc", pauseEvent);

  // blur
  var blur = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(0, 0)
      .setSize(game.width, game.height)
      .setFill(255,255,255,.5);
  this.appendChild(blur);

  var label = new lime.Label("Paused").setPosition(500,300);
  this.appendChild(label);
}

goog.inherits(robert_the_lifter.PauseMenu, lime.Layer);
