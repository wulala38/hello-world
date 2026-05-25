const app = getApp();

Page({
  data: {
    isConnected: false,
    completedLevels: 0,
    achievementCount: 0,
    totalScore: 0,
    progressPercent: 0
  },

  onLoad() {
    this.checkConnectionStatus();
    this.loadUserProgress();
  },

  onShow() {
    this.checkConnectionStatus();
    this.loadUserProgress();
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: '首页'
    });
  },

  checkConnectionStatus() {
    this.setData({
      isConnected: app.globalData.isConnected
    });
  },

  loadUserProgress() {
    try {
      const levelProgress = app.globalData.levelProgress || {};
      const achievements = app.globalData.achievements || [];

      const completedCount = Object.keys(levelProgress).filter(
        key => levelProgress[key].completed
      ).length;

      const score = Object.values(levelProgress).reduce(
        (sum, level) => sum + (level.score || 0), 0
      );

      const totalLevels = 6;
      const progressPercent = Math.round((completedCount / totalLevels) * 100);

      this.setData({
        completedLevels: completedCount,
        achievementCount: achievements.length,
        totalScore: score,
        progressPercent: progressPercent
      });
    } catch (e) {
      console.error('加载用户进度失败:', e);
    }
  },

  navigateToBluetooth() {
    wx.navigateTo({
      url: '/pages/bluetooth/bluetooth'
    });
  },

  startExperience() {
    if (!this.data.isConnected) {
      wx.showModal({
        title: '提示',
        content: '请先连接密室设备',
        confirmText: '去连接',
        success: (res) => {
          if (res.confirm) {
            this.navigateToBluetooth();
          }
        }
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/levels/levels'
    });
  },

  scanQRCode() {
    wx.scanCode({
      success: (res) => {
        const result = res.result;
        if (result && result.includes('level=')) {
          const levelId = result.split('level=')[1];
          wx.navigateTo({
            url: `/pages/level-detail/level-detail?levelId=${levelId}`
          });
        } else {
          wx.showToast({
            title: '无效的二维码',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    });
  },

  navigateToKnowledge() {
    wx.switchTab({
      url: '/pages/knowledge/knowledge'
    });
  }
});
