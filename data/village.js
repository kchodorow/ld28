goog.provide('trolls.data.Village');

goog.require('lib');
goog.require('trolls.Mixins');

// Create a random village.
trolls.data.Village = function(size) {
    lime.Sprite.call(this);

    this.box_ = new goog.math.Box(
	-size.height/2, size.width/2, size.height/2, -size.width/2);

    this.board_ = {};
    for (var col = this.box_.left; col < this.box_.right; col++) {
	this.board_[col] = {};
	for (var row = this.box_.top; row < this.box_.bottom; row++) {
	    var grass = new lime.Sprite()
		.setPosition(col*LEN, row*LEN)
		.setFill(trolls.resources.getGrass())
		.setSize(LEN, LEN);
	    grass.id = "Grass";
	    this.board_[col][row] = grass;
	    this.appendChild(grass);
	}
    }

    this.addHuts();
    this.addVillagers();
};

goog.inherits(trolls.data.Village, lime.Sprite);

trolls.data.Village.prototype.addHuts = function() {
    this.huts_ = [];
    var MIN_HUTS = 4;
    var MAX_HUTS = 20;
    var num_huts = lib.random(MIN_HUTS, MAX_HUTS);
    for (var i = 0; i < num_huts; i++) {
	var hut = new trolls.data.Hut(this.box_);
	if (this.board_[hut.loc_.x][hut.loc_.y].id != "Grass") {
	    continue;
	}
	this.board_[hut.loc_.x][hut.loc_.y] = hut;
	this.appendChild(hut);
    }
};

trolls.data.Village.prototype.addVillagers = function() {
    this.villagers_ = [];
    var MIN_VILLAGERS = 20;
    var MAX_VILLAGERS = 50;
    var num_villagers = lib.random(MIN_VILLAGERS, MAX_VILLAGERS);
    for (var i = 0; i < num_villagers; ++i) {
	var villager = new trolls.data.Villager(this.box_);
	this.villagers_.push(villager);
	this.appendChild(villager);
    }
};

trolls.data.Village.prototype.getVillagers = function() {
    return this.villagers_;
};

trolls.data.Village.prototype.smooshed = function(pos) {
    if (this.board_[pos.x][pos.y].id != "Grass") {
	this.board_[pos.x][pos.y].smoosh();
    }
};

trolls.data.Hut = function(box) {
    lime.Sprite.call(this);

    var x = lib.random(box.left, box.right);
    var y = lib.random(box.top, box.bottom);
    this.loc_ = new goog.math.Coordinate(x, y);
    this.setAnchorPoint(.5, 1).setPosition(x*LEN, y*LEN+LEN/2)
	.setFill(trolls.resources.getHut())
	.setSize(LEN, LEN);
};

goog.inherits(trolls.data.Hut, lime.Sprite);

trolls.data.Hut.prototype.id = "Hut";

trolls.data.Hut.prototype.smoosh = function() {
    this.runAction(new lime.animation.ScaleTo(1, 0));
};

trolls.data.Villager = function(box) {
    lime.Sprite.call(this);

    var pos_x = lib.random(box.left, box.right);
    var pos_y = lib.random(box.top, box.bottom);
    this.loc_ = new goog.math.Coordinate(pos_x, pos_y);
    this.setSize(15, 15).setFill(trolls.resources.getVillager())
	.setPosition(pos_x*LEN, pos_y*LEN);
    this.goal_ = null;
};

goog.inherits(trolls.data.Villager, lime.Sprite);

// px/ms
trolls.data.Villager.SPEED = .15;

trolls.data.Villager.prototype.step = function(dt) {
    goog.bind(trolls.Mixins.moveTowards, this, dt)();
};
