goog.provide('trolls.Mixins');

trolls.Mixins.moveTowards = function(dt) {
    if (this.goal_ == null) {
	this.goal_ = trolls.controller.findTarget(this);
	if (this.goal_ == null) {
	    this.walk_.stop();
	    this.setFill(trolls.resources.getTroll());
	    return;
	}
    }

    var distance = dt*this.speed_;
    var pos = this.getPosition();

    if (lib.random(3) == 0) {
	var troll_pos = this.goal_.getPosition();
	var vec = new goog.math.Vec2(troll_pos.x - pos.x, troll_pos.y - pos.y);
	vec = vec.normalize().scale(Math.sqrt(distance));
	this.setPosition(pos.x+vec.x, pos.y+vec.y);
    }
};

trolls.Mixins.getRandomDirection = function() {
    // TODO: not right, both can be 1
    return new goog.math.Coordinate(lib.random(0, 3)-1, lib.random(0, 3)-1);
};
