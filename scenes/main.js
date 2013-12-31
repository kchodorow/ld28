goog.provide('trolls.scenes.Main');

goog.require('lib.Cluster');

trolls.scenes.Main = function() {
    lime.Scene.call(this);

    trolls.map = new lib.collision.GeoHash(
        new goog.math.Box(-HEIGHT/2, WIDTH/2, HEIGHT/2, -WIDTH/2));

    this.layer_ = new lime.Layer().setSize(WIDTH, HEIGHT).setAnchorPoint(.5, .5)
            .setPosition(WIDTH/2, HEIGHT/2);
    this.appendChild(this.layer_);

    this.village_ = new trolls.data.Village();
    this.layer_.appendChild(this.village_);

    this.addHuts();
    this.addTrolls();
    this.addVillagers();

    var hud = new trolls.Hud();
    hud.setPosition(WIDTH/2, 100);
    trolls.controller.addHud(hud);
    this.appendChild(hud);
};

goog.inherits(trolls.scenes.Main, lime.Scene);

trolls.scenes.Main.prototype.addHuts = function() {
    var hut_cluster = new lib.Cluster()
            .setCreator(goog.bind(trolls.data.Hut.create, null, this.village_))
            .setBoundingBox(new goog.math.Box(-250, 400, 250, -200))
            .setMap(trolls.map).generate();
};

trolls.scenes.Main.prototype.addTrolls = function() {
    var troll_cluster = new lib.Cluster()
            .setCreator(
                goog.bind(trolls.Troll.create, null, this.village_))
            .setBoundingBox(new goog.math.Box(-250, -100, 100, -400))
            .setMap(trolls.map)
            .setTags(['troll'])
            .setMinDistance(0);
    troll_cluster.generate();
};

trolls.scenes.Main.prototype.addVillagers = function() {
    var MIN_VILLAGERS = 10;
    var MAX_VILLAGERS = 30;
    var num_villagers = lib.random(MIN_VILLAGERS, MAX_VILLAGERS);
    var villager_cluster = new lib.Cluster()
            .setCreator(goog.bind(trolls.Villager.create, null, this.village_))
            .setBoundingBox(new goog.math.Box(-250, 400, 250, -200))
            .setMap(trolls.map)
            .setMinDistance(0);
    // TODO: set min/max
    villager_cluster.generate();
};

trolls.scenes.Main.prototype.removeThing = function(e) {
    var thing = e.target.targets[0];
    var pos = thing.getPosition();
    if (thing.getParent() == null) {
        return;
    }
    thing.getParent().removeChild(thing);
    trolls.map.remove(thing);
    this.maybeAddPowerUp_(pos);
};

trolls.scenes.Main.prototype.maybeAddPowerUp_ = function(pos) {
    if (lib.random.percentChance(80)) {
        return;
    }

    var power = trolls.data.Power.getRandom();
    this.layer_.appendChild(power.setPosition(pos));
    trolls.map.add(power);
};
