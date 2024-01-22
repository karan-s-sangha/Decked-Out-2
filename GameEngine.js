// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
        this.ctx = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.mouse = null;
        this.left = false;
        
        this.right = false;
        this.up = false;
        this.down = false;
        this.A = false;
        this.B = false;
        this.gamepad = null;
        this.scale = 4;
        this.camreaWorldTopLeftX = 0;
        this.camreaWorldTopLeftY = 0;
    };

    init(ctx) { // called after page has loaded
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
    
    
        const gameLoop = () => {
            this.loop();
        };
    
        setInterval(gameLoop); // 60 frames per second (adjust the interval as needed)
    }
    
    

    startInput() {
        this.keyboardActive = false;
        var that = this;

        var getXandY = function (e) {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return { x: x, y: y, radius: 0 };
        }
        function mouseListener (e) {
            that.mouse = getXandY(e);
        }
        function mouseClickListener (e) {
            that.click = getXandY(e);
        }
        function wheelListener (e) {
            e.preventDefault(); // Prevent Scrolling
            that.wheel = e.deltaY;
        }
        function keydownListener (e) {
            console.log("Key pressed:", e.code); // Debugging lo
            that.keyboardActive = true;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = true;
                    break;
                case "KeyZ":
                case "Comma":
                    that.B = true;
                    break;
                case "KeyX":
                case "Period":
                    that.A = true;
                    break;
            }
        }
        function keyUpListener (e) {
            that.keyboardActive = false;
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = false;
                    break;
                case "KeyZ":
                case "Comma":
                    that.B = false;
                    break;
                case "KeyX":
                case "Period":
                    that.A = false;
                    break;
            }
        }

        that.mousemove = mouseListener;
        that.leftclick = mouseClickListener;
        that.wheelscroll = wheelListener;
        that.keydown = keydownListener;
        that.keyup = keyUpListener;

        this.ctx.canvas.addEventListener("mousemove", that.mousemove, false);

        this.ctx.canvas.addEventListener("click", that.leftclick, false);

        this.ctx.canvas.addEventListener("wheel", that.wheelscroll, false);

        this.ctx.canvas.addEventListener("keydown", that.keydown, false);

        this.ctx.canvas.addEventListener("keyup", that.keyup, false);
    };

    disableInput() {
        var that = this;
        that.ctx.canvas.removeEventListener("mousemove", that.mousemove);
        that.ctx.canvas.removeEventListener("click", that.leftclick);
        that.ctx.canvas.removeEventListener("wheel", that.wheelscroll);
        that.ctx.canvas.removeEventListener("keyup", that.keyup);
        that.ctx.canvas.removeEventListener("keydown", that.keydown);

        that.left = false;
        that.right = false;
        that.up = false;
        that.down = false;
        that.A = false;
        that.B = false;
    }

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
        this.camera.draw(this.ctx);
    };

    update() {
        var entitiesCount = this.entities.length;   
        
        // if(this.right && !this.Collision.isCollision(this.x, this.y)){
        //     this.x -=8;
        //     console.log(this.Collision.isCollision(this.x, this.y));
        // }
        // if (this.left && !this.Collision.isCollision(this.x, this.y)) {
        //     this.x += 8;
        // }
        // if(this.up && !this.Collision.isCollision(this.x, this.y)){
        //     this.y +=8;
        // }
        // if(this.down && !this.Collision.isCollision(this.x, this.y)){
        //     this.y -=8;
        // }
        // if(this.right){
        //     this.x -=8;
        //     //console.log(this.Collision.isCollision(this.x, this.y));
        // }
        // if (this.left) {
        //     this.x += 8;
        // }
        // if(this.up ){
        //     this.y +=8;
        // }
        // if(this.down){
        //     this.y -=8;
        // }       
      

        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];
            //console.log("Updating entity type:", entity.constructor.name);
            if (!entity.removeFromWorld) {
                entity.update();
                //console.log(this.x + " calling from game class" + this.y);
            }
        }

        this.camera.update();
       
        
        // for (var i = this.entities.length - 1; i >= 0; --i) {
        //     if (this.entities[i].removeFromWorld) {
        //         this.entities.splice(i, 1);
        //     }
        // }
        this.wheel = 0;
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();

        this.click = null;
           
    };
};