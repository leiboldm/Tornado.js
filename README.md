Read Me

Tornado.js requires jQuery.

To use tornado.js, download tornado_all.js and use a script tag to add it to your page:

<script type="text/javascript" src="tornado_all.js"></script>

To create a basic tornado that has two people and spins the elements on the page, call the function spawnTornado, if you
wish to stop the tornado, call the function stop on the return value of spawnTornado like so:

var twister = spawnTornado();
twister.stop();

To add a lightning storm, follow similar steps:

var lightning = lightningStorm();
lightning.stop();

More detailed documentation to come once final functionality is determined.