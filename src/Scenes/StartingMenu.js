// StartingMenu.js

class SceneMainMenu extends Phaser.Scene {
  constructor() {
      super({ key: "SceneMainMenu" });
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.image("sprBg0", "sprBg0.png");
    this.load.image("sprBg1", "sprBg1.png");
    this.load.image("sprBtnPlay", "sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "sprBtnRestartDown.png");
    this.load.audio("sndBtnOver", "sndBtnOver.wav");
    this.load.audio("sndBtnDown", "sndBtnDown.wav");
  }

  create() {
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
}
