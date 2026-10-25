/* ============================================================
 * slides.js — 《C语言开发视角全面教程》讲义模式
 *
 * 一页一屏的授课用课件: 方向键翻页 / 讲稿提示 / 缩略图总览。
 * 与阅读模式共用 js/core.js 的渲染层, 零内容重复。
 * ============================================================ */

/* ============================================================
 * 一、分页: 把章节内容切成一张张幻灯片
 * ============================================================
 *
 * 切分规则:
 *   1. 每个章节先出一张「章首页」: 目标 + 核心概念
 *   2. 章内按 h3 标题切分, 每个 h3 一页
 *   3. 页内代码块超过阈值时, 代码单独占一页(标题加「代码」后缀)
 *   4. 章末出一张「小结页」: 坑点 + VS Code 提示 + 练习 + 小结
 *
 * 每页结构:
 *   { no, chapterId, chapterTitle, chapterNo, tag, group, kind, title, blocks, notes }
 *   kind: 'cover' | 'content' | 'code' | 'summary'
 */

const SLIDE_CODE_SPLIT_LINES = 26;   /* 超过这么多行, 代码单独占一页 */

function buildSlides() {
  const slides = [];

  CHAPTERS.forEach(ch => {
    const base = {
      chapterId: ch.id,
      chapterTitle: ch.title,
      chapterNo: ch.no,
      tag: ch.tag,
      group: ch.group,
      time: ch.time
    };

    /* --- 1) 章首页: 目标 + 核心概念 --- */
    slides.push({
      ...base,
      kind: 'cover',
      title: ch.title,
      goal: ch.goal,
      concepts: ch.concepts || [],
      blocks: []
    });

    /* --- 2) 按 h3 切分正文 --- */
    let cur = null;
    const flush = () => {
      if (!cur) return;
      if (cur.blocks.length) slides.push({ ...base, ...cur });
      cur = null;
    };

    (ch.blocks || []).forEach(b => {
      if (b.t === 'h3') {
        flush();
        cur = { kind: 'content', title: b.text, blocks: [] };
        return;
      }
      if (!cur) {
        /* h3 之前的内容(少见)并入章首页 */
        const cover = slides[slides.length - 1];
        if (cover && cover.chapterId === ch.id) {
          cover.blocks = (cover.blocks || []).concat(b);
          return;
        }
        cur = { kind: 'content', title: ch.title, blocks: [] };
      }
      cur.blocks.push(b);
    });
    flush();

    /* --- 3) 大代码块单独成页 --- */
    const expanded = [];
    slides.filter(s => s.chapterId === ch.id).forEach(s => {
      if (s.kind !== 'content' || !s.blocks) { expanded.push(s); return; }
      const big = s.blocks.filter(b => b.t === 'code' &&
        (b.code || '').split('\n').length > SLIDE_CODE_SPLIT_LINES);
      if (!big.length) { expanded.push(s); return; }

      /* 文字部分留在原页, 大代码搬到独立页 */
      const textBlocks = s.blocks.filter(b => !(b.t === 'code' &&
        (b.code || '').split('\n').length > SLIDE_CODE_SPLIT_LINES));
      if (textBlocks.length) {
        expanded.push({ ...s, blocks: textBlocks });
      }
      big.forEach((b, i) => {
        expanded.push({
          ...base,
          kind: 'code',
          title: (big.length > 1 ? `${s.title} (${i + 1}/${big.length})` : `${s.title} · 代码`),
          blocks: [b]
        });
      });
    });
    /* 替换掉该章原有的 slides */
    for (let i = slides.length - 1; i >= 0; i--) {
      if (slides[i].chapterId === ch.id) slides.splice(i, 1);
    }
    slides.push(...expanded);

    /* --- 4) 章末小结页 --- */
    const ex = EXERCISES[ch.id] || [];
    if ((ch.pitfalls || []).length || (ch.vscode || []).length || ex.length || (ch.summary || []).length) {
      slides.push({
        ...base,
        kind: 'summary',
        title: '本章小结',
        blocks: [],
        pitfalls: ch.pitfalls || [],
        vscode: ch.vscode || [],
        exercises: ex,
        summary: ch.summary || []
      });
    }
  });

  /* --- 统一编号 --- */
  slides.forEach((s, i) => { s.no = i + 1; s.total = slides.length; });
  return slides;
}

/* ============================================================
 * 二、讲稿: 从 notes.js 按 key 取, key = 章节id + 页面特征
 * ============================================================ */

function noteKey(slide) {
  /* 章首页用 chapter id, 正文页用 chapter id + 标题 */
  if (slide.kind === 'cover') return slide.chapterId;
  if (slide.kind === 'summary') return slide.chapterId + '::summary';
  return slide.chapterId + '::' + slide.title;
}

function getNote(slide) {
  if (typeof NOTES === 'undefined' || !NOTES) return '';
  const k = noteKey(slide);
  if (NOTES[k]) return NOTES[k];
  /* 代码页回退到它所属的小节标题 */
  if (slide.kind === 'code') {
    const base = slide.title.replace(/\s*·\s*代码$/, '').replace(/\s*\(\d+\/\d+\)$/, '');
    const k2 = slide.chapterId + '::' + base;
    if (NOTES[k2]) return NOTES[k2];
  }
  return '';
}

/* ============================================================
 * 三、渲染
 * ============================================================ */

function slideHead(s) {
  return `
    <div class="sl-head">
      <div class="sl-chapter">
        <span class="sl-no">${esc(s.chapterNo)}</span>
        <span class="sl-name">${esc(s.chapterTitle)}</span>
      </div>
      <div class="sl-title-wrap">
        <h2 class="sl-title">${esc(s.title)}</h2>
      </div>
      <div class="sl-page">${s.no} / ${s.total}</div>
    </div>`;
}

function renderSlide(s) {
  if (s.kind === 'cover') return renderCoverSlide(s);
  if (s.kind === 'summary') return renderSummarySlide(s);
  return renderContentSlide(s);
}

function renderCoverSlide(s) {
  const concepts = (s.concepts || []).map(c => `
    <div class="sl-concept">
      <div class="sl-concept-t">${rich(c.t)}</div>
      <div class="sl-concept-d">${rich(c.d)}</div>
    </div>`).join('');

  return `
    <div class="sl-cover">
      <div class="sl-cover-left">
        <div class="sl-cover-badge">${esc(s.tag)} · ${esc(s.group)}</div>
        <h1 class="sl-cover-title">${esc(s.title)}</h1>
        <p class="sl-cover-goal">${rich(s.goal)}</p>
        <div class="sl-cover-meta">
          <span class="sl-chip">⏱ ${esc(s.time)}</span>
          <span class="sl-chip">本页 ${s.no} / ${s.total}</span>
        </div>
      </div>
      <div class="sl-cover-right">
        <div class="sl-block-label">本章要掌握什么</div>
        <div class="sl-concepts">${concepts}</div>
      </div>
    </div>`;
}

function renderContentSlide(s) {
  return `
    ${slideHead(s)}
    <div class="sl-body">${renderBlocks(s.blocks)}</div>`;
}

function renderSummarySlide(s) {
  const pitfalls = (s.pitfalls || []).map(p => `
    <div class="pitfall">
      <span class="pitfall-badge">坑点</span>
      <div class="pitfall-body">${rich(p)}</div>
    </div>`).join('');

  const vscode = (s.vscode || []).map(v => {
    const items = Array.isArray(v) ? v : [v];
    return `
    <div class="callout callout-vscode">
      <div class="callout-head"><span>◆</span>VS Code / 调试提示</div>
      <ul>${items.map(i => `<li>${rich(i)}</li>`).join('')}</ul>
    </div>`;
  }).join('');

  const ex = (s.exercises || []).map((e, i) => exerciseBlock(e, i)).join('');

  const summary = (s.summary || []).map(x => `<li>${rich(x)}</li>`).join('');

  return `
    ${slideHead(s)}
    <div class="sl-body sl-body-summary">
      ${pitfalls ? `<div class="sl-sec">
        <div class="sl-block-label">开发坑点</div>
        <div class="pitfall-list">${pitfalls}</div>
      </div>` : ''}
      ${vscode}
      ${ex ? `<div class="sl-sec">
        <div class="sl-block-label">练习（答案点击展开）</div>
        ${ex}
      </div>` : ''}
      ${summary ? `<div class="summary">
        <h4>本章小结</h4><ul>${summary}</ul>
      </div>` : ''}
    </div>`;
}

/* ============================================================
 * 四、总览网格
 * ============================================================ */

function renderThumbs() {
  const box = $('#thumbs');
  if (!box.dataset.built) {
    box.innerHTML = SLIDES.map((s, i) => `
      <button class="thumb" type="button" data-goto="${i}">
        <div class="t-no">${String(s.no).padStart(2, '0')}</div>
        <div class="t-chapter">${esc(s.chapterNo)} ${esc(s.chapterTitle)}</div>
        <div class="t-title">${esc(s.title)}</div>
        <div class="t-kind">${kindLabel(s.kind)}</div>
      </button>`).join('');
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

function kindLabel(k) {
  return { cover: '章首', content: '正文', code: '代码', summary: '小结' }[k] || '正文';
}

/* ============================================================
 * 五、导航
 * ============================================================ */

let current = 0;
let SLIDES = [];

function goTo(idx, push) {
  const n = SLIDES.length;
  current = Math.max(0, Math.min(n - 1, idx));
  const s = SLIDES[current];

  const stage = $('#slideBody');
  stage.innerHTML = renderSlide(s);
  stage.classList.remove('slide-in');
  void stage.offsetWidth;      /* 强制重排, 触发进场动画 */
  stage.classList.add('slide-in');

  $('#progressBar').style.width = ((current + 1) / n * 100) + '%';
  $('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${n}`;
  $('#btnPrev').disabled = current === 0;
  $('#btnNext').disabled = current === n - 1;
  $('#statusTitle').textContent = `${s.chapterNo} · ${s.chapterTitle} — ${s.title}`;

  renderNotes();
  renderThumbs();

  if (push !== false && location.hash !== '#' + (current + 1)) {
    history.replaceState(null, '', '#' + (current + 1));
  }
  setStored('c-course-slides-current', String(current));
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

/* ============================================================
 * 六、讲稿面板
 * ============================================================ */

function renderNotes() {
  const s = SLIDES[current];
  const text = getNote(s);
  $('#notesTitle').textContent = `${s.chapterNo} · ${s.title}`;
  $('#notesBody').innerHTML = text
    ? text.split('\n').map(l => `<p>${rich(l)}</p>`).join('')
    : '<p class="notes-empty">这一页没有写讲稿，按 N 键关闭。</p>';
}

function openNotes() {
  $('#notes').classList.add('show');
  fitStage();
}
function closeNotes() {
  $('#notes').classList.remove('show');
  fitStage();
}
function toggleNotes() {
  if ($('#notes').classList.contains('show')) closeNotes();
  else openNotes();
}

/* ============================================================
 * 七、总览浮层
 * ============================================================ */

function openOverlay() {
  $('#overlay').classList.add('show');
  renderThumbs();
}
function closeOverlay() {
  $('#overlay').classList.remove('show');
}

/* ============================================================
 * 八、主题
 * ============================================================ */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === 'light';
  $('#btnTheme').innerHTML = isLight
    ? '<span class="ico">☀</span>浅色'
    : '<span class="ico">☾</span>深色';
  setStored('c-course-slides-theme', theme);
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
}

/* ============================================================
 * 九、舞台缩放: 固定 1600x900, 等比缩放适配窗口
 * ============================================================ */

const STAGE_W = 1600;
const STAGE_H = 900;

function fitStage() {
  const stage = $('#stage');
  /* 舞台按 16:9 等比缩放, 居中铺满窗口。
     用 clientWidth/clientHeight 而不是 innerWidth/innerHeight:
     后者含滚动条宽度, 在部分环境下与实际可视区不一致。
     讲稿面板展开时, 舞台在剩余区域居中, 避免被面板压住。 */
  const doc = document.documentElement;
  const notesOpen = document.getElementById('notes')?.classList.contains('show');
  const notesW = notesOpen ? 400 : 0;
  const w = (doc.clientWidth || window.innerWidth || STAGE_W) - notesW;
  const h = doc.clientHeight || window.innerHeight || STAGE_H;
  const scale = Math.min(w / STAGE_W, h / STAGE_H);
  const left = notesW + (w - STAGE_W * scale) / 2;
  const top = (h - STAGE_H * scale) / 2;
  stage.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
}

/* ============================================================
 * 十、事件绑定
 * ============================================================ */

function bindEvents() {
  document.addEventListener('click', e => {
    const go = e.target.closest('[data-goto]');
    if (go && go.dataset.goto !== '' && go.dataset.goto !== undefined) {
      goTo(Number(go.dataset.goto));
      return;
    }
    const cp = e.target.closest('[data-copy]');
    if (cp) { copyCode(cp); return; }
    const tog = e.target.closest('[data-toggle-out]');
    if (tog) { tog.closest('.out-block').classList.toggle('open'); return; }
    const ans = e.target.closest('[data-toggle-ans]');
    if (ans) { ans.closest('.exercise').classList.add('open'); return; }
  });

  $('#btnNext').addEventListener('click', next);
  $('#btnPrev').addEventListener('click', prev);
  $('#btnOutline').addEventListener('click', openOverlay);
  $('#btnTheme').addEventListener('click', toggleTheme);
  $('#btnHelp').addEventListener('click', () => $('#helpPanel').classList.toggle('show'));
  $('#btnNotes').addEventListener('click', toggleNotes);
  $('#overlayClose').addEventListener('click', closeOverlay);
  $('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay') closeOverlay(); });
  $('#notesClose').addEventListener('click', closeNotes);

  /* 进度条点击跳页 */
  $('#progressWrap').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    goTo(Math.round(ratio * (SLIDES.length - 1)));
  });

  /* 键盘 */
  document.addEventListener('keydown', e => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); goTo(0); break;
      case 'End': e.preventDefault(); goTo(SLIDES.length - 1); break;
      case 'n': case 'N': toggleNotes(); break;
      case 'o': case 'O': openOverlay(); break;
      case 't': case 'T': toggleTheme(); break;
      case 'f': case 'F':
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
        break;
      case '?': $('#helpPanel').classList.toggle('show'); break;
      case 'Escape':
        closeOverlay();
        closeNotes();
        $('#helpPanel').classList.remove('show');
        break;
    }
  });

  /* 触摸滑动翻页 */
  let touchX = null;
  $('#stage').addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  $('#stage').addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
    touchX = null;
  }, { passive: true });

  window.addEventListener('resize', fitStage);
}

/* ============================================================
 * 十一、启动
 * ============================================================ */

/* 顶层 const/let 不会挂到 window, 显式暴露便于调试与自动化测试 */
if (typeof window !== 'undefined') {
  window.SLIDES = SLIDES;
  window.goTo = goTo;
  window.next = next;
  window.prev = prev;
  window.buildSlides = buildSlides;
}

function boot() {
  /* 主题 */
  const urlTheme = new URLSearchParams(location.search).get('theme');
  const saved = getStored('c-course-slides-theme');
  applyTheme(urlTheme === 'light' || urlTheme === 'dark'
    ? urlTheme
    : (saved === 'light' ? 'light' : 'dark'));

  SLIDES = buildSlides();
  if (typeof window !== 'undefined') window.SLIDES = SLIDES;

  /* 初始页: hash 优先, 其次 localStorage */
  const hash = parseInt((location.hash || '').replace('#', ''), 10);
  let start = 0;
  if (Number.isFinite(hash) && hash > 0 && hash <= SLIDES.length) {
    start = hash - 1;
  } else {
    const saved2 = parseInt(getStored('c-course-slides-current') || '', 10);
    if (Number.isFinite(saved2) && saved2 >= 0 && saved2 < SLIDES.length) start = saved2;
  }

  bindEvents();
  fitStage();
  goTo(start, false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
