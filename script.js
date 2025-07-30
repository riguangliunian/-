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
            charm: 100,
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
                    title: "研究生导师喜欢你",
                    description: "你在北O工读研的时期，你的研究生导师经常给你发小作文转账，你选择...",
                    choices: [
                        { 
                            text: "拒绝他", 
                            effects: { },
                            resultMessage: "你不希望开展不健康的师生关系。"
                        },
                        { 
                            text: "假装答应，实则揭发他", 
                            effects: { happiness: 10, wealth: 15, charm: -10},
                            resultMessage: "老师因为师德有问题被辞退了，你选择出国读博躲避。"
                        }
                    ]
                },
                {
                    title: "高薪工作机会",
                    description: "你收到了一个高薪工作的邀请，但需要经常加班。",
                    choices: [
                        { 
                            text: "接受工作", 
                            effects: { wealth: 20, happiness: -10, health: -5 },
                            resultMessage: "你接受了这份高薪工作。虽然收入大幅增加，但频繁的加班让你感到疲惫，健康和精神状态都受到了影响。",
                            risk: { probability: 50, message: "你因为过度劳累而猝死，人生提前结束..." }
                        },
                        { 
                            text: "拒绝", 
                            effects: { happiness: 5, wealth: -5 },
                            resultMessage: "你拒绝了这份工作。虽然收入没有增加，但你有更多时间陪伴家人和朋友，生活更加平衡。"
                        }
                    ]
                },
                {
                    title: "健康检查",
                    description: "昨天去酒吧玩回来后，身体一直不舒服。",
                    choices: [
                        { 
                            text: "去医院检查", 
                            effects: { health: 10, wealth: -10 },
                            resultMessage: "你及时去医院进行了检查，发现了一些小问题并得到了治疗。虽然花费了一些钱，但健康状况得到了改善。"
                        },
                        { 
                            text: "忽略", 
                            effects: { health: -10, happiness: -5 },
                            resultMessage: "你选择忽略身体的不适。小问题逐渐恶化，影响了你的健康和生活质量。",
                            risk: { probability: 40, message: "哎呀，梅逝的，没有事..." }
                        }
                    ]
                },
                {
                    title: "感情生活",
                    description: "你遇到了一个很特别的人，想要进一步发展关系。",
                    choices: [
                        { 
                            text: "主动追求", 
                            effects: { happiness: 10, health: -5, charm: 10 },
                            resultMessage: "你勇敢地追求了这份感情。虽然过程有些波折，但最终收获了美好的爱情，生活变得更加充实。",
                            risk: { probability: 30, message: "感情生活让你身心俱疲" }
                        },
                        { 
                            text: "保持距离", 
                            effects: { },
                            resultMessage: "你选择保持距离，错过了发展感情的机会。虽然避免了可能的伤害，但也失去了体验爱情的机会。"
                        }
                    ]
                },
                {
                    title: "创业机会",
                    description: "你有一个很好的创业想法，需要投入一些资金。",
                    choices: [
                        { 
                            text: "开始创业", 
                            effects: { wealth: 25, happiness: 15, health: -5 },
                            resultMessage: "你勇敢地开始了创业。虽然过程充满挑战，但你的努力得到了回报，事业取得了成功。",
                            risk: { probability: 50, message: "你的创业项目失败了，不仅损失了所有投资，还欠下了巨额债务。在巨大的压力下，你选择了结束生命..." }
                        },
                        { 
                            text: "继续打工", 
                            effects: { happiness: -5, wealth: -5 },
                            resultMessage: "你选择继续打工，放弃了创业的机会。虽然生活稳定，但错失了实现梦想的机会。"
                        }
                    ]
                }
            ],
            female: [
                {
                    title: "设计学习机会",
                    description: "有人邀请你参加一个免费的设计课程，你会参加吗？",
                    choices: [
                        { 
                            text: "参加课程", 
                            effects: { happiness: -5, wealth: 5, charm: 5 },
                            resultMessage: "你参加了设计课程，学习了新的技能。这些知识不仅提升了你的专业能力，还让你在社交中更有自信。"
                        },
                        { 
                            text: "拒绝", 
                            effects: { happiness: 10 },
                            resultMessage: "你拒绝了学习设计的机会。虽然避免了学习的辛苦，但也错失了一个提升自己的机会。"
                        }
                    ]
                },
                {
                    title: "创意总监职位",
                    description: "你收到了一个创意总监的职位邀请，但工作压力很大。",
                    choices: [
                        { 
                            text: "接受工作", 
                            effects: { wealth: 25, happiness: -8, health: -3 },
                            resultMessage: "你接受了创意总监的职位。虽然工作压力很大，但你的创意得到了认可，收入也大幅提升。",
                            risk: { probability: 30, message: "你因为工作压力过大而患上了严重的抑郁症，最终选择了轻生..." }
                        },
                        { 
                            text: "拒绝", 
                            effects: { happiness: 5, wealth: -5 },
                            resultMessage: "你拒绝了这份高压工作。虽然收入没有增加，但你有更多时间享受生活，压力也小了很多。"
                        }
                    ]
                },
                {
                    title: "健康检查",
                    description: "你感觉最近很疲惫，需要休息和检查。",
                    choices: [
                        { 
                            text: "去医院检查", 
                            effects: { health: 10, wealth: -10 },
                            resultMessage: "你及时去医院进行了检查，医生建议你多休息。经过调理，你的健康状况得到了明显改善。"
                        },
                        { 
                            text: "继续工作", 
                            effects: { health: -10, happiness: -5 },
                            resultMessage: "你选择继续工作，忽略了身体的疲惫。长期的工作压力让你的健康状况逐渐恶化。",
                            risk: { probability: 50, message: "你因为长期过度劳累而突发心脏病，抢救无效死亡..." }
                        }
                    ]
                },
                {
                    title: "路过酒吧",
                    description: "路过酒吧发现酒吧烧了起来，你选择....",
                    choices: [
                        { 
                            text: "勇敢救火", 
                            effects: { wealth: 5, happiness: 10, health: -5 },
                            resultMessage: "哇塞，你好牛。",
                            risk: { probability: 30, message: "不是，你以为你真的能救火啊？" }
                        },
                        { 
                            text: "离开后报警", 
                            effects: { happiness: 5},
                            resultMessage: "消防车很快来了，你还想你要不要救火，想了想还不如消防车灭火快"
                        }
                    ]
                },
                {
                    title: "感情生活",
                    description: "你遇到了一个很温柔的人，想要进一步发展关系。",
                    choices: [
                        { 
                            text: "主动追求", 
                            effects: { happiness: 10, health: 5, charm: 10 },
                            resultMessage: "你勇敢地追求了这份感情。对方的温柔让你感到被爱，生活变得更加美好和充实。",
                            risk: { probability: 30, message: "感情发展有风险，你因为发展不顺玉玉了，选择给自己改花刀" }
                        },
                        { 
                            text: "保持距离", 
                            effects: { },
                            resultMessage: "你选择保持距离，错过了发展感情的机会。虽然避免了可能的伤害，但也失去了体验美好爱情的机会。"
                        }
                    ]
                },
                {
                    title: "前女友找上门",
                    description: "你前女友威胁你如果不复合她就玉玉症大发在你眼前表演花道",
                    choices: [
                        { 
                            text: "答应复合", 
                            effects: {  charm: -5, happiness: -10 },
                            resultMessage: "你被迫答应复合。"
                        },
                        { 
                            text: "不答应复合", 
                            effects: { health: -10, happiness: -5 },
                            resultMessage: "对方非常生气，和你玩起了追逐战。"
                        }
                    ]
                }
            ],
            common: [
                {
                    title: "天气变化",
                    description: "今天天气很好，你想出去走走吗？",
                    choices: [
                        { 
                            text: "出去散步", 
                            effects: { health: -5, happiness: -5, charm: 5 },
                            resultMessage: "勾八这么热的天气出去散步，脑袋挖阔了。"
                        },
                        { 
                            text: "待在家里", 
                            effects: { wealth: -5, happiness: 5, health: -5},
                            resultMessage: "你选择在家喝可乐当肥宅，结果一不小心买了很多拼好饭。"
                        }
                    ]
                },
                {
                    title: "朋友聚会",
                    description: "朋友们邀请你参加聚会，你会去吗？",
                    choices: [
                        { 
                            text: "参加聚会", 
                            effects: { happiness: 10, wealth: -10, charm: 5 },
                            resultMessage: "你参加了朋友聚会。与朋友们聊天让你感到开心，社交能力也得到了提升，虽然花费了一些钱但很值得。",
                            risk: { probability: 20, message: "在聚会上你喝醉了，开车回家时发生了车祸，不幸身亡..." }
                        },
                        { 
                            text: "拒绝", 
                            effects: { },
                            resultMessage: "你拒绝了朋友的聚会邀请。虽然节省了时间和金钱，但也错过了与朋友相处的快乐时光。"
                        }
                    ]
                },
                {
                    title: "学习新技能",
                    description: "你想学习一个新的技能来提升自己。",
                    choices: [
                        { 
                            text: "学习新技能", 
                            effects: { happiness: -5, wealth: 5, charm: 5 },
                            resultMessage: "你决定学习新技能。虽然学习过程有些辛苦，但掌握新技能让你在工作和生活中更有自信。",
                            risk: { probability: 30, message: "996牛马回家后还天天学习新技能，阎王看见你都得说一句：你小子真牛逼" }
                        },
                        { 
                            text: "保持现状", 
                            effects: { happiness: 5 },
                            resultMessage: "你选择保持现状，没有学习新技能。虽然避免了学习的辛苦，但也错失了一个提升自己的机会。"
                        }
                    ]
                },
                {
                    title: "健康生活",
                    description: "你决定开始健康的生活方式。",
                    choices: [
                        { 
                            text: "人家再也不去酒吧玩惹，天天下班去健身房", 
                            effects: { health: 10, happiness: 0, charm: 5 },
                            resultMessage: "你开始了健康的生活方式。规律的运动让你的身体更加健康，精神状态也变得更加积极。",
                            risk: { probability: 30, message: "你因为过度运动而猝死，人生提前结束..." }
                        },
                        { 
                            text: "继续现状", 
                            effects: { health: -5 },
                            resultMessage: "你选择继续现状，没有开始健康的生活方式。缺乏运动让你的健康状况逐渐下降。"
                        }
                    ]
                },
                {
                    title: "慈善捐赠",
                    description: "你看到有人在为贫困儿童募捐。",
                    choices: [
                        { 
                            text: "捐款", 
                            effects: { happiness: 5, wealth: -10, charm: 5 },
                            resultMessage: "你决定捐款帮助贫困儿童。虽然花费了一些钱，但帮助他人的快乐让你感到满足，个人魅力也得到了提升。"
                        },
                        { 
                            text: "路过", 
                            effects: { },
                            resultMessage: "你选择路过，没有捐款。虽然节省了钱，但错过了一个帮助他人的机会，内心有些愧疚。"
                        }
                    ]
                },
                {
                    title: "社交活动",
                    description: "你被邀请参加一个重要的社交活动。",
                    choices: [
                        { 
                            text: "参加活动", 
                            effects: { charm: 5, happiness: 5, wealth: -10 },
                            resultMessage: "你参加了社交活动。在活动中你认识了很多新朋友，社交能力得到了提升，也为未来的发展创造了机会。"
                        },
                        { 
                            text: "拒绝邀请", 
                            effects: { charm: -5, happiness: 5 },
                            resultMessage: "你拒绝了社交活动的邀请。虽然避免了社交的压力，但也错过了扩展人脉和提升社交能力的机会。"
                        }
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
                if (this.gameState.gender === 'quit') {
                    this.endGame('你选择了退出游戏，人生还未开始就已结束...');
                } else {
                    this.startGame();
                }
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
        this.initializeRandomStats();
        this.updateCharacter();
        this.startTimer();
        this.updateUI();
        this.startBGM();
    }

    initializeRandomStats() {
        // 随机生成30-60之间的属性值
        this.gameState.health = Math.floor(Math.random() * 31) + 30; // 30-60
        this.gameState.happiness = Math.floor(Math.random() * 31) + 30; // 30-60
        this.gameState.wealth = Math.floor(Math.random() * 31) + 30; // 30-60
        this.gameState.charm = Math.floor(Math.random() * 31) + 30; // 30-60
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

    pauseTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    resumeTimer() {
        if (this.gameState.isGameRunning && !this.gameTimer) {
            this.startTimer();
        }
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
        
        // 检查属性阈值
        this.checkAttributeThresholds();
        
        // 检查特殊事件
        if (this.gameState.currentYear === 9 && this.gameState.currentMonth === 6) {
            this.triggerSpecialEvent();
        }
        
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
        
        // 暂停时间
        this.pauseTimer();
        
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
                this.makeChoice(choice);
            });
            choicesContainer.appendChild(button);
        });
        
        choicesContainer.style.display = 'flex';
    }

    makeChoice(choice) {
        // 检查是否有风险
        if (choice.risk) {
            let shouldTriggerRisk = false;
            
            // 如果有条件函数，检查条件
            if (choice.risk.condition) {
                shouldTriggerRisk = choice.risk.condition();
            } else {
                // 否则使用概率
                const random = Math.random() * 100;
                shouldTriggerRisk = random < choice.risk.probability;
            }
            
            if (shouldTriggerRisk) {
                // 触发风险，直接结束游戏
                this.endGame(choice.risk.message);
                return;
            }
        }

        // 应用选择的效果
        Object.keys(choice.effects).forEach(stat => {
            this.gameState[stat] = Math.max(0, Math.min(100, this.gameState[stat] + choice.effects[stat]));
        });

        // 隐藏选择按钮
        document.getElementById('event-choices').style.display = 'none';
        
        // 显示选择结果
        const resultMessage = typeof choice.resultMessage === 'function' ? choice.resultMessage() : choice.resultMessage;
        this.updateEventDisplay(resultMessage);
        
        this.currentEvent = null;
        this.updateUI();
        
        // 恢复时间流逝
        this.resumeTimer();
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
        this.updateStatBar('charm', this.gameState.charm);
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
            this.pauseTimer();
        }
    }

    hideSettings() {
        this.showScreen('game-screen');
        if (this.gameState.isGameRunning) {
            this.resumeTimer();
        }
    }

    endGame(message = null) {
        clearInterval(this.gameTimer);
        this.gameState.isGameRunning = false;
        
        // 更新最终统计
        document.getElementById('final-age').textContent = `${this.gameState.age}岁`;
        document.getElementById('final-health').textContent = this.gameState.health;
        document.getElementById('final-happiness').textContent = this.gameState.happiness;
        document.getElementById('final-wealth').textContent = this.gameState.wealth;
        document.getElementById('final-charm').textContent = this.gameState.charm;
        
        // 如果有自定义消息，更新结束界面
        if (message) {
            const endScreen = document.getElementById('end-screen');
            const title = endScreen.querySelector('h2');
            title.textContent = '人生结束';
            
            // 添加结束消息
            const finalStats = endScreen.querySelector('.final-stats');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'end-message';
            messageDiv.innerHTML = `<p>${message}</p>`;
            finalStats.appendChild(messageDiv);
        }
        
        this.showScreen('end-screen');
    }

    restartGame() {
        // 重置游戏状态
        this.gameState = {
            gender: '',
            currentYear: 1,
            currentMonth: 1,
            age: 0,
            health: 100,
            happiness: 100,
            wealth: 100,
            charm: 100,
            eventProbability: this.gameState.eventProbability,
            gameSpeed: this.gameState.gameSpeed,
            isGameRunning: false
        };
        
        this.currentEvent = null;
        this.updateUI();
        this.updateCharacter();
        this.updateEventDisplay('人生重新开始了...');
        document.getElementById('event-choices').style.display = 'none';
        
        // 清理结束界面的自定义消息
        const endScreen = document.getElementById('end-screen');
        const existingMessage = endScreen.querySelector('.end-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 返回到开始界面
        this.showScreen('start-screen');
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

    checkAttributeThresholds() {
        const { health, happiness, wealth, charm } = this.gameState;
        
        if (health <= 30) {
            this.endGame('你的健康值过低，身体无法支撑，人生提前结束...');
            return;
        }
        
        if (happiness <= 30) {
            this.endGame('你的快乐值过低，精神崩溃，人生提前结束...');
            return;
        }
        
        if (wealth <= 30) {
            this.endGame('你的财富值过低，生活无法维持，人生提前结束...');
            return;
        }
        
        if (charm <= 30) {
            this.endGame('你的魅力值过低，人际关系破裂，人生提前结束...');
            return;
        }
    }

    triggerSpecialEvent() {
        const specialEvent = {
            title: "人生转折点",
            description: "在第9年，你爸妈实在忍不住了，要求你一定要结婚，不然就断绝关系",
            choices: [
                { 
                    text: "不答应", 
                    effects: { health: -20, happiness: -20, wealth: -20, charm: -20 },
                    resultMessage: () => {
                        if (this.gameState.charm > 70 && this.gameState.wealth > 70) {
                            return "你不同意，因为你有钱有颜，你父母也奈何不了你";
                        } else {
                            return "虽然你不想结婚，但是因为你太丑了，所以也找不到对象。";
                        }
                    },
                    risk: { 
                        probability: 100, 
                        message: "结局：孤独终老。",
                        condition: () => this.gameState.charm <= 70 && this.gameState.wealth <= 70 
                    }
                },
                { 
                    text: "答应", 
                    effects: { health: 10, happiness: 10, wealth: 10, charm: 10 },
                    resultMessage: "你同意父母的要求，结婚生了三胎，成为根正苗红的好孩儿。",
                    risk: { probability: 100, message: "结局：30岁自动变直" }
                }
            ]
        };
        
        this.currentEvent = specialEvent;
        
        // 暂停时间
        this.pauseTimer();
        
        this.updateEventDisplay(specialEvent.description);
        this.showEventChoices(specialEvent.choices);
        this.playEventSound();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new LifeSimulator();
}); 