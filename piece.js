goog.provide('robert_the_lifter.Piece');

goog.require('lime.fill.Frame');
robert_the_lifter.Piece = function(factory, game) {
  this.game = game;
  this.anchor = 0.5;

  this.isGrabbed = false; // Will be true when the lift has grabbed the piece.

  // Initialise the piece with squares.
  var startingX = (this.anchor*game.tileWidth) + game.factoryX + game.factoryWidth - game.tileWidth*2;
  var startingY = (this.anchor*game.tileHeight) + game.factoryY + game.tileHeight*3;

  var pieceType = Math.floor((Math.random()*7)+1);
  switch(pieceType) {
    case 1:
      this.squares = this.createPieceInvertedL(startingX, startingY);
      break;
    case 2:
      this.squares = this.createPieceL(startingX, startingY);
      break;
    case 3:
      this.squares = this.createPieceBar(startingX, startingY);
      break;
    case 4:
      this.squares = this.createPieceSquare(startingX, startingY);
      break;
    case 5:
      this.squares = this.createPieceT(startingX, startingY);
      break;
    case 6:
      this.squares = this.createPieceS(startingX, startingY);
      break;
    case 7:
      this.squares = this.createPieceInvertedS(startingX, startingY);
      break;
  }

  for (var i in this.squares) {
    factory.appendChild(this.squares[i]);
  }

  // The loop for dropping the piece.
  lime.scheduleManager.schedule(dropLoop, this);
  this.timeToNextGoingDown = this.DEFAULT_SPEED;
  function dropLoop(number) {
    if (!this.isGrabbed && this.canGoLeft()) {
      this.timeToNextGoingDown -= number;
      if (this.timeToNextGoingDown <= 0) {
        this.timeToNextGoingDown += this.DEFAULT_SPEED;
        this.goLeft();
      }
    }
  }
}

/**
 * The bar piece
 * 
 *  x
 *  x
 *  x
 *  x
 */
robert_the_lifter.Piece.prototype.createPieceBar = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX, startingY + this.game.tileHeight*2),
    this.createSquare(startingX, startingY + this.game.tileHeight*3)
  ];
}
  
/**
 * The L piece
 * 
 *  x
 *  x
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceL = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX, startingY + this.game.tileHeight*2),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight*2)
  ];
}
  
/**
 * The inverted L piece
 * 
 *   x
 *   x
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceInvertedL = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX, startingY + this.game.tileHeight*2),
    this.createSquare(startingX - this.game.tileWidth, startingY + this.game.tileHeight*2)
  ];
}
  
/**
 * The square piece
 * 
 *  xx
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceSquare = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}
  
/**
 * The T piece
 * 
 *  xxx
 *   x
 */
robert_the_lifter.Piece.prototype.createPieceT = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY),
    this.createSquare(startingX + this.game.tileWidth*2, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}
  
/**
 * The S piece
 * 
 *   xx
 *  xx
 */
robert_the_lifter.Piece.prototype.createPieceS = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX + this.game.tileWidth, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX - this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}
  
/**
 * The inverted S piece
 * 
 *  xx
 *   xx
 */
robert_the_lifter.Piece.prototype.createPieceInvertedS = function(startingX, startingY) {
  return [
    this.createSquare(startingX, startingY),
    this.createSquare(startingX - this.game.tileWidth, startingY),
    this.createSquare(startingX, startingY + this.game.tileHeight),
    this.createSquare(startingX + this.game.tileWidth, startingY + this.game.tileHeight)
  ];
}


/**
 * Create one of the piece squares
 */
robert_the_lifter.Piece.prototype.createSquare = function (x, y) {
  var frame = new lime.fill.Frame('images/boxes.png', 0, 0, this.game.tileWidth, this.game.tileHeight);
  return new lime.Sprite()
    .setSize(this.game.tileWidth, this.game.tileHeight)
    .setFill(frame)
    .setPosition(x, y)
    .setAnchorPoint(this.anchor, this.anchor);
}

/**
 * Checks if the piece can move in the direction given.
 * params coords are current coords modifiers.
 */
robert_the_lifter.Piece.prototype.canMove = function (x, y, considerRobert) {
  var canMove = true;
  
  for (var i = 0; i < this.squares.length && canMove; i ++) {
    var squarePos = this.squares[i].getPosition();
    if (!this.game.canBePlace(squarePos.x + x, squarePos.y + y, this.key, considerRobert)) {
      canMove = false;
    }
  }
  
  return canMove;
}

/**
 * Check if the next drop is a legal one !
 */
robert_the_lifter.Piece.prototype.canGoLeft = function () {
  return this.canMove(-this.game.tileWidth, 0, true);
}

/**
 * Makes the entire piece go down one tile, no matter what !
 */
robert_the_lifter.Piece.prototype.goLeft = function (){
  for (var i in this.squares) {
    var pos = this.squares[i].getPosition();
    this.squares[i].setPosition(pos.x - this.game.tileWidth, pos.y);
  }
}

robert_the_lifter.Piece.prototype.DEFAULT_SPEED = 1000;