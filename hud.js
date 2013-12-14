goog.provide('trolls.Hud');

goog.require('lime.RoundedRect');

trolls.Hud = function() {
    lime.Sprite.call(this);
    this.meter_ = new trolls.MoraleMeter();
    this.appendChild(this.meter_);
};

goog.inherits(trolls.Hud, lime.Sprite);

trolls.Hud.prototype.changeMorale = function(amount) {
    this.meter_.updateProgress(amount);
};

trolls.MoraleMeter = function() {
    lime.RoundedRect.call(this);

    this.max_ = 100;
    this.current_ = 100;

    var RADIUS = 10;
    this.setRadius(RADIUS)
        .setSize(trolls.MoraleMeter.WIDTH, trolls.MoraleMeter.HEIGHT)
	.setFill(trolls.resources.getMoraleMeterBg());

    var inner = new lime.RoundedRect().setRadius(RADIUS)
        .setSize(trolls.MoraleMeter.WIDTH, trolls.MoraleMeter.HEIGHT)
        .setFill(trolls.resources.getMoraleMeterFg())
	.setAnchorPoint(0, .5).setPosition(-trolls.MoraleMeter.WIDTH/2, 0);
    this.appendChild(inner);
    this.inner_ = inner;

    var label = lib.label('Villager morale');
    this.appendChild(label);
};

goog.inherits(trolls.MoraleMeter, lime.RoundedRect);

trolls.MoraleMeter.WIDTH = 200;
trolls.MoraleMeter.HEIGHT = 20;

trolls.MoraleMeter.prototype.updateProgress = function(amount) {
    this.current_ += amount;
    if (this.current_ > this.max_) {
	this.current_ = this.max_;
    }
    this.inner_.setSize(
	trolls.MoraleMeter.WIDTH*(this.current_/this.max_), 
	trolls.MoraleMeter.HEIGHT);
};
