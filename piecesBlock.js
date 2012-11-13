///* 
// * This file will manage the block of pieces that are placed on the field.
// * A piece that wil touch the bottom of the field, or one that will touch another 
// * piece that is part of this block will be automatically transfered as part of 
// * this block.
// * 
// * This object will also be responsible for clearing a cmplete line and managing
// * piece dropping afterward.
// */
//goog.provide('robert_the_lifter.PiecesBlock');
//
//robert_the_lifter.PiecesBlock = function(game) {
//  this.game = game;
//  this.pieces = [];
//  
//  // fill the entire field with -1s
//  this.lines = [];
//  for(var i = 0; i <= game.factoryNbTileHeight - 1; i++) {
//    this.lines[i] = [];
//    for(var j = 0; j <= game.factoryNbTileWidth - 1; j++) {
//      this.lines[i][j] = -1;
//    }
//  }
//  
//  this.printLines();
//}
//
///**
// * Remove a piece from the block. This should occur when a piece is grabbed by robert.
// */
//robert_the_lifter.PiecesBlock.prototype.removePiece = function(piece) {
//  var index = this.pieces.indexOf(piece);
//  this.pieces.splice(index, 1);
//  this.switchPieceState(piece, -1);
//  this.printLines();
//}
//
///**
// * Add a piece to the block. also registering it to make a line.
// */
//robert_the_lifter.PiecesBlock.prototype.addPiece = function(piece) {
//  piece.isFreeFalling = false;
//  this.pieces.push(piece);
//  this.switchPieceState(piece, piece.key);
//  this.checkAndClearLine();
//  this.printLines();
//}
//
//robert_the_lifter.PiecesBlock.prototype.checkAndClearLine = function() {
//  for(var x = 0; x < this.game.factoryNbTileWidth; x ++) {
//    var lineFull = true;
//    
//    // If we find a 0 in the line, it's not full !
//    for(var y = 0; y < this.game.factoryNbTileHeight && lineFull; y ++) {
//      if (this.lines[y][x] <= -1) {
//        lineFull = false;
//      }
//    }
//    
//    if (lineFull) {
//      var squareRemaining = this.game.factoryNbTileHeight;
//      var squareX = x * this.game.tileWidth + (this.game.tileWidth / 2);
//      
//      for(var i = 0; i < this.pieces.length && squareRemaining > 0; i ++) {
//        
//        for(var j = this.pieces[i].squares.length - 1; j >= 0  && squareRemaining > 0; j --) {
//          var squarePos = this.pieces[i].squares[j].getPosition();
//          if (squarePos.x == squareX) {
//            squareRemaining--;
//            this.switchSquareState(this.pieces[i].squares[j], 0);
//            
//            // Remove the crate form the game.
//            this.pieces[i].removeSquare(j);
//          }
//        }
//      }
//      
//      this.printLines();
//    }
//  }
//}
//
////robert_the_lifter.PiecesBlock.prototype.switchPieceState = function(piece, newState) {
////  for(var i in piece.squares) {
////    this.switchSquareState(piece.squares[i], newState);
////  }
////}
//
////robert_the_lifter.PiecesBlock.prototype.switchSquareState = function(square, newState) {
////  var anchor = square.getAnchorPoint();
////  var pos = square.getPosition();
////  var size = square.getSize();
////
////  var x = (pos.x - (size.width * anchor.x) - this.game.factoryX) / this.game.tileWidth;
////  var y = (pos.y - (size.height * anchor.y) - this.game.factoryY) / this.game.tileHeight;
////
////  this.lines[y][x] = newState;
////}
//
///**
// * Check if the piece must be added to the piecesBlock.
// */
//robert_the_lifter.PiecesBlock.prototype.mustBeAdded = function(piece) {
//  var mustBeAdded = false;
//  // Check if the piece reached the left limit of the factory.
//  if (piece.reachedLeftLimit()) {
//    mustBeAdded = true;
//    
//  // Check if any of the pieces of the block is directly to the left of the piece.
//  } else {
//    for (var k = 0; k < piece.squares.length && !mustBeAdded; k ++) {
//      var piecePos = piece.squares[k].getPosition();
//      var targetX = piecePos.x - this.game.tileWidth,
//          targetY = piecePos.y;
//
//      
//      for (var i = 0; i < this.pieces.length && !mustBeAdded; i ++) {
//        for (var j = 0; j < this.pieces[i].squares.length && !mustBeAdded; j ++) {
//          var otherPos = this.pieces[i].squares[j].getPosition();
//
//          if (otherPos.x == targetX && otherPos.y == targetY) {
//            mustBeAdded = true;
//          }
//        }
//      }
//    }
//  }
//  
//  return mustBeAdded;
//}
//
//robert_the_lifter.PiecesBlock.prototype.printLines = function() {
//  if (document.getElementById('debug')) {
//    var output = "";
//    for(var i in this.lines) {
//      for(var j in this.lines[i]) {
//        
//        var pad = "00";
//        var n = this.lines[i][j];
//        var result = (pad+n).slice(-pad.length);
//        if (this.lines[i][j] > -1) {
//          output += "<span class='fill'>" + result + ", </span>";
//        } else {
//          output += "<span class='empty'>" + result + ", </span>";
//        }
//      }
//      output += "<br />";
//    }
//
//    document.getElementById('debug').innerHTML = output;
//  }
//}