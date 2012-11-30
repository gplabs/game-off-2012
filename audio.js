goog.provide('robert_the_lifter.Audio');

robert_the_lifter.Audio = function(file, repeat) {
  var sound = new lime.audio.Audio(file);
  function playSound() {
    if (sound.isLoaded()) {
      if (!sound.isPlaying()) {
         sound.play();
      }
      else {
        sound.playing_ = false;
        if (!repeat) {
          lime.scheduleManager.unschedule(playSound, this);
        }
      }
    }
  }
  lime.scheduleManager.schedule(playSound, this);
}