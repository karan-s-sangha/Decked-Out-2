class Steve {
    constructor(game, playerX, playerY) {
        // latest version of steve

        this.scale = 0.2;
        this.width = 241;
        this.height = 340;
        this.game = game;
        this.health = 10;
        this.hunger = 10;
        this.steve = 10;
        this.spritesheet = null;  // Placeholder for the image
        this.move = 0;
        this.cache = [];
        this.mousex = 0;
        this.mousey = 0;
        this.run = false;
        this.velocity = { z: 0 };
        this.elapsedTime = 0;
        this.jumped = false;
        this.jumpComplete = true;

        this.canMove = true;
        this.playerX = playerX;
        this.playerY = playerY;
        this.screenX = this.game.ctx.canvas.width / 2;
        this.screenY = this.game.ctx.canvas.height / 2;

        this.playerRunSpeed = 800;
        this.playerWalkSpeed = 600;

        this.clank = 0;
        this.hazard = 0;
        
        this.collision = new Collision(this.game);
        this.loadAnimations();
        this.live = true;

        this.elapsedTime = 0;
        this.healingDelay = 0;
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet = ASSET_MANAGER.cache["./Art/Steve_Animations/player - running.png"];
        // this.spritesheet.src = "./Art/Steve_Animations/player - running.png";
        this.walkingAnimations = new Animator(this.game, this.spritesheet, 0, 0, this.width, this.height, 70, 0.010, 0, false, true);
        this.runningAnimations = new Animator(this.game, this.spritesheet, 0, 0, this.width, this.height, 70, 0.006, 0, false, true);
    };

    move(x, y) {

        this.playerX = x;
        this.playerY = y;
        this.move = true;
    }

    update() {
       // console.log(this.canMove);
        if (this.game.keys.ctrl) {
            console.log("ctrl");
        }
        if (this.canMove) {
            if (this.game.keys.shift && this.hunger >= 3 && this.game.keys.space) {
                if (this.game.keys.left && !this.collision.isCollision(this.playerX - (this.playerRunSpeed * this.game.clockTick), this.playerY)) {
                    this.move = 1;
                    this.playerX -= this.playerRunSpeed * this.game.clockTick;
                }
                if (this.game.keys.right && !this.collision.isCollision(this.playerX + (this.playerRunSpeed * this.game.clockTick), this.playerY)) {
                    this.move = 1;
                    this.playerX += this.playerRunSpeed * this.game.clockTick;
                }
                if (this.game.keys.up && !this.collision.isCollision(this.playerX, this.playerY - this.playerRunSpeed * this.game.clockTick)) {
                    this.move = 1;
                    this.playerY -= this.playerRunSpeed * this.game.clockTick;
                }
                if (this.game.keys.down && !this.collision.isCollision(this.playerX, this.playerY + this.playerRunSpeed * this.game.clockTick)) {
                    this.move = 1;
                    this.playerY += this.playerRunSpeed * this.game.clockTick;
                }

                this.run = true;
                this.elapsedTime += 2 * this.game.clockTick;
            }
            else if (this.game.keys.shift && this.hunger >= 3) {
                if (this.game.keys.left && !this.collision.isCollision(this.playerX - this.playerRunSpeed * this.game.clockTick, this.playerY)) {
                    this.move = 1;
                    this.playerX -= this.playerRunSpeed * this.game.clockTick;
                }
                if (this.game.keys.right && !this.collision.isCollision(this.playerX + this.playerRunSpeed * this.game.clockTick, this.playerY)) {
                    this.move = 1;
                    this.playerX += this.playerRunSpeed * this.game.clockTick;
                }
                if (this.game.keys.up && !this.collision.isCollision(this.playerX, this.playerY - this.playerRunSpeed * this.game.clockTick)) {
                    this.move = 1;
                    this.playerY -= this.playerRunSpeed * this.game.clockTick;
                }
                if (this.game.keys.down && !this.collision.isCollision(this.playerX, this.playerY + this.playerRunSpeed * this.game.clockTick)) {
                    this.move = 1;
                    this.playerY += this.playerRunSpeed * this.game.clockTick;
                }

                this.run = true;
                this.elapsedTime += 2 * this.game.clockTick;
            } else {
                if (this.game.keys.left && !this.collision.isCollision(this.playerX - (this.playerWalkSpeed * this.game.clockTick), this.playerY)) {
                    this.move = 1;
                    this.playerX -= this.playerWalkSpeed * this.game.clockTick;
                    //console.log((this.game.clockTick));
                }
                if (this.game.keys.right && !this.collision.isCollision(this.playerX + (this.playerWalkSpeed * this.game.clockTick), this.playerY)) {
                    this.move = 1;
                    this.playerX += this.playerWalkSpeed * this.game.clockTick;
                }
                if (this.game.keys.up && !this.collision.isCollision(this.playerX, this.playerY - (this.playerWalkSpeed * this.game.clockTick))) {
                    this.move = 1;
                    this.playerY -= this.playerWalkSpeed * this.game.clockTick;
                }
                if (this.game.keys.down && !this.collision.isCollision(this.playerX, this.playerY + (this.playerWalkSpeed * this.game.clockTick))) {
                    this.move = 1;
                    this.playerY += this.playerWalkSpeed * this.game.clockTick;
                }

                this.run = false;
                this.elapsedTime += this.game.clockTick;
            }


            if (!this.game.keys.left && !this.game.keys.right && !this.game.keys.up && !this.game.keys.down) {
                this.move = 0;
            }

            if (this.game.keys.space && !this.jumped) {
                this.jumped = true;
                this.jumpComplete = false;
            }

            if (this.hunger >= 9 && this.health <= 9.5) {
                this.healingDelay += this.game.clockTick;
                if(this.healingDelay >= 2) {
                    this.health += 0.5;
                    this.healingDelay = 0;
                }
            }
        if(this.elapsedTime >= 30) {
            this.hunger -= 0.5;
            this.elapsedTime = 0;
        }


    

        }
        if(this.health  <= 0) {
            this.health = 0;
            this.live = false;
            console.log("run");
        }
       
    };


    drawAngle(ctx, angle, scale) {
        // Make sure it's a valid angle.
        if (angle < 0 || angle > 359) {
            return;
        }

        /*
       We will rotate the image by first rotate the entire canvas then keep the steve
       and rotate back the background. However, this process is very expensive so we 
       will minimize it by creating array that stores canvas of all 360 degree angles.

       This is the reason we had to convert radian into degree. Further explanation can be
       seen from Chris's lecture.
       */
        //    if(!this.cache[angle]) {
        let radian = angle / 360 * 2 * Math.PI;
        var offscreenCanvas = document.createElement('canvas');

        if (this.width > this.height) {
            offscreenCanvas.width = this.width * scale;
            offscreenCanvas.height = this.width * scale;
        } else {
            offscreenCanvas.width = this.height * scale;
            offscreenCanvas.height = this.height * scale;
        }

        var offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
        offscreenCtx.rotate(radian);
        offscreenCtx.translate(-offscreenCanvas.width / 2, -offscreenCanvas.height / 2);
        offscreenCtx.drawImage(this.spritesheet, 0, 0, this.width, this.height, (offscreenCanvas.width - (this.width * scale)) / 2
            , (offscreenCanvas.width - (this.height * scale)) / 2, this.width * scale, this.height * scale);
        offscreenCtx.restore();
        // offscreenCtx.save();

        // Debug
        // offscreenCtx.strokeStyle="red";
        // offscreenCtx.strokeRect(0,0,offscreenCanvas.width, offscreenCanvas.height);

        // this.cache[angle] = offscreenCanvas;

        //    }
        //ctx.drawImage(this.cache[angle],this.game.camera.cameraX - this.cache[angle].width / 2, this.game.camera.cameraY - this.cache[angle].height / 2);
        ctx.drawImage(offscreenCanvas, this.playerX - this.game.camera.cameraX - this.scale * this.height / 2, this.playerY - this.game.camera.cameraY - this.scale * this.height / 2);

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
        let angle = Math.atan2(this.game.mouse.y - this.screenY, this.game.mouse.x - this.screenX) - (Math.PI / 2);
        /*
        Because we don't to have negative angle, if the angle is negative, you have to convert into positive.

         Ex:     
                    steve      



                    cursor(-pi/2 + 2pi = 3/2 pi) 
        */
        if (angle < 0) {
            angle += Math.PI * 2;
        }
        /*
        Now convert radian into degree.
        */
        let degrees = Math.floor(angle / Math.PI / 2 * 360);
        // For debug purpose I drew an red rectangle where the sprite should locate
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.screenX, this.screenY, 1, 1);
       // ctx.save();

        /*
        I made an boolean value "move". When keyboard is pressed, this.move = 1, otherwise, 0
        */
        if (this.move == 1) {
            /*
            If the player pressed key, we will call animator to animate the movement of a player.
            */
            if (this.run == true) {
                this.runningAnimations.drawFrameAngle(this.game.clockTick, ctx, this.screenX, this.screenY, this.scale, angle);
            } else {
                this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, this.screenX, this.screenY, this.scale, angle);
            }

        } else {
            /*
            If the player is not moving, we will draw the image by calling drawAngle method.
            */
            this.drawAngle(ctx, degrees, this.scale);
            if (this.run = true) {
                this.runningAnimations.elapsedTime = 0;
            } else {
                this.walkingAnimations.elapsedTime = 0;
            }

        }
    
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.screenX, this.screenY, 1, 1);
    };
};