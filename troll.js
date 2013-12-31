goog.provide('trolls.Troll');

goog.require('lib.Debug');
goog.require('lib.Direction');
goog.require('lib.ProgressBar');
goog.require('lib.Tag');
goog.require('lime.animation.KeyframeAnimation');
goog.require('trolls.Direction');
goog.require('trolls.DumbMove');

trolls.Troll = function() {
    lime.Sprite.call(this);

    // Identifiers
    this.name_ = trolls.Troll.getName();
    lib.Debug.attach(this);
    goog.object.extend(this, new lib.Tag(['troll']));

    // Health
    goog.object.extend(
        this, new trolls.Health(100).setChangeCallback(this.onDeath));

    // Bonuses
    this.powers_ = [];
    this.defense_ = 0;
    this.attack_ = 0;
    this.speed_ = trolls.Troll.SPEED;

    // Movement
    goog.object.extend(this, new lib.Direction(this));
    goog.object.extend(
        this, new trolls.Direction()
            .setWalk(
                goog.bind(trolls.resources.getTrollWalk, trolls.resources))
            .setStop(
                goog.bind(trolls.resources.getTroll, trolls.resources)));
    this.appendChild(this.sight_);
    goog.object.extend(this, trolls.DumbMove);
    this.is_moving_ = false;

    this.setFill(trolls.resources.getTroll());
};

goog.inherits(trolls.Troll, lime.Sprite);

// px/ms
trolls.Troll.SPEED = .05;
trolls.Troll.BASE_ATTACK = 3;

trolls.Troll.troll_counter_ = 0;

trolls.Troll.create = function(village, pos) {
    var troll = trolls.getTroll(trolls.Troll.troll_counter_)
            .setPosition(pos);
    lib.Debug.attach(troll);
    village.appendChild(troll);

    trolls.Troll.troll_counter_ = (trolls.Troll.troll_counter_+1)%5;
    return troll;
};

trolls.Troll.prototype.getName = function() {
    return this.name_;
};

trolls.Troll.prototype.getAttackees = function() {
    return ["powerup", "hut", "villager"];
};

trolls.Troll.prototype.attack = function(target) {
    this.attacking_ = true;
    var attack = trolls.resources.getTrollAttack();
    this.runAction(attack);

    goog.events.listen(
        attack, lime.animation.Event.STOP,
        goog.bind(this.smashed_, this, target));
};

trolls.Troll.prototype.smashed_ = function(target) {
    this.visualSmash_();

    if (!target) {
        var sight = this.sight_.getFrame().clone()
                .translate(this.getPosition());
        target = trolls.map.findNearestInBox(
            this, sight, ["powerup", "hut", "villager"]);
        if (!target) {
            return;
        }
    }

    if (target.isA('powerup')) {
        if (target.inquire) {
            controller.hud_.inquireAbout(target);
        } else {
            target.attachTo(this);
        }
    } else {
        target.changeHealth(-trolls.Troll.BASE_ATTACK+this.attack_);
    }

    this.attacking_ = false;
};

trolls.Troll.prototype.visualSmash_ = function() {
    var smash = new lime.Circle().setSize(30, 5).setOpacity(.5)
            .setPosition(0, LEN/2).setFill(trolls.resources.RED);
    smash.runAction(
        new lime.animation.Spawn(
            new lime.animation.ScaleTo(5, 4)
                .setEasing(lime.animation.Easing.LINEAR),
            new lime.animation.FadeTo(0)));
    this.appendChild(smash);
};

trolls.Troll.prototype.choose = function() {
//    this.marker_ = new lime.Circle().setSize(LEN, LEN).setOpacity(.2)
//	.setFill(trolls.resources.RED);
//    this.appendChild(this.marker_);
    this.step = this.controlledStep;
};

trolls.Troll.prototype.onDeath = function() {
    if (this.health_ == 0) {
        this.runAction(new lime.animation.FadeTo(0));
        // TODO: Remove from actors?
    }
};

trolls.Troll.prototype.unchoose = function() {
    this.removeChild(this.marker_);
    this.step = trolls.DumbMove.step;
};

trolls.Troll.prototype.distanceToGoal = function() {
    if (!this.goal_) {
        return WIDTH*HEIGHT;
    }
    return goog.math.Coordinate.distance(
        this.getPosition(), this.goal_.getPosition());
};

trolls.Troll.prototype.controlledStep = function(dt) {
    var distance = trolls.Troll.SPEED * dt;
    this.setPosition(
        this.getPosition().translate(
            distance*this.direction_.x, distance*this.direction_.y));
    return;
};

// Names

trolls.Troll.getName = function() {
    var first_idx = lib.random(trolls.Troll.given_name_.length);
    var last_idx = lib.random(trolls.Troll.suffix_.length);
    var name = trolls.Troll.given_name_[first_idx]+" "+
        trolls.Troll.suffix_[last_idx];
    goog.array.removeAt(trolls.Troll.given_name_, first_idx);
    goog.array.removeAt(trolls.Troll.suffix_, last_idx);
    return name;
};

trolls.Troll.given_name_ = [
    "Grog", "Ogg", "Brog", "Ploog", "Zorg", "Zorn", "Frampton", "Mush-Nose",
    "Froog", "Blatt", "Poob", "Rawr", "Drob", "Woob", "Splum", "Bj\u00F8rn",
    "Per"
];

trolls.Troll.suffix_ = [
    "the Destroyer", "the Stinky", "Rocknose", "the Hairy", "Galumph",
    "Hammerfist", "the Tiny", "the Angry", "the Incontinent", "Bloodfist",
    "Headbutt", "the Butthead", "of the Swamp", "Poisonpants", "Mudface",
    "the Clumsy", "Thump-Thump", "Barkskin", "the Boogerful", "Ironsides",
    "Irongut", "Firegut", "the Maneater", "Snotface", "Boogerface"
];
