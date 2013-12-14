goog.provide('trolls.Troll');

trolls.Troll = function() {
    lime.Sprite.call(this);
    this.powers_ = [];
    // Bonuses
    this.defense_ = 0;
    this.attack_ = 0;
    this.controlled_ = false;
    this.setSize(40, 40).setFill(trolls.resources.getTroll());
};

goog.inherits(trolls.Troll, lime.Sprite);

trolls.Troll.prototype.setStartingPos = function(size) {
    this.loc_ = new goog.math.Coordinate(
	lib.random(-size.width/2, -size.width/2+5), 
	lib.random(-size.height/2, size.height/2));
    this.setPosition(this.loc_.x*LEN, this.loc_.y*LEN);
}

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
    if (this.controlled_) {
 	return;
     }
};
