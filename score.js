goog.provide('robert_the_lifter.Score');

goog.require('lime.Sprite');

robert_the_lifter.Score = function(game) {
  this.setScore(10000);
  
}

robert_the_lifter.Score.prototype.setScore = function(new_score) {
  this.score = new_score;
  this.displayScore();
}

robert_the_lifter.Score.prototype.getScore = function() {
  return this.score;
}

robert_the_lifter.Score.prototype.displayScore = function() {
  this.lbl = new lime.Label().setText(this.getScore()+'$').setFontFamily('Verdana').
    setFontColor('#c00').setFontSize(26).setFontWeight('bold').setSize(150,30).setPosition(1200, 160);
}