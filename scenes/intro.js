goog.provide('trolls.scenes.Intro');

goog.require('lib.style');
goog.require('lib.Debug');
goog.require('lime.Button');
goog.require('lime.Scene');

goog.require('trolls.scenes.Picker');

trolls.scenes.Intro = function() {
    lime.Scene.call(this);

    // Add background.
    var bg = new lime.Sprite().setSize(WIDTH, HEIGHT).setPosition(WIDTH/2, HEIGHT/2);
    lib.style.setBackgroundFrame(bg, trolls.resources.getGrass());

    // Add evil god.
    bg.appendChild(this.getIdol().setPosition(0, -40));

    // Add trolls.
    bg.appendChild(trolls.controller.trolls_[0].setPosition(-122, -10));
    bg.appendChild(trolls.controller.trolls_[1].setPosition(-78, -96));
    bg.appendChild(trolls.controller.trolls_[2].setPosition(0, -124));
    bg.appendChild(trolls.controller.trolls_[3].setPosition(78, -96).changeDirection());
    bg.appendChild(trolls.controller.trolls_[4].setPosition(122, -10).changeDirection());

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

    // Add button.
    var button_label = lib.label("Begin sacred rampage \u2192");
    var button_sprite = new lime.RoundedRect()
	.setSize(button_label.getFrame().size().scale(1.05, 1.2))
	.setFill(trolls.resources.YELLOW)
	.setStroke(3, trolls.resources.DARK_GREEN)
	.setPosition(212, 219);
    lib.style.setStyle(button_sprite, '{cursor:pointer;}');
    lib.style.setStyle(button_label, '{cursor:pointer;}');
    button_sprite.appendChild(button_label);
    lib.Debug.attach(button_sprite);
    var button = new lime.Button(button_sprite);
    bg.appendChild(button);
    goog.events.listen(
	button, [lime.Button.Event.CLICK, 'keydown'], this.endScene);

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

trolls.scenes.Intro.prototype.endScene = function(e) {
    e.target.getDirector().replaceScene(new trolls.scenes.Picker());
};
