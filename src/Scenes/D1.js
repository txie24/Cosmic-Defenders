class D1 extends Phaser.Scene {
    constructor() {
        super("D1");
        this.playerSpeed = 150;  // Speed of the player avatar
        this.bulletSpeed = -300; // Speed of the emitted bullet
        this.avatar = null;
        this.bullets = null;
        this.keys = {};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('avatar', 'playerShip3_blue.png');
        this.load.image('bullet', 'laserBlue01.png');
        document.getElementById('description').innerHTML = '<h2>Cosmic Defenders</h2>'

    }

    create() {
        this.avatar = this.add.sprite(400, 550, 'avatar');
        this.bullets = this.add.group();

        // Define keys
        this.keys.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Player movement
        if (this.keys.left.isDown && this.avatar.x > this.avatar.width * 0.5) {
            this.avatar.x -= this.playerSpeed * this.game.loop.delta / 1000;
        } else if (this.keys.right.isDown && this.avatar.x < this.sys.game.config.width - this.avatar.width * 0.5) {
            this.avatar.x += this.playerSpeed * this.game.loop.delta / 1000;
        }
    
        // Shooting
        if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            let bullet = this.bullets.create(this.avatar.x, this.avatar.y - this.avatar.height, 'bullet');
            bullet.setVelocityY(this.bulletSpeed);
        }
    
        // Update bullet positions
        this.bullets.children.iterate((bullet) => {
            if (bullet) {
                // Subtract from the bullet's y value to make it move upwards
                bullet.y += this.bulletSpeed * this.game.loop.delta / 1000;
    
                // Remove the bullet if it goes off-screen
                if (bullet.y < 0) {
                    bullet.destroy();
                }
            }
        });
    }
    
}
