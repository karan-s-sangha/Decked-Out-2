class Steve {
    constructor(game, x, y, luigi) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.luigi = luigi;
        this.spritesheet = null;  // Placeholder for the image
        this.dir = "right";
        this.cashe = [];
        this.mousex = 0;
        this.mousey = 0;
        this.loadAnimations();
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet.src = "./Art/Level_1_UpperView_Art/mario.png";
        this.animations = new Animator(this.spritesheet, 239, 0, 16, 16, 3, 0.5, 14, false, true);
    };



    update() {
        // if (this.game.left) {
        //     this.dir = "left";
        //     //this.x -= this.speed;
        // }
        // if (this.game.right) {
        //     this.dir = "right";
        //     //this.x += this.speed;
        // }
        // if (this.game.up) {
        //     this.dir = "up";
        //     //this.y += this.speed;
        // }
        // if (this.game.down) {
        //     this.dir = "down";
        //    // this.y -= this.speed;
        // }

    };

    drawAngle(ctx, angle){
        if(angle < 0 || angle > 359) {
            return;
        }

        if(!this.cashe[angle]) {
            let radian = angle / 360 * 2 * Math.PI;
            var offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = 64;
            offscreenCanvas.height = 64;

            var offscreenCtx = offscreenCanvas.getContext('2d');
            
            offscreenCtx.save();
            offscreenCtx.translate(12,28);
            offscreenCtx.rotate(radian);
            offscreenCtx.translate(-12,-28);
            offscreenCtx.drawImage(this.spritesheet, 211, 0, 12, 16, 0, 13, 24,32);
            offscreenCtx.restore();
            this.cashe[angle] = offscreenCanvas;



        //    var offscreenCanvas = document.createElement('canvas');
        // offscreenCanvas.width = 64;
        // offscreenCanvas.height = 64;
        // var offscreenCtx = offscreenCanvas.getContext('2d');
        // offscreenCtx.save();
        // offscreenCtx.translate(32,32);
        // offscreenCtx.rotate(Math.PI/1);
        // offscreenCtx.translate(-32,-32);
        // offscreenCtx.drawImage(this.spritesheet, 209, 0, 32, 16, 8, 0, 64,32);
        // offscreenCtx.restore();

        // ctx.drawImage(offscreenCanvas,this.x-16, this.y, 64, 64);


        }
        ctx.drawImage(this.cashe[angle],this.x + 4, this.y - 12);

    }

    draw(ctx) {
        // // Working Code
        // if (this.game.left) {
        //     ctx.save();
        //     ctx.scale(-1, 1);
        //     this.animations.drawFrame(this.game.clockTick, ctx, -this.x - 32, this.y, 2);
        //     ctx.restore();
        // } else if (this.dir == "left") {
        //     ctx.save();
        //     ctx.scale(-1, 1);
        //     ctx.drawImage(this.spritesheet, 209, 0, 32, 16, -this.x-32, this.y, 64,32);
        //     ctx.restore();
        // }
        // else if (this.game.right) {
        //     this.animations.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
            
        // } 
        // else if (this.dir == "right") {
        //     ctx.drawImage(this.spritesheet, 209, 0, 32, 16, this.x , this.y, 64,32);
        // }
        // if (this.game.up) {
        //     // this.y -= this.speed;
        // }
        // if (this.game.down) {
        //     // this.y += this.speed;
        // }


        ////////////////////////////////////////////////////////
        // Rotation code
        ////////////////////////////////////////////////////////

        // var offscreenCanvas = document.createElement('canvas');
        // offscreenCanvas.width = 64;
        // offscreenCanvas.height = 64;
        // var offscreenCtx = offscreenCanvas.getContext('2d');
        // offscreenCtx.save();
        // offscreenCtx.translate(32,32);
        // offscreenCtx.rotate(Math.PI/1);
        // offscreenCtx.translate(-32,-32);
        // offscreenCtx.drawImage(this.spritesheet, 209, 0, 32, 16, 8, 0, 64,32);
        // offscreenCtx.restore();

        // ctx.drawImage(offscreenCanvas,this.x-16, this.y, 64, 64);


        ////////////////////////////////////////////////////////
        // Rotate 360
        ////////////////////////////////////////////////////////
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x, this.y, 32, 32);
        ctx.save();
        let angle = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);
        if(angle < 0) {
            angle += Math.PI * 2;
        }
        let degrees = Math.floor(angle / Math.PI / 2 * 360);    
        this.drawAngle(ctx, degrees);

    };
};
