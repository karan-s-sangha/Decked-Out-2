class Steve {
    constructor(game, x, y, luigi) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.luigi = luigi;
        this.spritesheet = null;  // Placeholder for the image
      
        this.loadAnimations();
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet.src = "./Art/Level_1_UpperView_Art/mario.png";
        this.animations = new Animator(this.spritesheet, 239, 0, 16, 16, 3, 0.5, 14, false, true);
    };



    update() {
        if (this.game.left) {
            this.x -= this.speed;
        }
        if (this.game.right) {
            this.x += this.speed;
        }
        if (this.game.up) {
            this.y -= this.speed;
        }
        if (this.game.down) {
            this.y += this.speed;
        }
        
    };


    draw(ctx) {
             // Draw the Mario image on top of the black background
         //  ctx.drawImage(this.spritesheet, 209, 0, 32, 16, this.x, this.y, 64,32);
         this.animations.drawFrame(this.game.clockTick,ctx,this.x,this.y,3);

    };
};
