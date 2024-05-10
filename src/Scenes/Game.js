class D1 extends Phaser.Scene {
    constructor() {
        super("D1");
        // Initialize variables
        this.playerSpeed = 300;
        this.bulletSpeed = -500;
        this.enemyBulletSpeed = 200;
        this.enemySpeed = 50;
        this.avatar = null;
        this.bullets = null;
        this.enemyBullets = null;
        this.enemies = null;
        this.keys = {};
        this.score = 0;
        this.scoreText = null;
        this.lives = 3;
        this.livesText = null;
        this.isGameOver = false; // Flag to track game over state
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
        this.initializeGame();
    }
    
    initializeGame() {
        this.avatar = this.add.sprite(250, 750, 'avatar').setScale(0.5);
        this.bullets = this.add.group();
        this.enemyBullets = this.add.group();
        this.enemies = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: 'enemy',
            repeat: 3,
            setXY: { x: 50, y: 100, stepX: 100, stepY: 100 }
        });
        this.enemies.children.iterate((enemy) => {
            enemy.setScale(0.5);
        });
    
        this.score = 0;
        this.lives = 3;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });
    
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    
        this.isGameOver = false;
    }

    
    
    checkGameOver() {
        // Check if the game is over
        if (this.lives <= 0 && !this.isGameOver) {
            this.isGameOver = true; // Prevent multiple triggers
            this.time.delayedCall(1000, () => {
                this.scene.start("SceneGameOver"); // Start game over scene after delay
            }, [], this);
        }
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
            bullet.setScale(0.5);  
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
                    enemyBullet.setScale(0.5);  
                    
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
                if (this.checkOverlap(this.avatar, enemyBullet)) { 
                    enemyBullet.destroy();
                    this.lives--;
                    this.livesText.setText('Lives: ' + this.lives);
                }
            }
        });

        // Game over check
        if (this.lives <= 0 && !this.isGameOver) {
            this.isGameOver = true;  // Set game over flag to true
            this.scene.start("SceneGameOver"); // Start game over scene after delay
        }
        this.checkGameOver();
    }

    // Utility function to check overlap between two sprites
    checkOverlap(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
    
}
