const app = getApp();
const { levels } = require('../../utils/levels.js');

Page({
  data: {
    knowledgeList: [],
    categories: ['全部', '杠杆', '滑轮', '浮力', '光影', '声学', '力学'],
    selectedCategory: '全部',
    searchKeyword: ''
  },

  onLoad() {
    this.loadKnowledge();
  },

  onShow() {
    this.loadKnowledge();
  },

  loadKnowledge() {
    let knowledgeList = [];
    
    levels.forEach(level => {
      level.knowledge.forEach((item, index) => {
        knowledgeList.push({
          id: `${level.id}_${index}`,
          levelId: level.id,
          levelTitle: level.title,
          levelIcon: level.icon,
          title: item.title,
          content: item.content,
          category: level.title
        });
      });
    });

    this.setData({ knowledgeList });
    this.filterKnowledge();
  },

  filterKnowledge() {
    let filtered = this.data.knowledgeList;

    if (this.data.selectedCategory !== '全部') {
      filtered = filtered.filter(item => item.category === this.data.selectedCategory);
    }

    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
      );
    }

    this.setData({ filteredKnowledge: filtered });
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ selectedCategory: category });
    this.filterKnowledge();
  },

  onSearch(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.filterKnowledge();
  },

  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?levelId=${item.levelId}&knowledgeIndex=${item.id.split('_')[1]}`
    });
  },

  toggleFavorite(e) {
    const item = e.currentTarget.dataset.item;
    let favorites = wx.getStorageSync('favorites') || [];
    const index = favorites.findIndex(f => f.id === item.id);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(item);
    }
    
    wx.setStorageSync('favorites', favorites);
    this.filterKnowledge();
    
    wx.showToast({
      title: index > -1 ? '已取消收藏' : '已添加收藏',
      icon: 'success'
    });
  },

  isFavorite(item) {
    const favorites = wx.getStorageSync('favorites') || [];
    return favorites.some(f => f.id === item.id);
  }
});
