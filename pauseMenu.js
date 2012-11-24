goog.provide('robert_the_lifter.PauseMenu');

robert_the_lifter.PauseMenu = function() {
  function pauseEvent() {
    robert_the_lifter.Director.isPaused = !robert_the_lifter.Director.isPaused;
    robert_the_lifter.Director.setPaused(robert_the_lifter.Director.isPaused);
  }
  KeyboardJS.on("esc", pauseEvent);
}

