/* ============================================================
 * content.js — 《C语言极简开发入门》教案内容数据源
 *
 * 所有代码片段均来自 c-course/code/ 下经 gcc -Wall -Wextra
 * 验证可编译运行的文件，此处逐字复制，与课件 Markdown 同源。
 * ============================================================ */

/* 语法高亮用的 C 语言关键字 */
const C_KEYWORDS = new Set([
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
  'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'inline',
  'int', 'long', 'register', 'restrict', 'return', 'short', 'signed',
  'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned',
  'void', 'volatile', 'while', '_Bool', '_Complex', '_Inline', '_Noreturn',
  '_Static_assert', '_Thread_local'
]);

const C_TYPES = new Set([
  'int', 'char', 'double', 'float', 'long', 'short', 'signed', 'unsigned',
  'void', 'size_t', 'bool', 'FILE'
]);

const C_KEYWORDS_LANG = new Set(['struct', 'union', 'enum', 'typedef', 'sizeof', 'return']);

/* ---------- 页面数据 ---------- */

const CONTENT = [
  {
    no: 1,
    kind: 'cover',
    tag: '封面',
    title: 'C语言极简开发入门',
    goal: '用 18 页把 C 语言开发最常用的 6 块技能串成一条能干活的主线。',
    points: [
      '面向人群：完全没写过代码，但想快速上手做小工具的开发者',
      '只讲 6 块：变量与输入输出、判断、循环、函数、指针与数组、结构体',
      '每页固定 6 段：目标 / 要点 / 代码 / 开发坑点 / VS Code 演示 / 练习',
      '学完能独立写出一个可运行的成绩管理系统',
      '全程不讲数制转换、位运算、递归、链表、文件操作'
    ],
    code: `#include <stdio.h>

int main(void)
{
    printf("Hello, C!\\n");
    printf("welcome to the C course\\n");
    return 0;
}`,
    file: '01_hello.c',
    output: 'Hello, C!\nwelcome to the C course',
    pitfall: 'Windows 下新建文件默认是 `.txt`，gcc 不认识，必须显式改成 `hello.c`，否则报 `No such file or directory`。',
    vscode: '新建文件夹 `c-course`，在 VS Code 打开该文件夹，用 `.c` 后缀新建 `01_hello.c`，粘贴上方代码。',
    exercise: '改掉两行 printf 的文字，输出你自己的名字和一句话。'
  },

  {
    no: 2,
    kind: 'env',
    tag: '环境搭建',
    title: 'VS Code + MinGW-w64：编译与调试环境',
    goal: '把编译器和调试器装好，让每个学员都能在自己机器上跑通第一个 C 程序。',
    points: [
      '装 VS Code → 装 C/C++ 扩展 → 装 MinGW-w64 工具链（gcc / g++ / gdb）',
      'MinGW 装完必须把 `bin` 目录加进 PATH，否则终端里敲 `gcc` 找不到',
      '验证三连：`gcc --version`、`g++ --version`、`gdb --version`，三条都有输出才算装好',
      'VS Code 里用 `tasks.json` 定义编译、用 `launch.json` 定义调试，两者路径必须一致',
      '项目路径不要含中文 —— 含中文时 gcc 会直接编译失败，且报错信息很难懂'
    ],
    code: `#include <stdio.h>

int main(void)
{
    printf("Hello, C!\\n");
    return 0;
}`,
    file: '00_env_check.c',
    output: 'Hello, C!',
    envSteps: [
      {
        n: 1,
        name: '装 VS Code',
        detail: '官网 code.visualstudio.com 下载 Download for Windows，运行 VSCodeUserSetup-x64-*.exe，一路下一步。附加任务页把默认选项全勾上（其中「添加到 PATH」务必保留）。',
        check: '安装后能在开始菜单搜到 VS Code 并正常打开。'
      },
      {
        n: 2,
        name: '装 C/C++ 扩展',
        detail: 'VS Code 里按 Ctrl+Shift+X 打开扩展视图，搜索 C++，安装 Microsoft 官方的 C/C++ 扩展（ID ms-vscode.cpptools）。',
        check: 'Ctrl+Shift+P 输入 C/C++: Edit configurations 能搜到，即安装成功。'
      },
      {
        n: 3,
        name: '装 MinGW-w64 工具链',
        detail: '两条路任选：① 装 MSYS2 后在 MSYS2 终端执行 pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain（选包界面直接回车、确认输 y）；② 直接下载独立版 MinGW-w64 压缩包解压。工具链含 gcc、g++、gdb 三个可执行文件。',
        check: '工具链的 bin 目录里能找到 gcc.exe、g++.exe、gdb.exe 三个文件。MSYS2 路线是 C:\\msys64\\ucrt64\\bin，独立版是你自己的 mingw64\\bin。'
      },
      {
        n: 4,
        name: '配置 PATH',
        detail: 'Win+R 输入「编辑系统环境变量」→ 环境变量 → 用户变量 Path → 新建 → 粘贴工具链 bin 目录，如 C:\\msys64\\ucrt64\\bin（独立版则填你自己的 mingw64\\bin 路径）→ 确定保存。',
        check: '完全关掉 VS Code 和 CMD 再重开（环境变量改动不作用于已开的终端）。'
      },
      {
        n: 5,
        name: '验证三个命令',
        detail: 'Win+R 输入 cmd，依次执行 gcc --version、g++ --version、gdb --version。三条都能打印版本号，说明 PATH 配置成功。',
        check: '若提示不是内部命令，用完整路径试一次：C:\\msys64\\ucrt64\\bin\\gcc.exe --version，能通就是 PATH 没生效。'
      },
      {
        n: 6,
        name: 'tasks.json 与 launch.json',
        detail: 'tasks.json 的 args 改成 `"*.c"` 和 `"-o" "${fileDirname}\\\\program.exe"`，让多文件统一编到一个 exe；launch.json 里 program 指向同一个 program.exe，miDebuggerPath 指向 gdb.exe 全路径。反斜杠在 JSON 里要写两个。',
        check: 'tasks.json 的输出路径与 launch.json 的 program 必须完全一致，否则 F5 报找不到可执行文件。'
      }
    ],
    pitfall: '配完 PATH 必须把 VS Code 和 CMD **完全关掉重开**，环境变量改动不会作用于已经打开的终端 —— 这是「明明配了却说找不到 gcc」的头号原因。',
    vscode: '先在终端跑通 `gcc --version`，再在 VS Code 里新建 .c 文件按 F5。若 F5 提示选调试器，选 `C++ (GDB/LLDB)` 或 `Windows GDB`。',
    exercise: '在自己的电脑上装好环境，然后把 `gcc --version` 和 `gdb --version` 的输出截图发到群里。'
  },

  {
    no: 3,
    kind: 'roadmap',
    tag: '学习路线',
    title: '变量 → 判断 → 循环 → 函数 → 指针/数组 → 结构体 → 项目',
    goal: '知道 6 块知识各自解决什么问题，以及它们的先后依赖关系。',
    points: [
      '变量存数据 → 判断做分支 → 循环做重复 → 函数做复用',
      '指针与数组解决「批量数据」和「改外部变量」两个核心诉求',
      '结构体把多个不同类型的数据打包成一条记录',
      '综合项目把上面 6 块全部用上，一段都不浪费',
      '学法建议：每页代码必须亲手敲一遍，并改一个参数看输出变化'
    ],
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
    file: '02_roadmap.c',
    output: 'pass = 2 of 3',
    pitfall: '数组下标越界不报错但会读写别人的内存，调试时往往表现为「改了 A 却影响 B」，是初学者最耗时的一类玄学 bug。',
    vscode: '打开 `02_roadmap.c`，在 `if (scores[i] >= 60)` 这一行左侧行号栏点一下打上红点断点，按 F5 运行。',
    exercise: '在数组里再加一个 85 分，把数组长度改成 4，观察输出变化。'
  },

  {
    no: 4,
    kind: 'code',
    tag: '变量与输入输出',
    title: '4 种类型 · scanf / printf · 整数除法坑',
    goal: '掌握 4 种基本类型，会读键盘、会打印结果。',
    points: [
      '`int` 整数（4 字节）、`double` 小数（8 字节）、`char` 单字符、`char[]` 字符串',
      '`scanf` 读入要用 `&` 取地址；`printf` 输出不用 `&`',
      '格式符：`%d` 整数、`%f/%lf` 小数、`%c` 字符、`%s` 字符串、`%.2f` 保留两位小数',
      '`char name[20] = "Tom"` 是字符串，`char c = \'A\'` 是单个字符，引号不同',
      '整数除法：`7 / 2 == 3`，小数部分直接丢弃，不四舍五入'
    ],
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
    file: '03_var_io.c',
    output: 'Tom 18 19.90 A\na/b = 3\n(double)a/b = 3.50\nid = 20241001',
    pitfall: '`scanf("%d", id)` 漏写 `&` 会直接段错误崩溃；这是新手第一次运行就崩的头号原因。',
    vscode: '运行 `03_var_io.c`，在 `scanf` 那一行打断点，监视窗口里观察 `id` 从未初始化到被赋值的全过程。',
    exercise: '再加一个 `float` 类型的变量读入并输出，体会它和 `double` 的差别。'
  },

  {
    no: 5,
    kind: 'code',
    tag: '类型转换',
    title: '自动转换 · (double)5/2 · 开发坑点',
    goal: '搞清 int 和 double 混算时到底发生了什么，能主动控制结果类型。',
    points: [
      '自动转换：小数赋给 int 直接截断，`double d = 3.9` 之后 `d` 是 `3.0`',
      '表达式里按运算顺序决定，先除后转换和先转换后除结果完全不同',
      '`(double)5 / 2 == 2.5`，而 `5 / 2 == 2`',
      '`(double)5 / 2.0` 同样正确，只要除号任意一边是浮点',
      '强制转 int 是截断不是四舍五入，`(int)3.9` 得 3，要四舍五入写 `(int)(3.9 + 0.5)`'
    ],
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
    file: '04_cast.c',
    output: 'r1 = 2.000000\nr2 = 2.500000\nr3 = 2.500000\n(int)3.9 = 3\n(int)(3.9 + 0.5) = 4',
    pitfall: '`double avg = sum / n;` 中若 `sum` 和 `n` 都是 int，除法已经先丢掉了小数，赋给 double 只是补了个 `.0`，结果依然错；必须 `(double)sum / n`。',
    vscode: '在 `printf("r1 = %f\\n", r1);` 处打断点，监视窗口对 `r1` 展开查看，会看到 `3` 而非 `3.0`。',
    exercise: '计算 `7 / 2` 和 `7.0 / 2`，用 printf 打印两者，解释为什么不一样。'
  },

  {
    no: 6,
    kind: 'code',
    tag: '判断',
    title: 'if / else if / else · == 与 = 坑',
    goal: '用条件分支让程序按不同情况走不同路径。',
    points: [
      '`if (条件) {A} else if (条件) {B} else {C}`，从上往下判断，命中一个就停',
      '区间判断用 `&&`，或用 `||`，例如 `score >= 60 && score < 80`',
      '`==` 是比较，`=` 是赋值，这是新手第一大坑',
      '多个 `if` 是并列关系，`if...else` 是互斥关系',
      '条件里不能写 `if (x = 5)`，那是把 5 赋给 x，条件恒为真'
    ],
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
    file: '05_if.c',
    output: 'pass\nuse == to compare',
    pitfall: '把 `==` 写成 `=` 后，编译器通常只给一个 warning（suggest parentheses around assignment used as truth value）而不报错，程序静默跑出错误结果；务必开 `-Wall`。',
    vscode: '编译命令加上 `gcc -Wall -Wextra 05_if.c -o 05_if.exe`，观察警告信息提示在哪一行。',
    exercise: '写一个判断闰年的 if 语句，规则是能被 4 整除且不能被 100 整除，或能被 400 整除。'
  },

  {
    no: 7,
    kind: 'code',
    tag: 'switch',
    title: 'case / break / default · break 穿透坑',
    goal: '用 switch 处理「多个离散取值」的分支，比 if 链更清晰。',
    points: [
      '`case` 后面必须是常量，`default` 建议保留做兜底',
      '每个 `case` 结尾要写 `break`，否则会「穿透」到下一个 case 继续执行',
      '穿透有时是特意用的（多个 case 共用一段逻辑），但初学阶段一律先写 `break`',
      'switch 只能比较「是否相等」，范围判断仍要用 if',
      '`case` 内部可以再放 if 循环，switch 和 if 可以嵌套'
    ],
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
    file: '06_switch.c',
    output: 'Wednesday\nThursday',
    pitfall: '漏写 `break` 时程序不报错，`day=3` 会同时打印 Wednesday 和 Thursday；这种 bug 极难靠读代码发现，必须配合 gcc 的 `-Wimplicit-fallthrough` 警告。',
    vscode: '把 `case 3` 的 break 注释掉再跑一次，对比输出差异，并在终端看 `-Wimplicit-fallthrough` 警告。',
    exercise: '用 switch 把 1-7 映射成「周一」到「周日」，其余输出「非法输入」。'
  },

  {
    no: 8,
    kind: 'code',
    tag: '循环',
    title: 'for / while / break / continue',
    goal: '用三行代码替掉重复的十几行，掌握循环的三大要素。',
    points: [
      '`for (初始化; 条件; 更新)` 三段式：i 从哪开始、什么情况下继续、每轮怎么变',
      '`while (条件)` 适合「次数不确定」，循环体内要自己写更新语句',
      '`break` 立刻跳出整个循环，`continue` 只跳过本轮剩余部分',
      '计数从 0 开始还是从 1 开始，取决于你要不要包含边界值',
      '死循环九成是忘了写更新语句，或更新方向写反（`i--` 却要 `i++`）'
    ],
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
    file: '07_loop.c',
    output: '1..100 sum = 5050\ni = 1\ni = 2\ni = 4\ni = 5',
    pitfall: '`continue` 写在 `i++` 之前会让 `i` 永远不变直接死循环；写循环时先确认「每轮一定会推进控制变量」。',
    vscode: '在 `while` 循环内打断点，用 F10 单步执行，观察监视窗口里 `i` 每次加 1 的过程。',
    exercise: '用 for 循环计算 1+2+...+100，并把它改写成 while 版本。'
  },

  {
    no: 9,
    kind: 'code',
    tag: '循环练习',
    title: '求和 · 找最大值 · 打印图形',
    goal: '把循环用熟，形成三个能直接抄进项目的模板。',
    points: [
      '求和模板：先 `sum = 0` 初始化，再遍历累加，最后打印',
      '找最大值：初值取 `a[0]` 而非 0，否则全是负数时会出错',
      '打印图形：外层循环管行数，内层循环管列数，`printf("\\n")` 放在内层循环外',
      '三重嵌套也能用，但初学阶段先把两层写熟',
      '数组遍历的标准写法：`for (i = 0; i < n; i++)`，`n` 用变量表示'
    ],
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
    file: '08_loop_practice.c',
    output: 'sum = 182\nmax = 88\n*\n**\n***',
    pitfall: '找最大值时若把 `max` 初始化为 0，遇到全是负数的数组就会输出 0 这个错误结果；初值必须取数组首元素。',
    vscode: '在嵌套循环的内层 `printf` 打断点，用 F10 逐步观察 `i` 和 `j` 各自怎么变，理解「外层管行、内层管列」。',
    exercise: '把三角形改成打印九九乘法表，外层 i 是 1-9，内层 j 是 1 到 i。'
  },

  {
    no: 10,
    kind: 'code',
    tag: '函数',
    title: '定义 / 调用 / return · 值传递',
    goal: '把一段逻辑封装成可复用的黑盒，并理解参数是「值传递」。',
    points: [
      '定义格式：返回类型 函数名(参数列表) { 函数体 }',
      '`void` 表示无返回值；`return` 返回值并立刻结束函数',
      '一个函数最多一个 `return` 值，需要多个结果就借助指针参数（第 10 页）',
      '值传递：函数拿到的是实参的副本，改形参不影响外面的变量',
      '调用前要有声明或定义；把被调函数写在 `main` 上面最省事'
    ],
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
    file: '09_func.c',
    output: 'add(x, y) = 7\nhello from function\nn still = 10',
    pitfall: '新手最常见的误解是「函数能直接改外面的变量」；`add(n, 1)` 之后 `n` 依然是 10，必须靠指针参数才能改到本体。',
    vscode: '在 `add` 函数第一行打断点，按 F11 进入函数内部，再按 F10 逐行步出，观察 `a`/`b` 的值与外部 `x`/`y` 各不相同。',
    exercise: '写一个 `int max3(int a, int b, int c)` 函数返回三个数中的最大值。'
  },

  {
    no: 11,
    kind: 'code',
    tag: '函数传指针',
    title: 'swap(int *a,int *b) · 数组传参 int a[],int n',
    goal: '用指针参数让函数真正改到外部变量，并学会传数组。',
    points: [
      '传指针：`void swap(int *a, int *b)`，调用时写 `swap(&x, &y)`',
      '函数内用 `*a` 读写本体，`a` 本身只是地址副本',
      '传数组：`void show(int a[], int n)`，调用写 `show(arr, 5)`',
      '数组传参本质是传首地址，`a` 在函数里就是个指针，`sizeof(a)` 不再是数组长度',
      '数组长度必须单独用参数 `n` 传进去，函数内部拿不到'
    ],
    code: `#include <stdio.h>

void swap(int *a, int *b)
{
    int t = *a; *a = *b; *b = t;
}

void show(int a[], int n)
{
    int i;
    for (i = 0; i < n; i++) printf("%d ", a[i]);
}

int main(void) {
    int x = 1, y = 2, arr[5] = {10,20,30,40,50};
    swap(&x, &y);
    show(arr, 5);
    printf("\\nx=%d y=%d\\n", x, y);
    return 0;
}`,
    file: '10_func_ptr.c',
    output: '10 20 30 40 50 \nx=2 y=1',
    pitfall: '数组传参不传长度，函数里循环条件写成 `i < 100` 就会读到数组末尾之外的内存，可能不报错但数据是垃圾。',
    vscode: '在 `swap` 内打断点，监视窗口同时观察 `a`、`*a`、`b`、`*b`，看 `a` 是地址、`*a` 才是值。',
    exercise: '写一个 `void max_min(int a[], int n, int *mx, int *mn)`，用指针参数同时传出最大值和最小值。'
  },

  {
    no: 12,
    kind: 'code',
    tag: '指针基础',
    title: '&取地址 · *解引用 · int *p=&x · 野指针坑',
    goal: '真正理解指针这个「存地址的变量」，并避开野指针。',
    points: [
      '`&x` 取变量 x 的地址；`int *p = &x;` 让 p 指向 x',
      '`*p` 解引用，拿到 p 指向的那个值；`printf("%p", p)` 打印地址',
      '`*p = 99` 等价于 `x = 99`，通过指针改本体',
      '声明 `int *p` 只表示「p 指向 int」，此刻 p 还是垃圾值',
      '未初始化指针 = 野指针，解引用它就是未定义行为，程序可能崩溃或改坏内存'
    ],
    code: `#include <stdio.h>

int main(void)
{
    int x = 10;
    int *p = &x;

    printf("x = %d\\n", x);
    printf("&x = %p, p = %p\\n", (void *)&x, (void *)p);
    printf("*p = %d\\n", *p);

    *p = 99;
    printf("after *p=99, x = %d\\n", x);

    int *q = NULL;
    if (q == NULL) printf("q is NULL, do not deref\\n");
    return 0;
}`,
    file: '11_pointer.c',
    output: 'x = 10\n&x = 0x7ffd4c1a, p = 0x7ffd4c1a   ← 两者完全相同\n*p = 10\nafter *p=99, x = 99\nq is NULL, do not deref',
    outNote: '地址每次运行都不同，重点是 &x 与 p 的值完全一样。',
    pitfall: '`int *p; *p = 5;` 没给 p 赋地址就解引用，编译器不报错但运行时可能崩溃或悄悄改坏别的变量；没用的指针先初始化成 `NULL`。',
    vscode: '在监视窗口分别添加 `x`、`&x`、`p`、`*p` 四个表达式，对比 `&x` 和 `p` 的值是否完全相同。',
    exercise: '声明一个指针指向 `double` 类型的变量，打印它的地址并通过它修改原值。'
  },

  {
    no: 13,
    kind: 'code',
    tag: '指针与数组',
    title: 'a[i] == *(a+i) == p[i] == *(p+i) · 指针加法按基类型走',
    goal: '打通数组下标和指针运算的等价关系，理解指针加法的真实含义。',
    points: [
      '数组名 `a` 本身就是首元素地址，可以直接赋给指针 `int *p = a;`',
      '四种写法完全等价：`a[i]`、`*(a+i)`、`p[i]`、`*(p+i)`',
      '指针加法按基类型走：`p + 1` 不是地址加 1 字节，而是加 `sizeof(int)` = 4 字节',
      '`&a[i]` 和 `a + i` 也是同一个地址',
      '数组名是常量，不能写 `a = a + 1`，但 `p = a + 1` 可以'
    ],
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
    file: '12_ptr_array.c',
    output: '10 10 10 10      ← 四列完全相同\n20 20 20 20\n30 30 30 30\n40 40 40 40\n50 50 50 50\n*(p + 2) = 30\np[2]     = 30\nsizeof(int) = 4 bytes\np + 1 moves 4 bytes',
    pitfall: '用指针遍历数组时循环条件写 `p < a + 5` 没错，但写 `p < a + 5` 之外的「结束标记」判断就会越界；数组没有结束符，长度必须自己带着。',
    vscode: '在 for 循环内打断点，监视窗口同时看 `a`、`p`、`&a[0]`、`a+i`、`p+i`，确认几个地址值始终一致。',
    exercise: '只用指针写法（不用 `a[i]`）把数组所有元素逆序打印出来。'
  },

  {
    no: 14,
    kind: 'code',
    tag: '指针作参数',
    title: 'modify(int *p) · 函数内改外部变量',
    goal: '彻底掌握指针的核心用途——让函数修改外部数据。',
    points: [
      '`void modify(int *p)`，调用 `modify(&x)`，函数内 `*p = 42` 就改到了 x',
      '传 `&x`（地址）才能改本体，传 `x`（值）只能改副本',
      '指针参数还能操作数组元素：`modify(&arr[1])` 等价于 `modify(arr + 1)`',
      '想一次传出多个结果，就准备多个指针参数（第 10 页练习）',
      '解引用时先确认指针非 NULL、确实指向有效内存'
    ],
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
    file: '13_ptr_param.c',
    output: 'before x = 1\nafter  x = 42\narr[1] = 42',
    pitfall: '`modify(&x)` 里若写成 `p = 42` 就是把 42 当地址存进指针，下次解引用必然崩溃；改值永远要写 `*p = 42`。',
    vscode: '在 `modify` 内 `*p = 42` 之前打断点，用 F10 单步跨过这一行，看外部 `x` 立刻从 1 变成 42。',
    exercise: '写 `void swap_ptr(int *a, int *b)`，用指针交换两个变量，验证外部变量确实被交换。'
  },

  {
    no: 15,
    kind: 'code',
    tag: '结构体',
    title: 'struct 定义 · 变量/数组/指针 · p->成员',
    goal: '用结构体把「一个人的多项信息」打包成一个整体。',
    points: [
      '`struct Student { int id; char name[20]; double score; };` 定义结构体类型',
      '三种用法：直接定义变量 `struct Student s1;`、定义数组、定义指针',
      '初始化：`struct Student s1 = {1001, "Tom", 88.5};` 按顺序填',
      '访问成员：变量和数组用点号 `s1.score`，指针用箭头 `p->score`',
      '`p->score` 等价于 `(*p).score`，箭头运算符只是简写'
    ],
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
    file: '14_struct.c',
    output: '1001 Tom 88.5\n1002 Amy 92.0\n1001 Tom 88.5   ← p->score 改的就是 s1\ns1.score = 99.0',
    pitfall: '对结构体指针用点号 `p.score` 编译直接报错，必须写 `p->score`；初学者常把箭头符号打错导致一连串语法错误。',
    vscode: '在 `p->score = 99.0;` 处打断点，监视窗口查看 `p->score` 和 `s1.score`，确认改的是同一块内存。',
    exercise: '定义 `struct Book { char title[30]; double price; };`，创建两本书并用指针方式打印书名和价格。'
  },

  {
    no: 16,
    kind: 'code',
    tag: '结构体数组',
    title: '初始化 · 遍历 · 按成绩排序',
    goal: '用结构体数组管理一批学生，并掌握冒泡排序。',
    points: [
      '初始化：`struct Student stu[3] = {{"Tom",88.0},{"Amy",95.5},{"Bob",72.0}};`',
      '遍历：`for (i = 0; i < n; i++)` 配合 `stu[i].name`、`stu[i].score`',
      '冒泡排序：外层 `i` 管轮数，内层 `j` 比较相邻两个 `stu[j]` 和 `stu[j+1]`',
      '交换时必须整体交换结构体，不能只交换 `score` 字段',
      '内层条件写成 `j < n - 1 - i`，每轮排好的元素不用再比'
    ],
    code: `#include <stdio.h>

struct Student { char name[20]; double score; };

int main(void)
{
    struct Student stu[3] = {{"Tom",88.0},{"Amy",95.5},{"Bob",72.0}};
    int i, j;
    for (i = 0; i < 3; i++) printf("%-6s %.1f\\n", stu[i].name, stu[i].score);
    for (i = 0; i < 2; i++)
        for (j = 0; j < 2 - i; j++)
            if (stu[j].score > stu[j + 1].score) {
                struct Student tmp = stu[j];
                stu[j] = stu[j+1]; stu[j+1] = tmp;
            }
    printf("--- sorted ---\\n");
    for (i = 0; i < 3; i++) printf("%-6s %.1f\\n", stu[i].name, stu[i].score);
    return 0;
}`,
    file: '15_struct_array.c',
    output: 'Tom    88.0\nAmy    95.5\nBob    72.0\n--- sorted ---\nBob    72.0\nTom    88.0\nAmy    95.5',
    pitfall: '只交换 `score` 字段会导致「姓名和分数对不上号」——排序后 Tom 拿着 Bob 的分；结构体必须用临时变量整体搬运。',
    vscode: '在 `struct Student tmp = stu[j];` 处打断点，F10 单步观察三次赋值后 `stu[j]` 和 `stu[j+1]` 内容的整体轮换。',
    exercise: '把排序改成按姓名（字符串）比较，用 `strcmp` 并引入 `string.h`。'
  },

  {
    no: 17,
    kind: 'code',
    tag: '综合项目',
    title: '学生成绩管理系统 · 需求与数据结构',
    goal: '明确项目要做什么、数据怎么存，为动手实现做准备。',
    points: [
      '五个功能：添加学生、打印所有、查找学生、成绩排序、退出系统',
      '数据结构：`struct Student { int id; char name[20]; double score; };`',
      '全局数组 `struct Student stu[MAX]` 加全局计数 `int count`',
      '数组版上限 `MAX = 50`，超出要报错拦住',
      '主菜单用 `while (1)` 常驻循环 + `switch` 分派，构成程序骨架'
    ],
    code: `#include <stdio.h>
#define MAX 50

struct Student { int id; char name[20]; double score; };
struct Student stu[MAX];
int count = 0;

void add_student(void) {
    if (count >= MAX) return;
    scanf("%d %19s %lf", &stu[count].id, stu[count].name, &stu[count].score);
    count++;
}
int main(void) {
    int choice;
    while (1) {
        printf("1.添加 2.退出: "); scanf("%d", &choice);
        if (choice == 1) add_student();
        else if (choice == 2) return 0;
    }
}`,
    file: '16_project.c',
    output: '1.添加 2.退出: ',
    pitfall: '`scanf("%19s", stu[count].name)` 里的 `19` 不能少：`%s` 会一直读到字符串结束符，若名字超过数组长度就会写穿到相邻内存，把 id 和 score 全弄坏。',
    vscode: '新建 `project.c`，把 `16_project.c` 的内容粘进去，在 `while (1)` 处打断点，F5 后每次进菜单都停一次。',
    exercise: '在结构体里加一个 `char gender[10];` 字段，并调整所有初始化语句和 printf。'
  },

  {
    no: 18,
    kind: 'code',
    tag: '综合项目',
    title: '添加/打印/查找/排序/菜单循环',
    goal: '把 5 个功能全部实现，跑通一个完整可用的命令行系统。',
    points: [
      '每个功能拆成一个独立函数：添加、打印、查找、排序，main 只管菜单调度',
      '查找函数返回数组下标，找不到返回 `-1`，用 `if (idx >= 0)` 判断',
      '打印函数先判断 `count == 0` 给提示，否则遍历打印',
      '排序函数把第 15 页的冒泡搬过来，改成按成绩从高到低',
      '`switch` 的 `case 0` 里 `return 0` 退出程序，`default` 处理非法输入'
    ],
    code: `#include <stdio.h>

void add(void) { printf("add\\n"); }
void print_all(void) { printf("print\\n"); }
void find(void) { printf("find\\n"); }
void sort_by_score(void) { printf("sort\\n"); }
int main(void) {
    int c;
    while (1) {
        printf("1.添加 2.打印 3.查找 4.排序 0.退出: ");
        scanf("%d", &c);
        switch (c) {
            case 1: add(); break;
            case 2: print_all(); break;
            case 3: find(); break;
            case 4: sort_by_score(); break;
            case 0: return 0;
        }
    }
}`,
    file: '17_project_menu.c',
    output: '1.添加 2.打印 3.查找 4.排序 0.退出: add\n1.添加 2.打印 3.查找 4.排序 0.退出: print',
    pitfall: '`scanf` 读菜单时若上一个 `scanf("%19s")` 留下了换行符，下一次 `scanf("%d", &c)` 可能读到空值；菜单输入统一用 `%d` 并保证格式串不含多余空格。',
    vscode: '按附录「VS Code 演示脚本清单」第 4 步，在 `switch` 的 `case 3` 处打点断点，输入 3 后 F11 进入 `find` 函数单步。',
    exercise: '在项目里加一个「删除学生」功能：按学号找到后，把后面的元素依次前移覆盖，`count--`。'
  },

  {
    no: 19,
    kind: 'summary',
    tag: '自测与总结',
    title: '自测与总结 · 可跳过内容清单',
    goal: '用一段自测代码验证 6 块知识是否真的串起来了，并明确哪些可以先不学。',
    points: [
      '自测代码只用「结构体数组 + 冒泡排序 + 指针 swap」，覆盖第 10、14、15 页',
      '跑通自测即代表本课程 6 块内容全部掌握',
      '可跳过清单：数制转换与原码反码补码、位运算、递归、指针的指针、函数指针、链表、文件操作',
      '这些内容本课程完全不涉及，后续需要时再单独学，不影响写出成绩管理系统',
      '课后方向：动态内存分配（malloc）、文件读写、结构体嵌套'
    ],
    code: `#include <stdio.h>

int main(void)
{
    int a[5] = {5, 3, 9, 1, 7};
    int i, j;
    for (i = 0; i < 4; i++)
        for (j = 0; j < 4 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j+1]; a[j+1] = t;
            }
    for (i = 0; i < 5; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`,
    file: '18_selftest.c',
    output: '1 3 5 7 9',
    pitfall: '自测代码报「数组越界」多半是内层循环条件写成了 `j < 4 - i` 却在 `i` 的循环里改了 `j`；记住 `j` 每轮外层都要从 0 重新开始。',
    vscode: '对照附录第 5 步「监视窗口」，在自测代码里给 `a`、`i`、`j` 都加上监视，确认排序过程中的值变化符合预期。',
    exercise: '把附录中的自测代码（结构体数组冒泡排序 + swap 指针）完整敲一遍并跑通。'
  }
];

/* ---------- 附录 ---------- */

const APPENDIX = {
  project: {
    title: '学生成绩管理系统完整可运行代码（数组版，120 行）',
    goal: '一段可直接编译运行的完整实现，涵盖添加、打印、查找、排序、退出五个功能。',
    file: 'final_project.c',
    compile: 'gcc -std=c11 -Wall final_project.c -o final_project.exe',
    code: `#include <stdio.h>

/* 综合项目: 学生成绩管理系统 (数组版) */
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

int main(void)
{
    int choice;
    int id;
    int idx;

    while (1) {
        printf("\\n===== 学生成绩管理系统 =====\\n");
        printf("1.添加学生  2.打印所有  3.查找学生\\n");
        printf("4.成绩排序  0.退出系统\\n");
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
            case 0:
                printf("系统退出, 再见!\\n");
                return 0;
            default:
                printf("输入无效, 请重新选择\\n");
        }
    }
}`
  },

  selftest: {
    title: '自测代码（结构体数组冒泡排序 + swap 指针，28 行）',
    goal: '一段代码同时验收结构体数组、冒泡排序与指针传参三块技能。',
    file: 'final_selftest.c',
    compile: 'gcc -std=c11 -Wall final_selftest.c -o final_selftest.exe',
    code: `#include <stdio.h>

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
    output: 'Amy    95\nCindy  88\nTom    78\nBob    60\nx=2 y=1'
  },

  vscode: {
    title: 'VS Code 演示脚本清单（6 步）',
    goal: '照着念就能把学员带进 VS Code，把「装插件—写代码—调代码」完整走一遍。',
    steps: [
      {
        n: 1,
        name: '安装 C/C++ 扩展',
        detail: '左侧活动栏点扩展图标（Ctrl+Shift+X），搜索 `C/C++`，找到 Microsoft 官方扩展（ID `ms-vscode.cpptools`）点安装。同栏可再装 Code Runner 与中文语言包。安装完提示重启窗口就重启。',
        check: '验证：Ctrl+Shift+P 输入 `C/C++: Edit configurations`，能搜到即安装成功。'
      },
      {
        n: 2,
        name: '新建 .c 文件',
        detail: '文件 → 打开文件夹，选中专门的工作目录 `c-course`。资源管理器面板右键 → 新建文件，命名 `hello.c`（必须是 `.c`，`.txt` gcc 不认）。',
        check: '若列表没显示 `.c` 后缀：资源管理器右上角 `...` → 设置 → 勾选「文件扩展名」。'
      },
      {
        n: 3,
        name: 'gcc 编译运行',
        detail: '按 Ctrl+` 打开集成终端，终端自动定位到当前目录。输入 `gcc -Wall -Wextra -std=c11 hello.c -o hello.exe` 回车，无任何输出即编译成功。再输入 `./hello.exe` 运行。',
        check: '若提示找不到编译器，说明 gcc 没在 PATH 里，需安装 MinGW-w64 并把其 bin 目录加入环境变量。'
      },
      {
        n: 4,
        name: 'F5 断点调试',
        detail: '在编辑器左侧行号旁边点击出现红点即为断点，按 F5 启动调试，程序停在第一个断点。F10 单步跳过、F11 单步进入函数、Shift+F11 跳出、F9 取消断点、Shift+F5 停止。',
        check: '首次按 F5 会提示选调试器，选 `C++ (GDB/LLDB)` 或 `Windows GDB`（需装 gdb）。'
      },
      {
        n: 5,
        name: '监视窗口观察 &x、p、*p、stu[0].score',
        detail: '调试停在断点后，打开底部面板「监视」标签，点「添加表达式」逐个输入并回车：`x` 看值、`&x` 看地址、`p` 看指针存的地址、`*p` 看指向的值、`stu[0].score` 看结构体数组成员。',
        check: '每按一次 F10，监视值实时刷新；`p` 始终等于 `&x`，`*p` 始终等于 `x`。右键监视项 →「在内存视图中显示」可看内存原值。'
      },
      {
        n: 6,
        name: '完整项目联调',
        detail: '把附录 1 的项目代码存为 `project.c`，在 `switch (choice)` 的 `case 3:` 处打断点。F5 启动，输入 3 回车停住，F11 进入 `find_by_id` 单步观察 `i` 递增与 `stu[i].id` 比较。',
        check: '关闭全部断点（Ctrl+Shift+F5）后完整跑一遍：添加两名学生 → 打印 → 查找 → 排序 → 退出，确认排序后分数从高到低。'
      }
    ]
  }
};
