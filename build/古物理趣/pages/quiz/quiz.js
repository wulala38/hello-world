const app = getApp();
const { levels } = require('../../utils/levels.js');

Page({
  data: {
    level: {},
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    answered: false,
    correct: false,
    score: 0,
    totalScore: 0,
    showResult: false
  },

  onLoad(options) {
    const levelId = options.levelId || app.globalData.currentLevel?.id;
    
    if (!levelId) {
      wx.showToast({
        title: '未选择关卡',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    const level = levels.find(l => l.id === levelId);
    
    if (level) {
      this.setData({
        level,
        questions: level.quiz || [],
        totalScore: (level.quiz || []).length * 20
      });
    }
  },

  selectAnswer(e) {
    if (this.data.answered) return;
    
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedAnswer: index,
      answered: true
    });

    const currentQuestion = this.data.questions[this.data.currentIndex];
    const correct = index === currentQuestion.answer;
    
    if (correct) {
      this.setData({
        correct: true,
        score: this.data.score + 20
      });
      this.playSuccessSound();
    } else {
      this.setData({ correct: false });
      this.playErrorSound();
    }
  },

  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1;
    
    if (nextIndex < this.data.questions.length) {
      this.setData({
        currentIndex: nextIndex,
        selectedAnswer: null,
        answered: false,
        correct: false
      });
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    const passed = this.data.score >= this.data.totalScore * 0.6;
    
    this.setData({ showResult: true });
    
    if (passed) {
      app.updateLevelProgress(this.data.level.id, {
        quizCompleted: true,
        quizScore: this.data.score
      });
      app.checkAchievements();
    }
  },

  playSuccessSound() {
    wx.vibrateShort();
    wx.showToast({
      title: '回答正确！',
      icon: 'success'
    });
  },

  playErrorSound() {
    wx.vibrateShort({ type: 'heavy' });
  },

  goToKnowledgeCard() {
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?levelId=${this.data.level.id}`
    });
  },

  shareResult() {
    wx.navigateTo({
      url: `/pages/poster/poster?levelId=${this.data.level.id}&score=${this.data.score}&type=quiz`
    });
  },

  retryQuiz() {
    this.setData({
      currentIndex: 0,
      selectedAnswer: null,
      answered: false,
      correct: false,
      score: 0,
      showResult: false
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
