class Item {
    constructor(game, steve, levelOneLocations, imagePaths) {
        this.game = game;
        this.steve = steve;
        this.itemSize = 0.9;
        this.levelOneLocations = levelOneLocations;
        this.imagePaths = imagePaths;
        this.itemLifeTime = 300000; // 5 minutes
        //this.pickupRadius = 0;
        this.pickupRadius = 1 * this.game.GameScale;

        this.items = []; // Array to hold multiple items

        // Properties for fancy vertical movement
        this.verticalMovement = 0;
        this.amplitude = 15;
        this.frequency = 0.04;

        // Properties for scaling effect
        this.morfSpeed = 0.04;
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
        let x = selected[0];// * this.game.GameScale;
        let y = selected[1];// * this.game.GameScale;
        let z = selected[2];// * this.game.GameScale;


        let image = this.getImage();

        this.items.push({
            x: x,
            y: y,
            z: z,
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

        // if(this.steve.jumped) {
        //     if(!this.jumpFlag) {
        //         this.jumpComplete = false;
        //         this.jumpFlag = true;
        //     }
           
        //     let x = [];
        //     let y = [];

            
        //     this.items.forEach(item => {   
        //         x.push(item.x / this.gameScale);
        //         y.push(item.y / this.gameScale);
        //     });


        //     if(this.gameScale > 3.6 && !this.jumpComplete) {
        //         this.items.forEach(item => {
        //             item.itemSize -= this.game.clockTick * 0.1;
        //         });
        //         this.gameScale -= this.game.clockTick * 1.5; 
        //     } else {
        //         this.jumpComplete = true;
        //     }

        //     if(this.gameScale < 4 && this.jumpComplete) {
        //         this.items.forEach(item => {
        //             item.itemSize += this.game.clockTick * 0.1;
        //         });
        //         this.gameScale += this.game.clockTick * 1.5; 
        //     }

        //     if(this.gameScale >= 4 && this.jumpComplete) {
        //         this.jumpFlag = false;
        //     }

        //     for(let i = 0; i < this.items.length; i++) {
        //         this.items[i].x = x[i] * this.gameScale;
        //         this.items[i].y = y[i] * this.gameScale;
        //     }
            //console.log(this.gameScale);
        //}


        // Remove items that have been picked up or expired
        this.items = this.items.filter(item => {
            const age = Date.now() - item.creationTime;
            return !item.pickedUp;
            //return age < this.itemLifeTime && !item.pickedUp;
        });
    }

    draw(ctx) {
        this.items.forEach(item => {
            let blockWidth = this.game.camera.imageWidth * this.game.camera.sizeFactor;
            let blockHeight = this.game.camera.imageHeight * this.game.camera.sizeFactor;

            let isoX = ((item.x - item.y) * blockWidth) / 2 - this.game.camera.isoCameraX;
            let isoY = ((item.x + item.y) * blockHeight) / 4 - ((item.z - this.steve.playerZ) * blockWidth) / 2 
            - this.game.camera.isoCameraY + blockHeight / 2;

            //let isoX = 340;
            //let isoY = 340; 
            // Updating the verticalTime property of the item object
            item.verticalTime += this.frequency;
            this.verticalMovement = Math.sin(item.verticalTime) * this.amplitude;

            let morfedWidth = item.image.width * this.itemSize * item.morf;
            let morfedHeight = item.image.height * this.itemSize;
            // let morfedWidth = 0;
            // let morfedHeight = 0;

             // Log all the relevant values
            //console.log(`Item X: ${item.x}, Item Y: ${item.y}, Item Z: ${item.z}`);
            //console.log(`Calculated isoX: ${isoX}, Calculated isoY: ${isoY}`);
            //console.log("Height ",item.verticalMovement);
        
            ctx.drawImage(item.image, isoX - morfedWidth / 2, isoY - morfedHeight / 2 + this.verticalMovement, morfedWidth, morfedHeight);
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
