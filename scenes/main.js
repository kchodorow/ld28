goog.provide('trolls.scenes.Main');

trolls.scenes.Main = function() {
    lime.Scene.call(this);

    var layer = new lime.Layer().setSize(WIDTH, HEIGHT).setAnchorPoint(.5, .5)
	.setPosition(WIDTH/2, HEIGHT/2);

    var village = new trolls.data.Village();
    lib.style.setBackgroundFrame(village, trolls.resources.getGrass());
//    this.addVillage(village);
    layer.appendChild(village);

    for (var i = 0; i < trolls.controller.trolls_.length; i++) {
	var troll = trolls.controller.trolls_[i];
	troll.walk_ = trolls.resources.getTrollWalk();
	troll.runAction(troll.walk_);
	//troll.setStartingPos(village_size);
	layer.appendChild(troll);
    }

    this.appendChild(layer);
//    var hud = new trolls.Hud();
//    hud.setPosition(WIDTH/2, 100);
//    this.addHud(hud);
//    this.appendChild(hud);
};

goog.inherits(trolls.scenes.Main, lime.Scene);
