goog.provide('trolls.Villager');

trolls.Villager = function() {
    lime.Sprite.call(this);

    // Make squishable from above.
    this.setAnchorPoint(.5, 1);
    this.is_being_smooshed_ = false;

    goog.object.extend(
        this, new trolls.Health(1).setChangeCallback(this.smoosh));
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
//    this.appendChild(this.sight_);

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
    if (this.is_being_smooshed_ || !this.getParent()) {
        // Already dead by someone else's smoosh.
        return;
    }
    this.is_being_smooshed_ = true;

    // Otherwise, always 1-hit smoosh.
    var action = new lime.animation.ScaleTo(1, 0)
            .setEasing(lime.animation.Easing.LINEAR);
    this.runAction(action);
    action.listen(
        lime.animation.Event.STOP,
        goog.bind(this.getScene().removeThing, this.getScene()));
    trolls.controller.changeMorale(trolls.resources.MORALE.VILLAGER_SMOOSH);
};

trolls.Villager.prototype.attack = function(target) {
    this.attacking_ = true;

    // For closure access.
    var villager = this;
    var action = trolls.resources.getVillagerAttack();
    this.runAction(action);
    goog.events.listen(
        action, lime.animation.Event.STOP,
        function() {
            if (villager.isDead()) {
                return;
            }
            villager.attacking_ = false;
        });

    target.changeHealth(-1);
};
