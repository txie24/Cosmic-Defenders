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
        this.lives = 10;
        this.livesText = null;
        this.isGameOver = false;
        this.isGameWin = false;
        this.currentWave = 1;
        this.totalWaves = 3;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('avatar', 'playerShip3_blue.png');
        this.load.image('bullet', 'laserBlue01.png');
        this.load.image('enemy', 'enemyBlack3.png');
        this.load.image('enemyBullet', 'laserRed05.png');
        this.load.image('sprBg0', 'space1.gif');
        this.load.image('sprBg1', 'space2.gif');
        this.load.image('sprBg2', 'space3.gif');
        this.load.audio("exp1", "sndExplode0.wav");
        this.load.audio("exp2", "sndExplode1.wav");
    }
    
    create(data) {
        if (data && data.restart) {
            this.currentWave = 1;
        }
        this.initializeGame();
        this.createStarfield(); // Create starfield first to ensure it's at the bottom
        this.sfx = {
            exp1: this.sound.add("exp1",{volume: 0.1}),
            exp2: this.sound.add("exp2",{volume: 0.1})
        };
        this.startWave(this.currentWave);
    }

    initializeGame() {
        this.avatar = this.add.sprite(250, 750, 'avatar').setScale(0.5);
        this.bullets = this.add.group();
        this.enemyBullets = this.add.group();
    
        // Initialize score and lives display
        this.score = 0;
        this.lives = 10;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.livesText = this.add.text(16, 50, 'Lives: 10', { fontSize: '32px', fill: '#FFF' });
    
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

    createStarfield() {
        this.starfieldBack = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg0').setOrigin(0, 0).setDepth(-2);
        this.starfieldMiddle = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg1').setOrigin(0, 0).setDepth(-1);
        this.starfieldFront = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg2').setOrigin(0, 0).setDepth(-3);
    }

    startWave(wave) {
        // Customize each wave as needed
        switch(wave) {
            case 1:
                this.setupWave1();
                break;
            case 2:
                this.setupWave2();
                break;
            case 3:
                this.setupWave3();
                break;
            default:
                console.error("Invalid wave number");
        }
    }

    setupWave1() {
        // Setup enemies for wave 1
        this.setupEnemies(5, { x: 50, y: 100, stepX: 100, stepY: 100 });
    }

    setupWave2() {
        // Setup enemies for wave 2
        this.setupEnemies(5, { x: 50, y: 100, stepX: 100, stepY: 100 });
    }

    setupWave3() {
        // Setup enemies for wave 3
        this.setupEnemies(5, { x: 50, y: 100, stepX: 100, stepY: 100 });
    }

    setupEnemies(count, position) {
        this.enemies = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: 'enemy',
            repeat: count - 1,
            setXY: position
        });
    
        // Iterate over each enemy to set initial properties
        this.enemies.children.iterate((enemy) => {
            enemy.setScale(0.5);
            enemy.nextShootTime = 100;  // Initialize with no cooldown
        });
    }

    update() {
        this.handlePlayerMovement();
        this.handleShooting();
        this.updateBullets();
        this.manageEnemyActions();
        this.checkGameOver();
        this.updateStarfield();
        if (this.score > LocalStorageUtil.getHighScore()) {
            LocalStorageUtil.setHighScore(this.score);
        }
    }

    updateStarfield() {
        this.starfieldBack.tilePositionY -= 0.5;
        this.starfieldMiddle.tilePositionY -= 0.7;
        this.starfieldFront.tilePositionY -= 1;
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
                            this.sfx.exp1.play();
                            this.score += 10;
                            this.scoreText.setText('Score: ' + this.score);
                        }
                    });
                }
            }
        });
    
        this.enemyBullets.children.iterate((enemyBullet) => {
            if (enemyBullet) {
                enemyBullet.y += this.enemyBulletSpeed * this.game.loop.delta / 1000;
                if (enemyBullet.y > this.sys.game.config.height) {
                    enemyBullet.destroy();
                } else {
                    if (this.checkOverlap(enemyBullet, this.avatar)) {
                        enemyBullet.destroy();
                        this.lives--;
                        this.livesText.setText('Lives: ' + this.lives);
                        if (this.lives <= 0 && !this.isGameOver) {
                            this.sfx.exp2.play();
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
                    if (this.lives <= 0 && !this.isGameOver) {
                        this.isGameOver = true;
                        this.scene.start("SceneGameOver");
                        return;
                    }
                }
                if (Math.random() < 0.01) {
                    let enemyBullet = this.enemyBullets.create(enemy.x, enemy.y + enemy.height / 2, 'enemyBullet');
                    enemyBullet.setVelocityY(this.enemyBulletSpeed);
                    enemyBullet.setScale(0.5);
                }
                if (this.checkOverlap(this.avatar, enemy)) {
                    enemy.destroy();
                    this.sfx.exp1.play();
                    this.lives--;
                    this.livesText.setText('Lives: ' + this.lives);
                    if (this.lives <= 0 && !this.isGameOver) {
                        this.isGameOver = true;
                        this.scene.start("SceneGameOver");
                        return;
                    }
                }
            }
        });

        if (this.enemies.countActive(true) === 0 && !this.isGameOver) {
            if (this.currentWave < this.totalWaves) {
                this.currentWave++;
                this.startWave(this.currentWave);
            } else {
                this.isGameWin = true;
                this.scene.start("SceneWin");
            }
        }
    }

    checkGameOver() {
        if (this.lives <= 0 && !this.isGameOver) {
            this.isGameOver = true;
            this.scene.start("SceneGameOver");
        }
    }

    checkOverlap(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
}
