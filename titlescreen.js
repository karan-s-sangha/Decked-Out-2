class TitleScreen {
    constructor() {
        this.container = document.createElement("div");
        this.container.classList.add("title-screen");

        this.titleElement = document.createElement("h1");
        this.titleElement.textContent = "Minecraft Adventure";
        this.container.appendChild(this.titleElement);

        this.playButton = document.createElement("button");
        this.playButton.textContent = "Play";
        this.playButton.classList.add("play-button");
        this.playButton.addEventListener("click", () => {
            this.playButtonClicked();
        });
        this.container.appendChild(this.playButton);

        document.body.appendChild(this.container);
    }

    playButtonClicked() {
        this.container.style.display = "none"; // Hide the title screen after clicking Play
        // Perform actions when the button is clicked, such as navigating to the game frontend
    }
}

// CSS styles for the Minecraft-themed title screen
const titleScreenStyles = `
    .title-screen {
        font-family: Arial, sans-serif;
        background-color: #4a76a8; /* Minecraft blue */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        padding: 0;
    }

    .title-screen h1 {
        color: #fff;
        margin-bottom: 20px;
    }

    .play-button {
        padding: 10px 20px;
        font-size: 20px;
        background-color: #6a9d43; /* Minecraft green */
        border: none;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .play-button:hover {
        background-color: #5b7f37; /* Darker green on hover */
    }
`;

// Append the CSS styles to the head of the document
const styleElement = document.createElement("style");
styleElement.textContent = titleScreenStyles;
document.head.appendChild(styleElement);

// Create an instance of TitleScreen
const titleScreen = new TitleScreen();
