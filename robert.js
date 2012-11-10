goog.provide('robert_the_lifter.Robert');

goog.require('lime.Sprite');

robert_the_lifter.Robert = function(game) {
  goog.base(this);
  this.game = game;

  // Must use those variables to obtaine upper left corner position.
  // Thats because the anchor point is in center of the lift (w/o forks.)
  this.xAdjustment = this.game.tileWidth / 2;
  this.yAdjustment = this.game.tileHeight / 2;
  
  // Robert's speed
  this.speed = 250;
  
  this.forks_x = 0;
  this.forks_y = 64;
  this.setPosition(game.tileWidth + game.factoryX - (game.tileWidth/2), game.tileHeight + game.factoryY - (game.tileHeight/2));
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

robert_the_lifter.Robert.prototype.moveUp = function(movement) {
  this.move(0, - movement);
}

robert_the_lifter.Robert.prototype.moveDown = function(movement) {
  this.move(0, movement);
}

robert_the_lifter.Robert.prototype.moveLeft = function(movement) {
  this.move(-movement, 0);
}

robert_the_lifter.Robert.prototype.moveRight = function(movement) {
  this.move(movement, 0);
}

robert_the_lifter.Robert.prototype.move = function(x, y) {
  var actual_position = this.getPosition();
  var grabbedPieceKey = this.hasPiece ? this.grabbedPiece.key : null;
  if (this.game.canBePlace(actual_position.x - this.xAdjustment + x, actual_position.y - this.yAdjustment + y, grabbedPieceKey) && 
      (!this.hasPiece || (this.hasPiece && this.grabbedPiece.canMove(x, y, false)))
     ) {
    
    // Move robert.
    this.setPosition(actual_position.x + x, actual_position.y + y);
    
    // Move the grabbed piece.
    if (this.hasPiece) {
      for (var i in this.grabbedPiece.squares) {
        this.grabbedPiece.squares[i].getPosition().x += x;
        this.grabbedPiece.squares[i].getPosition().y += y;
      }
    }
  }
}

robert_the_lifter.Robert.prototype.isThisPieceInFrontOfMe = function(piece) {
  var pos = this.getPosition(),
      x = pos.x,
      y = pos.y,
      rotation = this.getRotation();
  switch(rotation) {
    case 180: //Pointing down !
      y += this.game.tileHeight;
      break;
    case 0: // Pointing up !
      y -= this.game.tileHeight;
      break;
    case 90: // Pointing left !
      x -= this.game.tileWidth;
      break;
    case 270: // Pointing right !
      x += this.game.tileWidth;
      break;
  }

  var foundSquare = false;
  for(var i = 0; i < piece.squares.length && !foundSquare; i++) {
    var piecePos = piece.squares[i].getPosition();
    foundSquare = (piecePos.x == x && piecePos.y == y);
  }

  return foundSquare;
}

/**
 * Rotate robert (and his grabbed piece) by the angle in param.
 */
robert_the_lifter.Robert.prototype.rotate = function (actual_rotation, rotation) {
  var canRotate = true;
  
  if (this.hasPiece) {
    // Rotation point. (origin)
    var posO = this.getPosition();
    var xO = posO.x,
        yO = posO.y;

    // Check each squares of the grabbed piece if they can rotate.
    var newPiece = [];
    for(var i = 0; i < this.grabbedPiece.squares.length && canRotate; i++) {
      var pos1 = this.grabbedPiece.squares[i].getPosition();
      var x1 = pos1.x,
          y1 = pos1.y,
          r = -rotation / 180 * Math.PI;
          
      
      var x2 = Math.cos(r) * (x1-xO) - Math.sin(r) * (y1-yO) + xO,
          y2 = Math.sin(r) * (x1-xO) + Math.cos(r) * (y1-yO) + yO;
          
      if (this.game.canBePlace(x2, y2, this.grabbedPiece.key, false)) {
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
      for(var j = 0; j < this.grabbedPiece.squares.length; j++) {
        this.grabbedPiece.squares[j].setPosition(newPiece[j][0], newPiece[j][1]);
        this.grabbedPiece.squares[j].setRotation(this.grabbedPiece.squares[j].getRotation() + rotation);
      }
    }
  }
}