goog.provide('trolls.data.Resources');

trolls.data.Resources = function() {
};

trolls.data.Resources.prototype.MORALE = {
    HUT_SMOOSH: -15,
    TROLL_HURT: 1
};

trolls.data.Resources.prototype.getHut = function() {
    return '#755';
};

trolls.data.Resources.prototype.getGrass = function() {
    return '#070';
};

trolls.data.Resources.prototype.getTroll = function() {
    return '#ddd';
};

trolls.data.Resources.prototype.getMarker = function() {
    return '#ddd';
};

trolls.data.Resources.prototype.getVillager = function() {
    return '#00f';
};

trolls.data.Resources.prototype.getMoraleMeterBg = function() {
    return '#000';
};

// TODO: go to 'urine' yellow as % decreases
trolls.data.Resources.prototype.getMoraleMeterFg = function(percent) {
    return '#ff0';
};

trolls.data.Resources.prototype.getPower = function() {
    return '#ff0';
};

trolls.data.Resources.prototype.getDialogBg = function() {
    return '#999';
};

trolls.data.Resources.prototype.getTrollMask = function() {
    return '#fff';
};

trolls.data.Resources.prototype.getFart = function() {
    return '#0f0';
};

trolls.data.Resources.prototype.getFireball = function() {
    return '#f00';
};
