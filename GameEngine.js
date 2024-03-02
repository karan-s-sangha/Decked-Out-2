class GameEngine {
    constructor() {
        this.entities = [];
        this.ctx = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.mouse = { x: 0, y: 0 };
        this.click = null;
        this.wheel = 0;
        this.keys = { left: false, right: false, up: false, down: false, A: false, B: false, shift: false, space: false, ctrl: false };
        this.gamepad = null;
        this.GameScale = 4;
        this.fps = 120;
        this.running = false;
        this.transition = null;


        this.play = false;
    };

    init(ctx) {
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
            if (this.running) {
                requestAnimationFrame(gameLoop);
            }
        };
    
        requestAnimationFrame(gameLoop);
    };
    
    startInput() {
       // this.keyboardActive = false;
       var that = this;
        const getXandY = (e) => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", e => this.mouse = getXandY(e), false);
        this.ctx.canvas.addEventListener("click", e => this.click = getXandY(e), false);
        this.ctx.canvas.addEventListener("wheel", e => {
            e.preventDefault();
            this.wheel = e.deltaY;
        }, false);

        const handleKeyboard = (e, isKeyDown) => {
            
            e.preventDefault();

            const keyMap = {
                "ArrowLeft": 'left', "KeyA": 'left',
                "ArrowRight": 'right', "KeyD": 'right',
                "ArrowUp": 'up', "KeyW": 'up',
                "ArrowDown": 'down', "KeyS": 'down',
                "KeyZ": 'B', "Comma": 'B',
                "KeyX": 'A', "Period": 'A',
                "ShiftLeft": 'shift',
                "Space": 'space',
                "ControlLeft": 'ctrl',
                "KeyM": 'menu', // Add this line for M key
                "KeyR": 'restart' // Add this line for R key"
            };

            const keyAction = keyMap[e.code];
            if (keyAction) {
                this.keys[keyAction] = isKeyDown;
            }
        };

        this.ctx.canvas.addEventListener("keydown", e => handleKeyboard(e, true), false);
        this.ctx.canvas.addEventListener("keyup", e => handleKeyboard(e, false), false);
    };

    disableInput() {
        this.ctx.canvas.removeEventListener("mousemove", this.mousemove);
        this.ctx.canvas.removeEventListener("click", this.leftclick);
        this.ctx.canvas.removeEventListener("wheel", this.wheelscroll);
        this.ctx.canvas.removeEventListener("keyup", this.keyup);
        this.ctx.canvas.removeEventListener("keydown", this.keydown);

        Object.keys(this.keys).forEach(key => this.keys[key] = false);
    }

    addEntity(entity) {
        this.entities.push(entity);
    };

    getLastClick() {
        const click = this.click;
        this.click = null; // Reset click after it's been retrieved
        return click;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        if (this.transition) {
            this.transition.draw(this.ctx);
        }
        this.timer.draw(this.ctx);

        if(this.play == true) {
            this.camera.draw(this.ctx);
            for (let i = 0; i < this.entities.length; i++) {
                this.entities[i].draw(this.ctx);
            }
        } else if (this.play == false && this.camera.steve.live == false) {
            this.screen.draw(this.ctx);   
        } else {
            this.screen.draw(this.ctx);
        }
         
    };

    update() {
        if (this.transition) {
            this.transition.update(); 
            return; 
        }
        
        // for (var i = this.entities.length - 1; i >= 0; --i) {
        //     if (this.entities[i].removeFromWorld) {
        //         this.entities.splice(i, 1);
        //     }
        // }
        if(this.play == true) {
            
            for (let i = 0; i < this.entities.length; i++) {
                let entity = this.entities[i];
                if (!entity.removeFromWorld) {
                    entity.update();   
                }
            }
            this.camera.update();
        } else {
            this.screen.update();
        }
        this.wheel = 0;
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();           
    };
};