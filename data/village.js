goog.provide('trolls.data.Village');

goog.require('lib');
goog.require('lib.Cluster');
goog.require('lib.Tag');
goog.require('lib.collision.GeoHash');
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
    var hut_cluster = new lib.Cluster()
            .setCreator(goog.bind(trolls.data.Hut.create, null, this))
            .setBoundingBox(new goog.math.Box(-250, 400, 250, -200))
            .setMap(trolls.map).generate();
};

trolls.data.Village.prototype.addVillagers = function() {
    this.villagers_ = [];
    var MIN_VILLAGERS = 10;
    var MAX_VILLAGERS = 30;
    var num_villagers = lib.random(MIN_VILLAGERS, MAX_VILLAGERS);
    var villager_cluster = new lib.Cluster()
            .setCreator(goog.bind(trolls.Villager.create, null, this))
            .setBoundingBox(new goog.math.Box(-250, 400, 250, -200))
            .setMap(trolls.map);
    // TODO: set min/max
    villager_cluster.generate();
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

    goog.object.extend(this, new trolls.Health(20));
    this.squishiness_ = 1;
    this.setAnchorPoint(.5, 1).setPosition(pos)
        .setFill(trolls.resources.getHut());
    goog.object.extend(this, new lib.Tag(['hut']));
};

goog.inherits(trolls.data.Hut, lime.Sprite);

trolls.data.Hut.prototype.id = "Hut";

trolls.data.Hut.create = function(village, pos) {
    var hut = new trolls.data.Hut().setPosition(pos);
    village.appendChild(hut);
    return hut;
};

trolls.data.Hut.prototype.smoosh = function(damage) {
    this.changeHealth(-damage);
    if (this.health_ > 0) {
        this.squishiness_ *= .9;
        this.runAction(
            new lime.animation.ScaleTo(1, this.squishiness_)
                .setEasing(lime.animation.Easing.LINEAR));
    } else {
        var action = new lime.animation.ScaleTo(1, 0);
        this.runAction(action);
        goog.events.listen(
            action, lime.animation.Event.STOP,
            goog.bind(trolls.controller.removeThing, trolls.controller));
        trolls.controller.changeMorale(trolls.resources.MORALE.HUT_SMOOSH);
    }
};
