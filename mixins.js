goog.provide('trolls.Mixins');

trolls.Mixins.moveTowards = function(dt) {
    if (this.attacking_) {
	return;
    }

    var distance = dt*this.speed_;
    var pos = this.getPosition();
    var troll_pos = this.goal_.getPosition();

    var vec = new goog.math.Vec2(troll_pos.x - pos.x, troll_pos.y - pos.y);
    if (vec.x != 0 || vec.y != 0) {
	vec = vec.normalize().scale(Math.sqrt(distance));
	this.setPosition(pos.x+vec.x, pos.y+vec.y);
    }

    if (goog.math.Coordinate.distance(pos, troll_pos) < LEN) {
	this.attack();
    }
};

trolls.Mixins.randomWalk = function(dt) {
    var PROBABILITY_OF_CHANGING_DIR = 15;
    if (lib.random(PROBABILITY_OF_CHANGING_DIR) == 0) {
	this.setDirection(trolls.Mixins.getRandomDirection());
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
trolls.Mixins.getRandomDirection = function() {
    var dir_x = lib.random(0, 3)-1;
    var dir_y = lib.random(0, 3)-1;
    if (lib.random(2) == 0) {
	return new goog.math.Vec2(dir_x, dir_x == 0 ? dir_y : 0);
    } else {
	return new goog.math.Vec2(dir_y == 0 ? dir_x : 0, dir_y);
    }
};
