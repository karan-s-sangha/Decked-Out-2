class FrontEnd {
    constructor(game, sceneManager) {
        this.game = game;
        this.sceneManager = sceneManager;

        this.isInMenu = true; // The game starts in the main menu.
        this.isInCredits = false; // Only true when viewing the credits screen.
        this.isShowInstructions = false; // Only true when viewing the instructions screen.

        // Setup buttons with dimensions and positions
        this.setupButtons();
    }

    setupButtons() {
        this.menuButtonDimensions = { w: 150, h: 50 };
        const canvasCenterX = this.game.ctx.canvas.width / 2 - this.menuButtonDimensions.w / 2;
        const canvasCenterY = this.game.ctx.canvas.height / 3;
        

        this.buttons = {
            startButton: {
                x: canvasCenterX,
                y: canvasCenterY - 60,
                ...this.menuButtonDimensions,
                text: "Start Game",
                color: 'red',
                action: this.startGame.bind(this)
            },
            instructionsButton: {
                x: canvasCenterX,
                y: canvasCenterY,
                ...this.menuButtonDimensions,
                text: "Instructions",
                color: '#7CFC00',
                action: () => this.showInstructionsScreen()
            },
            creditsButton: {
                x: canvasCenterX,
                y: canvasCenterY + 60,
                ...this.menuButtonDimensions,
                text: "Credits",
                color: 'rgba(255, 165, 0, 0.5)',
                action: () => this.showCreditsScreen()
            },
            backButton: {
                x: 20,
                y: this.game.ctx.canvas.height - 70,
                ...this.menuButtonDimensions,
                text: "Back",
                color: 'rgba(255, 165, 0, 0.5)',
             
                action: () => this.goBack()
            }
        };
    }

    startGame() {
        this.isInMenu = false;
        this.sceneManager.gameOver = false;
        this.sceneManager.loadScene("levelOne", true);
    }

    showInstructionsScreen() {
        this.isInMenu = false;
        this.isShowInstructions = true;
        this.isInCredits = false;
    }

    showCreditsScreen() {
        this.isInMenu = false;
        this.isInCredits = true;
        this.isShowInstructions = false;
    }

    goBack() {
        this.isInMenu = true;
        this.isInCredits = false;
        this.isShowInstructions = false;
    }

    update() {
        // Store the original colors of all buttons
        const originalButtonColors = {};
        Object.keys(this.buttons).forEach(key => {
    originalButtonColors[key] = this.buttons[key].color;
        });
        // Loop through each button to check for mouseover and click events
        Object.values(this.buttons).forEach(button => {
            // Check if the mouse is over the button
            button.color = this.mouseOver(this.game.mouse, button) ? 'gold' : originalButtonColors[button];
            
            // If there's a click, and it's on the button
            if (this.game.click && this.mouseOver(this.game.click, button)) {
                button.action(); // Execute the button's action
                this.game.click = null; // Reset click to avoid repeated clicks
            }
        });
    }
    


    mouseOver(mousePos, button) {
        return mousePos.x >= button.x && mousePos.x <= (button.x + button.w) &&
               mousePos.y >= button.y && mousePos.y <= (button.y + button.h);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        ctx.fillStyle = 'white'; 
        ctx.fillRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height); // Fill the entire canvas
    
        if (this.isInMenu) {
            // Draw menu buttons except the back button
            Object.values(this.buttons).forEach(button => {
                if (button.text !== "Back") this.drawButton(ctx, button);
                
            });
        } else if (this.isShowInstructions || this.isInCredits) {
            
            this.drawButton(ctx, this.buttons.backButton);

            if (this.isInCredits) {
                // Draw the credits text
                this.drawCredits(ctx);
            } else if (this.isShowInstructions){
                this.drawInstruction(ctx);
            }
        }
    }

    drawButton(ctx, button) {
        ctx.fillStyle = '#3B92E4';
        ctx.fillRect(button.x, button.y, button.w, button.h);
        ctx.font = "20px cursive";
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(button.text, button.x + button.w / 2, button.y + button.h / 2);
    }

    drawCredits(ctx) {
        const lines = [
            { text: "Credits", style: "bolder 40px 'Press Start 2P'" },
            { text: "Game Developed by", style: "30px 'Press Start 2P'" },
            { text: "Karan Sangha", style: "25px 'Press Start 2P'" },
            { text: "Ingeun Hwang", style: "25px 'Press Start 2P'" },
            { text: "Khin Win", style: "25px 'Press Start 2P'" }
        ];
    
        const colors = ['#3494E6', '#4291E2', '#508EDD', '#5E8BD9', '#6D88D4', '#7B85D0',
        '#8982CC', '#9780C7', '#A57DC3', '#B37ABF', '#C277BA', '#D074B6', '#DE71B1', '#EC6EAD'];
    
        let startX = this.game.ctx.canvas.width / 2;
        let startY = this.game.ctx.canvas.height / 2 - 60;
    
        // Draw each line with the multicolored effect
        for (let line of lines) {
            this.drawMulticoloredText(ctx, line.text, startX, startY, line.style, colors);
            startY += 70; // Increment Y position for the next line
        }
    }

    drawInstruction(ctx) {
        const lines = [
            { text: "Instructions", style: "bolder 60px cursive" },
            { text: "", style: "bolder 40px cursive" },
            { text: "* WSAD to move around the Map", style: "25px cursive" },
            { text: "* Follow the Arrow to the Artifact", style: "25px cursive" },
            { text: "* Space to Jump", style: "25px cursive" },
            { text: "* Shift + WSAD to move faster", style: "25px cursive" },
            { text: "* Use Cursor to rotate Steve", style: "25px cursive" },
            {text:  "", style: "bolder 40px cursive" },
            { text: " BE CAREFUL OF RAVAGERS!!", style: "bolder 30px 'Press Start 2P' italic" }, // Adjusted size for fitting
        ];
    
        const colors = ['#3494E6', '#4291E2', '#508EDD', '#5E8BD9', '#6D88D4', '#7B85D0', '#8982CC', '#9780C7', '#A57DC3', '#B37ABF', '#C277BA', '#D074B6', '#DE71B1', '#EC6EAD'];
    
        let startX = this.game.ctx.canvas.width / 2;
        let startY = this.game.ctx.canvas.height / 2 - 200 ;
    
        // Draw each line with the multicolored effect
        for (let line of lines) {
            this.drawMulticoloredText(ctx, line.text, startX, startY, line.style, colors);
            startY += 50; // Adjusted spacing for better fit
        }
    }
    

    drawMulticoloredText(ctx, text, startX, startY, font, colors) {
        let offsetX = 0;
        ctx.font = font; // Use the font passed as a parameter
    
        for (let i = 0; i < text.length; i++) {
            ctx.fillStyle = colors[i % colors.length]; // Cycle through colors
            let letter = text[i];
            ctx.fillText(letter, startX + offsetX - (ctx.measureText(text).width / 2), startY);
    
            // Adjust offsetX by measuring the width of the letter just drawn
            offsetX += ctx.measureText(letter).width;
        }
    }
    
    
    
    
}
