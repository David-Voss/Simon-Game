
/**
 * Utility class providing general-purpose helper methods for the Simon Game.
 * Includes timing, text manipulation, sound playback, and visual feedback logic.
 */
export class GameUtils {

    // === RANDOM NUMBER GENERATION ===

    /**
     * Returns a random whole number between 0 and (multiplier - 1).
     * @param {number} multiplier - The upper bound for the random range.
     * @returns {number} A random integer.
     */
    static randomNumber(multiplier) {
        return Math.floor(Math.random() * multiplier);
    }


    // === TIMING & DELAYS ===

    /**
     * Executes a function after a given time delay.
     * @param {Function} execution - The function to be executed after the delay.
     * @param {number} time - Delay in milliseconds.
     * @param {...any} args - Arguments to be passed to the execution function.
     * @returns {number} The timeout ID (for potential cancellation).
     */
    static timeOut(execution, time, ...args) {
        return setTimeout(() => {
            execution(...args);
        }, time);
    }


    // === TEXT & DOM MANIPULATION ===

    /**
     * Changes the visible text content of a given element.
     * @param {string} element - The selector for the DOM element.
     * @param {string} inputText - The text to display.
     */
    static changeText(element, inputText) {
        $(element).text(inputText);        
    }

    /**
     * Replaces the inner HTML of a given element.
     * @param {string} element - The selector for the DOM element.
     * @param {string} inputText - The HTML string to inject.
     */
    static changeHtml(element, inputText) {        
        $(element).html(inputText);              
    }


    // === FEEDBACK DISPLAY (SOUND + VISUAL) ===

    /**
     * Displays user feedback via sound and styled message.
     * @param {string} soundSrc - The path to the audio file.
     * @param {string} message - The message to display.
     * @param {string} cssClass - A CSS class used for styling feedback.
     */
    static showFeedback(soundSrc, message, cssClass) {
        this.feedbackSound(soundSrc);
        this.feedbackText(message, cssClass);
    }

    /**
     * Plays a sound file from a given path.
     * @param {string} src - The path to the audio file.
     */
    static feedbackSound(src) {
        const audio = new Audio(src);
        audio.play();
    }

    /**
     * Displays a message with temporary CSS visual effect.
     * @param {string} text - The text or HTML message to show.
     * @param {string} cssClass - A CSS class used to style the feedback (e.g. "game-over").
     */
    static feedbackText(text, cssClass) {
        this.toggleClassDelayed("body", cssClass, 200);
        this.changeHtml("h1", text);
    }

    /**
     * Temporarily adds a CSS class to an element and removes it after a delay.
     * @param {string} element - The selector of the element to style.
     * @param {string} cssClass - The class to apply temporarily.
     * @param {number} time - Duration before removing the class (in ms).
     */
    static toggleClassDelayed(element, cssClass, time) {
        $(element).addClass(cssClass);
        this.timeOut(() => $(element).removeClass(cssClass), time);
    }
}