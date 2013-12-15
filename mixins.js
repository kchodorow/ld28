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

trolls.Mixins.getRandomDirection = function() {
    // TODO: not right, both can be 1
    return new goog.math.Coordinate(lib.random(0, 3)-1, lib.random(0, 3)-1);
};
