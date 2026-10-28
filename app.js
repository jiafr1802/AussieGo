"use strict";

const STORAGE_KEY = "aussiego-planner-v1";
const ANT_JD_URL = "https://talent.antgroup.com/campus-position?positionId=260721010991745";
const IMMIACCOUNT_URL = "https://online.immi.gov.au/ola/app";
const coreProblems = [
  [236, "二叉树的最近公共祖先", "二叉树", "lowest-common-ancestor-of-a-binary-tree"],
  [79, "单词搜索", "回溯", "word-search"],
  [23, "合并K个升序链表", "链表", "merge-k-sorted-lists"],
  [139, "单词拆分", "动态规划", "word-break"],
  [300, "最长递增子序列", "动态规划", "longest-increasing-subsequence"],
  [5, "最长回文子串", "动态规划", "longest-palindromic-substring"],
  [1143, "最长公共子序列", "动态规划", "longest-common-subsequence"],
  [72, "编辑距离", "动态规划", "edit-distance"],
  [131, "分割回文串", "回溯", "palindrome-partitioning"],
  [437, "路径总和III", "二叉树", "path-sum-iii"],
  [42, "接雨水", "双指针", "trapping-rain-water"],
  [142, "环形链表II", "链表", "linked-list-cycle-ii"],
  [102, "二叉树的层序遍历", "二叉树", "binary-tree-level-order-traversal"],
  [121, "买卖股票的最佳时机", "动态规划", "best-time-to-buy-and-sell-stock"],
  [22, "括号生成", "回溯", "generate-parentheses"],
  [215, "数组中的第K个最大元素", "堆", "kth-largest-element-in-an-array"],
  [105, "从前序与中序遍历序列构造二叉树", "二叉树", "construct-binary-tree-from-preorder-and-inorder-traversal"],
  [25, "K个一组翻转链表", "链表", "reverse-nodes-in-k-group"],
  [322, "零钱兑换", "动态规划", "coin-change"],
  [347, "前K个高频元素", "堆", "top-k-frequent-elements"],
  [15, "三数之和", "双指针", "3sum"],
  [560, "和为K的子数组", "子串", "subarray-sum-equals-k"],
  [141, "环形链表", "链表", "linked-list-cycle"],
  [101, "对称二叉树", "二叉树", "symmetric-tree"],
  [337, "打家劫舍III", "动态规划", "house-robber-iii"],
  [39, "组合总和", "回溯", "combination-sum"],
  [54, "螺旋矩阵", "矩阵", "spiral-matrix"],
  [56, "合并区间", "普通数组", "merge-intervals"],
  [234, "回文链表", "链表", "palindrome-linked-list"],
  [239, "滑动窗口最大值", "子串", "sliding-window-maximum"],
  [128, "最长连续序列", "哈希", "longest-consecutive-sequence"],
  [11, "盛水最多的容器", "双指针", "container-with-most-water"],
  [206, "反转链表", "链表", "reverse-linked-list"],
  [94, "二叉树的中序遍历", "二叉树", "binary-tree-inorder-traversal"],
  [70, "爬楼梯", "动态规划", "climbing-stairs"],
  [200, "岛屿数量", "图论", "number-of-islands"],
  [46, "全排列", "回溯", "permutations"],
  [53, "最大子数组和", "普通数组", "maximum-subarray"],
  [21, "合并两个有序链表", "链表", "merge-two-sorted-lists"],
  [3, "无重复字符的最长子串", "滑动窗口", "longest-substring-without-repeating-characters"],
].map(([id, title, category, slug]) => ({ id, title, category, slug }));
const categories = ["学业 / 实验", "求职", "签证", "生活"];
const statuses = { planned: "已安排", tentative: "待定", suggested: "建议安排" };
const dayInfo = [
  ["先把重要的事启动", "户口证明、实验与请假。携程面试已改至明天 17:00，今天给项目复习留出至少一小时。"],
  ["材料准备日", "上午最后检查报告内容并打印材料；银行流水与开题准备，17:00 携程面试。"],
  ["开题答辩", "上午练习 1–2 遍 PPT 讲解，熟悉整体内容并思考常见问题；14:00 开题答辩，带好已打印的报告与审核表。"],
  ["去清华，见一见新机会", "日历记录 Apple 宣讲 19:00—20:00，记得带英文简历；今天也是 H 生日。银行流水备选日。"],
  ["收一收尾，也见见朋友", "和 lyq、dsy 喝酒暂定，等大家确认。"],
  ["签证已提交，等消息", "澳大利亚签证申请已提交，目前等待审理结果；留意邮箱与 ImmiAccount 通知。"],
  ["校友相聚的周日", "辽宁省实验中学北京校友会迎新会 · 正大中心南塔 18 层，13:00 起签到。"],
  ["新一周，LC 与报销", "日历中的“重启 LC”跨 11 月 1—2 日。暂放济州岛 KDD 会议报销：打印材料、交 Y 老师，后续等反馈。"],
  ["把时间留给进展", "暂无已确认安排。"],
  ["一周的中点", "暂无已确认安排。"],
  ["继续向前", "暂无已确认安排。"],
  ["一万零一夜，派对之约", "NeurIPS camera-ready 截止日为今天 AoE，对应北京时间明天 19:59；提前检查最终版本。21:00 派对开始，按自己的 MBTI 穿对应颜色的衣服；地点与散场时间待确认。"],
  ["立冬，camera-ready 截止", "NeurIPS 2026 camera-ready 北京时间 19:59 截止（11 月 6 日 AoE），在 OpenReview author console 提交。日历节气：立冬。"],
  ["下一段之前", "暂无已确认安排。"],
];
const dates = Array.from({ length: 14 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 9, 26 + index));
  return { iso: date.toISOString().slice(0, 10), short: `${date.getUTCMonth() + 1}.${String(date.getUTCDate()).padStart(2, "0")}`, weekday: `周${"日一二三四五六"[date.getUTCDay()]}`, title: dayInfo[index][0], summary: dayInfo[index][1] };
});
const seedTasks = [
  { id: "household", date: "2026-10-26", title: "派出所开户口证明", category: "签证", note: "出发前确认办理网点、办公时间及所需证件。" },
  { id: "experiment", date: "2026-10-26", title: "尝试把实验跑起来", category: "学业 / 实验", note: "记录启动结果、报错和下一步。" },
  { id: "mentor", date: "2026-10-26", title: "向 MSRA mentor 请周会假 · 晚上", category: "学业 / 实验", note: "晚上安排，具体时间未定。确认请假对应的会议日期，并同步本周进度。" },
  { id: "experiment-progress-1026", date: "2026-10-26", title: "检查实验进度 · 晚上", category: "学业 / 实验", note: "晚上检查实验运行进度，记录结果、报错和下一步。具体时间未定。" },
  { id: "revise-report-research", date: "2026-10-26", title: "修改开题 PPT · 突出研究内容 3 与 2 的区别和关系", category: "学业 / 实验", note: "修改开题 PPT 中的研究内容部分。\n修改重点：突出研究内容 3 与研究内容 2 的区别和关系。" },
  { id: "check-references", date: "2026-10-26", title: "检查参考文献格式", category: "学业 / 实验", note: "检查参考文献格式，统一文内引用与文献条目格式。" },
  { id: "review", date: "2026-10-26", title: "复习项目经历 · 至少 1 小时", category: "求职", note: "建议在面试前安排；梳理背景、个人贡献、技术选择与结果。" },
  { id: "insurance-algorithm-apply", date: "2026-10-26", title: "投递保险公司算法岗", category: "求职", note: "参考截图筛选众安、平安、中国人寿、阳光保险、中国太平的算法 / AI 岗位。\n检索：大模型、算法研究员、人工智能开发、寿险 AI 应用开发工程师；截图提及阳光岗位编号 J19660。\n投递前以各公司官网核实岗位有效性、2027 届批次与任职要求，准备简历并记录投递结果。" },
  { id: "fintech-apply", date: "2026-10-26", title: "投递金融科技公司岗位", category: "求职", note: "目标公司：蚂蚁、招银云创、金证科技、度小满、众安、万得、太衍基金。\n度小满关注北京、上海岗位；转发消息称可选两个志愿，投递前以官网要求为准。\n筛选岗位、准备简历并记录投递进度。个人内推链接和内推码不在公开页面展示；此事项不代表已完成投递。" },
  { id: "portfolio-kdd-photos", date: "2026-10-26", title: "在作品集中放入参加 KDD 会议的照片", category: "求职", note: "挑选 KDD 参会照片并加入作品集，补充会议名称、时间及参会经历。发布前检查照片中的他人肖像与隐私信息。" },
  { id: "yin-yoga", date: "2026-10-26", time: "12:10", title: "阴瑜伽", category: "生活", note: "12:10—13:10（北京时间）。\n归位瑜伽·融科馆，团教室。\n已预约。" },
  { id: "yoga-clothes-pack-1028", date: "2026-10-28", title: "带瑜伽训练服 · 今晚先装包", category: "生活", note: "今晚准备好瑜伽训练服并装进明天要带的包里；具体钟点未定。明天 10 月 29 日 13:00—14:00 在归位瑜伽·融科馆上哈他（脊柱）课，明早出门前再检查一次。" },
  { id: "yoga-clothes-check-1029", date: "2026-10-29", title: "带瑜伽训练服 · 早上出门前再检查", category: "生活", note: "早上出门前再次确认瑜伽训练服已带上，避免落在家里；具体钟点未定。今天 13:00—14:00 上课，归位瑜伽·融科馆，团教室。" },
  { id: "hatha-yoga-1029", date: "2026-10-29", time: "13:00", title: "哈他瑜伽（脊柱）", category: "生活", note: "预约截图：已预约。\n2026 年 10 月 29 日 13:00—14:00（北京时间）。\n归位瑜伽·融科馆，团教室。\n今晚先装好瑜伽训练服，明早出门前再检查。" },
  { id: "ctrip", date: "2026-10-27", time: "17:00", title: "携程面试", category: "求职", note: "改期确认：根据最新 Moka 招聘通知，携程校招面试改为 10.27（周二）17:00（北京时间），原 10.26 19:00 安排作废。结束时间未提供，疑问及联系方式见邮箱。提前检查面试通知、入口与设备。" },
  { id: "bytedance-followup", date: "2026-10-28", title: "跟进字节广告方向 · 等待评估结果", category: "求职", note: "10.26 更新：HR 已将简历转发给其他 HR；目前在广告方向等待评估。若评估通过，会有对应 HR 联系。目前尚未确认通过评估或获得面试。\n下一步：等待评估结果及 HR 联系；保留 10.28（周三）的进度跟进，具体时间未定。\n提醒：猎杀时刻之前不要焦躁，也可以自己主动投递和联系，别急。" },
  { id: "huawei-interview-followup", date: "2026-10-29", title: "跟进华为 · 争取面试或转推其他组", category: "求职", note: "联系上周对接的人，询问是否有面试机会；若当前组暂无机会，询问能否将简历转推给其他组。记录回复及下一步，不代表已获得面试。安排在 10.29（周四），具体联系时间未定。" },
  { id: "eyeshadow", date: "2026-10-27", title: "试试蓝色系眼影 · 携程面试前", category: "生活", note: "安排在 10.27（周二）17:00 的携程面试之前，具体准备时间未定。" },
  { id: "bank", date: "2026-10-27", title: "银行打印流水", category: "签证", note: "10.27 / 10.29 二选一，暂放 27 日。若改到 29 日，可编辑日期；确认流水时间范围、语言和盖章要求。" },
  { id: "neurips-invitation-reprint", date: "2026-10-27", title: "重新打印 NeurIPS 邀请函 · 先更正信息", category: "签证", status: "suggested", note: "暂放今天，具体时间可调整。\n1. 在会议账户中核对并更正个人信息，与护照保持一致。\n2. 重新生成并下载官方邀请函；如无法自行更正，联系会议主办方。\n3. 核对个人信息、悉尼会场与会议日期后，再打印并替换签证申请材料中的旧版本。\n不要直接修改原 PDF；此待办不代表已完成更正、打印或上传。" },
  { id: "experiment-progress-1027", date: "2026-10-27", title: "检查实验进度", category: "学业 / 实验", note: "检查实验运行进度，记录结果、报错和下一步。" },
  { id: "defense-rehearsal", date: "2026-10-27", title: "开题答辩排练计时", category: "学业 / 实验", note: "完整排练开题答辩并计时，记录总时长及需要调整的部分。" },
  { id: "report-final-check-1028", date: "2026-10-27", title: "最后检查一下报告内容 · 上午 · 打印前", category: "学业 / 实验", note: "周二上午，打印材料前最后检查一下开题报告内容，确认最终版本后再打印。具体钟点未定。" },
  { id: "print-report", date: "2026-10-27", title: "打印开题报告 7 份 · 上午", category: "学业 / 实验", note: "确认最终版本、页码及学院装订要求。" },
  { id: "print-report-review-form", date: "2026-10-27", title: "打印开题报告审核表 · 上午", category: "学业 / 实验", note: "确认使用学院要求的审核表版本。" },
  { id: "defense-ppt-practice-1028", date: "2026-10-28", title: "练习开题 PPT 讲解 1–2 遍 · 上午", category: "学业 / 实验", note: "今天上午完整练习 1–2 遍开题答辩 PPT 讲解，熟悉整体内容、研究思路和各部分衔接，为下午 14:00 的答辩与现场 defend 做准备。具体练习钟点未定。\n讲解时留意总时长和不够熟悉的页面，练完后梳理常见问题及回答要点：研究动机与意义、研究内容 2 和 3 的区别与关系、创新点、实验设计与评价指标、可行性、局限及后续计划。" },
  { id: "defense", date: "2026-10-28", time: "14:00", title: "开题答辩", category: "学业 / 实验", note: "带好开题报告；答辩地点与提前到场时间待补充。\n答辩提醒：用东北话人格，即使被喷了也能笑着面对。" },
  { id: "msra-mentor-leave-1028", date: "2026-10-28", title: "向 MSRA mentor 请假", category: "学业 / 实验", note: "今天联系 MSRA mentor 请假，说明请假安排并确认回复；具体会议与请假时段待确认。此事项不代表已发送或获批。" },
  { id: "experiment-progress-1028", date: "2026-10-28", title: "跟进实验进度 · 晚上", category: "学业 / 实验", note: "今晚跟进实验运行进度，查看结果与报错，记录当前情况和下一步。具体钟点未定。" },
  { id: "opd-math-inference-summary-1029", date: "2026-10-29", title: "阶段性总结 OPD-Math 训练集推理的问题和现状", category: "学业 / 实验", note: "阶段性梳理目前 OPD-Math 训练集推理的现状、主要问题、已有排查结果和下一步；区分已验证结论与待确认问题。安排在 10 月 29 日，具体时间未定。" },
  { id: "apple", date: "2026-10-29", title: "清华 Apple 开放日 · 带英文简历", category: "求职", note: "晚上参加，具体时间与场地待确认。出门前带好英文简历并核对入校要求。" },
  { id: "ant-interview-1029", date: "2026-10-29", time: "17:00", title: "蚂蚁集团面试 · 大模型智能体优化算法", category: "求职", note: "校园招聘视频面试，10.29（周四）17:00（北京时间）开始，结束时间未提供。面试入口及联系信息见原邮件；私人面试链接不在公开页面保存。提前检查设备、网络和邮件通知。" },
  { id: "ant-interview-review-1029", date: "2026-10-29", title: "复习八股 · 白天 · 准备蚂蚁面试", category: "求职", note: "提醒：千万认真！\n周四白天复习八股，为当天 17:00 的蚂蚁集团面试做准备，在面试前完成。具体复习钟点未定。" },
  { id: "ant-data-structures-review-1029", date: "2026-10-29", title: "复习数据结构 · 堆和队列 · 白天", category: "求职", note: "周四白天复习数据结构，重点是堆和队列，为当天 17:00 的蚂蚁集团面试做准备，在面试前完成。具体复习钟点未定。" },
  { id: "ant-jd-preparation-1029", date: "2026-10-29", title: "查看蚂蚁官网 JD · 白天 · 针对性准备面试", category: "求职", note: `周四白天去蚂蚁集团招聘官网查看“大模型智能体优化算法”岗位 JD，核对岗位职责与任职要求，再对应梳理项目经历、技术知识和面试准备重点。岗位信息以官网为准，不代表已完成查询或准备。安排在当天 17:00 蚂蚁面试前，具体钟点未定。\n蚂蚁官网 JD：${ANT_JD_URL}` },
  { id: "haiyou-group-meeting", date: "2026-10-29", time: "09:00", title: "海优组小组会", category: "学业 / 实验", note: "周四早上 09:00 参加海优组小组会（北京时间）。地点或会议链接、结束时间待确认。" },
  { id: "large-group-leave-1029", date: "2026-10-29", title: "给大组会请假", category: "学业 / 实验", note: "联系大组会负责人请假，并确认是否获批。具体会议时间待确认。" },
  { id: "baidu-followup-1029", date: "2026-10-29", title: "跟进上周百度面试结果 · 推进新流程", category: "求职", note: "跟进上周百度面试的反馈与结果，确认后续安排并推进新的招聘流程，记录回复和下一步。结果与新流程进度均待确认。" },
  { id: "kdd-submit-1029", date: "2026-10-29", title: "提交 KDD 报销材料", category: "学业 / 实验", note: "打印济州岛 KDD 会议报销材料并交给 Y 老师。材料清单与具体交接时间待确认。" },
  { id: "friends", date: "2026-10-30", title: "和 lyq、dsy 一起喝酒", category: "生活", status: "tentative", note: "周五可能相约，时间与地点待大家确认。" },
  { id: "kdd-submit-1030", date: "2026-10-30", title: "提交 KDD 报销材料", category: "学业 / 实验", note: "周四未完成则今天提交给 Y 老师；若已提交，确认收件与反馈，按要求补交材料，避免重复提交。" },
  { id: "pingan-assessment-1031", date: "2026-10-31", title: "完成中国平安校招测评 · 周末", category: "求职", status: "suggested", note: "本周末完成，暂放 10 月 31 日（周六），具体钟点未定。\n邮件明确截止时间：2026 年 11 月 2 日 12:45（北京时间），逾期视为自动放弃；尽量周末完成，不拖到截止前。\n测评项目：16PF、平安 IQ（新），预计分别耗时 60 分钟、20 分钟，共约 80 分钟。\n先通过原邮件中的链接完善简历信息，再进入测评；使用与简历一致的登录信息。推荐 Chrome、Edge、Safari 或火狐浏览器。\n测评入口与个人登录信息见原邮件，不在公开网页保存。" },
  { id: "visa-submit", date: "2026-10-28", title: "澳大利亚签证申请已提交", category: "签证", done: true, note: `10.28 更新：申请已提交，目前等待审理结果。留意邮箱与 ImmiAccount 通知，如收到补件要求再处理；尚未获知审批结果。\nImmiAccount 申请列表：${IMMIACCOUNT_URL}` },
  { id: "alumni-checkin", date: "2026-11-01", time: "13:00", title: "校友迎新会 · 签到、自由拍照合影", category: "生活", note: "13:00—13:30 签到与合影。\n地点：北京市朝阳区正大中心南塔 18 层。" },
  { id: "alumni-welcome", date: "2026-11-01", time: "13:30", title: "辽宁省实验中学北京校友会2026年迎新会", category: "生活", note: "13:30—17:30 迎新座谈交流。\n地点：北京市朝阳区正大中心南塔 18 层。\n主办单位：辽宁省实验中学北京校友会。\n活动不收取费用，会后聚餐另行收取餐费。" },
  { id: "alumni-dinner", date: "2026-11-01", time: "17:30", title: "校友迎新会 · 会后聚餐", category: "生活", note: "17:30—20:00 会后聚餐。\n餐费：在校校友 50 元/人，工作校友 100 元/人。\n聚餐具体地点待确认。" },
  { id: "kdd-reimbursement", date: "2026-11-02", title: "报销济州岛 KDD 会议 · 打印材料并交 Y 老师", category: "学业 / 实验", status: "suggested", note: "第二周待办，暂放 11 月 2 日（周一），并非已确认预约，具体办理日可调整。\n1. 先打印报销材料。\n2. 把材料交给 Y 老师。\n3. 等 Y 老师反馈，再按反馈补充或修改材料。\n材料清单、交接时间与反馈日期待确认。" },
  { id: "neurips-camera-ready-2026", date: "2026-11-07", time: "19:59", title: "NeurIPS 2026 camera-ready DDL · 11.6 AoE", category: "学业 / 实验", note: "邮件通知：最终 camera-ready 版本须于 November 6 (AoE) 前在 OpenReview author console 提交。\nAoE 为 UTC−12：2026 年 11 月 6 日 23:59:59 对应北京时间 2026 年 11 月 7 日 19:59:59；日程按北京时间记为 11 月 7 日 19:59。\n提前检查最终版本，在作者控制台上传并确认提交成功，避免临近截止时操作。具体要求以邮件及作者控制台为准。\nOpenReview：https://openreview.net/" },
].map(task => ({ time: "", status: "planned", done: false, ...task }));

const calendarSnapshot = [
  { uid: "D91300D7-5347-4941-8E09-446E3001DBB9", calendar: "朋友", title: "PARTY XL dress code", start: "2026-11-06T21:00:00+08:00", end: "2026-11-06T23:00:00+08:00", allDay: false, notes: "", category: "生活" },
  { uid: "16A9FE21-4672-43C3-BB29-43991F9D9348", calendar: "个人", title: "携程面试", start: "2026-10-26T19:00:00+08:00", end: "2026-10-26T20:00:00+08:00", allDay: false, notes: "试试蓝色眼影？", taskId: "ctrip" },
  { uid: "25BDF481-98AE-46CC-9321-5C19DC93A76D", calendar: "个人", title: "实验北京校友会", start: "2026-11-01T13:00:00+08:00", end: "2026-11-01T17:00:00+08:00", allDay: false, notes: "北京市朝阳区 正大中心 南塔18层", taskId: "alumni-welcome", discrepancy: "日历时间为 13:00—17:00；以你提供的活动流程为准：13:00 签到，13:30—17:30 交流，17:30—20:00 聚餐。" },
  { uid: "FA5231E4-BC69-4FF4-BEC1-CDA48C751B99", calendar: "工作", title: "Apple清华宣讲", start: "2026-10-29T19:00:00+08:00", end: "2026-10-29T20:00:00+08:00", allDay: false, notes: "", taskId: "apple" },
  { uid: "29EE7DA6-EF43-469E-8910-11A99D062C6C", calendar: "工作", title: "开题答辩", start: "2026-10-26T00:00:00+08:00", end: "2026-10-29T00:00:00+08:00", allDay: true, notes: "", taskId: "defense", discrepancy: "日历为 10.26—10.28 全天跨日标记；保留你确认的 10.28 14:00 答辩，不重复添加全天事项。" },
  { uid: "D1431B25-32E3-4EF8-801A-EB9CD98FA07E", calendar: "工作", title: "重启LC", start: "2026-11-01T00:00:00+08:00", end: "2026-11-03T00:00:00+08:00", allDay: true, notes: "", category: "求职" },
  { uid: "1AC5CD55-4C93-42E8-9117-7780A7345AE5", calendar: "工作", title: "打印开题报告", start: "2026-10-26T00:00:00+08:00", end: "2026-10-28T00:00:00+08:00", allDay: true, notes: "", taskId: "print-report", discrepancy: "日历为 10.26—10.27 全天跨日标记；保留你确认的 10.27 打印 7 份。" },
  { uid: "BEC32F75-B5A8-4A9B-9CD0-E004A7CC626A", calendar: "创意", title: "注册Neurips 签证 机票", start: "2026-10-23T00:00:00+08:00", end: "2026-10-31T00:00:00+08:00", allDay: true, notes: "10.22 10.23 连发两封表单追问", category: "签证" },
  { uid: "12A0B1CE-F344-47A8-B0A3-8064A5D254BA", calendar: "大麦", title: "H 生日", start: "2026-10-29T00:00:00+08:00", end: "2026-10-30T00:00:00+08:00", allDay: true, notes: "", category: "生活" },
  { uid: "5E5F1DD8-7484-4223-B338-F755E9FADABE", calendar: "中国大陆节假日", title: "立冬", start: "2026-11-07T00:00:00+08:00", end: "2026-11-08T00:00:00+08:00", allDay: true, notes: "", category: "生活" },
];

const element = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const isDate = value => dates.some(day => day.iso === value);
function validState(value) {
  if (!value || ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36].includes(value.version) || !Array.isArray(value.tasks) || value.tasks.length > 2000 || !value.days || typeof value.days !== "object" || Array.isArray(value.days)) return false;
  if (value.core40 !== undefined && (!Array.isArray(value.core40) || value.core40.length > 40 || new Set(value.core40).size !== value.core40.length || !value.core40.every(id => coreProblems.some(problem => problem.id === id)))) return false;
  const ids = new Set();
  for (const task of value.tasks) {
    if (!task || typeof task.id !== "string" || !/^[a-zA-Z0-9-]{1,100}$/.test(task.id) || ids.has(task.id) || !isDate(task.date) || typeof task.title !== "string" || !task.title.trim() || task.title.length > 160 || !categories.includes(task.category) || !Object.hasOwn(statuses, task.status) || typeof task.done !== "boolean" || typeof task.note !== "string" || task.note.length > 2000 || typeof task.time !== "string" || (task.time !== "" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(task.time))) return false;
    ids.add(task.id);
  }
  return Object.entries(value.days).every(([date, note]) => isDate(date) && note && typeof note === "object" && typeof note.flight === "boolean" && typeof note.flightNote === "string" && typeof note.note === "string");
}
let state = { version: 2, tasks: seedTasks, days: {} };
let storageWarning = "";
let needsMigration = false;
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    if (!validState(parsed)) throw new Error("Invalid saved data");
    state = parsed;
    if (state.version === 1) {
      const existingIds = new Set(state.tasks.map(task => task.id));
      state.tasks.push(...seedTasks.filter(task => task.id.startsWith("alumni-") && !existingIds.has(task.id)));
      state.version = 2;
      needsMigration = true;
    }
  }
} catch { storageWarning = "本地数据无法读取，当前显示初始计划；原数据未被自动覆盖。可尝试恢复备份。"; }
if (!storageWarning && state.version === 2) {
  for (const event of calendarSnapshot) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const formatDate = value => new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit" }).format(value);
    const range = event.allDay ? `${formatDate(start)}—${formatDate(new Date(end.getTime() - 1))} 全天` : `${formatDate(start)} ${event.start.slice(11, 16)}—${event.end.slice(11, 16)}`;
    const note = [`Mac 日历 · ${event.calendar} / ${event.title}`, range, event.notes ? `日历备注：${event.notes}` : "", event.discrepancy || ""].filter(Boolean).join("\n");
    if (event.taskId) {
      const task = state.tasks.find(item => item.id === event.taskId);
      if (task) {
        if (event.taskId === "apple" && task.date === "2026-10-29" && task.time === "") task.time = "19:00";
        const original = seedTasks.find(item => item.id === event.taskId);
        if (event.taskId === "apple" && task.note === original.note) task.note = "日历记录 19:00—20:00；出门前带好英文简历并核对入校要求，具体场地待确认。";
        task.note = `${task.note}${task.note ? "\n\n" : ""}${note}`;
      }
      continue;
    }
    for (const day of dates) {
      const dayStart = new Date(`${day.iso}T00:00:00+08:00`);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      if (start >= dayEnd || end <= dayStart) continue;
      const id = `mac-${event.uid}-${day.iso}`;
      if (!state.tasks.some(task => task.id === id)) state.tasks.push({ id, date: day.iso, time: event.allDay ? "" : event.start.slice(11, 16), title: `${event.title}${event.allDay ? " · 全天" : ""}`, category: event.category, status: "planned", done: false, note });
    }
  }
  state.version = 3;
  needsMigration = true;
}
if (!storageWarning && state.version === 3) {
  const party = state.tasks.find(task => task.id === "mac-D91300D7-5347-4941-8E09-446E3001DBB9-2026-11-06");
  if (party) {
    party.title = "「一万零一夜」派对 · 庆祝出生第 10001 天";
    const invitation = [
      "邀请函补充：",
      "时间：11 月 6 日（周五）晚上 21:00 开始。邀请函未注明结束时间；原日历的 23:00 仅作参考，实际散场时间待确认。",
      "Dress Code：MBTI。根据自己的 MBTI，穿着对应颜色的衣服；具体颜色对应关系邀请函未列出，需向主办方确认。",
      "现场提供免费小食。完成现场 Bingo 游戏，可获得一杯饮品。",
      "地点：邀请函未注明，待向主办方确认。入场费用也未注明。",
      "出发前准备：确认地点与入场安排，选好 MBTI 对应颜色的衣服，并安排好晚间返程。",
    ].join("\n");
    party.note = `${party.note}${party.note ? "\n\n" : ""}${invitation}`;
  }
  state.version = 4;
  needsMigration = true;
}
if (!storageWarning && state.version === 4) {
  if (!state.tasks.some(task => task.id === "kdd-reimbursement")) state.tasks.push({ ...seedTasks.find(task => task.id === "kdd-reimbursement") });
  state.version = 5;
  needsMigration = true;
}
if (!storageWarning && state.version === 5) {
  const interview = state.tasks.find(task => task.id === "ctrip");
  if (interview) {
    interview.title = "携程面试";
    interview.note = interview.note.replace("你在聊天中记为“携程笔试”，日历记为“携程面试”；保留笔试名称，类型与结束时间请核对通知。", "").replaceAll("笔试", "面试").trim();
  }
  const review = state.tasks.find(task => task.id === "review");
  if (review) review.note = review.note.replaceAll("笔试", "面试");
  state.version = 6;
  needsMigration = true;
}
if (!storageWarning && state.version === 6) {
  for (const task of state.tasks) {
    let anonymize;
    if (task.id === "kdd-reimbursement") anonymize = text => text.replace(/\p{Script=Han}(?=老师)/gu, "Y ");
    if (task.id === "mac-12A0B1CE-F344-47A8-B0A3-8064A5D254BA-2026-10-29") anonymize = text => text.replace(/\p{Script=Han}哥/gu, "H ");
    if (task.id === "mac-D91300D7-5347-4941-8E09-446E3001DBB9-2026-11-06") anonymize = text => text.replace(/PARTY\p{Script=Han}{2}/gu, "PARTY XL");
    if (anonymize) { task.title = anonymize(task.title); task.note = anonymize(task.note); }
  }
  state.version = 7;
  needsMigration = true;
}
if (!storageWarning && state.version === 7) {
  if (!state.tasks.some(task => task.id === "yin-yoga")) state.tasks.push({ ...seedTasks.find(task => task.id === "yin-yoga") });
  state.version = 8;
  needsMigration = true;
}
if (!storageWarning && state.version === 8) {
  for (const id of ["revise-report-research", "check-references", "defense-rehearsal", "print-report"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  state.version = 9;
  needsMigration = true;
}
if (!storageWarning && state.version === 9) {
  for (const id of ["experiment-progress-1026", "experiment-progress-1027", "mentor"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  const mentor = state.tasks.find(task => task.id === "mentor");
  mentor.date = "2026-10-26";
  mentor.time = "";
  mentor.title = "向 MSRA mentor 请周会假 · 晚上";
  state.version = 10;
  needsMigration = true;
}
if (!storageWarning && state.version === 10) {
  for (const id of ["insurance-algorithm-apply", "kdd-submit-1029", "kdd-submit-1030"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  state.version = 11;
  needsMigration = true;
}
if (!storageWarning && state.version === 11) {
  if (!state.tasks.some(task => task.id === "print-report-review-form")) state.tasks.push({ ...seedTasks.find(task => task.id === "print-report-review-form") });
  state.version = 12;
  needsMigration = true;
}
if (!storageWarning && state.version === 12) {
  for (const id of ["fintech-apply", "portfolio-kdd-photos"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  state.version = 13;
  needsMigration = true;
}
if (!storageWarning && state.version === 13) {
  const report = state.tasks.find(task => task.id === "revise-report-research");
  if (report) {
    report.title = seedTasks.find(task => task.id === "revise-report-research").title;
    const focus = "修改重点：突出研究内容 3 与研究内容 2 的区别和关系。";
    const note = `${report.note}${report.note ? "\n" : ""}${focus}`;
    if (!report.note.includes(focus) && note.length <= 2000) report.note = note;
  }
  state.version = 14;
  needsMigration = true;
}
if (!storageWarning && state.version === 14) {
  for (const id of ["haiyou-group-meeting", "large-group-leave-1029", "baidu-followup-1029"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  state.version = 15;
  needsMigration = true;
}
if (!storageWarning && state.version === 15) {
  for (const id of ["bytedance-followup", "huawei-interview-followup", "ctrip"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  const interview = state.tasks.find(task => task.id === "ctrip");
  interview.date = "2026-10-27";
  interview.time = "17:00";
  const latest = seedTasks.find(task => task.id === "ctrip").note;
  const note = `${latest}${interview.note ? `\n\n${interview.note}` : ""}`;
  if (!interview.note.includes(latest) && note.length <= 2000) interview.note = note;
  state.version = 16;
  needsMigration = true;
}
if (!storageWarning && state.version === 16) {
  for (const id of ["eyeshadow", "bytedance-followup", "huawei-interview-followup", "ant-interview-1029"]) {
    const seed = seedTasks.find(task => task.id === id);
    const task = state.tasks.find(task => task.id === id);
    if (!task) {
      state.tasks.push({ ...seed });
      continue;
    }
    task.date = seed.date;
    if (id === "eyeshadow") {
      task.title = seed.title;
      task.time = "";
      const note = `${seed.note}${task.note ? `\n\n${task.note}` : ""}`;
      if (!task.note.includes(seed.note) && note.length <= 2000) task.note = note;
    } else if (id !== "ant-interview-1029") {
      task.note = task.note.replace("跟进事项暂放今天，具体联系时间可调整。", id === "bytedance-followup" ? "安排在 10.28（周三），具体联系时间未定。" : "安排在 10.29（周四），具体联系时间未定。").replace("此前在会议中接触的几个组", "此前接触的几个组");
    }
  }
  state.version = 17;
  needsMigration = true;
}
if (!storageWarning && state.version === 17) {
  const seed = seedTasks.find(task => task.id === "bytedance-followup");
  const followup = state.tasks.find(task => task.id === seed.id);
  if (followup) {
    followup.title = seed.title;
    const note = `${seed.note}${followup.note ? `\n\n此前记录（以本次更新为准）：\n${followup.note}` : ""}`;
    if (!followup.note.includes(seed.note) && note.length <= 2000) followup.note = note;
  } else {
    state.tasks.push({ ...seed });
  }
  state.version = 18;
  needsMigration = true;
}
if (!storageWarning && state.version === 18) {
  state.core40 = state.core40 || [];
  state.version = 19;
  needsMigration = true;
}
if (!storageWarning && state.version === 19) {
  if (!state.tasks.some(task => task.id === "ant-interview-review-1029")) state.tasks.push({ ...seedTasks.find(task => task.id === "ant-interview-review-1029") });
  state.version = 20;
  needsMigration = true;
}
if (!storageWarning && state.version === 20) {
  if (!state.tasks.some(task => task.id === "ant-jd-preparation-1029")) state.tasks.push({ ...seedTasks.find(task => task.id === "ant-jd-preparation-1029") });
  state.version = 21;
  needsMigration = true;
}
if (!storageWarning && state.version === 21) {
  const defense = state.tasks.find(task => task.id === "defense");
  if (defense) {
    const reminder = "答辩提醒：用东北话人格，即使被喷了也能笑着面对。";
    const note = `${defense.note}${defense.note ? "\n" : ""}${reminder}`;
    if (!defense.note.includes(reminder) && note.length <= 2000) defense.note = note;
  }
  state.version = 22;
  needsMigration = true;
}
if (!storageWarning && state.version === 22) {
  const preparation = state.tasks.find(task => task.id === "ant-jd-preparation-1029");
  if (preparation && !preparation.note.includes(ANT_JD_URL)) {
    const note = `${preparation.note}${preparation.note ? "\n" : ""}蚂蚁官网 JD：${ANT_JD_URL}`;
    if (note.length <= 2000) preparation.note = note;
  }
  state.version = 23;
  needsMigration = true;
}
if (!storageWarning && state.version === 23) {
  for (const id of ["print-report", "print-report-review-form"]) {
    const task = state.tasks.find(task => task.id === id);
    if (!task) continue;
    task.date = "2026-10-28";
    task.time = "";
    if (!task.title.includes("上午") && task.title.length <= 155) task.title += " · 上午";
    const reminder = "改为 10.28（周三）上午，最后检查报告内容后打印，具体钟点未定。";
    const note = `${task.note}${task.note ? "\n" : ""}${reminder}`;
    if (!task.note.includes(reminder) && note.length <= 2000) task.note = note;
  }
  if (!state.tasks.some(task => task.id === "report-final-check-1028")) {
    const index = state.tasks.findIndex(task => task.id === "print-report");
    state.tasks.splice(index < 0 ? state.tasks.length : index, 0, { ...seedTasks.find(task => task.id === "report-final-check-1028") });
  }
  state.version = 24;
  needsMigration = true;
}
if (!storageWarning && state.version === 24) {
  for (const id of ["report-final-check-1028", "print-report", "print-report-review-form"]) {
    const task = state.tasks.find(task => task.id === id);
    if (!task) continue;
    task.date = "2026-10-27";
    task.time = "";
    task.note = task.note.replaceAll("改为 10.28（周三）上午，", "改为 10.27（周二）上午，").replace("周三上午，打印材料前", "周二上午，打印材料前");
  }
  state.version = 25;
  needsMigration = true;
}
if (!storageWarning && state.version === 25) {
  if (!state.tasks.some(task => task.id === "ant-data-structures-review-1029")) {
    const index = state.tasks.findIndex(task => task.id === "ant-interview-review-1029");
    state.tasks.splice(index < 0 ? state.tasks.length : index + 1, 0, { ...seedTasks.find(task => task.id === "ant-data-structures-review-1029") });
  }
  state.version = 26;
  needsMigration = true;
}
if (!storageWarning && state.version === 26) {
  if (!state.tasks.some(task => task.id === "neurips-invitation-reprint")) {
    state.tasks.push({ ...seedTasks.find(task => task.id === "neurips-invitation-reprint") });
  }
  state.version = 27;
  needsMigration = true;
}
if (!storageWarning && state.version === 27) {
  const application = state.tasks.find(task => task.id === "visa-submit");
  if (application && !application.note.includes(IMMIACCOUNT_URL)) {
    const note = `${application.note}${application.note ? "\n" : ""}ImmiAccount 申请列表（登录后选择现有申请继续检查）：${IMMIACCOUNT_URL}`;
    if (note.length <= 2000) application.note = note;
  }
  state.version = 28;
  needsMigration = true;
}
if (!storageWarning && state.version === 28) {
  const application = state.tasks.find(task => task.id === "visa-submit");
  if (application) {
    const seed = seedTasks.find(task => task.id === "visa-submit");
    application.title = seed.title;
    application.date = seed.date;
    application.time = "";
    application.status = "planned";
    application.done = true;
    const update = seed.note.split("\n")[0];
    const note = `${application.note}${application.note ? "\n\n" : ""}${update}`;
    if (!application.note.includes(update) && note.length <= 2000) application.note = note;
  }
  state.version = 29;
  needsMigration = true;
}
if (!storageWarning && state.version === 29) {
  if (!state.tasks.some(task => task.id === "defense-ppt-practice-1028")) {
    const index = state.tasks.findIndex(task => task.id === "defense");
    state.tasks.splice(index < 0 ? state.tasks.length : index, 0, { ...seedTasks.find(task => task.id === "defense-ppt-practice-1028") });
  }
  state.version = 30;
  needsMigration = true;
}
if (!storageWarning && state.version === 30) {
  const followup = state.tasks.find(task => task.id === "bytedance-followup");
  if (followup) {
    const reminder = seedTasks.find(task => task.id === "bytedance-followup").note.split("\n").at(-1);
    const note = `${followup.note}${followup.note ? "\n" : ""}${reminder}`;
    if (!followup.note.includes(reminder) && note.length <= 2000) followup.note = note;
  }
  state.version = 31;
  needsMigration = true;
}
if (!storageWarning && state.version === 31) {
  for (const id of ["msra-mentor-leave-1028", "experiment-progress-1028"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  state.version = 32;
  needsMigration = true;
}
if (!storageWarning && state.version === 32) {
  if (!state.tasks.some(task => task.id === "neurips-camera-ready-2026")) {
    state.tasks.push({ ...seedTasks.find(task => task.id === "neurips-camera-ready-2026") });
  }
  state.version = 33;
  needsMigration = true;
}
if (!storageWarning && state.version === 33) {
  for (const id of ["yoga-clothes-pack-1028", "yoga-clothes-check-1029", "hatha-yoga-1029"]) {
    if (!state.tasks.some(task => task.id === id)) state.tasks.push({ ...seedTasks.find(task => task.id === id) });
  }
  state.version = 34;
  needsMigration = true;
}
if (!storageWarning && state.version === 34) {
  if (!state.tasks.some(task => task.id === "opd-math-inference-summary-1029")) {
    state.tasks.push({ ...seedTasks.find(task => task.id === "opd-math-inference-summary-1029") });
  }
  state.version = 35;
  needsMigration = true;
}
if (!storageWarning && state.version === 35) {
  if (!state.tasks.some(task => task.id === "pingan-assessment-1031")) {
    state.tasks.push({ ...seedTasks.find(task => task.id === "pingan-assessment-1031") });
  }
  state.version = 36;
  needsMigration = true;
}
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
let selectedDate = isDate(today) ? today : dates[0].iso;
let week = "all";
let editingId = null;
let noticeTimer;
function icons() { if (window.lucide) window.lucide.createIcons(); }
function notify(message) { element("notice").textContent = message; element("notice").hidden = false; clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { element("notice").hidden = true; }, 6000); }
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); element("save-status").textContent = "已保存到当前浏览器"; }
  catch { element("save-status").textContent = "保存失败，请用底部备份导出数据"; notify("浏览器存储不可用，请及时导出备份。关闭页面可能丢失修改。"); }
}
function tasksFor(date) { return state.tasks.filter(task => task.date === date).sort((first, second) => (first.time || "99").localeCompare(second.time || "99")); }
function renderCore40() {
  const completed = state.core40 || [];
  element("core40-progress-label").textContent = `${completed.length} / 40 已完成`;
  element("core40-progress").value = completed.length;
  element("core40-rows").innerHTML = coreProblems.map((problem, index) => `<tr class="${completed.includes(problem.id) ? "done" : ""}"><td><input type="checkbox" data-problem="${problem.id}" aria-label="完成 ${escapeHtml(problem.title)}" ${completed.includes(problem.id) ? "checked" : ""}></td><td class="problem-number">${String(index + 1).padStart(2, "0")}</td><th scope="row"><a href="https://leetcode.cn/problems/${problem.slug}/" target="_blank" rel="noopener noreferrer">${escapeHtml(problem.title)}</a><small>LC ${problem.id}</small></th><td>${escapeHtml(problem.category)}</td></tr>`).join("");
}
element("core40-rows").addEventListener("change", event => {
  const id = Number(event.target.dataset.problem);
  if (!coreProblems.some(problem => problem.id === id)) return;
  const completed = new Set(state.core40 || []);
  if (event.target.checked) completed.add(id); else completed.delete(id);
  state.core40 = [...completed];
  persist(); renderCore40();
});
function matches(task) { return (element("category").value === "all" || task.category === element("category").value) && (!element("hide-done").checked || !task.done); }
function renderDays() {
  let count = 0;
  element("days").innerHTML = dates.map((day, index) => {
    const tasks = tasksFor(day.iso);
    const visible = tasks.filter(matches);
    const hidden = (week !== "all" && String(index < 7 ? 1 : 2) !== week) || ((element("category").value !== "all" || element("hide-done").checked) && !visible.length);
    if (!hidden) count++;
    const complete = tasks.filter(task => task.done).length;
    return `<button class="day-card ${day.iso === selectedDate ? "active" : ""}" data-date="${day.iso}" aria-pressed="${day.iso === selectedDate}" ${hidden ? "hidden" : ""}><div class="date"><b>${day.short}</b><span>${day.weekday} · DAY ${String(index + 1).padStart(2, "0")}</span></div><div class="day-main"><h3>${escapeHtml(day.title)}</h3><p class="day-summary">${escapeHtml(day.summary)}</p>${visible.map(task => `<div class="event ${task.time ? "fixed" : ""} ${task.done ? "done" : ""}"><time>${task.time || (task.id === "apple" || task.id === "friends" ? "晚上" : "灵活")}</time><i class="event-dot"></i><span class="event-title">${escapeHtml(task.title)}${task.status !== "planned" ? `<span class="tag">${statuses[task.status]}</span>` : ""}</span></div>`).join("")}${!tasks.length ? '<p class="small muted">留白 · 暂无已确认安排</p>' : `<p class="day-completion">${complete} / ${tasks.length} 已完成</p>`}</div><i class="chevron" data-lucide="chevron-right"></i></button>`;
  }).join("");
  element("empty-list").hidden = count !== 0;
  const done = state.tasks.filter(task => task.done).length;
  element("progress-label").textContent = `${done} / ${state.tasks.length} 事项已完成`;
  element("progress").value = state.tasks.length ? done / state.tasks.length * 100 : 0;
  icons();
}
function renderDetail() {
  const index = dates.findIndex(day => day.iso === selectedDate);
  const day = dates[index];
  element("day-number").textContent = String(index + 1).padStart(2, "0");
  element("detail-date").textContent = `2026 年 ${day.short.replace(".", " 月 ")} 日 · ${day.weekday}`;
  element("detail-title").textContent = day.title;
  element("detail-summary").textContent = day.summary;
  element("prev-day").disabled = index === 0;
  element("next-day").disabled = index === 13;
  const tasks = tasksFor(selectedDate);
  element("tasks").innerHTML = tasks.length ? tasks.map(task => `<div class="task ${task.done ? "done" : ""}"><input type="checkbox" id="check-${task.id}" data-check="${task.id}" ${task.done ? "checked" : ""}><div class="task-body"><label class="task-heading" for="check-${task.id}">${escapeHtml(task.title)}</label><p class="task-meta ${task.time ? "fixed" : ""}">${task.time || "灵活安排"} · ${escapeHtml(task.category)}${task.status !== "planned" ? ` · ${statuses[task.status]}` : ""}</p>${task.note ? `<p class="task-note">${escapeHtml(task.note)}</p>` : ""}${task.id === "ant-jd-preparation-1029" ? `<p class="task-note"><a href="${ANT_JD_URL}" target="_blank" rel="noopener noreferrer">蚂蚁官网 JD</a></p>` : ""}${task.id === "visa-submit" ? `<p class="task-note"><a href="${IMMIACCOUNT_URL}" target="_blank" rel="noopener noreferrer">ImmiAccount · 继续检查申请草稿</a></p>` : ""}</div><div class="task-actions"><button class="icon-button" data-edit="${task.id}" title="编辑事项" aria-label="编辑 ${escapeHtml(task.title)}"><i data-lucide="pencil"></i></button><button class="icon-button" data-delete="${task.id}" title="删除事项" aria-label="删除 ${escapeHtml(task.title)}"><i data-lucide="trash-2"></i></button></div></div>`).join("") : '<p class="muted small">今天先留白。</p>';
  const note = state.days[selectedDate] || { flight: false, flightNote: "", note: "" };
  element("flight-check").checked = note.flight;
  element("flight-note").value = note.flightNote;
  element("day-note").value = note.note;
  element("save-status").textContent = "仅保存在当前浏览器";
  document.querySelector(".detail-panel").scrollTop = 0;
  icons();
}
function selectDay(date, scroll = false) {
  selectedDate = date;
  renderDays(); renderDetail();
  if (scroll && matchMedia("(max-width: 650px)").matches) document.querySelector(".detail-panel").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
element("days").addEventListener("click", event => { const card = event.target.closest("[data-date]"); if (card) selectDay(card.dataset.date, true); });
document.querySelectorAll("[data-week]").forEach(button => button.addEventListener("click", () => {
  week = button.dataset.week;
  document.querySelectorAll("[data-week]").forEach(tab => { tab.classList.toggle("active", tab === button); tab.setAttribute("aria-pressed", String(tab === button)); });
  const index = dates.findIndex(day => day.iso === selectedDate);
  if (week === "1" && index >= 7) selectDay(dates[0].iso);
  else if (week === "2" && index < 7) selectDay(dates[7].iso);
  else renderDays();
}));
["category", "hide-done"].forEach(id => element(id).addEventListener("change", renderDays));
for (const [id, offset] of [["prev-day", -1], ["next-day", 1]]) element(id).addEventListener("click", () => {
  const index = dates.findIndex(day => day.iso === selectedDate) + offset;
  if (dates[index]) {
    if (week !== "all" && String(index < 7 ? 1 : 2) !== week) document.querySelector(`[data-week="${index < 7 ? 1 : 2}"]`).click();
    selectDay(dates[index].iso);
  }
});
element("tasks").addEventListener("change", event => {
  const task = state.tasks.find(item => item.id === event.target.dataset.check);
  if (task) { task.done = event.target.checked; persist(); renderDays(); event.target.closest(".task").classList.toggle("done", task.done); }
});
function openTask(task) {
  editingId = task?.id || null;
  element("dialog-title").textContent = task ? "编辑事项" : "添加事项";
  for (const [field, value] of Object.entries({ title: task?.title || "", date: task?.date || selectedDate, time: task?.time || "", category: task?.category || categories[0], status: task?.status || "planned", note: task?.note || "" })) element(`task-${field}`).value = value;
  element("task-dialog").showModal();
  element("task-title").focus();
}
element("add-task").addEventListener("click", () => openTask());
element("close-dialog").addEventListener("click", () => element("task-dialog").close());
element("tasks").addEventListener("click", event => {
  const edit = event.target.closest("[data-edit]");
  const remove = event.target.closest("[data-delete]");
  if (edit) openTask(state.tasks.find(task => task.id === edit.dataset.edit));
  if (remove) {
    const task = state.tasks.find(item => item.id === remove.dataset.delete);
    if (confirm(`删除“${task.title}”？`)) { state.tasks = state.tasks.filter(item => item.id !== task.id); persist(); renderDays(); renderDetail(); }
  }
});
element("task-form").addEventListener("submit", event => {
  event.preventDefault();
  const task = { id: editingId || `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, done: false };
  for (const field of ["title", "date", "time", "category", "status", "note"]) task[field] = element(`task-${field}`).value.trim();
  if (!task.title || !isDate(task.date)) { notify("请填写事项，并选择这两周内的日期。"); return; }
  const index = state.tasks.findIndex(item => item.id === editingId);
  if (index >= 0) { task.done = state.tasks[index].done; state.tasks[index] = task; } else state.tasks.push(task);
  persist(); element("task-dialog").close();
  if (week !== "all" && String(dates.findIndex(day => day.iso === task.date) < 7 ? 1 : 2) !== week) document.querySelector('[data-week="all"]').click();
  selectDay(task.date);
});
function saveDayNote() {
  state.days[selectedDate] = { flight: element("flight-check").checked, flightNote: element("flight-note").value, note: element("day-note").value };
  persist();
}
["flight-note", "day-note"].forEach(id => element(id).addEventListener("input", saveDayNote));
element("flight-check").addEventListener("change", saveDayNote);
element("export").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = `AussieGo-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
element("import").addEventListener("click", () => element("import-file").click());
element("import-file").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 5000000) throw new Error("File too large");
    const imported = JSON.parse(await file.text());
    if (!validState(imported)) throw new Error("Invalid backup");
    if (confirm("恢复备份会替换当前所有事项与笔记。继续吗？")) { state = imported; persist(); renderDays(); renderDetail(); renderCore40(); notify("备份已恢复。"); }
  } catch { notify("无法恢复：请选择有效的 AussieGo JSON 备份（不超过 5 MB）。"); }
  event.target.value = "";
});
element("print").addEventListener("click", () => window.print());
renderDays(); renderDetail(); renderCore40();
if (needsMigration) persist();
if (storageWarning) notify(storageWarning);