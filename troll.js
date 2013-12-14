goog.provide('trolls.Troll');

trolls.Troll = function() {
    lime.Sprite.call(this);

    // Bonuses
    this.powers_ = [];
    this.defense_ = 0;
    this.attack_ = 0;

    // Movement
    this.controlled_ = false;
    this.direction_ = new goog.math.Coordinate(0, 0);
    this.facing_ = new goog.math.Coordinate(1, 0);

    this.setSize(40, 40).setFill(trolls.resources.getTroll());
};

goog.inherits(trolls.Troll, lime.Sprite);

// px/ms
trolls.Troll.SPEED = .1;

trolls.Troll.prototype.setStartingPos = function(size) {
    this.loc_ = new goog.math.Coordinate(
	lib.random(-size.width/2, -size.width/2+5), 
	lib.random(-size.height/2, size.height/2));
    this.setPosition(this.loc_.x*LEN, this.loc_.y*LEN);
}

trolls.Troll.prototype.setDirection = function(x, y) {
    if (x != 0 || y != 0) {
	this.facing_ = new goog.math.Coordinate(x, y);
    }
    this.direction_ = new goog.math.Coordinate(x, y);
};

trolls.Troll.prototype.attack = function() {
    trolls.village.smooshed(this.loc_.x+this.facing_.x, this.loc_.y+this.facing_.y);
};

trolls.Troll.prototype.choose = function() {
    this.controlled_ = true;
    var marker = new lime.Sprite().setFill(trolls.resources.getMarker())
	.setSize(5, 10).setPosition(0, -30);
    this.appendChild(marker);
};

trolls.Troll.prototype.addPower = function(power) {
    this.powers_.push(power);
};

trolls.Troll.prototype.step = function(dt) {
    var distance = trolls.Troll.SPEED * dt;
    this.setPosition(
	this.getPosition().translate(
	    distance*this.direction_.x, distance*this.direction_.y));
};
