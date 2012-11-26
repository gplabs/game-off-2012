goog.provide('robert_the_lifter.Score');

goog.require('lime.Sprite');

robert_the_lifter.Score = function(game) {
  this.setScore(0);
  
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

/**
 * Log a new score in the local storage highscores.
 */
robert_the_lifter.Score.prototype.logNewScore = function(name) {
  if (typeof Storage !== "undefined") {
    var highscores = [];
    if (typeof localStorage.rtl_highscores !== "undefined") {
        highscores = JSON.parse(localStorage.rtl_highscores);
    }
    highscores.push({name:name, score:this.getScore()});
    
    // Sort the array.
    highscores.sort(function(a, b) {
      return b.score - a.score;
    });
    
    // Keep only 10 scores.
    while (highscores.length > 10) {
      highscores.pop();
    }
    
    // Store in local storage.
    localStorage.rtl_highscores = JSON.stringify(highscores);
  }
}

/**
 * Log a new score in the local storage highscores.
 */
robert_the_lifter.Score.prototype.getHighscores = function() {
  if (typeof Storage !== "undefined" && typeof localStorage.rtl_highscores !== "undefined") {
    var highscores = JSON.parse(localStorage.rtl_highscores);
    return highscores;
  }
  
  return false;
}