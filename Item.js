class Item {
    constructor(game, levelOneLocations, imagePaths) {
        this.itemX = 0;
        this.itemY = 0;
        this.game = game;
        this.itemScale = 0.8;
        this.levelOneLocations = levelOneLocations;
        this.imagePaths = imagePaths;

        // Properties for fancy vertical movement
        this.verticalMovement = 0;
        this.time = Math.random() * 10;
        this.amplitude = 15;
        this.frequency = 0.02;

        // Properties for scaling effect
        this.scaleSpeed = 0.01;
        this.minScale = 0;
        this.maxScale = 1;
        this.scale = Math.random() * this.maxScale;
        this.scalingDown = true;

        this.getRandomItem();
        this.getRandomLocation();
    }

    getRandomItem() {
        let randomIndex = Math.floor(Math.random() * this.imagePaths.length);
        let selectedImagePath = this.imagePaths[randomIndex];
        this.image = ASSET_MANAGER.cache[selectedImagePath];
    }

    getRandomLocation() {
        let randomIndex = Math.floor(Math.random() * this.levelOneLocations.length);
        let selected = this.levelOneLocations[randomIndex];
        this.itemX = selected[0];
        this.itemY = selected[1];
    }

    update() {
        this.time += this.frequency;
        this.verticalMovement = Math.sin(this.time) * this.amplitude;

        if (this.scalingDown) {
            if (this.scale > this.minScale) {
                this.scale -= this.scaleSpeed;
            } else {
                this.scalingDown = false;
            }
        } else {
            if (this.scale < this.maxScale) {
                this.scale += this.scaleSpeed;
            } else {
                this.scalingDown = true;
            }
        }
    }

    draw(ctx) {
        if (!this.image) return;

        var scaledWidth = this.image.width * this.scale;
        var scaledHeight = this.image.height;

        ctx.drawImage(this.image,
            this.itemX * this.game.GameScale - this.game.camera.cameraX - scaledWidth / 2,
            this.itemY * this.game.GameScale - this.game.camera.cameraY - scaledHeight / 2 + this.verticalMovement,
            scaledWidth * this.itemScale,
            scaledHeight * this.itemScale
        );
    }

    getX() {
        return this.itemX;
    }

    getY() {
        return this.itemY;
    }
}

// class Gold extends Item {
//     constructor(game) {
//         super(game, [
//             [678, 1778], [332, 1700], [172, 1452], [230, 1215], [260, 894],
//             [352, 578], [254, 332], [196, 170], [761, 1620], [426, 1030],
//             [438, 932], [970, 1420], [836, 1251], [1130, 1166], [1206, 844],
//             [1070, 530], [788, 512]
//         ], [
//             "./Art/Currency/Coin.png",
//             "./Art/Currency/Crown.png",
//         ], 0.8);
//     }
// }

// class FrostEmbers extends Item {
//     constructor(game) {
//         super(game, [
//             [669, 1776], [318, 1700], [168, 1466], [228, 1204], [270, 880],
//             [334, 572], [262, 340], [208, 162], [759, 1636], [435, 1032],
//             [446, 938], [980, 1430], [830, 1260], [1138, 1168], [1212, 850],
//             [1080, 536], [792, 526]
//         ], [
//             "./Art/Currency/Frost-Ember.png",
//         ], 0.8);
//     }
// }