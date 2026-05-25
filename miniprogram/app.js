const app = getApp();

App({
  globalData: {
    userInfo: null,
    connectedDeviceId: null,
    serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
    characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
    isConnected: false,
    currentLevel: null,
    levelProgress: {},
    achievements: [],
    hintTimer: null,
    hintTime: 0
  },

  onLaunch() {
    this.initStorage();
    this.initBlueTooth();
  },

  initStorage() {
    try {
      const levelProgress = wx.getStorageSync('levelProgress') || {};
      const achievements = wx.getStorageSync('achievements') || [];
      const userInfo = wx.getStorageSync('userInfo') || {};

      this.globalData.levelProgress = levelProgress;
      this.globalData.achievements = achievements;
      this.globalData.userInfo = userInfo;
    } catch (e) {
      console.error('初始化存储失败:', e);
    }
  },

  initBlueTooth() {
    try {
      wx.onBluetoothAdapterStateChange((res) => {
        if (!res.available) {
          this.globalData.isConnected = false;
        }
      });

      wx.onBLEConnectionStateChange((res) => {
        if (!res.connected) {
          this.globalData.isConnected = false;
          this.globalData.connectedDeviceId = null;
        }
      });
    } catch (e) {
      console.error('初始化蓝牙失败:', e);
    }
  },

  updateLevelProgress(levelId, data) {
    const progress = this.globalData.levelProgress;
    progress[levelId] = {
      ...progress[levelId],
      ...data,
      updatedAt: Date.now()
    };
    this.globalData.levelProgress = progress;
    
    try {
      wx.setStorageSync('levelProgress', progress);
    } catch (e) {
      console.error('保存进度失败:', e);
    }
  },

  checkAchievements() {
    const achievements = this.globalData.achievements;
    const progress = this.globalData.levelProgress;
    const levelCount = Object.keys(progress).filter(
      key => progress[key].completed
    ).length;

    if (levelCount >= 1 && !achievements.includes('first_step')) {
      achievements.push('first_step');
    }
    if (levelCount >= 3 && !achievements.includes('explorer')) {
      achievements.push('explorer');
    }
    if (levelCount >= 6 && !achievements.includes('master')) {
      achievements.push('master');
    }

    this.globalData.achievements = achievements;
    
    try {
      wx.setStorageSync('achievements', achievements);
    } catch (e) {
      console.error('保存成就失败:', e);
    }
  }
});
