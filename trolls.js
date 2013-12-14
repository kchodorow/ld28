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
    director.replaceScene(trolls.pickerScene(trolls.controller.trolls_));
};

trolls.pickerScene = function(troll_list) {
    var scene = new lime.Scene();
    var layer = new lime.Sprite().setSize(WIDTH, HEIGHT)
	.setPosition(0, HEIGHT/2).setAnchorPoint(0, .5).setFill('#fff');
    layer.appendChild(
	lib.label('Choose only one troll as your vessel:')
	    .setPosition(WIDTH/2, -250));

    var x_offset = (WIDTH/5)/2;
    for (var i = 0; i < troll_list.length; ++i) {
	var slot = new lime.Sprite().setSize(WIDTH/5-20, 400)
	    .setPosition(i*WIDTH/5+x_offset, 0).setFill('#333');
	var troll = troll_list[i];
	slot.appendChild(troll.setPosition(0, -150));
	if (troll.attack_ != 0) {
	    slot.appendChild(
		lib.label('Attack: '+troll.attack_).setPosition(0, -100));
	}
	if (troll.defense_ != 0) {
	    slot.appendChild(
		lib.label('Defense: '+troll.defense_).setPosition(0, 50));
	}
	if (troll.speed_ != trolls.Troll.SPEED) {
	    slot.appendChild(
		lib.label('Speed: '+troll.speed_).setPosition(0, 0));
	}
	if (troll.custom_attack_) {
	    slot.appendChild(
		lib.label('Special: '+troll.custom_attack_).setPosition(0, 50));
	}
	layer.appendChild(slot);
	goog.events.listen(
	    slot, ['mousedown', 'touchstart'],
	    goog.bind(trolls.controller.begin, trolls.controller, troll));
    }
    scene.appendChild(layer);
    return scene;
};


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('trolls.start', trolls.start);
