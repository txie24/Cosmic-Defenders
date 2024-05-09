// main.js
"use strict";

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    scene: [D1], // Replace 'Monster' with 'D1' to reference your scene
    fps: {
        forceSetTimeOut: true,
        target: 120
    }
};

const game = new Phaser.Game(config);
