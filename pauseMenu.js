goog.provide('robert_the_lifter.PauseMenu');

goog.events.listen(this, goog.events.EventType.KEYDOWN, function (ev) {
  switch (event.keyCode) {
    case 27: // Escape -- Pause the game
      robert_the_lifter.Director.isPaused = !robert_the_lifter.Director.isPaused;
      robert_the_lifter.Director.setPaused(robert_the_lifter.Director.isPaused);
      break;
  }
});

