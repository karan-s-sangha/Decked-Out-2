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
        this.animations = new Animator(this.spritesheet, 211, 0, 16, 16, 3, 0.2, 14, false, true);
    };



    update() {
        if (this.game.left || this.game.right || this.game.up || this.game.down) {
            this.move = 1;
        } else {
            this.move = 0;
        }

    };


    drawAngle(ctx, angle){
        // Make sure it's a valid angle.
        if(angle < 0 || angle > 359) {
            return;
        }

         /*
        We will rotate the image by first rotate the entire canvas then keep the steve
        and rotate back the background. However, this process is very expensive so we 
        will minimize it by creating array that stores canvas of all 360 degree angles.

        This is the reason we had to convert radian into degree. Further explanation can be
        seen from Chris's lecture.
        */
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
        /* 
        Game Engine has mouse listener along with keyboard listener. By calling game.mouse, I can retrieve 
        the mouse input from the user. Here, by calling arctan method from math class, I can find the angle 
        between the cursor and the steve in radian.

        Ex:     
                    cursor(pi/2)
          
                            cursor(pi/4)

                    steve        cursor(0 or 2*pi)

        */
        let angle = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);
        /*
        Because we don't to have negative angle, if the angle is negative, you have to convert into positive.

         Ex:     
                    steve      



                    cursor(-pi/2 + 2pi = 3/2 pi) 
        */
        if(angle < 0) {
            angle += Math.PI * 2;
        }
        /*
        Now convert radian into degree.
        */
        let degrees = Math.floor(angle / Math.PI / 2 * 360);    
        // For debug purpose I drew an red rectangle where the sprite should locate
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x, this.y, 32, 32);
        ctx.save();

        /*
        I made an boolean value "move". When keyboard is pressed, this.move = 1, otherwise, 0
        */
        if(this.move == 1) {
            /*
            If the player pressed key, we will call animator to animate the movement of a player.
            */
            this.animations.drawFrameAngle(this.game.clockTick, ctx, this.x, this.y, 2,angle);
        } else {
            /*
            If the player is not moving, we will draw the image by calling drawAngle method.
            */
            this.drawAngle(ctx, degrees);
        }

    };
};
