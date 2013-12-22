goog.provide('trolls.Villager');

trolls.Villager = function(box) {
    lime.Sprite.call(this);

    this.goal_expires_ms_ = new lib.random(3000, 5000);
    this.health_ = 1;
    var pos_x = lib.random(box.left, box.right);
    var pos_y = lib.random(box.top, box.bottom);
    this.loc_ = new goog.math.Coordinate(pos_x, pos_y);
    this.setFill(trolls.resources.getVillager())
	.setPosition(pos_x*LEN, pos_y*LEN);
    this.goal_ = null;
    this.speed_ = trolls.Villager.SPEED;
    this.move = goog.bind(trolls.Mixins.moveTowards, this);

    this.walk_ = trolls.resources.getVillagerWalk();
    this.runAction(this.walk_);
};

goog.inherits(trolls.Villager, lime.Sprite);

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

trolls.Villager.prototype.attack = function() {
    this.attacking_ = true;
    if (this.goal_.id != 'Troll') {
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
