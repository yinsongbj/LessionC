# C语言开发视角全面教程 · 交互式教程

两种形态，**同一份内容**：

| 模式 | 入口 | 适合 |
| :- | :- | :- |
| **讲义模式** | `slides.html` | **投屏授课**：一页一屏、方向键翻页、逐页讲稿 |
| 阅读模式 | `index.html` | 自学与查阅：可滚动长文、侧边栏目录、搜索 |

按章节组织，代替传统 PPT。纯静态、零依赖、离线可用。

---

## 一、讲义模式（上课用）

双击 `slides.html` 即可开始讲。**共 99 页幻灯片**，14 章内容 + 3 个附录。

### 快捷键

| 键 | 作用 |
| :- | :- |
| `→` `空格` `PgDn` | 下一页 |
| `←` `PgUp` | 上一页 |
| `Home` / `End` | 首页 / 末页 |
| `N` | **讲稿面板**（右侧滑出，舞台自动避让） |
| `O` | **缩略图总览**（点任意页直接跳） |
| `T` | 深色 / 浅色 |
| `F` | 全屏 |
| `?` | 快捷键面板 |
| `Esc` | 关闭浮层 |

### 讲稿

**89 条讲稿，覆盖 92/99 页（93%）**。按 `N` 调出，讲稿写的是"这一页该怎么说"：

- 教学节奏（先演示错误还是先给正确写法）
- 要停下来让学员猜的地方
- 现场演示的操作
- 常见误区的纠正话术

讲稿按 `章节id::小节标题` 索引，改内容后对应关系不会错位。

### 版面

- 固定 **1600×900（16:9）** 舞台，按窗口等比缩放 —— 投屏时版面比例恒定，不会文字截断
- 进度条在舞台顶部，点击可跳任意页
- 深链：`slides.html#12` 直达第 12 页
- 代码块可复制，「预期输出」可折叠，练习答案点击展开

---

## 二、阅读模式（自学用）

见下方"三、快速开始"。侧边栏章节目录 + 搜索 + 阅读进度记录 + 深浅主题。

两种模式**共用同一套数据文件**（`chapters.js` / `exercises.js` / `outputs.js` / `notes.js`），内容改一处两边同步，不存在副本漂移。

---

## 三、快速开始

### 方式 1：双击打开（最简单）

双击 `index.html` 或 `slides.html`，浏览器直接打开。**不需要联网、不需要 Node、不需要任何构建步骤。**

### 方式 2：VS Code + Live Server（推荐，代码块可整段选中）

1. VS Code 打开 `tutorial/` 文件夹
2. 安装扩展 **Live Server**（ms-vscode.live-server）
3. 右键 `index.html` → **Open with Live Server**

> 为什么推荐 Live Server：`file://` 协议下浏览器会限制剪贴板 API，代码块的「复制」按钮可能失效。
> 走 http 就一切正常。

### 方式 3：起一个本地静态服务器

```bash
cd tutorial
python -m http.server 8000
# 然后访问 http://127.0.0.1:8000
```

---

## 四、文件结构

```
tutorial/
├── index.html          阅读模式页面
├── slides.html         讲义模式页面（投屏授课）
├── css/
│   ├── style.css       阅读模式样式
│   └── slides.css      讲义模式样式（16:9 舞台）
├── js/
│   ├── core.js         ★ 共享渲染层：转义/高亮/代码块/表格/提示框
│   ├── chapters.js     14 章全部内容数据
│   ├── exercises.js    练习题库（含折叠答案）
│   ├── notes.js        89 条逐页讲稿
│   ├── outputs.js      ★ 由 verify.js 实测生成，勿手改
│   ├── app.js          阅读模式引擎
│   └── slides.js       讲义模式引擎（分页/翻页/讲稿/总览）
└── tools/
    ├── verify.js       编译运行所有代码块，比对输出
    ├── test_site.js    阅读模式端到端验收（61 项）
    ├── test_slides.js  讲义模式端到端验收（56 项）
    ├── shot-state.js   截图辅助：生成带初始化的临时页
    └── preview-fig.js  单独预览内存示意图
```

> `core.js` 是两个模式共享的渲染层。改代码高亮、表格样式、提示框配色，只需改这一处。

---

## 五、代码可信度：全部 gcc 实测

这批代码**不是写完就算**：

- `tools/verify.js` 会把 `chapters.js` 里每个代码块写成 `.c` 文件
- 用 `gcc -std=c11 -Wall -Wextra -O2` 编译
- 有标准输入的喂入输入后运行，取真实 stdout
- 与页面展示的「预期输出」**逐字比对**
- 比对通过后重新生成 `js/outputs.js`（页面展示的就是这份实测输出）

```bash
node tools/verify.js
```

当前状态：**46 / 46 全部通过**，零非预期编译警告。

其中 3 个代码块**刻意保留 gcc 警告**，因为它们正是要讲的坑点：

| 块 | 警告 | 对应知识点 |
| :- | :- | :- |
| `c3_if` | `suggest parentheses around assignment used as truth value` | `if (x = 0)` 把赋值写成了比较 |
| `c3_switch` | `this statement may fall through` | switch 漏写 `break` 导致穿透 |
| `cA_silent` | `this statement may fall through` | 附录 A 的静默 bug 复现 |

---

## 六、把代码拿到 VS Code 里跑

1. 点代码块右上角「复制」
2. 在 VS Code 新建 `.c` 文件粘贴
3. 终端里编译运行：

```bash
gcc hello.c -o hello.exe
./hello.exe
```

需要读输入的程序（菜单类）在终端里按提示逐项输入即可。

**建议的编译参数**：`gcc -Wall -Wextra -g main.c -o main.exe`
- `-Wall -Wextra` —— 打开警告，本课程 80% 的坑编译器都能提前告诉你
- `-g` —— 生成调试信息，F5 单步才有效

---

## 七、端到端验收

```bash
node tools/test_site.js     # 阅读模式 61 项
node tools/test_slides.js   # 讲义模式 56 项
```

用 jsdom 真实加载页面，验证渲染、分页、路由、搜索、主题、翻页、讲稿、总览、进度、深链等。

---

## 八、几点设计说明

**为什么不用 Prism.js CDN**：教程要能离线在教室/自习室用。`core.js` 内置了
C / Shell / JSON 三套高亮器，输出的 class 名与 Prism 兼容（`token keyword` 等），
想换成 Prism 只需删掉内置实现改调 `Prism.highlightElement`。

**为什么讲义模式用固定 1600×900 舞台**：PPT 的版面比例是固定的，网页如果跟着窗口流式伸缩，
投影仪分辨率一变文字就换行了。固定舞台 + 等比缩放能保证**任何屏幕上版面完全一致**。

**为什么第 7 章的地址每次都不一样**：`&x` 打出来的是真实内存地址，每次运行都变。
示例特意加了一行 `&x == p ? 1` 来证明**两个地址永远相等**——这才是这段代码要证明的事。

**为什么有些示例看起来"报错"**：第 3 章的 `if (flag = 0)` 和漏 `break` 的 switch
是**故意留着的错误示范**，gcc 会在编译时点名。下一页的修正版本是正确写法。

