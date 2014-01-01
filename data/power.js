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
    this.inquire_ = false;
    goog.object.extend(this, new lib.Tag(trolls.data.Power.TAGS));
};

goog.inherits(trolls.data.Power.BasePower, lime.Sprite);

trolls.data.Power.TAGS = ['powerup'];

// Dialog for choosing the power.
trolls.data.Power.BasePower.prototype.inquireAbout = function(scene) {
    if (!this.inquire_) {
        trolls.controller.addPower(this);
        return;
    }

    var power = this;
    var size = new goog.math.Size(500, 300);
    var dialog = new lime.Sprite().setSize(size)
            .setFill(trolls.resources.getDialogBg())
            .setPosition(0, HEIGHT/2-size.height)
            .setStroke(2, trolls.resources.DARK_GREEN);
    var label = lib.label(
        'Would you like this troll to acquire the power: '+this.name)
            .setSize(size.width-40, size.height-40);
    dialog.appendChild(label);

    var yes = new lime.Sprite().setSize(100, 50).setStroke(1, '#000')
            .setPosition(-70, 50);
    yes.appendChild(lib.label('Yes'));
    goog.events.listen(yes, ['mousedown', 'touchstart'], function(e) {
        // TODO: nice sparkle animation for this
        trolls.controller.addPower(power);
        dialog.getParent().removeChild(dialog);
    });
    dialog.appendChild(yes);

    var no = new lime.Sprite().setSize(100, 50).setStroke(1, '#000')
            .setPosition(70, 50);
    no.appendChild(lib.label('No'));
    goog.events.listen(no, ['mousedown', 'touchstart'], function(e) {
        dialog.getParent().removeChild(dialog);
    });
    dialog.appendChild(no);

    scene.layer_.appendChild(dialog);
};

// Remove the powerup from the board.
trolls.data.Power.BasePower.prototype.attachTo = function() {
    if (this.getParent()) {
        this.getParent().removeChild(this);
        trolls.map.remove(this);
    }
};

trolls.data.Power.BasePower.prototype.points = function(troll) {
    var label = lib.pointLabel(this.name);
    if (troll.facing_ == lib.Direction.LEFT) {
        label.setScale(-1, 1);
    }
    troll.appendChild(label);
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
    this.points(troll);
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
    trolls.data.Power.BasePower.call(this);
    troll.defense_ += this.bonus;
    this.points(troll);
};

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
    this.points(troll);
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
    this.points(troll);
};

// Stinking cloud

trolls.data.Power.StinkingCloud = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "farting";
    this.inquire_ = true;
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
    this.inquire_ = true;
};
goog.inherits(trolls.data.Power.TrollMask, trolls.data.Power.BasePower);

trolls.data.Power.TrollMask.prototype.attachTo = function(troll) {
    trolls.data.Power.BasePower.call(this);
    troll.appendChild(
        new lime.Sprite().setFill(trolls.resources.getTrollMask()));
    var label = lib.pointLabel("Trololol");
    if (this.facing_ == lib.Direction.LEFT) {
        label.setScale(-1, 1);
    }
    troll.appendChild(label);
};

// Make bigger

trolls.data.Power.Bigger = function() {
    trolls.data.Power.BasePower.call(this);
    this.name = "embiggen";
    this.inquire_ = true;
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
    this.inquire_ = true;
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
    this.inquire_ = true;
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
