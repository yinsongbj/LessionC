/* 生成带初始化的临时页面, 用于截图讲稿面板 / 总览网格等交互态 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const mode = process.argv[2] || 'notes';
const page = process.argv[3] || '1';

const init = {
  notes: `document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ document.getElementById('btnNotes').click(); }, 100); });`,
  thumbs: `document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ document.getElementById('btnOutline').click(); }, 100); });`,
  help: `document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ document.getElementById('btnHelp').click(); }, 100); });`
}[mode] || '';

const html = fs.readFileSync(path.join(ROOT, 'slides.html'), 'utf8');
/* 在 slides.js 之前插入初始化脚本 */
const out = html.replace('<script src="js/slides.js"></script>',
  `<script>${init}</script>\n<script src="js/slides.js"></script>`);

const outPath = path.join(ROOT, '_shot_tmp.html');
fs.writeFileSync(outPath, out, 'utf8');
console.log('已生成 _shot_tmp.html, 模式:', mode);
