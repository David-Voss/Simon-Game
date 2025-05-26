import { GameButton } from "./game-button.js";

export class SimonGame {
    constructor() {
        this.#setUpInitialGameValues();        
    }

    #setUpInitialGameValues() {
        this.#initGameButtons();
        this.#initClassVariables();
    }

    #initGameButtons() {
        this.buttons = [
            new GameButton("green"),
            new GameButton("red"),
            new GameButton("yellow"),
            new GameButton("blue")
        ];
    }

    #initClassVariables() {
        this.currentLevel = 0;
        this.restartMessageTimeout = null;

        this.randomSequence = [];
        this.playerInputSequence = [];
    }

    initGame() {
        this.#initEventListeners();
    }

    #initEventListeners() {
        this.#initKeyListener();
        this.#initTouchListener();
        this.#initClickListener();    
    }

    #initKeyListener() {
        $(document).on("keydown", (e) => {
            if (e.key === "Enter") {
                this.#startGameIfHasNotBeenStarted();
            }
        });
    }


    #initTouchListener() {
        $(document).on("touchstart", (e) => {
            this.#startGameIfHasNotBeenStarted();
        });
    }

    #startGameIfHasNotBeenStarted() {
        if (this.currentLevel === 0) {
            this.#nextSequence();
        }
    }

    #initClickListener() {
        $("div.btn").each((_, btn) => {
            $(btn).on("click", () => this.#handlePlayerClick(btn));
        });
    }

    #handlePlayerClick(btn) {        
        if (this.currentLevel === 0) { return; }
        
        const clickedId = $(btn).attr("id");
        const clickedButton = this.buttons.find(b => b.getHtmlID() === clickedId);

        if (!clickedButton) { return; }

        clickedButton.playerButtonInteraction();
        this.playerInputSequence.push(clickedId);

        if (!this.#compareSelections()) {
            this.#resetGame();
        }       
    }

    #compareSelections() {
        const index = this.playerInputSequence.length - 1;

        if (this.playerInputSequence[index] !== this.randomSequence[index]) {
            return false;
        }

        if (this.playerInputSequence.length === this.randomSequence.length) {        
            this.#gameState("./sounds/success.mp3", "CORRECT!", "success");
            this.playerInputSequence = [];
            this.#timeOut(this.#nextSequence.bind(this), 1000);
        }

        return true;
    }

    #resetGame() {
        this.#gameState("./sounds/wrong.mp3", "WRONG!", "game-over");
        const completedLevels = this.currentLevel - 1;
        this.#resetGameState();        

        this.restartMessageTimeout = this.#timeOut(() => {
           this.#changeText("h1", "html", 
                `Press ENTER to Restart!<br><br>
                Completed Levels: ${completedLevels}`)
        }, 1500);     
    }

    #resetGameState() {
        this.currentLevel = 0
        this.randomSequence = [];
        this.playerInputSequence = [];
    }

    #gameState(soundSrc, message, cssClass) {
        this.#playGameStateSound(soundSrc);
        this.#gameStateText(message, cssClass);
    }

    #playGameStateSound(src) {
        const audio = new Audio(src);
        audio.play();
    }

    #gameStateText(text, cssClass) {
        this.#toggleClassDelayed("body", cssClass, 200);
        this.#changeText("h1", "html", text);
    }

    #toggleClassDelayed(element, cssClass, time) {
        $(element).addClass(cssClass);
        this.#timeOut(() => $(element).removeClass(cssClass), time);
    }

    #nextSequence() {
        if (this.restartMessageTimeout) {
            clearTimeout(this.restartMessageTimeout);
            this.restartMessageTimeout = null;
        }

        this.currentLevel++;
        this.#changeText("h1", "text", `Level ${this.currentLevel}`);
        this.#selectRandomButton();
    }

    #selectRandomButton() {
        const selectedButton = this.buttons[this.#randomNumber()];          
        this.randomSequence.push(selectedButton.getHtmlID()); 
        selectedButton.buttonAnimation();  
    }

    #changeText(element, textOrHtml, inputText) {
        if (textOrHtml === "text") {
            $(element).text(inputText);
        } else {
            $(element).html(inputText);
        }        
    }

    #randomNumber() {
        return Math.floor(Math.random() * 4);
    }

    #timeOut(execution, time, ...args) {
        setTimeout(() => {
            execution(...args);
        }, time);
    }
}