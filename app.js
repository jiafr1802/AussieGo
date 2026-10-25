"use strict";

const STORAGE_KEY = "aussiego-planner-v1";
const categories = ["学业 / 实验", "求职", "签证", "生活"];
const statuses = { planned: "已安排", tentative: "待定", suggested: "建议安排" };
const dayInfo = [
  ["先把重要的事启动", "户口证明、实验、请假与面试。给项目复习留出至少一小时。"],
  ["材料准备日", "银行流水与七份开题报告，出门前确认材料。"],
  ["开题答辩", "14:00 的重要节点。报告提前一天打印好。"],
  ["去清华，见一见新机会", "日历记录 Apple 宣讲 19:00—20:00，记得带英文简历；今天也是 H 生日。银行流水备选日。"],
  ["收一收尾，也见见朋友", "和 lyq、dsy 喝酒暂定，等大家确认。"],
  ["留给签证的一段时间", "建议今天集中核对材料、完成线上申请；具体办理日可以调整。"],
  ["校友相聚的周日", "辽宁省实验中学北京校友会迎新会 · 正大中心南塔 18 层，13:00 起签到。"],
  ["新一周，LC 与报销", "日历中的“重启 LC”跨 11 月 1—2 日。暂放济州岛 KDD 会议报销：打印材料、交 Y 老师，后续等反馈。"],
  ["把时间留给进展", "暂无已确认安排。"],
  ["一周的中点", "暂无已确认安排。"],
  ["继续向前", "暂无已确认安排。"],
  ["一万零一夜，派对之约", "21:00 开始 · 庆祝出生第 10001 天；按自己的 MBTI 穿对应颜色的衣服。地点与散场时间待确认。"],
  ["立冬，周末自己的时间", "日历节气：立冬。"],
  ["下一段之前", "暂无已确认安排。"],
];
const dates = Array.from({ length: 14 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 9, 26 + index));
  return { iso: date.toISOString().slice(0, 10), short: `${date.getUTCMonth() + 1}.${String(date.getUTCDate()).padStart(2, "0")}`, weekday: `周${"日一二三四五六"[date.getUTCDay()]}`, title: dayInfo[index][0], summary: dayInfo[index][1] };
});
const seedTasks = [
  { id: "household", date: "2026-10-26", title: "派出所开户口证明", category: "签证", note: "出发前确认办理网点、办公时间及所需证件。" },
  { id: "experiment", date: "2026-10-26", title: "尝试把实验跑起来", category: "学业 / 实验", note: "记录启动结果、报错和下一步。" },
  { id: "mentor", date: "2026-10-26", title: "向 MSRA mentor 请周会假", category: "学业 / 实验", note: "确认请假对应的会议日期，并同步本周进度。" },
  { id: "review", date: "2026-10-26", title: "复习项目经历 · 至少 1 小时", category: "求职", note: "建议在面试前安排；梳理背景、个人贡献、技术选择与结果。" },
  { id: "ctrip", date: "2026-10-26", time: "19:00", title: "携程面试", category: "求职", note: "提前检查通知、入口与设备。结束时间以面试通知为准。" },
  { id: "eyeshadow", date: "2026-10-26", title: "试试蓝色系眼影", category: "生活", note: "留一点属于自己的时间。" },
  { id: "bank", date: "2026-10-27", title: "银行打印流水", category: "签证", note: "10.27 / 10.29 二选一，暂放 27 日。若改到 29 日，可编辑日期；确认流水时间范围、语言和盖章要求。" },
  { id: "print-report", date: "2026-10-27", title: "打印开题报告 7 份", category: "学业 / 实验", note: "确认最终版本、页码及学院装订要求。" },
  { id: "defense", date: "2026-10-28", time: "14:00", title: "开题答辩", category: "学业 / 实验", note: "带好开题报告；答辩地点与提前到场时间待补充。" },
  { id: "apple", date: "2026-10-29", title: "清华 Apple 开放日 · 带英文简历", category: "求职", note: "晚上参加，具体时间与场地待确认。出门前带好英文简历并核对入校要求。" },
  { id: "friends", date: "2026-10-30", title: "和 lyq、dsy 一起喝酒", category: "生活", status: "tentative", note: "周五可能相约，时间与地点待大家确认。" },
  { id: "visa-submit", date: "2026-10-31", title: "本周完成澳大利亚签证线上申请", category: "签证", status: "suggested", note: "本周目标，暂建议安排在周六，并非已确认预约。核对适用签证类别和官方材料清单；上传后复查并保存提交凭证。" },
  { id: "alumni-checkin", date: "2026-11-01", time: "13:00", title: "校友迎新会 · 签到、自由拍照合影", category: "生活", note: "13:00—13:30 签到与合影。\n地点：北京市朝阳区正大中心南塔 18 层。" },
  { id: "alumni-welcome", date: "2026-11-01", time: "13:30", title: "辽宁省实验中学北京校友会2026年迎新会", category: "生活", note: "13:30—17:30 迎新座谈交流。\n地点：北京市朝阳区正大中心南塔 18 层。\n主办单位：辽宁省实验中学北京校友会。\n活动不收取费用，会后聚餐另行收取餐费。" },
  { id: "alumni-dinner", date: "2026-11-01", time: "17:30", title: "校友迎新会 · 会后聚餐", category: "生活", note: "17:30—20:00 会后聚餐。\n餐费：在校校友 50 元/人，工作校友 100 元/人。\n聚餐具体地点待确认。" },
  { id: "kdd-reimbursement", date: "2026-11-02", title: "报销济州岛 KDD 会议 · 打印材料并交 Y 老师", category: "学业 / 实验", status: "suggested", note: "第二周待办，暂放 11 月 2 日（周一），并非已确认预约，具体办理日可调整。\n1. 先打印报销材料。\n2. 把材料交给 Y 老师。\n3. 等 Y 老师反馈，再按反馈补充或修改材料。\n材料清单、交接时间与反馈日期待确认。" },
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
  if (!value || ![1, 2, 3, 4, 5, 6, 7].includes(value.version) || !Array.isArray(value.tasks) || value.tasks.length > 2000 || !value.days || typeof value.days !== "object" || Array.isArray(value.days)) return false;
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
  element("tasks").innerHTML = tasks.length ? tasks.map(task => `<div class="task ${task.done ? "done" : ""}"><input type="checkbox" id="check-${task.id}" data-check="${task.id}" ${task.done ? "checked" : ""}><div class="task-body"><label class="task-heading" for="check-${task.id}">${escapeHtml(task.title)}</label><p class="task-meta ${task.time ? "fixed" : ""}">${task.time || "灵活安排"} · ${escapeHtml(task.category)}${task.status !== "planned" ? ` · ${statuses[task.status]}` : ""}</p>${task.note ? `<p class="task-note">${escapeHtml(task.note)}</p>` : ""}</div><div class="task-actions"><button class="icon-button" data-edit="${task.id}" title="编辑事项" aria-label="编辑 ${escapeHtml(task.title)}"><i data-lucide="pencil"></i></button><button class="icon-button" data-delete="${task.id}" title="删除事项" aria-label="删除 ${escapeHtml(task.title)}"><i data-lucide="trash-2"></i></button></div></div>`).join("") : '<p class="muted small">今天先留白。</p>';
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
    if (confirm("恢复备份会替换当前所有事项与笔记。继续吗？")) { state = imported; persist(); renderDays(); renderDetail(); notify("备份已恢复。"); }
  } catch { notify("无法恢复：请选择有效的 AussieGo JSON 备份（不超过 5 MB）。"); }
  event.target.value = "";
});
element("print").addEventListener("click", () => window.print());
renderDays(); renderDetail();
if (needsMigration) persist();
if (storageWarning) notify(storageWarning);