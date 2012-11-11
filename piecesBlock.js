/* 
 * This file will manage the block of pieces that are placed on the field.
 * A piece that wil touch the bottom of the field, or one that will touch another 
 * piece that is part of this block will be automatically transfered as part of 
 * this block.
 * 
 * This object will also be responsible for clearing a cmplete line and managing
 * piece dropping afterward.
 */
goog.provide('robert_the_lifter.PiecesBlock');

robert_the_lifter.PiecesBlock = function(game) {
  this.game = game;
  this.pieces = [];
}

robert_the_lifter.PiecesBlock.prototype.addPiece = function(piece) {
  this.pieces.push(piece);
}

/**
 * Check if the piece must be added to the piecesBlock.
 */
robert_the_lifter.PiecesBlock.prototype.mustBeAdded = function(piece) {
  var mustBeAdded = false;
  // Check if the piece reached the left limit of the factory.
  if (piece.reachedLeftLimit()) {
    mustBeAdded = true;
    
  // Check if any of the pieces of the block is directly to the left of the piece.
  } else {
    for (var k = 0; k < piece.squares.length && !mustBeAdded; k ++) {
      var piecePos = piece.squares[k].getPosition();
      var targetX = piecePos.x - this.game.tileWidth,
          targetY = piecePos.y;

      
      for (var i = 0; i < this.pieces.length && !mustBeAdded; i ++) {
        for (var j = 0; j < this.pieces[i].squares.length && !mustBeAdded; j ++) {
          var otherPos = this.pieces[i].squares[j].getPosition();

          if (otherPos.x == targetX && otherPos.y == targetY) {
            mustBeAdded = true;
          }
        }
      }
    }
  }
  
  return mustBeAdded;
}