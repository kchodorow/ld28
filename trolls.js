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
//    director.replaceScene(trolls.startScene());
    director.replaceScene(trolls.pickerScene());
};

trolls.startScene = function() {
    var scene = new lime.Scene();
    var layer = new lime.Sprite().setSize(WIDTH, HEIGHT)
	.setPosition(0, HEIGHT/2).setAnchorPoint(0, .5);

    for (var x = 0; x < 9; ++x) {
	for (var y = 0; y < 7; ++y) {
	    var grass = new lime.Sprite().setFill(trolls.resources.getGrass())
		.setPosition(x*LEN, y*LEN);

	    if (x == 4 && y == 3) {
		grass.appendChild(trolls.resources.getIdol());
	    }
//	    if (y == 2 && x >= 2 && x <= 6) {
//		grass.appendChild(trolls.controller.trolls_[x-2]);
//	    }
	    layer.appendChild(grass);
	}
    }
    scene.appendChild(layer);
    return scene;
};

trolls.pickerScene = function() {
    var troll_list = trolls.controller.trolls_;
    var scene = new lime.Scene();
    var layer = new lime.Sprite().setSize(WIDTH, HEIGHT)
	.setPosition(0, HEIGHT/2).setAnchorPoint(0, .5)
	.setFill(trolls.resources.LIGHT_GREEN);
    layer.appendChild(
	lib.label('Choose only one troll as your vessel:')
	    .setPosition(WIDTH/2, -250));

    var x_offset = (WIDTH/5)/2;
    for (var i = 0; i < troll_list.length; ++i) {
	var slot = new lime.Sprite().setSize(WIDTH/5-20, 400)
	    .setPosition(i*WIDTH/5+x_offset, 0)
	    .setFill(trolls.resources.YELLOW)
	    .setStroke(2, trolls.resources.DARK_GREEN);
	slot.createDomElement();
	goog.style.setStyle(slot.domElement, 'cursor', 'pointer');
	var troll = troll_list[i];
	slot.appendChild(troll.setPosition(0, -120).setSize(88, 88));
	var special = false;
	if (troll.attack_ != 0) {
	    slot.appendChild(
		lib.label('Attack: '+troll.attack_).setPosition(0, -100));
	    special = true;
	}
	if (troll.defense_ != 0) {
	    slot.appendChild(
		lib.label('Defense: '+troll.defense_).setPosition(0, 50));
	    special = true;
	}
	if (troll.speed_ != trolls.Troll.SPEED) {
	    slot.appendChild(
		lib.label('Speed: '+troll.speed_).setPosition(0, 0));
	    special = true;
	}
	if (troll.custom_attack_) {
	    slot.appendChild(
		lib.label('Special: '+troll.custom_attack_).setPosition(0, 50));
	    special = true;
	}
	if (!special) {
	    slot.appendChild(
		lib.label('Nothing special about this troll, yet.')
		    .setSize(WIDTH/5-20, 400).setPosition(0, 130)
		    .setFontSize(30));
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
