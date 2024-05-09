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
        this.score = 0;  // Initialize score
        this.scoreText = null;  // Text object for displaying score
        this.lives = 3;  // Player starts with 3 lives
        this.livesText = null;  // Text object for displaying lives
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
            repeat: 3,
            setXY: { x: 120, y: 100, stepX: 150, stepY: 100 }
        });

        // Initialize score and lives text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });

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
                            this.score += 10;  // Increase score
                            this.scoreText.setText('Score: ' + this.score);  // Update score text
                        }
                    });
                }
            }
        });

        // Enemy shooting and collision with player
        this.enemies.children.iterate((enemy) => {
            if (enemy) {
                enemy.y += this.enemySpeed * this.game.loop.delta / 1000;
                if (enemy.y >= this.sys.game.config.height) { // Enemy crosses the bottom screen
                    enemy.destroy();
                    this.lives--;  // Player loses a life
                    this.livesText.setText('Lives: ' + this.lives);
                }
                if (Math.random() < 0.01) { // Random chance for each enemy to shoot
                    let enemyBullet = this.enemyBullets.create(enemy.x, enemy.y + enemy.height / 2, 'enemyBullet');
                    enemyBullet.setVelocityY(this.enemyBulletSpeed);
                }
                if (this.checkOverlap(this.avatar, enemy)) { // Check if player collides with enemy
                    enemy.destroy();
                    this.lives--;  // Player loses a life
                    this.livesText.setText('Lives: ' + this.lives);
                }
            }
        });

        // Update enemy bullet positions and check for collision with player
        this.enemyBullets.children.iterate((enemyBullet) => {
            if (enemyBullet) {
                enemyBullet.y += this.enemyBulletSpeed * this.game.loop.delta / 1000;
                if (enemyBullet.y > this.sys.game.config.height) {
                    enemyBullet.destroy();
                }
                if (this.checkOverlap(this.avatar, enemyBullet)) { // Enemy bullet hits player
                    enemyBullet.destroy();
                    this.lives--;  // Player loses a life
                    this.livesText.setText('Lives: ' + this.lives);
                }
            }
        });

        // Game over check
        if (this.lives <= 0 && !this.isGameOver) {
            this.isGameOver = true;  // Set game over flag to true
                this.scene.restart();  // Restart the scene after a delay
        }
    }

    // Utility function to check overlap between two sprites
    checkOverlap(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
}
