goog.provide('trolls.data.Village');

goog.require('lib');
goog.require('lib.collision.GeoHash');
goog.require('lib.Cluster');
goog.require('trolls.Mixins');
goog.require('trolls.Villager');

// Create a random village.
trolls.data.Village = function() {
    lime.Sprite.call(this);

    this.setSize(WIDTH, HEIGHT);
    lib.style.setBackgroundFrame(this, trolls.resources.getGrass());

    this.power_ups_ = [];

    this.addHuts();
    this.addVillagers();
};

goog.inherits(trolls.data.Village, lime.Sprite);

trolls.data.Village.prototype.addHuts = function() {
    this.huts_ = [];
    var hut_cluster = new lib.Cluster()
	.setCreator(goog.bind(trolls.data.Hut.create, null, this))
	.setBoundingBox(new goog.math.Box(-250, 400, 250, -200))
	.setMap(trolls.map).generate();
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

trolls.data.Hut.create = function(village, pos) {
    var hut = new trolls.data.Hut().setPosition(pos);
    village.appendChild(hut);
    return hut;
};

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
