/* ============================================================
 * chapters.js — 《C语言开发视角全面教程》章节数据
 *
 * 结构约定（每章字段）：
 *   id / no / tag / group / title / goal / time / tags
 *   concepts[]  {t, d}        核心概念，≤6 条
 *   blocks[]    章节正文块，类型见 app.js 的 renderBlocks
 *   pitfalls[]  开发坑点，2~4 条
 *   vscode[]    VS Code / 调试提示，1~2 条
 *   summary[]   小结，≤3 条
 *
 * 代码块 blocks 里的 {t:'code', id, file, code, expect, stdin}
 *   id    唯一标识，用于和 outputs.js（gcc 实测输出）对应
 *   expect 手写预期输出，校验脚本会比对实测结果
 * ============================================================ */

const CHAPTERS = [

/* ============================================================
 * 第 0 章
 * ============================================================ */
{
  id: 'chapter-0',
  no: '00',
  tag: '第 0 章',
  group: '起步',
  title: '学习路线与开发环境',
  goal: '搞清楚学 C 的最短路径，把编辑器、编译器、调试器三件套装好，写出第一个能跑的程序。',
  time: '20 分钟',
  tags: ['环境', '路线图', 'gcc', 'VS Code'],
  keywords: ['gcc', 'VS Code', 'hello', 'F5', '编译', '路线图'],
  concepts: [
    { t: '三件套', d: 'VS Code 写代码、gcc 转成机器码、GDB 断点查错，缺一不可' },
    { t: '最小路线', d: '变量 → 判断 → 循环 → 函数 → 指针/数组 → 结构体 → 项目' },
    { t: '一条命令编译', d: 'gcc hello.c -o hello.exe，然后 ./hello.exe 运行' },
    { t: 'F5 调试', d: '装好扩展后按 F5 直接进调试器，断点、单步、看变量一步到位' },
    { t: '不学什么', d: '位运算、递归、链表、文件操作现阶段用不上，先跳过' }
  ],
  blocks: [
    { t: 'h3', text: '先说结论：你要装的东西只有三样' },
    { t: 'p', text: '很多人卡在 C 语言不是语法难，是**环境装了一天半**。其实只要三样东西，30 分钟搞定：' },
    { t: 'ul', items: [
      '**编辑器**：VS Code（免费，微软维护，插件生态最好）',
      '**编译器**：gcc（Linux/macOS 自带，Windows 装 MinGW-w64）',
      '**调试器**：gdb（Windows 下 VS Code 用的是 gdb，macOS 用 lldb，都够用）'
    ] },
    { t: 'p', text: '装完之后，**学 C 的最小路线**是这样一条线，贯穿本教程全部章节：' },
    { t: 'code', id: 'c0_roadmap', file: '02_roadmap.c', title: '路线图程序：把六步串起来跑一遍', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    /* 路线: 变量 -> 判断 -> 循环 -> 函数 -> 指针/数组 -> 结构体 */
    int scores[3] = {58, 75, 92};
    int i;
    int pass = 0;

    for (i = 0; i < 3; i++) {
        if (scores[i] >= 60) {
            pass++;
        }
    }
    printf("pass = %d of %d\\n", pass, 3);
    return 0;
}`,
      expect: 'pass = 2 of 3' },
    { t: 'p', text: '这段代码已经用到了**数组、循环、判断**三个概念。是不是比想象中简单？现在觉得晕，是因为你还不知道它们是什么 —— 往下读。' },

    { t: 'h3', text: '安装：Windows 上的完整步骤' },
    { t: 'ol', items: [
      '装 **VS Code**：官网 code.visualstudio.com 下载 Download for Windows，运行 `VSCodeUserSetup-x64-*.exe` 一路下一步。附加任务页把默认选项全勾上，其中「添加到 PATH」务必保留。',
      '装 **gcc**：推荐 MinGW-w64，两条路任选 —— ① 装 MSYS2 后在 MSYS2 终端执行 `pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain`（选包界面直接回车、确认输 `y`）；② 直接下载独立版 MinGW-w64 压缩包解压。',
      'VS Code 里装 **C/C++ 扩展**：左侧扩展面板搜 `C/C++`，装微软官方那个（ms-vscode.cpptools）',
      'VS Code 里装 **Code Runner** 可选，只是让右上角多一个 ▶ 按钮，编译命令仍然手敲更靠谱'
    ] },
    { t: 'callout', kind: 'warn', title: 'PATH 必须手动确认一次',
      items: [
        'MSYS2 路线：工具链在 `C:\\msys64\\ucrt64\\bin`；独立版：你自己解压的 `mingw64\\bin`',
        '把上面这个 `bin` 目录加进**用户变量**的 `Path`：Win+R 输入「编辑系统环境变量」→ 环境变量 → 用户变量 Path → 新建 → 粘贴 → 确定',
        '**改完必须把 VS Code 和 CMD 完全关掉重开**，环境变量改动不会作用于已经打开的终端 —— 这是「明明配了却说找不到 gcc」的头号原因',
        '验证：`gcc --version`、`g++ --version`、`gdb --version` 三条都能出版本号，才算装好'
      ] },
    { t: 'code', id: 'c0_compile', file: '终端', title: '验证 gcc 装好没有', lang: 'bash',
      code: `gcc --version
g++ --version
gdb --version
cd c-course
gcc 01_hello.c -o 01_hello.exe
./01_hello.exe

# 若提示「不是内部或外部命令」，用完整路径试一次就知道是不是 PATH 的问题
"C:\\msys64\\ucrt64\\bin\\gcc.exe" --version
"C:\\msys64\\ucrt64\\bin\\gdb.exe" --version`,
      expect: 'gcc --version 输出版本号（如 gcc.exe (x86_64-win32-seh-rev1) 13.2.0）\n最后两行输出：\nHello, C!\nwelcome to the C course\n\n完整路径能出版本号 = 编译器装好了，只是 PATH 没配对' },

    { t: 'h3', text: 'VS Code 一键编译调试：tasks.json 与 launch.json' },
    { t: 'p', text: '想让 VS Code 接管编译和调试（按 F5 直接进断点），需要两个配置文件。第一次运行 `.c` 文件时 VS Code 会自动生成 `.vscode/tasks.json`，按 **F5** 选调试器时会生成 `.vscode/launch.json`。' },
    { t: 'p', text: '**tasks.json 定义怎么编译**（把参数改成 `"*.c"` 编译目录下所有 C 文件，统一输出一个 exe），**launch.json 定义怎么调试**（`program` 指向同一个 exe，`miDebuggerPath` 写 gdb.exe 全路径）：' },
    { t: 'code', id: 'c0_vscode_json', file: '.vscode/', title: '编译任务 + 调试配置的完整对照', lang: 'json',
      code: `// .vscode/tasks.json —— 按 Ctrl+Shift+B 编译
{
    "version": "2.0.0",
    "tasks": [{
        "label": "C/C++: gcc build active file",
        "type": "shell",
        "command": "gcc",
        "args": ["*.c", "-o", "\${fileDirname}\\\\program.exe"],
        "group": { "kind": "build", "isDefault": true }
    }]
}

// .vscode/launch.json —— 按 F5 调试
{
    "name": "C/C++: (gdb) 启动",
    "type": "cppdbg",
    "request": "launch",
    "program": "\${fileDirname}\\\\program.exe",
    "args": [],
    "stopAtEntry": false,
    "cwd": "\${fileDirname}",
    "environment": [],
    "externalConsole": false,
    "MIMode": "gdb",
    "miDebuggerPath": "C:\\\\msys64\\\\ucrt64\\\\bin\\\\gdb.exe",
    "preLaunchTask": "C/C++: gcc build active file"
}`,
      expect: 'Ctrl+Shift+B 生成 program.exe；F5 启动调试，断点命中后停在断点行' },
    { t: 'callout', kind: 'warn', title: '两个最容易写错的地方',
      items: [
        '**JSON 里的反斜杠要写两个**：`"C:\\\\msys64..."` 才对，写成 `"C:\\msys64..."` 会被 JSON 解析器当成转义序列而报错',
        '**两个文件的路径必须一致**：tasks.json 的输出路径要和 launch.json 的 `program` 完全一样，否则 F5 会报「找不到可执行文件」',
        '**preLaunchTask 要和 tasks.json 的 label 一字不差**：VS Code 靠这个字符串把「编译」和「调试」串起来',
        'MSYS2 装在别的目录时，`miDebuggerPath` 要改成你自己的实际路径'
      ] },

    { t: 'h3', text: '第一个程序' },
    { t: 'p', text: '新建文件夹 `c-course`，在里面建 `01_hello.c`，注意后缀必须是 `.c` 而不是 `.txt`。' },
    { t: 'code', id: 'c0_hello', file: '01_hello.c', title: 'Hello World', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    printf("Hello, C!\\n");
    printf("welcome to the C course\\n");
    return 0;
}`,
      expect: 'Hello, C!\nwelcome to the C course' },
    { t: 'p', text: '逐行拆解：' },
    { t: 'ul', items: [
      '`#include <stdio.h>` —— 把标准输入输出头文件引进来，后面才能用 `printf`',
      '`int main(void)` —— 程序入口。`main` 是名字，`int` 表示它结束时返回一个整数',
      '`printf(...)` —— 打印一行，`\\n` 是换行符',
      '`return 0;` —— 告诉操作系统"一切正常"。这也是 C 里最省事的结束方式'
    ] },

    { t: 'h3', text: 'F5 调试：比 printf 更快找到 bug' },
    { t: 'p', text: '装好扩展后，VS Code 里按 **F5** 就能进入调试模式。第一次按会弹窗问选哪个调试器，选 **C++ (GDB)** 或 **gdb**。' },
    { t: 'p', text: '调试器能干什么：' },
    { t: 'ul', items: [
      '**断点**：在行号左边点一下，红点就是断点，程序运行到这行会停下',
      '**单步执行**：F10 逐行走，F11 进函数内部，Shift+F11 从函数里跳出来',
      '**看变量**：左边「变量」面板能看到所有局部变量，右边「监视」面板能自己加表达式',
      '**不需要 printf**：删掉那些临时打印语句，直接看变量的真实值'
    ] },
    { t: 'callout', kind: 'vscode', title: '调试器入口',
      items: [
        '**开始调试**：F5（对应 `gcc -g` 编译出带调试信息的目标文件）',
        '**加断点**：行号左侧单击，或光标放行上按 F9',
        '**单步跳过**：F10；**单步进入**：F11；**继续运行**：F5',
        '**看变量值**：左侧「变量」面板，或右侧「监视」里点 + 输入表达式'
      ] },

    { t: 'h3', text: '本课程明确跳过的内容' },
    { t: 'p', text: '这些知识点在教科书里出现得很早，但对**写出能跑的程序**没有任何帮助，现在学纯属浪费时间：' },
    { t: 'table',
      head: ['暂时跳过', '为什么现在不用', '什么时候补'],
      rows: [
        ['数制转换 / 原码反码补码', '写业务代码用十进制就够', '做底层优化、协议解析时'],
        ['位运算', '日常逻辑用 `+ - * /` 更清楚', '写驱动、做标志位时'],
        ['递归', '循环能解决绝大部分重复', '处理树、目录、分治时'],
        ['函数指针 / 指针的指针', '回调场景很少碰到', '写框架、插件系统时'],
        ['链表', '数组能处理绝大多数场景', '需要频繁增删中间元素时'],
        ['文件操作', '先用 scanf/printf 跑通逻辑', '要做数据持久化时']
      ],
      caption: '统一原则：**用到再查**。本教程不展开这些内容，但附录 B 会再列一遍，方便你日后回来查。' },

    { t: 'h3', text: '本课程的验收标准' },
    { t: 'p', text: '学完第 9 章，你能独立写出一个**菜单式学生成绩管理系统**并用 gcc 编译运行，那就是真的入门了 —— 不是"看懂"，是"写出来"。' }
  ],
  pitfalls: [
    '**文件后缀是 `.txt` 不是 `.c`**：Windows 记事本默认存成 `.txt`，gcc 会报 `No such file or directory` 或 `unknown suffix`。VS Code 里新建文件记得在选择类型时选 C 源文件。',
    '**gcc 没加到 PATH**：`gcc` 报 "不是内部或外部命令"，说明安装时没勾选 "Add to PATH"，重装或手动加环境变量。',
    '**忘了写 `return 0;`**：能跑，但某些编译器会警告。养成习惯写上。'
  ],
  vscode: [
    '**用文件夹打开而不是打开单个文件**：VS Code 打开文件夹后，终端自动定位到该目录，`gcc 01_hello.c` 才能直接用。命令是 `File → Open Folder`。',
    '**右键"在集成终端中打开"**（快捷键 <kbd>Ctrl</kbd>+<kbd>`</kbd>）：比在系统 PowerShell 里切路径方便得多。'
  ],
  summary: [
    'C 语言开发三件套：VS Code + gcc + GDB，Windows 上 gcc 选 MinGW-w64。',
    '最小路线：变量 → 判断 → 循环 → 函数 → 指针/数组 → 结构体 → 项目。',
    '位运算、递归、链表、文件操作等一律"用到再查"，现阶段不学。'
  ]
},

/* ============================================================
 * 第 1 章
 * ============================================================ */
{
  id: 'chapter-1',
  no: '01',
  tag: '第 1 章',
  group: '语言基础',
  title: '变量、类型与输入输出',
  goal: '会声明变量、选对类型、读入和打印数据，把第一个程序改成能交互的小工具。',
  time: '30 分钟',
  tags: ['变量', '类型', 'scanf', 'printf'],
  keywords: ['int', 'double', 'char', 'scanf', 'printf', '格式符', '整数除法', 'const'],
  concepts: [
    { t: '四种够用的类型', d: 'int 整数、double 小数、char 单字符、char[] 字符串' },
    { t: '声明 = 类型 + 名字', d: '`int age;` 就是开一个装整数的格子' },
    { t: 'printf 打印', d: '格式串 + 参数，%d %f %c %s 对应不同类型' },
    { t: 'scanf 读入', d: '格式串 + **地址**，整型必须写 `&`，漏了直接崩' },
    { t: '整数除法会截断', d: '`7 / 2` 是 3 不是 3.5，两边都是整数才算整数除法' }
  ],
  blocks: [
    { t: 'h3', text: '变量：一个有名字的存储格子' },
    { t: 'p', text: '声明一个变量就是**申请一个装数据的格子**，格子有类型（决定能装什么）和名字（决定怎么找到它）。' },
    { t: 'code', id: 'c1_vars', file: '03_var_io.c', title: '四种类型一次看全', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int age = 18;
    double price = 19.9;
    char grade = 'A';
    char name[20] = "Tom";
    int a = 7, b = 2;

    printf("%s %d %.2f %c\\n", name, age, price, grade);
    printf("a/b = %d\\n", a / b);           /* 整数除法: 截断 */
    printf("(double)a/b = %.2f\\n", (double)a / b);

    int id;
    scanf("%d", &id);
    printf("id = %d\\n", id);
    return 0;
}`,
      stdin: '1001\n',
      expect: 'Tom 18 19.90 A\na/b = 3\n(double)a/b = 3.50\nid = 1001' },
    { t: 'p', text: '注意第 3 行输出：`a/b = 3`。两个都是 int，除法结果也按整数算，**小数部分被直接丢掉**，不是四舍五入。想要 3.5 必须让其中一个先变成 double。' },

    { t: 'h3', text: '类型选错是新手第一大坑' },
    { t: 'table',
      head: ['类型', '占内存', '能装什么', '格式符', '初始值'],
      rows: [
        ['`int`', '4 字节', '-2147483648 ~ 2147483647 的整数', '`%d`', '`0`'],
        ['`double`', '8 字节', '小数（含科学计数法）', '`%f` / `%.2f`', '`0.0`'],
        ['`char`', '1 字节', '单个字符或 -128~127 的小整数', '`%c` / `%d`', '`\'\\0\'`'],
        ['`char[]`', '按长度', '字符串，末尾自动补 `\\0`', '`%s`', '`""`']
      ],
      caption: '记忆法：**整型用 %d，小数用 %f，字符用 %c，字符串用 %s**。printf 和 scanf 两边必须配套。' },

    { t: 'h3', text: 'printf 的格式符' },
    { t: 'code', id: 'c1_printf', file: 'format.c', title: '常用格式符速查', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int n = 42;
    double pi = 3.14159;
    char c = 'x';

    printf("%d\\n", n);        /* 整数 */
    printf("%5d|\\n", n);      /* 最小宽度 5, 右边补空格 */
    printf("%-5d|\\n", n);     /* 最小宽度 5, 左边补空格 */
    printf("%.2f\\n", pi);     /* 保留 2 位小数 */
    printf("%c\\n", c);        /* 字符 */
    printf("%%\\n");           /* 输出一个百分号 */
    return 0;
}`,
      expect: '42\n   42|\n42   |\n3.14\nx\n%' },

    { t: 'h3', text: 'scanf：读进来的那个 & 千万别漏' },
    { t: 'p', text: '`scanf` 和 `printf` 长得像，规则却不一样：**printf 传值，scanf 传地址**。因为它要往你的变量格里写东西，必须知道格子在哪。' },
    { t: 'code', id: 'c1_scanf', file: 'scanf_demo.c', title: '读入三个不同类型', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int id;
    double score;
    char grade;

    printf("请输入 学号 成绩 等级: ");
    scanf("%d %lf %c", &id, &score, &grade);

    printf("id=%d, score=%.1f, grade=%c\\n", id, score, grade);
    return 0;
}`,
      stdin: '1001 88.5 A\n',
      expect: '请输入 学号 成绩 等级: id=1001, score=88.5, grade=A' },
    { t: 'p', text: '三个细节：' },
    { t: 'ul', items: [
      '`&id` 的 `&` 是**取地址**，意思是"往 id 这个格子里写"',
      '读 double 用 `%lf`（scanf 里 `%f` 指的是 float，不是 double，这是历史遗留的坑）',
      '读 char 用 `%c` 前面**加空格**：`" %c"`，否则会吃掉前面剩下的空白符'
    ] },

    { t: 'h3', text: '初始化与 const' },
    { t: 'p', text: '局部变量不初始化 = 里面是**上次的垃圾数据**。养成"声明就给初值"的习惯，需要全 0 就写 `= {0}`。' },
    { t: 'code', id: 'c1_const', file: 'const_demo.c', title: 'const 让常量不可改', lang: 'c',
      code: `#include <stdio.h>

#define MAX_SCORE 100

int main(void)
{
    int count = 0;          /* 声明时就给初值 */
    const int limit = MAX_SCORE;  /* 常量, 之后不能改 */

    count = count + 1;
    printf("count = %d, limit = %d\\n", count, limit);
    return 0;
}`,
      expect: 'count = 1, limit = 100' },
    { t: 'p', text: '两种常量的区别：`const int` 是**变量但不可修改**（编译器会记住它）；`#define MAX_SCORE 100` 是**编译期直接替换**，代码里根本没有这个变量。数组长度必须用 `#define` 或 `const int`，不能先用变量再赋值。' }
  ],
  pitfalls: [
    '**scanf 漏了 `&`**：`scanf("%d", id)` 会把 id 的值当成地址去写，直接段错误崩溃。记住：**scanf 要地址，printf 要值**。',
    '**`char` 用双引号**：`char c = "A";` 编译报错，字符用单引号 `\'A\'`，字符串才用双引号 `"A"`。',
    '**整数除法静默丢精度**：`7 / 2` 输出 3 而不是 3.5，而且**不报任何错**。算平均分一定要写 `(double)sum / n`。'
  ],
  vscode: [
    '**格式化快捷键**：<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> 自动整理缩进。VS Code 默认用 4 空格缩进，和本课程代码风格一致。',
    '**看 printf 输出**：编译运行后终端会显示结果；也可以用 F5 调试，在「监视」面板加变量名实时看值。'
  ],
  summary: [
    '四个类型够用：int / double / char / char[]，选错类型是结果错的头号原因。',
    'printf 传值、scanf 传地址，整数除法会截断。',
    '声明即初始化，固定不变的值用 const 或 #define。'
  ]
},

/* ============================================================
 * 第 2 章
 * ============================================================ */
{
  id: 'chapter-2',
  no: '02',
  tag: '第 2 章',
  group: '语言基础',
  title: '运算符、表达式与类型转换',
  goal: '算得对、算得准，尤其是不再被整数除法和类型截断坑到。',
  time: '30 分钟',
  tags: ['运算符', '优先级', '类型转换'],
  keywords: ['优先级', '自增', '类型转换', '强制转换', '赋值'],
  concepts: [
    { t: '算术运算符', d: '+ - * / %，其中 % 只对整数有效' },
    { t: '关系与逻辑', d: '> < >= <= == !=，&& || !，结果只有 0 和 1' },
    { t: '优先级', d: '括号 > 乘除 > 加减 > 比较 > 逻辑，赋值最低' },
    { t: '自动转换', d: 'double 和 int 混算时，int 自动变 double' },
    { t: '强制转换', d: '`(double)a / b` 先转换再运算，顺序很关键' },
    { t: '自增自减', d: '`i++` 是取值再加，`++i` 是先加再取值' }
  ],
  blocks: [
    { t: 'h3', text: '运算符速查' },
    { t: 'table',
      head: ['类别', '运算符', '说明'],
      rows: [
        ['算术', '`+` `-` `*` `/` `%`', '`%` 取余，只适用整数；`7 % 2` = 1'],
        ['关系', '`>` `<` `>=` `<=` `==` `!=`', '结果是真(1)或假(0)'],
        ['逻辑', '`&&` `||` `!`', '`&&` 与、`||` 或、`!` 非'],
        ['赋值', '`=` `+=` `-=` `*=` `/=`', '`x += 5` 等价 `x = x + 5`'],
        ['自增自减', '`++` `--`', '前置先运算后赋值，后置先赋值后运算'],
        ['三元', '`? :`', '`条件 ? 真值 : 假值`，等价于一个 if']
      ]
    },

    { t: 'h3', text: '优先级：记住三档就够' },
    { t: 'p', text: '不需要背完整表格，只要记住这个顺序：**括号 → 乘除取余 → 加减 → 比较 → 逻辑 → 赋值**。' },
    { t: 'code', id: 'c2_prec', file: 'prec.c', title: '优先级实例', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int a = 2, b = 3, c = 4;

    printf("%d\\n", a + b * c);      /* 14: 先算 * */
    printf("%d\\n", (a + b) * c);    /* 20: 括号优先 */
    printf("%d\\n", a + b > c);      /* 1:  加法优先于比较 */
    printf("%d\\n", (a < b) == 1);   /* 1:  比较优先于逻辑, 加括号消除歧义 */
    return 0;
}`,
      expect: '14\n20\n1\n1' },
    { t: 'p', text: '**能用括号就加括号**。上面 `a + b > c` 这种写法虽然合法，但读代码的人要停下来算一遍才敢确认，加个括号 `a + b > c` → `(a + b) > c` 就一目了然。' },

    { t: 'h3', text: '类型转换：整数除法的解药' },
    { t: 'p', text: '这是整个 C 语言最容易出错的点。C 的规则很粗暴：**整数和整数运算，结果还是整数**，小数部分直接扔掉。' },
    { t: 'code', id: 'c2_cast', file: '04_cast.c', title: '自动转换 vs 强制转换', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int a = 5;
    int b = 2;
    double r1 = a / b;          /* int/int -> int, 再赋给 double */
    double r2 = (double)a / b;  /* 先转 double 再除 */
    double r3 = a / (double)b;

    printf("r1 = %f\\n", r1);
    printf("r2 = %f\\n", r2);
    printf("r3 = %f\\n", r3);
    printf("(int)3.9 = %d\\n", (int)3.9); /* 强转截断, 不是四舍五入 */
    printf("(int)(3.9 + 0.5) = %d\\n", (int)(3.9 + 0.5));
    return 0;
}`,
      expect: 'r1 = 2.000000\nr2 = 2.500000\nr3 = 2.500000\n(int)3.9 = 3\n(int)(3.9 + 0.5) = 4' },
    { t: 'p', text: '`r1 = 2.000000` 是重点：**除法已经算完了**，结果是整数 2，之后再赋给 double 也只是把 2 变成 2.0，精度早就没了。`(double)a / b` 则是**先把 a 变成 5.0，再除**，结果 2.5。' },
    { t: 'callout', kind: 'note', title: '一个必须记住的规律',
      text: '**只要表达式里有一个 double，整个表达式就按 double 算**。所以 `5 / 2.0` = 2.5，不需要任何强制转换。写平均分时，只要分母是 double 就安全。' },

    { t: 'h3', text: '自增自减：先加还是先取值' },
    { t: 'code', id: 'c2_incdec', file: 'incdec.c', title: 'i++ 和 ++i 的区别', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int i = 5;
    int a = i++;   /* 先用 5, 再让 i 变 6 */
    int b = ++i;   /* 先让 i 变 7, 再用 7 */

    printf("i=%d a=%d b=%d\\n", i, a, b);

    /* 注意: 不要写 printf("i++ = %d, i = %d", i++, i)
       同一表达式里多次修改 i 是未定义行为, 结果依编译器而定 */
    i = 5;
    printf("i++ 的返回值是 %d\\n", i++);
    printf("此刻 i = %d\\n", i);
    printf("++i 的返回值是 %d\\n", ++i);
    printf("此刻 i = %d\\n", i);
    return 0;
}`,
      expect: 'i=7 a=5 b=7\ni++ 的返回值是 5\n此刻 i = 6\n++i 的返回值是 7\n此刻 i = 7' },
    { t: 'p', text: '**不要在同一个表达式里对同一个变量用 ++ 和 --**。像 `printf("i++ = %d, i = %d", i++, i)` 属于"未定义行为"级别的写法（求值顺序不确定），不同编译器结果可能不同。实际项目里这种代码会被人 review 打回。' },

    { t: 'h3', text: '三元运算符：把 if 写成一行' },
    { t: 'code', id: 'c2_ternary', file: 'ternary.c', title: '条件 ? A : B', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int score = 85;
    const char *grade;

    grade = (score >= 90) ? "A" : ((score >= 60) ? "B" : "C");
    printf("score = %d, grade = %s\\n", score, grade);

    int max = (score > 60) ? score : 60;
    printf("max = %d\\n", max);
    return 0;
}`,
      expect: 'score = 85, grade = B\nmax = 85' }
  ],
  pitfalls: [
    '**`(double)a / b` 写成 `(double)(a / b)`**：括号位置变了，结果从 2.5 变成 2.0。转换要加在**参与运算的那个操作数**上。',
    '**`%` 对 double 无效**：`10.5 % 3` 编译报错，浮点数取余要先转成 int。',
    '**浮点数用 `==` 比较**：`0.1 + 0.2 == 0.3` 是 false（因为二进制表示有误差）。比较浮点数要用 `fabs(a - b) < 1e-6`。'
  ],
  vscode: [
    '**看类型转换发生了什么**：在 `r1 = a / b` 那行打断点，监视窗口里分别输入 `a`、`b`、`a / b`、`r1`，能直观看到中间值是先算完再赋值的。',
    '**开启警告**：编译命令加 `-Wall`，很多隐式转换和优先级问题编译器会直接指出来。'
  ],
  summary: [
    '优先级记三档就够：括号 > 乘除 > 加减 > 比较 > 逻辑 > 赋值，能加括号就加。',
    '整数除法会截断，`(double)a / b` 或让分母是 double 才能保住小数。',
    '强转是截断不是四舍五入；自增自减不要在同一个表达式里混用。'
  ]
},

/* ============================================================
 * 第 3 章
 * ============================================================ */
{
  id: 'chapter-3',
  no: '03',
  tag: '第 3 章',
  group: '语言基础',
  title: '判断：if 与 switch',
  goal: '让程序按条件走不同的分支，并把 == 和 = 这个经典 bug 彻底根治。',
  time: '30 分钟',
  tags: ['if', 'else', 'switch', 'break'],
  keywords: ['if', 'else if', 'switch', 'case', 'break', 'default', '条件运算符'],
  concepts: [
    { t: 'if / else if / else', d: '从上往下判断，命中一个就结束' },
    { t: '== 与 =', d: '`==` 是比较，`=` 是赋值，编译器常会警告' },
    { t: 'switch', d: '适合判断一个值等于若干个固定值之一' },
    { t: 'break', d: '跳出当前 case，**漏掉它就会穿透**' },
    { t: 'default', d: '兜底分支，处理所有没列出的情况' }
  ],
  blocks: [
    { t: 'h3', text: 'if：最基础的分支' },
    { t: 'code', id: 'c3_if', file: '05_if.c', title: '成绩分档', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int score = 85, flag = 1;

    if (score == 100)      printf("excellent\\n");
    else if (score >= 60)  printf("pass\\n");
    else                   printf("fail\\n");

    if (flag == 1) {
        printf("use == to compare\\n");
    }
    if (flag = 0) {          /* 赋值: flag 被改成 0, 条件恒为假 */
        printf("never prints\\n");
    }
    return 0;
}`,
      expectWarn: true,
      expect: 'pass\nuse == to compare' },
    { t: 'p', text: '这段代码输出里**没有 `never prints`**，因为 `if (flag = 0)` 写错了。`flag = 0` 是一个**赋值表达式**，值为 0，0 在 C 里代表假，所以条件永远不成立。' },
    { t: 'callout', kind: 'ok', title: '怎么防住这个 bug',
      text: '1. 编译命令**永远带 `-Wall`**：gcc 会给出 `warning: suggest parentheses around assignment used as truth value`，一眼就能看出来。\n2. 在 VS Code 里把 `==` 和 `=` 的颜色设置成不同颜色（设置 → 文本编辑器 → 颜色 → 运算符）。' },

    { t: 'h3', text: 'switch：判断"等于若干固定值之一"' },
    { t: 'code', id: 'c3_switch', file: '06_switch.c', title: 'case 穿透演示', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int day = 3;
    switch (day) {
        case 1: printf("Monday\\n");  break;
        case 2: printf("Tuesday\\n"); break;
        case 3: printf("Wednesday\\n");   /* 漏 break: 穿透 */
        case 4: printf("Thursday\\n"); break;
        default: printf("other day\\n"); break;
    }
    return 0;
}`,
      expectWarn: true,
      expect: 'Wednesday\nThursday' },
    { t: 'p', text: '输出里 Wednesday 和 Thursday **都出现了** —— 这就是**穿透（fall through）**：case 3 没有 break，程序继续往下执行 case 4。gcc 会警告 `this statement may fall through`。' },
    { t: 'p', text: '**什么时候故意穿透？** 多种情况共用一段处理逻辑时会故意不写 break：' },
    { t: 'code', id: 'c3_switch2', file: 'switch_fallthrough.c', title: '故意的穿透', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int day = 3;
    switch (day) {
        case 3:
        case 4:
        case 5:
            printf("工作日, 要上班\\n");
            break;
        case 6:
        case 7:
            printf("周末, 休息\\n");
            break;
        default:
            printf("其他\\n");
    }
    return 0;
}`,
      expect: '工作日, 要上班' },

    { t: 'h3', text: 'if 还是 switch？' },
    { t: 'table',
      head: ['场景', '用 if', '用 switch'],
      rows: [
        ['判断一个值是否等于若干固定值', '能写，但很啰嗦', '**推荐 switch**，结构清晰'],
        ['判断范围（`>= 60`）', '**推荐 if**，switch 做不到', '不行'],
        ['判断复杂组合（`a > b && c < d`）', '**推荐 if**', '不行'],
        ['判断浮点数相等', '**必须用 if**', 'switch 只支持整型'],
        ['扩展性（以后要加新分支）', '加一个 else if', '加一个 case，都容易']
      ],
      caption: '一句话：**离散取值用 switch，范围和复杂条件用 if**。' },

    { t: 'h3', text: '条件运算符：三元表达式' },
    { t: 'code', id: 'c3_ternary', file: 'ternary_if.c', title: 'if 的紧凑写法', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int score = 72;
    int result;

    if (score >= 60) result = 1; else result = 0;
    printf("if     : %d\\n", result);

    result = (score >= 60) ? 1 : 0;
    printf("三元   : %d\\n", result);

    /* 嵌套三元: 大于 90 优秀, 大于 60 及格, 否则不及格 */
    const char *tag = (score > 90) ? "优秀" : ((score > 60) ? "及格" : "不及格");
    printf("结果   : %s\\n", tag);
    return 0;
}`,
      expect: 'if     : 1\n三元   : 1\n结果   : 及格' }
  ],
  pitfalls: [
    '**`if (x = 5)` 写成 `if (x == 5)`**：赋值让条件恒为真，逻辑完全错。`-Wall` 能抓到这个坑，但前提是你真的开了这个开关。',
    '**switch 里漏写 break**：不报错、程序照跑，但会执行到下一个 case。这是最阴的 bug 之一，因为它不崩。',
    '**`switch` 里写浮点数**：`switch (3.14)` 编译报错，switch 的表达式必须是整型。'
  ],
  vscode: [
    '**让 == 和 = 颜色不同**：设置 → 文本编辑器 → 颜色 → 搜索 "==" 改颜色，一眼区分，这是防 == 坑最有效的办法。',
    '**switch 穿透时用调试器看**：在每个 case 上打断点，F10 单步，能立刻看清程序跳到了哪一行。'
  ],
  summary: [
    'if 判范围和复杂条件，switch 判离散取值，两者别混用。',
    '`==` 比较、`=` 赋值，编译永远带 `-Wall`。',
    'switch 每个 case 都要写 break，除非是故意穿透。'
  ]
},

/* ============================================================
 * 第 4 章
 * ============================================================ */
{
  id: 'chapter-4',
  no: '04',
  tag: '第 4 章',
  group: '语言基础',
  title: '循环：for、while、do-while',
  goal: '把重复的事交给机器，掌握三种循环的选择依据和 break/continue 的正确用法。',
  time: '35 分钟',
  tags: ['for', 'while', 'do-while', 'break'],
  keywords: ['循环', 'break', 'continue', '嵌套', '死循环'],
  concepts: [
    { t: '三个要素', d: '从哪开始、什么条件继续、每轮怎么变' },
    { t: '三种循环', d: 'for / while / do-while，区别在于"先判断还是先执行"' },
    { t: 'break', d: '直接跳出整个循环' },
    { t: 'continue', d: '跳过本轮剩余部分，进入下一轮' },
    { t: '循环嵌套', d: '外层管行、内层管列' },
    { t: '死循环', d: '条件永远为真，或 continue 写在更新语句之前' }
  ],
  blocks: [
    { t: 'h3', text: '三种循环怎么选' },
    { t: 'table',
      head: ['循环', '执行前检查?', '适合场景', '例子'],
      rows: [
        ['`for`', '是', '次数**已知**', '遍历 100 个分数'],
        ['`while`', '是', '次数**未知**，看条件', '一直读到文件结束'],
        ['`do-while`', '否（先做一次）', '**至少要做一次**', '菜单必须先显示一次'],
        ['`for(;;)`', '无（等价 while(1)）', '无限循环 + break 退出', '主菜单循环']
      ],
      caption: '选择口诀：**次数确定 for，次数不定 while，至少一次 do-while**。' },

    { t: 'h3', text: 'for：把三要素写在一行' },
    { t: 'code', id: 'c4_for', file: '07_loop.c', title: '求和与跳出', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int i, sum = 0;
    for (i = 1; i <= 100; i++) sum += i;
    printf("1..100 sum = %d\\n", sum);

    i = 0;
    while (i < 6) {
        i++;
        if (i == 3) continue;   /* 跳过本次 */
        if (i == 6) break;      /* 跳出循环 */
        printf("i = %d\\n", i);
    }
    return 0;
}`,
      expect: '1..100 sum = 5050\ni = 1\ni = 2\ni = 4\ni = 5' },
    { t: 'p', text: '`for (i = 1; i <= 100; i++)` 三个部分用分号隔开：**初始化**、**条件**、**更新**。三个都不能少，条件为假就停止。' },

    { t: 'h3', text: '三个经典练习' },
    { t: 'code', id: 'c4_practice', file: '08_loop_practice.c', title: '求和 / 找最大值 / 打印图形', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int a[5] = {12, 45, 7, 88, 30};
    int i, j, sum = 0, max = a[0];

    for (i = 0; i < 5; i++) sum += a[i];
    printf("sum = %d\\n", sum);

    for (i = 1; i < 5; i++)
        if (a[i] > max) max = a[i];
    printf("max = %d\\n", max);

    for (i = 1; i <= 3; i++) {
        for (j = 1; j <= i; j++) printf("*");
        printf("\\n");
    }
    return 0;
}`,
      expect: 'sum = 182\nmax = 88\n*\n**\n***' },
    { t: 'p', text: '三个模板要背下来：' },
    { t: 'ul', items: [
      '**求和**：`sum = 0` → 遍历累加 → 打印。三步固定。',
      '**找最大值**：`max` 初值必须取 `a[0]`（**不能取 0**，否则全是负数就错了），循环从 `i = 1` 开始。',
      '**打印图形**：外层 `i` 管行数，内层 `j` 管列数，`printf("\\n")` 放在**内层循环外面**。'
    ] },

    { t: 'h3', text: 'do-while：先执行再判断' },
    { t: 'code', id: 'c4_dowhile', file: 'dowhile.c', title: '菜单循环的标准写法', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int choice = 0;
    int rounds = 0;

    do {
        rounds++;
        printf("第 %d 轮\\n", rounds);
        choice++;
    } while (choice < 3);

    printf("共执行 %d 轮\\n", rounds);
    return 0;
}`,
      expect: '第 1 轮\n第 2 轮\n第 3 轮\n共执行 3 轮' },
    { t: 'p', text: '`do-while` 的条件在**末尾**，所以循环体**至少执行一次**。做菜单时特别有用 —— 菜单必须先显示一次，用户才有机会输入。' },

    { t: 'h3', text: 'break 与 continue' },
    { t: 'table',
      head: ['关键字', '作用', '典型场景'],
      rows: [
        ['`break`', '**跳出整个循环**', '找到目标就停止查找；菜单里选退出'],
        ['`continue`', '**跳过本轮**，进入下一轮', '跳过不合格的数据，继续处理下一个'],
        ['`return`', '直接结束整个函数', '在函数里想一次退出多层循环时']
      ],
      caption: '注意：break 只跳一层循环。嵌套循环里想一次跳出两层，得用 `return` 或 goto（不推荐）。' }
  ],
  pitfalls: [
    '**`continue` 写在更新语句前面 → 死循环**：`while (i < 10) { continue; i++; }` 里 `i` 永远不会变，程序卡死。`continue` 之前一定要确保计数器会推进。',
    '**找最大值时 `max` 初值取 0**：数组全是负数时结果是 0 而不是真实最大值。初值取 `a[0]`。',
    '**循环边界写 `i <= n` 但数组只有 n 个元素**：`a[n]` 是越界读写，会破坏内存。数组有效下标是 `0 ~ n-1`。'
  ],
  vscode: [
    '**怀疑死循环就打断点**：在循环体内打一个断点，F5 运行，如果反复停在这个断点，说明循环条件或计数器有问题。',
    '**看循环变量的变化**：在「监视」面板加 `i`，单步 F10 时能直接看到 i 每次加 1，出错时立刻发现它没变。'
  ],
  summary: [
    '次数确定用 for，不确定用 while，至少执行一次用 do-while。',
    'break 跳出循环，continue 跳过本轮，continue 前必须让计数器推进。',
    '三个模板记牢：求和、找最大值、打印图形。'
  ]
},

/* ============================================================
 * 第 5 章
 * ============================================================ */
{
  id: 'chapter-5',
  no: '05',
  tag: '第 5 章',
  group: '语言基础',
  title: '函数：参数、返回值与作用域',
  goal: '把代码拆成可复用的积木，并搞清楚函数为什么改不动外部变量。',
  time: '35 分钟',
  tags: ['函数', '参数', '作用域', 'static'],
  keywords: ['函数', '定义', '声明', '原型', '值传递', '数组传参', 'static', '全局变量'],
  concepts: [
    { t: '三要素', d: '返回类型、函数名、参数列表' },
    { t: '函数原型', d: '调用前先声明，告诉编译器这个函数长什么样' },
    { t: '值传递', d: '参数是副本，改它不影响外面的变量' },
    { t: '数组传参退化为指针', d: '函数内部拿不到数组长度，必须单独传 n' },
    { t: '作用域', d: '局部变量只在函数内有效，全局变量全程有效' },
    { t: 'static 局部变量', d: '只初始化一次，函数调用结束后值还在' }
  ],
  blocks: [
    { t: 'h3', text: '函数的三个组成部分' },
    { t: 'code', id: 'c5_basic', file: '09_func.c', title: '定义与调用', lang: 'c',
      code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
void say_hello(void) { printf("hello from function\\n"); }

int main(void)
{
    int x = 3, y = 4, n = 10;
    printf("add(x, y) = %d\\n", add(x, y));
    say_hello();
    add(n, 1);
    printf("n still = %d\\n", n);   /* 值传递: 外部未变 */
    return 0;
}`,
      expect: 'add(x, y) = 7\nhello from function\nn still = 10' },
    { t: 'p', text: '`add(n, 1)` 调用了但**返回值被丢弃**，函数内部改的只是副本，所以外面的 `n` 还是 10。**函数只能通过返回值影响外面** —— 除非传地址。' },

    { t: 'h3', text: '值传递 vs 指针传递' },
    { t: 'table',
      head: ['', '值传递', '指针传递'],
      rows: [
        ['传的是什么', '变量的一份**副本**', '变量的**地址**'],
        ['函数内改它', '只改副本，外面不变', '**改的就是本体**，外面跟着变'],
        ['写法', '`void f(int a)`', '`void f(int *a)`，调用 `f(&x)`'],
        ['风险', '无副作用', '可能误改，别的地方跟着受影响'],
        ['典型用途', '只读的计算类函数', '需要修改调用方数据时']
      ],
      caption: '**函数默认是只读的**。想改外部数据时才传指针，这是最清晰的设计习惯。' },

    { t: 'h3', text: '函数原型：调用前先说清楚' },
    { t: 'p', text: 'C 语言从 C99 开始允许在调用处直接定义函数，但**推荐写原型**：把函数签名提前声明一遍，编译器才知道怎么检查参数。' },
    { t: 'code', id: 'c5_proto', file: 'proto.c', title: '原型 + 多文件的基本样子', lang: 'c',
      code: `#include <stdio.h>

/* 函数原型: 返回类型 + 名字 + 参数类型 */
int add(int a, int b);
void show(int arr[], int n);
void swap(int *a, int *b);

int add(int a, int b) { return a + b; }

void show(int arr[], int n)
{
    int i;
    for (i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
}

void swap(int *a, int *b)
{
    int t = *a; *a = *b; *b = t;
}

int main(void)
{
    int x = 1, y = 2, arr[5] = {10,20,30,40,50};
    printf("add = %d\\n", add(3, 4));
    show(arr, 5);
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
      expect: 'add = 7\n10 20 30 40 50 \nx=2 y=1' },
    { t: 'p', text: '`show(int arr[], int n)` 里的 `arr[]` **其实是 `int *arr`** —— C 里数组传参一律退化成指针，这也是为什么必须额外传 `n`。' },

    { t: 'h3', text: '作用域：变量活多久' },
    { t: 'code', id: 'c5_scope', file: 'scope.c', title: '局部、全局、static', lang: 'c',
      code: `#include <stdio.h>

int global_counter = 0;   /* 全局变量 */

void bump_global(void)
{
    global_counter++;      /* 直接改全局 */
}

void bump_static(void)
{
    static int calls = 0;  /* 只初始化一次, 多次调用间保留 */
    calls++;
    printf("calls = %d\\n", calls);
}

int main(void)
{
    int local = 100;       /* 局部变量, 只在 main 里有效 */

    bump_global();
    bump_static();
    bump_static();
    printf("global=%d local=%d\\n", global_counter, local);
    return 0;
}`,
      expect: 'calls = 1\ncalls = 2\nglobal=1 local=100' },
    { t: 'p', text: '`static` 局部变量是个好东西：它在**函数首次调用时初始化一次**，之后每次调用都保留上次的值。常用于计数器、记忆状态。' },

    { t: 'h3', text: '函数拆分的三条原则' },
    { t: 'ul', items: [
      '**一个函数只做一件事**，名字就是这件事的动词（`add_student`、`sort_by_score`）',
      '**参数超过 4~5 个就该考虑用结构体打包**',
      '**能 const 就 const**：`void show(const char *name)` 表示函数不会改这个参数'
    ] }
  ],
  pitfalls: [
    '**函数内 `sizeof(arr)` 不是数组长度**：数组传参退化成指针后，`sizeof(arr)` 得到的是指针大小（8 字节），不是元素个数。长度必须单独传。',
    '**忘记写函数原型**：如果函数定义在调用之后，C89 会报隐式声明错误，C99 虽然只警告，但参数类型不对会导致运行出错。养成写原型的习惯。',
    '**全局变量到处改**：多个函数都改同一个全局变量，出问题时很难定位。优先用参数传数据，全局变量只留给"确实是全局状态"的东西。'
  ],
  vscode: [
    '**函数跳转**：光标放在函数名上按 F12 直接跳到定义，比 Ctrl+F 搜索快得多。',
    '**多文件项目**：把函数原型集中写进一个 `xxx.h` 头文件，`.c` 文件用 `#include "xxx.h"` 引入，第 10 章会详细讲。'
  ],
  summary: [
    '函数三要素：返回类型、名字、参数；调用前先写原型。',
    '函数默认只读，需要改外部数据才传指针；数组传参退化成指针，长度要单独传。',
    'static 局部变量只初始化一次，跨调用保留值。'
  ]
},

/* ============================================================
 * 第 6 章
 * ============================================================ */
{
  id: 'chapter-6',
  no: '06',
  tag: '第 6 章',
  group: '数据与内存',
  title: '数组与字符串',
  goal: '用数组批量存同类数据，用字符串处理文本，并且知道边界在哪里。',
  time: '35 分钟',
  tags: ['数组', '字符串', 'strcpy'],
  keywords: ['数组', '二维数组', '字符串', 'strlen', 'strcpy', 'strcat', 'strcmp', '越界'],
  concepts: [
    { t: '数组是一块连续内存', d: '元素类型相同、下标连续、从 0 开始编号' },
    { t: '有效下标 0 ~ n-1', d: '访问 `a[n]` 是越界，会破坏内存' },
    { t: '二维数组', d: '`a[i][j]` 是第 i 行第 j 列，行长度必须一致' },
    { t: '字符串以 \\0 结尾', d: '这是所有字符串函数能工作的基础' },
    { t: 'strlen 求长度', d: '返回的是**不含 \\0 的字符数**' },
    { t: 'strcpy 会溢出', d: '目标空间不够长就出事，务必确认容量' }
  ],
  blocks: [
    { t: 'h3', text: '一维数组：一次存一批同类型数据' },
    { t: 'code', id: 'c6_1d', file: 'array1d.c', title: '声明、初始化、遍历', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int a[5] = {10, 20, 30, 40, 50};   /* 完全初始化 */
    int b[5] = {1, 2};                /* 部分初始化, 剩余为 0 */
    int c[5] = {0};                   /* 想全部置 0, 写一个 0 即可 */
    int i;

    for (i = 0; i < 5; i++) printf("a[%d] = %d\\n", i, a[i]);
    printf("b[4] = %d (未写的自动补 0)\\n", b[4]);
    printf("c[3] = %d (写 0 就是全 0)\\n", c[3]);
    printf("sizeof(a) = %d 字节\\n", (int)sizeof(a));
    return 0;
}`,
      expect: 'a[0] = 10\na[1] = 20\na[2] = 30\na[3] = 40\na[4] = 50\nb[4] = 0 (未写的自动补 0)\nc[3] = 0 (写 0 就是全 0)\nsizeof(a) = 20 字节' },
    { t: 'p', text: '`sizeof(a) = 20` 是因为 a 有 5 个 int，每个 4 字节。这个值在**函数内部会变**（变成指针大小），下一章会详细讲。' },

    { t: 'h3', text: '二维数组：表格' },
    { t: 'code', id: 'c6_2d', file: 'array2d.c', title: '3 行 4 列的矩阵', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int m[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    int i, j;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 4; j++) {
            printf("%d\\t", m[i][j]);
        }
        printf("\\n");
    }
    printf("行数=%d 列数=%d\\n", (int)(sizeof(m) / sizeof(m[0])),
           (int)(sizeof(m[0]) / sizeof(m[0][0])));
    return 0;
}`,
      expect: '1\t2\t3\t4\t\n5\t6\t7\t8\t\n9\t10\t11\t12\t\n行数=3 列数=4' },

    { t: 'h3', text: '字符串：char 数组 + 结尾的 \\0' },
    { t: 'p', text: 'C 没有独立的字符串类型。所谓字符串就是一个 **char 数组**，最后一个元素必须是 `\'\\0\'`（字符串结束符）。`"Tom"` 实际占了 4 个字节：T、o、m、\\0。' },
    { t: 'code', id: 'c6_str', file: 'string.c', title: '字符串的本质与四个必会函数', lang: 'c',
      code: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char name[20] = "Tom";
    char buf[10] = "abc";
    char a[50] = "Tom";
    char b[50];
    int i;

    printf("strlen(name) = %d\\n", (int)strlen(name));
    printf("sizeof(buf) = %d 字节\\n", (int)sizeof(buf));

    for (i = 0; i < 4; i++) {
        printf("name[%d] = %d ('%c')\\n", i, name[i], name[i] ? name[i] : '?');
    }

    strcpy(b, a);                    /* 复制 */
    printf("strcpy 后 b = %s\\n", b);

    strcat(b, " & Jerry");           /* 拼接 */
    printf("strcat 后 b = %s (len=%d)\\n", b, (int)strlen(b));

    printf("strcmp(a, a) == 0 ? %d  (相等返回 0)\\n", strcmp(a, a) == 0);
    printf("strcmp(a, b) == 0 ? %d  (不相等返回非 0)\\n", strcmp(a, b) == 0);
    return 0;
}`,
      expect: 'strlen(name) = 3\nsizeof(buf) = 10 字节\nname[0] = 84 (\'T\')\nname[1] = 111 (\'o\')\nname[2] = 109 (\'m\')\nname[3] = 0 (\'?\')\nstrcpy 后 b = Tom\nstrcat 后 b = Tom & Jerry (len=11)\nstrcmp(a, a) == 0 ? 1  (相等返回 0)\nstrcmp(a, b) == 0 ? 0  (不相等返回非 0)' },
    { t: 'p', text: '**`strlen` 返回 3 而不是 4**，因为它不算结尾的 `\\0`。但 `sizeof` 返回的是数组占用的全部字节数。这两个数不一样，是新手最常混淆的地方。' },
    { t: 'callout', kind: 'note', title: 'strcmp 的返回值不用管具体数字',
      text: '`strcmp(a, b) < 0` 表示 a 字典序在 b 前面，`== 0` 表示相等，`> 0` 表示 a 在后。**只判断相等与否时用 `== 0`**，不要写 `== 1` 或 `== -1`，因为标准没规定返回哪个具体值（上面示例里不相等时返回的是 -1，换个平台可能变成 1 或别的数）。' },

    { t: 'h3', text: '字符串输入：scanf 与 fgets' },
    { t: 'table',
      head: ['写法', '效果', '风险'],
      rows: [
        ['`scanf("%s", buf)`', '读一个**不含空格**的词', '**危险**：不加宽度限制会写穿数组'],
        ['`scanf("%19s", buf)`', '同上，但最多读 19 个字符', '安全推荐，长度必须和数组匹配'],
        ['`fgets(buf, 20, stdin)`', '读一整行，含空格', '会连 `\\n` 一起读进来，需要去掉']
      ],
      caption: '**任何时候 scanf 读字符串都要写宽度限制**：`%19s` 里的 19 = 数组长度 - 1。' },
    { t: 'code', id: 'c6_input', file: 'str_input.c', title: '安全的字符串输入', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    char name[20];

    printf("请输入姓名: ");
    if (scanf("%19s", name) != 1) {
        printf("输入失败\\n");
        return 1;
    }
    printf("你好, %s!\\n", name);
    return 0;
}`,
      stdin: 'Tom\n',
      expect: '请输入姓名: 你好, Tom!' }
  ],
  pitfalls: [
    '**数组越界**：`int a[5]` 的有效下标是 0~4，访问 `a[5]` 会读写到数组外的内存。这类 bug 可能不立刻崩溃，而是悄悄改坏别的数据 —— 更难查。',
    '**`scanf("%s", buf)` 不写宽度**：`buf[5]` 传进一个 10 个字符的词，直接写穿到相邻内存。**永远写 `%19s` 这种带数字的格式**。',
    '**`char c = "A"` 用了双引号**：字符用单引号 `\'A\'`，字符串才用双引号。另外 `\'\\0\'` 不是字符 0 的转义，是字符串结束符，值为 0。'
  ],
  vscode: [
    '**用 sizeof 算数组长度**：`int n = sizeof(a) / sizeof(a[0]);` 这样以后改数组长度不用同步改代码。',
    '**数组越界用调试器抓**：在循环里打断点，监视 `i` 和 `a[i]`，当 `i` 等于数组长度时还能访问就说明越界了。'
  ],
  summary: [
    '数组是连续内存，有效下标 0~n-1，越界会悄悄破坏数据。',
    '字符串是 char 数组，末尾必须有 \\0；strlen 不算 \\0，sizeof 算。',
    'scanf 读字符串必须写宽度限制（如 `%19s`），否则写穿内存。'
  ]
},

/* ============================================================
 * 第 7 章
 * ============================================================ */
{
  id: 'chapter-7',
  no: '07',
  tag: '第 7 章',
  group: '数据与内存',
  title: '指针：地址、解引用与指针与数组',
  goal: '真正理解指针就是"存地址的变量"，并能用指针高效处理数组数据。',
  time: '45 分钟',
  tags: ['指针', '地址', '内存'],
  keywords: ['指针', '&', '*', '解引用', '野指针', '悬空指针', 'NULL', '指针加法'],
  concepts: [
    { t: '& 是取地址', d: '`&x` 拿到 x 在内存中的位置' },
    { t: '* 是解引用', d: '`*p` 取出 p 里存的地址指向的那个值' },
    { t: '指针是变量', d: '`int *p` 声明了一个存放 int 地址的变量' },
    { t: '数组名就是首地址', d: '`a`、`&a[0]`、`a + 0` 完全等价' },
    { t: '指针加法按基类型走', d: '`p + 1` 跳过一个 int，即 4 字节' },
    { t: '野指针与悬空指针', d: '未初始化 / 已失效的指针，解引用是未定义行为' }
  ],
  blocks: [
    { t: 'h3', text: '先把这句话记住' },
    { t: 'p', text: '**指针是一个变量，它的内容是另一个变量的地址。** `&x` 是"x 的地址"，`p` 是"装着这个地址的变量"，`*p` 是"顺着这个地址找到的那个值"。' },
    { t: 'code', id: 'c7_basic', file: '11_pointer.c', title: '& 与 * 的完整演示', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int x = 10;
    int *p = &x;

    printf("x = %d\\n", x);
    printf("&x = %p, p = %p\\n", (void *)&x, (void *)p);
    printf("&x == p ? %d  (1 表示 p 里存的正是 x 的地址)\\n", &x == p);
    printf("*p = %d\\n", *p);

    *p = 99;
    printf("after *p=99, x = %d\\n", x);

    int *q = NULL;
    if (q == NULL) printf("q is NULL, do not deref\\n");
    return 0;
}`,
      expect: 'x = 10\n&x = 0x7ffd8b8c, p = 0x7ffd8b8c\n&x == p ? 1  (1 表示 p 里存的正是 x 的地址)\n*p = 10\nafter *p=99, x = 99\nq is NULL, do not deref',
      note: '地址每次运行都不同，`&x` 和 `p` 的值每次都会变 —— 但**它们永远相等**，这才是这段代码要证明的事。' },

    { t: 'h3', text: '内存关系图' },
    { t: 'p', text: '把上面的程序画出来就是这样：' },
    { t: 'fig',
      caption: 'p 这个变量本身也占内存，里面装着 x 的地址。`*p` 顺着箭头找到 x 的内存格，把里面的 10 改成 99，x 就真的变了。',
      svg: `<svg viewBox="0 0 680 300" role="img" aria-label="指针 p 指向变量 x 的内存示意图">
  <defs>
    <marker id="ahP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--purple)"/>
    </marker>
    <marker id="ahA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)"/>
    </marker>
  </defs>

  <rect class="mem-box mem-box-ptr" x="40" y="60" width="200" height="120" rx="8"/>
  <text class="mem-title" x="58" y="88">p</text>
  <text class="mem-txt-dim" x="58" y="108">int *</text>
  <text class="mem-txt" x="58" y="134">0x7ffd8b8c</text>
  <text class="mem-label" x="58" y="158">p 里存的是 x 的地址</text>

  <rect class="mem-box mem-box-hi" x="440" y="60" width="200" height="120" rx="8"/>
  <text class="mem-title" x="458" y="88">x</text>
  <text class="mem-txt-dim" x="458" y="108">int</text>
  <text class="mem-txt" x="458" y="134">10</text>
  <text class="mem-label" x="458" y="158">x 在内存中的位置</text>

  <path class="mem-arrow-p" d="M 240 120 L 428 120" marker-end="url(#ahP)"/>
  <text class="mem-label" x="268" y="108">*p 解引用 →</text>

  <text class="mem-txt-dim" x="40" y="216">int x = 10;</text>
  <text class="mem-txt-dim" x="40" y="240">int *p = &amp;x;</text>
  <text class="mem-txt-dim" x="40" y="264">*p = 99;  /* x 真的变成 99 了 */</text>

  <path class="mem-arrow" d="M 170 246 L 170 190" marker-end="url(#ahA)"/>
  <text class="mem-label" x="182" y="222">&amp;x 取得地址</text>
</svg>` },

    { t: 'h3', text: '四种写法完全等价' },
    { t: 'p', text: '这是指针最反直觉也最重要的一点。**数组的四种访问方式结果完全一样**，理解了这一条，指针和数组就通了：' },
    { t: 'code', id: 'c7_array', file: '12_ptr_array.c', title: 'a[i] == *(a+i) == p[i] == *(p+i)', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int a[5] = {10, 20, 30, 40, 50};
    int *p = a;    /* 数组名就是首元素地址 */
    int i;

    for (i = 0; i < 5; i++) {
        printf("%d %d %d %d\\n", a[i], *(a + i), p[i], *(p + i));
    }

    printf("*(p + 2) = %d\\n", *(p + 2));
    printf("p[2]     = %d\\n", p[2]);
    printf("sizeof(int) = %d bytes\\n", (int)sizeof(int));
    printf("p + 1 moves %d bytes\\n", (int)((char *)(p + 1) - (char *)p));
    return 0;
}`,
      expect: '10 10 10 10\n20 20 20 20\n30 30 30 30\n40 40 40 40\n50 50 50 50\n*(p + 2) = 30\np[2]     = 30\nsizeof(int) = 4 bytes\np + 1 moves 4 bytes' },
    { t: 'callout', kind: 'ok', title: '这就是为什么指针能高效处理数组',
      text: '`a[i]` 编译后**就变成** `*(a + i)`。数组下标只是写起来好看的指针算术，没有额外开销。' },

    { t: 'h3', text: '指针加法：按基类型跳，不是按字节' },
    { t: 'p', text: '`p + 1` 不是"地址 + 1 字节"，而是"**跳过一个 int**"，也就是 +4 字节。因为 p 的类型是 `int *`，编译器知道 int 占 4 字节。' },
    { t: 'code', id: 'c7_arith', file: 'ptr_arith.c', title: '指针算术', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int a[4] = {10, 20, 30, 40};
    int *p = a;
    char *c = (char *)a;

    printf("a   = %d\\n", *p);
    printf("p+1 = %d  (跳过 1 个 int)\\n", *(p + 1));
    printf("p+3 = %d\\n", *(p + 3));

    printf("字节偏移: p->p+1 = %d 字节\\n", (int)((char *)(p + 1) - (char *)p));
    printf("字节偏移: c->c+1 = %d 字节\\n", (int)(c + 1 - c));

    printf("p+1 == &a[1] ? %d\\n", (p + 1) == &a[1]);
    printf("a == &a[0] ? %d\\n", a == &a[0]);
    return 0;
}`,
      expect: 'a   = 10\np+1 = 20  (跳过 1 个 int)\np+3 = 40\n字节偏移: p->p+1 = 4 字节\n字节偏移: c->c+1 = 1 字节\np+1 == &a[1] ? 1\na == &a[0] ? 1' },

    { t: 'h3', text: '指针作函数参数' },
    { t: 'code', id: 'c7_param', file: '13_ptr_param.c', title: '传地址才能改到本体', lang: 'c',
      code: `#include <stdio.h>

void modify(int *p)
{
    *p = 42;   /* 改的是外部变量的本体 */
}

int main(void)
{
    int x = 1;
    printf("before x = %d\\n", x);

    modify(&x);
    printf("after  x = %d\\n", x);

    int arr[3] = {1, 2, 3};
    modify(&arr[1]);
    printf("arr[1] = %d\\n", arr[1]);
    return 0;
}`,
      expect: 'before x = 1\nafter  x = 42\narr[1] = 42' },
    { t: 'p', text: '`modify(&arr[1])` 等价于 `modify(arr + 1)` —— 数组元素的地址就是 `&arr[i]`。' },

    { t: 'h3', text: '野指针与悬空指针' },
    { t: 'table',
      head: ['类型', '怎么产生的', '后果'],
      rows: [
        ['**野指针**', '`int *p;` 声明后没初始化', '里面是垃圾地址，解引用 = 崩溃或乱改内存'],
        ['**悬空指针**', '指向的变量已经释放或已出作用域', '解引用 = 未定义行为，地址可能已被复用'],
        ['**空指针**', '`int *p = NULL;`', '安全，解引用前先判断 `p != NULL`']
      ],
      caption: '**规则：声明指针就初始化成 NULL，用之前先判空。**' }
  ],
  pitfalls: [
    '**解引用野指针**：`int *p; printf("%d", *p);` —— p 里是垃圾值，可能直接崩溃，也可能悄悄改坏内存里的东西。声明即 `= NULL`。',
    '**返回局部变量的地址**：`int* f() { int x = 5; return &x; }` —— x 函数结束就没了，返回的地址是悬空指针。',
    '**把 `int*` 当 `char*` 用**：`p + 1` 会按 int 的 4 字节跳，类型不匹配时结果完全错乱。指针算术必须和实际类型一致。'
  ],
  vscode: [
    '**监视指针**：在「监视」面板同时加 `x`、`&x`、`p`、`*p`，单步时能直接看到 `p` 等于 `&x`，`*p` 等于 `x`。这是理解指针最直接的实验。',
    '**看结构体成员**：监视 `stu[0].score`、`stu[0].name`、`&stu[0]` 三个表达式，对照第 8 章理解 `->` 的含义。'
  ],
  summary: [
    '指针是存地址的变量：& 取地址，* 解引用，三者配合才能改到本体。',
    'a[i] == *(a+i) == p[i] == *(p+i)，数组下标本质就是指针算术。',
    '指针加法按基类型步进；声明即 NULL，用前判空。'
  ]
},

/* ============================================================
 * 第 8 章
 * ============================================================ */
{
  id: 'chapter-8',
  no: '08',
  tag: '第 8 章',
  group: '数据与内存',
  title: '结构体与结构体数组',
  goal: '把多个不同类型的数据打包成一条记录，并能用数组批量管理这些记录。',
  time: '35 分钟',
  tags: ['struct', '结构体数组', '->'],
  keywords: ['struct', '结构体', '成员', '->', '结构体数组', '排序'],
  concepts: [
    { t: 'struct 打包', d: '把不同类型的数据组合成一条记录' },
    { t: '三种用法', d: '结构体变量、结构体数组、结构体指针' },
    { t: '. 与 ->', d: '变量用点号，指针用箭头（`p->x` 等价 `(*p).x`）' },
    { t: 'typedef 简写', d: '`typedef struct {...} Student;` 之后直接写 Student' },
    { t: '排序要整体交换', d: '交换结构体必须用临时变量搬运整条记录' },
    { t: '大结构体传指针', d: '结构体很大时传指针，避免复制开销' }
  ],
  blocks: [
    { t: 'h3', text: '结构体：把一条记录的字段打包' },
    { t: 'p', text: '数组只能存**同类型**的数据。要表示"一个学生有学号、姓名、成绩"，就得用结构体。' },
    { t: 'code', id: 'c8_basic', file: '14_struct.c', title: '三种访问方式', lang: 'c',
      code: `#include <stdio.h>

struct Student { int id; char name[20]; double score; };

int main(void)
{
    struct Student s1 = {1001, "Tom", 88.5};
    struct Student arr[2] = {{1002,"Amy",92.0},{1003,"Bob",76.5}};
    struct Student *p = &s1;

    printf("%d %s %.1f\\n", s1.id, s1.name, s1.score);
    printf("%d %s %.1f\\n", arr[0].id, arr[0].name, arr[0].score);
    printf("%d %s %.1f\\n", p->id, p->name, p->score);
    p->score = 99.0;
    printf("s1.score = %.1f\\n", s1.score);
    return 0;
}`,
      expect: '1001 Tom 88.5\n1002 Amy 92.0\n1001 Tom 88.5\ns1.score = 99.0' },
    { t: 'p', text: '注意最后一行：改了 `p->score` 之后，`s1.score` 也变成 99.0 —— 因为 p 指向的就是 s1，**同一块内存**。' },

    { t: 'h3', text: '. 与 -> 的区别' },
    { t: 'table',
      head: ['场景', '写法', '等价写法'],
      rows: [
        ['结构体变量', '`s1.score`', '—'],
        ['结构体数组元素', '`arr[0].score`', '—'],
        ['结构体指针', '`p->score`', '`(*p).score`'],
        ['指向数组的指针', '`p[0].score`', '`p->score`']
      ],
      caption: '**记忆法：左边是"值"就用点，左边是"指针"就用箭头。**' },

    { t: 'h3', text: 'typedef 简写' },
    { t: 'p', text: '每次写 `struct Student` 很啰嗦，用 `typedef` 起个短名字：' },
    { t: 'code', id: 'c8_typedef', file: 'typedef.c', title: 'typedef + 结构体数组', lang: 'c',
      code: `#include <stdio.h>

typedef struct {
    int id;
    char name[20];
    double score;
} Student;

int main(void)
{
    Student stu[3] = {
        {1001, "Tom", 88.0},
        {1002, "Amy", 95.5},
        {1003, "Bob", 72.0}
    };
    int i;

    for (i = 0; i < 3; i++) {
        printf("%d %-6s %.1f\\n", stu[i].id, stu[i].name, stu[i].score);
    }
    return 0;
}`,
      expect: '1001 Tom    88.0\n1002 Amy    95.5\n1003 Bob    72.0' },

    { t: 'h3', text: '结构体数组排序' },
    { t: 'p', text: '把结构体数组按成绩排序，**必须整体交换结构体**。只交换 score 字段会让姓名和分数对不上号。' },
    { t: 'code', id: 'c8_sort', file: 'struct_sort.c', title: '冒泡排序 + 整体交换', lang: 'c',
      code: `#include <stdio.h>

struct Student { char name[20]; double score; };

int main(void)
{
    struct Student stu[3] = {{"Tom",88.0},{"Amy",95.5},{"Bob",72.0}};
    struct Student tmp;
    int i, j;
    for (i = 0; i < 3; i++) printf("%-6s %.1f\\n", stu[i].name, stu[i].score);
    for (i = 0; i < 2; i++)
        for (j = 0; j < 2 - i; j++)
            if (stu[j].score < stu[j + 1].score) {
                tmp = stu[j];                 /* 整体搬运 */
                stu[j] = stu[j+1]; stu[j+1] = tmp;
            }
    printf("--- sorted ---\\n");
    for (i = 0; i < 3; i++) printf("%-6s %.1f\\n", stu[i].name, stu[i].score);
    return 0;
}`,
      expect: 'Tom    88.0\nAmy    95.5\nBob    72.0\n--- sorted ---\nAmy    95.5\nTom    88.0\nBob    72.0' },
    { t: 'p', text: '关键那三行：`tmp = stu[j]` 用**临时结构体变量**把整条记录搬过去，再交换。只交换 score 字段会怎样？' },
    { t: 'callout', kind: 'pitfall', title: '只交换 score 会怎样？',
      text: '如果只写 `double t = a.score; a.score = b.score; b.score = t;`，排序后 **Tom 会拿着 Amy 的分数**。程序不报错、结果看着像排序了，但数据全错 —— 这种 bug 排查起来最费时间。' },

    { t: 'h3', text: '大结构体传指针' },
    { t: 'code', id: 'c8_passptr', file: 'pass_ptr.c', title: '传指针避免复制', lang: 'c',
      code: `#include <stdio.h>

typedef struct {
    int id;
    char name[20];
    double scores[10];   /* 这个结构体很大 */
} Report;

/* 传结构体: 整个结构体被复制一份 */
void show_by_value(Report r)
{
    printf("value: id=%d name=%s\\n", r.id, r.name);
}

/* 传指针: 只复制 8 字节地址 */
void show_by_ptr(const Report *r)
{
    printf("ptr  : id=%d name=%s\\n", r->id, r->name);
}

int main(void)
{
    Report r = {1001, "Tom", {0}};
    show_by_value(r);
    show_by_ptr(&r);
    return 0;
}`,
      expect: 'value: id=1001 name=Tom\nptr  : id=1001 name=Tom' }
  ],
  pitfalls: [
    '**排序时只交换字段**：结构体数组排序必须用临时结构体变量整体交换，否则姓名和分数错位。',
    '**`.` 和 `->` 用错**：对指针用 `.` 直接编译报错；对结构体变量用 `->` 同样报错。记不住就想想"左边是不是指针"。',
    '**结构体数组初始化要双层括号**：`{{1001,"Tom",88.0},{1002,"Amy",92.0}}`，每个元素是一组花括号，少一层括号就编译不过。'
  ],
  vscode: [
    '**监视结构体成员**：在「监视」面板加 `stu[0]` 看整个结构体，加 `stu[0].score` 看单个字段，加 `&stu[0]` 看地址。',
    '**调试排序问题**：在交换语句前后各打一个断点，F10 单步，直接观察 `stu[j].name` 和 `stu[j].score` 是否还匹配。'
  ],
  summary: [
    '结构体把不同类型字段打包成一条记录，三种用法：变量、数组、指针。',
    '变量用点号，指针用箭头；`p->x` 等价 `(*p).x`。',
    '结构体数组排序必须整体交换；大结构体传指针省复制。'
  ]
},

/* ============================================================
 * 第 9 章
 * ============================================================ */
{
  id: 'chapter-9',
  no: '09',
  tag: '第 9 章',
  group: '实战',
  title: '综合项目：学生成绩管理系统（数组版）',
  goal: '把前 8 章的变量、循环、函数、指针、数组、结构体全部用上，写出一个真正能跑的交互式程序。',
  time: '60 分钟',
  tags: ['项目', '菜单', '数组版', '综合'],
  keywords: ['项目', '菜单', '添加', '查找', '排序', '修改', '综合项目'],
  concepts: [
    { t: '先定数据', d: 'struct Student + 全局数组 + 全局计数器' },
    { t: '菜单循环', d: 'while(1) + switch，case 0 退出' },
    { t: '功能拆函数', d: '每个功能一个函数，main 只做调度' },
    { t: '查找返回值', d: '返回下标，找不到返回 -1' },
    { t: '容量检查', d: '添加前必须判断 count >= MAX' },
    { t: '调试演示', d: '用断点逐个菜单走一遍' }
  ],
  blocks: [
    { t: 'h3', text: '需求：程序要做什么' },
    { t: 'ul', items: [
      '**添加学生**：输入学号、姓名、成绩，存进数组',
      '**打印所有**：按表格形式列出全部学生',
      '**查找学生**：按学号查找，找到显示、找不到给提示',
      '**成绩排序**：按成绩从高到低排序并重新打印',
      '**修改成绩**：按学号找到后修改分数',
      '**菜单循环**：一直显示菜单，直到用户选择退出'
    ] },

    { t: 'h3', text: '第一步：定数据结构' },
    { t: 'p', text: '做项目的顺序永远是：**先定数据 → 再拆功能 → 最后写 main**。数据结构想清楚了，代码几乎不用想。' },
    { t: 'code', id: 'c9_data', file: 'project_data.c', title: '数据与全局状态', lang: 'c',
      code: `#include <stdio.h>

#define MAX 50

struct Student
{
    int id;
    char name[20];
    double score;
};

struct Student stu[MAX];   /* 全局数组: 自动初始化为 0 */
int count = 0;             /* 全局计数器: 当前有多少条记录 */`,
      fragment: true,
      note: '这是一段**声明片段**，没有 main 函数，不能单独编译 —— 它是下面完整程序的一部分。' },

    { t: 'h3', text: '第二步：拆成独立函数' },
    { t: 'code', id: 'c9_funcs', file: 'project_funcs.c', title: '查找与排序两个核心函数', lang: 'c',
      code: `/* 按学号查找, 返回下标, -1 表示没找到 */
int find_by_id(int id)
{
    int i;
    for (i = 0; i < count; i++) {
        if (stu[i].id == id) {
            return i;
        }
    }
    return -1;
}

/* 按成绩从高到低排序 */
void sort_by_score(void)
{
    int i;
    int j;
    for (i = 0; i < count - 1; i++) {
        for (j = 0; j < count - 1 - i; j++) {
            if (stu[j].score < stu[j + 1].score) {
                struct Student tmp = stu[j];
                stu[j] = stu[j + 1];
                stu[j + 1] = tmp;
            }
        }
    }
}`,
      fragment: true,
      note: '同样是一段**函数片段**，依赖上面的全局变量 `stu` 和 `count`，完整版本见下一段代码。' },

    { t: 'h3', text: '第三步：完整可运行程序' },
    { t: 'p', text: '把下面代码存成 `student.c`，用 `gcc student.c -o student.exe` 编译，然后运行。这一份是**完整项目**，不是片段。' },
    { t: 'code', id: 'c9_full', file: 'student.c', title: '学生成绩管理系统（完整版）', lang: 'c',
      code: `#include <stdio.h>
#include <string.h>

#define MAX 50

struct Student
{
    int id;
    char name[20];
    double score;
};

struct Student stu[MAX];
int count = 0;

/* 添加一个学生 */
void add_student(void)
{
    if (count >= MAX) {
        printf("数组已满, 无法添加\\n");
        return;
    }
    printf("请输入 学号 姓名 成绩: ");
    scanf("%d %19s %lf", &stu[count].id, stu[count].name, &stu[count].score);
    count++;
    printf("添加成功\\n");
}

/* 打印所有学生 */
void print_all(void)
{
    int i;
    if (count == 0) {
        printf("暂无学生数据\\n");
        return;
    }
    printf("学号\\t姓名\\t成绩\\n");
    for (i = 0; i < count; i++) {
        printf("%d\\t%s\\t%.1f\\n", stu[i].id, stu[i].name, stu[i].score);
    }
}

/* 按学号查找, 返回下标, -1 表示没找到 */
int find_by_id(int id)
{
    int i;
    for (i = 0; i < count; i++) {
        if (stu[i].id == id) {
            return i;
        }
    }
    return -1;
}

/* 用指针参数打印第 idx 个学生 */
void show_one(struct Student *p)
{
    printf("%d\\t%s\\t%.1f\\n", p->id, p->name, p->score);
}

/* 按成绩从高到低排序 */
void sort_by_score(void)
{
    int i;
    int j;
    for (i = 0; i < count - 1; i++) {
        for (j = 0; j < count - 1 - i; j++) {
            if (stu[j].score < stu[j + 1].score) {
                struct Student tmp = stu[j];
                stu[j] = stu[j + 1];
                stu[j + 1] = tmp;
            }
        }
    }
}

/* 修改指定学号的成绩 */
void update_score(void)
{
    int id, idx;
    double new_score;
    printf("请输入要修改的学号: ");
    scanf("%d", &id);
    idx = find_by_id(id);
    if (idx < 0) {
        printf("未找到该学号\\n");
        return;
    }
    printf("当前成绩: %.1f, 请输入新成绩: ", stu[idx].score);
    scanf("%lf", &new_score);
    stu[idx].score = new_score;
    printf("修改成功\\n");
}

int main(void)
{
    int choice;
    int id;
    int idx;

    while (1) {
        printf("\\n===== 学生成绩管理系统 =====\\n");
        printf("1.添加学生  2.打印所有  3.查找学生\\n");
        printf("4.成绩排序  5.修改成绩  0.退出系统\\n");
        printf("请选择: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                add_student();
                break;
            case 2:
                print_all();
                break;
            case 3:
                printf("请输入要查找的学号: ");
                scanf("%d", &id);
                idx = find_by_id(id);
                if (idx >= 0) {
                    printf("查找结果:\\n");
                    show_one(&stu[idx]);
                } else {
                    printf("未找到该学号\\n");
                }
                break;
            case 4:
                sort_by_score();
                printf("按成绩从高到低排序完成:\\n");
                print_all();
                break;
            case 5:
                update_score();
                break;
            case 0:
                printf("系统退出, 再见!\\n");
                return 0;
            default:
                printf("输入无效, 请重新选择\\n");
        }
    }
}`,
      stdin: '1\n1001\nTom\n88.5\n1\n1002\nAmy\n95\n2\n3\n1002\n4\n5\n1001\n99\n0\n',
      expect: '\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入 学号 姓名 成绩: 添加成功\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入 学号 姓名 成绩: 添加成功\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 学号\t姓名\t成绩\n1001\tTom\t88.5\n1002\tAmy\t95.0\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入要查找的学号: 查找结果:\n1002\tAmy\t95.0\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 按成绩从高到低排序完成:\n学号\t姓名\t成绩\n1002\tAmy\t95.0\n1001\tTom\t88.5\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入要修改的学号: 当前成绩: 88.5, 请输入新成绩: 修改成功\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 系统退出, 再见!' },

    { t: 'h3', text: '第四步：分函数讲解' },
    { t: 'table',
      head: ['函数', '职责', '关键点'],
      rows: [
        ['`add_student()`', '读入一条记录并追加', '**先判断 `count >= MAX`**，否则写穿数组'],
        ['`print_all()`', '表格输出全部记录', '`count == 0` 时给提示，不要打印空表'],
        ['`find_by_id(id)`', '查找并返回**下标**', '找不到返回 **-1**，这是 C 里的通用约定'],
        ['`show_one(p)`', '打印单个学生', '用指针参数，`p->id` 访问字段'],
        ['`sort_by_score()`', '按成绩降序排序', '**整体交换结构体**，内层条件是 `count - 1 - i`'],
        ['`update_score()`', '修改指定学号的成绩', '先 `find_by_id` 拿到下标，再改'],
        ['`main()`', '显示菜单 + 调度', '`while(1)` 死循环 + `switch` 分派，`case 0` 退出']
      ],
      caption: '**main 里只写调度逻辑**，具体怎么做全交给各个函数。这样任何一个功能出问题，都只需要调试一个函数。' },

    { t: 'h3', text: '调试演示：跟着程序走一遍' },
    { t: 'ol', items: [
      '在 `add_student()` 里的 `count++;` 那一行打**断点**',
      'F5 运行，输入菜单选项 1，程序会在断点停下',
      '在右侧「监视」面板加上 `count` 和 `stu[0].id`，能看到**每添加一个学生 count 加 1**',
      '在 `find_by_id()` 的 `return i;` 处打断点，输入选项 3 查找 1002，监视 `id` 和 `i`，能看到查找过程',
      '在 `sort_by_score()` 的交换语句处打断点，按 F10 单步，能清楚看到**相邻两个结构体整体交换**的过程'
    ] },

    { t: 'h3', text: '下一步可以加什么' },
    { t: 'ul', items: [
      '**删除学生**：找到后把后面的元素依次前移覆盖，最后 `count--`',
      '**按姓名排序**：把 `stu[j].score` 换成 `strcmp(stu[j].name, stu[j+1].name)`',
      '**成绩统计**：求平均分、最高分、最低分及格率',
      '**存到文件**：用 `fopen`/`fwrite` 把数据写进文件，下次启动自动读取 —— 这就是文件操作，先按需再学'
    ] }
  ],
  pitfalls: [
    '**`scanf("%d %19s %lf", ...)` 里的 19 必须写**：不写宽度限制，名字超过 19 个字符就会写穿到相邻的 id 和 score 字段上，把整条记录弄坏。',
    '**添加前忘了判断容量**：`count` 达到 MAX 后继续写就是越界。数组版必须在 `add_student()` 开头检查 `count >= MAX`。',
    '**`find_by_id` 找不到时返回 0 而不是 -1**：返回 0 会和"第一个学生"混淆，导致找不到时反而显示别人的数据。'
  ],
  vscode: [
    '**用 F5 调试交互式程序**：scanf 会等待输入，先在终端里输入数据再按回车即可。在「监视」面板加 `count`、`stu[0].id` 观察状态变化。',
    '**代码格式化**：<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> 一键整理缩进，多文件项目建议在 settings.json 里设置 `"C_Cpp.formatting": "clangFormat"`。'
  ],
  summary: [
    '做项目顺序：定数据结构 → 拆功能函数 → 写 main 调度。',
    '查找函数返回下标、找不到返回 -1；添加前检查容量上限。',
    '结构体排序必须整体交换；main 只做调度，调试时逐个函数断点验证。'
  ]
},

/* ============================================================
 * 第 10 章
 * ============================================================ */
{
  id: 'chapter-10',
  no: '10',
  tag: '第 10 章',
  group: '实战',
  title: 'VS Code 调试与开发工作流',
  goal: '学会用调试器而不是 printf 找 bug，并把代码组织成能长期维护的多文件项目。',
  time: '30 分钟',
  tags: ['调试', '断点', '监视', '多文件'],
  keywords: ['断点', '单步', '监视', 'gdb', '编译错误', '多文件', '格式化'],
  concepts: [
    { t: '断点', d: '程序运行到这一行停下，可以查看此刻的所有变量' },
    { t: '单步执行', d: 'F10 跳过函数、F11 进入函数、Shift+F11 跳出' },
    { t: '监视表达式', d: '随时看 `&x`、`p`、`*p`、`stu[0].score` 的值' },
    { t: '条件断点', d: '只在某次循环满足条件时停下，省时间' },
    { t: '常见编译错误', d: '未声明、分号缺失、类型不匹配、链接错误' },
    { t: '多文件编译', d: '把函数拆到 .h/.c，gcc 一次编译多个源文件' }
  ],
  blocks: [
    { t: 'h3', text: '调试器能干什么' },
    { t: 'table',
      head: ['操作', '快捷键', '作用'],
      rows: [
        ['切换断点', 'F9', '在当前行设置/取消断点（行号左侧点击也行）'],
        ['开始/继续', 'F5', '编译并运行；已在调试中则继续执行到下一个断点'],
        ['单步跳过', 'F10', '执行当前行，**不进入**函数内部'],
        ['单步进入', 'F11', '执行当前行并**进入**被调用的函数'],
        ['单步跳出', 'Shift+F11', '从当前函数返回上一层'],
        ['重启动', 'Ctrl+Shift+F5', '重新编译运行，程序状态清零'],
        ['切换断点条件', '右键断点 → 编辑条件', '比如 `i == 5` 只在特定迭代停下']
      ]
    },

    { t: 'h3', text: '一段专门用来调试的代码' },
    { t: 'p', text: '下面这段同时包含普通变量、指针和结构体数组，是练习监视面板的最佳素材：' },
    { t: 'code', id: 'c10_debug', file: 'debug_demo.c', title: '调试练习代码', lang: 'c',
      code: `#include <stdio.h>

struct Student { int id; char name[20]; double score; };

int main(void)
{
    int x = 10;
    int *p = &x;
    struct Student stu[2] = {{1001,"Tom",88.5},{1002,"Amy",92.0}};
    int i;

    *p = 42;
    printf("x = %d\\n", x);

    for (i = 0; i < 2; i++) {
        printf("%d %s %.1f\\n", stu[i].id, stu[i].name, stu[i].score);
    }
    return 0;
}`,
      expect: 'x = 42\n1001 Tom 88.5\n1002 Amy 92.0' },
    { t: 'p', text: '在「监视」面板里把这些表达式一个个加进去，F10 单步时会实时变化：' },
    { t: 'table',
      head: ['监视表达式', '你会看到什么'],
      rows: [
        ['`x`', '变量 x 的当前值，*p = 42 之后变成 42'],
        ['`&x`', 'x 的地址，如 0x7ffd8b8c'],
        ['`p`', '**和 `&x` 完全一样** —— 这就证明了 p 里装的是地址'],
        ['`*p`', '等于 x 的值'],
        ['`stu[0].score`', '第一个学生的成绩 88.5'],
        ['`stu[1].name`', '第二个学生的姓名 Amy'],
        ['`&stu[0]`', '第一个结构体元素的地址'],
        ['`i`', '循环变量，从 0 变成 1']
      ],
      caption: '**记住 `p == &x` 这个观察**，指针那章的所有疑惑都会在这一个面板里解开。' },

    { t: 'h3', text: '常见编译错误速查' },
    { t: 'table',
      head: ['错误信息', '真正的原因', '怎么改'],
      rows: [
        ['`implicit declaration of function \'xxx\'`', '函数没声明，或头文件没 include', '写函数原型 / 补 `#include`'],
        ['`expected \';\' before ...`', '上一行漏了分号', '补 `;`'],
        ['`unknown type name \'Student\'`', '结构体类型没定义或没 include 头文件', '检查 typedef 和头文件'],
        ['`conflicting types for \'xxx\'`', '原型和定义对不上', '让两处签名完全一致'],
        ['`undefined reference to \'xxx\'`', '**链接错误**：函数编译了但没一起链接', '编译命令里加上所有 .c 文件'],
        ['`warning: control reaches end of non-void function`', '非 void 函数某条路径没 return', '补上 return，或在末尾加 `return 0;`']
      ],
      caption: '**区分两类错误**：`error` 是编译不过，`warning` 是能编译但可能有问题。`-Wall` 打开后 warning 一定要看。' },

    { t: 'h3', text: '多文件项目怎么组织' },
    { t: 'p', text: '文件超过两三个就该拆了。标准做法：一个 `.h` 放声明，一个 `.c` 放实现，主文件调用它们。' },
    { t: 'code', id: 'c10_multi', file: 'utils.h + utils.c + main.c', title: '三文件结构（真实拆成三个文件编译）', lang: 'c',
      code: `/* ---------- utils.h : 只放声明 ---------- */
#ifndef UTILS_H
#define UTILS_H

int add(int a, int b);
void swap(int *a, int *b);

#endif

/* ---------- utils.c : 只放实现 ---------- */
#include "utils.h"

int add(int a, int b) { return a + b; }

void swap(int *a, int *b)
{
    int t = *a; *a = *b; *b = t;
}

/* ---------- main.c : 调用方 ---------- */
#include <stdio.h>
#include "utils.h"

int main(void)
{
    int x = 1, y = 2;
    printf("add = %d\\n", add(3, 4));
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
      files: [
        { name: 'utils.h', code: `#ifndef UTILS_H
#define UTILS_H

int add(int a, int b);
void swap(int *a, int *b);

#endif
` },
        { name: 'utils.c', code: `#include "utils.h"

int add(int a, int b) { return a + b; }

void swap(int *a, int *b)
{
    int t = *a; *a = *b; *b = t;
}
` },
        { name: 'main.c', code: `#include <stdio.h>
#include "utils.h"

int main(void)
{
    int x = 1, y = 2;
    printf("add = %d\\n", add(3, 4));
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}
` }
      ],
      expect: 'add = 7\nx=2 y=1' },
    { t: 'code', id: 'c10_build', file: '终端', title: '编译命令', lang: 'bash',
      code: `# 一次编译多个源文件
gcc main.c utils.c -o app.exe

# 顺便生成调试信息, 这样才能用 F5 单步
gcc -g main.c utils.c -o app.exe

# 打开警告, 强烈建议常开
gcc -Wall -Wextra -g main.c utils.c -o app.exe

# 只编译不链接, 排查 "undefined reference" 时很有用
gcc -c utils.c`,
      expect: '编译成功时终端没有任何输出 —— 没有任何输出就说明没报错。' },

    { t: 'h3', text: '一个务实的开发工作流' },
    { t: 'ol', items: [
      '**写**：`main.c` 里先把流程写通，用 `printf` 打印关键中间值',
      '**测**：编译运行，手动敲几组输入验证逻辑',
      '**调**：逻辑对了但结果不对时，**删掉 printf，换成断点 + 监视**',
      '**整理**：逻辑稳定后拆函数、加注释、格式化代码',
      '**回归**：改完再跑一遍全部输入，确认没改坏别的功能'
    ] },
    { t: 'callout', kind: 'ok', title: '关于 printf 调试',
      text: 'printf 调试不是错的，小程序很方便。但它有两个硬伤：**要猜该打印什么**，而且**改一次代码要重编译一次**。当程序超过 100 行、或者要循环 1000 次找问题，断点 + 条件断点能快十倍。' }
  ],
  pitfalls: [
    '**用 printf 调试大程序**：循环里 printf 几千行，屏幕都看不清。换成条件断点（`i == 500`）一步到位。',
    '**忘了加 `-g` 编译不出调试信息**：F5 能启动但断点不生效，或者变量显示 "unavailable"。检查编译命令有没有 `-g`。',
    '**`undefined reference` 是链接错误不是编译错误**：函数在 .c 里写了但没写进编译命令。用 `gcc main.c utils.c` 而不是只 `gcc main.c`。'
  ],
  vscode: [
    '**launch.json 自动生成**：按 F5 第一次会提示生成 `launch.json`，里面 `preLaunchTask` 就配好了 gcc 编译命令，之后直接用。',
    '**条件断点**：右键红色断点 → 「编辑条件」，输入 `i == 5` 或 `strcmp(name, "Tom") == 0`，只在特定情况停下，比逐次 F10 快得多。'
  ],
  summary: [
    '调试器三件套：F9 打断点、F10/F11 单步、监视面板看变量值。',
    'warning 不是 error，但 `-Wall` 打开后一定要看，尤其 `-Wparentheses` 和 `-Wimplicit-fallthrough`。',
    '多文件项目：.h 放声明、.c 放实现，编译时把所有 .c 一起带上并加 -g。'
  ]
},

/* ============================================================
 * 附录 A
 * ============================================================ */
{
  id: 'appendix-a',
  no: 'A',
  tag: '附录 A',
  group: '附录',
  title: '常见坑清单',
  goal: '把本课程涉及的高频坑集中在一页，写代码前扫一眼，能省下大量调试时间。',
  time: '10 分钟',
  tags: ['坑点', '速查'],
  keywords: ['坑', '常见错误', '速查', '避坑'],
  concepts: [
    { t: '静默出错最危险', d: '不崩溃但结果错的 bug 最难查，靠的是提前避开' },
    { t: '编译器是你的朋友', d: '`-Wall` 报出的 warning 基本都是真问题' },
    { t: '先想清楚再写', d: '数组长度、格式符宽度、类型转换' }
  ],
  blocks: [
    { t: 'h3', text: '按类型分类的坑点速查' },
    { t: 'table',
      head: ['类别', '坑', '表现', '解法'],
      rows: [
        ['编译', '文件后缀是 `.txt`', 'gcc 报找不到文件', '新建文件时选 C 源文件'],
        ['编译', '漏写分号', '`expected \';\'`', '看报错行号**上一行**'],
        ['编译', '函数没声明', '`implicit declaration`', '写函数原型 / include 头文件'],
        ['链接', '漏编译某个 .c', '`undefined reference`', '编译命令带上所有源文件'],
        ['类型', '整数除法截断', '`7/2` 得 3 不是 3.5', '`(double)a / b`'],
        ['类型', 'scanf 读 double 用 `%f`', '数据错乱', 'scanf 用 `%lf`'],
        ['类型', '字符用双引号', '编译报错', '字符 `\'A\'`，字符串 `"A"`'],
        ['输入', 'scanf 字符串不写宽度', '写穿数组，数据全乱', '`%19s`，数字 = 长度-1'],
        ['输入', 'scanf 读 char 不加空格', '读到换行符', '格式串写 `" %c"`'],
        ['判断', '`=` 写成 `==`', '条件恒真/恒假', '编译加 `-Wall`'],
        ['判断', 'switch 漏 break', '意外执行下一个 case', '每个 case 都写 break'],
        ['循环', 'continue 在计数器之前', '死循环', '确保计数器会推进'],
        ['循环', '数组循环 `i <= n`', '越界读写', '用 `i < n`'],
        ['数组', '字符串忘了 `\\0`', 'printf 乱码', '用 `"..."` 初始化，或手动补'],
        ['数组', '二维数组行长度不齐', '数据错位', '每行列数必须一致'],
        ['指针', '解引用未初始化指针', '崩溃或乱改内存', '声明即 `= NULL`'],
        ['指针', '返回局部变量地址', '悬空指针', '不要返回局部变量地址'],
        ['指针', '函数内 `sizeof(arr)`', '得到指针大小不是数组长度', '长度单独传参'],
        ['结构体', '排序只交换字段', '姓名和分数错位', '用临时结构体整体交换'],
        ['结构体', '`.` 用在指针上', '编译报错', '指针用 `->`']
      ]
    },
    { t: 'h3', text: '三个"沉默的凶手"' },
    { t: 'p', text: '有些 bug 会当场崩溃，很好查；有些**一声不吭地给出错误结果**，这才是真正的麻烦。三个最典型的：' },
    { t: 'ul', items: [
      '**整数除法截断** —— `7/2` 得 3，程序不报错，但结果就是错的',
      '**switch 穿透** —— 少个 break，多执行一段代码，输出看着还挺合理',
      '**结构体排序只换字段** —— 排完序姓名和分数对不上号，数据全错'
    ] },
    { t: 'code', id: 'cA_silent', file: 'silent_bugs.c', title: '三个静默 bug 的最小复现', lang: 'c',
      code: `#include <stdio.h>

struct Student { char name[8]; double score; };

int main(void)
{
    /* 坑 1: 整数除法截断, 结果是 3 不是 3.5 */
    printf("7/2 = %d\\n", 7 / 2);

    /* 坑 2: switch 漏 break, 穿透执行下一段 */
    int day = 3;
    switch (day) {
        case 3: printf("Wednesday\\n");   /* 少了 break */
        case 4: printf("Thursday\\n"); break;
    }

    /* 坑 3: 结构体排序只换字段, 姓名和分数错位 */
    struct Student s[2] = {{"Tom",88.0},{"Amy",95.5}};
    double t = s[0].score;
    s[0].score = s[1].score;   /* 只换了分数 */
    s[1].score = t;
    printf("%s(%.1f) %s(%.1f)\\n", s[0].name, s[0].score, s[1].name, s[1].score);
    return 0;
}`,
      expectWarn: true,
      expect: '7/2 = 3\nWednesday\nThursday\nTom(95.5) Amy(88.0)' },
    { t: 'code', id: 'cA_scanf', file: 'scanf_width.c', title: '宽度限制的正确与错误写法', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    char buf[5];

    printf("请输入一个短词: ");
    scanf("%4s", buf);      /* 正确: 最多写 4 个字符 + '\\0' */
    printf("读到: %s\\n", buf);

    /* 错误写法: scanf("%s", buf);  没有宽度限制, 写长了会破坏内存 */
    return 0;
}`,
      stdin: 'abc\n',
      expect: '请输入一个短词: 读到: abc' },
    { t: 'callout', kind: 'note', title: '怎么防',
      text: '**一、编译永远带 `-Wall -Wextra`**；**二、算除法先想清楚是不是整数除法**；**三、结果不对时先用断点看中间值，别急着改代码**。' }
  ],
  pitfalls: [
    '**凭记忆写格式符**：`%d` 和 `%lf` 混用，scanf 侧写错编译器**不一定会报错**，数据直接读错。写完对照一遍格式串和参数类型。',
    '**以为"能编译就是对的"**：本课程 42 个示例里有 2 个是**故意带警告**的（`if (flag = 0)` 和漏 `break`），gcc 报了 warning 但程序照跑、结果照错。`warning` 不是可选的。',
    '**越界不一定会崩**：写 `a[5]` 访问长度为 5 的数组，有时当场段错误，有时只是悄悄改坏隔壁内存 —— 后者更危险，因为它不会给你任何提示。'
  ],
  vscode: [
    '**把这份清单存成代码片段**：VS Code 里 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> → 「Snippets: Configure Snippets」，可以给 `scanf` 之类生成带正确格式符的模板。',
    '**把编译警告当成错误对待**：项目里配 `"C_Cpp.compileArgs": ["-Wall", "-Wextra"]`，让 VS Code 每次编译都带上警告开关，编辑器直接标黄。'
  ],
  summary: [
    '静默出错的三个坑：整数除法、switch 穿透、结构体排序只换字段。',
    '编译永远带 `-Wall -Wextra`，warning 基本都是真问题。',
    '写代码前扫一眼这张表，能省掉大半调试时间。'
  ]
},

/* ============================================================
 * 附录 B
 * ============================================================ */
{
  id: 'appendix-b',
  no: 'B',
  tag: '附录 B',
  group: '附录',
  title: '可跳过 / 后置内容清单',
  goal: '明确划清本课程不覆盖的范围，以及什么时候该回来补。',
  time: '5 分钟',
  tags: ['范围', '后置', '边界'],
  keywords: ['跳过', '后置', '范围', '用到再查'],
  concepts: [
    { t: '不讲不等于不会', d: '这些内容都真实存在，只是不影响你现在写出能跑的程序' },
    { t: '有触发条件再学', d: '每个知识点都写清了"什么时候你会用到它"' },
    { t: '不学的代价', d: '现阶段不学这些，一点都不影响写出成绩管理系统' }
  ],
  blocks: [
    { t: 'h3', text: '本课程明确不展开的内容' },
    { t: 'code', id: 'cB_defer', file: 'deferred.c', title: '被后置的知识点长什么样（仅示意）', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    /* 递归: 本课程不讲, 但你迟早会遇到 */
    int fact(int n);
    printf("5! = %d\\n", fact(5));

    /* 位运算: 本课程不讲, 驱动和嵌入式里常用 */
    unsigned int flags = 0;
    flags |= 1u << 2;          /* 打开第 2 个开关 */
    printf("bit2 = %u\\n", (flags >> 2) & 1u);

    /* 动态内存: 本课程不讲, 数据持久化时常用 */
    printf("这些都留到 [用到再查]\\n");
    return 0;
}

int fact(int n)
{
    if (n <= 1) return 1;
    return n * fact(n - 1);
}`,
      expect: '5! = 120\nbit2 = 1\n这些都留到 [用到再查]' },
    { t: 'code', id: 'cB_lookup', file: 'lookup_hint.c', title: '需要时怎么查：以文件操作为例', lang: 'c',
      code: `#include <stdio.h>

/* 文件操作: 本课程不展开, 需要时查文档即可
   三个关键函数: fopen 打开 / fread 读 / fwrite 写
   配 fclose 关闭, 配 remove 删除 */

int main(void)
{
    FILE *fp;
    char line[100];

    /* 打开文件, 不存在就返回 NULL, 必须判断 */
    fp = fopen("data.txt", "r");
    if (fp == NULL) {
        printf("文件不存在, 先创建\\n");
        return 1;
    }

    /* 读一行 */
    if (fgets(line, sizeof(line), fp) != NULL) {
        printf("第一行: %s", line);
    }
    fclose(fp);
    return 0;
}`,
      fragment: true,
      note: '这是一段**展示用片段**（缺少被读取的 data.txt 文件），实际写法以官方文档为准。' },
    { t: 'table',
      head: ['知识点', '一句话说明', '什么时候你会用到它'],
      rows: [
        ['数制转换 / 二进制', '十进制 ↔ 二进制的换算规则', '写协议解析、位图、硬件寄存器时'],
        ['原码 / 反码 / 补码', '有符号数的机器表示方式', '做底层优化、理解溢出时'],
        ['位运算', '`&` `|` `^` `~` `<<` `>>` 按位计算', '写驱动、做标志位、性能优化时'],
        ['递归', '函数自己调用自己', '处理树、目录遍历、分治算法时'],
        ['函数指针', '把函数当值传递', '写回调、插件系统、qsort 时'],
        ['指针的指针', '指向指针的指针', '处理二级指针、链表节点时'],
        ['链表', '用指针串起来的动态数组', '需要频繁在中间插入删除时'],
        ['文件操作', '`fopen` `fread` `fwrite`', '要做数据持久化、保存到磁盘时'],
        ['动态内存分配', '`malloc` `free`', '运行时才知道要开多大空间时'],
        ['联合体与位域', '同一块内存复用 / 精确到位的结构体', '做协议包解析、嵌入式时'],
        ['预处理器进阶', '宏、条件编译', '写跨平台代码、配置开关时'],
        ['多线程', '`pthread` / OpenMP', '做并发计算、IO 密集型服务时']
      ],
      caption: '**统一原则：用到再查。** 上面每一条都不是"不重要"，只是"现在学了也用不上"。' },
    { t: 'h3', text: '为什么这样安排' },
    { t: 'p', text: 'C 语言的知识体系很大，但**开发时真正高频用到的只是一小部分**。本课程把这条主线讲透，让你尽快具备"能独立写出一个完整小程序"的能力；其余内容作为工具箱，需要时随时回来取。' },
    { t: 'p', text: '学完本课程之后，推荐的补课顺序是：' },
    { t: 'ol', items: [
      '**文件操作** —— 让程序的数据能存下来，最有成就感',
      '**动态内存分配** —— 理解 malloc/free，数组版和链表版就此打通',
      '**结构体嵌套与指针** —— 写出真正的链表、树、二叉树',
      '**函数指针与回调** —— 为将来学 C++、写框架打基础',
      '**位运算与预处理宏** —— 补齐嵌入式和性能优化的短板'
    ] }
  ],
  pitfalls: [
    '**别被"必须学完 C"绑架**：工作里 90% 的 C 代码只用到了本课程覆盖的这些。广度不如深度值钱。',
    '**以为跳过 = 不会**：这些知识点只是本课程不展开，真遇到时查资料半小时就能上手 —— 因为你已经掌握了变量、函数、指针这些底层工具。'
  ],
  vscode: [
    '**建立个人速查笔记**：把这张表复制到你的笔记软件，遇到新需求时查一下"该学什么"，比从头系统学一遍效率高得多。',
    '**记一个"下次遇到就查"的文件夹**：新建 `notes/待补/` 目录，把工作里遇到但当时看不懂的知识点记在里面，一个月后集中补，效率最高。'
  ],
  summary: [
    '本课程不覆盖：位运算、递归、文件操作、链表、动态内存等。',
    '不是不重要，是现在用不上 —— 统一原则是"用到再查"。',
    '学完后的补课顺序：文件操作 → 动态内存 → 结构体嵌套 → 函数指针。'
  ]
},

/* ============================================================
 * 附录 C
 * ============================================================ */
{
  id: 'appendix-c',
  no: 'C',
  tag: '附录 C',
  group: '附录',
  title: '自测题与参考答案',
  goal: '用 12 道题检验掌握程度，答不上来的地方回去重看对应章节。',
  time: '30 分钟',
  tags: ['自测', '验收', '答案'],
  keywords: ['自测', '测试题', '参考答案', '验收'],
  concepts: [
    { t: '闭卷才有效', d: '先自己写，写完再看答案' },
    { t: '按章节回溯', d: '答错的题对应哪个章节就回去重看' },
    { t: '能编译才算过', d: '答案必须真的能 gcc 编译运行' }
  ],
  blocks: [
    { t: 'h3', text: '怎么用这份自测' },
    { t: 'p', text: '**先闭卷做完，再展开答案。** 每道题都有对应的章节编号，答错就回去重看那一节。练习区的题目需要自己动手写代码 —— 光看不写，等于没学。' },
    { t: 'h3', text: '自测验收代码' },
    { t: 'p', text: '这段代码一次性覆盖了变量、循环、函数、指针、结构体和排序。**能独立写出来并跑通，本课程就算过关**：' },
    { t: 'code', id: 'cC_selftest', file: 'selftest.c', title: '综合自测程序', lang: 'c',
      code: `#include <stdio.h>
#include <string.h>

struct Student { char name[20]; int score; };

void swap(int *a, int *b)
{
    int t = *a; *a = *b; *b = t;
}

int main(void)
{
    struct Student stu[4] = {{"Tom",78},{"Amy",95},{"Bob",60},{"Cindy",88}};
    int i, j;
    /* 冒泡排序: 成绩从高到低 */
    for (i = 0; i < 3; i++)
        for (j = 0; j < 3 - i; j++)
            if (stu[j].score < stu[j+1].score) {
                struct Student tmp = stu[j];
                stu[j] = stu[j+1]; stu[j+1] = tmp;
            }
    for (i = 0; i < 4; i++)
        printf("%-6s %d\\n", stu[i].name, stu[i].score);
    /* 指针 swap */
    int x = 1, y = 2;
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`,
      expect: 'Amy    95\nCindy  88\nTom    78\nBob    60\nx=2 y=1' },
    { t: 'code', id: 'cC_extra', file: 'selftest_extra.c', title: '附加自测：数组求最大最小与平均值', lang: 'c',
      code: `#include <stdio.h>

int main(void)
{
    int a[6] = {12, 45, 7, 88, 30, 61};
    int i, max, min;
    double sum = 0;

    max = min = a[0];            /* 初值取 a[0], 不能取 0 */
    for (i = 0; i < 6; i++) {
        sum += a[i];
        if (a[i] > max) max = a[i];
        if (a[i] < min) min = a[i];
    }
    printf("max=%d min=%d avg=%.2f\\n", max, min, sum / 6);
    return 0;
}`,
      expect: 'max=88 min=7 avg=40.50' },
    { t: 'callout', kind: 'ok', title: '自测通过标准',
      text: '**能独立写出这段代码并编译运行通过**（不查资料也行，提示一下就行），说明本课程 6 块技能全部掌握。做不到也没关系，回头看附录 A 的坑点清单，再把对应章节重刷一遍。' },
    { t: 'h3', text: '十二道自测题' },
    { t: 'p', text: '题目和答案在下方练习区，**点「显示答案」前先自己写一遍**。每题标注了对应的章节号。' },
    { t: 'table',
      head: ['能力模块', '对应章节', '自测题号', '达标标准'],
      rows: [
        ['变量与输入输出', '第 1~2 章', '第 1、2 题', '能写出带格式符的读写代码'],
        ['分支与循环', '第 3~4 章', '第 3、4 题', '能独立写嵌套循环'],
        ['函数与指针', '第 5、7 章', '第 5、6 题', '能用指针改到外部变量'],
        ['数组与字符串', '第 6 章', '第 5 题', '能正确处理 \\0 和长度'],
        ['结构体', '第 8 章', '第 6 题', '能定义并排序结构体数组'],
        ['综合项目', '第 9~10 章', '第 7~9 题', '能独立完成成绩管理系统'],
        ['调试与排错', '第 10 章', '第 10~12 题', '能读懂编译错误并用断点定位']
      ],
      caption: '**建议顺序**：按题目顺序做，每做完一题立刻对照答案。全部做完后看右表定位薄弱模块。' }
  ],
  pitfalls: [
    '**只看不做**：自测的价值在于**闭卷动手写**。看答案觉得"我会了"，合上答案还是写不出来，这是最常见的假会。',
    '**一次做完再对答案**：应该一题一题做、一题一题对、当场改。攒到最后一起对，等于只知道"错了"，却不知道"为什么错"。'
  ],
  vscode: [
    '**建一个自测文件夹**：把自测代码放进去，编译成 `selftest.exe`，每次改完代码重新跑一遍确认输出没变，这就是最简单的回归测试。',
    '**用断点自测**：把自测代码里的 printf 全删掉，改成在关键位置打断点，用「监视」面板核对每个中间值是否和你纸面推算的一致 —— 这就是真实开发的工作方式。'
  ],
  summary: [
    '自测要先闭卷写代码，再看答案。',
    '能独立写出综合自测程序并跑通，说明本课程全部掌握。',
    '答错的题对应哪个章节就回去重看那一节。'
  ]
}
];

/* 暴露到全局, 便于调试与自动化测试 */
if (typeof window !== "undefined") window.CHAPTERS = CHAPTERS;
