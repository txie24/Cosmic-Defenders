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
    );
    this.btnPlay.setScale(1);
    this.btnPlay.setInteractive();

    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnPlay.on("pointerout", function() {
      this.setTexture("sprBtnPlay");
    });

    this.btnPlay.on("pointerdown", function() {
      this.btnPlay.setTexture("sprBtnPlayDown");
      this.sfx.btnDown.play();
    }, this);

    this.btnPlay.on("pointerup", function() {
      this.btnPlay.setTexture("sprBtnPlay");
      this.scene.start("D1");
    }, this);

    this.title = this.add.text(this.game.config.width * 0.5, 200, "Cosmic Defenders", {
      fontFamily: 'monospace',
      fontSize: 45,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var keys = ["sprBg0", "sprBg1"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
  }

  update() {
    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}

