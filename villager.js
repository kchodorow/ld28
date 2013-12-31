goog.provide('trolls.Villager');

trolls.Villager = function() {
    lime.Sprite.call(this);

    goog.object.extend(this, new trolls.Health(1));
     this.setFill(trolls.resources.getVillager());
    goog.object.extend(this, new lib.Direction(this));
    this.faceRandom();
    this.speed_ = trolls.Villager.SPEED;
    goog.object.extend(this, trolls.DumbMove);
    goog.object.extend(this, new lib.Tag(['villager']));

    goog.object.extend(
        this, new trolls.Direction()
            .setWalk(
                goog.bind(trolls.resources.getVillagerWalk, trolls.resources))
            .setStop(
                goog.bind(trolls.resources.getVillager, trolls.resources)));
    this.appendChild(this.sight_);

    lib.Debug.attach(this);
};

goog.inherits(trolls.Villager, lime.Sprite);

// px/ms
trolls.Villager.SPEED = .1;

trolls.Villager.create = function(village, pos) {
    var villager = new trolls.Villager().setPosition(pos);
    village.appendChild(villager);
    trolls.controller.addActor(villager);
    return villager;
};

trolls.Villager.prototype.getAttackees = function() {
    return ["troll"];
};

trolls.Villager.prototype.smoosh = function(damage) {
    this.changeHealth(-damage);
    // Always 1-hit death
    var action = new lime.animation.ScaleTo(1, 0);
    this.runAction(action);
    goog.events.listen(
        action, lime.animation.Event.STOP,
        goog.bind(trolls.controller.removeThing, trolls.controller));
    trolls.controller.changeMorale(trolls.resources.MORALE.VILLAGER_SMOOSH);
};

trolls.Villager.prototype.attack = function(target) {
    this.attacking_ = true;
    if (!target.isA('troll')) {
        return;
    }

    // For closure access.
    var villager = this;
    var action = trolls.resources.getVillagerAttack();
    this.runAction(action);
    goog.events.listen(
        action, lime.animation.Event.STOP,
        function() {
    //         if (villager.dead_) {
    //             return;
    //         }
    //         villager.attacking_ = false;
    //         var diff = goog.math.Coordinate.difference(
    //             villager.getPosition(), target.getPosition());
    //         var dummy = new lime.Node().setPosition(
    //             villager.getPosition().clone().translate(diff.scale(3)));
    //         villager.goal_ = dummy;
            villager.attacking_ = false;
        });

    target.changeHealth(-1);
};
