//main.js
"use strict";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    width: 500,
    height: 800,
    scene: [SceneMainMenu, D1, SceneWin, SceneGameOver],
    fps: {
        forceSetTimeOut: true,
        target: 120
    },
    audio: {
        disableWebAudio: true
    }
};

const game = new Phaser.Game(config);
let backgroundMusic;

// When the game is ready, load and play music
window.onload = () => {
    game.events.on('ready', function () {
        game.sound.on('unlocked', function () {
            // Ensure sound is unlocked (user interacted with the page)
            if (!backgroundMusic) {
                backgroundMusic = game.sound.add('bgMusic', { volume: 0.5, loop: true });
                backgroundMusic.play();
            }
        });
    });
};
