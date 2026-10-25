/* ============================================================
 * verify.js — 把 chapters.js 里每个代码块真实编译运行一遍
 *
 * 流程：
 *   1. 读 js/chapters.js，用沙箱 eval 出 CHAPTERS
 *   2. 遍历所有 t:'code' 的块，写成临时 .c 文件
 *   3. gcc -std=c11 -Wall -Wextra 编译
 *   4. 有 stdin 的喂输入后运行，取 stdout
 *   5. 与块里的 expect 比对，同时回填 js/outputs.js
 *
 * 用法：node tools/verify.js
 * ============================================================ */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'ctut-'));

/* ---- 载入 chapters.js ---- */
const src = fs.readFileSync(path.join(ROOT, 'js', 'chapters.js'), 'utf8');
const vm = require('vm');
const sandbox = { console };
vm.createContext(sandbox);
/* const 声明不会挂到沙箱对象上, 追加表达式显式取回 */
const CHAPTERS = vm.runInContext(src + '\n;CHAPTERS;', sandbox);

if (!Array.isArray(CHAPTERS)) {
  console.error('✗ chapters.js 没有导出 CHAPTERS 数组');
  process.exit(1);
}

/* ---- 收集所有代码块 ---- */
const blocks = [];
for (const ch of CHAPTERS) {
  for (const b of ch.blocks || []) {
    if (b.t === 'code') blocks.push({ ...b, chapter: ch.id });
  }
}

console.log(`共 ${CHAPTERS.length} 章，${blocks.length} 个代码块\n`);

/* ---- 编译运行 ---- */
const outputs = {};
let pass = 0;
const fails = [];
const warnOnly = [];
const warnExpected = [];   /* 刻意保留的教学警告 */

for (const b of blocks) {
  /* 非 C 代码块(shell 命令 / json 配置等)不是 C 程序, 只检查内容非空 */
  if (b.lang && b.lang !== 'c') {
    if (!b.code || !b.code.trim()) {
      fails.push({ id: b.id, chapter: b.chapter, reason: '内容为空', detail: '' });
    } else {
      pass++;
      console.log(`✓ ${b.id.padEnd(16)} ${b.lang} 代码块 (跳过编译)`);
    }
    continue;
  }

  /* 教学片段: 没有 main, 无法独立编译, 跳过但记录 */
  if (b.fragment) {
    pass++;
    console.log(`✓ ${b.id.padEnd(16)} 教学片段 (跳过独立编译)`);
    continue;
  }

  const cfile = path.join(TMP, b.id + '.c');
  const exe = path.join(TMP, b.id + (process.platform === 'win32' ? '.exe' : ''));

  /* 多文件示例: 每个文件按原名落盘到独立目录, 一起编译链接 */
  let srcFiles = [];
  if (Array.isArray(b.files) && b.files.length) {
    const dir = path.join(TMP, b.id + '_dir');
    fs.mkdirSync(dir, { recursive: true });
    srcFiles = b.files.map(f => {
      const p = path.join(dir, f.name);
      fs.writeFileSync(p, f.code, 'utf8');
      return p;
    });
  } else {
    fs.writeFileSync(cfile, b.code, 'utf8');
    srcFiles = [cfile];
  }

  // 编译：严格模式, 单独捕获 stderr 以便记录 warning
  let compileOut = '';
  let compiled = true;
  {
    const r = spawnSync('gcc',
      ['-std=c11', '-Wall', '-Wextra', '-O2', ...srcFiles, '-o', exe],
      { encoding: 'utf8' });
    if (r.status !== 0) {
      compiled = false;
      compileOut = (r.stderr || '') + (r.stdout || '');
    } else {
      compileOut = (r.stderr || '').trim();
    }
  }

  if (!compiled) {
    fails.push({ id: b.id, chapter: b.chapter, reason: '编译失败', detail: compileOut.trim() });
    console.log(`✗ ${b.id.padEnd(16)} 编译失败`);
    continue;
  }

  // 有编译警告但编译成功
  if (compileOut && compileOut.trim()) {
    if (b.expectWarn) {
      /* 刻意演示的坑点, 警告是教学内容的一部分 */
      warnExpected.push({ id: b.id, detail: compileOut.trim() });
    } else {
      warnOnly.push({ id: b.id, detail: compileOut.trim() });
    }
  }

  // 运行
  let stdout = '';
  try {
    stdout = execFileSync(exe, [], {
      encoding: 'utf8',
      input: b.stdin || '',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000
    });
  } catch (e) {
    fails.push({ id: b.id, chapter: b.chapter, reason: '运行失败', detail: String(e.stderr || e.message).trim() });
    console.log(`✗ ${b.id.padEnd(16)} 运行失败`);
    continue;
  }

  stdout = stdout.replace(/\r\n/g, '\n').replace(/\s+$/, '');
  outputs[b.id] = stdout;

  /* 地址是运行时相关的, 比对前统一归一化 (%p 打印 0x... 或纯十六进制) */
  const norm = s => s
    .replace(/0x[0-9a-fA-F]+/g, 'ADDR')
    .replace(/\b[0-9a-fA-F]{12,16}\b/g, 'ADDR');

  // 比对 expect
  const expect = (b.expect || '').replace(/\r\n/g, '\n').replace(/\s+$/, '');
  if (!expect) {
    // 无 expect 的块（纯声明片段）跳过比对
    pass++;
    console.log(`✓ ${b.id.padEnd(16)} 编译运行通过（无预期输出）`);
  } else if (norm(stdout) === norm(expect)) {
    pass++;
    console.log(`✓ ${b.id.padEnd(16)} 输出完全一致`);
  } else {
    fails.push({
      id: b.id, chapter: b.chapter, reason: '输出不一致',
      detail: `期望:\n${expect}\n实际:\n${stdout}`
    });
    console.log(`✗ ${b.id.padEnd(16)} 输出不一致`);
  }
}

/* ---- 写 outputs.js ---- */
const jsOut = '/* ============================================================\n' +
  ' * outputs.js — 由 tools/verify.js 用 gcc 实测生成, 请勿手改\n' +
  ' * 每个 key 对应 chapters.js 中一个代码块的 id\n' +
  ' * ============================================================ */\n\n' +
  'const OUTPUTS = ' + JSON.stringify(outputs, null, 2) + ';\n\n' +
  '/* 暴露到全局, 便于调试与自动化测试 */\n' +
  'if (typeof window !== "undefined") window.OUTPUTS = OUTPUTS;\n';
fs.writeFileSync(path.join(ROOT, 'js', 'outputs.js'), jsOut, 'utf8');

/* ---- 报告 ---- */
console.log('\n' + '='.repeat(60));
console.log(`编译运行通过: ${pass} / ${blocks.length}`);

if (warnOnly.length) {
  console.log(`\n[!] 非预期的编译警告 (${warnOnly.length} 个) —— 这些应当修掉:`);
  for (const w of warnOnly) {
    console.log(`\n  ⚠ ${w.id}`);
    console.log(w.detail.split('\n').map(l => '    ' + l).join('\n'));
  }
}

if (warnExpected.length) {
  console.log(`\n[√] 刻意保留的教学警告 (${warnExpected.length} 个) —— 正是要讲的坑点:`);
  for (const w of warnExpected) {
    const firstLine = (w.detail.split('\n').find(l => l.includes('warning:')) || '').trim();
    console.log(`  ⚠ ${w.id.padEnd(14)} ${firstLine}`);
  }
}

if (fails.length) {
  console.log(`\n失败 (${fails.length} 个):`);
  for (const f of fails) {
    console.log(`\n  ✗ ${f.id} [${f.chapter}] ${f.reason}`);
    console.log(f.detail.split('\n').map(l => '    ' + l).join('\n'));
  }
}

console.log('\n已生成 js/outputs.js');
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(fails.length ? 1 : 0);
