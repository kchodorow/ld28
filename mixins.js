goog.provide('trolls.Direction');
goog.provide('trolls.DumbMove');

trolls.DumbMove.step = function(dt) {
    if (this.dead_) {
        return;
    }

    // See if there are any targets nearby.
    if (this.canSeeTarget()) {
        // If so, head towards them for stompage.
        this.moveTowardsTarget(dt);
    } else {
        // Otherwise, wander around.
        this.randomWalk(dt);
    }
};

trolls.DumbMove.canSeeTarget = function() {
    var dir = this.direction_.clone();
    var top = 0, left = 0, bottom = 0, right = 0;
    var pos = this.getPosition();
    if (Math.abs(dir.x) < .5) {
        left = pos.x - this.eyesight_;
        right = pos.x + this.eyesight_;
        if (dir.y < -.5) {
            top = pos.y - this.eyesight_;
            bottom = pos.y;
        } else if (dir.y > .5) {
            top = pos.y;
            bottom = pos.y + this.eyesight_;
        } else { // dir.x == 0 && dir.y == 0
            top = pos.y - this.eyesight_;
            bottom = pos.y + this.eyesight_;
        }
    } else if (Math.abs(dir.y) < .5) {
        top = pos.y - this.eyesight_;
        bottom = pos.y + this.eyesight_;
        if (dir.x < -.5) {
            left = pos.x - this.eyesight_;
            right = pos.x;
        } else {  // dir.x > .5
            right = pos.x + this.eyesight_;
            left = pos.x;
        }
    }

    var box = new goog.math.Box(top, right, bottom, left);
    this.sight_.setPosition((right-left)/2, (bottom-top)/2);
    var results = trolls.map.findInBox(box, this.getAttackees());
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
        trolls.map.upsert(this);
    }

    if (goog.math.Coordinate.distance(start_pos, target_pos) < LEN) {
        this.attack(this.target_);
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
        trolls.map.upsert(this);
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

trolls.Direction = function() {
    this.direction_ = new goog.math.Vec2(0, 0);

    // This should really be in DumbMove or its own class.
    this.eyesight_ = 3*LEN;
    this.sight_ = new lime.Sprite().setSize(this.eyesight_, this.eyesight_)
	.setFill(trolls.resources.YELLOW).setOpacity(.2);
};

trolls.Direction.prototype.setWalk = function(cb) {
    this.walk_cb_ = cb;
    return this;
};

trolls.Direction.prototype.setStop = function(cb) {
    this.stop_cb_ = cb;
    return this;
};

trolls.Direction.prototype.setDirection = function(vec) {
    this.direction_ = vec;
    if (this.direction_.x > 0) {
	this.faceRight();
	this.walk();
    } else if (this.direction_.x < 0) {
	this.faceLeft();
	this.walk();
    } else if (this.direction_.y != 0) {
	// If the troll is walking up or down, continue walking in the direction
	// that they were previously facing.
	this.walk();
    } else {
	// x and y are 0.
	this.stop();
    }
};

trolls.Direction.prototype.walk = function() {
    if (this.is_moving_) {
	return;
    }
    this.walk_ = this.walk_cb_();
    this.runAction(this.walk_);
    this.is_moving_ = true;
};

trolls.Direction.prototype.stop = function() {
    if (!this.is_moving_) {
	return;
    }
    this.walk_.stop();
    this.is_moving_ = false;
    this.setFill(this.stop_cb_());
};
