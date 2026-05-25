# 古物理趣 - 古代物理密室科普助手

## 项目简介

古物理趣是一款专为古代物理密室设计的微信小程序，为玩家提供游戏引导、物理知识学习、进度追踪和社交分享等功能。

## 功能特性

### 1. 首页模块
- ✅ 项目介绍展示
- ✅ 开始体验入口
- ✅ 扫码绑定功能
- ✅ 科普学习入口
- ✅ 进度统计概览

### 2. 蓝牙连接模块
- ✅ BLE5.0蓝牙通信支持
- ✅ 与密室Arduino机关实时通信
- ✅ 连接状态实时显示
- ✅ 自动重连机制
- ✅ 设备绑定和历史记录

### 3. 关卡系统
6大主题关卡：
- ⚖️ 杠杆原理
- 🔧 滑轮系统
- 🌊 浮力原理
- 💡 光影奥秘
- 🎵 声学原理
- ⚙️ 力学应用

每个关卡包含：
- ✅ 场景图
- ✅ 通关目标
- ✅ 背景介绍
- ✅ 古代典故

### 4. 智能提示系统
- ✅ 30秒：原理图文提示
- ✅ 60秒：分步操作指引
- ✅ 手动触发功能
- ✅ 实时倒计时显示

### 5. 科普知识库
- ✅ 对应各关卡的古代物理原理
- ✅ 文字说明
- ✅ 图解展示
- ✅ 分类浏览
- ✅ 搜索功能
- ✅ 收藏功能

### 6. 互动答题
- ✅ 每关2道题目
- ✅ 答对解锁知识卡片
- ✅ 即时反馈
- ✅ 积分系统

### 7. 进度成就系统
- ✅ 关卡进度追踪
- ✅ 6个成就徽章
- ✅ 学习数据统计
- ✅ 历史记录

### 8. 打卡分享
- ✅ 古风海报生成
- ✅ 微信分享
- ✅ 保存相册

### 9. 我的页面
- ✅ 个人信息
- ✅ 历史记录
- ✅ 收藏夹
- ✅ 意见反馈
- ✅ 数据管理

## 技术架构

### 前端框架
- 微信小程序原生开发
- WXML + WXSS + JavaScript

### 页面路由
- 4个tabBar页面（首页、关卡、知识库、我的）
- 5个独立页面

### 蓝牙通信
- wx.createBLEConnection
- wx.writeBLECharacteristicValue
- wx.onBLECharacteristicValueChange

### 数据存储
- 本地存储：wx.setStorageSync
- 全局状态管理

## 目录结构

```
miniprogram/
├── app.js                 # 应用主逻辑
├── app.json              # 应用配置
├── app.wxss              # 全局样式
├── sitemap.json          # sitemap配置
├── utils/
│   └── levels.js         # 关卡数据配置
├── pages/
│   ├── index/            # 首页
│   ├── bluetooth/         # 蓝牙连接
│   ├── levels/            # 关卡选择
│   ├── level-detail/      # 关卡详情
│   ├── knowledge/         # 科普知识库
│   ├── knowledge-detail/  # 知识详情
│   ├── quiz/              # 互动答题
│   ├── poster/            # 打卡分享
│   └── profile/           # 我的页面
└── images/                # 图片资源（需添加）
```

## 安装使用

### 1. 环境要求
- 微信开发者工具最新版
- 微信小程序AppID

### 2. 配置步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd 古物理趣
   ```

2. **导入项目**
   - 打开微信开发者工具
   - 选择"导入项目"
   - 选择项目根目录
   - 填写AppID（使用测试号或正式号）

3. **添加图片资源**
   需要添加以下图片资源到 `miniprogram/images/` 目录：
   - `logo.png` - 应用Logo
   - `home.png` / `home-active.png` - 首页图标
   - `levels.png` / `levels-active.png` - 关卡图标
   - `knowledge.png` / `knowledge-active.png` - 知识库图标
   - `profile.png` / `profile-active.png` - 我的图标
   - `default-avatar.png` - 默认头像

4. **配置权限**
   在 `app.json` 中已配置蓝牙权限：
   - `scope.bluetooth` - 蓝牙权限
   - `requiredBackgroundModes` - 后台蓝牙模式

### 3. 运行调试

1. 在微信开发者工具中点击"编译"
2. 选择模拟器或真机调试
3. 测试各个功能模块

## 蓝牙设备配置

### Arduino设备UUID
在 `app.js` 中配置：
```javascript
serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB'
```

### 通信协议
- 成功信号：`SUCCESS`
- 可根据实际需求扩展通信协议

## 扩展功能

### 添加新关卡
在 `utils/levels.js` 中添加新关卡：
```javascript
{
  id: 'new_level',
  title: '新关卡名称',
  icon: '🔮',
  // ... 其他配置
}
```

### 自定义成就
在 `pages/profile/profile.js` 的 achievements 数组中添加：
```javascript
{
  id: 'new_achievement',
  name: '新成就名称',
  icon: '🎖',
  description: '成就描述',
  condition: 'levelCount >= 10'
}
```

## 注意事项

1. **蓝牙权限**：真机调试需要在小程序设置中开启蓝牙权限
2. **网络请求**：部分功能需要连接微信服务器
3. **图片资源**：请根据实际需求添加合适的图片
4. **API配置**：如需后端支持，请配置相应的API地址

## 开发建议

1. 使用ES6+语法
2. 做好错误处理
3. 添加适当的日志
4. 优化用户体验
5. 做好数据备份

## 版本历史

### v1.0.0 (2024)
- 完成基础功能开发
- 实现6大主题关卡
- 集成蓝牙通信
- 实现智能提示系统
- 添加成就系统

## 联系方式

- 微信公众号：古物理趣
- 邮箱：feedback@guphy.com

## 许可证

MIT License

---

让科学更有趣！
