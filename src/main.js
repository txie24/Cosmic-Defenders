// main.js
"use strict";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    width: 700,
    height: 1000,
    scene: [SceneMainMenu, D1], // SceneMainMenu is now the initial scene
    fps: {
        forceSetTimeOut: true,
        target: 120
    }
};

const game = new Phaser.Game(config);