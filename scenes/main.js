goog.provide('trolls.scenes.Main');

goog.require('lib.Cluster');

trolls.scenes.Main = function() {
    lime.Scene.call(this);

    trolls.map = new lib.collision.GeoHash(
        new goog.math.Box(-HEIGHT/2, WIDTH/2, HEIGHT/2, -WIDTH/2));

    var layer = new lime.Layer().setSize(WIDTH, HEIGHT).setAnchorPoint(.5, .5)
            .setPosition(WIDTH/2, HEIGHT/2);
    this.appendChild(layer);

    var village = new trolls.data.Village();
    layer.appendChild(village);

    var troll_cluster = new lib.Cluster()
            .setCreator(goog.bind(trolls.scenes.Main.addTroll, null, village))
            .setBoundingBox(new goog.math.Box(-250, -100, 100, -400))
            .setMap(trolls.map)
            .setTags(['troll'])
            .setMinDistance(0);
    troll_cluster.generate();

    var hud = new trolls.Hud();
    hud.setPosition(WIDTH/2, 100);
    trolls.controller.addHud(hud);
    this.appendChild(hud);
};

goog.inherits(trolls.scenes.Main, lime.Scene);

trolls.scenes.Main.troll_counter_ = 0;

trolls.scenes.Main.addTroll = function(village, pos) {
    var troll = trolls.getTroll(trolls.scenes.Main.troll_counter_)
            .setPosition(pos);
    lib.Debug.attach(troll);
    village.appendChild(troll);

    trolls.scenes.Main.troll_counter_ = (trolls.scenes.Main.troll_counter_+1)%5;
    return troll;
};
