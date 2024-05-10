class Levels {
  constructor(gameScene) {
      this.gameScene = gameScene;
      this.currentLevel = 0;
      this.levels = [
          {
              enemySpeed: 50,
              enemyBulletSpeed: 200,
              numEnemies: 3
          },
          {
              enemySpeed: 75,
              enemyBulletSpeed: 225,
              numEnemies: 5
          },
          {
              enemySpeed: 100,
              enemyBulletSpeed: 250,
              numEnemies: 7
          }
      ];
  }

  loadLevel() {
      if (this.currentLevel < this.levels.length) {
          const level = this.levels[this.currentLevel];
          this.gameScene.enemySpeed = level.enemySpeed;
          this.gameScene.enemyBulletSpeed = level.enemyBulletSpeed;
          this.gameScene.setupEnemies(level.numEnemies);
      } else {
          console.log("Congratulations! You've completed all levels.");
          this.gameScene.scene.start('SceneGameOver');
      }
  }

  nextLevel() {
      this.currentLevel++;
      this.loadLevel();
  }
}
