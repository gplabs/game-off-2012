goog.provide('robert_the_lifter.Robert');

goog.require('lime.Sprite');

robert_the_lifter.Robert = function(game) {
  goog.base(this);
  this.id = robert_the_lifter.Game.ROBERT;
  this.game = game;

  this.x = 12;
  this.y = 5;
  this.setPosition(
    (this.x * game.Constants.TileWidth) + game.Constants.FactoryX + (game.Constants.TileWidth/2),
    (this.y * game.Constants.TileHeight) + game.Constants.FactoryY + (game.Constants.TileHeight/2)
  );
  this.game.switchState(this.x, this.y, this.id);

  this.forks_x = 0;
  this.forks_y = game.Constants.TileWidth;

  this.setAnchorPoint(0.5, 0.75);

  this.setSize(game.Constants.TileWidth + this.forks_x, game.Constants.TileHeight + this.forks_y)
      .setFill(game.Media.RobertFrame);
  this.setRotation(0);

  // Set moving limits.
  this.rightLimit = game.Constants.FactoryX + game.Constants.FactoryWidth - this.getSize().width;
  this.upLimit = game.Constants.FactoryY;
  this.leftLimit = game.Constants.FactoryX;
  this.downLimit = game.Constants.FactoryY + game.Constants.FactoryHeight - this.getSize().height;

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
      nextRight = robert_the_lifter.Game.DEFAULT_ROBERT_SPEED,
      nextDown = game.getRobertSpeed(),
      nextLeft = robert_the_lifter.Game.DEFAULT_ROBERT_SPEED;

  /**
   * Function for each arrow event, keydown AND keyup.
   */
  this.leftEvent = function(ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !leftHold) {
      game.robert.rotate(90);
      nextLeft = robert_the_lifter.Game.DEFAULT_ROBERT_SPEED;
    }
    leftHold = keyDown;
  }

  this.rightEvent = function (ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !rightHold) {
      game.robert.rotate(-90);
      nextRight = robert_the_lifter.Game.DEFAULT_ROBERT_SPEED;
    }
    rightHold = keyDown;
  }

  this.forwardEvent = function(ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !upHold) {
      game.robert.moveTo(game.forwardKey);
      nextUp = game.getRobertSpeed();
    }
    upHold = keyDown;
  }

  this.backwardEvent = function(ev) {
    var keyDown = (!game.isPaused) && (ev.type == "keydown");
    if (keyDown && !downHold) {
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
        game.robert.moveTo(game.backwardKey);
        nextDown += game.getRobertSpeed();
      }
      nextDown -= number;
    }

    if (rightHold) {
      if (nextRight <= 0) {
        game.robert.rotate(-90);
        nextRight += robert_the_lifter.Game.DEFAULT_ROBERT_SPEED;
      }
      nextRight -= number;
    }

    if (upHold) {
      if (nextUp <= 0) {
        game.robert.moveTo(game.forwardKey);
        nextUp += game.getRobertSpeed();
      }
      nextUp -= number;
    }

    if (leftHold) {
      if (nextLeft <= 0) {
        game.robert.rotate(90);
        nextLeft += robert_the_lifter.Game.DEFAULT_ROBERT_SPEED;
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
  var movement_value = this.game.Constants.TileWidth;
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

  var outside = newX < 0 || newX >= this.game.Constants.FactoryNbTileWidth ||
                newY < 0 || newY >= this.game.Constants.FactoryNbTileHeight;

  // If robert has no piece, we move only him.
  if (!outside && !this.hasPiece && !this.game.containsSomething(newX, newY)) {
    this.setPosition(actual_position.x + (x*this.game.Constants.TileWidth), actual_position.y + (y*this.game.Constants.TileHeight));
    this.game.switchState(newX, newY, this.id);
    this.x = newX;
    this.y = newY;
    this.game.switchState(oldX, oldY, robert_the_lifter.Game.NO_PIECE);
  }
  // Move robert and his grabbed piece.
  else if (!outside && this.hasPiece) {
    var canMove = true;
    for(var i = 0; i < this.grabbedPiece.blocks.length && canMove; i ++) {
      var blockX = this.grabbedPiece.blocks[i].x + x,
          blockY = this.grabbedPiece.blocks[i].y + y;

      canMove = this.game.isInside(blockX, blockY) && !this.game.containsAnotherPiece(blockX, blockY, this.grabbedPiece.id);
    }

    if (canMove && !this.game.containsAnotherPiece(newX, newY, this.grabbedPiece.id)) {
      this.grabbedPiece.move(x, y);

      this.setPosition(actual_position.x + (x*this.game.Constants.TileWidth), actual_position.y + (y*this.game.Constants.TileHeight));
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
        yO = this.y,
        r = -rotation / 180 * Math.PI;

    // Check each squares of the grabbed piece if they can rotate.
    var newPiece = [];
    for(var i = 0; i < this.grabbedPiece.blocks.length && canRotate; i++) {
      var x1 = this.grabbedPiece.blocks[i].x,
          y1 = this.grabbedPiece.blocks[i].y;

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