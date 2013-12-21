goog.provide('trolls.scenes.Intro');

goog.require('lib.style');
goog.require('lib.Debug');
goog.require('lime.Scene');

trolls.scenes.Intro = function() {
    lime.Scene.call(this);

    var bg = new lime.Sprite().setSize(WIDTH, HEIGHT).setPosition(WIDTH/2, HEIGHT/2);
    lib.style.setBackgroundFrame(bg, trolls.resources.getGrass());

    bg.appendChild(this.getIdol().setPosition(0, -40));

    bg.appendChild(trolls.controller.trolls_[0].setPosition(-122, -10));
    bg.appendChild(trolls.controller.trolls_[1].setPosition(-78, -96));
    bg.appendChild(trolls.controller.trolls_[2].setPosition(0, -124));
    bg.appendChild(trolls.controller.trolls_[3].setPosition(78, -96).changeDirection());
    bg.appendChild(trolls.controller.trolls_[4].setPosition(122, -10).changeDirection());

    this.appendChild(bg);

    var label = lib.label(
	"Loyal troll worshippers, I will lead you in retaking this "+
	"land from the humans.").setSize(WIDTH-400, 400).setPosition(0, 270);
    lib.Debug.attach(label);
    label.setOpacity(0);
    var target = new lime.animation.FadeTo(1);
    label.runAction(target);
    goog.events.listen(target, lime.animation.Event.STOP, this.talk);
    bg.appendChild(label);

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
