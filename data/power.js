goog.provide('trolls.data.Power');

goog.require('lime.animation.Loop');

trolls.data.Power = {};

trolls.data.Power.getRandom = function() {
    var i = lib.random(trolls.data.Power.types_.length);
    return new trolls.data.Power.types_[i]();
};

trolls.data.Power.BasePower = function() {
    lime.Sprite.call(this);
    this.setFill(trolls.resources.getPower());
    var pulse = new lime.animation.Sequence(
	new lime.animation.ScaleTo(1.2), new lime.animation.ScaleTo(1.0));
    this.runAction(new lime.animation.Loop(pulse));
    this.inquire = false;
    goog.object.extend(this, new lib.Tag(trolls.data.Power.TAGS));
};

goog.inherits(trolls.data.Power.BasePower, lime.Sprite);

trolls.data.Power.TAGS = ['powerup'];

// Remove the powerup from the board.
trolls.data.Power.BasePower.prototype.attachTo = function() {
    if (this.getParent()) {
	this.getParent().removeChild(this);
    }
};

// Health

trolls.data.Power.Health = function() {
    trolls.data.Power.BasePower.call(this);

    var MIN_HEALTH = 1;
    var MAX_HEALTH = 10;
    this.bonus = lib.random(MIN_HEALTH, MAX_HEALTH);
    this.name = "+"+this.bonus+" health";
};
goog.inherits(trolls.data.Power.Health, trolls.data.Power.BasePower);

trolls.data.Power.Health.prototype.attachTo = function(troll) {
    trolls.data.Power.BasePower.call(this);
    troll.changeHealth(this.bonus);
    troll.appendChild(lib.pointLabel(this.name));
}

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
    trolls.data.Power.BasePower.call(this);
    troll.defense_ += this.bonus;
    troll.appendChild(lib.pointLabel(this.name));
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
    trolls.data.Power.BasePower.call(this);
    troll.attack_ += this.bonus;
    troll.appendChild(lib.pointLabel(this.name));
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
    trolls.data.Power.BasePower.call(this);
    troll.speed_ += this.bonus/100;
    troll.appendChild(lib.pointLabel(this.name));
};

// Stinking cloud

trolls.data.Power.StinkingCloud = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "farting";
    this.inquire = true;
};
goog.inherits(trolls.data.Power.StinkingCloud, trolls.data.Power.BasePower);

trolls.data.Power.StinkingCloud.prototype.attachTo = function(troll) {
    trolls.data.Power.BasePower.call(this);
    troll.attack = this.attack;
    troll.custom_attack_ = 'Fart';
};

trolls.data.Power.StinkingCloud.prototype.attack = function() {
    var fart = new lime.Circle().setFill(trolls.resources.DARK_GREEN)
	.setSize(LEN*3, LEN*3).setOpacity(.3).setPosition(this.getPosition());
    this.getParent().appendChild(fart);
    fart.runAction(new lime.animation.FadeTo(0));
    trolls.controller.changeMorale(-10);
};

// Troll mask

trolls.data.Power.TrollMask = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "warrior mask";
    this.inquire = true;
};
goog.inherits(trolls.data.Power.TrollMask, trolls.data.Power.BasePower);

trolls.data.Power.TrollMask.prototype.attachTo = function(troll) {
    trolls.data.Power.BasePower.call(this);
    troll.appendChild(
	new lime.Sprite().setFill(trolls.resources.getTrollMask()));
    troll.appendChild(lib.pointLabel("Trololol"));
};

// Make bigger

trolls.data.Power.Bigger = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "embiggen";
    this.inquire = true;
};
goog.inherits(trolls.data.Power.Bigger, trolls.data.Power.BasePower);

trolls.data.Power.Bigger.prototype.attachTo = function(troll) {
    trolls.data.Power.BasePower.call(this);
    troll.setSize(troll.getSize().scale(1.2));
    troll.defense_ += 1;
    troll.speed_ -= 1;
};

// Make smaller

trolls.data.Power.Smaller = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "miniaturize";
    this.inquire = true;
};
goog.inherits(trolls.data.Power.Smaller, trolls.data.Power.BasePower);

trolls.data.Power.Smaller.prototype.attachTo = function(troll) {
    trolls.data.Power.BasePower.call(this);
    troll.setSize(troll.getSize().scale(.8));
    troll.attack_ -= 1;
    troll.speed_ += 1;
};

// Shoot fireballs

trolls.data.Power.Fireball = function() {
    trolls.data.Power.BasePower.call(this);
    this.action = {attack : this.throwFireball};
    this.name = "fireball";
    this.inquire = true;
};
goog.inherits(trolls.data.Power.Fireball, trolls.data.Power.BasePower);

trolls.data.Power.Fireball.prototype.attachTo = function(troll) {
    trolls.data.Power.BasePower.call(this);
    troll.attack = this.attack;
    troll.custom_attack_ = 'Fireball';
};

trolls.data.Power.Fireball.prototype.attack = function() {
    var fireball = 
	new lime.Sprite().setFill(trolls.resources.getFireball());
    this.appendChild(fireball);
    fireball.runAction(new lime.animation.MoveTo(this.goal_.getPosition()));
    // TODO: on stop
    this.goal_.smoosh();
}

trolls.data.Power.types_ = [
    trolls.data.Power.Health,
    trolls.data.Power.Defense,
    trolls.data.Power.Attack,
    trolls.data.Power.Speed,
    trolls.data.Power.StinkingCloud,
    trolls.data.Power.TrollMask,
    trolls.data.Power.Bigger,
    trolls.data.Power.Smaller,
    trolls.data.Power.Fireball,
];
