class Item {
    constructor(game, steve, levelOneLocations, imagePaths) {
        this.game = game;
        this.steve = steve;
        this.itemSize = 0.8;
        this.levelOneLocations = levelOneLocations;
        this.imagePaths = imagePaths;
        this.itemLifeTime = 300000; // 5 minutes
        this.pickupRadius = 30*this.game.GameScale;

        this.items = []; // Array to hold multiple items

        // Properties for fancy vertical movement
        this.verticalMovement = 0;
        this.amplitude = 15;
        this.frequency = 0.04;

        // Properties for scaling effect
        this.morfSpeed = 0.03;
        this.minMorf = 0;
        this.maxMorf = 1;
        this.morf = Math.random() * this.maxMorf;
        this.morfingDown = true;
        this.gameScale = this.game.GameScale;
        this.jumpComplete = true;

        this.jumpFlag = false;
        this.picked = false;

        this.AddItem();
    }

    getImage() { // Gets A Random Picture
        let randomIndex = Math.floor(Math.random() * this.imagePaths.length);
        let selectedImagePath = this.imagePaths[randomIndex];
        return ASSET_MANAGER.cache[selectedImagePath];
    }

    AddItem() { // Gets A Random Location
        let randomIndex = Math.floor(Math.random() * this.levelOneLocations.length);
        let selected = this.levelOneLocations[randomIndex];
        let x = selected[0] * this.game.GameScale;
        let y = selected[1] * this.game.GameScale;

        let image = this.getImage();

        this.items.push({
            x: x,
            y: y,
            verticalTime: Math.random() * 10,
            pickedUp: false,
            morf: this.morf,
            morfingDown : this.morfingDown,
            image: image,
            creationTime: Date.now()
        });
    }

    update() {
        this.items.forEach(item => {
            const distance = this.calculateDistance(item.x, item.y, this.steve.playerX, this.steve.playerY);
            if (distance < this.pickupRadius) {
                this.animateItemTowardsSteve(item);
            }
            // Scaling effect for each item
            if (item.morfingDown) {
               if (item.morf > this.minMorf) {
                    item.morf -= this.morfSpeed;
               } else {
                    item.morfingDown = false;
               }
            } else {
                if (item.morf < this.maxMorf) {
                    item.morf += this.morfSpeed;
                } else {
                    item.morfingDown = true;
              }
            }
        });

        if(this.steve.jumped) {
            if(!this.jumpFlag) {
                this.jumpComplete = false;
                this.jumpFlag = true;
            }
           
            let x = [];
            let y = [];

            
            this.items.forEach(item => {   
                x.push(item.x / this.gameScale);
                y.push(item.y / this.gameScale);
            });


            if(this.gameScale > 3.6 && !this.jumpComplete) {
                this.items.forEach(item => {
                    item.itemSize -= this.game.clockTick * 0.1;
                });
                this.gameScale -= this.game.clockTick * 1.5; 
            } else {
                this.jumpComplete = true;
            }

            if(this.gameScale < 4 && this.jumpComplete) {
                this.items.forEach(item => {
                    item.itemSize += this.game.clockTick * 0.1;
                });
                this.gameScale += this.game.clockTick * 1.5; 
            }

            if(this.gameScale >= 4 && this.jumpComplete) {
                this.jumpFlag = false;
            }

            for(let i = 0; i < this.items.length; i++) {
                this.items[i].x = x[i] * this.gameScale;
                this.items[i].y = y[i] * this.gameScale;
            }
            console.log(this.gameScale);
        }


        // Remove items that have been picked up or expired
        this.items = this.items.filter(item => {
            const age = Date.now() - item.creationTime;
            return age < this.itemLifeTime && !item.pickedUp;
        });
    }

    draw(ctx) {
        this.items.forEach(item => {
            let image = item.image;
            if (!image) return;

            item.verticalTime += this.frequency;
            this.verticalMovement = Math.sin(item.verticalTime) * this.amplitude;

            let morfedWidth = image.width * this.itemSize * item.morf;
            let morfedHeight = image.height * this.itemSize;

            ctx.drawImage(image,
                item.x - this.game.camera.cameraX - morfedWidth / 2,
                item.y - this.game.camera.cameraY - morfedHeight / 2 + this.verticalMovement,
                morfedWidth,
                morfedHeight
            );
        });
    }

    animateItemTowardsSteve(item) {
        const moveSpeed = 50;

        item.x += (this.steve.playerX - item.x) / moveSpeed; // Move towards Steve X
        item.y += (this.steve.playerY - item.y) / moveSpeed; // Move towards Steve Y

        if (  Math.abs(this.steve.playerX - item.x) < 6*this.game.GameScale 
            && Math.abs(this.steve.playerY - item.y) < 6*this.game.GameScale ) {
            item.pickedUp = true; // Mark as picked up to remove it later
            this.picked = true;
       
          //  console.log("steve picked up item")
        //   console.log(this.steve.win);
        }
    }

    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    getX() {
        let x = this.items.map(item => item.x)[0]; 
        return x;
    }

    getY() {
        let y = this.items.map(item => item.y)[0]; 
        return y;
    }
}
