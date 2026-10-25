/* ============================================================
 * outputs.js — 由 tools/verify.js 用 gcc 实测生成, 请勿手改
 * 每个 key 对应 chapters.js 中一个代码块的 id
 * ============================================================ */

const OUTPUTS = {
  "c0_roadmap": "pass = 2 of 3",
  "c0_hello": "Hello, C!\nwelcome to the C course",
  "c1_vars": "Tom 18 19.90 A\na/b = 3\n(double)a/b = 3.50\nid = 1001",
  "c1_printf": "42\n   42|\n42   |\n3.14\nx\n%",
  "c1_scanf": "请输入 学号 成绩 等级: id=1001, score=88.5, grade=A",
  "c1_const": "count = 1, limit = 100",
  "c2_prec": "14\n20\n1\n1",
  "c2_cast": "r1 = 2.000000\nr2 = 2.500000\nr3 = 2.500000\n(int)3.9 = 3\n(int)(3.9 + 0.5) = 4",
  "c2_incdec": "i=7 a=5 b=7\ni++ 的返回值是 5\n此刻 i = 6\n++i 的返回值是 7\n此刻 i = 7",
  "c2_ternary": "score = 85, grade = B\nmax = 85",
  "c3_if": "pass\nuse == to compare",
  "c3_switch": "Wednesday\nThursday",
  "c3_switch2": "工作日, 要上班",
  "c3_ternary": "if     : 1\n三元   : 1\n结果   : 及格",
  "c4_for": "1..100 sum = 5050\ni = 1\ni = 2\ni = 4\ni = 5",
  "c4_practice": "sum = 182\nmax = 88\n*\n**\n***",
  "c4_dowhile": "第 1 轮\n第 2 轮\n第 3 轮\n共执行 3 轮",
  "c5_basic": "add(x, y) = 7\nhello from function\nn still = 10",
  "c5_proto": "add = 7\n10 20 30 40 50 \nx=2 y=1",
  "c5_scope": "calls = 1\ncalls = 2\nglobal=1 local=100",
  "c6_1d": "a[0] = 10\na[1] = 20\na[2] = 30\na[3] = 40\na[4] = 50\nb[4] = 0 (未写的自动补 0)\nc[3] = 0 (写 0 就是全 0)\nsizeof(a) = 20 字节",
  "c6_2d": "1\t2\t3\t4\t\n5\t6\t7\t8\t\n9\t10\t11\t12\t\n行数=3 列数=4",
  "c6_str": "strlen(name) = 3\nsizeof(buf) = 10 字节\nname[0] = 84 ('T')\nname[1] = 111 ('o')\nname[2] = 109 ('m')\nname[3] = 0 ('?')\nstrcpy 后 b = Tom\nstrcat 后 b = Tom & Jerry (len=11)\nstrcmp(a, a) == 0 ? 1  (相等返回 0)\nstrcmp(a, b) == 0 ? 0  (不相等返回非 0)",
  "c6_input": "请输入姓名: 你好, Tom!",
  "c7_basic": "x = 10\n&x = 0000009b839ffdec, p = 0000009b839ffdec\n&x == p ? 1  (1 表示 p 里存的正是 x 的地址)\n*p = 10\nafter *p=99, x = 99\nq is NULL, do not deref",
  "c7_array": "10 10 10 10\n20 20 20 20\n30 30 30 30\n40 40 40 40\n50 50 50 50\n*(p + 2) = 30\np[2]     = 30\nsizeof(int) = 4 bytes\np + 1 moves 4 bytes",
  "c7_arith": "a   = 10\np+1 = 20  (跳过 1 个 int)\np+3 = 40\n字节偏移: p->p+1 = 4 字节\n字节偏移: c->c+1 = 1 字节\np+1 == &a[1] ? 1\na == &a[0] ? 1",
  "c7_param": "before x = 1\nafter  x = 42\narr[1] = 42",
  "c8_basic": "1001 Tom 88.5\n1002 Amy 92.0\n1001 Tom 88.5\ns1.score = 99.0",
  "c8_typedef": "1001 Tom    88.0\n1002 Amy    95.5\n1003 Bob    72.0",
  "c8_sort": "Tom    88.0\nAmy    95.5\nBob    72.0\n--- sorted ---\nAmy    95.5\nTom    88.0\nBob    72.0",
  "c8_passptr": "value: id=1001 name=Tom\nptr  : id=1001 name=Tom",
  "c9_full": "\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入 学号 姓名 成绩: 添加成功\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入 学号 姓名 成绩: 添加成功\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 学号\t姓名\t成绩\n1001\tTom\t88.5\n1002\tAmy\t95.0\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入要查找的学号: 查找结果:\n1002\tAmy\t95.0\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 按成绩从高到低排序完成:\n学号\t姓名\t成绩\n1002\tAmy\t95.0\n1001\tTom\t88.5\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 请输入要修改的学号: 当前成绩: 88.5, 请输入新成绩: 修改成功\n\n===== 学生成绩管理系统 =====\n1.添加学生  2.打印所有  3.查找学生\n4.成绩排序  5.修改成绩  0.退出系统\n请选择: 系统退出, 再见!",
  "c10_debug": "x = 42\n1001 Tom 88.5\n1002 Amy 92.0",
  "c10_multi": "add = 7\nx=2 y=1",
  "cA_silent": "7/2 = 3\nWednesday\nThursday\nTom(95.5) Amy(88.0)",
  "cA_scanf": "请输入一个短词: 读到: abc",
  "cB_defer": "5! = 120\nbit2 = 1\n这些都留到 [用到再查]",
  "cC_selftest": "Amy    95\nCindy  88\nTom    78\nBob    60\nx=2 y=1",
  "cC_extra": "max=88 min=7 avg=40.50"
};

/* 暴露到全局, 便于调试与自动化测试 */
if (typeof window !== "undefined") window.OUTPUTS = OUTPUTS;
