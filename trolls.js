//set main namespace
goog.provide('trolls');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

goog.require('lib');
goog.require('trolls.data.Resources');
goog.require('trolls.data.Tutorial');
goog.require('trolls.data.Stats');
goog.require('trolls.data.Village');

var WIDTH = 1024;
var HEIGHT = 768;

// entrypoint
trolls.start = function(){
    trolls.resources = new trolls.data.Resources();
    trolls.tutorial = new trolls.data.Tutorial();
    trolls.stats = new trolls.data.Stats();

    var director = new lime.Director(document.body,1024,768);
    var scene = new lime.Scene();
    var layer = new lime.Layer().setSize(WIDTH, HEIGHT).setAnchorPoint(.5, .5)
	.setPosition(WIDTH/2, HEIGHT/2);

    var village_size = new goog.math.Size(20, 20);
    var village = new trolls.data.Village(village_size);

    layer.appendChild(village);
    scene.appendChild(layer);

    director.makeMobileWebAppCapable();

    //add some interaction
    // goog.events.listen(target,['mousedown','touchstart'],function(e){

    //                        //animate
    //                        target.runAction(new lime.animation.Spawn(
    //                                             new lime.animation.FadeTo(.5).setDuration(.2),
    //                                             new lime.animation.ScaleTo(1.5).setDuration(.8)
    //                                         ));

    //                        title.runAction(new lime.animation.FadeTo(1));

    //                        //let target follow the mouse/finger
    //                        e.startDrag();

    //                        //listen for end event
    //                        e.swallow(['mouseup','touchend'],function(){
    //                                      target.runAction(new lime.animation.Spawn(
    //                                                           new lime.animation.FadeTo(1),
    //                                                           new lime.animation.ScaleTo(1),
    //                                                           new lime.animation.MoveTo(512,384)
    //                                                       ));

    //                                      title.runAction(new lime.animation.FadeTo(0));
    //                                  });


    //                    });

    // set current scene active
    director.replaceScene(scene);

};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('trolls.start', trolls.start);
