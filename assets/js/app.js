/* ============================================================
 * app.js — 《C语言极简开发入门》教案 Web 版 渲染与交互引擎
 * 零依赖，纯静态，双击 index.html 即可运行
 * ============================================================ */

/* ---------------- 工具 ---------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** HTML 转义，防止代码里的 < & > 破坏结构 */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** 转义并把 `反引号` 转成 <code>，同时保留其余文本 */
function rich(s) {
  return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
}

/**
 * C 语言语法高亮。
 * 依次匹配：注释 → 字符串/字符 → 预处理指令 → 数字 → 标识符。
 * 顺序很重要：注释必须最先剥离，否则字符串里的 // 会被误判。
 */
function highlightC(src) {
  const KEYWORDS = C_KEYWORDS;
  const TYPES = C_TYPES;
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];

    // 1) 块注释 /* ... */
    if (c === '/' && c2 === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      out += `<span class="tk-cmt">${esc(src.slice(i, stop))}</span>`;
      i = stop;
      continue;
    }

    // 2) 行注释 // ...
    if (c === '/' && c2 === '/') {
      let j = i;
      while (j < n && src[j] !== '\n') j++;
      out += `<span class="tk-cmt">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // 3) 字符串 "..." 与字符 '...'
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      while (j < n && src[j] !== quote) {
        if (src[j] === '\\') j++;   // 跳过转义符
        j++;
      }
      j = Math.min(j + 1, n);
      out += `<span class="tk-str">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // 4) 预处理指令 #include / #define（整行）
    if (c === '#' && (i === 0 || src[i - 1] === '\n')) {
      let j = i;
      while (j < n && src[j] !== '\n') j++;
      out += `<span class="tk-pp">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // 5) 数字
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9a-fA-FxX.]/.test(src[j])) j++;
      out += `<span class="tk-num">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // 6) 标识符 / 关键字
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      // 后面紧跟 ( 视为函数调用
      let k = j;
      while (k < n && src[k] === ' ') k++;
      const isCall = src[k] === '(';
      if (KEYWORDS.has(word)) {
        out += `<span class="tk-kw">${esc(word)}</span>`;
      } else if (TYPES.has(word)) {
        out += `<span class="tk-typ">${esc(word)}</span>`;
      } else if (isCall) {
        out += `<span class="tk-fn">${esc(word)}</span>`;
      } else {
        out += esc(word);
      }
      i = j;
      continue;
    }

    out += esc(c);
    i++;
  }
  return out;
}

/* ---------------- 片段构造 ---------------- */

function codeBlock(code, file, output, opts = {}) {
  const id = 'c' + Math.random().toString(36).slice(2, 9);
  const outBlock = output ? `
      <div class="out-block open" data-out="${id}">
        <button class="out-head" type="button" data-toggle-out="${id}">
          <span class="chev">▶</span> 实测输出
          <span class="out-hint">点击折叠</span>
        </button>
        <div class="out-body">
          <pre>${esc(output)}</pre>
          ${opts.outNote ? `<div class="out-note">${esc(opts.outNote)}</div>` : ''}
        </div>
      </div>` : '';

  const lines = code.split('\n');
  const long = lines.length > 46;

  /* 长代码切成两半并排，左栏带行号，便于对照阅读 */
  let codeInner;
  if (long) {
    const half = Math.ceil(lines.length / 2);
    const left = lines.slice(0, half).map((l, i) =>
      `<span class="ln">${String(i + 1).padStart(3, ' ')}</span>${highlightC(l)}`).join('\n');
    const right = lines.slice(half).map((l, i) =>
      `<span class="ln">${String(half + i + 1).padStart(3, ' ')}</span>${highlightC(l)}`).join('\n');
    codeInner = `
      <div class="code-2col">
        <pre><code>${left}</code></pre>
        <pre><code>${right}</code></pre>
      </div>`;
  } else {
    codeInner = `<pre><code id="${id}">${highlightC(code)}</code></pre>`;
  }

  /* 双栏时复制按钮需要一个隐藏的原文容器 */
  const copySrc = long ? `<pre style="display:none" id="${id}">${esc(code)}</pre>` : '';

  return `
    <div class="code-wrap${long ? ' code-wrap-2col' : ''}">
      <div class="code-bar">
        <div class="code-file"><span class="lamp"></span>${esc(file)}</div>
        <div class="code-actions">
          ${long ? `<span class="code-note">${lines.length} 行 · 双栏显示</span>` : ''}
          <button class="mini-btn" type="button" data-copy="${id}">复制</button>
        </div>
      </div>
      <div class="code-scroll">${codeInner}</div>
      ${copySrc}
      ${lines.length > 22 && !long ? '<div class="code-more">代码较长，可滚动查看</div>' : ''}
    </div>
    ${outBlock}`;
}

function pointsList(items) {
  return `<ul class="points">${items.map(p => `<li>${rich(p)}</li>`).join('')}</ul>`;
}

function threeCards(page) {
  return `
    <div class="cards">
      <div class="card card-warn">
        <div class="card-head"><span class="dot"></span>开发坑点</div>
        <p>${rich(page.pitfall)}</p>
      </div>
      <div class="card card-vscode">
        <div class="card-head"><span class="dot"></span>VS Code 演示</div>
        <p>${rich(page.vscode)}</p>
      </div>
      <div class="card card-exercise">
        <div class="card-head"><span class="dot"></span>练习</div>
        <p>${rich(page.exercise)}</p>
      </div>
    </div>`;
}

function head(page) {
  return `
    <div class="slide-head">
      <div class="page-no">${String(page.no).padStart(2, '0')}</div>
      <div class="tag">${esc(page.tag)}</div>
      <h2 class="slide-title">${rich(page.title)}</h2>
      <div class="goal">${rich(page.goal)}</div>
    </div>`;
}

/* ---------------- 各页渲染 ---------------- */

const FLOW = ['变量', '判断', '循环', '函数', '指针/数组', '结构体', '项目'];

function renderCover(page) {
  return `
    <div class="slide-head">
      <div class="page-no">01</div>
      <div class="tag">${esc(page.tag)}</div>
      <h2 class="slide-title">${rich(page.title)}</h2>
      <div class="goal">${rich(page.goal)}</div>
    </div>
    <div class="cover-main">
      <div class="cover-left">
        <div class="cover-badge">开发入门 · 零基础可跟敲</div>
        <h1 class="cover-title">C语言<br><em>极简开发入门</em></h1>
        <p class="cover-goal">18 页把 C 语言开发最常用的 6 块技能串成一条能干活的主线 —— 不堆理论，每页都是能编译运行的代码。</p>
        <div class="cover-meta">
          <span class="chip">18 页正文</span>
          <span class="chip">6 块技能</span>
          <span class="chip">代码全部 gcc 实测</span>
          <span class="chip">1 个完整项目</span>
        </div>
      </div>
      <div class="cover-right">
        <div class="cover-flow">
          ${FLOW.map((f, i) => `
            <span class="flow-node${i === 0 ? ' on' : ''}">${esc(f)}</span>
            ${i < FLOW.length - 1 ? '<span class="flow-arrow">→</span>' : ''}`).join('')}
        </div>
        ${codeBlock(page.code, page.file, page.output)}
        ${threeCards(page)}
      </div>
    </div>`;
}

function renderRoadmap(page) {
  const steps = [
    { n: '变量与输入输出', d: '存数据、读写数据', p: 'P04–05', hot: true },
    { n: '判断', d: 'if / switch 分支', p: 'P06–07' },
    { n: '循环', d: 'for / while 重复', p: 'P08–09' },
    { n: '函数', d: '封装复用、改外部变量', p: 'P10–11' },
    { n: '指针与数组', d: '批量数据与内存', p: 'P12–14' },
    { n: '结构体', d: '打包一条记录', p: 'P15–16' },
    { n: '综合项目', d: '成绩管理系统', p: 'P17–18', hot: true }
  ];
  return `
    ${head(page)}
    <div class="roadmap-wrap">
      <div class="road-chain">
        ${steps.map(s => `
          <div class="road-step${s.hot ? ' hot' : ''}">
            <div class="rs-no">${esc(s.p)}</div>
            <div class="rs-name">${esc(s.n)}</div>
            <div class="rs-desc">${esc(s.d)}</div>
          </div>`).join('')}
      </div>
      <div class="road-bottom">
        <div class="col-left">
          <div class="points-block">
            <div class="block-label">要点</div>
            ${pointsList(page.points)}
          </div>
          ${threeCards(page)}
        </div>
        <div class="col-right">
          ${codeBlock(page.code, page.file, page.output)}
        </div>
      </div>
    </div>`;
}

function renderEnvPage(page) {
  return `
    ${head(page)}
    <div class="env-wrap">
      <div class="env-steps">
        ${page.envSteps.map(s => `
          <div class="env-step">
            <div class="env-head">
              <div class="env-no">${s.n}</div>
              <div class="env-name">${rich(s.name)}</div>
            </div>
            <p>${rich(s.detail)}</p>
            <div class="env-check">${rich(s.check)}</div>
          </div>`).join('')}
      </div>
      <div class="env-side">
        <div class="env-points">
          <div class="block-label">要点</div>
          ${pointsList(page.points)}
        </div>
        <div class="env-code">
          ${codeBlock(page.code, page.file, page.output)}
        </div>
        <div class="cards">
          <div class="card card-warn">
            <div class="card-head"><span class="dot"></span>开发坑点</div>
            <p>${rich(page.pitfall)}</p>
          </div>
          <div class="card card-vscode">
            <div class="card-head"><span class="dot"></span>VS Code 演示</div>
            <p>${rich(page.vscode)}</p>
          </div>
          <div class="card card-exercise">
            <div class="card-head"><span class="dot"></span>练习</div>
            <p>${rich(page.exercise)}</p>
          </div>
        </div>
      </div>
    </div>`;
}

function renderCodePage(page) {
  return `
    ${head(page)}
    <div class="slide-body">
      <div class="col-left">
        <div class="points-block">
          <div class="block-label">要点</div>
          ${pointsList(page.points)}
        </div>
        ${threeCards(page)}
      </div>
      <div class="col-right">
        ${codeBlock(page.code, page.file, page.output, { outNote: page.outNote })}
      </div>
    </div>`;
}

function renderSummary(page) {
  const skip = ['数制转换', '原码反码补码', '位运算', '递归', '指针的指针', '函数指针', '链表', '文件操作'];
  return `
    ${head(page)}
    <div class="sum-wrap">
      <div class="sum-left">
        <div class="sum-hero">
          <div class="big">6+1</div>
          <div class="txt">块技能 + 1 个完整系统。<br>跑通下面这段自测代码，本课就算过关。</div>
        </div>
        ${codeBlock(page.code, page.file, page.output)}
      </div>
      <div class="sum-right">
        <div>
          <div class="block-label">可跳过内容清单</div>
          <ul class="skip-list">${skip.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        </div>
        <div class="points-block">
          <div class="block-label">要点</div>
          ${pointsList(page.points)}
        </div>
        ${threeCards(page)}
      </div>
    </div>`;
}

/* 附录页 */
function renderAppendixProject() {
  const a = APPENDIX.project;
  return `
    <div class="slide-head">
      <div class="page-no">20</div>
      <div class="tag">附录 1</div>
      <h2 class="slide-title">${rich(a.title)}</h2>
      <div class="goal">${rich(a.goal)}</div>
    </div>
    <div class="apx-wrap">
      <div class="compile-line"><span class="lbl">编译</span>${esc(a.compile)}</div>
      <div class="apx-grid">
        <div class="apx-main">
          ${codeBlock(a.code, a.file, null, {})}
        </div>
        <div class="apx-side">
          <div class="card card-vscode">
            <div class="card-head"><span class="dot"></span>怎么用</div>
            <p>保存为 <code>final_project.c</code>，用上面那行 gcc 命令编译，直接运行即可交互使用。菜单 5 个选项：添加学生 / 打印所有 / 查找学生 / 成绩排序 / 退出系统。</p>
          </div>
          <div class="card card-warn">
            <div class="card-head"><span class="dot"></span>开发坑点</div>
            <p><code>scanf("%19s", ...)</code> 里的 <code>19</code> 一定要写。名字超过 19 个字符会写穿内存，把相邻的 id 和 score 全弄坏 —— 这是数组版最常见的事故。</p>
          </div>
          <div class="card card-exercise">
            <div class="card-head"><span class="dot"></span>练习</div>
            <p>在项目里加一个「删除学生」功能：按学号找到后，把后面的元素依次前移覆盖，最后 <code>count--</code>。</p>
          </div>
        </div>
      </div>
    </div>`;
}

function renderAppendixTest() {
  const a = APPENDIX.selftest;
  return `
    <div class="slide-head">
      <div class="page-no">21</div>
      <div class="tag">附录 2</div>
      <h2 class="slide-title">${rich(a.title)}</h2>
      <div class="goal">${rich(a.goal)}</div>
    </div>
    <div class="apx-wrap">
      <div class="compile-line"><span class="lbl">编译</span>${esc(a.compile)}</div>
      <div class="apx-grid">
        <div class="apx-main">
          ${codeBlock(a.code, a.file, a.output)}
        </div>
        <div class="apx-side">
          <div class="card card-vscode">
            <div class="card-head"><span class="dot"></span>这段代码覆盖了什么</div>
            <p>第 15 页的<b>结构体数组</b> + 第 16 页的<b>冒泡排序</b> + 第 11 页的<b>指针 swap</b>。三块合一，跑通即代表本课程 6 块技能全部掌握。</p>
          </div>
          <div class="card card-warn">
            <div class="card-head"><span class="dot"></span>开发坑点</div>
            <p>排序时交换的是<b>整个结构体</b>（用临时变量 tmp 搬运），不是只换 score 字段。只换字段会让姓名和分数对不上号。</p>
          </div>
          <div class="card card-exercise">
            <div class="card-head"><span class="dot"></span>练习</div>
            <p>把 4 个学生改成 6 个，观察嵌套循环边界 <code>j &lt; 3 - i</code> 怎么跟着变；再试试按姓名（strcmp）排序。</p>
          </div>
        </div>
      </div>
    </div>`;
}

function renderAppendixVscode() {
  const v = APPENDIX.vscode;
  return `
    <div class="slide-head">
      <div class="page-no">22</div>
      <div class="tag">附录 3</div>
      <h2 class="slide-title">${rich(v.title)}</h2>
      <div class="goal">${rich(v.goal)}</div>
    </div>
    <div class="apx-wrap">
      <div class="vs-steps">
        ${v.steps.map(s => `
          <div class="vs-step">
            <div class="vs-head">
              <div class="vs-no">${s.n}</div>
              <div class="vs-name">${rich(s.name)}</div>
            </div>
            <p>${rich(s.detail)}</p>
            <div class="vs-check">${rich(s.check)}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ---------------- 讲稿 ---------------- */

const NOTES = {
  1: '开场先给目标：18 页后能自己写出一个能跑的成绩管理系统，不是"听懂"，是"写出来"。\n强调全程不讲位运算、递归、链表、文件操作 —— 这些对入门阶段没用，学会了反而忘得快。\n告诉学员：每一页的代码都已经在讲者机器上用 gcc 编译并运行过，大家照抄就能跑。',
  2: '这一页建议现场带着装，或让学员提前装好（课后作业已要求截图 gcc/gdb 版本）。\n三个高频卡点提前说：\n① 配完 PATH 必须把 VS Code 和 CMD 完全关掉重开，否则环境变量不生效；\n② 项目路径不能有中文，含中文时 gcc 直接编译失败且报错难懂；\n③ tasks.json 和 launch.json 的输出路径必须一致，否则 F5 找不到 exe。\n演示时把 gcc --version、gdb --version 都跑一遍，让学员看到版本号，这就是"装好了"的信号。\n如果课堂时间紧，可以只讲第 3、4、5 步（装工具链、配 PATH、验证），VS Code 集成部分让他们课后自己弄。',
  3: '这条路线是整个课程的地图，重点讲两个依赖关系：\n① 指针和数组是绑在一起的 —— 因为数组名本身就是首元素地址；\n② 结构体必须放在指针之后 —— 否则讲不清 p->score 和 p.score 的区别。\n告诉学员每一块在项目里都有对应功能，学完立刻能用上，不是孤立的语法点。',
  4: '四种类型一次讲完，让学员对照手敲。\n重点强调两件事：scanf 的 & 不能漏（漏了直接崩），以及字符串用双引号、字符用单引号。\n整数除法 7/2==3 现场跑一遍，让他们看到输出是 3 不是 3.5，为下一页的类型转换埋伏笔。',
  5: '这是新手第一个"看起来能跑但结果是错的"的坑，务必现场演示。\nr1 = 2.000000 而 r2 = 2.500000，让学员亲眼看到赋值时才转换就晚了。\n再补一句 (int)3.9 得 3 而不是 4 —— 强转是截断不是四舍五入。\n实际工作中算平均分必须写 (double)sum / n。',
  6: '先讲正常用法，再演示 bug。\n把 if (flag = 0) 这行留着，让他们猜输出。等他们说"不会打印"，再解释这是赋值不是比较，条件恒为 0。\n现场用 gcc -Wall 编译，让他们看到编译器其实会警告，但只是 warning 不是 error，程序照样跑出错误结果 —— 所以 -Wall 必须常开。',
  7: '穿透是最阴的 bug，因为它不报错、程序照常跑完。\n跑一次有 break 的版本，再跑一次漏 break 的版本，对比 Wednesday 和 Thursday 同时出现。\n提醒他们 gcc 有 -Wimplicit-fallthrough 警告，漏 break 会被点名。',
  8: '三大要素用一句话讲透：i 从哪开始、什么条件下继续、每轮怎么变。\nfor 和 while 的区别就一句话：次数确定用 for，次数不确定用 while。\n重点讲 continue 写在 i++ 之前会死循环 —— 这是他们写 while 时最容易犯的错。',
  9: '这一页是"抄进项目"的模板页，三个练习都要敲。\n求和模板：初始化 → 遍历累加 → 打印，三步固定。\n找最大值：max 初值必须取 a[0] 不能取 0，问他们如果数组全是负数会发生什么。\n打印图形：外层管行、内层管列，printf("\\n") 放在内层循环外面。',
  10: '函数的价值是复用，但新手最大的误解在这里 —— 以为函数能直接改外面的变量。\n跑完代码让他们看输出 n still = 10，add(n, 1) 根本没改到 n。\n告诉学员：想改外部数据？下一课给你答案。这正好承接下一页。',
  11: '这页是第 10 页的解药，前后呼应。\nswap(&x, &y) 交换成功，x=2 y=1；对比上一页的值传递，明确差别在"传地址"还是"传值"。\n数组传参重点：数组长度必须单独传 n，因为函数内部拿不到长度。\n可以提一句 sizeof(a) 在函数里不再是数组长度，这是个常见困惑点。',
  12: '用比喻讲：指针是一个存地址的小纸条，纸条上写的地址才是真正变量的位置。\n核心让学员亲眼看到 &x 和 p 打印出来一模一样 —— 这就说明 p 里装的就是 x 的地址。\n野指针必须强调：int *p; 声明完 p 是垃圾值，解引用就是未定义行为。养成先初始化成 NULL 的习惯。',
  13: '全课最需要视觉冲击的一页，四种写法其实完全等价。\n让学员盯住程序输出：每一行四列数字完全一样，这就是证据。\n再讲指针加法：p+1 走的是 sizeof(int)=4 字节，不是一个字节。p+1 和 &a[1] 是同一个地址。',
  14: '核心就一句话：*p = 42 改数据，p = 42 改地址。\n现场演示 modify(&x) 之后 x 真的变了，学员会立刻理解。\n再演示改成 p = 42 会崩，让差别更刺眼。\n数组元素也一样：modify(&arr[1]) 等价于 modify(arr + 1)。',
  15: '结构体是"把一个人的多项信息打包"，比喻成一张学生档案卡。\n三种用法一次讲完：变量、数组、指针。\n重点是 . 和 -> 的区别：变量和数组用点号，指针用箭头。p->score 等价于 (*p).score。\n现场演示 p->score = 99.0 之后 s1.score 也变成 99，证明改的是同一块内存。',
  16: '冒泡排序是每个项目都会用到的，必须讲透。\n两层循环：外层 i 管轮数，内层 j 比较相邻两个。\n重点坑：交换时必须整体交换结构体。演示只换 score 字段的后果 —— 排完 Tom 拿着 Bob 的分，姓名和分数对不上号。\n内层条件 j < n-1-i 的含义也讲一句：每轮排好的不用再比。',
  17: '先定数据结构，再写代码 —— 这是做项目的基本顺序。\nstruct Student 三个字段、全局数组 stu[MAX]、全局计数 count，三个概念讲清。\nMAX=50 是数组版的上限，加学生前必须判断 count >= MAX。\n提前说好：scanf 里的 %19s，那个 19 是数组长度减一，不能少写。',
  18: '五个功能全部拆成独立函数，main 只做调度 —— 这是函数这一块最好的收尾。\n讲查找函数返回下标、找不到返回 -1 的常见约定，以及为什么用 if (idx >= 0) 判断。\ncase 0 里 return 0 退出程序，default 处理非法输入。\n这页之后直接接附录 1 的完整代码。',
  19: '收尾页，两件事：验收 + 划清边界。\n先让学员自己跑自测代码，跑通就说明 6 块技能都掌握了。\n再讲可跳过清单：这些内容现在不学完全不影响写出成绩管理系统，等真需要了再单独补，效率最高。\n最后给课后方向：malloc、文件读写、结构体嵌套。'
};

/* ---------------- 渲染全部 ---------------- */

const SLIDES = [];

function buildSlides() {
  CONTENT.forEach(page => {
    let html;
    if (page.kind === 'cover') html = renderCover(page);
    else if (page.kind === 'env') html = renderEnvPage(page);
    else if (page.kind === 'roadmap') html = renderRoadmap(page);
    else if (page.kind === 'summary') html = renderSummary(page);
    else html = renderCodePage(page);

    const el = document.createElement('section');
    el.className = 'slide' + (page.kind === 'cover' ? ' slide-cover' : '');
    el.dataset.no = String(page.no);
    el.innerHTML = html;
    SLIDES.push({ el, page });
  });

  [renderAppendixProject, renderAppendixTest, renderAppendixVscode].forEach((fn, idx) => {
    const el = document.createElement('section');
    el.className = 'slide';
    el.dataset.no = String(20 + idx);
    el.innerHTML = fn();
    SLIDES.push({ el, page: null, appendix: idx });
  });
}

/* ---------------- 导航 ---------------- */

let current = 0;

function goTo(idx) {
  const n = SLIDES.length;
  current = Math.max(0, Math.min(n - 1, idx));
  SLIDES.forEach((s, i) => s.el.classList.toggle('active', i === current));
  $('#progressBar').style.width = ((current + 1) / n * 100) + '%';
  $('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${n}`;
  $('#btnPrev').disabled = current === 0;
  $('#btnNext').disabled = current === n - 1;
  renderNotes();
  renderThumbs();
  const s = SLIDES[current];
  const title = s.page ? `${s.page.tag} · ${s.page.title}` : `附录 ${s.appendix + 1}`;
  $('#statusTitle').textContent = title;
  if (location.hash !== '#' + (current + 1)) {
    history.replaceState(null, '', '#' + (current + 1));
  }
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

/* ---------------- 讲稿面板 ---------------- */

function renderNotes() {
  const s = SLIDES[current];
  let text = '';
  if (s.page && NOTES[s.page.no]) {
    text = NOTES[s.page.no];
  } else if (s.appendix === 0) {
    text = '完整项目代码在这一页。\n可以让学员自己敲一遍，或者作为课后作业发下去 —— 120 行正好是一个晚上能完成的量。\n重点提醒 %19s 的 19 必须写。';
  } else if (s.appendix === 1) {
    text = '这是验收代码，建议现场跑一遍让学员看输出。\nAmy 95 / Cindy 88 / Tom 78 / Bob 60 —— 分数从高到低，排序生效。\n最后 x=2 y=1 证明指针 swap 生效。';
  } else {
    text = '照着这六步念就行，每一步都有对应的验证方式。\n第 5 步是重点：监视窗口里 x、&x、p、*p、stu[0].score 五个表达式，让他们亲眼看到 p 等于 &x。';
  }
  $('#notesBody').textContent = text;
  $('#notesTitle').textContent = s.page ? `${s.page.tag} · ${s.page.title}` : `附录 ${s.appendix + 1}`;
}

function toggleNotes() {
  $('#notes').classList.toggle('show');
}

/* ---------------- 目录总览 ---------------- */

function renderThumbs() {
  const box = $('#thumbs');
  if (!box.dataset.built) {
    box.innerHTML = SLIDES.map((s, i) => {
      const title = s.page ? s.page.title : [APPENDIX.project.title, APPENDIX.selftest.title, APPENDIX.vscode.title][s.appendix];
      const goal = s.page ? s.page.goal : [APPENDIX.project.goal, APPENDIX.selftest.goal, APPENDIX.vscode.goal][s.appendix];
      return `<button class="thumb" type="button" data-goto="${i}">
        <div class="t-no">${String(s.el.dataset.no).padStart(2, '0')}</div>
        <div class="t-title">${esc(title)}</div>
        <div class="t-goal">${esc(goal)}</div>
      </button>`;
    }).join('');
    box.dataset.built = '1';
    box.addEventListener('click', e => {
      const btn = e.target.closest('[data-goto]');
      if (!btn) return;
      goTo(Number(btn.dataset.goto));
      closeOverlay();
    });
  }
  $$('.thumb', box).forEach((t, i) => t.classList.toggle('current', i === current));
}

function openOverlay() { $('#overlay').classList.add('show'); renderThumbs(); }
function closeOverlay() { $('#overlay').classList.remove('show'); }

/* ---------------- 主题 ---------------- */

function toggleTheme() {
  const html = document.documentElement;
  const next = html.dataset.theme === 'light' ? 'dark' : 'light';
  html.dataset.theme = next;
  try { localStorage.setItem('c-course-theme', next); } catch (_) {}
  $('#btnTheme').innerHTML = next === 'light'
    ? '<span class="ico">🌙</span>深色'
    : '<span class="ico">☀</span>浅色';
}

/* ---------------- 事件绑定 ---------------- */

function bindEvents() {
  $('#btnNext').addEventListener('click', next);
  $('#btnPrev').addEventListener('click', prev);
  $('#btnOutline').addEventListener('click', openOverlay);
  $('#btnTheme').addEventListener('click', toggleTheme);
  $('#btnHelp').addEventListener('click', () => $('#helpPanel').classList.toggle('show'));
  $('#btnNotes').addEventListener('click', toggleNotes);
  $('#overlayClose').addEventListener('click', closeOverlay);
  $('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay') closeOverlay(); });

  // 复制代码
  document.addEventListener('click', async e => {
    const btn = e.target.closest('[data-copy]');
    if (btn) {
      const code = document.getElementById(btn.dataset.copy);
      const text = code ? code.textContent : '';
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '已复制';
        btn.classList.add('done');
        setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('done'); }, 1600);
      } catch (_) {
        btn.textContent = '复制失败';
      }
      return;
    }
    // 展开实测输出
    const tog = e.target.closest('[data-toggle-out]');
    if (tog) {
      const blk = tog.closest('.out-block');
      blk.classList.toggle('open');
      return;
    }
  });

  // 键盘
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'Enter':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': case 'Backspace':
        e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); goTo(0); break;
      case 'End': e.preventDefault(); goTo(SLIDES.length - 1); break;
      case 'ArrowDown': e.preventDefault(); toggleNotes(); break;
      case 'ArrowUp': e.preventDefault(); $('#notes').classList.remove('show'); break;
      case 'o': case 'O': openOverlay(); break;
      case 't': case 'T': toggleTheme(); break;
      case 'n': case 'N': toggleNotes(); break;
      case '?': $('#helpPanel').classList.toggle('show'); break;
      case 'f': case 'F':
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
        break;
      case 'Escape':
        closeOverlay();
        $('#helpPanel').classList.remove('show');
        break;
    }
  });

  // 进度条点击跳页
  $('#progressWrap').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    goTo(Math.round(ratio * (SLIDES.length - 1)));
  });

  // 舞台左右点击翻页
  $('#stage').addEventListener('click', e => {
    if (e.target.closest('.code-scroll') || e.target.closest('button')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width * 0.28) prev();
    else if (e.clientX - rect.left > rect.width * 0.72) next();
  });

  // 触摸滑动
  let touchX = null;
  $('#stage').addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  $('#stage').addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
    touchX = null;
  }, { passive: true });

  // 初始主题：localStorage > URL 参数 ?theme=light > 默认暗色
  let saved = null;
  try { saved = localStorage.getItem('c-course-theme'); } catch (_) {}
  const urlTheme = new URLSearchParams(location.search).get('theme');
  const initial = urlTheme === 'light' ? 'light' : (saved === 'light' ? 'light' : 'dark');
  if (initial === 'light') {
    document.documentElement.dataset.theme = 'light';
    $('#btnTheme').innerHTML = '<span class="ico">🌙</span>深色';
  }

  // 初始页
  const hash = parseInt((location.hash || '').replace('#', ''), 10);
  goTo(Number.isFinite(hash) && hash > 0 ? hash - 1 : 0);
}

/* ---------------- 启动 ---------------- */

buildSlides();
$('#stage').append(...SLIDES.map(s => s.el));
bindEvents();
