export class GameButton {
    constructor(buttonColor) {
        this.#initButton(buttonColor);
    }

    getButtonColor() { return this.buttonColor; }
    getHtmlAddress() { return this.htmlAddress; }
    getHtmlID() { return this.htmlID; }
    getAudioSrc() { return this.audioSrc; }

    setButtonColor(newColor) { this.#initButton(newColor); }

    buttonAnimation() {
        this.playButtonSound();
        this.buttonActivationFlash();
    }

    playButtonSound() { this.buttonSound.play(); }
    buttonActivationFlash() { this.htmlAddress.fadeOut(100).fadeIn(100); }

    pressedByPlayerAnimation() {
        this.getHtmlAddress().addClass("pressed");
        setTimeout(() => {
            this.getHtmlAddress().removeClass("pressed");
        }, 100);
    }

    #initButton(buttonColor) {
        this.buttonColor = buttonColor;
        this.htmlAddress = $("div.btn#" + this.buttonColor);
        this.htmlID = this.htmlAddress.attr("id");

        this.audioSrc = "./sounds/" + this.htmlID + ".mp3";
        this.buttonSound = new Audio(this.audioSrc); 
    }
}