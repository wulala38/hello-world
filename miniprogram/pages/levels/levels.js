const app = getApp();
const { levels } = require('../../utils/levels.js');

Page({
  data: {
    levels: [],
    completedCount: 0,
    progressPercent: 0
  },

  onLoad() {
    this.setData({ levels });
    this.calculateProgress();
  },

  onShow() {
    this.calculateProgress();
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: '关卡选择'
    });
  },

  calculateProgress() {
    try {
      const levelProgress = app.globalData.levelProgress || {};
      const levelsWithProgress = this.data.levels.map(level => ({
        ...level,
        completed: levelProgress[level.id]?.completed || false,
        score: levelProgress[level.id]?.score || 0
      }));

      const completedCount = levelsWithProgress.filter(l => l.completed).length;
      const progressPercent = Math.round((completedCount / levelsWithProgress.length) * 100);

      this.setData({
        levels: levelsWithProgress,
        completedCount,
        progressPercent
      });
    } catch (e) {
      console.error('计算进度失败:', e);
    }
  },

  getDifficultyColor(difficulty) {
    const colors = {
      '入门': '#52c41a',
      '初级': '#1890ff',
      '中级': '#faad14',
      '高级': '#ff4d4f'
    };
    return colors[difficulty] || '#8B4513';
  }
});
