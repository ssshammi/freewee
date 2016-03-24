
    //width and height and rendering method (auto lets phaser decide between webGL or canvas 2d), id for <canvas> to use for rendering if one already exists (null as we want phaser to create its own)
    //preload takes care of preloading assets
    //create executed once everything loaded and ready
    //update executed on every frame                   
    var game = new Phaser.Game(800, 600, Phaser.AUTO, null, {
      preload: preload, create: create, update: update
    });

    var numPlayers=2; 

    var sumo;
    var track;
    
    var cursors;

    var count=0; //framerate
    var speed=10;
   
   var circle1;
   var circleSprite;

    function preload() {
        //for scaleMode: exists 
//      *NO_SCALE — nothing is scaled.
//      *EXACT_FIT — scale the canvas to fill all the available space both vertically and horizontally, without preserving the aspect ratio.
//      *SHOW_ALL — scales the canvas, but keeps the aspect ratio untouched, so images won't be skewed like in the previous mode. There might be black stripes visible on the edges of the screen, but we can live with that.
//      *RESIZE — creates the canvas with the same size as the available width and height, so you have to place the objects inside your game dynamically; this is more of an advanced mode.
//      *USER_SCALE — allows you to have custom dynamic scaling, calculating the size, scale and ratio on your own; again, this is more of an advanced mode

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#D7E4BD'; //green background colour

        //load the sumo and the track 
        game.load.spritesheet('sumoMove','img/sumo_sprite2.png',188,219);
        game.load.image('track','img/track.png');
        

    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //adding track spirte to the game 
        track = game.add.sprite(game.world.width*0.25, 0,'track');
        track.anchor.set(0.5,0); //default is 0,0 (top left), anchor point is where to take x y coordinates references from
        track.scale.setTo(0.5,(game.world.height/track.height)); //to scale the track 

        //adding sumo sprite to the game 
        sumo = game.add.sprite(game.world.width*0.25,0,'sumoMove');
        sumo.anchor.set(0.5,0);
        sumo.scale.setTo(0.5,0.5);
        game.physics.enable(sumo,Phaser.Physics.ARCADE); // to enable sumo as a body in phaser.physics.p2
        sumo.body.collideWorldBounds=true;
        //sumo.body.bounce.set(0.5);

        //adding random sprite 
        circle1 = game.add.bitmapData(100,100);
        circle1.fill(200,100,0,1); //red green blue alpha 
        circleSprite=game.add.sprite(game.world.width*0.4, 0,circle1);
        game.physics.enable(circleSprite,Phaser.Physics.ARCADE);
        circleSprite.body.velocity.y=20;
        //circleSprite.body.immovable=true;//pevents other objs from displacing it 
        circleSprite.body.collideWorldBounds=true;

        cursors = game.input.keyboard.createCursorKeys(); //up down left right of keyboard 
        game.input.onDown.addOnce(startDecrement); //startDecrement called only once when mouse is clicked  
        

    }
    function update() {
        //increaseSpeed function called everytime mouse click is registered
       game.input.onDown.add(increaseSpeed);

       //collision event listener 
       game.physics.arcade.collide(sumo,circleSprite,collisionDetected);

       //cursor movements 
        if (cursors.left.isDown){
            //sumo.body.moveLeft(10);
            sumo.body.velocity.x=-10;
            console.log('left');
        }
        else if (cursors.right.isDown){
//            sumo.body.moveRight(10);
            sumo.body.velocity.x=10;
            console.log('right');
        }

        //to detect if reach the finishing line 
        //console.log(sumo.body.y);
        if (sumo.body.y>=490.5){ //it seems like an arbitrary number i took...
            alert('you won!');
            location.reload();
        }
    }


    function increaseSpeed(){
        //count is the framerate 
        count++; 
       // console.log('incrementing '+ count);
        sumo.animations.add('sumoMove',[0,1,2,3],count,true); //animation added to the sprite
        sumo.animations.play('sumoMove'); // animation called 'sumoMove' is played 
        sumo.body.velocity.y=speed*count; //changes distance of sumo. somehow doesnt work  
        console.log('incrementing '+sumo.body.velocity.y);
    }


    function startDecrement(){
        //recursive function that decrements the count 
        if (count>1){
            count=count-0.5;
//            console.log('decrementing ' +count);
            sumo.animations.add('sumoMove',[0,1,2,3],count,true);
            sumo.animations.play('sumoMove');
            sumo.body.velocity.y=speed*count;  
            console.log('decrementing'+ sumo.body.velocity.y); 

        }

        setTimeout(startDecrement,500); 
    }

    function collisionDetected(sumo,circleSprite){
        //if sumo collides with the sprite, sumo will decrease the speed of the sprite such that the speed of sprite can even go negative (go backwards)
        circleSprite.body.velocity.y-=1;
        console.log("collided! Decrease speeed! "+circleSprite.body.velocity.y);

    }

