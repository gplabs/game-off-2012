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
}

goog.inherits(robert_the_lifter.PauseMenu, lime.Layer);

robert_the_lifter.PauseMenu.prototype.initPauseMenu = function() {
  this.removeCurrentMenu();
  var height = 226,
      width = 446;
  var x = (this.game.Constants.FactoryWidth / 2) - (width/2);
  this.currentMenu = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(x, this.optionsY)
        .setFill(this.game.Media.PauseMenu);
  this.appendChild(this.currentMenu);
  
  this.currentMenuEvent = function(e) {
    if(e.event.offsetX >= x && e.event.offsetX <= (x + width) &&
       e.event.offsetY >= this.optionsY && e.event.offsetY <= (this.optionsY + height)
       ) {
      if (e.event.offsetY <= 360) {
        this.initOptionsMenu();
      } else if (e.event.offsetY <= 435) {
        this.showCredits();
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
  
  var x = (this.game.Constants.FactoryWidth / 2) - (width/2);
  
  var statusX = x + 225,
      musicStatusY = this.optionsY + 10,
      sfxStatusY = this.optionsY + 90;

  this.currentMenu = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(x, this.optionsY)
        .setFill(this.game.Media.OptionsMenu);
  this.appendChild(this.currentMenu);
  
  this.musicStatus = this.game.Media.GetStatusSprite(this.game.musicSound, statusX, musicStatusY);
  this.appendChild(this.musicStatus);
  
  this.sfxStatus = this.game.Media.GetStatusSprite(this.game.sfx, statusX, sfxStatusY);
  this.appendChild(this.sfxStatus);
  
  this.currentMenuEvent = function(e) {
    if(e.event.offsetX >= x && e.event.offsetX <= (x + width) &&
       e.event.offsetY >= this.optionsY && e.event.offsetY <= (this.optionsY + height)
       ) {
      if (e.event.offsetY <= 360) {
        this.game.switchMusicSound();
        this.removeChild(this.musicStatus);
        this.musicStatus = this.game.Media.GetStatusSprite(this.game.musicSound, statusX, musicStatusY);
        this.appendChild(this.musicStatus);
      } else if (e.event.offsetY <= 440) {
        this.game.switchSFXSound();
        this.removeChild(this.sfxStatus);
        this.sfxStatus = this.game.Media.GetStatusSprite(this.game.sfx, statusX, sfxStatusY);
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
  goog.events.listen(this.game.pauseMenu, ['mousedown','touchstart'], this.currentMenuEvent);
}

robert_the_lifter.PauseMenu.prototype.hideCredits = function() {
  this.removeChild(this.creditSprite);
  goog.events.unlisten(this.game.pauseMenu, ['mousedown','touchstart'], this.clickToCloseCreditEvent);
}

robert_the_lifter.PauseMenu.prototype.showCredits = function() {
  this.removeCurrentMenu();
  var width = 661,
      height = 900;
  var x = (this.game.Constants.FactoryWidth / 2) - (width/2);
  
  this.creditSprite = new lime.Sprite()
        .setAnchorPoint(0,0)
        .setPosition(x, 0)
        .setFill(this.game.Media.CreditsMenu);
  this.appendChild(this.creditSprite);
  
  var layer = this;
  
  this.clickToCloseCreditEvent = function() {
    layer.hideCredits();
    layer.initPauseMenu();
  }
  
  goog.events.listen(this.creditSprite, ['mousedown','touchstart'], this.clickToCloseCreditEvent);
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
  
  this.hideCredits(); 
  this.hideKeyBindingMenu();
  goog.events.unlisten(this.game.pauseMenu,['mousedown','touchstart'], this.currentMenuEvent);
}

robert_the_lifter.PauseMenu.prototype.unpause = function() {
  this.removeCurrentMenu();
  this.game.isPaused = false;
  this.saveOptions();
  robert_the_lifter.gameScene.removeChild(this.game.pauseMenu);
}

robert_the_lifter.PauseMenu.prototype.saveOptions = function() {
  if (typeof Storage !== "undefined") {
    var options = [
      this.game.turnLeftKey,
      this.game.turnRightKey,
      this.game.forwardKey,
      this.game.backwardKey,
      this.game.grabKey,
      this.extraPauseKey,
      this.game.musicSound,
      this.game.sfx
    ];
    
    localStorage.rtl_options = JSON.stringify(options);
  }
}

robert_the_lifter.PauseMenu.prototype.loadOptions = function() {
  if (typeof Storage !== "undefined" && typeof localStorage.rtl_options !== "undefined") {
    var options = JSON.parse(localStorage.rtl_options);
      
    this.game.turnLeftKey = options[0];
    this.game.turnRightKey = options[1];
    this.game.forwardKey = options[2];
    this.game.backwardKey = options[3];
    this.game.grabKey = options[4];
    this.extraPauseKey = options[5];
    this.game.musicSound = options[6];
    this.game.sfx  = options[7];
  }
}