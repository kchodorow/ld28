goog.provide('trolls.Controller');

goog.require('goog.events.KeyCodes');
goog.require('lime.scheduleManager');

goog.require('trolls.data.Power');

trolls.Controller = function(director) {
    this.director_ = director;
    this.actors_ = [];
    this.trolls_ = [];
};

trolls.Controller.prototype.begin = function(troll) {
    this.choose(troll);
    this.scene_ = this.createScene();
    goog.events.listen(this.scene_, ['keydown'], goog.partial(this.keydown, this));
    goog.events.listen(this.scene_, ['keyup'], goog.partial(this.keyup, this));
    lime.scheduleManager.schedule(this.step, this);
    this.director_.replaceScene(this.scene_);
};

// Go to the choose troll screen.
trolls.Controller.prototype.changeScene = function() {
    this.controlled_.unchoose();
    this.director_.replaceScene(trolls.pickerScene());
    this.actors_ = [];
    for (var i = 0; i < this.trolls_.length; ++i) {
	this.trolls_[i].walk_.stop();
    }
    goog.array.extend(this.actors_, this.trolls_);
    lime.scheduleManager.unschedule(this.step, this);
}

trolls.Controller.prototype.createScene = function() {
    var scene = new lime.Scene();
    var layer = new lime.Layer().setSize(WIDTH, HEIGHT).setAnchorPoint(.5, .5)
	.setPosition(WIDTH/2, HEIGHT/2);

    var village_size = new goog.math.Size(20, 15);
    var village = new trolls.data.Village(village_size);
    this.addVillage(village);
    layer.appendChild(village);

    for (var i = 0; i < this.trolls_.length; i++) {
	var troll = this.trolls_[i];
	troll.walk_ = trolls.resources.getTrollWalk();
	troll.runAction(troll.walk_);
	troll.setStartingPos(village_size);
	layer.appendChild(troll);
    }

    scene.appendChild(layer);
    var hud = new trolls.Hud();
    hud.setPosition(WIDTH/2, 70);
    this.addHud(hud);
    scene.appendChild(hud);

    return scene;
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
	var troll = controller.controlled_;
	var targets = goog.array.concat(
	    controller.village_.getHuts(), controller.village_.getPowerUps());
	troll.goal_ = controller.findClosestTarget_(troll, targets);
	if (troll.goal_.id == 'Power') {
	    controller.hud_.inquireAbout(troll.goal_);
	} else {
	    troll.attack();
	}
	break;
    }
};

trolls.Controller.prototype.keyup = function(controller, e) {
    controller.controlled_.setDirection(0, 0);
};

trolls.Controller.prototype.findTarget = function(actor) {
    if (actor.id == 'Troll') {
	return this.findClosestTarget_(actor, this.village_.getHuts());
    } else {
	return this.findClosestTarget_(actor, this.trolls_);
    }
    return null;
};

trolls.Controller.prototype.findClosestTarget_ = function(actor, targets) {
    var min_distance = WIDTH*HEIGHT;
    var target = null;
    for (var i = 0; i < targets.length; ++i) {
	var distance = goog.math.Coordinate.distance(
	    targets[i].getPosition(), actor.getPosition());
	if (distance < min_distance) {
	    min_distance = distance;
	    target = targets[i];
	}
    }
    return target;
};

trolls.Controller.prototype.choose = function(troll) {
    troll.choose();
    this.controlled_ = troll;
};

trolls.Controller.prototype.addHud = function(hud) {
    this.hud_ = hud;
}

trolls.Controller.prototype.addVillage = function(village) {
    this.village_ = village;
    for (var i = 0; i < village.villagers_.length; i++) {
	this.addActor_(village.villagers_[i]);
    }
};

trolls.Controller.prototype.removeHut = function(e) {
    var hut = e.target.targets[0];
    var pos = hut.getPosition();
    this.village_.removeHut(hut);
    if (lib.random(3) == 0) {
	var power = trolls.data.Power.getRandom();
	this.village_.addPower(power, pos);
    }
};

trolls.Controller.prototype.removeVillager = function(e) {
    var hut = e.target.targets[0];
    var pos = hut.getPosition();
    this.village_.removeVillager(hut);
    if (lib.random(3) == 0) {
	var power = trolls.data.Power.getRandom();
	this.village_.addPower(power, pos);
    }
};

trolls.Controller.prototype.addPower = function(power) {
    power.attachTo(this.controlled_);
};

trolls.Controller.prototype.addTroll = function(troll) {
    this.actors_.push(troll);
    this.trolls_.push(troll);
};

trolls.Controller.prototype.addActor_ = function(thing) {
    this.actors_.push(thing);
};

trolls.Controller.prototype.changeMorale = function(amount) {
    this.hud_.changeMorale(amount);
};

trolls.Controller.prototype.step = function(dt) {
    var num_actors = this.actors_.length;
    for (var i = 0; i < num_actors; ++i) {
	this.actors_[i].step(dt);
    }

    // in %
    var THRESHOLD = 5;
    if (this.hud_.getMorale() < THRESHOLD) {
	this.changeScene();
    }
};
