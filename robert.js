goog.provide('robert_the_lifter.Robert');

goog.require('lime.Sprite');

robert_the_lifter.Robert = function(game) {
  goog.base(this);
  this.id = robert_the_lifter.Game.ROBERT;
  this.game = game;
  
  this.x = 0;
  this.y = 0;
  this.setPosition(
    (this.x * game.tileWidth) + game.factoryX + (game.tileWidth/2), 
    (this.y * game.tileHeight) + game.factoryY + (game.tileHeight/2)
  );
  this.game.switchState(this.x, this.y, this.id);
  
  // Robert's speed
  this.speed = 250;
  
  this.forks_x = 0;
  this.forks_y = 64;
  
  this.setAnchorPoint(0.5, 0.75);

  this.img = new lime.fill.Frame('images/forklift.png', 0, 0, game.tileWidth + this.forks_x, game.tileHeight + this.forks_y);
  this.setSize(game.tileWidth + this.forks_x, game.tileHeight + this.forks_y).setFill(this.img);
  this.setRotation(0);
  
  // Set moving limits.
  this.rightLimit = game.factoryX + game.factoryWidth - this.getSize().width;
  this.upLimit = game.factoryY;
  this.leftLimit = game.factoryX;
  this.downLimit = game.factoryY + game.factoryHeight - this.getSize().height;
  
  this.hasPiece = false;
 
 lime.scheduleManager.scheduleWithDelay(function(){
   this.canUseKey = true;
 }, this, this.speed);
  
  
  // Register Keydown events and move or rotate.
  goog.events.listen(this, goog.events.EventType.KEYDOWN, function (ev) {
    var actual_rotation = this.getRotation();
    if (actual_rotation <= 0) {
      actual_rotation = 360;
    }

    if (this.canUseKey) {
      switch (ev.event.keyCode) {
        case 40: // Down
          this.moveTo(actual_rotation/90, ev.event.keyCode);
          break;
        case 39: // Right
          this.rotate(actual_rotation, -90);
          break;
        case 38: // Up
          this.moveTo(actual_rotation/90, ev.event.keyCode);
          break;
        case 37: // Left
          this.rotate(actual_rotation, 90)
          break;
      }
    }
    
  });
}

// Robert is a Sprite !
goog.inherits(robert_the_lifter.Robert, lime.Sprite);

robert_the_lifter.Robert.prototype.moveTo = function (rotation, keyCode) {
  var movement_value = this.game.tileWidth;
  this.canUseKey = false;
  switch(rotation) {  
    case 1: // left.
      if (keyCode == 38) { // Moving forward
        this.moveLeft(movement_value);
      }
      else { // Moving backward
        this.moveRight(movement_value);
      }
      break;

    case 2: // down.
      if (keyCode == 38) { // Moving forward
        this.moveDown(movement_value);
      }
      else { // Moving backward
        this.moveUp(movement_value);
      }
      break;

    case 3: // right.
      if (keyCode == 38) { // Moving forward
        this.moveRight(movement_value);
      }
      else { // Moving backward
        this.moveLeft(movement_value);
      }
      break;   

    case 4: // Up.
      if (keyCode == 38) { // Moving forward
        this.moveUp(movement_value);
      }
      else { // Moving backward
        this.moveDown(movement_value);
      }
      break;  
  }
}

robert_the_lifter.Robert.prototype.moveUp = function() {
  this.move(0, -1);
}

robert_the_lifter.Robert.prototype.moveDown = function() {
  this.move(0, 1);
}

robert_the_lifter.Robert.prototype.moveLeft = function() {
  this.move(-1, 0);
}

robert_the_lifter.Robert.prototype.moveRight = function() {
  this.move(1, 0);
}

robert_the_lifter.Robert.prototype.move = function(x, y) {
  var newX = this.x + x,
      newY = this.y + y,
      oldX = this.x,
      oldY = this.y;
  var actual_position = this.getPosition();
  
  // If robert has no piece, we move only him.
  if (!this.hasPiece && !this.game.containsSomething(newX, newY)) {
    this.setPosition(actual_position.x + (x*this.game.tileWidth), actual_position.y + (y*this.game.tileHeight));
    this.game.switchState(newX, newY, this.id);
    this.x = newX;
    this.y = newY;
    this.game.switchState(oldX, oldY, robert_the_lifter.Game.NO_PIECE);
  }
  // Move robert and his grabbed piece.
  else if (this.hasPiece) {
    var canMove = true;
    for(var i = 0; i < this.grabbedPiece.blocks.length && canMove; i ++) {
      var blockX = this.grabbedPiece.blocks[i].x + x,
          blockY = this.grabbedPiece.blocks[i].y + y;
      
      canMove = this.game.isInside(blockX, blockY) && !this.game.containsAnotherPiece(blockX, blockY, this.grabbedPiece.id);
    }
    
    if (canMove && !this.game.containsAnotherPiece(newX, newY, this.grabbedPiece.id)) {
      this.grabbedPiece.move(x, y);
      
      this.setPosition(actual_position.x + (x*this.game.tileWidth), actual_position.y + (y*this.game.tileHeight));
      this.game.switchState(newX, newY, this.id);
      
      this.x = newX;
      this.y = newY;
      this.game.switchState(oldX, oldY, robert_the_lifter.Game.NO_PIECE);
    }
  }
}

/**
 * Rotate robert (and his grabbed piece) by the angle in param.
 */
robert_the_lifter.Robert.prototype.rotate = function (actual_rotation, rotation) {
  var canRotate = true;
  
  if (this.hasPiece) {
    // Rotation point. (origin)
    var xO = this.x,
        yO = this.y;

    // Check each squares of the grabbed piece if they can rotate.
    var newPiece = [];
    for(var i = 0; i < this.grabbedPiece.blocks.length && canRotate; i++) {
      var x1 = this.grabbedPiece.blocks[i].x,
          y1 = this.grabbedPiece.blocks[i].y,
          r = -rotation / 180 * Math.PI;
      
      var x2 = Math.round(Math.cos(r) * (x1-xO) - Math.sin(r) * (y1-yO) + xO),
          y2 = Math.round(Math.sin(r) * (x1-xO) + Math.cos(r) * (y1-yO) + yO);
          
      if (this.game.isInside(x2, y2) && !this.game.containsAnotherPiece(x2, y2, this.grabbedPiece.id)) {
        newPiece[i] = new Array(x2, y2);
      } else {
        canRotate = false;
      }
    }
  }
  
  // Make the rotation.
  if (canRotate) {
    this.setRotation(actual_rotation + rotation);
    if (this.hasPiece) {
      this.grabbedPiece.moveAndRotate(newPiece, rotation);
    }
  }
}