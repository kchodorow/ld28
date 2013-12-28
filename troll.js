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

    var first_idx = lib.random(trolls.Troll.given_name_.length);
    var last_idx = lib.random(trolls.Troll.suffix_.length);
    this.name_ = trolls.Troll.given_name_[first_idx]+" "+
	trolls.Troll.suffix_[last_idx]
    goog.array.removeAt(trolls.Troll.given_name_, first_idx);
    goog.array.removeAt(trolls.Troll.suffix_, last_idx);
    this.health_ = this.max_health_ = 100;
    this.goal_ = null;

    // Bonuses
    this.powers_ = [];
    this.defense_ = 0;
    this.attack_ = 0;
    this.speed_ = trolls.Troll.SPEED;
//    this.appendChild(this.sight_);

    // Movement
    goog.object.extend(this, new lib.Direction(this));
    goog.object.extend(
	this, new trolls.Direction()
	    .setWalk(
		goog.bind(trolls.resources.getTrollWalk, trolls.resources))
	    .setStop(
		goog.bind(trolls.resources.getTroll, trolls.resources)));
    goog.object.extend(this, trolls.DumbMove);
    this.is_moving_ = false;

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

trolls.Troll.prototype.changeHealth = function(amount) {
    this.health_ += amount;
    if (this.health_ > this.max_health_) {
	this.health_ = this.max_health_;
    } else if (this.health_ < 0) {
	this.health_ = 0;
    }
};

trolls.Troll.prototype.getAttackees = function() {
    return ["powerup", "hut", "villager"];
};

trolls.Troll.prototype.attack = function(target) {
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
	nearest = trolls.map.findNearestInBox(
	    this, sight, ["powerup", "hut", "villager"]);
	if (!nearest) {
	    return;
	}
    }

    if (nearest.isA('powerup')) {
     	if (nearest.inquire) {
     	    controller.hud_.inquireAbout(nearest);
	} else {
     	    nearest.attachTo(this);
	}
    } else {
	nearest.smoosh(trolls.Troll.BASE_ATTACK+this.attack_);
    }
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

trolls.Troll.prototype.unchoose = function() {
    this.removeChild(this.marker_);
    this.step = trolls.DumbMove.step;
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

trolls.Troll.prototype.controlledStep = function(dt) {
    var distance = trolls.Troll.SPEED * dt;
    this.setPosition(
	this.getPosition().translate(
	    distance*this.direction_.x, distance*this.direction_.y));
    return;
};

// Names
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
