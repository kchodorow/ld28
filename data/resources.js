goog.provide('trolls.data.Resources');

goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.parser.JSON');
goog.require('lime.ASSETS.trolls.json');
goog.require('lime.SpriteSheet');

trolls.data.Resources = function() {
    FONT_COLOR = this.DARK_GREEN;
    FONT_FAMILY = 'VT323';
    FONT_SIZE = 36;

    this.spritesheet_ = new lime.SpriteSheet(
	'assets/trolls.png', lime.ASSETS.trolls.json, lime.parser.JSON);

    this.troll_walk_ = new lime.animation.KeyframeAnimation()
        .setDelay(1.5).setLooping(true);
    this.troll_walk_.addFrame(this.spritesheet_.getFrame('troll_walk3.png'));
    this.troll_walk_.addFrame(this.spritesheet_.getFrame('troll_walk4.png'));
    this.troll_walk_.addFrame(this.spritesheet_.getFrame('troll_walk2.png'));
    this.troll_walk_.addFrame(this.spritesheet_.getFrame('troll_walk1.png'));

    this.troll_attack_ = new lime.animation.KeyframeAnimation()
        .setDelay(5).setLooping(false);
    this.troll_attack_.addFrame(this.spritesheet_.getFrame('troll_smash1.png'));
    this.troll_attack_.addFrame(this.spritesheet_.getFrame('troll_smash2.png'));

    this.villager_walk_ = new lime.animation.KeyframeAnimation()
        .setDelay(5).setLooping(true);
    this.villager_walk_.addFrame(this.spritesheet_.getFrame('villager_walk.png'));
    this.villager_walk_.addFrame(this.spritesheet_.getFrame('villager.png'));

    this.villager_attack_ = new lime.animation.KeyframeAnimation()
        .setDelay(5).setLooping(false);
    this.villager_attack_.addFrame(this.spritesheet_.getFrame('villager_lunge2.png'));
    this.villager_attack_.addFrame(this.spritesheet_.getFrame('villager_lunge1.png'));
    this.villager_attack_.addFrame(this.spritesheet_.getFrame('villager.png'));
};

trolls.data.Resources.prototype.MORALE = {
    HUT_SMOOSH: -1,
    TROLL_HURT: 1
};

trolls.data.Resources.prototype.RED = 'rgb(90,31,0)';
trolls.data.Resources.prototype.ORANGE = 'rgb(209,87,13)';
trolls.data.Resources.prototype.YELLOW = 'rgb(253,231,146)';
trolls.data.Resources.prototype.LIGHT_GREEN = 'rgb(169,204,102)';
trolls.data.Resources.prototype.GREEN = 'rgb(71,119,37)';
trolls.data.Resources.prototype.DARK_GREEN = 'rgb(41,66,24)';

trolls.data.Resources.prototype.getHut = function() {
    return this.spritesheet_.getFrame('house.png');
};

trolls.data.Resources.prototype.getGrass = function() {
    return this.spritesheet_.getFrame('grass.png');
};

trolls.data.Resources.prototype.getTroll = function() {
    return this.spritesheet_.getFrame('troll_stand.png');
};

trolls.data.Resources.prototype.getTrollAttack = function() {
    return this.troll_attack_;
};

trolls.data.Resources.prototype.getTrollWalk = function() {
    return this.troll_walk_;
};

trolls.data.Resources.prototype.getMarker = function() {
    return this.spritesheet_.getFrame('marker.png');
};

trolls.data.Resources.prototype.getVillager = function() {
    return this.spritesheet_.getFrame('villager.png');
};

trolls.data.Resources.prototype.getVillagerAttack = function() {
    return this.villager_attack_;
};

trolls.data.Resources.prototype.getVillagerWalk = function() {
    return this.villager_walk_;
};

trolls.data.Resources.prototype.getMoraleMeterBg = function() {
    return this.DARK_GREEN;
};

// TODO: go to 'urine' yellow as % decreases
trolls.data.Resources.prototype.getMoraleMeterFg = function(percent) {
    return this.GREEN;
};

trolls.data.Resources.prototype.getPower = function() {
    return this.spritesheet_.getFrame('powerup.png');
};

trolls.data.Resources.prototype.getDialogBg = function() {
    return this.YELLOW;
};

trolls.data.Resources.prototype.getTrollMask = function() {
    return this.spritesheet_.getFrame('mask.png');
};

trolls.data.Resources.prototype.getFart = function() {
    return this.GREEN;
};

trolls.data.Resources.prototype.getFireball = function() {
    return this.spritesheet_.getFrame('fireball.png');
};

trolls.data.Resources.prototype.getIdol = function() {
    return this.spritesheet_.getFrame('idol.png');
};
