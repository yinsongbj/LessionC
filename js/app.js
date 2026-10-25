/* ============================================================
 * app.js — 《C语言开发视角全面教程》阅读模式
 *
 * 可滚动的长文教程, 适合自学与查阅。
 * 渲染逻辑全部来自 js/core.js, 与讲义模式 (slides.js) 共用。
 * ============================================================ */

/* 共享渲染层 (core.js): esc / rich / highlight / codeBlock / tableBlock
   / calloutBlock / figureBlock / exerciseBlock / renderBlocks
   / getStored / setStored */

function renderChapter(ch) {
  const ex = (EXERCISES[ch.id] || []);
  const concepts = (ch.concepts || []).map(c => `
    <div class="concept">
      <div class="concept-t">${rich(c.t)}</div>
      <div class="concept-d">${rich(c.d)}</div>
    </div>`).join('');

  const pitfalls = (ch.pitfalls || []).map(p => `
    <div class="pitfall">
      <span class="pitfall-badge">坑点</span>
      <div class="pitfall-body">${rich(p)}</div>
    </div>`).join('');

  /* vscode 既支持字符串数组, 也支持字符串数组的数组(每个元素一组提示) */
  const vscode = (ch.vscode || []).map(v => {
    const items = Array.isArray(v) ? v : [v];
    return `
    <div class="callout callout-vscode">
      <div class="callout-head"><span>◆</span>VS Code / 调试提示</div>
      <ul>${items.map(i => `<li>${rich(i)}</li>`).join('')}</ul>
    </div>`;
  }).join('');

  const summary = (ch.summary || []).map(s => `<li>${rich(s)}</li>`).join('');

  return `
    <div class="ch-head">
      <div class="ch-tag">${esc(ch.tag)}</div>
      <h2>${rich(ch.title)}</h2>
      <p class="ch-goal">${rich(ch.goal)}</p>
      <div class="ch-meta">
        <span>⏱ 预计 ${esc(ch.time)}</span>
        ${(ch.tags || []).map(t => `<span>#${esc(t)}</span>`).join('')}
      </div>
    </div>

    ${concepts ? `<h3>核心概念</h3><div class="concepts">${concepts}</div>` : ''}

    ${renderBlocks(ch.blocks)}

    ${pitfalls ? `<h3>开发坑点</h3><div class="pitfall-list">${pitfalls}</div>` : ''}
    ${vscode}

    ${ex.length ? `<h3>练习</h3>${ex.map(exerciseBlock).join('')}` : ''}

    ${summary ? `<div class="summary"><h4>本章小结</h4><ul>${summary}</ul></div>` : ''}`;
}

/* ---------------- 侧边栏 ---------------- */

function renderNav() {
  const box = $('#chapterNav');
  const q = ($('#search').value || '').trim().toLowerCase();

  const groups = [];
  let cur = null;
  CHAPTERS.forEach(ch => {
    if (ch.group !== cur) {
      cur = ch.group;
      groups.push({ name: cur, items: [] });
    }
    groups[groups.length - 1].items.push(ch);
  });

  const html = groups.map(g => {
    const items = g.items.filter(ch => {
      if (!q) return true;
      const hay = (ch.title + ' ' + ch.goal + ' ' + (ch.tags || []).join(' ') + ' ' +
                   (ch.keywords || []).join(' ')).toLowerCase();
      return hay.includes(q);
    });
    if (!items.length) return '';
    return `
      <div class="nav-group-label">${esc(g.name)}</div>
      ${items.map(ch => `
        <button class="chap-item" type="button" data-goto="${ch.id}">
          <span class="chap-no">${esc(ch.no)}</span>
          <span class="chap-txt">${esc(ch.title)}</span>
        </button>`).join('')}`;
  }).join('');

  box.innerHTML = html || '<div class="nav-empty">没有匹配的章节，换个关键词试试。</div>';
  updateChapState();
}

function updateChapState() {
  const read = getRead();
  $$('.chap-item').forEach(el => {
    const id = el.dataset.goto;
    el.classList.toggle('active', id === currentId);
    el.classList.toggle('read', read.has(id));
  });
  const total = CHAPTERS.length;
  const n = read.size;
  $('#spCount').textContent = `${n} / ${total}`;
  $('#spFill').style.width = (total ? (n / total * 100) : 0) + '%';
}

/* ---------------- 路由 ---------------- */

let currentId = null;

function chapterById(id) {
  return CHAPTERS.find(c => c.id === id) || null;
}

function resolveHash() {
  const raw = (location.hash || '').replace(/^#/, '').trim();
  if (raw && chapterById(raw)) return raw;
  const saved = getStored('c-course-tut-current');
  if (saved && chapterById(saved)) return saved;
  return CHAPTERS[0].id;
}

function goTo(id, push) {
  const ch = chapterById(id);
  if (!ch) return;
  currentId = id;
  $('#content').innerHTML = renderChapter(ch);
  window.scrollTo(0, 0);
  document.title = `${ch.title} · C语言开发视角全面教程`;

  $('#crumb').textContent = ch.tag;
  $('#topTitle').textContent = ch.title;
  $('#topTime').textContent = '⏱ ' + ch.time;

  const idx = CHAPTERS.findIndex(c => c.id === id);
  const prev = CHAPTERS[idx - 1];
  const next = CHAPTERS[idx + 1];

  $('#btnPrev').disabled = !prev;
  $('#btnNext').disabled = !next;

  $('#pageNav').innerHTML = `
    <button class="pn-card" type="button" data-goto="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'}>
      <div class="pn-dir">← 上一章</div>
      <div class="pn-title">${prev ? esc(prev.title) : '已是第一章'}</div>
    </button>
    <button class="pn-card next" type="button" data-goto="${next ? next.id : ''}" ${next ? '' : 'disabled'}>
      <div class="pn-dir">下一章 →</div>
      <div class="pn-title">${next ? esc(next.title) : '已是最后一章'}</div>
    </button>`;

  if (push !== false && location.hash !== '#' + id) {
    history.replaceState(null, '', '#' + id);
  }
  setStored('c-course-tut-current', id);

  updateChapState();
  updateScrollProgress();
  closeDrawer();
}

/* ---------------- 存储 ---------------- */

function getRead() {
  try {
    const raw = getStored('c-course-tut-read');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (_) { return new Set(); }
}
function saveRead(set) {
  setStored('c-course-tut-read', JSON.stringify([...set]));
}
function markRead(id) {
  const read = getRead();
  if (read.has(id)) return;
  read.add(id);
  saveRead(read);
  updateChapState();
}

/* ---------------- 主题 ---------------- */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === 'light';
  $('#themeIco').textContent = isLight ? '☀' : '☾';
  $('#themeTxt').textContent = isLight ? '亮色模式' : '深色模式';
  setStored('c-course-tut-theme', theme);
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
}

/* ---------------- 抽屉 ---------------- */

function openDrawer() {
  $('#sidebar').classList.add('open');
  $('#scrim').hidden = false;
}
function closeDrawer() {
  $('#sidebar').classList.remove('open');
  $('#scrim').hidden = true;
}
function isMobile() {
  /* matchMedia 在极老浏览器或部分嵌入式环境可能不存在, 做防御 */
  if (!window.matchMedia) return window.innerWidth <= 980;
  return window.matchMedia('(max-width: 980px)').matches;
}

/* ---------------- 复制 / 提示 ---------------- */

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove('show'), 1600);
}

async function copyCode(btn) {
  const code = document.getElementById(btn.dataset.copy);
  if (!code) return;
  const text = code.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    /* file:// 下 clipboard API 常被拒, 退回 execCommand */
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (__) {}
    document.body.removeChild(ta);
  }
  btn.textContent = '已复制';
  btn.classList.add('done');
  setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('done'); }, 1600);
  toast('代码已复制，粘贴到 VS Code 里直接跑');
}

/* ---------------- 阅读进度 ---------------- */

function updateScrollProgress() {
  const el = $('#content');
  if (!el) return;
  const top = el.offsetTop;
  const h = el.offsetHeight - window.innerHeight + top;
  const p = h <= 0 ? 1 : Math.min(1, Math.max(0, (window.scrollY - top + 120) / h));
  $('#scrollFill').style.width = (p * 100) + '%';
  if (p > 0.92 && currentId) markRead(currentId);
}

/* ---------------- 事件 ---------------- */

function bindEvents() {
  document.addEventListener('click', e => {
    const go = e.target.closest('[data-goto]');
    if (go && go.dataset.goto) { goTo(go.dataset.goto); return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) { copyCode(cp); return; }
    const tog = e.target.closest('[data-toggle-out]');
    if (tog) { tog.closest('.out-block').classList.toggle('open'); return; }
    const ans = e.target.closest('[data-toggle-ans]');
    if (ans) { ans.closest('.exercise').classList.add('open'); return; }
  });

  $('#search').addEventListener('input', renderNav);
  $('#btnTheme').addEventListener('click', toggleTheme);
  $('#btnMenu').addEventListener('click', openDrawer);
  $('#btnClose').addEventListener('click', closeDrawer);
  $('#scrim').addEventListener('click', closeDrawer);
  $('#btnPrev').addEventListener('click', () => step(-1));
  $('#btnNext').addEventListener('click', () => step(1));

  window.addEventListener('hashchange', () => {
    const id = resolveHash();
    if (id !== currentId) goTo(id);
  });

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  document.addEventListener('keydown', e => {
    const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);

    if (e.key === '/' && !inField) {
      e.preventDefault();
      if (isMobile()) openDrawer();
      $('#search').focus();
      $('#search').select();
      return;
    }
    if (e.key === 'Escape') {
      if (inField) { e.target.blur(); return; }
      closeDrawer();
      return;
    }
    if (inField) return;

    if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  window.addEventListener('resize', () => { if (!isMobile()) closeDrawer(); });
}

function step(dir) {
  const idx = CHAPTERS.findIndex(c => c.id === currentId);
  const t = CHAPTERS[idx + dir];
  if (t) goTo(t.id);
}

/* ---------------- 启动 ---------------- */

function boot() {
  /* 主题: URL 参数 > localStorage > 默认深色 */
  const urlTheme = new URLSearchParams(location.search).get('theme');
  const saved = getStored('c-course-tut-theme');
  applyTheme(urlTheme === 'light' || urlTheme === 'dark'
    ? urlTheme
    : (saved === 'light' ? 'light' : 'dark'));

  renderNav();
  bindEvents();
  goTo(resolveHash(), false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
