class Steve {
    constructor(game, x, y, luigi) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.luigi = luigi;
        this.spritesheet = null;  // Placeholder for the image
        this.dir = "right";

        this.loadAnimations();
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet.src = "./Art/Level_1_UpperView_Art/mario.png";
        this.animations = new Animator(this.spritesheet, 239, 0, 16, 16, 3, 0.5, 14, false, true);
    };



    update() {
        if (this.game.left) {
            this.dir = "left";
            //this.x -= this.speed;
        }
        if (this.game.right) {
            this.dir = "right";
            //this.x += this.speed;
        }
        if (this.game.up) {
            this.dir = "up";
            //this.y += this.speed;
        }
        if (this.game.down) {
            this.dir = "down";
           // this.y -= this.speed;
        }

    };


    draw(ctx) {
        // Working Code
        if (this.game.left) {
            ctx.save();
            ctx.scale(-1, 1);
            this.animations.drawFrame(this.game.clockTick, ctx, -this.x - 32, this.y, 2);
            ctx.restore();
        } else if (this.dir == "left") {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.spritesheet, 209, 0, 32, 16, -this.x-32, this.y, 64,32);
            ctx.restore();
        }
        else if (this.game.right) {
            this.animations.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
            
        } 
        else if (this.dir == "right") {
            ctx.drawImage(this.spritesheet, 209, 0, 32, 16, this.x , this.y, 64,32);
        }
        if (this.game.up) {
            // this.y -= this.speed;
        }
        if (this.game.down) {
            // this.y += this.speed;
        }
    };
};
