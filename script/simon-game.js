import { GameButton } from "./game-button.js";

const greenButton = new GameButton("green");
const redButton = new GameButton("red");
const yellowButton = new GameButton("yellow");
const blueButton = new GameButton("blue");

let currentLevel = 0;
let restartMessageTimeout = null;

let buttons = [greenButton, redButton, yellowButton, blueButton];
let buttonsSelectedRandomly = [];
let buttonsSelectedByPlayer = [];

$(document).on("keydown", function (e) {
    if ((e.key === "Enter") && (currentLevel === 0)) {
        nextSequence();
    }
})

$(document).on("touchstart", function (e) {
    if (currentLevel === 0) {
        nextSequence();
    }
})

playerButtonSelection();

function playerButtonSelection () {
    $("div.btn").each((index, btn) => {
        $(btn).on("click", () => {
            if (currentLevel === 0) return; 

            for (let i = 0; i < buttons.length; i++) {
                if ($(btn).attr("id") === buttons[i].getHtmlID()) {
                    let button = buttons[i];
                    button.buttonAnimation();
                    buttonsSelectedByPlayer.push(button.getHtmlID());

                    button.pressedByPlayerAnimation();

                    console.log(button.getHtmlID());
                    console.log(buttonsSelectedByPlayer);

                    if (!compareSelections()) {
                        resetGame();
                    }
                }
            }
        });
    });
}

function nextSequence() {
    if (restartMessageTimeout) {
        clearTimeout(restartMessageTimeout);
        restartMessageTimeout = null;
    }

    currentLevel++;
    $("h1").text(`Level ${currentLevel}`);
    selectRandomButton();
}

function success() {
    successSound();
    gameStateText("CORRECT!", "success");
}

function successSound() {
    let audio = new Audio("./sounds/success.mp3");
    audio.play();
}

function gameOver() {
    gameOverSound ();
    gameStateText("WRONG!", "game-over");
}

function gameStateText(text, cssClass) {
    $("body").addClass(cssClass);
        setTimeout(() => {
            $("body").removeClass(cssClass);
        }, 200);
    $("h1").html(text);
}

function gameOverSound() {
    let audio = new Audio("./sounds/wrong.mp3");
    audio.play();
}

function resetGame() {
    

    gameOver();
    let completedLevels = currentLevel - 1;
    currentLevel = 0
    buttonsSelectedRandomly = [];
    buttonsSelectedByPlayer = []
    ;
    restartMessageTimeout = setTimeout(() => {
        $("h1").html(`Press ENTER to Restart!<br><br>Completed Levels: ${completedLevels}`);    
    }, 1500);    

    
}

function compareSelections() {
    const index = buttonsSelectedByPlayer.length - 1;

    if (buttonsSelectedByPlayer[index] !== buttonsSelectedRandomly[index]) {
        return false;
    }

    if (buttonsSelectedByPlayer.length === buttonsSelectedRandomly.length) {
        success();
        buttonsSelectedByPlayer = [];
        setTimeout(() => {
            nextSequence();
        }, 1000);
    }

    return true;
}

function selectRandomButton() {
    let selectedButton = buttons[randomNumber()];          
    buttonsSelectedRandomly.push(selectedButton.getHtmlID()); 
    selectedButton.buttonAnimation();                          
    console.log(buttonsSelectedRandomly);    
}

function randomNumber() {
    return Math.floor(Math.random() * 4);
}