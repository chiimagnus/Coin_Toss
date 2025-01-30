class CoinToss {
    constructor() {
        this.coin = document.querySelector('.coin');
        this.button = document.querySelector('.toss-button');
        this.resultText = document.querySelector('.result-text');
        this.isAnimating = false;
        this.audio = new Audio('assets/sounds/coin_toss.mp3');
        this.themeButton = document.querySelector('.theme-button');
        
        this.init();
        this.initTheme();
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
        this.themeButton.addEventListener('click', () => this.toggleTheme());
    }

    initTheme() {
        // 检查本地存储中的主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 如果系统设置为深色模式，自动切换到深色主题
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            // 添加这个默认设置
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
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