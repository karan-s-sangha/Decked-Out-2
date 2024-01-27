class Steve {
    constructor(game,playerX ,playerY, scene) {
        this.scale = 0.2;
        this.width = 241;
        this.height = 340; 
        this.game = game;
        this.spritesheet = null;  // Placeholder for the image
        this.move = 0;
        this.cashe = [];
        this.mousex = 0;
        this.mousey = 0;
        this.scene = scene;

        this.playerX = playerX;
        this.playerY = playerY;
        this.screenX = this.game.ctx.canvas.width/2;
        this.screenY = this.game.ctx.canvas.height/2;

        this.playerSpeed = 18;
        this.collision = new Collision(this.game);
        this.loadAnimations();
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet = ASSET_MANAGER.cache["./Art/Steve_Animations/player - running.png"];
        // this.spritesheet.src = "./Art/Steve_Animations/player - running.png";
        this.animations = new Animator(this.game, this.spritesheet, 0, 0, this.width, this.height, 70, 0.008, 0, false, true);
    };



    update() {
        if (this.game.left && !this.collision.isCollision(this.playerX - this.playerSpeed, this.playerY)) {
            this.move = 1;
            this.playerX -= this.playerSpeed;
        } 
        if (this.game.right && !this.collision.isCollision(this.playerX + this.playerSpeed, this.playerY)) {
            this.move = 1;
            this.playerX += this.playerSpeed;
        }
        if (this.game.up && !this.collision.isCollision(this.playerX, this.playerY - this.playerSpeed)) {
            this.move = 1;
            this.playerY -= this.playerSpeed;
        }
        if (this.game.down && !this.collision.isCollision(this.playerX, this.playerY + this.playerSpeed)) {
            this.move = 1;
            this.playerY += this.playerSpeed;
        } 
        if (!this.game.left  && !this.game.right && !this.game.up && !this.game.down){
            this.move = 0;
        }
    };


    drawAngle(ctx, angle, scale){
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

            if(this.width > this.height) {
                offscreenCanvas.width = this.width * scale;
                offscreenCanvas.height = this.width * scale;
            } else {
                offscreenCanvas.width = this.height * scale;
                offscreenCanvas.height = this.height * scale;
            }

            var offscreenCtx = offscreenCanvas.getContext('2d');
            offscreenCtx.save();
            offscreenCtx.translate(offscreenCanvas.width/2, offscreenCanvas.height/2);
            offscreenCtx.rotate(radian);
            offscreenCtx.translate(-offscreenCanvas.width/2 , -offscreenCanvas.height/2);
            offscreenCtx.drawImage(this.spritesheet, 0, 0, this.width, this.height, (offscreenCanvas.width - (this.width * scale)) / 2
                                   ,(offscreenCanvas.width - (this.height * scale)) / 2, this.width * scale, this.height * scale);
            offscreenCtx.restore();
            offscreenCtx.save();

            // Debug
            // offscreenCtx.strokeStyle="red";
            // offscreenCtx.strokeRect(0,0,offscreenCanvas.width, offscreenCanvas.height);

            this.cashe[angle] = offscreenCanvas;

        }
        //ctx.drawImage(this.cashe[angle],this.game.camera.cameraX - this.cashe[angle].width / 2, this.game.camera.cameraY - this.cashe[angle].height / 2);
        ctx.drawImage(this.cashe[angle],this.playerX - this.game.camera.cameraX - this.scale * this.height / 2, this.playerY - this.game.camera.cameraY - this.scale * this.height / 2);

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
        let angle = Math.atan2(this.game.mouse.y - this.screenY, this.game.mouse.x - this.screenX) - (Math.PI/2);
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
        ctx.strokeRect(this.screenX, this.screenY, 1, 1);
        ctx.save();

        /*
        I made an boolean value "move". When keyboard is pressed, this.move = 1, otherwise, 0
        */
        if(this.move == 1) {
            /*
            If the player pressed key, we will call animator to animate the movement of a player.
            */
            this.animations.drawMap(this.game.clockTick, ctx, 350, 350);
        } else {
            /*
            If the player is not moving, we will draw the image by calling drawAngle method.
            */
          this.drawAngle(ctx, degrees, this.scale);
          
          // this.animations.elapsedTime = 0;
        }

        ctx.strokeStyle = "red";
        ctx.strokeRect(this.screenX, this.screenY, 1, 1);
        ctx.save();

    };
};