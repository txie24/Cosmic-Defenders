class LocalStorageUtil {
    static getHighScore() {
        return localStorage.getItem('highScore') || 0;
    }

    static setHighScore(score) {
        const currentHighScore = LocalStorageUtil.getHighScore();
        if (score > currentHighScore) {
            localStorage.setItem('highScore', score);
        }
    }
}
