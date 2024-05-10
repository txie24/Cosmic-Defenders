// main.js
"use strict";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    width: 500,
    height: 800,
    scene: [SceneMainMenu, D1, SceneWin, SceneGameOver, ],
    fps: {
        forceSetTimeOut: true,
        target: 120
    }
};

const game = new Phaser.Game(config);