const app = getApp();
const { levels } = require('../../utils/levels.js');

Page({
  data: {
    level: {},
    score: 0,
    type: 'level',
    posterPath: '',
    isGenerating: false
  },

  onLoad(options) {
    const levelId = options.levelId;
    const score = parseInt(options.score) || 0;
    const type = options.type || 'level';

    const level = levels.find(l => l.id === levelId);

    if (level) {
      this.setData({
        level,
        score,
        type
      });
    }
  },

  async generatePoster() {
    if (this.data.isGenerating) return;
    
    this.setData({ isGenerating: true });

    wx.showLoading({
      title: '正在生成海报...',
      mask: true
    });

    try {
      const poster = await this.createPosterImage();
      
      this.setData({
        posterPath: poster,
        isGenerating: false
      });

      wx.hideLoading();
      wx.showToast({
        title: '海报生成成功',
        icon: 'success'
      });
    } catch (err) {
      wx.hideLoading();
      this.setData({ isGenerating: false });
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      });
      console.error('海报生成失败:', err);
    }
  },

  createPosterImage() {
    return new Promise((resolve, reject) => {
      const ctx = wx.createCanvasContext('poster-canvas');
      const width = 600;
      const height = 900;

      ctx.fillStyle = '#FFF8DC';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, 300);
      gradient.addColorStop(0, '#8B4513');
      gradient.addColorStop(1, '#A0522D');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, 300);

      ctx.setFillStyle('#FFFFFF');
      ctx.beginPath();
      ctx.arc(width / 2, 200, 80, 0, 2 * Math.PI);
      ctx.fill();

      ctx.setFontSize(60);
      ctx.setFillStyle('#8B4513');
      ctx.setTextAlign('center');
      ctx.fillText(this.data.level.icon || '⚙️', width / 2, 220);

      ctx.setFontSize(40);
      ctx.setFillStyle('#FFFFFF');
      ctx.fillText('古物理趣', width / 2, 320);

      ctx.setFontSize(28);
      ctx.fillText('古代物理密室科普助手', width / 2, 360);

      ctx.setFontSize(32);
      ctx.setFillStyle('#2F1810');
      ctx.fillText(`已完成：${this.data.level.title}`, width / 2, 450);

      ctx.setFontSize(28);
      ctx.setFillStyle('#5D4037');
      ctx.fillText(`获得积分：${this.data.score}分`, width / 2, 500);

      ctx.setFillStyle('#F5DEB3');
      ctx.fillRect(50, 540, width - 100, 2);

      ctx.setFontSize(24);
      ctx.setFillStyle('#8B4513');
      const tips = [
        '探索古代智慧的奥秘',
        '让科学更有趣',
        '关注公众号：古物理趣'
      ];
      tips.forEach((tip, index) => {
        ctx.fillText(tip, width / 2, 600 + index * 40);
      });

      ctx.setFillStyle('#DAA520');
      ctx.beginPath();
      ctx.arc(100, 800, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width - 100, 800, 30, 0, 2 * Math.PI);
      ctx.fill();

      ctx.setFillStyle('#8B4513');
      ctx.beginPath();
      ctx.arc(width / 2, 850, 40, 0, 2 * Math.PI);
      ctx.fill();
      ctx.setFontSize(30);
      ctx.setFillStyle('#FFFFFF');
      ctx.fillText('☯', width / 2, 860);

      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'poster-canvas',
          success: (res) => {
            resolve(res.tempFilePath);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    });
  },

  saveToAlbum() {
    if (!this.data.posterPath) {
      wx.showToast({
        title: '请先生成海报',
        icon: 'none'
      });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterPath,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  },

  shareToWechat() {
    wx.showShareMenu({
      withShareTicket: true
    });

    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none'
    });
  },

  onShareAppMessage() {
    return {
      title: `【古物理趣】我完成了${this.data.level.title}关卡，获得${this.data.score}分！`,
      path: `/pages/level-detail/level-detail?levelId=${this.data.level.id}`,
      imageUrl: this.data.posterPath || '/images/share-default.png'
    };
  }
});
