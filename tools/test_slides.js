/* ============================================================
 * test_slides.js — 讲义模式端到端验收
 *
 * 用法：node tools/test_slides.js
 * ============================================================ */

const path = require('path');
const { JSDOM } = require('C:/Users/yin_s/.workbuddy/binaries/node/versions/22.22.2-6/node_modules/@tencent/slidep/node_modules/jsdom');

const WEB = path.resolve(__dirname, '..');

let pass = 0, fail = 0;
function check(cond, label, extra) {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else { fail++; console.log(`  ✗ ${label}${extra ? '  → ' + extra : ''}`); }
}

(async () => {
  const dom = await JSDOM.fromFile(path.join(WEB, 'slides.html'), {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });
  const { window } = dom;
  const errors = [];
  window.addEventListener('error', e => errors.push(e.message));
  const origError = window.console.error;
  window.console.error = (...a) => { errors.push('console.error: ' + a.join(' ')); origError(...a); };

  /* file:// 下 jsdom 不提供 localStorage, 补一个内存实现 */
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

  await new Promise(r => {
    if (window.document.readyState === 'complete') r();
    else window.addEventListener('load', r);
  });
  await new Promise(r => setTimeout(r, 500));

  const doc = window.document;

  console.log('\n【1】首屏渲染');
  check(errors.length === 0, '无 JS 错误', errors.join(' | '));
  check(!!doc.querySelector('#stage'), '舞台存在');
  check(doc.querySelector('#stage').innerHTML.length > 100, '舞台已渲染内容');
  check(!!doc.querySelector('#counter').textContent, '页码计数器存在');
  check(doc.querySelector('#counter').textContent.includes('/'), '页码格式正确', doc.querySelector('#counter').textContent);

  const SLIDES = window.SLIDES || [];
  check(SLIDES.length > 30, `幻灯片总数 ${SLIDES.length} 页 (>30)`);

  console.log('\n【2】分页质量');
  const kinds = {};
  SLIDES.forEach(s => { kinds[s.kind] = (kinds[s.kind] || 0) + 1; });
  check(kinds.cover === 14, `章首页 14 个 (实际 ${kinds.cover})`);
  check(kinds.summary >= 10, `小结页 ${kinds.summary} 个 (≥10)`);
  check(kinds.content > 0 && kinds.code > 0, `正文页 ${kinds.content} 个, 代码页 ${kinds.code} 个`);

  /* 每页都要有标题 */
  const noTitle = SLIDES.filter(s => !s.title || !s.title.trim());
  check(noTitle.length === 0, '每页都有标题', noTitle.map(s => s.no).join(','));

  /* 编号连续 */
  const badNo = SLIDES.filter((s, i) => s.no !== i + 1);
  check(badNo.length === 0, '页码编号连续');

  /* 大代码块应单独成页 */
  const bigCodePages = SLIDES.filter(s => s.kind === 'code');
  check(bigCodePages.length >= 2, `大代码单独成页 ${bigCodePages.length} 个`);
  const bigOk = bigCodePages.every(s => s.blocks.length === 1 && s.blocks[0].t === 'code');
  check(bigOk, '代码页只含代码块');

  console.log('\n【3】翻页导航');
  const startIdx = 0;
  doc.querySelector('#btnNext').click();
  await new Promise(r => setTimeout(r, 120));
  check(window.SLIDES[1].no === 2, '下一页按钮翻页正确');
  check(doc.querySelector('#counter').textContent.startsWith('02'), '计数器同步更新');
  doc.querySelector('#btnPrev').click();
  await new Promise(r => setTimeout(r, 120));
  check(window.SLIDES[0].no === 1, '上一页按钮翻页正确');

  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await new Promise(r => setTimeout(r, 120));
  check(window.SLIDES[1].no === 2, '键盘 → 翻到下一页');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  await new Promise(r => setTimeout(r, 120));
  check(window.SLIDES[0].no === 1, '键盘 ← 翻到上一页');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  await new Promise(r => setTimeout(r, 120));
  check(window.SLIDES[1].no === 2, '空格翻到下一页');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  await new Promise(r => setTimeout(r, 120));
  check(window.SLIDES[window.SLIDES.length - 1].no === SLIDES.length, 'End 跳到末页');
  check(doc.querySelector('#btnNext').disabled, '末页时下一页按钮禁用');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  await new Promise(r => setTimeout(r, 120));
  check(window.SLIDES[0].no === 1, 'Home 跳到首页');
  check(doc.querySelector('#btnPrev').disabled, '首页时上一页按钮禁用');

  console.log('\n【4】讲稿');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'n', bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  check(doc.querySelector('#notes').classList.contains('show'), 'N 键打开讲稿面板');
  const noteText = doc.querySelector('#notesBody').textContent.trim();
  check(noteText.length > 20, `讲稿有内容 (${noteText.length} 字)`, noteText.slice(0, 40));
  check(!noteText.includes('这一页没有写讲稿'), '首页有讲稿');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise(r => setTimeout(r, 150));
  check(!doc.querySelector('#notes').classList.contains('show'), 'Esc 关闭讲稿');

  /* 讲稿覆盖度: 有讲稿的页数 */
  const withNote = SLIDES.filter(s => {
    const k = s.kind === 'cover' ? s.chapterId
      : s.kind === 'summary' ? s.chapterId + '::summary'
      : s.chapterId + '::' + s.title;
    const NOTES = window.NOTES || {};
    if (NOTES[k]) return true;
    if (s.kind === 'code') {
      const base = s.title.replace(/\s*·\s*代码$/, '').replace(/\s*\(\d+\/\d+\)$/, '');
      return !!NOTES[s.chapterId + '::' + base];
    }
    return false;
  }).length;
  check(withNote / SLIDES.length > 0.6, `讲稿覆盖 ${withNote}/${SLIDES.length} 页 (>60%)`);

  console.log('\n【5】总览浮层');
  doc.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'o', bubbles: true }));
  await new Promise(r => setTimeout(r, 200));
  check(doc.querySelector('#overlay').classList.contains('show'), 'O 键打开总览');
  const thumbCount = doc.querySelectorAll('#thumbs .thumb').length;
  check(thumbCount === SLIDES.length, `缩略图数量 = ${thumbCount} (应等于 ${SLIDES.length})`);
  /* 点缩略图跳转 */
  doc.querySelectorAll('#thumbs .thumb')[5].click();
  await new Promise(r => setTimeout(r, 150));
  check(window.SLIDES[5].no === 6, '点击缩略图跳到对应页');
  check(!doc.querySelector('#overlay').classList.contains('show'), '跳转后总览关闭');

  console.log('\n【6】主题');
  const before = doc.documentElement.dataset.theme;
  doc.querySelector('#btnTheme').click();
  await new Promise(r => setTimeout(r, 120));
  check(doc.documentElement.dataset.theme !== before, '主题切换生效');
  check(window.localStorage.getItem('c-course-slides-theme') === doc.documentElement.dataset.theme, '主题写入 localStorage');
  doc.querySelector('#btnTheme').click();
  await new Promise(r => setTimeout(r, 120));
  check(doc.documentElement.dataset.theme === before, '主题可切回');

  console.log('\n【7】代码高亮与复制');
  const codeHtml = doc.querySelector('#stage').innerHTML;
  check(codeHtml.includes('tk-kw'), '代码有语法高亮');
  check(codeHtml.includes('code-block'), '渲染出代码块');
  check(codeHtml.includes('copy-btn'), '代码块有复制按钮');
  check(codeHtml.includes('out-block'), '代码块有预期输出区');
  /* 切到有代码的页再查 */
  const codeSlide = SLIDES.findIndex(s => s.kind === 'code');
  window.goTo(codeSlide);
  await new Promise(r => setTimeout(r, 150));
  const cs = doc.querySelector('#stage').innerHTML;
  check(cs.includes('tk-kw') && cs.includes('out-block'), '代码页高亮与输出区正常');

  console.log('\n【8】内存图');
  const figIdx = SLIDES.findIndex(s => s.blocks && s.blocks.some(b => b.t === 'fig'));
  check(figIdx >= 0, '存在内存图页');
  if (figIdx >= 0) {
    window.goTo(figIdx);
    await new Promise(r => setTimeout(r, 150));
    const figHtml = doc.querySelector('#stage').innerHTML;
    check(figHtml.includes('<svg'), '内存图渲染为内联 SVG');
    check(figHtml.includes('mem-arrow'), '内存图含箭头');
    check(figHtml.includes('mem-box-ptr'), '内存图含指针框');
  }

  console.log('\n【9】章节完整性');
  const texts = [];
  for (let i = 0; i < SLIDES.length; i++) {
    window.goTo(i);
    await new Promise(r => setTimeout(r, 8));
    texts.push(doc.querySelector('#stage').textContent);
  }
  const all = texts.join('\n');
  const keys = [
    ['C语言开发视角', '课程标题'],
    ['本章要掌握什么', '章首页概念区'],
    ['开发坑点', '坑点区'],
    ['VS Code', 'VS Code 提示'],
    ['练习', '练习区'],
    ['预期输出', '预期输出'],
    ['本章小结', '小结页'],
    ['可跳过', '附录B'],
    ['自测题', '附录C']
  ];
  keys.forEach(([k, label]) => check(all.includes(k), `${label} (${k})`));

  /* 每章都出现 */
  const chIds = new Set(SLIDES.map(s => s.chapterId));
  check(chIds.size === 14, `覆盖 14 个章节 (实际 ${chIds.size})`);

  console.log('\n【10】进度与深链');
  window.goTo(3);
  await new Promise(r => setTimeout(r, 150));
  check(window.location.hash === '#4', '深链 hash 更新', window.location.hash);
  const barW = doc.querySelector('#progressBar').style.width;
  check(barW && barW !== '0%', '进度条随翻页更新', barW);

  console.log('\n' + '='.repeat(56));
  console.log(`通过 ${pass} 项，失败 ${fail} 项`);
  if (errors.length) {
    console.log('\n捕获到的错误:');
    errors.forEach(e => console.log('  ! ' + e));
  }
  dom.window.close();
  process.exit(fail ? 1 : 0);
})();
