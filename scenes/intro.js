goog.provide('trolls.scenes.Intro');

goog.require('lib.style');
goog.require('lib.Debug');
goog.require('lib.Selectable');
goog.require('lime.Button');
goog.require('lime.Scene');

goog.require('trolls.scenes.Picker');

trolls.scenes.Intro = function() {
    lime.Scene.call(this);

    // Add background.
    var bg = new lime.Sprite().setSize(WIDTH, HEIGHT)
	.setPosition(WIDTH/2, HEIGHT/2);
    lib.style.setBackgroundFrame(bg, trolls.resources.getGrass());

    // Add scaling node.
    var node = new lime.Node().setScale(2, 2);

    // Add evil god.
    node.appendChild(this.getIdol().setPosition(0, -40));

    // Add trolls.
    node.appendChild(trolls.controller.trolls_[0].setPosition(-122, -10));
    node.appendChild(trolls.controller.trolls_[1].setPosition(-78, -96));
    node.appendChild(trolls.controller.trolls_[2].setPosition(0, -124));
    node.appendChild(
	trolls.controller.trolls_[3].setPosition(78, -96).changeDirection());
    node.appendChild(
	trolls.controller.trolls_[4].setPosition(122, -10).changeDirection());
    bg.appendChild(node);

    // Add evil message.
    var label = lib.label(
	"I will lead you in retaking our land from the human usurpers, my "+
	    "children.").setSize(WIDTH-400, 400).setPosition(0, 270);
    lib.Debug.attach(label);
    label.setOpacity(0);
    var target = new lime.animation.FadeTo(1);
    label.runAction(target);
    goog.events.listen(target, lime.animation.Event.STOP, this.talk);
    bg.appendChild(label);

    // Add buttons.
    var continue_btn = this.addContinue();
    bg.appendChild(continue_btn);

    this.appendChild(bg);
};

goog.inherits(trolls.scenes.Intro, lime.Scene);

trolls.scenes.Intro.prototype.getIdol = function() {
    var plain = new lime.Sprite().setFill(trolls.resources.getIdol(false));
    var angry = new lime.Sprite().setFill(trolls.resources.getIdol(true));
    lib.Debug.attach(plain);

    plain.appendChild(angry);
    // Pulse the eyes in and out
    angry.runAction(new lime.animation.Loop(
	new lime.animation.Sequence(
	    new lime.animation.FadeTo(0), 
	    new lime.animation.FadeTo(1))));

    return plain;
};

trolls.scenes.Intro.prototype.talk = function(e) {
    e.target.targets[0].runAction(
	new lime.animation.Loop(
	    new lime.animation.Sequence(
		new lime.animation.FadeTo(1),
		new lime.animation.FadeTo(.6))));
};

trolls.scenes.Intro.prototype.addContinue = function() {
    var button_label = lib.label("Begin sacred rampage \u2192");
    var button_size = button_label.getFrame().size().scale(1.05, 1.2);
    var button_sprite = new lime.RoundedRect()
	.setSize(button_size)
	.setFill(trolls.resources.YELLOW)
	.setStroke(3, trolls.resources.DARK_GREEN)
	.setPosition(212, 219);
    lib.style.setStyle(button_sprite, '{cursor:pointer;}');
    lib.style.setStyle(button_label, '{cursor:pointer;}');
    button_sprite.appendChild(button_label);
    lib.Debug.attach(button_sprite);
    goog.object.extend(button_sprite, new lib.Selectable());
    button_sprite.selectable_.selectCallback.color = trolls.resources.YELLOW;
    button_sprite.select();

    var button = new lime.Button(button_sprite);
    goog.events.listen(
	button, [lime.Button.Event.CLICK, 'keydown'], this.endScene);
    return button;
}

trolls.scenes.Intro.prototype.endScene = function(e) {
    if (e.type == lime.Button.Event.CLICK) {
	e.target.getDirector().replaceScene(new trolls.scenes.Picker());
	return;
    }
    switch (e.event.keyCode) {
    case goog.events.KeyCodes.SPACE:
    case goog.events.KeyCodes.ENTER:
	e.target.getDirector().replaceScene(new trolls.scenes.Picker());
	break;
    }
    return true;
};
