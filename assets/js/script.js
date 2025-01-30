class CoinToss {
    constructor() {
        this.coin = document.querySelector('.coin');
        this.button = document.querySelector('.toss-button');
        this.resultText = document.querySelector('.result-text');
        this.isAnimating = false;
        this.audio = new Audio('assets/sounds/coin_toss.mp3');
        
        this.init();
    }

    init() {
        this.button.addEventListener('click', () => this.tossCoin());
        this.coin.addEventListener('click', () => this.tossCoin());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.tossCoin();
            }
        });
    }

    async tossCoin() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.resultText.textContent = '投掷中...';
        
        // 播放音效
        this.audio.currentTime = 0;
        this.audio.play();
        
        // 随机旋转次数（3-5次）
        const rotations = Math.floor(Math.random() * 3) + 3;
        const isHeads = Math.random() < 0.5;
        
        // 计算最终旋转角度
        const degrees = rotations * 360 + (isHeads ? 0 : 180);
        
        this.coin.style.transform = `rotateY(${degrees}deg)`;
        
        // 等待动画完成
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.resultText.textContent = isHeads ? '正面！' : '反面！';
        this.isAnimating = false;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new CoinToss();
}); 