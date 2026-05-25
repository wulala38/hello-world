const app = getApp();
const { levels } = require('../../utils/levels.js');

Page({
  data: {
    level: {},
    levelId: '',
    isConnected: false,
    objectives: [],
    hintCountdown: 0,
    hintProgress: 0,
    hintStage: 0,
    showHint: false,
    currentHint: null,
    showModal: false,
    earnedScore: 0,
    newAchievement: null
  },

  onLoad(options) {
    const levelId = options.levelId;
    const level = levels.find(l => l.id === levelId);
    
    if (level) {
      this.setData({
        level,
        levelId,
        objectives: this.generateObjectives(level)
      });
      
      this.loadProgress();
    } else {
      wx.showToast({
        title: '关卡不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onShow() {
    this.setData({
      isConnected: app.globalData.isConnected
    });
  },

  onUnload() {
    app.stopHintTimer();
    if (this._bluetoothListener) {
      wx.offBluetoothConnectionStateChange(this._bluetoothListener);
    }
  },

  generateObjectives(level) {
    const baseObjectives = [
      { text: '了解' + level.title + '的基本原理', completed: false },
      { text: '完成密室互动机关', completed: false },
      { text: '解答相关问题', completed: false }
    ];
    return baseObjectives;
  },

  loadProgress() {
    const progress = app.globalData.levelProgress[this.data.levelId];
    if (progress) {
      const objectives = this.data.objectives.map((obj, index) => {
        if (index === 0 && progress.knowledgeViewed) obj.completed = true;
        if (index === 1 && progress.mechanismCompleted) obj.completed = true;
        if (index === 2 && progress.quizCompleted) obj.completed = true;
        return obj;
      });
      this.setData({ objectives });
    }
  },

  startLevel() {
    if (!this.data.isConnected) {
      wx.showToast({
        title: '请先连接设备',
        icon: 'none'
      });
      return;
    }

    this.listenToDevice();
    this.startHintSystem();
    this.updateObjective(1, true);
    
    wx.showToast({
      title: '开始挑战！',
      icon: 'success'
    });
  },

  listenToDevice() {
    this._bluetoothListener = (res) => {
      if (res.connected) {
        this.onMechanismSuccess();
      }
    };
    wx.onBLEConnectionStateChange(this._bluetoothListener);

    wx.onBLECharacteristicValueChange((res) => {
      const command = app.bufferToString(res.value);
      if (command === 'SUCCESS') {
        this.onMechanismSuccess();
      }
    });
  },

  onMechanismSuccess() {
    this.updateObjective(1, true);
    this.completeLevel();
  },

  completeLevel() {
    const score = Math.max(60, 100 - this.data.hintCountdown);
    this.setData({ earnedScore: score });

    app.updateLevelProgress(this.data.levelId, {
      completed: true,
      score: score,
      completedAt: Date.now()
    });

    app.checkAchievements();
    const achievements = app.globalData.achievements;
    
    const achievementNames = {
      'first_step': '初出茅庐',
      'explorer': '探索者',
      'master': '物理学大师'
    };
    
    this.setData({
      showModal: true,
      newAchievement: achievements.length > 0 ? achievementNames[achievements[achievements.length - 1]] : null
    });
  },

  startHintSystem() {
    let countdown = 0;
    this._hintInterval = setInterval(() => {
      countdown++;
      const progress = Math.min((countdown / 60) * 100, 100);
      const stage = countdown >= 60 ? 2 : countdown >= 30 ? 1 : 0;
      
      this.setData({
        hintCountdown: countdown,
        hintProgress: progress,
        hintStage: stage
      });

      if (countdown === 30) {
        this.showPrincipleHint();
      } else if (countdown === 60) {
        this.showStepHint();
      }
    }, 1000);
  },

  showPrincipleHint() {
    const level = this.data.level;
    const hint = {
      type: 'principle',
      content: level.knowledge[0]?.content || '这是一个基础的物理原理应用。'
    };
    
    this.setData({
      showHint: true,
      currentHint: hint
    });

    wx.showModal({
      title: '💡 原理提示',
      content: hint.content,
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  showStepHint() {
    const level = this.data.level;
    const steps = [
      '仔细观察机关的构造',
      '回忆相关的物理原理',
      '尝试不同的操作方式',
      '如果仍有困难，请寻求工作人员帮助'
    ];
    
    const hint = {
      type: 'step',
      content: '按照以下步骤尝试解决：',
      steps: steps
    };
    
    this.setData({
      currentHint: hint
    });

    wx.showModal({
      title: '📝 分步指引',
      content: steps.join('\n\n'),
      showCancel: false,
      confirmText: '我试试'
    });
  },

  triggerHint() {
    const hintTime = this.data.hintCountdown;
    
    if (hintTime < 30) {
      const remaining = 30 - hintTime;
      wx.showToast({
        title: `提示将在 ${remaining}s 后可用`,
        icon: 'none'
      });
    } else if (hintTime < 60) {
      this.showPrincipleHint();
    } else {
      this.showStepHint();
    }
  },

  updateObjective(index, completed) {
    const objectives = this.data.objectives;
    if (objectives[index]) {
      objectives[index].completed = completed;
      this.setData({ objectives });
    }
  },

  viewKnowledge() {
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?levelId=${this.data.levelId}`
    });
  },

  goToQuiz() {
    wx.navigateTo({
      url: `/pages/quiz/quiz?levelId=${this.data.levelId}`
    });
  },

  shareResult() {
    wx.navigateTo({
      url: `/pages/poster/poster?levelId=${this.data.levelId}&score=${this.data.earnedScore}`
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  preventBubble() {
    return false;
  }
});
