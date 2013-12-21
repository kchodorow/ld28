goog.provide('trolls.scenes.Picker');

trolls.scenes.Picker = function() {
    lime.Scene.call(this);

    var troll_list = trolls.controller.trolls_;
    var layer = new lime.Sprite().setSize(WIDTH, HEIGHT)
	.setPosition(0, HEIGHT/2).setAnchorPoint(0, .5)
	.setFill(trolls.resources.LIGHT_GREEN);
    layer.appendChild(
	lib.label('I will choose one of you as my vessel.')
	    .setPosition(WIDTH/2, -250));

    var x_offset = (WIDTH/5)/2;
    for (var i = 0; i < troll_list.length; ++i) {
	var slot = new lime.Sprite().setSize(WIDTH/5-20, 400)
	    .setPosition(i*WIDTH/5+x_offset, 0)
	    .setFill(trolls.resources.YELLOW)
	    .setStroke(2, trolls.resources.DARK_GREEN);
	slot.createDomElement();
	goog.style.setStyle(slot.domElement, 'cursor', 'pointer');

	// Troll sprite
	var doubler = new lime.Sprite().setScale(2, 2);
	var troll = troll_list[i].setPosition(0, 0).faceRight();
	doubler.appendChild(troll);
	slot.appendChild(doubler.setPosition(0, -120));

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
    this.appendChild(layer);
};

goog.inherits(trolls.scenes.Picker, lime.Scene);

