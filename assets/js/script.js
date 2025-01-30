class CoinToss {
    constructor() {
        this.coin = document.querySelector('.coin');
        this.button = document.querySelector('.toss-button');
        this.resultText = document.querySelector('.result-text');
        this.isAnimating = false;
        this.audio = new Audio('assets/sounds/coin_toss.mp3');
        this.themeButton = document.querySelector('.theme-button');
        
        // 添加设置相关的元素引用
        this.settingsButton = document.querySelector('.settings-button');
        this.settingsPanel = document.querySelector('.settings-panel');
        this.closeSettings = document.querySelector('.close-settings');
        this.saveSettings = document.querySelector('.save-settings');
        this.headsNameInput = document.querySelector('#heads-name');
        this.tailsNameInput = document.querySelector('#tails-name');
        this.headsColorInput = document.querySelector('#heads-color');
        this.tailsColorInput = document.querySelector('#tails-color');
        
        // 添加新的元素引用
        this.totalCount = document.querySelector('.total-count');
        this.headsCount = document.querySelector('.heads-count');
        this.tailsCount = document.querySelector('.tails-count');
        this.headsPercentage = document.querySelector('.heads-percentage');
        this.tailsPercentage = document.querySelector('.tails-percentage');
        this.historyList = document.querySelector('.history-list');
        
        // 初始化统计数据
        this.stats = this.loadStats();
        this.settings = this.loadSettings();
        this.updateStatsDisplay();
        this.loadHistory();
        this.applySettings();
        
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
        
        // 添加设置相关的事件监听器
        this.settingsButton.addEventListener('click', () => this.openSettings());
        this.closeSettings.addEventListener('click', () => this.closeSettingsPanel());
        this.saveSettings.addEventListener('click', () => this.saveSettingsData());
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

    loadStats() {
        const savedStats = localStorage.getItem('coinTossStats');
        return savedStats ? JSON.parse(savedStats) : {
            total: 0,
            heads: 0,
            tails: 0
        };
    }
    
    saveStats() {
        localStorage.setItem('coinTossStats', JSON.stringify(this.stats));
    }
    
    updateStatsDisplay() {
        this.totalCount.textContent = this.stats.total;
        this.headsCount.textContent = this.stats.heads;
        this.tailsCount.textContent = this.stats.tails;
        
        const headsPercentage = this.stats.total ? ((this.stats.heads / this.stats.total) * 100).toFixed(1) : 0;
        const tailsPercentage = this.stats.total ? ((this.stats.tails / this.stats.total) * 100).toFixed(1) : 0;
        
        this.headsPercentage.textContent = `(${headsPercentage}%)`;
        this.tailsPercentage.textContent = `(${tailsPercentage}%)`;
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('coinTossSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            headsName: '正',
            tailsName: '反',
            headsColor: '#FFD700',
            tailsColor: '#FFD700'
        };
    }
    
    saveSettingsData() {
        const settings = {
            headsName: this.headsNameInput.value,
            tailsName: this.tailsNameInput.value,
            headsColor: this.headsColorInput.value,
            tailsColor: this.tailsColorInput.value
        };
        
        localStorage.setItem('coinTossSettings', JSON.stringify(settings));
        this.settings = settings;
        this.applySettings();
        this.closeSettingsPanel();
        
        // 显示保存成功提示
        this.resultText.textContent = '设置已保存！';
        setTimeout(() => {
            this.resultText.textContent = '';
        }, 2000);
    }
    
    applySettings() {
        // 更新硬币文字
        const headsText = document.querySelector('.heads .coin-text');
        const tailsText = document.querySelector('.tails .coin-text');
        headsText.textContent = this.settings.headsName;
        tailsText.textContent = this.settings.tailsName;
        
        // 更新硬币颜色
        const headsCircle = document.querySelector('.heads circle');
        const tailsCircle = document.querySelector('.tails circle');
        headsCircle.setAttribute('fill', this.settings.headsColor);
        tailsCircle.setAttribute('fill', this.settings.tailsColor);
        
        // 更新设置面板中的值
        this.headsNameInput.value = this.settings.headsName;
        this.tailsNameInput.value = this.settings.tailsName;
        this.headsColorInput.value = this.settings.headsColor;
        this.tailsColorInput.value = this.settings.tailsColor;
    }
    
    openSettings() {
        this.settingsPanel.classList.add('active');
    }
    
    closeSettingsPanel() {
        this.settingsPanel.classList.remove('active');
    }
    
    loadHistory() {
        const savedHistory = localStorage.getItem('coinTossHistory');
        if (savedHistory) {
            const historyItems = JSON.parse(savedHistory);
            historyItems.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <span class="result">${item.result}</span>
                    <span class="time">${item.time}</span>
                `;
                this.historyList.appendChild(historyItem);
            });
        }
    }

    addToHistory(result) {
        const time = new Date().toLocaleTimeString();
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="result">${result ? this.settings.headsName : this.settings.tailsName}</span>
            <span class="time">${time}</span>
        `;
        
        this.historyList.insertBefore(historyItem, this.historyList.firstChild);
        
        // 限制历史记录数量为最近20条
        if (this.historyList.children.length > 20) {
            this.historyList.removeChild(this.historyList.lastChild);
        }
        
        // 保存到本地存储
        this.saveHistory();
    }
    
    saveHistory() {
        const historyItems = Array.from(this.historyList.children).map(item => ({
            result: item.querySelector('.result').textContent,
            time: item.querySelector('.time').textContent
        }));
        localStorage.setItem('coinTossHistory', JSON.stringify(historyItems));
    }

    async tossCoin() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.resultText.textContent = '投掷中...';
        
        this.audio.currentTime = 0;
        this.audio.play();
        
        const rotations = Math.floor(Math.random() * 3) + 3;
        const isHeads = Math.random() < 0.5;
        
        const degrees = rotations * 360 + (isHeads ? 0 : 180);
        
        this.coin.style.transform = `rotateY(${degrees}deg)`;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 更新统计数据
        this.stats.total++;
        if (isHeads) {
            this.stats.heads++;
        } else {
            this.stats.tails++;
        }
        
        this.updateStatsDisplay();
        this.saveStats();
        this.addToHistory(isHeads);
        
        this.resultText.textContent = isHeads ? `${this.settings.headsName}！` : `${this.settings.tailsName}！`;
        this.isAnimating = false;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new CoinToss();
}); 