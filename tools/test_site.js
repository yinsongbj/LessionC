/* ============================================================
 * test_site.js — 用 jsdom 真实加载教程站, 验证渲染与全部交互
 *
 * 用法：node tools/test_site.js
 * ============================================================ */

const path = require('path');
const fs = require('fs');
const { JSDOM } = require('C:/Users/yin_s/.workbuddy/binaries/node/versions/22.22.2-6/node_modules/@tencent/slidep/node_modules/jsdom');

const WEB = path.resolve(__dirname, '..');

let pass = 0, fail = 0;
function check(cond, label, extra) {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label}${extra ? '  → ' + extra : ''}`); }
}

(async () => {
  /* 用 file:// 加载, 与用户双击 index.html 的场景一致 */
  const indexFile = path.join(WEB, 'index.html');
  const dom = await JSDOM.fromFile(indexFile, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });
  const { window } = dom;
  const errors = [];
  window.addEventListener('error', e => errors.push(e.message));
  const origError = window.console.error;
  window.console.error = (...a) => { errors.push('console.error: ' + a.join(' ')); origError(...a); };

  /* file:// 下 jsdom 不提供 localStorage, 补一个内存实现来测持久化逻辑 */
  const store = new Map();
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
      clear: () => store.clear()
    }
  });
  /* jsdom 未实现 matchMedia, 补一个最小实现 */
  if (!window.matchMedia) {
    window.matchMedia = q => ({
      matches: /max-width:\\s*980px/.test(q) ? window.innerWidth <= 980 : false,
      media: q, onchange: null,
      addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }
    });
  }

  await new Promise(r => {
    if (window.document.readyState === 'complete') r();
    else window.addEventListener('load', r);
  });
  await new Promise(r => setTimeout(r, 500));

  const doc = window.document;

  console.log('\n【1】首屏渲染');
  check(errors.length === 0, '无 JS 错误', errors.join(' | '));
  check(!!doc.querySelector('#chapterNav .chap-item'), '侧边栏渲染出章节项');
  const navCount = doc.querySelectorAll('#chapterNav .chap-item').length;
  check(navCount === 14, `侧边栏章节数 = 14`, '实际 ' + navCount);
  check(!!doc.querySelector('.ch-head h2'), '主内容区渲染出章节标题');
  check(!!doc.querySelector('#content .code-block'), '渲染出代码块');
  check(doc.querySelectorAll('#content .tk-kw').length > 0, '代码有语法高亮');
  check(doc.querySelectorAll('#content .out-block').length > 0, '代码块带预期输出区');
  check(doc.querySelectorAll('#content .copy-btn').length > 0, '代码块带复制按钮');
  check(doc.querySelectorAll('#content .concept').length > 0, '渲染出核心概念卡片');
  check(doc.querySelectorAll('#content .pitfall').length > 0, '渲染出开发坑点');
  check(doc.querySelectorAll('#content .table-wrap table').length > 0, '渲染出对比表');
  check(doc.querySelectorAll('#content .exercise').length > 0, '渲染出练习题');
  check(doc.querySelectorAll('#content .summary').length > 0, '渲染出小结');
  check(doc.querySelectorAll('#pageNav .pn-card').length === 2, '底部上下章导航有 2 个');

  console.log('\n【2】章节模板一致性（逐章检查）');
  const CHAPTERS = window.CHAPTERS;
  const EX = window.EXERCISES;
  const bad = [];
  CHAPTERS.forEach(ch => {
    const has = [];
    if (!ch.title || !ch.goal || !ch.time) has.push('缺标题/目标/时间');
    if (!ch.concepts || ch.concepts.length > 6) has.push('概念' + (ch.concepts || []).length + '条');
    const codes = (ch.blocks || []).filter(b => b.t === 'code');
    /* 教学代码示例指 C 程序; json/bash 配置块是环境说明, 不计入 */
    const teachCodes = codes.filter(b => !b.lang || b.lang === 'c');
    if (teachCodes.length < 2 || teachCodes.length > 4) has.push('教学代码' + teachCodes.length + '例');
    if (codes.some(b => b.lang === 'json' && !b.lang)) has.push('json块标记异常');
    if (!ch.pitfalls || ch.pitfalls.length < 2 || ch.pitfalls.length > 4) has.push('坑点' + (ch.pitfalls || []).length);
    if (!ch.vscode || ch.vscode.length < 1) has.push('无VS Code提示');
    if (!ch.summary || ch.summary.length > 3) has.push('小结' + (ch.summary || []).length);
    const ex = EX[ch.id] || [];
    if (ex.length < 2 || ex.length > 3) has.push('练习' + ex.length + '题');
    if (!ch.blocks.some(b => b.t === 'table')) has.push('无对比表');
    if (has.length) bad.push(ch.id + ': ' + has.join(', '));
  });
  check(bad.length === 0, '14 章模板全部合规', bad.join(' | '));

  console.log('\n【3】路由');
  window.location.hash = '#chapter-7';
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  await new Promise(r => setTimeout(r, 200));
  check(doc.querySelector('.ch-head h2').textContent.includes('指针'), 'hash 路由跳转到第 7 章', doc.querySelector('.ch-head h2').textContent);
  check(doc.querySelectorAll('#content svg.mem-figure, #content .mem-figure svg').length > 0, '第 7 章渲染出内存示意图');
  check(doc.querySelector('#content .mem-arrow') !== null, '内存示意图含箭头');

  window.location.hash = '#chapter-9';
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  await new Promise(r => setTimeout(r, 200));
  const full = (window.CHAPTERS.find(c => c.id === 'chapter-9').blocks || [])
    .filter(b => b.t === 'code').find(b => b.id === 'c9_full');
  const fullLines = full.code.split('\n').length;
  check(fullLines <= 150, `第 9 章完整项目 ${fullLines} 行 (≤150)`);
  ['添加学生', '打印所有', '查找学生', '成绩排序', '修改成绩'].forEach(k => {
    check(full.code.includes(k), `项目含「${k}」功能`);
  });
  check(full.code.includes('while (1)') && full.code.includes('switch'), '项目含菜单循环');

  console.log('\n【4】搜索过滤');
  const search = doc.querySelector('#search');
  search.value = '指针';
  search.dispatchEvent(new window.Event('input'));
  await new Promise(r => setTimeout(r, 150));
  const filtered = doc.querySelectorAll('#chapterNav .chap-item:not(.hidden)').length;
  check(filtered > 0 && filtered < 14, `搜索「指针」过滤到 ${filtered} 项`);
  search.value = 'zzz不存在zzz';
  search.dispatchEvent(new window.Event('input'));
  await new Promise(r => setTimeout(r, 150));
  check(doc.querySelectorAll('#chapterNav .chap-item:not(.hidden)').length === 0, '搜索无结果时列表清空');
  check(!!doc.querySelector('.nav-empty'), '无结果时显示空状态提示');
  search.value = '';
  search.dispatchEvent(new window.Event('input'));
  await new Promise(r => setTimeout(r, 150));
  check(doc.querySelectorAll('#chapterNav .chap-item:not(.hidden)').length === 14, '清空搜索后恢复全部章节');

  console.log('\n【5】主题切换与持久化');
  const before = doc.documentElement.dataset.theme;
  doc.querySelector('#btnTheme').click();
  await new Promise(r => setTimeout(r, 100));
  check(doc.documentElement.dataset.theme !== before, '主题切换生效');
  check(window.localStorage.getItem('c-course-tut-theme') === doc.documentElement.dataset.theme, '主题写入 localStorage');
  doc.querySelector('#btnTheme').click();
  await new Promise(r => setTimeout(r, 100));
  check(doc.documentElement.dataset.theme === before, '主题可切回');

  console.log('\n【6】答案折叠与输出折叠');
  const ans = doc.querySelector('.exercise .ans-btn');
  const exEl = doc.querySelector('.exercise');
  check(exEl.classList.contains('open') === false, '答案默认折叠');
  ans.click();
  await new Promise(r => setTimeout(r, 100));
  check(exEl.classList.contains('open'), '点击后答案展开');
  const outBlock = doc.querySelector('.out-block');
  const outOpenBefore = outBlock.classList.contains('open');
  doc.querySelector('[data-toggle-out]').click();
  await new Promise(r => setTimeout(r, 100));
  check(outBlock.classList.contains('open') !== outOpenBefore, '预期输出可折叠/展开');

  console.log('\n【7】上下章导航与键盘');
  const idxNow = CHAPTERS.findIndex(c => c.id === window.location.hash.replace('#', ''));
  doc.querySelector('#btnNext').click();
  await new Promise(r => setTimeout(r, 150));
  check(window.location.hash.replace('#', '') === CHAPTERS[idxNow + 1].id, '下一章按钮跳转正确');
  doc.querySelector('#btnPrev').click();
  await new Promise(r => setTimeout(r, 150));
  check(window.location.hash.replace('#', '') === CHAPTERS[idxNow].id, '上一章按钮跳转正确');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  check(window.location.hash.replace('#', '') === CHAPTERS[idxNow + 1].id, '键盘 → 切换下一章');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  check(window.location.hash.replace('#', '') === CHAPTERS[idxNow].id, '键盘 ← 切换上一章');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: '/', bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  check(doc.activeElement === doc.querySelector('#search'), '键盘 / 聚焦搜索框');

  console.log('\n【8】阅读进度记录');
  /* 先清空, 写入确定的两章, 再验证计数与标记 */
  window.localStorage.setItem('c-course-tut-read', JSON.stringify(['chapter-0', 'chapter-1']));
  /* 触发一次重渲染让已读标记生效 */
  window.location.hash = '#chapter-3';
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  await new Promise(r => setTimeout(r, 200));
  const spCount = doc.querySelector('#spCount').textContent;
  check(/^\d+ \/ 14$/.test(spCount), '进度计数格式正确', spCount);
  check(parseInt(spCount, 10) >= 2, '进度计数不少于已读章节数', spCount);
  check(doc.querySelectorAll('#chapterNav .chap-item.read').length >= 2, '已读章节带标记',
    doc.querySelectorAll('#chapterNav .chap-item.read').length + ' 个');

  console.log('\n【9】移动端抽屉');
  doc.querySelector('#btnMenu').click();
  await new Promise(r => setTimeout(r, 150));
  check(doc.querySelector('#sidebar').classList.contains('open'), '抽屉可打开');
  check(doc.querySelector('#scrim').hidden === false, '遮罩层显示');
  doc.querySelector('#scrim').click();
  await new Promise(r => setTimeout(r, 150));
  check(doc.querySelector('#sidebar').classList.contains('open') === false, '点遮罩关闭抽屉');

  console.log('\n【10】代码高亮与转义正确性');
  const allCode = Array.from(doc.querySelectorAll('#content .code-scroll code')).map(e => e.textContent).join('\n');
  check(allCode.includes('printf'), '代码文本完整保留');
  check(doc.querySelectorAll('#content .code-scroll code').length > 0, '代码块渲染');
  const tkCount = doc.querySelectorAll('#content .tk-kw').length;
  check(tkCount > 0, `关键字高亮生效 (${tkCount} 处)`);

  console.log('\n【11】内容完整性');
  const text = doc.body.textContent;
  const keys = [
    ['C语言开发视角', '标题'],
    ['核心概念', '核心概念区'],
    ['开发坑点', '坑点区'],
    ['VS Code', 'VS Code 提示'],
    ['练习', '练习区'],
    ['预期输出', '预期输出'],
    ['可跳过', '附录B'],
    ['自测题', '附录C']
  ];
  keys.forEach(([k, label]) => check(text.includes(k), `${label} (${k})`));

  /* 内存图说明在第 7 章, 需按章节数据检查 */
  const ch7 = CHAPTERS.find(c => c.id === 'chapter-7');
  const fig = (ch7.blocks || []).find(b => b.t === 'fig');
  check(!!fig, '第 7 章含内存示意图数据');
  check(!!fig && fig.svg.includes('<svg'), '内存示意图是内联 SVG');
  check(!!fig && fig.svg.includes('marker-end'), '内存示意图带箭头标记');
  check(!!fig && fig.caption.includes('地址'), '内存示意图有文字说明');
  console.log('\n' + '='.repeat(56));
  console.log(`通过 ${pass} 项，失败 ${fail} 项`);
  if (errors.length) {
    console.log('\n捕获到的错误:');
    errors.forEach(e => console.log('  ! ' + e));
  }
  dom.window.close();
  process.exit(fail ? 1 : 0);
})();
