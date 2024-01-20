class Steve {
    constructor(game, x, y, luigi) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.luigi = luigi;
        this.spritesheet = null;  // Placeholder for the image
        this.move = 0;
        this.cashe = [];
        this.mousex = 0;
        this.mousey = 0;
        this.loadAnimations();
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet.src = "./Art/Level_1_UpperView_Art/mario.png";
        this.animations = new Animator(this.spritesheet, 211, 0, 16, 16, 3, 0.5, 14, false, true);
    };



    update() {
        if (this.game.left || this.game.right || this.game.up || this.game.down) {
            this.move = 1;
        } else {
            this.move = 0;
        }

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

        }
        
        ctx.drawImage(this.cashe[angle],this.x + 4, this.y - 12);
    }

    draw(ctx) {
        let angle = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);
        if(angle < 0) {
            angle += Math.PI * 2;
        }
        let degrees = Math.floor(angle / Math.PI / 2 * 360);    
   
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x, this.y, 32, 32);
        ctx.save();

        if(this.move == 1) {
            this.animations.drawFrameAngle(this.game.clockTick, ctx, this.x, this.y, 2,angle);
        } else {
            this.drawAngle(ctx, degrees);
        }

    };
};
