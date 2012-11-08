goog.provide('robert_the_lifter.Piece');

goog.require('lime.fill.Frame');
robert_the_lifter.Piece = function(factory, game) {
  this.game = game;

  this.isGrabbed = false; // Will be true when the lift has grabbed the piece.

  // Initialise the piece with squares.
  var startingX = game.factoryX + game.factoryWidth - game.tileWidth*2;
  var startingY = game.factoryY + game.tileHeight*3;

  var pieceType = Math.floor((Math.random()*7)+1);

  switch(pieceType) {
    case 1:
      this.squares = createPieceInvertedL();
      break;
    case 2:
      this.squares = createPieceL();
      break;
    case 3:
      this.squares = createPieceBar();
      break;
    case 4:
      this.squares = createPieceSquare();
      break;
    case 5:
      this.squares = createPieceT();
      break;
    case 6:
      this.squares = createPieceS();
      break;
    case 7:
      this.squares = createPieceInvertedS();
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

  /**
   * Create one of the piece squares
   */
  function createSquare(x, y) {
    var frame = new lime.fill.Frame('images/boxes.png', 0, 0, game.tileWidth, game.tileHeight);
    return new lime.Sprite()
      .setSize(game.tileWidth, game.tileHeight)
      .setAnchorPoint(0,0)
      .setFill(frame)
      .setPosition(x, y);
  }
  
  /**
   * The bar piece
   * 
   *  x
   *  x
   *  x
   *  x
   */
  function createPieceBar() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX, startingY + game.tileHeight*2),
      createSquare(startingX, startingY + game.tileHeight*3)
    ];
  }
  
  /**
   * The L piece
   * 
   *  x
   *  x
   *  xx
   */
  function createPieceL() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX, startingY + game.tileHeight*2),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight*2)
    ];
  }
  
  /**
   * The inverted L piece
   * 
   *   x
   *   x
   *  xx
   */
  function createPieceInvertedL() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX, startingY + game.tileHeight*2),
      createSquare(startingX - game.tileWidth, startingY + game.tileHeight*2)
    ];
  }
  
  /**
   * The square piece
   * 
   *  xx
   *  xx
   */
  function createPieceSquare() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX + game.tileWidth, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight)
    ];
  }
  
  /**
   * The T piece
   * 
   *  xxx
   *   x
   */
  function createPieceT() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX + game.tileWidth, startingY),
      createSquare(startingX + game.tileWidth*2, startingY),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight)
    ];
  }
  
  /**
   * The S piece
   * 
   *   xx
   *  xx
   */
  function createPieceS() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX + game.tileWidth, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX - game.tileWidth, startingY + game.tileHeight)
    ];
  }
  
  /**
   * The inverted S piece
   * 
   *  xx
   *   xx
   */
  function createPieceInvertedS() {
    return [
      createSquare(startingX, startingY),
      createSquare(startingX - game.tileWidth, startingY),
      createSquare(startingX, startingY + game.tileHeight),
      createSquare(startingX + game.tileWidth, startingY + game.tileHeight)
    ];
  }
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