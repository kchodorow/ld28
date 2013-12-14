goog.provide('trolls.data.Village');

goog.require('lib');

// Create a random village.
trolls.data.Village = function(size) {
    lime.Sprite.call(this);

    this.board_ = {};
    for (var col = -size.width/2; col < size.width/2; col++) {
	this.board_[col] = {};
	for (var row = -size.height/2; row < size.height/2; row++) {
	    var grass = new lime.Sprite()
		.setPosition(col*LEN, row*LEN)
		.setFill(trolls.resources.getGrass())
		.setSize(LEN, LEN);
	    grass.id = "Grass";
	    this.board_[col][row] = grass;
	    this.appendChild(grass);
	}
    }

    this.huts_ = [];
    var MIN_HUTS = 4;
    var MAX_HUTS = 20;
    var num_huts = lib.random(MIN_HUTS, MAX_HUTS);
    for (var i = 0; i < num_huts; i++) {
	var hut = new trolls.data.Hut(size);
	if (this.board_[hut.loc_.x][hut.loc_.y].id != "Grass") {
	    continue;
	}
	this.board_[hut.loc_.x][hut.loc_.y] = hut;
	this.appendChild(hut);
    }
};

goog.inherits(trolls.data.Village, lime.Sprite);

trolls.data.Village.prototype.smooshed = function(pos) {
    if (this.board_[pos.x][pos.y].id != "Grass") {
	this.board_[pos.x][pos.y].smoosh();
    }
};

trolls.data.Hut = function(size) {
    lime.Sprite.call(this);

    var x = lib.random(-size.width/2, size.width/2);
    var y = lib.random(-size.height/2, size.height/2);
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
