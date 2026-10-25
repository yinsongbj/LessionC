/* ============================================================
 * exercises.js — 《C语言开发视角全面教程》练习题库
 *
 * 每题结构：
 *   q    题干（支持 `反引号` 行内代码）
 *   a    参考答案要点说明
 *   code 参考代码（可选，会被语法高亮）
 *
 * 题目按章节 id 归类，app.js 渲染时自动挂到对应章节末尾。
 * ============================================================ */

const EXERCISES = {

/* ---------------- 第 0 章 ---------------- */
'chapter-0': [
  {
    q: '在 VS Code 里新建一个 C 文件，文件名写成 `hello.txt`，然后用 `gcc hello.txt -o hello` 编译，会出现什么提示？为什么？',
    a: '会报 `gcc: error: hello.txt: No such file or directory` 或 `linker input file unused because linking not done`，因为 **gcc 根据文件后缀判断文件类型**，`.txt` 不被识别为 C 源文件。正确做法是新建文件时在「文件类型」里选 C 源文件，或把后缀手动改成 `.c`。'
  },
  {
    q: '把第 0 章的 `02_roadmap.c` 改一改：把成绩数组换成 `{59, 60, 61}`，预测 `pass` 的输出，再实际运行验证。',
    a: '`pass = 2 of 3`。因为判断条件是 `scores[i] >= 60`，60 和 61 满足，59 不满足。**先预测再运行**，这是养成调试直觉的关键习惯。'
  },
  {
    q: '在终端敲 `gcc --version` 提示"不是内部或外部命令"，该怎么排查？',
    a: '说明 gcc 没装或**没加到 PATH 环境变量**。先确认是否安装成功；MinGW-w64 安装时需勾选 "Add to PATH"，或手动把 `C:\\mingw64\\bin` 加进系统环境变量 Path，然后**重开终端**（环境变量改动对已打开的窗口不生效）。'
  }
],

/* ---------------- 第 1 章 ---------------- */
'chapter-1': [
  {
    q: '把 `int a = 7, b = 2;` 改成 `double a = 7, b = 2;`，`printf("%d\\n", a / b)` 的输出会变成什么？为什么？',
    a: '会输出 `3` 但**行为不对** —— 用 `%d` 打印 double 是类型不匹配，行为未定义（通常仍打印整数部分 3）。改成 `double` 后 `a / b` = 3.5，应该用 `printf("%f\\n", a / b)` 或 `%.2f`。**格式符必须和类型严格对应**。'
  },
  {
    q: '写一个程序：读入学生的姓名（字符串）和三门课成绩（double），求平均分并输出，保留两位小数。注意姓名里有空格的情况。',
    a: '姓名含空格要用 `fgets(buf, 20, stdin)` 读取，或用 `scanf("%19[^\\n]", buf)` 读取整行。关键点：**读字符串一定要写宽度限制**。',
    code: `#include <stdio.h>

int main(void)
{
    char name[20];
    double s1, s2, s3;

    printf("请输入姓名: ");
    scanf("%19[^\\n]", name);
    printf("请输入三门成绩: ");
    scanf("%lf %lf %lf", &s1, &s2, &s3);

    printf("%s 的平均分 = %.2f\\n", name, (s1 + s2 + s3) / 3);
    return 0;
}`
  },
  {
    q: '为什么 `char c = \'A\';` 和 `char c = "A";` 只有一个能编译通过？`\'\\0\'` 的值是多少？',
    a: '`\'A\'` 是**字符字面量**（单引号），类型是 int，赋给 char 没问题；`"A"` 是**字符串字面量**（双引号），类型是 `char[2]`，不能赋给单个 char，会报 "initialization of ‘char’ from ‘char *’ makes integer from pointer" 错误。`\'\\0\'` 的值是 **0**，用作字符串结束符。'
  }
],

/* ---------------- 第 2 章 ---------------- */
'chapter-2': [
  {
    q: '不运行代码，写出下面表达式的结果：`7 / 2`、`7 / 2.0`、`(int)7 / 2`、`(double)7 / 2`、`7 % 2`。',
    a: '依次是：`3`（整数除法截断）、`3.5`（有 double 参与）、`3`（强转回 int 后再除）、`3.5`、`1`（余数）。**只看表达式里有没有 double 或强制转换**就能判断。'
  },
  {
    q: '求 1 到 100 的整数和，为什么不能写 `float sum = 0; for(...) sum += i;` 然后直接用 sum？会带来什么问题？',
    a: '会有**浮点精度误差**。float 只有约 7 位有效数字，累加 100 次后结果可能是 5049.9995 之类。正确做法是**累加过程用 int**，最后再转 double 除以次数；或者用 double 累加（精度足够）。',
    code: `#include <stdio.h>

int main(void)
{
    int i, sum = 0;          /* 累加用 int */
    for (i = 1; i <= 100; i++) sum += i;
    printf("sum = %d, avg = %.2f\\n", sum, (double)sum / 100);
    return 0;
}`
  },
  {
    q: '`int i = 5; int a = i++; int b = ++i;` 执行后 i、a、b 各是多少？',
    a: '`i = 7`，`a = 5`，`b = 7`。`i++` 是"先用 5 再加"，所以 a 拿到 5、i 变 6；`++i` 是"先加再用"，i 变 7、b 拿到 7。**不要在同一个表达式里对同一个变量混用 ++ 和 --**，那是未定义行为。'
  }
],

/* ---------------- 第 3 章 ---------------- */
'chapter-3': [
  {
    q: '下面这段代码为什么永远不打印 "yes"？怎么改？',
    a: '`if (x = 1)` 是**赋值**，把 1 赋给 x，表达式值是 1（真），所以条件成立；但题目说"永远不打印"说明 x 初始为 0，此时 `x = 0` 表达式值 0（假），条件不成立。改成 `if (x == 1)` 才是比较。**开 `-Wall` 编译器会直接警告**。',
    code: `#include <stdio.h>

int main(void)
{
    int x = 0;
    if (x = 1) {
        printf("yes\\n");   /* 改这里: if (x == 1) */
    } else {
        printf("no\\n");
    }
    return 0;
}`
  },
  {
    q: '用 switch 实现：输入 1~7 输出对应英文星期名，其余输出 "invalid"。要求 case 合并处理 6 和 7（周末）。',
    a: '**case 合并**就是故意不写 break，让多个 case 落到同一段代码。写法：`case 6: case 7: printf("weekend\\n"); break;`',
    code: `#include <stdio.h>

int main(void)
{
    int d = 6;
    switch (d) {
        case 1: printf("Monday\\n");   break;
        case 2: printf("Tuesday\\n");  break;
        case 3: printf("Wednesday\\n"); break;
        case 4: printf("Thursday\\n");  break;
        case 5: printf("Friday\\n");    break;
        case 6:
        case 7: printf("weekend\\n");   break;
        default: printf("invalid\\n");
    }
    return 0;
}`
  },
  {
    q: '什么时候用 switch 比 if 更好？给两个具体场景。',
    a: '**判断一个值等于若干离散固定值**时用 switch，比如菜单选项（1.添加 2.打印 3.退出）、星期几、状态码（0成功/1失败/2超时）。反过来，**判断范围或复杂布尔组合**（`x >= 60 && y < 100`）必须用 if，switch 做不到。'
  }
],

/* ---------------- 第 4 章 ---------------- */
'chapter-4': [
  {
    q: '用 for 循环打印九九乘法表的前 6 行。',
    a: '外层 `i` 管行，内层 `j` 管列，且**内层循环的次数依赖外层变量 i**。这是循环嵌套的核心写法。',
    code: `#include <stdio.h>

int main(void)
{
    int i, j;
    for (i = 1; i <= 6; i++) {
        for (j = 1; j <= i; j++) {
            printf("%d*%d=%d  ", j, i, j * i);
        }
        printf("\\n");
    }
    return 0;
}`
  },
  {
    q: '找出数组中的最大和最小值，注意数组可能全是负数。',
    a: '**max 初值必须取 a[0] 而不是 0**，否则全负数数组时结果错误。min 同理。循环从 i = 1 开始，因为 a[0] 已经作为初值参与比较了。',
    code: `#include <stdio.h>

int main(void)
{
    int a[5] = {-5, -3, -9, -1, -7};
    int i, max = a[0], min = a[0];

    for (i = 1; i < 5; i++) {
        if (a[i] > max) max = a[i];
        if (a[i] < min) min = a[i];
    }
    printf("max=%d min=%d\\n", max, min);
    return 0;
}`
  },
  {
    q: '下面这段代码会死循环，为什么？',
    a: '`continue` 直接跳到 while 的条件判断，**跳过了 `i++`**，i 永远是 0，条件 `i < 5` 永远成立。修法：把 `i++` 移到 continue 之前，或者改用 `for` 循环（`i++` 在更新位置，continue 不会跳过它）。',
    code: `#include <stdio.h>

int main(void)
{
    int i = 0;
    while (i < 5) {
        if (i == 2) { i++; continue; }   /* i++ 在 continue 之前, 修好了 */
        printf("i=%d\\n", i);
        i++;
    }
    return 0;
}`
  }
],

/* ---------------- 第 5 章 ---------------- */
'chapter-5': [
  {
    q: '写一个函数 `void swap(int *a, int *b)` 交换两个 int 的值，并在 main 里验证。',
    a: '注意是**传指针**才能改到本体。如果传值 `void swap(int a, int b)`，函数里改的是副本，外面不会变。',
    code: `#include <stdio.h>

void swap(int *a, int *b)
{
    int t = *a; *a = *b; *b = t;
}

int main(void)
{
    int x = 1, y = 2;
    swap(&x, &y);
    printf("x=%d y=%d\\n", x, y);
    return 0;
}`
  },
  {
    q: '写一个函数 `int max3(int a, int b, int c)` 返回三个数中的最大值，分别用 if 和三元运算符两种写法。',
    a: '三元运算符版可以写成嵌套形式。函数返回类型是 int，所以每条执行路径都要 return 值，否则 gcc 会警告 `control reaches end of non-void function`。',
    code: `#include <stdio.h>

int max3_if(int a, int b, int c)
{
    int m = a;
    if (b > m) m = b;
    if (c > m) m = c;
    return m;
}

int max3_ternary(int a, int b, int c)
{
    int m = (a > b) ? a : b;
    return (m > c) ? m : c;
}

int main(void)
{
    printf("%d %d\\n", max3_if(3, 9, 5), max3_ternary(3, 9, 5));
    return 0;
}`
  },
  {
    q: '为什么 `void show(int arr[])` 这样的函数必须额外传一个长度参数 n？',
    a: '因为**数组传参时退化成指针**，函数收到的只是首元素地址，**丢失了长度信息**。此时 `sizeof(arr)` 得到的是指针大小（8 字节）而不是数组总字节数。解决办法就是像 `strlen` 那样约定一个长度参数一起传。'
  }
],

/* ---------------- 第 6 章 ---------------- */
'chapter-6': [
  {
    q: '写一个程序：读入一个字符串，统计其中字母的数量并逆序打印。注意不能改动原字符串。',
    a: '两种做法：① 用 `strlen` 拿长度后从后往前打印；② 复制一份到新数组再原地逆序（用指针交换首尾字符）。**不能直接改原数组**，因为那样就破坏了输入。',
    code: `#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[100];
    int i, len, letters = 0;

    scanf("%99s", s);
    len = (int)strlen(s);

    for (i = 0; i < len; i++) {
        if ((s[i] >= 'a' && s[i] <= 'z') ||
            (s[i] >= 'A' && s[i] <= 'Z')) {
            letters++;
        }
    }
    printf("length=%d letters=%d\\n", len, letters);

    for (i = len - 1; i >= 0; i--) printf("%c", s[i]);
    printf("\\n");
    return 0;
}`
  },
  {
    q: '定义 `int a[3][4]` 和 `int b[12]`，哪个更大？用 sizeof 打印出来看看。',
    a: '**一样大，都是 48 字节**。二维数组本质上就是连续的一维数组，只是编译器帮你在 `a[i][j]` 里自动换算了行偏移。`sizeof(a)` = 48，`sizeof(a[0])` = 16（4 个 int）。'
  },
  {
    q: '用 strcmp 写一个函数判断两个字符串是否相同，为什么不能写 `if (strcmp(a, b) == 1)`？',
    a: 'strcmp **只保证相等时返回 0**，不相等时返回**任意非 0 值**（可能是 1，也可能是 -1，取决于实现）。所以判断相等必须用 `== 0`，判断大小用 `< 0` / `> 0`。写 `== 1` 会在某些实现上失效。'
  }
],

/* ---------------- 第 7 章 ---------------- */
'chapter-7': [
  {
    q: '写一个函数 `void modify(int *p)` 把传入的值改成 42，分别用 `modify(&x)` 和 `modify(arr)` 调用，观察区别。',
    a: '`modify(&x)` 传的是 x 的地址，改的是 x 本体；`modify(arr)` 传的是数组首地址，函数里 `*p = 42` 等价于 `arr[0] = 42`。**数组名本身就是首元素地址**，所以不需要写 `&arr`。',
    code: `#include <stdio.h>

void modify(int *p) { *p = 42; }

int main(void)
{
    int x = 1;
    int arr[3] = {1, 2, 3};

    modify(&x);
    modify(arr);
    printf("x=%d arr[0]=%d\\n", x, arr[0]);
    return 0;
}`
  },
  {
    q: '给定 `int a[5] = {1,2,3,4,5};`，用指针（不用下标）把它全部翻倍。',
    a: '指针算术遍历数组：`for (p = a; p < a + 5; p++) *p *= 2;`。这展示了数组下标就是指针算术的本质。',
    code: `#include <stdio.h>

int main(void)
{
    int a[5] = {1, 2, 3, 4, 5};
    int *p, i;

    for (p = a; p < a + 5; p++) {
        *p *= 2;
    }
    for (i = 0; i < 5; i++) printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`
  },
  {
    q: '下面的代码有什么问题？',
    a: '`int *p;` 是**野指针**，里面是垃圾值，`*p = 10` 会崩溃或破坏内存。正确做法：声明即初始化 `int *p = NULL;`，使用前判空。另外 `free` 之后必须把指针置 NULL，否则就是悬空指针。',
    code: `/* 有问题的代码 */
int *p;
*p = 10;          /* 野指针解引用, 崩溃 */

/* 正确写法 */
int *q = NULL;
if (q != NULL) {
    *q = 10;
}`
  }
],

/* ---------------- 第 8 章 ---------------- */
'chapter-8': [
  {
    q: '定义 `typedef struct { int id; char name[20]; double score; } Student;`，用结构体数组存 3 个学生，并按成绩从高到低排序。',
    a: '**排序必须用临时结构体变量整体交换**，只交换 score 会让姓名和分数错位。这是本章最容易踩的坑。',
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
    int i, j;

    for (i = 0; i < 2; i++)
        for (j = 0; j < 2 - i; j++)
            if (stu[j].score < stu[j + 1].score) {
                Student tmp = stu[j];
                stu[j] = stu[j + 1];
                stu[j + 1] = tmp;
            }

    for (i = 0; i < 3; i++)
        printf("%d %-6s %.1f\\n", stu[i].id, stu[i].name, stu[i].score);
    return 0;
}`
  },
  {
    q: '写一个函数 `void update(Student *p, double newScore)` 修改某个学生的成绩，并用指针调用它。',
    a: '用**指针参数 + `->`** 访问成员。函数内部改的是调用方的数据本体，调用后原变量的值会变。',
    code: `#include <stdio.h>

typedef struct {
    int id;
    char name[20];
    double score;
} Student;

void update(Student *p, double newScore)
{
    p->score = newScore;
}

int main(void)
{
    Student s = {1001, "Tom", 88.0};
    update(&s, 99.5);
    printf("%s %.1f\\n", s.name, s.score);
    return 0;
}`
  },
  {
    q: '为什么结构体数组排序时不能只交换 score 字段？写一段错误代码说明后果。',
    a: '只交换 score 会让**姓名和分数对不上号** —— 排完序 Tom 拿着 Amy 的分。这类 bug 不崩溃、不报错，最难查。正确做法是用 `Student tmp` 整体搬运。'
  }
],

/* ---------------- 第 9 章 ---------------- */
'chapter-9': [
  {
    q: '给项目加一个「删除学生」功能：按学号找到后删除该条记录。',
    a: '找到下标后，把**后面所有元素依次前移一格**覆盖掉被删的位置，最后 `count--`。注意前移的顺序是从前往后，否则会覆盖掉还没搬的数据。',
    code: `void delete_student(void)
{
    int id, idx, i;
    printf("请输入要删除的学号: ");
    scanf("%d", &id);

    idx = find_by_id(id);
    if (idx < 0) {
        printf("未找到该学号\\n");
        return;
    }
    /* 依次前移覆盖 */
    for (i = idx; i < count - 1; i++) {
        stu[i] = stu[i + 1];
    }
    count--;
    printf("删除成功\\n");
}`
  },
  {
    q: '给项目加一个「统计」功能：输出平均分、最高分、最低分和及格人数。',
    a: '用循环累加求和、遍历比较求最大最小。注意**求平均分要写 `(double)sum / count`**，否则整数除法会截断。另外要处理 count == 0 的情况（除以零）。',
    code: `void statistics(void)
{
    int i, pass = 0;
    double sum = 0, max, min;

    if (count == 0) {
        printf("暂无学生数据\\n");
        return;
    }
    max = min = stu[0].score;
    for (i = 0; i < count; i++) {
        sum += stu[i].score;
        if (stu[i].score > max) max = stu[i].score;
        if (stu[i].score < min) min = stu[i].score;
        if (stu[i].score >= 60) pass++;
    }
    printf("平均分=%.2f 最高分=%.1f 最低分=%.1f 及格=%d/%d\\n",
           sum / count, max, min, pass, count);
}`
  },
  {
    q: '项目里 `find_by_id` 找不到时返回 -1。为什么不能返回 0？',
    a: '因为 **0 是合法下标**（数组第一个元素）。返回 0 会让"没找到"和"找到第一个"混淆，结果是查不到却显示了别人的数据。C 里的通用约定是：**找不到返回 -1**，因为下标不可能是负数。'
  }
],

/* ---------------- 第 10 章 ---------------- */
'chapter-10': [
  {
    q: '写一个程序故意触发 `undefined reference to \'foo\'` 错误：foo 在 foo.c 里定义了，但编译时没带上 foo.c。',
    a: '`gcc main.c -o app` 编译能通过（main.c 里只有声明），链接阶段找不到 foo 的实现，报 `undefined reference to \'foo\'`。解法：`gcc main.c foo.c -o app`。**这是链接错误，不是编译错误**，很多人会搞混。'
  },
  {
    q: '用条件断点找出数组里第一个大于 100 的元素位置（数组已知，需要在遍历时停下）。',
    a: '在循环体内右键 → 编辑条件 → 输入 `arr[i] > 100`，程序只在**首次满足条件时**停下，比逐次 F10 快得多。这就是条件断点的价值：跳过大量无效迭代。'
  },
  {
    q: '为什么 `void f() { }` 缺少 return 会有警告，而 `void f() { return; }` 没有？',
    a: '`void` 函数本身就不需要返回值。但 gcc 会检查**所有执行路径**：`void f() { }` 缺少结尾的 return 属于"可能从函数末尾掉出"，会给出 `warning: control reaches end of non-void function`（某些版本对 void 也提示）。补上 `return;` 或让所有分支都有 return 即可消除。'
  }
],

/* ---------------- 附录 A ---------------- */
'appendix-a': [
  {
    q: '这段代码有什么问题？应该改成什么样？',
    a: '`scanf("%s", buf)` 没有宽度限制，buf 只有 5 字节却可能写入更长的串，**写穿内存**。正确写法是 `scanf("%4s", buf)`，数字 = 数组长度 - 1。',
    code: `/* 危险 */
char buf[5];
scanf("%s", buf);

/* 安全 */
char buf2[5];
scanf("%4s", buf2);   /* 4 = 5 - 1 */`
  },
  {
    q: '为什么 `if (x = 0)` 不会进入分支，而 `if (x == 0)` 会？',
    a: '`x = 0` 是**赋值表达式**，值为 0，在 C 里代表假；`x == 0` 才是比较，判断 x 是否等于 0。gcc 会给前者一条 `-Wparentheses` 警告。'
  },
  {
    q: '找出一个数组里所有重复的元素，怎么写？',
    a: '**两层循环**逐个比较即可：`for (i=0;i<n;i++) for (j=i+1;j<n;j++) if (a[i]==a[j]) printf("重复: %d\\n", a[i]);`。这就是需要嵌套循环的典型场景。'
  }
],

/* ---------------- 附录 B ---------------- */
'appendix-b': [
  {
    q: '工作中遇到一个需求需要把数据存到磁盘，下次启动自动读取。这是本课程讲的哪个知识点？该去哪儿学？',
    a: '**文件操作**（`fopen`/`fwrite`/`fread`）。本课程不展开，但按"用到再查"的原则，标准库函数查一下文档就能用。注意数组版项目里只需要在 `add_student()` 后加一次写文件、`main()` 开头加一次读文件。'
  },
  {
    q: '为什么本课程不教递归和链表？等真的需要了，从哪个开始补？',
    a: '因为**循环和数组已经能解决绝大多数场景**，现在学容易学了忘。真正需要它们的信号是：处理树形结构、需要频繁在中间插入删除、或者题目本身要求递归。补的话建议顺序是 **文件操作 → 动态内存(malloc/free) → 链表 → 递归**，有了动态内存基础，链表就顺理成章。'
  },
  {
    q: '本课程讲过的哪些知识点，其实已经悄悄用到了那些"被跳过"的内容？',
    a: '有几处：① **数组传参退化成指针**，这背后就是指针的底层机制；② `sizeof` 用法涉及内存布局；③ **结构体整体赋值**（`tmp = stu[j]`）本质是一次内存拷贝。所以"跳过"不等于"完全无关"，只是不展开讲。'
  }
],

/* ---------------- 附录 C ---------------- */
'appendix-c': [
  {
    q: '不查资料，写出：① 冒泡排序（int 数组升序）；② 用指针遍历数组；③ 结构体按字段排序。三段代码能写出来，说明本课程掌握了。',
    a: '三段代码分别对应第 4 章（循环嵌套）、第 7 章（指针算术）、第 8 章（结构体整体交换）。**关键不是默写**，而是理解每段代码为什么这么写：冒泡的内外层边界 `j < n - 1 - i`、指针遍历的 `p++` 等价于 `p += 1`（跳过一个 int）、结构体必须整体交换。'
  },
  {
    q: '如果只给你一个 `int *p` 和一个 `int x`，分别用三种方式把 x 的值改成 100。',
    a: '① `x = 100;`（直接改）；② `*p = 100;`（通过指针解引用改）；③ 用一个 `void set(int *q) { *q = 100; }` 函数，传 `set(p)`。三种方式最终都改到同一块内存 —— 这正是指针的意义。'
  },
  {
    q: '自测没通过的部分怎么补？给一个可执行的补课计划。',
    a: '**按章节回溯**：哪道题错就回去重看对应小节 → 打开对应章节的代码块自己敲一遍 → 跑通并改一个参数看输出变化 → 做该章的练习题。附录 A 的坑点清单可以当 checklist 逐条自查。**不要重看视频式讲解，一定要动手写**。'
  }
]

};

/* 暴露到全局, 便于调试与自动化测试 */
if (typeof window !== "undefined") window.EXERCISES = EXERCISES;
