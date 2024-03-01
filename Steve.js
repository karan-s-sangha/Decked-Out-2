class Steve {
    constructor(game, playerX, playerY, playerZ) {
        // latest version of steve

        this.scale = 0.26;
        this.width = 200;
        this.height = 356;
        this.game = game;
        this.health = 10;
        this.hunger = 5;
        this.steve = 10;
        this.spritesheet = null;  // Placeholder for the image
        this.move = 0;
        this.cache = [];
        this.mousex = 0;
        this.mousey = 0;
        this.run = false;
        this.velocity = { z: 0 };
        this.elapsedTime = 0;
        this.hungerTime = 0;
        this.jumped = false;
        this.jumpCount = 0;
        this.jumpDelay = 0;

        this.canMove = true;


        this.playerX = playerX;
        this.playerY = playerY;
        this.playerZ = playerZ;

        this.screenX = this.game.ctx.canvas.width / 2;
        this.screenY = this.game.ctx.canvas.height / 2 + this.height * this.scale / 2;

        this.playerRunSpeed = 20;
        this.playerWalkSpeed = 5;


        this.win = false;

        this.collision = this.game.camera.collision;
        this.loadAnimations();
        this.live = true;
        this.win = false;


        //console.log("Z: " + this.playerZ);
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet = ASSET_MANAGER.cache["./Art/Steve_Animations/Iso/player - Converted1.png"];
        // this.spritesheet.src = "./Art/Steve_Animations/player - running.png";
        this.walkingAnimations = new Animator(this.game, this.spritesheet, 0, 0, this.width, this.height, 70, 0.010, 0, false, true);
        this.runningAnimations = new Animator(this.game, this.spritesheet, 0, 0, this.width, this.height, 70, 0.006, 0, false, true);
    };

    move(x, y, z) {
        //console.log(this.playerX + "D " +  this.playerY + "DD " +this.playerZ);

        this.playerX = x;
        this.playerY = y;
        this.move = true;

    }

    update() {
        // console.log(this.canMove);
        if (this.game.keys.ctrl) {
            console.log("ctrl");
        }
        //console.log(this.playerY);
        // if (this.canMove) {
        // if (this.game.keys.shift && this.hunger >= 3 && this.game.keys.space) {
        //     if (this.game.keys.left && this.collision.isCollision(this.playerX - (this.playerRunSpeed * this.game.clockTick), this.playerY, this.playerZ)) {
        //         this.move = 1;
        //         this.playerX -= this.playerRunSpeed * this.game.clockTick;
        //     }
        //     if (this.game.keys.right && this.collision.isCollision(this.playerX + (this.playerRunSpeed * this.game.clockTick), this.playerY, this.playerZ)) {
        //         this.move = 1;
        //         this.playerX += this.playerRunSpeed * this.game.clockTick;
        //     }
        //     if (this.game.keys.up && this.collision.isCollision(this.playerX, this.playerY - this.playerRunSpeed * this.game.clockTick, this.playerZ)) {
        //         this.move = 1;
        //         this.playerY -= this.playerRunSpeed * this.game.clockTick;
        //     }
        //     if (this.game.keys.down && this.collision.isCollision(this.playerX, this.playerY + this.playerRunSpeed * this.game.clockTick, this.playerZ)) {
        //         this.move = 1;
        //         this.playerY += this.playerRunSpeed * this.game.clockTick;
        //     }

        //     this.run = true;
        //     this.hungerTime += 3 * this.game.clockTick;
        // }
        // else if (this.game.keys.shift && this.hunger >= 3) {
        //     if (this.game.keys.left && this.collision.isCollision(this.playerX - this.playerRunSpeed * this.game.clockTick, this.playerY, this.playerZ)) {
        //         this.move = 1;
        //         this.playerX -= this.playerRunSpeed * this.game.clockTick;
        //     }
        //     if (this.game.keys.right && this.collision.isCollision(this.playerX + this.playerRunSpeed * this.game.clockTick, this.playerY, this.playerZ)) {
        //         this.move = 1;
        //         this.playerX += this.playerRunSpeed * this.game.clockTick;
        //     }
        //     if (this.game.keys.up && this.collision.isCollision(this.playerX, this.playerY - this.playerRunSpeed * this.game.clockTick, this.playerZ)) {
        //         this.move = 1;
        //         this.playerY -= this.playerRunSpeed * this.game.clockTick;
        //     }
        //     if (this.game.keys.down && this.collision.isCollision(this.playerX, this.playerY + this.playerRunSpeed * this.game.clockTick, this.playerZ)) {
        //         this.move = 1;
        //         this.playerY += this.playerRunSpeed * this.game.clockTick;
        //     }

        //     this.run = true;
        //     this.hungerTime += 3 * this.game.clockTick;
        // } else {
        if (this.game.keys.left && this.collision.isCollision(this.playerX - (this.playerWalkSpeed * this.game.clockTick), this.playerY, this.playerZ)) {
            if (this.collision.state != 1) {
                this.move = 1;
                this.playerX -= this.playerWalkSpeed * this.game.clockTick;
                if (this.collision.state === 0) {
                    this.canMove = true;
                } else {
                    this.canMove = false;
                }
                this.spritesheet = ASSET_MANAGER.cache["./Art/Steve_Animations/Iso/player - Converted3.png"];
                this.width = 185;
                this.height = 329;
                this.walkingAnimations.spritesheet = this.spritesheet;
                this.runningAnimations.spritesheet = this.spritesheet;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
            } else {
                this.game.keys.left = false;
            }

        }
        if (this.game.keys.right && this.collision.isCollision(this.playerX + (this.playerWalkSpeed * this.game.clockTick), this.playerY, this.playerZ)) {
            if (this.collision.state != 1) {
                this.move = 1;
                this.playerX += this.playerWalkSpeed * this.game.clockTick;
                if (this.collision.state === 0) {
                    this.canMove = true;
                } else {
                    this.canMove = false;
                }
                this.spritesheet = ASSET_MANAGER.cache["./Art/Steve_Animations/Iso/player - Converted1.png"];
                this.width = 200;
                this.height = 356;
                this.walkingAnimations.spritesheet = this.spritesheet;
                this.runningAnimations.spritesheet = this.spritesheet;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
            } else {
                this.game.keys.left = false;
            }

        }
        if (this.game.keys.up && this.collision.isCollision(this.playerX, this.playerY - (this.playerWalkSpeed * this.game.clockTick), this.playerZ)) {
            if (this.collision.state != 1) {
                this.move = 1;
                this.playerY -= this.playerWalkSpeed * this.game.clockTick;
                if (this.collision.state === 0) {
                    this.canMove = true;
                } else {
                    this.canMove = false;
                }
                this.spritesheet = ASSET_MANAGER.cache["./Art/Steve_Animations/Iso/player - Converted2.png"];
                this.width = 186;
                this.height = 356;
                this.walkingAnimations.spritesheet = this.spritesheet;
                this.runningAnimations.spritesheet = this.spritesheet;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
            } else {
                this.game.keys.left = false;
            }

        }
        if (this.game.keys.down && this.collision.isCollision(this.playerX, this.playerY + (this.playerWalkSpeed * this.game.clockTick), this.playerZ)) {
            if (this.collision.state != 1) {
                this.move = 1;
                this.playerY += this.playerWalkSpeed * this.game.clockTick;
                if (this.collision.state === 0) {
                    this.canMove = true;
                } else {
                    this.canMove = false;
                }
                this.spritesheet = ASSET_MANAGER.cache["./Art/Steve_Animations/Iso/player - Converted.png"];
                this.width = 202;
                this.height = 384;
                this.walkingAnimations.spritesheet = this.spritesheet;
                this.runningAnimations.spritesheet = this.spritesheet;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
                this.walkingAnimations.width = this.width;
                this.runningAnimations.height = this.height;
            } else {
                this.game.keys.left = false;
            }

        }

        this.run = false;
        this.hungerTime += this.game.clockTick;


        if (!this.game.keys.left && !this.game.keys.right && !this.game.keys.up && !this.game.keys.down) {
            this.move = 0;
            console.log("this should be printing");
        }

        if (this.game.keys.space && !this.jumped && this.jumpDelay === 0) {
            console.log("steve jumped");
            this.jumped = true;
            this.jumpDelay = 30;
        }

        if (this.hunger >= 9 && this.health < 10 && this.elapsedTime > 1) {
            this.health += 0.5;
            this.elapsedTime = 0;
        }

        if (this.hungerTime > 20) {
            this.hunger -= 0.5;
            this.hungerTime = 0;
        }

        if (this.health <= 0) {
            this.health = 0;
            this.live = true;
        }
        if (this.hunger <= 0) {
            this.hunger = 0;
        }
        if (this.jumpDelay > 0) {
            this.jumpDelay--;
        }
        if (this.jumped) {
            this.playerZ += 0.1;
            this.jumpCount++;
            if (this.jumpCount >= 10) {
                this.jumped = false;
                this.jumpCount = 0;
            }
        }

        this.collision.isCollision(this.playerX, this.playerY, this.playerZ);
        if (this.collision.state === 0) {
        } else if (this.collision.state === -1 && !this.jumped) {
            this.playerZ -= 0.1;
        }




        this.elapsedTime += this.game.clockTick;

        //console.log("Steve: " + this.playerX + " " + this.playerY);
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
        offscreenCtx.drawImage(this.spritesheet, 0, 0, this.width, this.height, this.screenX
            , this.screenY, this.width * scale, this.height * scale);
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
        I made an boolean value "move". When keyboard is pressed, this.move = 1, otherwise, 0
        */
        if (this.move == 1) {
            /*
            If the player pressed key, we will call animator to animate the movement of a player.
            */
            if (this.run == true) {
                this.runningAnimations.drawFrameAngle(this.game.clockTick, ctx, this.screenX, this.screenY, this.scale, 0);
            } else {
                this.walkingAnimations.drawFrameAngle(this.game.clockTick, ctx, this.screenX, this.screenY, this.scale, 0);
            }

        } else {
            /*
            If the player is not moving, we will draw the image by calling drawAngle method.
            */
            this.drawAngle(ctx, 0, this.scale);
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