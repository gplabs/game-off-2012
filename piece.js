goog.provide('robert_the_lifter.Piece');

robert_the_lifter.Piece = function(factory, game) {
  this.game = game;
  // Initialise the piece with squares.
  var startingX = game.factoryX + game.tileWidth*6;
  var startingY = game.factoryY + 0;
  
  this.squares = [
    createSquare(startingX, startingY),
    createSquare(startingX, startingY + game.tileHeight),
    createSquare(startingX, startingY + game.tileHeight*2),
    createSquare(startingX, startingY + game.tileHeight*3)
  ];

  

  for (var i in this.squares) {
    factory.appendChild(this.squares[i]);
  }
  
  /**
   * Create one of the piece squares
   */
  function createSquare(x, y) {
    return new lime.Sprite()
      .setSize(game.tileWidth, game.tileHeight)
      .setAnchorPoint(0,0)
      .setFill(0,0,0)
      .setStroke(1, '#F55')
      .setPosition(x, y);
  }
}

/**
 * Makes the entire piece go down one tile.
 * Return true if it can continue down.
 */
robert_the_lifter.Piece.prototype.goDown = function (){
  var canContinue = true;
  for (var i in this.squares) {
    var pos = this.squares[i].getPosition();
    this.squares[i].setPosition(pos.x, pos.y + this.game.tileHeight);

    // If the next drop of this square would go too deep, we stop the entire drop.
    var size = this.squares[i].getSize();
    if (pos.y + this.game.tileHeight >= this.game.factoryHeight - size.height) {
      canContinue = false;
    }
  }
  
  return canContinue;
}

// The starting speed is the time between each tile drop (in ms)
robert_the_lifter.Piece.prototype.STARTING_SPEED = 1000;