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
goog.require('trolls.Hud');
goog.require('trolls.Troll');
goog.require('trolls.data.Resources');
goog.require('trolls.data.Stats');
goog.require('trolls.data.Tutorial');
goog.require('trolls.data.Village');
goog.require('trolls.scenes.Intro');

var WIDTH = 1024;
var HEIGHT = 768;
var LEN = 44;

// entrypoint
trolls.start = function(){
    trolls.resources = new trolls.data.Resources();
    trolls.tutorial = new trolls.data.Tutorial();
    trolls.stats = new trolls.data.Stats();

    var director = new lime.Director(document.body,1024,768);
    trolls.controller = new trolls.Controller(director);

    var NUM_TROLLS = 5;
    for (var i = 0; i < NUM_TROLLS; i++) {
	var troll = new trolls.Troll();
	trolls.controller.addTroll(troll);
    }
    
    director.makeMobileWebAppCapable();
    director.replaceScene(new trolls.scenes.Intro());
};

goog.exportSymbol('trolls.start', trolls.start);
