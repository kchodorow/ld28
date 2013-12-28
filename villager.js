goog.provide('trolls.Villager');

trolls.Villager = function() {
    lime.Sprite.call(this);

    this.health_ = 1;
    this.setFill(trolls.resources.getVillager());
    goog.object.extend(this, new lib.Direction(this));
    this.faceRandom();
    this.speed_ = trolls.Villager.SPEED;
    goog.object.extend(this, trolls.DumbMove);

    goog.object.extend(
	this, new trolls.Direction()
	    .setWalk(
		goog.bind(trolls.resources.getVillagerWalk, trolls.resources))
	    .setStop(
		goog.bind(trolls.resources.getVillager, trolls.resources)));
};

goog.inherits(trolls.Villager, lime.Sprite);

trolls.Villager.create = function(village, pos) {
    var villager = new trolls.Villager().setPosition(pos);
    village.appendChild(villager);
    trolls.controller.addActor(villager);
    return villager;
};

trolls.Villager.prototype.getAttackees = function() {
    return ["troll"];
};

trolls.Villager.prototype.smoosh = function(damage) {
    this.health_ -= damage;
    this.dead_ = true;
    this.appendChild(lib.pointLabel(-damage));
    // Always 1-hit death
    var action = new lime.animation.ScaleTo(1, 0)
    this.runAction(action);
    goog.events.listen(
	action, lime.animation.Event.STOP,
	goog.bind(trolls.controller.removeVillager, trolls.controller));
    trolls.controller.changeMorale(trolls.resources.MORALE.VILLAGER_SMOOSH);
};

trolls.Villager.prototype.attack = function(target) {
    if (!target.isA('troll')) {
	return;
    }
    var villager = this;
    var action = trolls.resources.getVillagerAttack();
    this.runAction(action);
    goog.events.listen(
	action, lime.animation.Event.STOP,
	function() {
	    if (villager.dead_) {
		return;
	    }
	    villager.attacking_ = false;
	    var diff = goog.math.Coordinate.difference(
		villager.getPosition(), villager.goal_.getPosition());
	    var dummy = new lime.Node().setPosition(
		villager.getPosition().clone().translate(diff.scale(3)));
	    villager.goal_ = dummy;
	    this.attacking_ = false;
	});

    this.goal_.changeHealth(-1);
};

// px/ms
trolls.Villager.SPEED = .1;

trolls.Villager.prototype.step = function(dt) {
    if (this.goal_ == null || this.goal_elapsed_ >= this.goal_expires_ms_) {
	this.goal_ = trolls.controller.findVillagerTarget(this);
	if (this.goal_ == null) {
	    this.walk_.stop();
	    this.setFill(trolls.resources.getVillager());
	    return;
	}
	this.goal_elapsed_ = 0;
	this.attacking_ = false;
    }

    this.move(dt);
    this.goal_elapsed_ += dt;
};
