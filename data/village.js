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
};

goog.inherits(trolls.data.Village, lime.Sprite);

trolls.data.Village.prototype.removePower = function(power) {
    this.removeChild(power);
    goog.array.remove(this.power_ups_, power);
}

trolls.data.Hut = function(pos) {
    lime.Sprite.call(this);

    goog.object.extend(
        this, new trolls.Health(20).setChangeCallback(this.smoosh));
    this.squishiness_ = 1;
    this.setAnchorPoint(.5, 1).setPosition(pos)
        .setFill(trolls.resources.getHut());
    goog.object.extend(this, new lib.Tag(['hut']));
};

goog.inherits(trolls.data.Hut, lime.Sprite);

trolls.data.Hut.create = function(village, pos) {
    var hut = new trolls.data.Hut().setPosition(pos);
    village.appendChild(hut);

    // Debugging.
    lib.Debug.attach(hut);
    trolls.data.Hut.hut_[goog.getUid(hut)] = hut;
    return hut;
};

trolls.data.Hut.prototype.smoosh = function() {
    if (!this.getParent()) {
        // Already smooshed.
        return;
    }

    if (this.health_ > 0) {
        this.squishiness_ *= .9;
        this.runAction(
            new lime.animation.ScaleTo(1, this.squishiness_));
    } else {
        var action = new lime.animation.ScaleTo(1, 0);
        this.runAction(action);
        goog.events.listen(
            action, lime.animation.Event.STOP,
            goog.bind(this.getScene().removeThing, this.getScene()));
        trolls.controller.changeMorale(trolls.resources.MORALE.HUT_SMOOSH);
    }
};

trolls.data.Hut.hut_ = {};

trolls.data.Hut.get = function(i) {
    return trolls.data.Hut.hut_[i];
};
