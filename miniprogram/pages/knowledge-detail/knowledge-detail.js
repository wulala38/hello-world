const app = getApp();
const { levels } = require('../../utils/levels.js');

Page({
  data: {
    level: {},
    knowledgeItem: {},
    relatedKnowledge: []
  },

  onLoad(options) {
    const levelId = options.levelId;
    const knowledgeIndex = parseInt(options.knowledgeIndex) || 0;
    
    const level = levels.find(l => l.id === levelId);
    
    if (level) {
      this.setData({
        level,
        knowledgeItem: level.knowledge[knowledgeIndex] || level.knowledge[0],
        relatedKnowledge: level.knowledge.filter((k, i) => i !== knowledgeIndex)
      });
    } else {
      wx.showToast({
        title: '知识不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  viewRelated(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.relatedKnowledge[index];
    const level = this.data.level;
    const itemIndex = level.knowledge.findIndex(k => k.title === item.title);
    
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?levelId=${level.id}&knowledgeIndex=${itemIndex}`
    });
  },

  toggleFavorite() {
    const item = {
      id: `${this.data.level.id}_${this.data.level.knowledge.findIndex(k => k.title === this.data.knowledgeItem.title)}`,
      levelId: this.data.level.id,
      levelTitle: this.data.level.title,
      levelIcon: this.data.level.icon,
      title: this.data.knowledgeItem.title,
      content: this.data.knowledgeItem.content,
      category: this.data.level.title
    };

    let favorites = wx.getStorageSync('favorites') || [];
    const index = favorites.findIndex(f => f.id === item.id);
    
    if (index > -1) {
      favorites.splice(index, 1);
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    } else {
      favorites.push(item);
      wx.showToast({
        title: '已添加收藏',
        icon: 'success'
      });
    }
    
    wx.setStorageSync('favorites', favorites);
    this.setData({ isFavorite: index === -1 });
  },

  shareKnowledge() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onShareAppMessage() {
    return {
      title: `【古物理趣】${this.data.level.title} - ${this.data.knowledgeItem.title}`,
      path: `/pages/knowledge-detail/knowledge-detail?levelId=${this.data.level.id}`,
      imageUrl: '/images/share-knowledge.png'
    };
  }
});
