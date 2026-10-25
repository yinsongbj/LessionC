/* ============================================================
 * core.js — 共享渲染层
 *
 * 阅读模式 (app.js) 与讲义模式 (slides.js) 共用同一套渲染逻辑,
 * 保证两边的代码高亮、表格、提示框、内存图完全一致。
 * ============================================================ */

/* ---------------- 基础工具 ---------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* 顶层 const 不会挂到 window, 显式暴露便于调试与自动化测试 */
if (typeof window !== 'undefined') {
  window.$ = $;
  window.$$ = $$;
}

/** HTML 转义 */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** 转义后再把 `反引号` 转成 <code>，**双星号** 转成 <strong> */
function rich(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/* ---------------- 语法高亮 ---------------- */

const C_KEYWORDS = new Set([
  'auto', 'break', 'case', 'const', 'continue', 'default', 'do', 'else',
  'enum', 'extern', 'for', 'goto', 'if', 'inline', 'register', 'restrict',
  'return', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
  'volatile', 'while',
  'int', 'char', 'double', 'float', 'long', 'short', 'signed', 'unsigned',
  'void', 'bool',
  'main'
]);

/**
 * C 语言语法高亮。
 * 顺序要紧：注释 → 字符串/字符 → 预处理 → 数字 → 标识符
 * 否则字符串里的 // 会被当注释，注释里的引号会破坏后续解析
 */
function highlightC(src) {
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];

    // 1) 块注释
    if (c === '/' && c2 === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      out += `<span class="tk-cmt">${esc(src.slice(i, stop))}</span>`;
      i = stop;
      continue;
    }

    // 2) 行注释
    if (c === '/' && c2 === '/') {
      let j = i;
      while (j < n && src[j] !== '\n') j++;
      out += `<span class="tk-cmt">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // 3) 字符串 / 字符常量
    if (c === '"' || c === "'") {
      const q = c;
      let j = i + 1;
      while (j < n && src[j] !== q) {
        if (src[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, n);
      out += `<span class="tk-str">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    // 4) 预处理指令（整行）
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
      let k = j;
      while (k < n && src[k] === ' ') k++;
      const isCall = src[k] === '(';
      if (isCall) {
        out += `<span class="tk-fn">${esc(word)}</span>`;
      } else if (C_KEYWORDS.has(word)) {
        out += `<span class="tk-kw">${esc(word)}</span>`;
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

/** Shell / 命令行高亮：注释 → 字符串 → 关键字 → 选项 */
function highlightShell(src) {
  const KW = new Set(['gcc', 'cd', 'code', 'gdb', 'ls', 'mkdir', 'cat', 'echo']);
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '#') {
      let j = i;
      while (j < n && src[j] !== '\n') j++;
      out += `<span class="tk-cmt">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    if (c === '"' || c === "'") {
      const q = c;
      let j = i + 1;
      while (j < n && src[j] !== q) j++;
      j = Math.min(j + 1, n);
      out += `<span class="tk-str">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_.\-\/]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const isOpt = word.startsWith('-');
      if (KW.has(word))      out += `<span class="tk-fn">${esc(word)}</span>`;
      else if (isOpt)        out += `<span class="tk-num">${esc(word)}</span>`;
      else                   out += esc(word);
      i = j;
      continue;
    }
    out += esc(c);
    i++;
  }
  return out;
}

/** JSON 高亮：字符串键 / 字符串值 / 数字 / 布尔 */
function highlightJson(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '"') {
      let j = i + 1;
      while (j < n && src[j] !== '"') {
        if (src[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, n);
      const str = src.slice(i, j);
      let k = j;
      while (k < n && src[k] === ' ') k++;
      const isKey = src[k] === ':';
      out += `<span class="${isKey ? 'tk-fn' : 'tk-str'}">${esc(str)}</span>`;
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9.eE+-]/.test(src[j])) j++;
      out += `<span class="tk-num">${esc(src.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    if (src.startsWith('true', i) || src.startsWith('false', i) || src.startsWith('null', i)) {
      const kw = src.startsWith('true', i) ? 'true' : (src.startsWith('false', i) ? 'false' : 'null');
      out += `<span class="tk-kw">${kw}</span>`;
      i += kw.length;
      continue;
    }
    out += esc(c);
    i++;
  }
  return out;
}

/** 根据 lang 选高亮器 */
function highlight(src, lang) {
  if (lang === 'bash') return highlightShell(src);
  if (lang === 'json') return highlightJson(src);
  return highlightC(src);
}

/* ---------------- 片段构造 ---------------- */

/**
 * 代码块：高亮 + 复制按钮 + 可折叠的「预期输出」
 * 优先使用 outputs.js 里由 gcc 实测生成的输出，其次用章节里手写的 expect
 */
function codeBlock(block, opts = {}) {
  const id = 'src_' + block.id;
  const outText = (typeof OUTPUTS !== 'undefined' && OUTPUTS[block.id] != null)
    ? OUTPUTS[block.id]
    : (block.expect != null ? block.expect : '');

  const outBlock = outText ? `
      <div class="out-block open">
        <button class="out-head" type="button" data-toggle-out>
          <span class="chev">▶</span> ${opts.outLabel || '预期输出'}
          <span class="out-hint">点击折叠</span>
        </button>
        <div class="out-body">
          <pre>${esc(outText)}</pre>
          ${block.stdin ? `<div class="out-note">运行时的标准输入：<code>${esc(block.stdin)}</code></div>` : ''}
          ${block.note ? `<div class="out-note">${rich(block.note)}</div>` : ''}
        </div>
      </div>` : '';

  return `
    <div class="code-block${opts.compact ? ' code-compact' : ''}">
      <div class="code-bar">
        <span class="code-file">${esc(block.file || '')}</span>
        ${block.title ? `<span class="code-title">${esc(block.title)}</span>` : '<span class="code-title"></span>'}
        <button class="copy-btn" type="button" data-copy="${id}">复制</button>
      </div>
      <div class="code-scroll"><pre><code id="${id}">${highlight(block.code, block.lang)}</code></pre></div>
      ${outBlock}
    </div>`;
}

function tableBlock(block) {
  const head = (block.head || []).map(h => `<th>${rich(h)}</th>`).join('');
  const rows = (block.rows || []).map(r =>
    `<tr>${r.map(c => `<td>${rich(c)}</td>`).join('')}</tr>`).join('');
  return `
    <div class="table-wrap">
      <table class="cmp">
        ${head ? `<thead><tr>${head}</tr></thead>` : ''}
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${block.caption ? `<div class="out-note table-caption">${rich(block.caption)}</div>` : ''}`;
}

function calloutBlock(block) {
  const icons = { pitfall: '⚠', warn: '⚠', vscode: '◆', note: 'ℹ', ok: '✔' };
  const kind = block.kind || 'note';
  return `
    <div class="callout callout-${kind}">
      <div class="callout-head"><span>${icons[kind] || 'ℹ'}</span>${esc(block.title || '')}</div>
      ${block.items
        ? `<ul>${block.items.map(i => `<li>${rich(i)}</li>`).join('')}</ul>`
        : `<p>${rich(block.text || '')}</p>`}
    </div>`;
}

function figureBlock(block) {
  return `
    <figure class="mem-figure">
      ${block.svg}
      <figcaption>${rich(block.caption || '')}</figcaption>
    </figure>`;
}

function exerciseBlock(ex, idx) {
  const ansCode = ex.code
    ? `<pre><code>${highlight(ex.code, ex.lang || 'c')}</code></pre>`
    : '';
  return `
    <div class="exercise">
      <div class="ex-q">
        <span class="ex-no">${idx + 1}</span>
        <div class="ex-text">${rich(ex.q)}</div>
      </div>
      <button class="ans-btn" type="button" data-toggle-ans>显示答案</button>
      <div class="ex-answer">
        <div class="ans-label">参考答案</div>
        ${ansCode}
        ${ex.a ? `<div class="ans-note">${rich(ex.a)}</div>` : ''}
      </div>
    </div>`;
}

/** 渲染一组内容块 */
function renderBlocks(blocks) {
  return (blocks || []).map(b => {
    switch (b.t) {
      case 'h3':    return `<h3>${rich(b.text)}</h3>`;
      case 'h4':    return `<h4>${rich(b.text)}</h4>`;
      case 'p':     return `<p>${rich(b.text)}</p>`;
      case 'ul':    return `<ul>${(b.items || []).map(i => `<li>${rich(i)}</li>`).join('')}</ul>`;
      case 'ol':    return `<ol>${(b.items || []).map(i => `<li>${rich(i)}</li>`).join('')}</ol>`;
      case 'table': return tableBlock(b);
      case 'code':  return codeBlock(b);
      case 'callout': return calloutBlock(b);
      case 'fig':   return figureBlock(b);
      default:      return '';
    }
  }).join('');
}

/* ---------------- 存储 (localStorage 不可用时降级到内存) ---------------- */

const memStore = {};

function getStored(key) {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch (_) {}
  return key in memStore ? memStore[key] : null;
}

function setStored(key, val) {
  memStore[key] = val;
  try { localStorage.setItem(key, val); } catch (_) {}
}
