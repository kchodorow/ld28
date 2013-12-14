goog.provide('trolls.Controller');

trolls.Controller = function() {
    this.actors_ = [];
    this.trolls_ = [];
};

trolls.Controller.prototype.addTroll = function(troll) {
    this.actors_.push(troll);
    this.trolls_.push(troll);
};

trolls.Controller.prototype.addActor_ = function(thing) {
    this.actors_.push(thing);
};

trolls.Controller.prototype.step = function(dt) {
    var num_actors = this.actors_.length;
    for (var i = 0; i < num_actors; ++i) {
	this.actors_[i].step(dt);
    }
};
