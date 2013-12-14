//set main namespace
goog.provide('trolls');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

goog.require('lib');
goog.require('trolls.Controller'); // Ha!
goog.require('trolls.Troll');
goog.require('trolls.data.Resources');
goog.require('trolls.data.Stats');
goog.require('trolls.data.Tutorial');
goog.require('trolls.data.Village');

var WIDTH = 1024;
var HEIGHT = 768;
var LEN = 44;

// entrypoint
trolls.start = function(){
    trolls.resources = new trolls.data.Resources();
    trolls.tutorial = new trolls.data.Tutorial();
    trolls.stats = new trolls.data.Stats();

    var director = new lime.Director(document.body,1024,768);
    var scene = new lime.Scene();
    var layer = new lime.Layer().setSize(WIDTH, HEIGHT).setAnchorPoint(.5, .5)
	.setPosition(WIDTH/2, HEIGHT/2);
    var controller = new trolls.Controller(scene);

    var village_size = new goog.math.Size(20, 20);
    var village = new trolls.data.Village(village_size);
    layer.appendChild(village);

    var NUM_TROLLS = 5;
    for (var i = 0; i < NUM_TROLLS; i++) {
	var troll = new trolls.Troll();
	controller.addTroll(troll);
	troll.setStartingPos(village_size);
	layer.appendChild(troll);
	if (i == 0) {
	    controller.choose(troll);
	}
    }

    scene.appendChild(layer);

    director.makeMobileWebAppCapable();

    // set current scene active
    director.replaceScene(scene);

};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('trolls.start', trolls.start);
