Read Me

Tornado.js requires jQuery.

To use tornado.js, download both tornado.js and tornadoDestruction.js and use script tags to add them to your page.
To create a basic tornado that has two people and spins the elements on the page, call the function spawnTornado, if you
wish to stop the tornado, call the function stop on the return value of spawnTornado like so:

var twister = spawnTornado();
twister.stop();

To add a lightning storm, follow similar steps:

var lightning = lightningStorm();
lightning.stop();

More detailed documentation to come once final functionality is determined.