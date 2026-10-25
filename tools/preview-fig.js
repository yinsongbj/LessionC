/* 生成单图预览页, 用于截图检查某个 SVG 图块 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const sb = { console };
vm.createContext(sb);
const src = fs.readFileSync(path.join(ROOT, 'js', 'chapters.js'), 'utf8');
const CHAPTERS = vm.runInContext(src + '\n;CHAPTERS;', sb);

const chapterId = process.argv[2] || 'chapter-7';
const theme = process.argv[3] || 'dark';
const ch = CHAPTERS.find(c => c.id === chapterId);
const fig = (ch.blocks || []).find(b => b.t === 'fig');
if (!fig) { console.error('该章没有 fig 块'); process.exit(1); }

const html = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="${theme}">
<head><meta charset="utf-8"><link rel="stylesheet" href="css/style.css"></head>
<body style="padding:30px;background:var(--bg)">
<div style="max-width:760px;margin:0 auto">
<figure class="mem-figure">${fig.svg}<figcaption>${fig.caption}</figcaption></figure>
</div></body></html>`;

fs.writeFileSync(path.join(ROOT, '_mem_preview.html'), html, 'utf8');
console.log('已生成 _mem_preview.html');
