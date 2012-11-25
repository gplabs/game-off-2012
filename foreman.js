/**
 * The foreman control employees. When he sees a piece must be pushed, he
 * sends out an employee to push it until the pieces can move no more.
 */

goog.provide('robert_the_lifter.Foreman');

robert_the_lifter.Foreman = function(game) {
  this.game = game;
  
  // Constantly checking out pieces.
  this.checkPieces = function(number) {
    if (!this.game.isPaused) {
      for (var i in game.pieces) {
        if (game.pieces[i].state !== robert_the_lifter.Piece.GRABBED) {

          // If the piece is being blocked by another piece that is not the grabbed 
          // piece, it must stop and it state is changed to 'BLOCKED'.
          var blockingPiece = game.whatBlocksPiece(game.pieces[i]);
          var canBePushed, isBlocked;

          switch (blockingPiece) {
            case robert_the_lifter.Game.NO_PIECE:
              canBePushed = true;
              isBlocked = false;
              break;
            case robert_the_lifter.Game.GROUND:
              canBePushed = false;
              isBlocked = true;
              break;
            case robert_the_lifter.Game.ROBERT:
            case robert_the_lifter.Game.GRABBED_PIECE:
              canBePushed = false;
              isBlocked = false;
              break;
          }

          // Adjust state of the piece and push it.
          if (canBePushed) {
            // pushing the piece at it's defined speed.
            game.pieces[i].timeToNextPush -= number;
            if (game.pieces[i].timeToNextPush <= 0) {
              game.push(game.pieces[i]);
              game.pieces[i].timeToNextPush += game.getPieceSpeed();
            }
          } else {
            if (isBlocked) {
              game.pieces[i].state = robert_the_lifter.Piece.BLOCKED;
              game.pieces[i].timeToNextPush = game.getPieceSpeed();
            } else {
              game.pieces[i].state = robert_the_lifter.Piece.GETTING_PUSHED;
            }
          }
        }
      }

      this.game.checkAndClearLine();
    }
  }
  lime.scheduleManager.schedule(this.checkPieces, this);
}

robert_the_lifter.Foreman.prototype.stop = function() {
  lime.scheduleManager.unschedule(this.checkPieces, this);
}