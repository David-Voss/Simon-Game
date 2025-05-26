// === DEPENDENCIES ===

import { GameUtils } from "./game-utils.js";

/**
 * Represents a single interactive game button in the Simon Game.
 * Handles DOM reference, audio, animation, and visual feedback logic.
 */
export class GameButton {

    // === CLASS INITIALISATION ===

    /**
     * Constructs a GameButton instance for a specific colour.
     * @param {string} buttonColor - The colour/ID of the button (e.g. "green").
     */
    constructor(buttonColor) {
        this.#initButton(buttonColor);
    }

    /**
     * Initialises or updates the button's colour, DOM reference, and sound.
     * @param {string} buttonColor - The colour used to target the DOM element and build audio path.
     */
    #initButton(buttonColor) {
        this.buttonColor = buttonColor;
        this.domReference = $("div.btn#" + this.buttonColor);
        this.htmlId = this.domReference.attr("id");

        this.audioSrc = "./sounds/" + this.htmlId + ".mp3";
        this.buttonSound = new Audio(this.audioSrc); 
    }


    // === PUBLIC GETTERS ===

    getButtonColor() { return this.buttonColor; }
    getDomReference() { return this.domReference; }
    getHtmlId() { return this.htmlId; }
    getAudioSrc() { return this.audioSrc; }


    // === PUBLIC SETTER ===

    /**
     * Reinitialises the button with a new colour.
     * @param {string} newColor - The new button colour.
     */
    setButtonColor(newColor) { this.#initButton(newColor); }


    // === PLAYER INTERACTION ===

    /**
     * Handles full player interaction logic:
     * plays sound and triggers visual animations.
     */
    playerButtonInteraction() {
        this.buttonAnimation();
        this.#pressedByPlayerAnimation();
    }


    // === ANIMATION & SOUND ===
    
    /**
     * Triggers both the sound and flash animation for the button.
     */
    buttonAnimation() {
        this.#playButtonSound();
        this.#buttonActivationFlash();
    }

    /**
     * Plays the button's associated sound.
     */
    #playButtonSound() { this.buttonSound.play(); }

    /**
     * Creates a quick fade-out/fade-in visual flash.
     */
    #buttonActivationFlash() { this.domReference.fadeOut(100).fadeIn(100); }

    /**
     * Adds a brief "pressed" class for visual feedback on player input.
     */
    #pressedByPlayerAnimation() {
        GameUtils.toggleClassDelayed(this.getDomReference(), "pressed", 100);
    }    
}