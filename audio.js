goog.provide('robert_the_lifter.Audio');

robert_the_lifter.Audio = function(file, repeat) {
  this.sound = new lime.audio.Audio(file);
//  this.sound = new lime.audio.Audio("sounds/music_loop.wav");
  this.mustPlay = true;
  this.endIn = 0;
  
  this.playSound = function (number) {
    if (this.sound.isLoaded()) {
      if (this.mustPlay) {
        if (!this.sound.isPlaying()) {
          this.sound.play();
        }
          
        this.endIn -= number;
        if (repeat && this.endIn <= 0) {
          this.sound.stop();
          this.endIn = 130000;
          this.sound.play();
        }
      } else {
        this.sound.stop();
        this.endIn = 130000;
      }
    }
  }
  this.startMusic();
}

robert_the_lifter.Audio.prototype.startMusic = function() {
  this.mustPlay = true;
  lime.scheduleManager.schedule(this.playSound, this);
}

robert_the_lifter.Audio.prototype.stopMusic = function() {
  this.mustPlay = false;
  lime.scheduleManager.unschedule(this.playSound, this);
  
  this.sound.stop();
  this.endIn = 130000;
}