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
  
  // Prevent the browser from scrolling on arrow key pressed.
  window.addEventListener("keydown",
    function(e){
      switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
      }
    },
  false);
 
  // If the keys are being hold down.
  var upHold = false,
      rightHold = false,
      downHold = false,
      leftHold = false,
  // When the key is hold down, this is the time before the next movement.
      nextUp = game.getRobertSpeed(),
      nextRight = game.getRobertSpeed(),
      nextDown = game.getRobertSpeed(),
      nextLeft = game.getRobertSpeed();
  
  /**
   * Function for each arrow event, keydown AND keyup.
   */
  this.leftEvent = function(ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !leftHold) {
      game.robert.rotate(90);
      nextLeft = game.getRobertSpeed();
    }
    leftHold = keyDown;
  }
  
  this.rightEvent = function (ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !rightHold) {
      game.robert.rotate(-90);
      nextRight = game.getRobertSpeed();
    }
    rightHold = keyDown;
  }
  
  this.forwardEvent = function(ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !upHold) {
      game.oil.dropOil(game);
      game.robert.moveTo(game.forwardKey);
      nextUp = game.getRobertSpeed();
    }
    upHold = keyDown;
  }
  
  this.backwardEvent = function(ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !downHold) {
      game.oil.dropOil(game);
      game.robert.moveTo(game.backwardKey);
      nextDown = game.getRobertSpeed();
    }
    downHold = keyDown;
  }
  // Constant loop that is responsible for moving when holding keys.
  this.speedController = lime.scheduleManager.schedule(moveEvent, this);
  function moveEvent(number) {
    if (downHold) {
      if (nextDown <= 0) {
        game.oil.dropOil(game);
        game.robert.moveTo(game.backwardKey);
        nextDown += game.getRobertSpeed();
      }
      nextDown -= number;
    }

    if (rightHold) {
      if (nextRight <= 0) {
        game.robert.rotate(-90);
        nextRight += game.getRobertSpeed();
      }
      nextRight -= number;
    }

    if (upHold) {
      if (nextUp <= 0) {
        game.oil.dropOil(game);
        game.robert.moveTo(game.forwardKey);
        nextUp += game.getRobertSpeed();
      }
      nextUp -= number;
    }

    if (leftHold) {
      if (nextLeft <= 0) {
        game.robert.rotate(90);
        nextLeft += game.getRobertSpeed();
      }
      nextLeft -= number;
    }
  }
}

// Robert is a Sprite !
goog.inherits(robert_the_lifter.Robert, lime.Sprite);

robert_the_lifter.Robert.prototype.stop = function (){
//  goog.events.unlistenByKey(this.movingListener);
//  lime.scheduleManager.unschedule(this.speedController, this);
}

robert_the_lifter.Robert.prototype.moveTo = function (keyCode) {
  var movement_value = this.game.tileWidth;
  var rotation = this.getRotation();
  if (rotation <= 0) {
    rotation = 360;
  }
  rotation /= 90;
  
  this.canUseKey = false;
  switch(rotation) {  
    case 1: // left.
      if (keyCode == this.game.forwardKey) { // Moving forward
        this.moveLeft(movement_value);
      }
      else { // Moving backward
        this.moveRight(movement_value);
      }
      break;

    case 2: // down.
      if (keyCode == this.game.forwardKey) { // Moving forward
        this.moveDown(movement_value);
      }
      else { // Moving backward
        this.moveUp(movement_value);
      }
      break;

    case 3: // right.
      if (keyCode == this.game.forwardKey) { // Moving forward
        this.moveRight(movement_value);
      }
      else { // Moving backward
        this.moveLeft(movement_value);
      }
      break;   

    case 4: // Up.
      if (keyCode == this.game.forwardKey) { // Moving forward
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
      // If the old position is still robert, we make it NO_PIECE.
      if (this.game.field[oldY][oldX] == this.id) {
        this.game.switchState(oldX, oldY, robert_the_lifter.Game.NO_PIECE);
      }
    }
  }
}

/**
 * Rotate robert (and his grabbed piece) by the angle in param.
 */
robert_the_lifter.Robert.prototype.rotate = function (rotation) {
  var actual_rotation = this.getRotation();
  if (actual_rotation <= 0) {
    actual_rotation = 360;
  }
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