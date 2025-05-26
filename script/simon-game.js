// === DEPENDENCIES ===

import { GameUtils } from "./game-utils.js";
import { GameButton } from "./game-button.js";


/**
 * The core logic class for the Simon Game.
 * 
 * Manages game flow, button interactions, level progression and input handling.
 * Designed to be initialised and then started via `initGame()`.
 */
export class SimonGame {

    // === CLASS INITIALISATION ===

    /**
     * Creates a new Simon Game instance and prepares internal state.
     */
    constructor() {
        this.#setUpInitialGameValues();        
    }

    /**
     * Public initialisation method. Binds all required input listeners.
     */
    initGame() {
        this.#initEventListeners();
    }


    // === SETUP METHODS ===

    /**
     * Sets up the game state and button references.
     */
    #setUpInitialGameValues() {
        this.#initGameButtons();
        this.#initClassVariables();
    }

    /**
     * Initialises core game variables.
     */
    #initClassVariables() {
        this.currentLevel = 0;
        this.restartMessageTimeout = null;
        this.randomSequence = [];
        this.playerInputSequence = [];
        this.isInputLocked = false; // prevents rapid/multiple input before sequence ends
    }

    /**
     * Instantiates and stores button references.
     */
    #initGameButtons() {
        this.buttons = [
            new GameButton("green"),
            new GameButton("red"),
            new GameButton("yellow"),
            new GameButton("blue")
        ];
    } 
    

    // === EVENT LISTENER REGISTRATION ===

    /**
     * Binds all input events: key, touch and mouse.
     */
    #initEventListeners() {
        this.#initKeyListener();
        this.#initTouchListener();
        this.#initClickListener();    
    }

    /**
     * Listens for 'Enter' key to start or restart the game.
     */
    #initKeyListener() {
        $(document).on("keydown", (e) => {
            if (e.key === "Enter") {
                this.#startGameIfHasNotBeenStarted();
            }
        });
    }


    /**
     * Listens for any touch to start the game (useful for mobile).
     */
    #initTouchListener() {
        $(document).on("touchstart", (e) => {
            this.#startGameIfHasNotBeenStarted();
        });
    }

    /**
     * Adds click handlers to each game button.
     */
    #initClickListener() {
        $("div.btn").each((_, btn) => {
            $(btn).on("click", () => this.#handlePlayerClick(btn));
        });
    }


    // === GAME FLOW CONTROL ===

    /**
     * Starts the game sequence if in reset state.
     * Also clears any pending restart timeout.
     */
    #startGameIfHasNotBeenStarted() {
        if (this.restartMessageTimeout) {
            clearTimeout(this.restartMessageTimeout);
            this.restartMessageTimeout = null;
        }

        if (this.currentLevel === 0) {
            this.#nextSequence();
        }
    }


    // === PLAYER INTERACTION ===

    /**
     * Handles the player's button input, comparing it to the generated sequence.
     * If incorrect, triggers game over.
     * 
     * @param {HTMLElement} btn - The clicked button element
     */
    #handlePlayerClick(btn) {        
        if (this.currentLevel === 0 || this.isInputLocked) { return; }
        
        const clickedId = $(btn).attr("id");
        const clickedButton = this.buttons.find(b => b.getHtmlId() === clickedId);

        if (!clickedButton) { return; }

        clickedButton.playerButtonInteraction();
        this.playerInputSequence.push(clickedId);

        if (!this.#compareSelections()) {
            this.#resetGame();
        }       
    }

    /**
     * Compares the player's input to the expected sequence.
     * Triggers next sequence if completed correctly.
     * 
     * @returns {boolean} Whether the current input is still correct.
     */
    #compareSelections() {
        const index = this.playerInputSequence.length - 1;

        if (this.playerInputSequence[index] !== this.randomSequence[index]) {
            return false;
        }

        if (this.playerInputSequence.length === this.randomSequence.length) {        
            GameUtils.showFeedback("./sounds/success.mp3", "CORRECT!", "success");
            this.playerInputSequence = [];
            this.isInputLocked = true;
            GameUtils.timeOut(() => {
                this.isInputLocked = false;
                this.#nextSequence();
            }, 1000);
        }

        return true;
    }    

    /**
     * Starts a new round by increasing level and adding a new random button to the sequence.
     */
    #nextSequence() {
        if (this.restartMessageTimeout) {
            clearTimeout(this.restartMessageTimeout);
            this.restartMessageTimeout = null;
        }

        this.currentLevel++;
        GameUtils.changeText("h1", `Level ${this.currentLevel}`);
        this.#selectRandomButton();
    }

    /**
     * Appends a new randomly selected button to the expected sequence.
     */
    #selectRandomButton() {
        const selectedButton = this.buttons[GameUtils.randomNumber(4)];          
        this.randomSequence.push(selectedButton.getHtmlId()); 
        selectedButton.buttonAnimation();  
    }


    // === GAME STATE & RESET ===

    /**
     * Resets the game to initial state after incorrect input.
     * Displays restart message after short delay.
     */
    #resetGame() {
        GameUtils.showFeedback("./sounds/wrong.mp3", "WRONG!", "game-over");
        const completedLevels = this.currentLevel - 1;
        this.#resetGameState();        

        this.restartMessageTimeout = GameUtils.timeOut(() => {
           GameUtils.changeHtml("h1", 
                `Press ENTER to Restart!<br><br>
                Completed Levels: ${completedLevels}`)
        }, 1500);     
    }

    /**
     * Clears core game data for a fresh start.
     */
    #resetGameState() {
        this.currentLevel = 0
        this.randomSequence = [];
        this.playerInputSequence = [];
    }
}