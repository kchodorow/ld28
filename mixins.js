goog.provide('trolls.DumbMove');

trolls.DumbMove.canSeeTarget = function() {
    var dir = this.direction_.clone();
    var top = 0, left = 0, bottom = 0, right = 0;
    var pos = this.getPosition();
    if (dir.x == 0) {
	left = pos.x - this.eyesight_;
	right = pos.x + this.eyesight_;
	if (dir.y == -1) {
	    top = pos.y - this.eyesight_;
	    bottom = pos.y;
	} else if (dir.y == 1) {
	    top = pos.y;
	    bottom = pos.y + this.eyesight_;
	} else { // dir.x == 0 && dir.y == 0
	    top = pos.y - this.eyesight_;
	    bottom = pos.y + this.eyesight_;
	}
    } else if (dir.y == 0) {
	top = pos.y - this.eyesight_;
	bottom = pos.y + this.eyesight_;
	if (dir.x == -1) {
	    left = pos.x - this.eyesight_;
	    right = pos.x;
	} else {  // dir.x == 1
	    right = pos.x + this.eyesight_;
	    left = pos.x;
	}
    }

    var box = new goog.math.Box(top, right, bottom, left);
    this.sight_.setPosition((right-left)/2, (bottom-top)/2);
    var results = trolls.map.findInBox(box, ["hut", "villager"]);
    if (results.length > 0) {
	this.target_ = results[0];
	return true;
    }
    return false;
};

trolls.DumbMove.moveTowardsTarget = function(dt) {
    if (this.attacking_) {
	return;
    }

    var distance = dt*this.speed_;
    var start_pos = this.getPosition();
    var target_pos = this.target_.getPosition();

    var vec = goog.math.Vec2.difference(target_pos, start_pos);
    if (vec.x != 0 || vec.y != 0) {
	vec = vec.normalize().scale(Math.sqrt(distance));
	this.setPosition(start_pos.translate(vec));
    }

    if (goog.math.Coordinate.distance(start_pos, target_pos) < LEN) {
	this.attack();
    }
};

trolls.DumbMove.randomWalk = function(dt) {
    var PROBABILITY_OF_CHANGING_DIR = 15;
    var PROBABILITY_OF_FOLLOWING = 2;
    if (lib.random(PROBABILITY_OF_CHANGING_DIR) == 0) {
	if (lib.random(PROBABILITY_OF_FOLLOWING) == 0) {
	    this.setDirection(this.getControlleeDirection());
	} else {
	    this.setDirection(this.getRandomDirection());
	}
    }
    var distance = dt*this.speed_;
    var pos = this.getPosition().clone();
    var new_pos = pos.translate(
	this.direction_.clone().scale(Math.sqrt(distance)));
    if (trolls.map.contains(new_pos)) {
	this.setPosition(new_pos);
    }
};

// @return Vec2 A cardinal direction (NSEW).
trolls.DumbMove.getRandomDirection = function() {
    var dir_x = lib.random(0, 3)-1;
    var dir_y = lib.random(0, 3)-1;
    if (lib.random(2) == 0) {
	return new goog.math.Vec2(dir_x, dir_x == 0 ? dir_y : 0);
    } else {
	return new goog.math.Vec2(dir_y == 0 ? dir_x : 0, dir_y);
    }
};

trolls.DumbMove.getControlleeDirection = function() {
    var goal = trolls.controller.controlled_;
    var distance = goog.math.Coordinate.distance(
	goal.getPosition(), this.getPosition());
    var dir = goog.math.Vec2.difference(goal.getPosition(), this.getPosition());
    if (dir.x == 0 && dir.y == 0) {
	return this.getRandomDirection();
    } else if (distance <= 2*LEN) {
	return dir.normalize().scale(-1);
    }

    return dir.normalize();
};
