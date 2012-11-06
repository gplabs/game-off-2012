goog.provide('robert_the_lifter.Robert');

goog.require('lime.Sprite');

robert_the_lifter.Robert = function(game) {
  goog.base(this);
  this.game = game;
  this.pointing = this.POINTING_DOWN;
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
  lime.scheduleManager.schedule(function(number) { 
    this.key_timing -= number;
    var hasPiece = typeof this.grabbedPiece !== 'undefined';
    
    if (this.key_timing <= 0) {
      var pos = this.getPosition();
    
      if (this.rightSpeed !== 0 && pos.x + this.rightSpeed <= this.rightLimit) {
        pos.x += this.rightSpeed;
        if (hasPiece) {
          moveGrabbedPieceRight(this);
        }
      }
      if (this.leftSpeed !== 0 && pos.x - this.leftSpeed >= this.leftLimit) {
        pos.x -= this.leftSpeed;
        if (hasPiece) {
          moveGrabbedPieceLeft(this);
        }
      }
      if (this.upSpeed !== 0 && pos.y - this.upSpeed >= this.upLimit) {
        pos.y -= this.upSpeed;
        if (hasPiece) {
          moveGrabbedPieceUp(this);
        }
      }
      if (this.downSpeed !== 0 && pos.y + this.downSpeed <= this.downLimit) {
        pos.y += this.downSpeed;
        if (hasPiece) {
          moveGrabbedPieceDown(this);
        }
      }

      this.setPosition(pos.x, pos.y);
      this.key_timing = 65;
    }
    
  },this);
  
  function setSpeed(robert, keyCode, speed) {
    switch (keyCode) {
      case 40: // Down
        robert.downSpeed = speed;
        this.pointing = this.POINTING_DOWN;
        break;
      case 39: // Right
        robert.rightSpeed = speed;
        this.pointing = this.POINTING_RIGHT;
        break;
      case 38: // Up
        robert.upSpeed = speed;
        this.pointing = this.POINTING_UP;
        break;
      case 37: // Left
        robert.leftSpeed = speed;
        this.pointing = this.POINTING_LEFT;
        break;
    }
  }
  
  function moveGrabbedPieceUp(robert) {
    for (var i in robert.grabbedPiece.squares) {
      robert.grabbedPiece.squares[i].getPosition().y -= robert.upSpeed;
    }
  }
  
  function moveGrabbedPieceDown(robert) {
    for (var i in robert.grabbedPiece.squares) {
      robert.grabbedPiece.squares[i].getPosition().y += robert.downSpeed;
    }
  }
  
  function moveGrabbedPieceLeft(robert) {
    for (var i in robert.grabbedPiece.squares) {
      robert.grabbedPiece.squares[i].getPosition().x -= robert.leftSpeed;
    }
  }
  
  function moveGrabbedPieceRight(robert) {
    for (var i in robert.grabbedPiece.squares) {
      robert.grabbedPiece.squares[i].getPosition().x += robert.rightSpeed;
    }
  }
}

// Robert is a Sprite !
goog.inherits(robert_the_lifter.Robert, lime.Sprite);

robert_the_lifter.Robert.prototype.isThisPieceInFrontOfMe = function(piece) {
  var pos = this.getPosition();
  var x = pos.x,
      y = pos.y;

  switch(this.pointing) {
    case this.POINTING_DOWN:
      y += this.game.tileHeight;
      break;
    case this.POINTING_UP:
      y -= this.game.tileHeight;
      break;
    case this.POINTING_LEFT:
      x -= this.game.tileHeight;
      break;
    case this.POINTING_RIGHT:
      x += this.game.tileHeight;
      break;
  }

  var foundSquare = false;
  for(var i = 0; i < piece.squares.length && !foundSquare; i++) {
    var piecePos = piece.squares[i].getPosition();
    foundSquare = (piecePos.x == x && piecePos.y == y);
  }

  return foundSquare;
}

robert_the_lifter.Robert.prototype.DEFAULT_SPEED = 32;
robert_the_lifter.Robert.prototype.STARTING_X = 32;
robert_the_lifter.Robert.prototype.STARTING_Y = 32;

robert_the_lifter.Robert.prototype.POINTING_DOWN = 1;
robert_the_lifter.Robert.prototype.POINTING_UP = 2;
robert_the_lifter.Robert.prototype.POINTING_LEFT = 3;
robert_the_lifter.Robert.prototype.POINTING_RIGHT = 4;


