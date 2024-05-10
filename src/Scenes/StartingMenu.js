// StartingMenu.js

class SceneMainMenu extends Phaser.Scene {
  constructor() {
      super({ key: "SceneMainMenu" });
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.image("sprBtnPlay", "sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "sprBtnRestartDown.png");
    this.load.image('sprBg0', 'space1.gif');
    this.load.image('sprBg1', 'space2.gif');
    this.load.image('sprBg2', 'space3.gif');
    this.load.audio("sndBtnOver", "sndBtnOver.wav");
    this.load.audio("sndBtnDown", "sndBtnDown.wav");
  }

  create() {
    this.createStarfield(); // Create starfield first to ensure it's at the bottom

      this.sfx = {
          btnOver: this.sound.add("sndBtnOver"),
          btnDown: this.sound.add("sndBtnDown")
      };

      this.btnPlay = this.add.sprite(
          this.game.config.width * 0.5,
          this.game.config.height * 0.5,
          "sprBtnPlay"
      ).setInteractive();

      this.btnPlay.on("pointerover", () => {
          this.btnPlay.setTexture("sprBtnPlayHover");
          this.sfx.btnOver.play();
      });

      this.btnPlay.on("pointerout", () => {
          this.btnPlay.setTexture("sprBtnPlay");
      });

      this.btnPlay.on("pointerdown", () => {
          this.btnPlay.setTexture("sprBtnPlayDown");
          this.sfx.btnDown.play();
      });

      this.btnPlay.on("pointerup", () => {
          this.scene.start("D1");
      });

      this.title = this.add.text(this.game.config.width * 0.5, 200, "Cosmic Defenders", {
          fontFamily: 'monospace',
          fontSize: 45,
          fontStyle: 'bold',
          color: '#ffffff',
          align: 'center'
      }).setOrigin(0.5);
  }

  createStarfield() {
    this.starfieldBack = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg0').setOrigin(0, 0).setDepth(-2);
    this.starfieldMiddle = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg1').setOrigin(0, 0).setDepth(-1);
    this.starfieldFront = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg2').setOrigin(0, 0).setDepth(-3);
}
update() {
  this.updateStarfield();
}

updateStarfield() {
  this.starfieldBack.tilePositionY -= 0.5;
  this.starfieldMiddle.tilePositionY -= 0.7;
  this.starfieldFront.tilePositionY -= 1;
}
}
