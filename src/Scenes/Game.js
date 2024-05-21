class D1 extends Phaser.Scene {
    constructor() {
        super("D1");
        this.playerSpeed = 300;
        this.bulletSpeed = -500;
        this.enemyBulletSpeed = 200;
        this.enemySpeed = 50;
        this.bossSpeed = 30;
        this.avatar = null;
        this.bullets = null;
        this.enemyBullets = null;
        this.enemies = null;
        this.boss = null;
        this.bossMinions = null; 
        this.keys = {};
        this.score = 0;
        this.scoreText = null;
        this.lives = 10;
        this.livesText = null;
        this.waveText = null;
        this.isGameOver = false;
        this.isGameWin = false;
        this.currentWave = 1;
        this.totalWaves = 3;
        this.isPaused = false; 
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('avatar', 'playerShip3_blue.png');
        this.load.image('bullet', 'laserBlue01.png');
        this.load.image('enemy', 'enemyBlack3.png');
        this.load.image('enemyWave2', 'enemyBlack4.png'); 
        this.load.image('boss', 'Bossship1.png'); 
        this.load.image('bossBattle', 'boss battle.png'); 
        this.load.image('enemyBullet', 'laserRed05.png');
        this.load.image('sprBg0', 'space1.gif');
        this.load.image('sprBg1', 'space2.gif');
        this.load.image('sprBg2', 'space3.gif');
        this.load.audio("exp1", "sndExplode0.wav");
        this.load.audio("exp2", "sndExplode1.wav");
    }
    
    create(data) {
        this.initializeGame();
        this.createStarfield(); 
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
        this.enemies = this.add.group(); 
        this.bossMinions = this.add.group(); 
        this.boss = null; 
    
        this.score = 0;
        this.lives = 10;
        this.currentWave = 1; 
        this.waveText = this.add.text(16, 16, 'Wave: 1', { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.text(16, 50, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.livesText = this.add.text(16, 84, 'Lives: 10', { fontSize: '32px', fill: '#FFF' });
    
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    
        this.isGameOver = false;
        this.isGameWin = false; 
        this.isPaused = false;
    }

    createStarfield() {
        this.starfieldBack = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg0').setOrigin(0, 0).setDepth(-2);
        this.starfieldMiddle = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg1').setOrigin(0, 0).setDepth(-1);
        this.starfieldFront = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'sprBg2').setOrigin(0, 0).setDepth(-3);
    }

    startWave(wave) {
        switch(wave) {
            case 1:
                this.setupWave1();
                break;
            case 2:
                this.setupWave2();
                break;
            case 3:
                this.showBossBattleImage();
                break;
            default:
                console.error("Invalid wave number");
        }
        this.waveText.setText('Wave: ' + wave); 
    }

    setupWave1() {
        this.setupEnemies(5, { x: 50, y: 100, stepX: 100, stepY: 100 }, 'enemy', 1, 10);
    }

    setupWave2() {
        this.setupEnemies(7, { x: 50, y: 100, stepX: 80, stepY: 80 }, 'enemyWave2', 2, 15);
    }

    setupWave3() {
        this.setupBoss({ x: this.sys.game.config.width / 2, y: 100 }, 'boss', 30);
        this.spawnBossMinions();
    }

    setupEnemies(count, position, spriteKey, hitPoints, scoreValue) {
        this.enemies = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            key: spriteKey,
            repeat: count - 1,
            setXY: position
        });
    
        this.enemies.children.iterate((enemy) => {
            enemy.setScale(0.5);
            enemy.nextShootTime = Phaser.Math.Between(50, 200);  
            enemy.hitPoints = hitPoints; 
            enemy.scoreValue = scoreValue; 
        });
    }

    setupBoss(position, spriteKey, hitPoints) {
        this.boss = this.add.sprite(position.x, position.y, spriteKey).setScale(1.5); 
        this.boss.hitPoints = hitPoints;
        this.boss.scoreValue = 50; 
        this.boss.shootCooldown1 = Phaser.Math.Between(50, 200); 
        this.boss.shootCooldown2 = Phaser.Math.Between(50, 200); 
        this.boss.relativePositions = [{ x: -150, y: 0 }, { x: 150, y: 0 }];
    }

    spawnBossMinions() {
        this.boss.relativePositions.forEach((relativePosition, index) => {
            let minion = this.bossMinions.create(this.boss.x + relativePosition.x, this.boss.y + relativePosition.y, 'enemy');
            minion.setScale(0.5);
            minion.hitPoints = 3; 
            minion.shootCooldown = Phaser.Math.Between(50, 200); 
            minion.relativeIndex = index; 
        });
    }

    showBossBattleImage() {
        this.isPaused = true; 
        let bossBattleImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bossBattle');
        bossBattleImage.setScale(0.8);
        this.time.delayedCall(1000, () => {
            bossBattleImage.destroy();
            this.isPaused = false; 
            this.setupWave3();
        }, [], this);
    }

    update() {
        if (this.isPaused) {
            return; 
        }
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
                            enemy.hitPoints--; 
                            if (enemy.hitPoints <= 0) {
                                this.sfx.exp1.play();
                                this.score += enemy.scoreValue; 
                                this.scoreText.setText('Score: ' + this.score);
                                enemy.destroy();
                            }
                        }
                    });

                    this.bossMinions.children.iterate((minion) => {
                        if (minion && this.checkOverlap(bullet, minion)) {
                            bullet.destroy();
                            minion.hitPoints--; 
                            if (minion.hitPoints <= 0) {
                                this.sfx.exp1.play();
                                this.score += 10; 
                                this.scoreText.setText('Score: ' + this.score);
                                minion.destroy();
                            }
                        }
                    });

                    if (this.boss && this.checkOverlap(bullet, this.boss)) {
                        bullet.destroy();
                        this.boss.hitPoints--;
                        if (this.boss.hitPoints <= 0) {
                            this.sfx.exp1.play();
                            this.score += this.boss.scoreValue; 
                            this.scoreText.setText('Score: ' + this.score);
                            this.boss.destroy();
                            this.bossMinions.clear(true, true); 
                            this.isGameWin = true;
                            this.scene.start("SceneWin");
                        }
                    }
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
                }
                if (enemy.shootCooldown > 0) {
                    enemy.shootCooldown--;
                } else {
                    enemy.shootCooldown = Phaser.Math.Between(50, 200);
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

        if (this.boss) {
            this.boss.y += this.bossSpeed * this.game.loop.delta / 1000;
            if (this.boss.shootCooldown1 > 0) {
                this.boss.shootCooldown1--;
            } else {
                this.boss.shootCooldown1 = Phaser.Math.Between(50, 200);
                this.shootBossBullet1();
            }
            if (this.boss.shootCooldown2 > 0) {
                this.boss.shootCooldown2--;
            } else {
                this.boss.shootCooldown2 = Phaser.Math.Between(50, 200);
                this.shootBossBullet2();
            }
            this.updateBossMinions(); 
        }

        this.bossMinions.children.iterate((minion) => {
            if (minion.shootCooldown > 0) {
                minion.shootCooldown--;
            } else {
                minion.shootCooldown = Phaser.Math.Between(50, 200);
                let minionBullet = this.enemyBullets.create(minion.x, minion.y, 'enemyBullet');
                minionBullet.setVelocityY(this.enemyBulletSpeed);
                minionBullet.setScale(0.5);
            }
        });

        if (this.enemies.countActive(true) === 0 && !this.isGameOver && !this.boss) {
            if (this.currentWave < this.totalWaves) {
                this.currentWave++;
                this.startWave(this.currentWave);
            } else {
                this.isGameWin = true;
                this.scene.start("SceneWin");
            }
        }
    }

    updateBossMinions() {
        this.bossMinions.children.iterate((minion) => {
            let relativePosition = this.boss.relativePositions[minion.relativeIndex];
            minion.x = this.boss.x + relativePosition.x;
            minion.y = this.boss.y + relativePosition.y;
        });
    }

    shootBossBullet1() {
        let bullet = this.enemyBullets.create(this.boss.x - this.boss.width / 4, this.boss.y + this.boss.height / 2, 'enemyBullet');
        bullet.setVelocityY(this.enemyBulletSpeed);
        bullet.setScale(0.5);
    }

    shootBossBullet2() {
        let bullet = this.enemyBullets.create(this.boss.x + this.boss.width / 4, this.boss.y + this.boss.height / 2, 'enemyBullet');
        bullet.setVelocityY(this.enemyBulletSpeed);
        bullet.setScale(0.5);
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
