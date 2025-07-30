class LifeSimulator {
    constructor() {
        this.gameState = {
            gender: '',
            currentYear: 1,
            currentMonth: 1,
            age: 0,
            health: 100,
            happiness: 100,
            wealth: 100,
            eventProbability: 30,
            gameSpeed: 10000, // 10秒/月
            isGameRunning: false,
            bgmEnabled: true,
            bgmVolume: 0.5
        };
        
        this.gameTimer = null;
        this.events = this.initializeEvents();
        this.currentEvent = null;
        
        this.initializeEventListeners();
        this.updateUI();
    }

    initializeEvents() {
        return {
            male: [
                {
                    title: "你遇到了一个学习机会",
                    description: "有人邀请你参加一个免费的编程课程，你会参加吗？",
                    choices: [
                        { text: "参加课程", effects: { happiness: 10, wealth: 5 } },
                        { text: "拒绝", effects: { happiness: -5 } }
                    ]
                },
                {
                    title: "工作机会",
                    description: "你收到了一个高薪工作的邀请，但需要经常加班。",
                    choices: [
                        { text: "接受工作", effects: { wealth: 20, happiness: -10, health: -5 } },
                        { text: "拒绝", effects: { happiness: 5 } }
                    ]
                },
                {
                    title: "健康检查",
                    description: "你感觉身体有些不适，需要去医院检查。",
                    choices: [
                        { text: "去医院检查", effects: { health: 15, wealth: -10 } },
                        { text: "忽略", effects: { health: -10, happiness: -5 } }
                    ]
                },
                {
                    title: "投资机会",
                    description: "朋友推荐你投资一个项目，看起来很有前景。",
                    choices: [
                        { text: "投资", effects: { wealth: 30, happiness: 10 } },
                        { text: "观望", effects: { happiness: -5 } }
                    ]
                },
                {
                    title: "感情生活",
                    description: "你遇到了一个很特别的人，想要进一步发展关系。",
                    choices: [
                        { text: "主动追求", effects: { happiness: 20, health: 5 } },
                        { text: "保持距离", effects: { happiness: -10 } }
                    ]
                }
            ],
            female: [
                {
                    title: "你遇到了一个学习机会",
                    description: "有人邀请你参加一个免费的设计课程，你会参加吗？",
                    choices: [
                        { text: "参加课程", effects: { happiness: 10, wealth: 5 } },
                        { text: "拒绝", effects: { happiness: -5 } }
                    ]
                },
                {
                    title: "工作机会",
                    description: "你收到了一个创意总监的职位邀请，但工作压力很大。",
                    choices: [
                        { text: "接受工作", effects: { wealth: 25, happiness: -8, health: -3 } },
                        { text: "拒绝", effects: { happiness: 5 } }
                    ]
                },
                {
                    title: "健康检查",
                    description: "你感觉最近很疲惫，需要休息和检查。",
                    choices: [
                        { text: "去医院检查", effects: { health: 15, wealth: -10 } },
                        { text: "继续工作", effects: { health: -10, happiness: -5 } }
                    ]
                },
                {
                    title: "创业机会",
                    description: "你有一个很好的创业想法，需要投入一些资金。",
                    choices: [
                        { text: "开始创业", effects: { wealth: 35, happiness: 15, health: -5 } },
                        { text: "继续打工", effects: { happiness: -5 } }
                    ]
                },
                {
                    title: "感情生活",
                    description: "你遇到了一个很温柔的人，想要进一步发展关系。",
                    choices: [
                        { text: "主动追求", effects: { happiness: 20, health: 5 } },
                        { text: "保持距离", effects: { happiness: -10 } }
                    ]
                }
            ],
            common: [
                {
                    title: "天气变化",
                    description: "今天天气很好，你想出去走走吗？",
                    choices: [
                        { text: "出去散步", effects: { health: 10, happiness: 15 } },
                        { text: "待在家里", effects: { happiness: -5 } }
                    ]
                },
                {
                    title: "朋友聚会",
                    description: "朋友们邀请你参加聚会，你会去吗？",
                    choices: [
                        { text: "参加聚会", effects: { happiness: 20, wealth: -5 } },
                        { text: "拒绝", effects: { happiness: -10 } }
                    ]
                },
                {
                    title: "学习新技能",
                    description: "你想学习一个新的技能来提升自己。",
                    choices: [
                        { text: "学习新技能", effects: { happiness: 10, wealth: 10 } },
                        { text: "保持现状", effects: { happiness: -5 } }
                    ]
                },
                {
                    title: "健康生活",
                    description: "你决定开始健康的生活方式。",
                    choices: [
                        { text: "开始运动", effects: { health: 20, happiness: 10 } },
                        { text: "继续现状", effects: { health: -5 } }
                    ]
                },
                {
                    title: "慈善捐赠",
                    description: "你看到有人在为贫困儿童募捐。",
                    choices: [
                        { text: "捐款", effects: { happiness: 15, wealth: -10 } },
                        { text: "路过", effects: { happiness: -5 } }
                    ]
                }
            ]
        };
    }

    initializeEventListeners() {
        // 性别选择
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.gameState.gender = e.target.dataset.gender;
                this.startGame();
            });
        });

        // 设置按钮
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });

        // 返回游戏按钮
        document.getElementById('back-to-game').addEventListener('click', () => {
            this.hideSettings();
        });

        // 重新开始按钮
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });

        // 设置滑块
        document.getElementById('event-probability').addEventListener('input', (e) => {
            this.gameState.eventProbability = parseInt(e.target.value);
            document.getElementById('probability-value').textContent = e.target.value + '%';
        });

        // 游戏速度选择
        document.getElementById('game-speed').addEventListener('change', (e) => {
            this.gameState.gameSpeed = parseInt(e.target.value);
            if (this.gameState.isGameRunning) {
                this.restartTimer();
            }
        });

        // 背景音乐音量控制
        document.getElementById('bgm-volume').addEventListener('input', (e) => {
            this.gameState.bgmVolume = parseInt(e.target.value) / 100;
            document.getElementById('bgm-volume-value').textContent = e.target.value + '%';
            this.updateBGMVolume();
        });

        // 背景音乐开关
        document.getElementById('bgm-toggle').addEventListener('click', () => {
            this.gameState.bgmEnabled = !this.gameState.bgmEnabled;
            this.toggleBGM();
        });
    }

    startGame() {
        this.showScreen('game-screen');
        this.gameState.isGameRunning = true;
        this.updateCharacter();
        this.startTimer();
        this.updateUI();
        this.startBGM();
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            this.advanceMonth();
        }, this.gameState.gameSpeed);
    }

    restartTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        this.startTimer();
    }

    advanceMonth() {
        this.gameState.currentMonth++;
        
        if (this.gameState.currentMonth > 12) {
            this.gameState.currentMonth = 1;
            this.gameState.currentYear++;
            this.gameState.age++;
        }

        // 随机事件触发
        if (Math.random() * 100 < this.gameState.eventProbability) {
            this.triggerRandomEvent();
        } else {
            this.updateEventDisplay(`第${this.gameState.currentYear}年第${this.gameState.currentMonth}个月过去了...`);
        }

        this.updateUI();
        
        // 检查游戏是否结束
        if (this.gameState.currentYear > 10) {
            this.endGame();
        }
    }

    triggerRandomEvent() {
        const genderEvents = this.events[this.gameState.gender] || [];
        const commonEvents = this.events.common;
        const allEvents = [...genderEvents, ...commonEvents];
        
        if (allEvents.length === 0) return;
        
        const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
        this.currentEvent = randomEvent;
        
        this.updateEventDisplay(randomEvent.description);
        this.showEventChoices(randomEvent.choices);
        this.playEventSound();
    }

    updateEventDisplay(message) {
        const eventDisplay = document.getElementById('event-display');
        eventDisplay.innerHTML = `<p>${message}</p>`;
    }

    showEventChoices(choices) {
        const choicesContainer = document.getElementById('event-choices');
        choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                this.makeChoice(choice.effects);
            });
            choicesContainer.appendChild(button);
        });
        
        choicesContainer.style.display = 'flex';
    }

    makeChoice(effects) {
        // 应用选择的效果
        Object.keys(effects).forEach(stat => {
            this.gameState[stat] = Math.max(0, Math.min(100, this.gameState[stat] + effects[stat]));
        });

        // 隐藏选择按钮
        document.getElementById('event-choices').style.display = 'none';
        
        // 显示选择结果
        const resultMessage = this.getResultMessage(effects);
        this.updateEventDisplay(resultMessage);
        
        this.currentEvent = null;
        this.updateUI();
    }

    getResultMessage(effects) {
        const messages = [];
        
        if (effects.health > 0) messages.push(`健康 +${effects.health}`);
        if (effects.health < 0) messages.push(`健康 ${effects.health}`);
        if (effects.happiness > 0) messages.push(`快乐 +${effects.happiness}`);
        if (effects.happiness < 0) messages.push(`快乐 ${effects.happiness}`);
        if (effects.wealth > 0) messages.push(`财富 +${effects.wealth}`);
        if (effects.wealth < 0) messages.push(`财富 ${effects.wealth}`);
        
        return `选择完成！${messages.join(', ')}`;
    }

    updateUI() {
        // 更新时间显示
        document.getElementById('current-year').textContent = `第${this.gameState.currentYear}年`;
        document.getElementById('current-month').textContent = `第${this.gameState.currentMonth}个月`;
        
        // 更新进度条
        const totalMonths = 120; // 10年 * 12个月
        const currentMonths = (this.gameState.currentYear - 1) * 12 + this.gameState.currentMonth;
        const progress = (currentMonths / totalMonths) * 100;
        document.getElementById('time-progress').style.width = progress + '%';
        
        // 更新角色信息
        document.getElementById('character-age').textContent = `${this.gameState.age}岁`;
        document.getElementById('character-gender').textContent = this.gameState.gender === 'male' ? '👨' : '👩';
        
        // 更新状态条
        this.updateStatBar('health', this.gameState.health);
        this.updateStatBar('happiness', this.gameState.happiness);
        this.updateStatBar('wealth', this.gameState.wealth);
    }

    updateStatBar(statName, value) {
        const bar = document.getElementById(`${statName}-bar`);
        const valueSpan = document.getElementById(`${statName}-value`);
        
        bar.style.width = value + '%';
        valueSpan.textContent = value;
    }

    updateCharacter() {
        const avatar = document.getElementById('character-avatar');
        avatar.textContent = this.gameState.gender === 'male' ? '👨' : '👩';
    }

    showSettings() {
        this.showScreen('settings-screen');
        if (this.gameState.isGameRunning) {
            clearInterval(this.gameTimer);
        }
    }

    hideSettings() {
        this.showScreen('game-screen');
        if (this.gameState.isGameRunning) {
            this.startTimer();
        }
    }

    endGame() {
        clearInterval(this.gameTimer);
        this.gameState.isGameRunning = false;
        
        // 更新最终统计
        document.getElementById('final-age').textContent = `${this.gameState.age}岁`;
        document.getElementById('final-health').textContent = this.gameState.health;
        document.getElementById('final-happiness').textContent = this.gameState.happiness;
        document.getElementById('final-wealth').textContent = this.gameState.wealth;
        
        this.showScreen('end-screen');
    }

    restartGame() {
        // 重置游戏状态
        this.gameState = {
            gender: this.gameState.gender,
            currentYear: 1,
            currentMonth: 1,
            age: 0,
            health: 100,
            happiness: 100,
            wealth: 100,
            eventProbability: this.gameState.eventProbability,
            gameSpeed: this.gameState.gameSpeed,
            isGameRunning: false
        };
        
        this.currentEvent = null;
        this.updateUI();
        this.updateCharacter();
        this.updateEventDisplay('人生重新开始了...');
        document.getElementById('event-choices').style.display = 'none';
        
        this.showScreen('game-screen');
        this.gameState.isGameRunning = true;
        this.startTimer();
    }

    showScreen(screenId) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 显示指定屏幕
        document.getElementById(screenId).classList.add('active');
    }

    // 音乐控制方法
    startBGM() {
        const bgm = document.getElementById('bgm');
        if (this.gameState.bgmEnabled && bgm) {
            bgm.volume = this.gameState.bgmVolume;
            bgm.play().catch(e => console.log('BGM播放失败:', e));
        }
    }

    toggleBGM() {
        const bgm = document.getElementById('bgm');
        const toggleBtn = document.getElementById('bgm-toggle');
        
        if (this.gameState.bgmEnabled) {
            bgm.play().catch(e => console.log('BGM播放失败:', e));
            toggleBtn.textContent = '🔊 音乐: 开启';
        } else {
            bgm.pause();
            toggleBtn.textContent = '🔇 音乐: 关闭';
        }
    }

    updateBGMVolume() {
        const bgm = document.getElementById('bgm');
        if (bgm) {
            bgm.volume = this.gameState.bgmVolume;
        }
    }

    playEventSound() {
        const eventSound = document.getElementById('event-sound');
        if (eventSound && this.gameState.bgmEnabled) {
            eventSound.volume = this.gameState.bgmVolume;
            eventSound.play().catch(e => console.log('音效播放失败:', e));
        }
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new LifeSimulator();
}); 