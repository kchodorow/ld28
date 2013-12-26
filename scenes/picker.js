goog.provide('trolls.scenes.Picker');

goog.require('lib.Selectable');

trolls.scenes.Picker = function() {
    lime.Scene.call(this);

    var troll_list = trolls.controller.trolls_;
    var layer = new lime.Sprite().setSize(WIDTH, HEIGHT)
	.setPosition(0, HEIGHT/2).setAnchorPoint(0, .5)
	.setFill(trolls.resources.LIGHT_GREEN);
    layer.appendChild(
	lib.label('Which of you shall I choose as my vessel?')
	    .setPosition(WIDTH/2, -250).setFontSize(40));

    var x_offset = (WIDTH/5)/2;
    this.slot_ = [];
    for (var i = 0; i < troll_list.length; ++i) {
	var width = WIDTH/5-20;
	var slot = new lime.Sprite().setSize(WIDTH/5-20, 550)
	    .setPosition(i*WIDTH/5+x_offset, 100)
	    .setFill(trolls.resources.YELLOW)
	    .setStroke(2, trolls.resources.DARK_GREEN);
	lib.style.setCursorStyle(slot, 'pointer');
	this.slot_.push(slot);

	// Make selectable
	goog.object.extend(slot, new lib.Selectable());
	slot.selectable_.selectCallback.color = trolls.resources.YELLOW;
	if (i == 0) {
	    slot.select();
	    this.selected_ = 0;
	}

	// Troll sprite
	var doubler = new lime.Sprite().setScale(2, 2);
	var troll = troll_list[i].setPosition(0, 0).faceRight();
	troll.addHealthBar();
	doubler.appendChild(troll);
	lib.Debug.attach(doubler);
	slot.appendChild(doubler.setPosition(0, -120));

	var troll_name = this.label(troll.getName()).setPosition(0, -5)
	    .setSize(width, 100).setFontSize(30);
	lib.style.setCursorStyle(troll_name, 'pointer');
	lib.Debug.attach(troll_name);
	slot.appendChild(troll_name);

	var special = false;
	if (troll.attack_ != 0) {
	    slot.appendChild(
		this.label('Attack: '+troll.attack_).setPosition(0, -100));
	    special = true;
	}
	if (troll.defense_ != 0) {
	    slot.appendChild(
		this.label('Defense: '+troll.defense_).setPosition(0, 50));
	    special = true;
	}
	if (troll.speed_ != trolls.Troll.SPEED) {
	    slot.appendChild(
		this.label('Speed: '+troll.speed_).setPosition(0, 0));
	    special = true;
	}
	if (troll.custom_attack_) {
	    slot.appendChild(
		this.label('Special: '+troll.custom_attack_).setPosition(0, 50));
	    special = true;
	}
	if (!special) {
	    slot.appendChild(
		this.label('No unusual features, yet.')
		    .setSize(WIDTH/5-20, 400).setPosition(0, 230)
		    .setFontSize(24));
	}
	layer.appendChild(slot);
	goog.events.listen(
	    slot, ['mousedown', 'touchstart'], 
	    goog.bind(trolls.controller.begin, trolls.controller, troll));
    }

    goog.events.listen(
	this, ['keydown'], 
	goog.bind(trolls.scenes.Picker.prototype.keydown, this));

    this.appendChild(layer);
};

goog.inherits(trolls.scenes.Picker, lime.Scene);

// Clickable-style label.
trolls.scenes.Picker.prototype.label = function(text) {
    var label = lib.label(text);
    lib.style.setCursorStyle(label, 'pointer');
    return label;
};

trolls.scenes.Picker.prototype.keydown = function(e) {
    switch (e.event.keyCode) {
    case goog.events.KeyCodes.LEFT:
    case goog.events.KeyCodes.A:
    case goog.events.KeyCodes.A+32:
	if (this.selected_ == 0) {
	    break;
	}
	this.slot_[this.selected_].deselect();
	--this.selected_;
	this.slot_[this.selected_].select();
	break;
    case goog.events.KeyCodes.RIGHT:
    case goog.events.KeyCodes.D:
    case goog.events.KeyCodes.D+32:
	if (this.selected_ == this.slot_.length-1) {
	    break;
	}
	this.slot_[this.selected_].deselect();
	++this.selected_;
	this.slot_[this.selected_].select();
	break;
    case goog.events.KeyCodes.ENTER:
    case goog.events.KeyCodes.SPACE:
	trolls.controller.begin(trolls.getTroll(this.selected_));
    }
    return true;
};
