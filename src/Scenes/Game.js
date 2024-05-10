class D1 extends Phaser.Scene {
    constructor() {
        super("D1");
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
    }

    create() {
        this.initializeGame();
    }

    initializeGame() {
        this.avatar = this.add.sprite(250, 750, 'avatar').setScale(0.5);
        this.bullets = this.add.group();
        this.enemyBullets = this.add.group();
    
        // Setup enemies with a cooldown for shooting to prevent bullet overlap
        this.enemies = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: 'enemy',
            repeat: 4,
            setXY: { x: 50, y: 100, stepX: 100, stepY: 100 }
        });
    
        // Iterate over each enemy to set initial properties
        this.enemies.children.iterate((enemy) => {
            enemy.setScale(0.5);
            enemy.nextShootTime = 100;  // Initialize with no cooldown
        });
    
        // Initialize score and lives display
        this.score = 0;
        this.lives = 3;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });
    
        // Setup keyboard controls for player movement and shooting
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    
        // Set the game over flag to false initially
        this.isGameOver = false;
        this.isGameWin = false; // Flag to track game win state

    }
    manageEnemyActions() {
    this.enemies.children.iterate((enemy) => {
        if (enemy) {
            enemy.y += this.enemySpeed * this.game.loop.delta / 1000;
            if (enemy.y >= this.sys.game.config.height) {
                enemy.destroy();
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);
            }
            if (Math.random() < 0.01) {
                let enemyBullet = this.enemyBullets.create(enemy.x, enemy.y + enemy.height / 2, 'enemyBullet');
                enemyBullet.setVelocityY(this.enemyBulletSpeed);
                enemyBullet.setScale(0.5);
            }
            if (this.checkOverlap(this.avatar, enemy)) {
                enemy.destroy();
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);
            }
        }
    });
    // After iterating, check if all enemies are destroyed
    if (this.enemies.countActive(true) === 0 && !this.isGameOver && !this.isGameWin) {
        this.isGameWin = true;
        this.scene.start("SceneWin");
    }
}

    update() {
        this.handlePlayerMovement();
        this.handleShooting();
        this.updateBullets();
        this.manageEnemyActions();
        this.checkGameOver();
    }

    handlePlayerMovement() {
        if (this.keys.left.isDown && this.avatar.x > this.avatar.width * 0.5) {
            this.avatar.x -= this.playerSpeed * this.game.loop.delta / 1000;
        } else if (this.keys.right.isDown && this.avatar.x < this.sys.game.config.width - this.avatar.width * 0.5) {
            this.avatar.x += this.playerSpeed * this.game.loop.delta / 1000;
        }
    
        if (this.keys.up.isDown && this.avatar.y > this.avatar.height * 0.5) {
            this.avatar.y -= this.playerSpeed * this.game.loop.delta / 1000;
        } else if (this.keys.down.isDown && this.avatar.y < this.sys.game.config.height - this.avatar.height * 0.5) {
            this.avatar.y += this.playerSpeed * this.game.loop.delta / 1000;
        }
    }
    

    handleShooting() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
            let bullet = this.bullets.create(this.avatar.x, this.avatar.y - this.avatar.height, 'bullet');
            bullet.setVelocityY(this.bulletSpeed);
            bullet.setScale(0.5);
        }
    }

    updateBullets() {
        // Update player bullets
        this.bullets.children.iterate((bullet) => {
            if (bullet) {
                bullet.y += this.bulletSpeed * this.game.loop.delta / 1000;
                if (bullet.y < 0) {
                    bullet.destroy();
                } else {
                    this.enemies.children.iterate((enemy) => {
                        if (enemy && this.checkOverlap(bullet, enemy)) {
                            bullet.destroy();
                            enemy.destroy();
                            this.score += 10;
                            this.scoreText.setText('Score: ' + this.score);
                        }
                    });
                }
            }
        });
    
        // Update enemy bullets
        this.enemyBullets.children.iterate((enemyBullet) => {
            if (enemyBullet) {
                enemyBullet.y += this.enemyBulletSpeed * this.game.loop.delta / 1000;
                if (enemyBullet.y > this.sys.game.config.height) {
                    enemyBullet.destroy();
                } else {
                    // Check for collision with the player avatar
                    if (this.checkOverlap(enemyBullet, this.avatar)) {
                        enemyBullet.destroy();
                        this.lives--;
                        this.livesText.setText('Lives: ' + this.lives);
                        if (this.lives <= 0 && !this.isGameOver) {
                            this.isGameOver = true;
                            this.scene.start("SceneGameOver");
                        }
                    }
                }
            }
        });
    }
    

    manageEnemyActions() {
        this.enemies.children.iterate((enemy) => {
            if (enemy) {
                enemy.y += this.enemySpeed * this.game.loop.delta / 1000;
                if (enemy.y >= this.sys.game.config.height) {
                    enemy.destroy();
                    this.lives--;
                    this.livesText.setText('Lives: ' + this.lives);
                }
                if (Math.random() < 0.01) {
                    let enemyBullet = this.enemyBullets.create(enemy.x, enemy.y + enemy.height / 2, 'enemyBullet');
                    enemyBullet.setVelocityY(this.enemyBulletSpeed);
                    enemyBullet.setScale(0.5);
                }
                if (this.checkOverlap(this.avatar, enemy)) {
                    enemy.destroy();
                    this.lives--;
                    this.livesText.setText('Lives: ' + this.lives);
                }
            }
        });
        // After iterating, check if all enemies are destroyed
        if (this.enemies.countActive(true) === 0 && !this.isGameOver && !this.isGameWin) {
            this.isGameWin = true;
            this.scene.start("SceneWin");
        }
    }


    checkGameOver() {
        if (this.lives <= 0 && !this.isGameOver) {
            this.isGameOver = true;
            this.scene.start("SceneGameOver");
        }
    }



    // Utility function to check overlap between two sprites
    checkOverlap(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
}
