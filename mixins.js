goog.provide('trolls.Mixins');

trolls.Mixins.moveTowards = function(dt) {
    if (this.goal_ == null) {
	this.goal_ = trolls.controller.findTarget(this);
	if (this.goal_ == null) {
	    return;
	}
    }

    var distance = dt*trolls.data.Villager.SPEED;
    var pos = this.getPosition();
    var troll_pos = this.goal_.getPosition();
    var vec = new goog.math.Vec2(troll_pos.x - pos.x, troll_pos.y - pos.y);
    vec = vec.normalize().scale(Math.sqrt(distance));
    this.setPosition(pos.x+vec.x, pos.y+vec.y);
};
