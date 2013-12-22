goog.provide('trolls.data.Village');

goog.require('lib');
goog.require('lib.collision.GeoHash');
goog.require('trolls.Mixins');
goog.require('trolls.Villager');

// Create a random village.
trolls.data.Village = function() {
    lime.Sprite.call(this);

    this.setSize(WIDTH, HEIGHT);
    this.map_ = new lib.collision.GeoHash(
	new goog.math.Box(-HEIGHT/2, WIDTH/2, HEIGHT/2, -WIDTH/2));
    this.power_ups_ = [];

    this.addHuts();
    this.addVillagers();
};

goog.inherits(trolls.data.Village, lime.Sprite);

trolls.data.Village.prototype.addHuts = function() {
    this.huts_ = [];
    var square = new lime.Sprite().setStroke(3, trolls.resources.DARK_GREEN)
	.setPosition(100, 0).setSize(600, 500);

    var size = square.getSize();
    var pos = square.getPosition();
    var hub = new goog.math.Coordinate(
	lib.random(pos.x-size.width/2, pos.x+size.width/2),
	lib.random(pos.y-size.height/2, pos.y+size.height/2));

    var hub_hut = new trolls.data.Hut(hub);
    this.appendChild(hub_hut);

    var MIN_HUTS = 7, MAX_HUTS = 20;
    var num_huts = lib.random(MIN_HUTS, MAX_HUTS);
    this.addSpokeHuts_(hub_hut.getPosition(), 1, num_huts, square);
};

// Given a "hub" at pos, create spoke huts.
// @param hub goog.math.Coordinate The position of the hub.
// @param num number The current number of huts.
// @param max number The max number of huts.
// @param square lime.Sprite The box that the village must be in.
trolls.data.Village.prototype.addSpokeHuts_ = function(hub, num, max, square) {
    if (num >= max) {
	return num;
    }

    // Create huts as "spokes" around a hub hut.
    var MIN_SPOKES = 2, MAX_SPOKES = 7;
    var num_spokes = lib.random(MIN_SPOKES, MAX_SPOKES);
    var angle = 360/num_spokes;
    // Start at a random offset.
    var offset = lib.random(180);
    var MIN_DIST = 2*LEN, MAX_DIST = 3*LEN, JITTER = LEN/2;

    var jitter = function() {
	return lib.random(JITTER);
    };

    for (var i = 0; num < max && i < num_spokes; i++, offset += angle) {
	var dist = lib.random(MIN_DIST, MAX_DIST);
	var pos = new goog.math.Coordinate(
	    hub.x+Math.cos(goog.math.toRadians(offset))*dist+jitter(),
	    hub.y+Math.sin(goog.math.toRadians(offset))*dist+jitter());

	if (!square.getFrame().contains(pos) || this.hasNearbyHuts_(pos)) {
	    continue;
	}

	var hut = new trolls.data.Hut(pos);
	lib.Debug.attach(hut);
	this.map_.add(hut);
	this.appendChild(hut);
	num++;

	if (lib.random(max-num) != 0) {
	    num = this.addSpokeHuts_(hut.getPosition(), num, max, square);
	}
    }
    return num;
};

// Checks if a hut has anything else near it.
trolls.data.Village.prototype.hasNearbyHuts_ = function(pos) {
    var MIN_DIST = 2*LEN;
    var box = new goog.math.Box(pos.y-MIN_DIST, pos.x+MIN_DIST, pos.y+MIN_DIST, pos.x-MIN_DIST);
    var results = this.map_.findInBox(box);
    return results.length != 0;
};

trolls.data.Village.prototype.removeHut = function(hut) {
    this.removeChild(hut);
    goog.array.remove(this.huts_, hut);
};

trolls.data.Village.prototype.removeVillager = function(hut) {
    this.removeChild(hut);
    goog.array.remove(this.villagers_, hut);
};

trolls.data.Village.prototype.addVillagers = function() {
    this.villagers_ = [];
    // var MIN_VILLAGERS = 20;
    // var MAX_VILLAGERS = 50;
    // var num_villagers = lib.random(MIN_VILLAGERS, MAX_VILLAGERS);
    // for (var i = 0; i < num_villagers; ++i) {
    // 	var villager = new trolls.Villager(this.box_);
    // 	this.villagers_.push(villager);
    // 	lib.Debug.attach(villager);
    // 	this.appendChild(villager);
    // }
};

trolls.data.Village.prototype.getVillagers = function() {
    return this.villagers_;
};

trolls.data.Village.prototype.getHuts = function() {
    return this.huts_;
};

trolls.data.Village.prototype.addPower = function(power, pos) {
    this.appendChild(power.setPosition(pos));
    this.power_ups_.push(power);
};

trolls.data.Village.prototype.removePower = function(power) {
    this.removeChild(power);
    goog.array.remove(this.power_ups_, power);
}

trolls.data.Village.prototype.getPowerUps = function() {
    return this.power_ups_;
}

trolls.data.Hut = function(pos) {
    lime.Sprite.call(this);

    this.health_ = 20;
    this.setAnchorPoint(.5, 1).setPosition(pos)
	.setFill(trolls.resources.getHut());
};

goog.inherits(trolls.data.Hut, lime.Sprite);

trolls.data.Hut.prototype.id = "Hut";

trolls.data.Hut.prototype.smoosh = function(damage) {
    this.health_ -= damage;
    this.appendChild(lib.pointLabel(-damage));
    if (this.health_ <= 0) {
	var action = new lime.animation.ScaleTo(1, 0)
	this.runAction(action);
	goog.events.listen(
	    action, lime.animation.Event.STOP,
	    goog.bind(trolls.controller.removeHut, trolls.controller));
	trolls.controller.changeMorale(trolls.resources.MORALE.HUT_SMOOSH);
    }
};
