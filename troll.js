goog.provide('trolls.Troll');

trolls.Trolls = function() {
    lime.Sprite.call(this);
    this.powers_ = [];
    // Bonuses
    this.defense_ = 0;
    this.attack_ = 0;
};

goog.inherits(trolls.data.Village, lime.Sprite);

trolls.Troll.prototype.addPower = function(power) {
    this.powers_.push(power);
};
