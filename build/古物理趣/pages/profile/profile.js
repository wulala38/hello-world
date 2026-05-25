const app = getApp();
const { levels } = require('../../utils/levels.js');

const achievements = [
  { id: 'first_step', name: '初出茅庐', icon: '🌱', description: '完成第一个关卡', condition: 'levelCount >= 1' },
  { id: 'explorer', name: '探索者', icon: '🔍', description: '完成3个关卡', condition: 'levelCount >= 3' },
  { id: 'master', name: '物理学大师', icon: '🏆', description: '完成全部关卡', condition: 'levelCount >= 6' },
  { id: 'scholar', name: '博学者', icon: '📚', description: '学习全部知识', condition: 'knowledgeCount >= 12' },
  { id: 'quiz_master', name: '答题高手', icon: '🧠', description: '答题正确率100%', condition: 'quizAccuracy >= 100' },
  { id: 'collector', name: '收藏家', icon: '❤️', description: '收藏10个知识', condition: 'favoriteCount >= 10' }
];

Page({
  data: {
    userInfo: {},
    levelProgress: {},
    achievements: achievements,
    unlockedAchievements: [],
    statistics: {
      completedLevels: 0,
      totalScore: 0,
      quizCorrect: 0,
      quizTotal: 0,
      studyTime: 0,
      favoriteCount: 0
    },
    menuItems: [
      { id: 'history', icon: '📜', title: '历史记录', path: '/pages/history/history' },
      { id: 'favorites', icon: '❤️', title: '我的收藏', path: '/pages/favorites/favorites' },
      { id: 'feedback', icon: '💬', title: '意见反馈', path: '/pages/feedback/feedback' },
      { id: 'about', icon: 'ℹ️', title: '关于我们', path: '/pages/about/about' }
    ]
  },

  onLoad() {
    this.loadUserData();
  },

  onShow() {
    this.loadUserData();
  },

  loadUserData() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const levelProgress = app.globalData.levelProgress || {};
    const achievements = app.globalData.achievements || [];
    const favorites = wx.getStorageSync('favorites') || [];

    const completedLevels = Object.keys(levelProgress).filter(
      key => levelProgress[key].completed
    ).length;

    const totalScore = Object.values(levelProgress).reduce(
      (sum, level) => sum + (level.score || 0), 0
    );

    const quizCorrect = Object.values(levelProgress).reduce(
      (sum, level) => sum + (level.quizScore ? level.quizScore / 20 : 0), 0
    );

    const unlockedAchievements = achievements.map(id => {
      return this.data.achievements.find(a => a.id === id);
    }).filter(Boolean);

    this.setData({
      userInfo: {
        nickname: userInfo.nickname || '探险家',
        avatar: userInfo.avatar || '/images/default-avatar.png'
      },
      levelProgress,
      unlockedAchievements,
      statistics: {
        completedLevels,
        totalScore,
        quizCorrect: Math.round(quizCorrect),
        quizTotal: completedLevels * 2,
        studyTime: userInfo.studyTime || 0,
        favoriteCount: favorites.length
      }
    });
  },

  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        const userInfo = {
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          studyTime: this.data.userInfo.studyTime || 0
        };
        
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        
        this.setData({ userInfo });
        wx.showToast({
          title: '资料更新成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        });
      }
    });
  },

  viewLevelProgress() {
    wx.navigateTo({
      url: '/pages/levels/levels'
    });
  },

  viewAchievement() {
    wx.showModal({
      title: '成就徽章',
      content: this.getAchievementContent(),
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  getAchievementContent() {
    const unlocked = this.data.unlockedAchievements;
    const locked = this.data.achievements.filter(a => !unlocked.find(u => u.id === a.id));

    let content = '🏆 已解锁成就：\n';
    if (unlocked.length > 0) {
      unlocked.forEach(a => {
        content += `${a.icon} ${a.name}\n`;
      });
    } else {
      content += '暂无\n';
    }

    content += '\n🔒 未解锁成就：\n';
    locked.forEach(a => {
      content += `${a.icon} ${a.description}\n`;
    });

    return content;
  },

  navigateToMenu(e) {
    const item = e.currentTarget.dataset.item;
    
    if (item.id === 'history') {
      this.showHistory();
    } else if (item.id === 'favorites') {
      this.showFavorites();
    } else if (item.id === 'feedback') {
      this.showFeedback();
    } else if (item.id === 'about') {
      this.showAbout();
    }
  },

  showHistory() {
    const history = Object.entries(this.data.levelProgress)
      .map(([levelId, data]) => {
        const level = levels.find(l => l.id === levelId);
        return {
          levelId,
          levelName: level?.title || '未知关卡',
          levelIcon: level?.icon || '❓',
          ...data
        };
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);

    wx.showModal({
      title: '历史记录',
      content: history.length > 0 ? history.map(h => 
        `${h.levelIcon} ${h.levelName} - ${h.completed ? '已完成' : '进行中'} - ${h.score || 0}分`
      ).join('\n\n') : '暂无历史记录',
      showCancel: false,
      confirmText: '关闭'
    });
  },

  showFavorites() {
    const favorites = wx.getStorageSync('favorites') || [];
    
    if (favorites.length === 0) {
      wx.showToast({
        title: '暂无收藏',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '我的收藏',
      content: favorites.map(f => 
        `${f.levelIcon} ${f.title}`
      ).join('\n\n'),
      showCancel: false,
      confirmText: '关闭'
    });
  },

  showFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的支持！您可以通过以下方式反馈：\n\n📧 邮箱：feedback@guphy.com\n💬 微信公众号：古物理趣',
      confirmText: '我知道了'
    });
  },

  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '古物理趣 - 古代物理密室科普助手\n\n版本：1.0.0\n\n探索古代智慧的奥秘，让科学更有趣！',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  clearData() {
    wx.showModal({
      title: '清除数据',
      content: '确定要清除所有本地数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          app.globalData.levelProgress = {};
          app.globalData.achievements = [];
          app.globalData.userInfo = {};
          this.loadUserData();
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
        }
      }
    });
  }
});
