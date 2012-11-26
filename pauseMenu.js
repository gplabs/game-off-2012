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
      document.getElementById("options_wrapper").className = "";
      
      document.getElementById("options_left_key").value = game.turnLeftKey;
      document.getElementById("options_right_key").value = game.turnRightKey;
      document.getElementById("options_forward_key").value = game.forwardKey;
      document.getElementById("options_backward_key").value = game.backwardKey;
      document.getElementById("options_grab_key").value = game.grabKey;
      
      
      this.listener = goog.events.listen(game.pauseMenu, goog.events.EventType.KEYDOWN, function (ev) {
        // F5 = Refresh.
        if (ev.event.keyCode === 116) {
          document.location.reload(true);
        } else if (ev.event.keyCode !== 27) { // If not esc.
          document.activeElement.value = window.map[ev.event.keyCode][0];
        }
      });
      
    } else {
      game.bindKeys(
        document.getElementById("options_left_key").value,
        document.getElementById("options_right_key").value,
        document.getElementById("options_forward_key").value,
        document.getElementById("options_backward_key").value,
        document.getElementById("options_grab_key").value
      );
      
      robert_the_lifter.gameScene.removeChild(game.pauseMenu);
      document.getElementById("options_wrapper").className = "hide";
      goog.events.unlistenByKey(this.listener);
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

  var optionsY = 250;

  // Options label.
  var label = new lime.Label("Options")
    .setPosition(game.factoryWidth / 2, optionsY)
    .setFontSize(30);
  this.appendChild(label);
  
  // Options window
  var windowWeight = 200,
      windowWidth = 200;
  var optionsWindow = new lime.Sprite()
    .setPosition((game.factoryWidth / 2) - (windowWidth/2), optionsY+label.measureText().height)
    .setSize(windowWeight, windowWidth)
    .setAnchorPoint(0, 0)
    .setFill("#FFF");
  this.appendChild(optionsWindow);
  
}

goog.inherits(robert_the_lifter.PauseMenu, lime.Layer);
