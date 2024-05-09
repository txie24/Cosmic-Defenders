// main.js
"use strict";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true 
    },
    width: 700,
    height: 1000,
    scene: [D1], 
    fps: {
        forceSetTimeOut: true,
        target: 120
    }
};

const game = new Phaser.Game(config);
