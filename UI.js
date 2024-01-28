class UI {
    constructor(steve) {
        this.scale = 1;
        this.width = 163;
        this.height = 175; 
        this.spritesheet = null;  // Placeholder for the image
        this.steve = steve;
        this.scale = 0.15;
        this.screenX = 40;
        this.screenY = 40;

        this.loadAnimations();
    };

    loadAnimations() {
        this.spritesheet = new Image();
        this.spritesheet = ASSET_MANAGER.cache["./Art/Player/health.png"];
    };



    update() {

    };

    draw(ctx) {
        let health = this.steve.health;

        for(let i = 0; i < Math.floor(health); i++) {
            ctx.drawImage(this.spritesheet,0,0,this.width,this.height,this.screenX + i*this.width* this.scale,this.screenY,this.width * this.scale,this.height * this.scale);
        }

        if(health - Math.floor(health) >  0) {
            ctx.drawImage(this.spritesheet,this.width,0,this.width,this.height,this.screenX + Math.floor(health)*this.width* this.scale,this.screenY,this.width * this.scale,this.height * this.scale);
        }
   
        for(let i = 0; i < 10 - Math.ceil(health); i++) {
            ctx.drawImage(this.spritesheet,2*this.width,0,this.width,this.height,this.screenX + (Math.ceil(health) + i) *this.width* this.scale,this.screenY,this.width * this.scale,this.height * this.scale);
        }
    };
}