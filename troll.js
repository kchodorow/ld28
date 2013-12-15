goog.provide('trolls.Troll');

goog.require('trolls.Mixins');
goog.require('lib.ProgressBar');

trolls.Troll = function() {
    lime.Sprite.call(this);

    this.health_ = 100;
    this.goal_ = null;

    // Bonuses
    this.powers_ = [];
    this.defense_ = 0;
    this.attack_ = 0;
    this.speed_ = trolls.Troll.SPEED;

    // Movement
    this.controlled_ = false;
    this.direction_ = new goog.math.Coordinate(0, 0);
    this.facing_ = new goog.math.Coordinate(1, 0);
    this.move = goog.bind(trolls.Mixins.moveTowards, this);

    this.setFill(trolls.resources.getTroll());
    this.addHealthBar();
};

goog.inherits(trolls.Troll, lime.Sprite);

trolls.Troll.prototype.id = 'Troll';

// px/ms
trolls.Troll.SPEED = .05;
trolls.Troll.BASE_ATTACK = 3;

trolls.Troll.prototype.setStartingPos = function(size) {
    this.loc_ = new goog.math.Coordinate(
	lib.random(-size.width/2, -size.width/2+5), 
	lib.random(-size.height/2, size.height/2));
    this.setPosition(this.loc_.x*LEN, this.loc_.y*LEN);
}

trolls.Troll.prototype.addHealthBar = function() {
    var progress_bar = new lib.ProgressBar();
    progress_bar.setBackgroundColor(trolls.resources.DARK_GREEN);
    progress_bar.setForegroundColor(trolls.resources.GREEN);
    progress_bar.setDimensions(new goog.math.Size(this.getSize().width, 10));
    progress_bar.setPosition(0, -LEN*1.5);
    this.appendChild(progress_bar);
};

trolls.Troll.prototype.setDirection = function(x, y) {
    if (x != 0 || y != 0) {
	this.facing_ = new goog.math.Coordinate(x, y);
    }
    this.direction_ = new goog.math.Coordinate(x, y);
};

trolls.Troll.prototype.getLocation = function() {
    return this.loc_;
};

trolls.Troll.prototype.attack = function() {
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
	});
};

trolls.Troll.prototype.choose = function() {
    this.controlled_ = true;
    this.marker_ = new lime.Sprite().setFill(trolls.resources.getMarker());
    this.appendChild(this.marker_);
};

trolls.Troll.prototype.unchoose = function() {
    this.removeChild(this.marker_);
};

trolls.Troll.prototype.distanceToGoal = function() {
    if (!this.goal_) {
	return WIDTH*HEIGHT;
    }
    return goog.math.Coordinate.distance(
	this.getPosition(), this.goal_.getPosition());
};

trolls.Troll.prototype.step = function(dt) {
    if (this.controlled_) {
	var distance = trolls.Troll.SPEED * dt;
	this.setPosition(
	    this.getPosition().translate(
		distance*this.direction_.x, distance*this.direction_.y));
	return;
    }

    this.move(dt);

    if (this.distanceToGoal() < LEN) {
	this.attack();
    }
};
