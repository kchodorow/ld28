goog.provide('trolls.data.Power');

trolls.data.Power = {};

trolls.data.Power.getRandom = function() {
    var i = lib.random(trolls.data.Power.types_.length);
    return new trolls.data.Power.types_[i]();
};

trolls.data.Power.BasePower = function() {
};

trolls.data.Power.BasePower.prototype.getSprite = function() {
    return new lime.Sprite().setFill(trolls.resources.getPower()).setSize(10, 10);
};

trolls.data.Power.Defense = function() {
    trolls.data.Power.BasePower.call(this);

    this.id = "Defense";
    var MIN_DEFENSE = 1;
    var MAX_DEFENSE = 10;
    this.bonus = lib.random(MIN_DEFENSE, MAX_DEFENSE);
};
goog.inherits(trolls.data.Power.Defense, trolls.data.Power.BasePower);

trolls.data.Power.Attack = function() {
    trolls.data.Power.BasePower.call(this);

    this.id = "Attack";
    var MIN_ATTACK = 1;
    var MAX_ATTACK = 10;
    this.bonus = lib.random(MIN_ATTACK, MAX_ATTACK);
};
goog.inherits(trolls.data.Power.Attack, trolls.data.Power.BasePower);

trolls.data.Power.StinkingCloud = function() {
    trolls.data.Power.BasePower.call(this);
};
goog.inherits(trolls.data.Power.StinkingCloud, trolls.data.Power.BasePower);

trolls.data.Power.TrollMask = function() {
    trolls.data.Power.BasePower.call(this);
};
goog.inherits(trolls.data.Power.TrollMask, trolls.data.Power.BasePower);

trolls.data.Power.Bigger = function() {
    trolls.data.Power.BasePower.call(this);
};
goog.inherits(trolls.data.Power.Bigger, trolls.data.Power.BasePower);

trolls.data.Power.Smaller = function() {
    trolls.data.Power.BasePower.call(this);
};
goog.inherits(trolls.data.Power.Smaller, trolls.data.Power.BasePower);

trolls.data.Power.Fireball = function() {
    trolls.data.Power.BasePower.call(this);
    this.id = this.stat_info = "Fireball";
    this.action = {attack : this.throwFireball};
};
goog.inherits(trolls.data.Power.Fireball, trolls.data.Power.BasePower);

trolls.data.Power.Fireball.prototype.throwFireball = function() {
};

trolls.data.Power.types_ = [
    trolls.data.Power.Defense,
    trolls.data.Power.Attack,
    trolls.data.Power.StinkingCloud,
    trolls.data.Power.TrollMask,
    trolls.data.Power.Bigger,
    trolls.data.Power.Smaller,
    trolls.data.Power.Fireball,
];
