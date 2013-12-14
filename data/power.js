goog.provide('trolls.data.Power');

trolls.data.Power = {};

trolls.data.Power.getRandom = function() {
    var i = lib.random(trolls.data.Power.types_.length);
    return new trolls.data.Power.types_[i]();
};

trolls.data.Power.BasePower = function() {
    lime.Sprite.call(this);
    this.setFill(trolls.resources.getPower()).setSize(10, 10);
    this.id = "Power";
};
goog.inherits(trolls.data.Power.BasePower, lime.Sprite);

trolls.data.Power.BasePower.prototype.attachTo = function(troll) {
    console.log('onAcquire unimplemented for '+this);
};

// Defense

trolls.data.Power.Defense = function() {
    trolls.data.Power.BasePower.call(this);

    var MIN_DEFENSE = 1;
    var MAX_DEFENSE = 10;
    this.bonus = lib.random(MIN_DEFENSE, MAX_DEFENSE);
    this.name = "+"+this.bonus+" defense";
};
goog.inherits(trolls.data.Power.Defense, trolls.data.Power.BasePower);

trolls.data.Power.Defense.prototype.attachTo = function(troll) {
    troll.defense_ += this.bonus;
}

// Attack

trolls.data.Power.Attack = function() {
    trolls.data.Power.BasePower.call(this);

    var MIN_ATTACK = 1;
    var MAX_ATTACK = 10;
    this.bonus = lib.random(MIN_ATTACK, MAX_ATTACK);
    this.name = "+"+this.bonus+" attack";
};
goog.inherits(trolls.data.Power.Attack, trolls.data.Power.BasePower);

trolls.data.Power.Attack.prototype.attachTo = function(troll) {
    troll.attack_ += this.bonus;
};

// Speed

trolls.data.Power.Speed = function() {
    trolls.data.Power.BasePower.call(this);

    var MIN = 1;
    var MAX = 10;
    this.bonus = lib.random(MIN, MAX);
    this.name = "+"+this.bonus+" speed";
};
goog.inherits(trolls.data.Power.Speed, trolls.data.Power.BasePower);

trolls.data.Power.Speed.prototype.attachTo = function(troll) {
    troll.speed_ += this.bonus/100;
};

// Stinking cloud

trolls.data.Power.StinkingCloud = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "farting";
};
goog.inherits(trolls.data.Power.StinkingCloud, trolls.data.Power.BasePower);

trolls.data.Power.StinkingCloud.prototype.attachTo = function(troll) {
    troll.attack = this.attack;
    troll.custom_attack_ = 'Fart';
};

trolls.data.Power.StinkingCloud.prototype.attack = function() {
    this.appendChild(
	new lime.Sprite().setFill(trolls.resources.getFart())
	    .setSize(LEN*3, LEN*3));
};

// Troll mask

trolls.data.Power.TrollMask = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "warrior mask";
};
goog.inherits(trolls.data.Power.TrollMask, trolls.data.Power.BasePower);

trolls.data.Power.TrollMask.prototype.attachTo = function(troll) {
    troll.appendChild(
	new lime.Sprite().setFill(trolls.resources.getTrollMask())
	    .setSize(10, 10).setPosition(0, -10));
};

// Make bigger

trolls.data.Power.Bigger = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "embiggen";
};
goog.inherits(trolls.data.Power.Bigger, trolls.data.Power.BasePower);

trolls.data.Power.Bigger.prototype.attachTo = function(troll) {
    troll.setSize(troll.getSize().scale(1.2));
    troll.defense_ += 1;
    troll.speed_ -= 1;
};

// Make smaller

trolls.data.Power.Smaller = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "miniaturize";
};
goog.inherits(trolls.data.Power.Smaller, trolls.data.Power.BasePower);

trolls.data.Power.Smaller.prototype.attachTo = function(troll) {
    troll.setSize(troll.getSize().scale(.8));
    troll.attack_ -= 1;
    troll.speed_ += 1;
};

// Shoot fireballs

trolls.data.Power.Fireball = function() {
    trolls.data.Power.BasePower.call(this);
    this.action = {attack : this.throwFireball};
    this.name = "fireball";
};
goog.inherits(trolls.data.Power.Fireball, trolls.data.Power.BasePower);

trolls.data.Power.Fireball.prototype.attachTo = function(troll) {
    troll.attack = this.attack;
    troll.custom_attack_ = 'Fireball';
};

trolls.data.Power.Fireball.prototype.attack = function() {
    var fireball = 
	new lime.Sprite().setFill(trolls.resources.getFireball()).setSize(10, 10);
    this.appendChild(fireball);
    fireball.runAction(new lime.animation.MoveTo(this.goal_.getPosition()));
    // TODO: on stop
    this.goal_.smoosh();
}

trolls.data.Power.types_ = [
    trolls.data.Power.Defense,
    trolls.data.Power.Attack,
    trolls.data.Power.StinkingCloud,
    trolls.data.Power.TrollMask,
    trolls.data.Power.Bigger,
    trolls.data.Power.Smaller,
    trolls.data.Power.Fireball,
];
