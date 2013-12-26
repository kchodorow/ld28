goog.provide('trolls.Controller');

goog.require('goog.events.KeyCodes');
goog.require('lime.scheduleManager');

goog.require('trolls.data.Power');
goog.require('trolls.scenes.Main');

trolls.Controller = function(director) {
    this.director_ = director;
    this.actors_ = [];
    this.trolls_ = [];
};

trolls.Controller.prototype.begin = function(troll) {
    this.choose(troll);
    this.scene_ = new trolls.scenes.Main();
    goog.events.listen(this.scene_, ['keydown'], goog.partial(this.keydown, this));
    goog.events.listen(this.scene_, ['keyup'], goog.partial(this.keyup, this));
    lime.scheduleManager.schedule(this.step, this);
    this.director_.replaceScene(this.scene_);
};

// Go to the choose troll screen.
trolls.Controller.prototype.endScene = function() {
    this.controlled_.unchoose();
    this.director_.replaceScene(trolls.pickerScene());
    this.actors_ = [];
    for (var i = 0; i < this.trolls_.length; ++i) {
	this.trolls_[i].walk_.stop();
    }
    goog.array.extend(this.actors_, this.trolls_);
    lime.scheduleManager.unschedule(this.step, this);
};

trolls.Controller.prototype.keydown = function(controller, e) {
    switch (e.event.keyCode) {
    case goog.events.KeyCodes.LEFT:
    case goog.events.KeyCodes.A:
    case goog.events.KeyCodes.A+32:
	controller.controlled_.setDirection(new goog.math.Vec2(-1, 0));
	break;
    case goog.events.KeyCodes.RIGHT:
    case goog.events.KeyCodes.D:
    case goog.events.KeyCodes.D+32:
	controller.controlled_.setDirection(new goog.math.Vec2(1, 0));
	break;
    case goog.events.KeyCodes.UP:
    case goog.events.KeyCodes.W:
    case goog.events.KeyCodes.W+32:
	controller.controlled_.setDirection(new goog.math.Vec2(0, -1));
	break;
    case goog.events.KeyCodes.DOWN:
    case goog.events.KeyCodes.S:
    case goog.events.KeyCodes.S+32:
	controller.controlled_.setDirection(new goog.math.Vec2(0, 1));
	break;
    case goog.events.KeyCodes.SPACE:
    case goog.events.KeyCodes.ENTER:
	var troll = controller.controlled_;
	var targets = goog.array.concat(
	    controller.village_.getHuts(), controller.village_.getPowerUps(),
	    controller.village_.getVillagers());
	troll.goal_ = controller.findClosestTarget_(troll, targets);
	if (troll.goal_.id == 'Power') {
	    if (troll.goal_.inquire) {
		controller.hud_.inquireAbout(troll.goal_);
	    } else {
		troll.goal_.attachTo(troll);
	    }
	} else {
	    troll.attack();
	}
	break;
    case goog.events.KeyCodes.ZERO:
    case goog.events.KeyCodes.ONE:
    case goog.events.KeyCodes.TWO:
    case goog.events.KeyCodes.THREE:
    case goog.events.KeyCodes.FOUR:
    case goog.events.KeyCodes.FIVE:
    case goog.events.KeyCodes.SIX:
    case goog.events.KeyCodes.SEVEN:
	var power = 
	    new trolls.data.Power.types_[
		e.event.keyCode - goog.events.KeyCodes.ZERO]();
	power.attachTo(controller.controlled_);
	break;
    case goog.events.KeyCodes.META:
	controller.meta_ = true;
	break;
    case goog.events.KeyCodes.R:
    case goog.events.KeyCodes.R+32:
	if (controller.meta_) {
	    location.reload();
	}
	break;
    }
    return true;
};

trolls.Controller.prototype.keyup = function(controller, e) {
    controller.controlled_.setDirection(new goog.math.Vec2(0, 0));
    controller.meta_ = false;
};

trolls.Controller.prototype.findTarget = function(actor) {
    // var villagers = this.village_.getVillagers();
    // var num = villagers.length;
    // for (var i = 0; i < num; ++i) {
    // 	if (goog.math.Coordinate.distance(
    // 	    villagers[i].getPosition(), actor.getPosition()) < LEN) {
    // 	    return villagers[i];
    // 	}
    // }
    // return null;
};

trolls.Controller.prototype.findVillagerTarget = function(actor) {
//    if (lib.random(2) == 0) {
	// 50% chance of troll
//	return this.findClosestTarget_(actor, this.trolls_);
  //  } else {
	// 50% chance of hut
//	return this.findClosestTarget_(actor, this.village_.getHuts());
  //  }
}

trolls.Controller.prototype.findClosestTarget_ = function(actor, targets) {
    // var min_distance = WIDTH*HEIGHT;
    // var target = null;
    // for (var i = 0; i < targets.length; ++i) {
    // 	var distance = goog.math.Coordinate.distance(
    // 	    targets[i].getPosition(), actor.getPosition());
    // 	if (distance < min_distance) {
    // 	    min_distance = distance;
    // 	    target = targets[i];
    // 	}
    // }
    // return target;
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
    if (lib.random(10) == 0) {
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
    // var THRESHOLD = 5;
    // if (this.hud_.getMorale() < THRESHOLD) {
    // 	this.endScene();
    // }
};
