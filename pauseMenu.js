goog.provide('robert_the_lifter.PauseMenu');

goog.require('lime.Scene');
goog.require('lime.Layer');

robert_the_lifter.PauseMenu = function(game) {
  goog.base(this);
  this.game = game;
  this.game.isPaused = false;
  this.extraPauseKey = "p";
  
  var frame = this;
  
  this.optionsY = 300;
  
  this.pauseEvent = function() {
    game.isPaused = !game.isPaused;

    if (game.isPaused) {
      frame.initPauseMenu();
      robert_the_lifter.gameScene.appendChild(game.pauseMenu);
      
    } else {
      frame.removeCurrentMenu();
      robert_the_lifter.gameScene.removeChild(game.pauseMenu);
    }
  }
  
  KeyboardJS.on("esc", this.pauseEvent);
  KeyboardJS.on(this.extraPauseKey, this.pauseEvent);

  // blur
  frame.blur = new lime.Sprite()
      .setAnchorPoint(0,0)
      .setPosition(0, 0)
      .setSize(game.width, game.height)
      .setFill(255,255,255,.5);
  frame.appendChild(frame.blur);
  
  
//  var optionsWindow = new lime.Sprite()
//    .setPosition((game.factoryWidth / 2) - (windowWidth/2), optionsY+label.measureText().height)
//    .setSize(windowHeight, windowWidth)
//    .setAnchorPoint(0, 0)
//    .setFill("#FFF");
//  this.appendChild(optionsWindow);
  
}

goog.inherits(robert_the_lifter.PauseMenu, lime.Layer);

robert_the_lifter.PauseMenu.prototype.initPauseMenu = function() {
  this.removeCurrentMenu();
  var height = 226,
      width = 446;
  var x = (this.game.factoryWidth / 2) - (width/2);
  var menuTile = new lime.fill.Frame('images/pause_menu.png', 0, 0, width, height);
  this.currentMenu = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(x, this.optionsY)
        .setFill(menuTile);
  this.appendChild(this.currentMenu);
  
  this.currentMenuEvent = function(e) {
    console.log("Pause Menu clicked");
    if(e.event.offsetX >= x && e.event.offsetX <= (x + width) &&
       e.event.offsetY >= this.optionsY && e.event.offsetY <= (this.optionsY + height)
       ) {
      if (e.event.offsetY <= 360) {
        this.initOptionsMenu();
      } else if (e.event.offsetY <= 435) {
        console.log("Credits");
      } else {
        this.unpause();
      }
    }
  }
  goog.events.listen(this.game.pauseMenu,['mousedown','touchstart'], this.currentMenuEvent);
}

robert_the_lifter.PauseMenu.prototype.initOptionsMenu = function() {
  this.removeCurrentMenu();
  var width = 446,
      height = 305;
  
  var x = (this.game.factoryWidth / 2) - (width/2);
  
  var statusX = x + 225,
      musicStatusY = this.optionsY + 10,
      sfxStatusY = this.optionsY + 90;
  
  var menuTile = new lime.fill.Frame('images/options_menu.png', 0, 0, width, height);
  this.currentMenu = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(x, this.optionsY)
        .setFill(menuTile);
  this.appendChild(this.currentMenu);
  
  this.musicStatus = this.getStatus(this.game.musicSound, statusX, musicStatusY);
  this.appendChild(this.musicStatus);
  
  this.sfxStatus = this.getStatus(this.game.sfx, statusX, sfxStatusY);
  this.appendChild(this.sfxStatus);
  
  this.currentMenuEvent = function(e) {
    if(e.event.offsetX >= x && e.event.offsetX <= (x + width) &&
       e.event.offsetY >= this.optionsY && e.event.offsetY <= (this.optionsY + height)
       ) {
      if (e.event.offsetY <= 360) {
        this.game.switchMusicSound();
        this.removeChild(this.musicStatus);
        this.musicStatus = this.getStatus(this.game.musicSound, statusX, musicStatusY);
        this.appendChild(this.musicStatus);
      } else if (e.event.offsetY <= 440) {
        this.game.switchSFXSound();
        this.removeChild(this.sfxStatus);
        this.sfxStatus = this.getStatus(this.game.sfx, statusX, sfxStatusY);
        this.appendChild(this.sfxStatus);
      } else if(e.event.offsetY <= 515){
        if (!this.bindingVisible) {
          this.showKeyBindingMenu();
        } else {
          this.hideKeyBindingMenu();
        }
        
      } else {
        this.initPauseMenu();
      }
    }
  }
  goog.events.listen(this.game.pauseMenu,['mousedown','touchstart'], this.currentMenuEvent);
}

robert_the_lifter.PauseMenu.prototype.showKeyBindingMenu = function() {
  this.bindingVisible = true;
  
  document.getElementById("options_wrapper").className = "";
  document.getElementById("options_left_key").value = this.game.turnLeftKey;
  document.getElementById("options_right_key").value = this.game.turnRightKey;
  document.getElementById("options_forward_key").value = this.game.forwardKey;
  document.getElementById("options_backward_key").value = this.game.backwardKey;
  document.getElementById("options_grab_key").value = this.game.grabKey;
  document.getElementById("options_pause_key").value = this.extraPauseKey;
  
  // Something prevent the fields from taking focus onClick, so we force it.
  document.getElementById("options_left_key").onclick=repairFocus;
  document.getElementById("options_right_key").onclick=repairFocus;
  document.getElementById("options_forward_key").onclick=repairFocus;
  document.getElementById("options_backward_key").onclick=repairFocus;
  document.getElementById("options_grab_key").onclick=repairFocus;
  document.getElementById("options_pause_key").onclick=repairFocus;
  function repairFocus() {
    this.focus();
  }
  
  this.keyBindingEvent = function(ev) {
    // F5 = Refresh.
    if (ev.event.keyCode === 116) {
      document.location.reload(true);
    } else if (ev.event.keyCode !== 27) { // If not esc.
      document.activeElement.value = window.map[ev.event.keyCode][0];
    }
  };
  goog.events.listen(this.game.pauseMenu, goog.events.EventType.KEYDOWN, this.keyBindingEvent);
}

robert_the_lifter.PauseMenu.prototype.hideKeyBindingMenu = function() {
  this.bindingVisible = false;
  this.game.bindKeys(
    document.getElementById("options_left_key").value,
    document.getElementById("options_right_key").value,
    document.getElementById("options_forward_key").value,
    document.getElementById("options_backward_key").value,
    document.getElementById("options_grab_key").value
  );
  var newPauseKey = document.getElementById("options_pause_key").value;
  if (newPauseKey !== "") {
    KeyboardJS.clear(this.extraPauseKey);
    this.extraPauseKey = newPauseKey;
    KeyboardJS.on(this.extraPauseKey, this.pauseEvent);
  }
  
  if (typeof this.keyBindingEvent != 'undefined') {
    goog.events.unlisten(this.game.pauseMenu, goog.events.EventType.KEYDOWN, this.keyBindingEvent);
  }
  
  document.getElementById("options_wrapper").className = "hide";
}

robert_the_lifter.PauseMenu.prototype.removeCurrentMenu = function() {
  if (this.currentMenu) {
    this.removeChild(this.currentMenu);
  }
  
  if (this.musicStatus) {
    this.removeChild(this.musicStatus);
  }
  
  if (this.sfxStatus) {
    this.removeChild(this.sfxStatus);
  }
  
  this.hideKeyBindingMenu();
  goog.events.unlisten(this.game.pauseMenu,['mousedown','touchstart'], this.currentMenuEvent);
}

/**
 * Get a sprite of the on/off image.
 */
robert_the_lifter.PauseMenu.prototype.getStatus = function(status, x, y) {
  var file = "images/off_status.png";
  if (status) {
    file = "images/on_status.png";
  }
  var statusFrame = new lime.fill.Frame(file, 0, 0, 167, 37);
  var statusSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(x, y)
        .setFill(statusFrame);
  return statusSprite;
}

robert_the_lifter.PauseMenu.prototype.unpause = function() {
  this.removeCurrentMenu();
  this.game.isPaused = false;
  robert_the_lifter.gameScene.removeChild(this.game.pauseMenu);
}