#!/bin/bash
# 古物理趣 - 项目打包脚本
# 用于创建完整可下载的微信小程序项目包

echo "=========================================="
echo "🏛️  古物理趣 - 项目打包工具"
echo "=========================================="

# 项目根目录
PROJECT_DIR=$(dirname "$0")
cd "$PROJECT_DIR" || exit 1

# 创建临时目录
BUILD_DIR="build/古物理趣"
mkdir -p "$BUILD_DIR"

echo "📦 正在复制项目文件..."

# 复制核心文件
cp -r miniprogram/* "$BUILD_DIR/" 2>/dev/null || true
cp project.config.json "$BUILD_DIR/" 2>/dev/null || true
cp package.json "$BUILD_DIR/" 2>/dev/null || true
cp README.md "$BUILD_DIR/" 2>/dev/null || true
cp USAGE.md "$BUILD_DIR/" 2>/dev/null || true

# 创建项目说明文件
cat > "$BUILD_DIR/使用说明.txt" << 'EOF'
=================================================================
古物理趣 - 古代物理密室科普助手
=================================================================

📋 项目文件结构：
├── miniprogram/          # 小程序主目录
│   ├── app.js            # 应用主逻辑
│   ├── app.json          # 应用配置
│   ├── app.wxss          # 全局样式
│   ├── sitemap.json      # 搜索引擎配置
│   ├── utils/            # 工具函数
│   └── pages/            # 页面目录
├── images/               # 图片资源目录
├── project.config.json   # 项目配置
├── README.md            # 项目说明
└── USAGE.md             # 使用指南

🚀 快速开始：

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择本文件夹作为项目目录
4. 填写AppID（使用测试号或正式号）
5. 点击"编译"按钮即可运行

⚠️  注意事项：
- 首次导入时需要配置AppID
- 图片资源为可选，小程序在无图情况下也能运行
- 蓝牙功能需要真机调试测试
- 详细说明请查看README.md和USAGE.md

📞 技术支持：
- 微信公众号：古物理趣
- 邮箱：feedback@guphy.com

=================================================================
EOF

echo "✅ 项目文件复制完成"

# 检查是否需要创建ZIP
if command -v zip &> /dev/null; then
    echo "📦 正在创建ZIP压缩包..."
    cd build && zip -r "古物理趣-完整项目.zip" "古物理趣/"
    cd ..
    echo "✅ ZIP压缩包创建完成：build/古物理趣-完整项目.zip"
else
    echo "⚠️  未找到zip命令，无法创建压缩包"
    echo "ℹ️  您可以直接打包 build/古物理趣/ 目录"
fi

echo "=========================================="
echo "🎉 打包完成！"
echo "📂 项目路径：$BUILD_DIR"
echo "=========================================="
