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
};

trolls.data.Resources.prototype.MORALE = {
    HUT_SMOOSH: -1,
    VILLAGER_SMOOSH: -1,
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
    var troll_attack = new lime.animation.KeyframeAnimation()
        .setDelay(1/4).setLooping(false);
    troll_attack.addFrame(this.spritesheet_.getFrame('troll_smash1.png'));
    troll_attack.addFrame(this.spritesheet_.getFrame('troll_smash2.png'));
    troll_attack.addFrame(this.spritesheet_.getFrame('troll_stand.png'));
    return troll_attack;
};

trolls.data.Resources.prototype.getTrollWalk = function() {
    var troll_walk = new lime.animation.KeyframeAnimation()
        .setDelay(1/8).setLooping(true);
    troll_walk.addFrame(this.spritesheet_.getFrame('troll_walk3.png'));
    troll_walk.addFrame(this.spritesheet_.getFrame('troll_walk4.png'));
    troll_walk.addFrame(this.spritesheet_.getFrame('troll_walk2.png'));
    troll_walk.addFrame(this.spritesheet_.getFrame('troll_walk1.png'));
    return troll_walk;
};

trolls.data.Resources.prototype.getMarker = function() {
    return this.spritesheet_.getFrame('marker.png');
};

trolls.data.Resources.prototype.getVillager = function() {
    return this.spritesheet_.getFrame('villager.png');
};

trolls.data.Resources.prototype.getVillagerAttack = function() {
    var villager_attack = new lime.animation.KeyframeAnimation()
        .setDelay(1/8).setLooping(false);
    villager_attack.addFrame(this.spritesheet_.getFrame('villager_lunge2.png'));
    villager_attack.addFrame(this.spritesheet_.getFrame('villager_lunge1.png'));
    villager_attack.addFrame(this.spritesheet_.getFrame('villager.png'));
    return villager_attack;
};

trolls.data.Resources.prototype.getVillagerWalk = function() {
    var villager_walk = new lime.animation.KeyframeAnimation()
        .setDelay(1/8).setLooping(true);
    villager_walk.addFrame(this.spritesheet_.getFrame('villager_walk.png'));
    villager_walk.addFrame(this.spritesheet_.getFrame('villager.png'));
    return villager_walk;
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

trolls.data.Resources.prototype.getIdol = function(opt_angry) {
    if (opt_angry) {
	return this.spritesheet_.getFrame('idol2.png');
    } else {
	return this.spritesheet_.getFrame('idol1.png');
    }
};
