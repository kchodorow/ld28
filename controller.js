goog.provide('trolls.Controller');

goog.require('goog.events.KeyCodes');
goog.require('lime.scheduleManager');


trolls.Controller = function(scene) {
    this.actors_ = [];
    this.trolls_ = [];

    goog.events.listen(scene, ['keydown'], goog.partial(this.keydown, this));
    goog.events.listen(scene, ['keyup'], goog.partial(this.keyup, this));

    lime.scheduleManager.schedule(this.step, this);
};

trolls.Controller.prototype.keydown = function(controller, e) {
    switch (e.event.keyCode) {
    case goog.events.KeyCodes.LEFT:
    case goog.events.KeyCodes.A:
	controller.controlled_.setDirection(-1, 0);
	break;
    case goog.events.KeyCodes.RIGHT:
    case goog.events.KeyCodes.D:
	controller.controlled_.setDirection(1, 0);
	break;
    case goog.events.KeyCodes.UP:
    case goog.events.KeyCodes.W:
	controller.controlled_.setDirection(0, -1);
	break;
    case goog.events.KeyCodes.DOWN:
    case goog.events.KeyCodes.S:
	controller.controlled_.setDirection(0, 1);
	break;
    case goog.events.KeyCodes.SPACE:
	controller.controlled_.attack();
	break;
    }
};

trolls.Controller.prototype.keyup = function(controller, e) {
    controller.controlled_.setDirection(0, 0);
};

trolls.Controller.prototype.findTarget = function(actor) {
    if (actor.id == 'Troll') {
	var huts = this.village_.getHuts();
	return huts[lib.random(huts.length)];
    } else {
	var min_distance = WIDTH*HEIGHT;
	var troll = null;
	for (var i = 0; i < this.trolls_.length; ++i) {
	    var distance = goog.math.Coordinate.distance(
		this.trolls_[i].getPosition(), actor.getPosition());
	    if (distance < min_distance) {
		min_distance = distance;
		troll = this.trolls_[i];
	    }
	}
	return troll;
    }
    return null;
};

trolls.Controller.prototype.choose = function(troll) {
    troll.choose();
    this.controlled_ = troll;
};

trolls.Controller.prototype.addVillage = function(village) {
    this.village_ = village;
    for (var i = 0; i < village.villagers_.length; i++) {
	this.addActor_(village.villagers_[i]);
    }
};

trolls.Controller.prototype.addTroll = function(troll) {
    this.actors_.push(troll);
    this.trolls_.push(troll);
};

trolls.Controller.prototype.addActor_ = function(thing) {
    this.actors_.push(thing);
};

trolls.Controller.prototype.step = function(dt) {
    var num_actors = this.actors_.length;
    for (var i = 0; i < num_actors; ++i) {
	this.actors_[i].step(dt);
    }
};
