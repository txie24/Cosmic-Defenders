class D1 extends Phaser.Scene {
    constructor() {
        super("D1");
        this.playerSpeed = 300;
        this.bulletSpeed = -500;
        this.enemyBulletSpeed = 200;  // Speed of the enemy's bullets
        this.enemySpeed = 50;  
        this.avatar = null;
        this.bullets = null;
        this.enemyBullets = null; // Group for enemy bullets
        this.enemies = null;  
        this.keys = {};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('avatar', 'playerShip3_blue.png');
        this.load.image('bullet', 'laserBlue01.png');
        this.load.image('enemy', 'enemyBlack3.png');
        this.load.image('enemyBullet', 'laserRed05.png');
        document.getElementById('description').innerHTML = '<h2>Cosmic Defenders</h2>';
    }

    create() {
        this.avatar = this.add.sprite(350, 950, 'avatar');
        this.bullets = this.add.group();
        this.enemyBullets = this.add.group();
        this.enemies = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: 'enemy',
            repeat: 5,
            setXY: { x: 100, y: 100, stepX: 120, stepY: 100 }
        });

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

        // Player shooting
        if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            let bullet = this.bullets.create(this.avatar.x, this.avatar.y - this.avatar.height, 'bullet');
            bullet.setVelocityY(this.bulletSpeed);
        }

        // Update bullet positions and check for collisions
        this.bullets.children.iterate((bullet) => {
            if (bullet) {
                bullet.y += this.bulletSpeed * this.game.loop.delta / 1000;
                if (bullet.y < 0) {
                    bullet.destroy();
                } else {
                    // Check for collision with each enemy
                    this.enemies.children.iterate((enemy) => {
                        if (enemy && this.checkOverlap(bullet, enemy)) {
                            bullet.destroy();
                            enemy.destroy();
                        }
                    });
                }
            }
        });

        // Enemy shooting
        this.enemies.children.iterate((enemy) => {
            if (enemy) {
                enemy.y += this.enemySpeed * this.game.loop.delta / 1000;
                if (Math.random() < 0.01) { // Random chance for each enemy to shoot
                    let enemyBullet = this.enemyBullets.create(enemy.x, enemy.y + enemy.height / 2, 'enemyBullet');
                    enemyBullet.setVelocityY(this.enemyBulletSpeed);
                }
            }
        });

        // Update enemy bullet positions
        this.enemyBullets.children.iterate((enemyBullet) => {
            if (enemyBullet) {
                enemyBullet.y += this.enemyBulletSpeed * this.game.loop.delta / 1000;
                if (enemyBullet.y > this.sys.game.config.height) {
                    enemyBullet.destroy();
                }
            }
        });

        // Enemy movement
        this.enemies.children.iterate((enemy) => {
            if (enemy) {
                enemy.y += this.enemySpeed * this.game.loop.delta / 1000;
            }
        });
    }

    // Utility function to check overlap between two sprites
    checkOverlap(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
}
