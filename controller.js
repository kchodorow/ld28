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
    goog.events.listen(
        this.scene_, ['keydown'], goog.partial(this.keydown, this));
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
        controller.controlled_.attack();
        break;
    case goog.events.KeyCodes.ZERO:
    case goog.events.KeyCodes.ONE:
    case goog.events.KeyCodes.TWO:
    case goog.events.KeyCodes.THREE:
    case goog.events.KeyCodes.FOUR:
    case goog.events.KeyCodes.FIVE:
    case goog.events.KeyCodes.SIX:
    case goog.events.KeyCodes.SEVEN:
    case goog.events.KeyCodes.EIGHT:
        var power =
            new trolls.data.Power.types_[
                e.event.keyCode - goog.events.KeyCodes.ZERO]();
        power.attachTo(controller.controlled_);
        break;
    }
    return true;
};

trolls.Controller.prototype.keyup = function(controller, e) {
    controller.controlled_.setDirection(new goog.math.Vec2(0, 0));
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
        this.addActor(village.villagers_[i]);
    }
};

trolls.Controller.prototype.removeThing = function(e) {
    var hut = e.target.targets[0];
    var pos = hut.getPosition();
    console.log("Removing "+goog.getUid(hut));
    if (hut.getParent() == null) {
        return;
    }
    hut.getParent().removeChild(hut);
    trolls.map.remove(hut);
    if (lib.random.percentChance(10)) {
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

trolls.Controller.prototype.addActor = function(thing) {
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
