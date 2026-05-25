const app = getApp();

const levels = [
  {
    id: 'lever',
    title: '杠杆原理',
    icon: '⚖️',
    description: '探索天平与秤杆的奥秘',
    difficulty: '入门',
    duration: '10分钟',
    background: '在古代，人们使用各种杠杆工具来称量货物、提起重物。从天平的平衡到杆秤的运用，都蕴含着深刻的物理原理。',
    ancientExample: '曹冲称象',
    scene: '古时集市',
    completed: false,
    score: 0,
    knowledge: [
      {
        title: '什么是杠杆',
        content: '杠杆是最简单的机械之一，由一根可以绕固定点（支点）转动的硬棒组成。'
      },
      {
        title: '杠杆的三个点',
        content: '支点：杠杆绕着转动的固定点；用力点：施加力的位置；阻力点：承受力的位置。'
      },
      {
        title: '杠杆原理',
        content: '动力×动力臂 = 阻力×阻力臂'
      }
    ],
    quiz: [
      {
        question: '杠杆的支点一定在中间吗？',
        options: ['一定在中间', '不一定在中间', '一定在一端'],
        answer: 1,
        explanation: '支点的位置可以变化，根据实际需要可以放在中间、一端或其他位置。'
      },
      {
        question: '使用杠杆一定能省力吗？',
        options: ['一定能', '不一定，要看支点位置', '一定不能'],
        answer: 1,
        explanation: '当动力臂大于阻力臂时省力，动力臂小于阻力臂时费力。'
      }
    ]
  },
  {
    id: 'pulley',
    title: '滑轮系统',
    icon: '🔧',
    description: '体验定滑轮与动滑轮的组合',
    difficulty: '初级',
    duration: '12分钟',
    background: '滑轮是古代建筑中常用的机械装置。通过滑轮的组合，可以改变力的方向或省力。古代工匠利用滑轮系统建造了众多宏伟建筑。',
    ancientExample: '都江堰',
    scene: '古代工地',
    completed: false,
    score: 0,
    knowledge: [
      {
        title: '定滑轮',
        content: '轴固定不动的滑轮，只能改变力的方向，不能省力。'
      },
      {
        title: '动滑轮',
        content: '轴随重物移动的滑轮，可以省一半的力。'
      },
      {
        title: '滑轮组',
        content: '定滑轮和动滑轮的组合，既能改变方向又能省力。'
      }
    ],
    quiz: [
      {
        question: '定滑轮的作用是什么？',
        options: ['省力', '改变力的方向', '既省力又改变方向'],
        answer: 1,
        explanation: '定滑轮虽然不能省力，但可以改变力的方向，这在实际应用中非常有用。'
      },
      {
        question: '使用动滑轮提起重物，能省多少力？',
        options: ['省一半的力', '省三分之一的力', '不省力'],
        answer: 0,
        explanation: '动滑轮可以省一半的力，但要多移动一倍的距离。'
      }
    ]
  },
  {
    id: 'buoyancy',
    title: '浮力原理',
    icon: '🌊',
    description: '感受阿基米德原理的神奇',
    difficulty: '初级',
    duration: '15分钟',
    background: '浮力原理是人类认识自然的重要里程碑。古代工匠利用浮力原理制造船只，让人类得以探索更广阔的世界。',
    ancientExample: '郑和下西洋',
    scene: '古代港口',
    completed: false,
    score: 0,
    knowledge: [
      {
        title: '浮力的产生',
        content: '物体在液体中受到向上和向下的压力差，这个压力差就是浮力。'
      },
      {
        title: '阿基米德原理',
        content: '物体在液体中受到的浮力等于它排开液体的重力。'
      },
      {
        title: '浮沉条件',
        content: '当浮力大于重力时物体上浮，当浮力小于重力时物体下沉。'
      }
    ],
    quiz: [
      {
        question: '一个空心金属球能浮在水面上吗？',
        options: ['一定能', '不一定，要看空心程度', '一定不能'],
        answer: 1,
        explanation: '只要空心部分足够大，使平均密度小于水的密度，球就能浮起来。'
      },
      {
        question: '浮力的大小与什么有关？',
        options: ['物体重量', '排开液体的体积', '液体颜色'],
        answer: 1,
        explanation: '根据阿基米德原理，浮力等于物体排开液体的重力，与液体密度和排开体积有关。'
      }
    ]
  },
  {
    id: 'optics',
    title: '光影奥秘',
    icon: '💡',
    description: '揭开小孔成像与镜面反射的秘密',
    difficulty: '中级',
    duration: '15分钟',
    background: '光学的应用在古代已经达到很高的水平。从铜镜到透镜，从日晷到小孔成像，古人对光的研究令人惊叹。',
    ancientExample: '墨经记载',
    scene: '古代天文台',
    completed: false,
    score: 0,
    knowledge: [
      {
        title: '光的直线传播',
        content: '光在同一种均匀介质中沿直线传播。'
      },
      {
        title: '小孔成像',
        content: '光沿直线传播通过小孔，在另一侧形成倒立的像。'
      },
      {
        title: '平面镜成像',
        content: '平面镜中的像是虚像，像与物体关于镜面对称。'
      }
    ],
    quiz: [
      {
        question: '小孔成像形成的是什么像？',
        options: ['正立的虚像', '倒立的实像', '放大的虚像'],
        answer: 1,
        explanation: '小孔成像形成的是倒立的实像，大小与物距和像距有关。'
      },
      {
        question: '平面镜成像的特点是什么？',
        options: ['像比物大', '像与物左右相反', '像在镜子后面'],
        answer: 1,
        explanation: '平面镜成像是等大的虚像，像与物体左右相反。'
      }
    ]
  },
  {
    id: 'acoustics',
    title: '声学原理',
    icon: '🎵',
    description: '探索声音的传播与共振现象',
    difficulty: '中级',
    duration: '12分钟',
    background: '古代建筑中蕴含着丰富的声学原理。从天坛的回音壁到各种乐器，古人在声学方面的成就令人称奇。',
    ancientExample: '天坛回音壁',
    scene: '古代宫殿',
    completed: false,
    score: 0,
    knowledge: [
      {
        title: '声音的产生',
        content: '声音由物体振动产生，正在发声的物体叫声源。'
      },
      {
        title: '声音的传播',
        content: '声音需要介质来传播，在固体、液体、气体中都能传播。'
      },
      {
        title: '声音的反射',
        content: '声音遇到障碍物会反射回来，形成回声。'
      }
    ],
    quiz: [
      {
        question: '声音在以下哪种介质中传播最快？',
        options: ['空气', '水', '钢铁'],
        answer: 2,
        explanation: '声音在固体中传播最快，其次是液体，最慢是气体。'
      },
      {
        question: '为什么古代城墙可以传声很远？',
        options: ['城墙很厚', '固体传声效果好', '城墙很光滑'],
        answer: 1,
        explanation: '声音在固体中传播衰减小、速度快，所以能传得很远。'
      }
    ]
  },
  {
    id: 'mechanics',
    title: '力学应用',
    icon: '⚙️',
    description: '理解斜面、齿轮与机械传动',
    difficulty: '高级',
    duration: '18分钟',
    background: '力学是古代机械工程的基础。从水车到浑天仪，从指南车到记里鼓车，都展示了古人在力学应用上的智慧。',
    ancientExample: '张衡地动仪',
    scene: '古代作坊',
    completed: false,
    score: 0,
    knowledge: [
      {
        title: '斜面原理',
        content: '使用斜面可以省力，但要多移动距离。斜面省力程度与斜面坡度有关。'
      },
      {
        title: '齿轮传动',
        content: '齿轮可以传递动力，改变转速和方向。'
      },
      {
        title: '简单机械组合',
        content: '将多种简单机械组合使用，可以完成复杂的任务。'
      }
    ],
    quiz: [
      {
        question: '使用斜面一定能省力吗？',
        options: ['一定能', '不一定', '一定不能'],
        answer: 0,
        explanation: '斜面一定省力，但省力程度与斜面的坡度有关，坡度越小越省力。'
      },
      {
        question: '齿轮传动中，两个齿轮的齿数不同会产生什么效果？',
        options: ['改变方向', '改变转速', '改变大小'],
        answer: 1,
        explanation: '齿轮传动可以改变转速，齿数少的齿轮转得快，齿数多的齿轮转得慢。'
      }
    ]
  }
];

Page({
  data: {
    levels: levels,
    levelProgress: {}
  },

  onLoad() {
    this.loadLevelProgress();
  },

  onShow() {
    this.loadLevelProgress();
  },

  loadLevelProgress() {
    const levelProgress = app.globalData.levelProgress;
    const levelsWithProgress = this.data.levels.map(level => ({
      ...level,
      completed: levelProgress[level.id]?.completed || false,
      score: levelProgress[level.id]?.score || 0
    }));

    this.setData({
      levels: levelsWithProgress,
      levelProgress
    });
  },

  goToLevel(e) {
    const level = e.currentTarget.dataset.level;
    app.globalData.currentLevel = level;

    wx.navigateTo({
      url: `/pages/level-detail/level-detail?levelId=${level.id}`
    });
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
