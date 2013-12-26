goog.provide('trolls.Troll');

goog.require('lib.Debug');
goog.require('lib.Direction');
goog.require('lib.ProgressBar');
goog.require('lib.Tag');
goog.require('trolls.DumbMove');

trolls.Troll = function() {
    lime.Sprite.call(this);

    var first_idx = lib.random(trolls.Troll.given_name_.length);
    var last_idx = lib.random(trolls.Troll.suffix_.length);
    this.name_ = trolls.Troll.given_name_[first_idx]+" "+
	trolls.Troll.suffix_[last_idx]
    goog.array.removeAt(trolls.Troll.given_name_, first_idx);
    goog.array.removeAt(trolls.Troll.suffix_, last_idx);
    this.health_ = 100;
    this.goal_ = null;

    // Bonuses
    this.powers_ = [];
    this.defense_ = 0;
    this.attack_ = 0;
    this.speed_ = trolls.Troll.SPEED;
    this.eyesight_ = 3*LEN;
    this.sight_ = new lime.Sprite().setSize(this.eyesight_, this.eyesight_)
	.setFill(trolls.resources.YELLOW).setOpacity(.2);
//    this.appendChild(this.sight_);

    // Movement
    this.direction_ = new goog.math.Coordinate(0, 0);
    goog.object.extend(this, new lib.Direction(this));
    this.step = this.uncontrolledStep;
    this.is_moving_ = false;
    this.walk_ = trolls.resources.getTrollWalk();
    goog.object.extend(this, trolls.DumbMove);

    this.setFill(trolls.resources.getTroll());
    lib.Debug.attach(this);
    goog.object.extend(this, new lib.Tag(['troll']));
};

goog.inherits(trolls.Troll, lime.Sprite);

trolls.Troll.prototype.id = 'Troll';

// px/ms
trolls.Troll.SPEED = .05;
trolls.Troll.BASE_ATTACK = 3;

trolls.Troll.prototype.getName = function() {
    return this.name_;
};

trolls.Troll.prototype.addHealthBar = function() {
    if ('health_bar_' in this) {
	return;
    }
    var progress_bar = new lib.ProgressBar();
    progress_bar.setBackgroundColor(trolls.resources.DARK_GREEN);
    progress_bar.setForegroundColor(trolls.resources.GREEN);
    progress_bar.setDimensions(new goog.math.Size(this.getSize().width, 6));
    progress_bar.setPosition(0, -LEN);
    this.appendChild(progress_bar);
    this.health_bar_ = progress_bar;
};

trolls.Troll.prototype.setDirection = function(vec) {
    this.direction_ = vec;
    if (this.direction_.x > 0) {
	this.faceRight();
	this.walk();
    } else if (this.direction_.x < 0) {
	this.faceLeft();
	this.walk();
    } else if (this.direction_.x == 0 && this.direction_.y == 0) {
	this.stop();
    }
};

trolls.Troll.prototype.walk = function() {
    if (this.is_moving_) {
	return;
    }
    this.runAction(this.walk_);
    this.is_moving_ = true;
};

trolls.Troll.prototype.stop = function() {
    if (!this.is_moving_) {
	return;
    }
    this.walk_.stop();
    this.is_moving_ = false;
    this.setFill(trolls.resources.getTroll());
};

trolls.Troll.prototype.smashSomething = function() {
    var nearest = trolls.map.findNearestInBox(
	this.sight_.getFrame(), ["powerup", "hut", "villager"]);

    if (!nearest) {
	// TODO: smash, no effect.
    } else if (nearest.isA('powerup')) {
	if (nearest.inquire) {
	    controller.hud_.inquireAbout(nearest);
	} else {
	    nearest.attachTo(this);
	}
    } else {
	this.attack();
    }
};

trolls.Troll.prototype.attack = function() {
    if (this.distanceToGoal() > LEN) {
	return;
    }

    this.attacking_ = true;
    this.walk_.stop();
    var attack_anim = trolls.resources.getTrollAttack();
    this.runAction(attack_anim);
    var troll = this;
    goog.events.listen(
	attack_anim, lime.animation.Event.STOP, function(e) {
	    if (troll.goal_ == null) {
		return;
	    }
	    troll.goal_.smoosh(trolls.Troll.BASE_ATTACK+troll.attack_);
	    troll.goal_ = null;
	    troll.attacking_ = false;
	});
};

trolls.Troll.prototype.choose = function() {
//    this.marker_ = new lime.Circle().setSize(LEN, LEN).setOpacity(.2)
//	.setFill(trolls.resources.RED);
//    this.appendChild(this.marker_);
    this.step = this.controlledStep;
};

trolls.Troll.prototype.unchoose = function() {
    this.removeChild(this.marker_);
    this.step = this.uncontrolledStep;
};

trolls.Troll.prototype.changeHealth = function(amount) {
    this.health_ += amount;
    this.health_bar_.updateProgress(amount);

    if (this.health_ == 0) {
	this.dead_ = true;
	this.runAction(new lime.animation.FadeTo(0));
    }
};

trolls.Troll.prototype.distanceToGoal = function() {
    if (!this.goal_) {
	return WIDTH*HEIGHT;
    }
    return goog.math.Coordinate.distance(
	this.getPosition(), this.goal_.getPosition());
};

trolls.Troll.prototype.canSeeTarget = function() {
};

trolls.Troll.prototype.controlledStep = function(dt) {
    var distance = trolls.Troll.SPEED * dt;
    this.setPosition(
	this.getPosition().translate(
	    distance*this.direction_.x, distance*this.direction_.y));
    return;
};

trolls.Troll.prototype.uncontrolledStep = function(dt) {
    if (this.dead_) {
	return;
    }

    // See if there are any targets nearby.
    if (this.canSeeTarget()) {
	// If so, head towards them for stompage.
	this.moveTowardsTarget(dt);
    } else {
	// Otherwise, wander around.
	this.randomWalk(dt);
    }
};

// Names
trolls.Troll.given_name_ = [
    "Grog", "Ogg", "Brog", "Ploog", "Zorg", "Zorn", "Frampton", "Mush-Nose",
    "Froog", "Blatt", "Poob", "Rawr", "Drob", "Woob", "Splum"
];

trolls.Troll.suffix_ = [
    "the Destroyer", "the Stinky", "Rocknose", "the Hairy", "Galumph",
    "Hammerfist", "the Tiny", "the Angry", "the Incontinent", "Bloodfist",
    "Headbutt", "the Butthead", "of the Swamp", "Poisonpants", "Mudface",
    "the Clumsy", "Thump-Thump", "Barkskin", "the Boogerful", "Ironsides",
    "Irongut", "Firegut", "the Maneater", "Snotface", "Boogerface"
];
