goog.provide('robert_the_lifter.Robert');

goog.require('lime.Sprite');

robert_the_lifter.Robert = function(game) {
  goog.base(this);

  // Don't move by default !
  this.leftSpeed = 0;
  this.rightSpeed = 0;
  this.upSpeed = 0;
  this.downSpeed = 0;
  
  this.setAnchorPoint(0, 0);
  this.setPosition(this.STARTING_X + game.factoryX, this.STARTING_Y + game.factoryY);
  this.setSize(game.tileWidth, game.tileHeight).setFill(255,150,0);
  
  // Set moving limits.
  this.rightLimit = game.factoryX + game.factoryWidth - this.getSize().width;
  this.upLimit = game.factoryY;
  this.leftLimit = game.factoryX;
  this.downLimit = game.factoryY + game.factoryHeight - this.getSize().height;
  
  // Register Keyup and Keydown events.
  goog.events.listen(this, goog.events.EventType.KEYDOWN, function (ev) {
    setSpeed(this, ev.event.keyCode, this.DEFAULT_SPEED);
  });
  goog.events.listen(this, goog.events.EventType.KEYUP, function (ev) {
    setSpeed(this, ev.event.keyCode, 0);
  });
  
  this.key_timing = 65;
  lime.scheduleManager.schedule(function(number){ 
    this.key_timing -= number;
    if (this.key_timing <= 0) {
      var pos = this.getPosition();
    
    if (pos.x + this.rightSpeed <= this.rightLimit) {
      pos.x += this.rightSpeed;
    }
    if (pos.x - this.leftSpeed >= this.leftLimit) {
      pos.x -= this.leftSpeed;
    }
    if (pos.y - this.upSpeed >= this.upLimit) {
      pos.y -= this.upSpeed;
    }
    if (pos.y + this.downSpeed <= this.downLimit) {
      pos.y += this.downSpeed;
    }
    
    this.setPosition(pos.x, pos.y);
    this.key_timing = 65;
    }
    
  },this);
  
  function setSpeed(robert, keyCode, speed) {
    switch (keyCode) {
      case 40: // Down
        robert.downSpeed = speed;
        break;
      case 39: // Right
        robert.rightSpeed = speed;
        break;
      case 38: // Up
        robert.upSpeed = speed;
        break;
      case 37: // Left
        robert.leftSpeed = speed;
        break;
    }
  }
}

// Robert is a Sprite !
goog.inherits(robert_the_lifter.Robert, lime.Sprite);

robert_the_lifter.Robert.prototype.DEFAULT_SPEED = 32;
robert_the_lifter.Robert.prototype.STARTING_X = 32;
robert_the_lifter.Robert.prototype.STARTING_Y = 32;

