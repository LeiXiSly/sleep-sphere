/* 睡眠球体 · 主逻辑（中英双语） */
(function () {
  'use strict';

  var KEY = 'sleepSphere.v1';
  var GA = Math.PI * (3 - Math.sqrt(5)); // 黄金角

  /* ================= 词库 ================= */
  var S = {
    zh: {
      'brand.title': '睡眠球体', 'brand.sub': '把一个月，长成一座建筑',
      'nav.today': '今天', 'nav.prev': '上一月 / 上一周', 'nav.next': '下一月 / 下一周',
      'view.week': '周', 'view.month': '月',
      'act.demo': '示例数据', 'act.export': '导出', 'act.clear': '清空', 'act.build': '生成结构',
      'cal.title': '睡眠日历', 'cal.hint': '点一下日期即可填写',
      'cal.logged': '本月已记录 {n} 天',
      'q.verybad': '很差', 'q.poor': '偏差', 'q.okay': '一般', 'q.good': '不错', 'q.great': '很好',
      'viz.title': '睡眠结构', 'viz.spin': '自转', 'viz.save': '存图',
      'viz.empty': '填写几天睡眠后<br />点击「生成结构」',
      'viz.avg': '平均分', 'viz.nodes': '节点', 'viz.swing': '波动',
      'insight.title': '睡眠画像', 'insight.from': '基于 {n} 天记录', 'insight.fromAll': '基于已记录数据',
      'insight.empty': '还没有数据。先记录几天，或者点「示例数据」看看效果。',
      'insight.min': '至少记录 2 天，才能看出规律。先填几天，或者点「示例数据」。',
      'm.avg': '平均质量', 'm.std': '波动', 'm.days': '记录天数', 'm.weekday': '工作日', 'm.hours': '平均时长',
      'spark.title': '睡眠节律 · 整月走势',
      'f.title': '什么在影响你的睡眠（左：拉低　右：拉高，单位：分）',
      'f.days': '{n}天', 'f.also': '（兼有{a}）',
      'edit.quality': '睡眠质量', 'edit.qualityUnit': '/ 10，也可以直接填数字',
      'edit.hours': '睡眠时长（小时）', 'edit.hoursPh': '如 7.5', 'edit.bedtime': '入睡时间',
      'edit.tags': '这一天做了什么 / 发生了什么', 'edit.customPh': '自定义关键词，回车添加',
      'edit.note': '备注（可选）', 'edit.notePh': '今天睡前看了很久手机…',
      'edit.delete': '清除这天', 'edit.cancel': '取消', 'edit.save': '保存',
      'tip.unit': '分', 'day.empty': '未记录', 'week.prefix': '周',
      'clear.confirm': '清空 {p} 的全部睡眠记录？此操作不可撤销。',
      'a.neg': '「{name}」出现了 {n} 天，当天平均低 {d} {u} —— {tip}',
      'a.negPlain': '「{name}」出现的 {n} 天里，睡眠平均低 {d} {u}。值得单独盯一周看看。',
      'a.pos': '「{name}」是正向因素（+{d} {u}）—— {tip}',
      'a.posPlain': '「{name}」对你的睡眠是加分项（+{d} {u}），可以多用。',
      'a.stdHigh': '波动偏大（标准差 {d}）。先求稳，再求多——固定起床时间是降低波动最快的一招。',
      'a.stdLow': '波动很小（标准差 {d}），这是好事。稳，比偶尔睡到 9 分更重要。',
      'a.weekend': '周末比工作日高 {d} {u}，典型的社交时差。周末起床时间别比平时晚超过 1 小时。',
      'a.more': '继续记录至少两周，标签和睡眠之间的因果关系才会真正显形。'
    },
    en: {
      'brand.title': 'Sleep Sphere', 'brand.sub': 'Grow a month into a structure',
      'nav.today': 'Today', 'nav.prev': 'Previous', 'nav.next': 'Next',
      'view.week': 'Week', 'view.month': 'Month',
      'act.demo': 'Demo', 'act.export': 'Export', 'act.clear': 'Clear', 'act.build': 'Build',
      'cal.title': 'Sleep Calendar', 'cal.hint': 'Tap a day to log it',
      'cal.logged': '{n} days logged this month',
      'q.verybad': 'Terrible', 'q.poor': 'Poor', 'q.okay': 'Okay', 'q.good': 'Good', 'q.great': 'Great',
      'viz.title': 'Sleep Structure', 'viz.spin': 'Spin', 'viz.save': 'Save PNG',
      'viz.empty': 'Log a few nights,<br />then hit "Build"',
      'viz.avg': 'Avg', 'viz.nodes': 'Nodes', 'viz.swing': 'Swing',
      'insight.title': 'Sleep Portrait', 'insight.from': 'from {n} days', 'insight.fromAll': 'from your logs',
      'insight.empty': 'No data yet. Log a few days, or hit "Demo".',
      'insight.min': 'Log at least 2 days to see a pattern.',
      'm.avg': 'Avg quality', 'm.std': 'Volatility', 'm.days': 'Days logged', 'm.weekday': 'Weekday', 'm.hours': 'Avg hours',
      'spark.title': 'Rhythm · this month',
      'f.title': 'What moves your sleep (left: drags down   right: lifts up, unit: pts)',
      'f.days': '{n}d', 'f.also': ' (also {a})',
      'edit.quality': 'Sleep quality', 'edit.qualityUnit': '/ 10 — or just type a number',
      'edit.hours': 'Sleep duration (hours)', 'edit.hoursPh': 'e.g. 7.5', 'edit.bedtime': 'Bedtime',
      'edit.tags': 'What happened that day', 'edit.customPh': 'Custom tag, press Enter',
      'edit.note': 'Note (optional)', 'edit.notePh': 'Scrolled my phone for an hour before bed…',
      'edit.delete': 'Clear day', 'edit.cancel': 'Cancel', 'edit.save': 'Save',
      'tip.unit': 'pts', 'day.empty': 'No record', 'week.prefix': '',
      'clear.confirm': 'Clear all sleep records for {p}? This cannot be undone.',
      'a.neg': '"{name}" showed up on {n} days, averaging {d} {u} lower — {tip}',
      'a.negPlain': 'On the {n} days "{name}" appeared, sleep averaged {d} {u} lower. Worth watching for a week.',
      'a.pos': '"{name}" is a positive factor (+{d} {u}) — {tip}',
      'a.posPlain': '"{name}" helps your sleep (+{d} {u}). Use it more.',
      'a.stdHigh': 'High volatility (SD {d}). Seek stability before duration — a fixed wake time is the fastest fix.',
      'a.stdLow': 'Low volatility (SD {d}) — that is a good thing. Steady beats the occasional perfect night.',
      'a.weekend': 'Weekends score {d} {u} higher than weekdays — classic social jetlag. Keep weekend wake time within 1 hour.',
      'a.more': 'Keep logging for at least two weeks; cause and effect only shows up with enough nights.'
    }
  };

  var GROUPS = {
    diet: { zh: '饮食', en: 'Diet' },
    body: { zh: '身体', en: 'Body' },
    schedule: { zh: '作息', en: 'Schedule' },
    mood: { zh: '情绪', en: 'Mood' },
    env: { zh: '环境', en: 'Environment' },
    custom: { zh: '自定义', en: 'Custom' }
  };

  var TAGS = [
    { id: 'coffee', zh: '喝咖啡', en: 'Coffee', group: 'diet', color: '#C98A4B' },
    { id: 'tea', zh: '浓茶', en: 'Strong tea', group: 'diet', color: '#7FA86B' },
    { id: 'alcohol', zh: '饮酒', en: 'Alcohol', group: 'diet', color: '#C4657A' },
    { id: 'latenight_food', zh: '吃宵夜', en: 'Late-night food', group: 'diet', color: '#E0A75E' },

    { id: 'sport', zh: '运动', en: 'Exercise', group: 'body', color: '#4FD1A5' },
    { id: 'yoga', zh: '拉伸瑜伽', en: 'Stretching / yoga', group: 'body', color: '#6FD3C7' },
    { id: 'walk', zh: '长时间走路', en: 'Long walk', group: 'body', color: '#8CCF79' },
    { id: 'shower', zh: '睡前热水澡', en: 'Hot shower', group: 'body', color: '#7FE3D4' },
    { id: 'sick', zh: '身体不适', en: 'Feeling unwell', group: 'body', color: '#E57373' },
    { id: 'med', zh: '吃药', en: 'Medication', group: 'body', color: '#B39DDB' },

    { id: 'overwork', zh: '熬夜工作', en: 'Worked late', group: 'schedule', color: '#7C8CFF' },
    { id: 'gaming', zh: '打游戏', en: 'Gaming', group: 'schedule', color: '#A77BFF' },
    { id: 'phone', zh: '刷手机到深夜', en: 'Doom-scrolling', group: 'schedule', color: '#6FA8DC' },
    { id: 'nap', zh: '午睡', en: 'Nap', group: 'schedule', color: '#62B6CB' },
    { id: 'late_bed', zh: '入睡很晚', en: 'Very late bedtime', group: 'schedule', color: '#5B7BD5' },
    { id: 'early_up', zh: '早起', en: 'Early rise', group: 'schedule', color: '#F0C46A' },
    { id: 'irregular', zh: '作息不规律', en: 'Irregular schedule', group: 'schedule', color: '#9AA3B8' },
    { id: 'travel', zh: '出差/旅行', en: 'Travel', group: 'schedule', color: '#5EC8E8' },

    { id: 'stress', zh: '压力大', en: 'High stress', group: 'mood', color: '#FF7A6B' },
    { id: 'anxiety', zh: '焦虑', en: 'Anxiety', group: 'mood', color: '#FF9F6B' },
    { id: 'lowmood', zh: '情绪低落', en: 'Low mood', group: 'mood', color: '#8A93B8' },
    { id: 'social', zh: '社交到很晚', en: 'Late socializing', group: 'mood', color: '#FF8FC7' },
    { id: 'breath', zh: '呼吸/冥想', en: 'Breathing / meditation', group: 'mood', color: '#9FD8FF' },

    { id: 'hot', zh: '房间太热/太冷', en: 'Room too hot / cold', group: 'env', color: '#FF9A76' },
    { id: 'noise', zh: '噪音', en: 'Noise', group: 'env', color: '#B0B7C9' }
  ];
  var TAG_MAP = {};
  TAGS.forEach(function (t) { TAG_MAP[t.id] = t; });

  /* ================= 工具 ================= */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dkey(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function parseKey(k) { var a = k.split('-'); return new Date(+a[0], +a[1] - 1, +a[2]); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function $(id) { return document.getElementById(id); }

  function hexRgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function mix(a, b, t) {
    var A = hexRgb(a), B = hexRgb(b);
    return '#' + [0, 1, 2].map(function (i) {
      var v = Math.round(A[i] + (B[i] - A[i]) * t).toString(16);
      return v.length < 2 ? '0' + v : v;
    }).join('');
  }
  var Q_STOPS = [[1, '#4C6FFF'], [3.5, '#4F8CFF'], [5.5, '#3FA9C9'], [7.5, '#4FD1A5'], [9, '#A8E063'], [10, '#FFD98A']];
  function qColor(q) {
    q = clamp(q, 1, 10);
    for (var i = 0; i < Q_STOPS.length - 1; i++) {
      if (q <= Q_STOPS[i + 1][0]) {
        var t = (q - Q_STOPS[i][0]) / (Q_STOPS[i + 1][0] - Q_STOPS[i][0]);
        return mix(Q_STOPS[i][1], Q_STOPS[i + 1][1], clamp(t, 0, 1));
      }
    }
    return Q_STOPS[Q_STOPS.length - 1][1];
  }
  function qLabel(q) {
    return t('q.' + (q <= 2 ? 'verybad' : q <= 4 ? 'poor' : q <= 6 ? 'okay' : q <= 8 ? 'good' : 'great'));
  }

  /* ================= 状态 ================= */
  var state = { view: 'month', cursor: new Date(), data: {}, custom: [], lang: 'zh', selected: null };

  function t(k, vars) {
    var s = (S[state.lang] && S[state.lang][k]) || S.zh[k] || k;
    if (vars) Object.keys(vars).forEach(function (v) {
      s = s.replace(new RegExp('\\{' + v + '\\}', 'g'), vars[v]);
    });
    return s;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var o = JSON.parse(raw);
        state.data = o.data || {};
        state.custom = o.custom || [];
        state.lang = o.lang === 'en' ? 'en' : 'zh';
      }
    } catch (e) { }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ data: state.data, custom: state.custom, lang: state.lang }));
    } catch (e) { }
  }

  function tagById(id) {
    if (TAG_MAP[id]) {
      var x = TAG_MAP[id];
      return { id: x.id, name: state.lang === 'en' ? x.en : x.zh, color: x.color };
    }
    var f = state.custom.filter(function (c) { return c.id === id; })[0];
    return f ? { id: f.id, name: f.name, color: f.color } : { id: id, name: id, color: '#9AA3B8' };
  }
  function allTags() {
    return TAGS.concat(state.custom.map(function (c) {
      return { id: c.id, zh: c.name, en: c.name, group: 'custom', color: c.color || '#9AA3B8' };
    }));
  }

  var WEEK_ZH = ['一', '二', '三', '四', '五', '六', '日'];
  var WEEK_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  function weekNames() { return state.lang === 'en' ? WEEK_EN : WEEK_ZH; }
  function weekPrefix() { return t('week.prefix'); }

  /* ================= 静态文案应用 ================= */
  function applyStatic() {
    document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
    $('langBtn').textContent = state.lang === 'en' ? '中' : 'EN';
  }

  /* ================= 日历 ================= */
  function monthEntries() {
    var y = state.cursor.getFullYear(), m = state.cursor.getMonth();
    var out = [];
    Object.keys(state.data).forEach(function (k) {
      var d = parseKey(k);
      if (d.getFullYear() === y && d.getMonth() === m) out.push({ k: k, d: d, v: state.data[k] });
    });
    out.sort(function (a, b) { return a.d - b.d; });
    return out;
  }

  function renderWeekdays() {
    var w = weekNames();
    $('weekdayRow').innerHTML = w.map(function (x) { return '<span>' + x + '</span>'; }).join('');
  }

  function renderMonth() {
    var y = state.cursor.getFullYear(), m = state.cursor.getMonth();
    var startIdx = (new Date(y, m, 1).getDay() + 6) % 7;
    var days = new Date(y, m + 1, 0).getDate();
    var prevDays = new Date(y, m, 0).getDate();
    var td = new Date(), tk = dkey(td.getFullYear(), td.getMonth(), td.getDate());
    var html = '';

    for (var i = 0; i < 42; i++) {
      var dn = i - startIdx + 1, cm = m, cd = dn, other = false;
      if (dn <= 0) { cm = m - 1; cd = prevDays + dn; other = true; }
      else if (dn > days) { cm = m + 1; cd = dn - days; other = true; }
      var dd = new Date(y, cm, cd);
      var k = dkey(dd.getFullYear(), dd.getMonth(), dd.getDate());
      var rec = state.data[k];
      var cls = 'day' + (other ? ' other' : '') + (k === tk ? ' today' : '') + (rec ? ' filled' : '');
      var inner = '<span class="dnum">' + dd.getDate() + '</span>';
      if (rec) {
        var col = qColor(rec.q);
        inner += '<span class="dscore" style="color:' + col + '">' + rec.q + '</span>';
        inner += '<span class="dtags">' + (rec.tags || []).slice(0, 5).map(function (tg) {
          return '<i class="dtag" style="background:' + tagById(tg).color + '"></i>';
        }).join('') + '</span>';
        inner += '<div class="glow" style="background:' + col + '"></div>';
      }
      html += '<button class="' + cls + '" data-k="' + k + '">' + inner + '</button>';
      if (dn > days && (i + 1) % 7 === 0) break;
    }
    $('monthGrid').innerHTML = html;
    $('monthGrid').querySelectorAll('.day').forEach(function (el) {
      el.onclick = function () { openDay(el.dataset.k); };
    });
  }

  function weekStart(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }

  function renderWeek() {
    var s = weekStart(state.cursor), w = weekNames();
    var td = new Date(), tk = dkey(td.getFullYear(), td.getMonth(), td.getDate());
    var html = '';
    for (var i = 0; i < 7; i++) {
      var d = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i);
      var k = dkey(d.getFullYear(), d.getMonth(), d.getDate());
      var rec = state.data[k];
      var col = rec ? qColor(rec.q) : '';
      var tags = rec ? (rec.tags || []).map(function (tg) {
        var o = tagById(tg);
        return '<span class="wtag" style="color:' + o.color + '">' + o.name + '</span>';
      }).join('') : '<span class="wempty">' + t('day.empty') + '</span>';
      html += '<button class="wday' + (k === tk ? ' today' : '') + '" data-k="' + k + '">' +
        '<span class="wname">' + weekPrefix() + w[i] + '</span>' +
        '<span class="wdnum">' + (d.getMonth() + 1) + '/' + d.getDate() + '</span>' +
        (rec ? '<span class="wscore" style="color:' + col + '">' + rec.q + '</span><span class="wlabel">' +
          qLabel(rec.q) + (rec.hours ? ' · ' + rec.hours + 'h' : '') + '</span>'
          : '<span class="wlabel">&nbsp;</span>') +
        '<span class="wtags">' + tags + '</span></button>';
    }
    $('weekView').innerHTML = html;
    $('weekView').querySelectorAll('.wday').forEach(function (el) {
      el.onclick = function () { openDay(el.dataset.k); };
    });
  }

  function monthLabel() {
    var y = state.cursor.getFullYear(), m = state.cursor.getMonth();
    if (state.lang === 'en') {
      return new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return y + '年' + (m + 1) + '月';
  }

  function renderPeriodLabel() {
    if (state.view === 'month') {
      $('periodLabel').textContent = monthLabel();
    } else {
      var s = weekStart(state.cursor);
      var e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
      $('periodLabel').textContent = (s.getMonth() + 1) + '/' + s.getDate() + ' – ' + (e.getMonth() + 1) + '/' + e.getDate();
    }
  }

  function renderCalendar() {
    renderPeriodLabel();
    if (state.view === 'month') {
      $('monthGrid').classList.remove('hidden');
      $('weekdayRow').classList.remove('hidden');
      $('weekView').classList.add('hidden');
      renderMonth();
    } else {
      $('monthGrid').classList.add('hidden');
      $('weekdayRow').classList.add('hidden');
      $('weekView').classList.remove('hidden');
      renderWeek();
    }
    $('fillHint').textContent = t('cal.logged', { n: monthEntries().length });
  }

  /* ================= 单日编辑 ================= */
  var editing = null;

  function openDay(k) {
    editing = k;
    var d = parseKey(k);
    var rec = state.data[k] || { q: 7, tags: [], hours: '', bed: '', note: '' };
    $('modalDate').textContent = state.lang === 'en'
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : (d.getMonth() + 1) + '月' + d.getDate() + '日';
    $('modalWeekday').textContent = weekPrefix() + weekNames()[(d.getDay() + 6) % 7];
    $('qRange').value = rec.q; $('qNum').value = rec.q; $('qVal').textContent = rec.q;
    $('sleepHours').value = rec.hours || '';
    $('bedTime').value = rec.bed || '';
    $('note').value = rec.note || '';
    renderTagGrid(rec.tags || []);
    markPreset(rec.q);
    $('dayModal').classList.add('on');
  }
  function closeDay() { $('dayModal').classList.remove('on'); editing = null; $('tooltip').style.opacity = 0; }

  function renderTagGrid(sel) {
    var groups = {}, order = [];
    allTags().forEach(function (tg) {
      if (!groups[tg.group]) { groups[tg.group] = []; order.push(tg.group); }
      groups[tg.group].push(tg);
    });
    var html = '';
    order.forEach(function (g) {
      html += '<div class="tag-group-title">' + (GROUPS[g] ? GROUPS[g][state.lang] : g) + '</div>';
      groups[g].forEach(function (tg) {
        var o = tagById(tg.id);
        html += '<button class="tag' + (sel.indexOf(tg.id) >= 0 ? ' on' : '') + '" data-id="' + tg.id + '">' +
          '<i class="dot" style="background:' + o.color + '"></i>' + o.name + '</button>';
      });
    });
    $('tagGrid').innerHTML = html;
    $('tagGrid').querySelectorAll('.tag').forEach(function (el) {
      el.onclick = function () { el.classList.toggle('on'); };
    });
  }
  function markPreset(q) {
    $('qPresets').querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('on', +b.dataset.q === q);
    });
  }
  function saveDay() {
    if (!editing) return;
    var tags = [];
    $('tagGrid').querySelectorAll('.tag.on').forEach(function (el) { tags.push(el.dataset.id); });
    state.data[editing] = {
      q: clamp(Math.round(+$('qNum').value || 7), 1, 10),
      tags: tags,
      hours: $('sleepHours').value ? parseFloat($('sleepHours').value) : '',
      bed: $('bedTime').value || '',
      note: $('note').value.trim()
    };
    save(); closeDay(); renderCalendar(); refreshViz(false);
  }

  /* ================= 3D 结构 ================= */
  function buildGraph() {
    var ents = monthEntries(), n = ents.length;
    var points = [], edges = [], faces = [], R = 1;
    if (!n) return { points: points, edges: edges, faces: faces, baseR: R };

    ents.forEach(function (e, i) {
      var qn = (e.v.q - 1) / 9;
      var y = n === 1 ? 0 : 1 - 2 * (i / (n - 1));
      var rad = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * GA;
      var r = R * (0.62 + 0.40 * qn);
      points.push({
        x: Math.cos(th) * rad * r, y: y * r, z: Math.sin(th) * rad * r,
        q: e.v.q, qn: qn, color: qColor(e.v.q),
        date: e.k, tags: e.v.tags || [], note: e.v.note || ''
      });
    });

    for (var i = 0; i < n - 1; i++) {
      var gap = Math.round((ents[i + 1].d - ents[i].d) / 86400000);
      if (gap <= 2) edges.push({ a: i, b: i + 1, w: 1 - Math.min(gap, 2) * 0.22, color: mix(points[i].color, points[i + 1].color, .5) });
      if (gap <= 3 && Math.abs(points[i].q - points[i + 1].q) <= 1) {
        edges.push({ a: i, b: i + 1, w: 0.28, color: mix(points[i].color, points[i + 1].color, .5) });
      }
    }

    Object.keys(tagCount(ents)).forEach(function (tid) {
      var idx = [];
      ents.forEach(function (e, i) { if ((e.v.tags || []).indexOf(tid) >= 0) idx.push(i); });
      if (idx.length < 2) return;
      var col = tagById(tid).color;
      for (var j = 0; j < idx.length - 1; j++) edges.push({ a: idx[j], b: idx[j + 1], w: 0.62, color: col });
      for (var j2 = 0; j2 < idx.length - 2; j2++) faces.push({ a: idx[j2], b: idx[j2 + 1], c: idx[j2 + 2], color: col, alpha: 0.075 });
    });

    for (var k = 0; k < n - 2; k++) {
      var g1 = Math.round((ents[k + 1].d - ents[k].d) / 86400000);
      var g2 = Math.round((ents[k + 2].d - ents[k + 1].d) / 86400000);
      if (g1 > 2 || g2 > 2) continue;
      var avg = (points[k].q + points[k + 1].q + points[k + 2].q) / 3;
      faces.push({ a: k, b: k + 1, c: k + 2, color: qColor(avg), alpha: 0.05 + 0.055 * ((avg - 1) / 9) });
    }
    return { points: points, edges: edges, faces: faces, baseR: R };
  }
  function tagCount(ents) {
    var m = {};
    ents.forEach(function (e) { (e.v.tags || []).forEach(function (x) { m[x] = (m[x] || 0) + 1; }); });
    Object.keys(m).forEach(function (k) { if (m[k] < 2) delete m[k]; });
    return m;
  }

  /* ================= 画像 ================= */
  var PERSONAS = {
    steady: {
      name: '节律稳固者', name_en: 'Steady Sleeper', score: 92,
      desc: '你的睡眠像一口老井，水位常年稳定。身体已经找到了自己的节拍，别轻易打破它。',
      desc_en: 'Your sleep runs like an old well — the level barely moves. Your body has found its own tempo; don\'t break it lightly.'
    },
    weekend: {
      name: '周末补觉族', name_en: 'Weekend Catch-Up', score: 84,
      desc: '工作日欠下的，都指望周末还。账单可以补，但利息一直在涨——睡眠债不接受分期。',
      desc_en: 'What the weekdays borrow, the weekend tries to repay. The debt can be paid, but the interest keeps running — sleep debt does not do installments.'
    },
    caffeine: {
      name: '咖啡因透支者', name_en: 'Caffeine Overdraft', score: 80,
      desc: '咖啡把你白天托起来，又在夜里悄悄把手抽走。那杯下午的拿铁，凌晨一点还在你血液里排队。',
      desc_en: 'Coffee lifts you through the day, then quietly pulls its hands away at night. That 3pm latte is still queued in your bloodstream at 1am.'
    },
    grinder: {
      name: '深夜赶工型', name_en: 'Midnight Grinder', score: 82,
      desc: '你把清醒的时间往后借，第二天再连本带利还回去。项目会结束，睡眠的账不会自动清零。',
      desc_en: 'You borrow waking hours from tomorrow and pay them back with interest. Projects end; the circadian bill never clears itself.'
    },
    mover: {
      name: '运动受益型', name_en: 'Movement Responder', score: 86,
      desc: '身体一旦被真正使用过，夜里就愿意好好修复。运动是你目前最可靠的一根锚。',
      desc_en: 'Once the body is genuinely used, it agrees to repair at night. Exercise is your most reliable anchor right now.'
    },
    weight: {
      name: '情绪负载型', name_en: 'Carrying Weight', score: 83,
      desc: '躺下之后，脑子还在开会。真正让你醒着的不是光和声音，是没卸下来的那点重量。',
      desc_en: 'You lie down, but the meeting in your head keeps going. What keeps you awake isn\'t light or noise — it\'s the weight you haven\'t put down.'
    },
    roller: {
      name: '过山车型', name_en: 'Rollercoaster', score: 78,
      desc: '你的睡眠像沙漠的昼夜温差，一天酷暑一天寒夜。身体最怕的不是睡得少，是永远猜不到明天。',
      desc_en: 'Your sleep swings like desert temperature — scorching one day, freezing the next. The body tolerates "less" better than "unpredictable".'
    },
    deficit: {
      name: '长期欠债者', name_en: 'Long-Term Deficit', score: 76,
      desc: '这不是某一晚的问题，是一整个月都在透支。先别追求完美，先让它稳定下来。',
      desc_en: 'This isn\'t one bad night; it\'s a month of overdraft. Don\'t chase perfection yet — chase consistency.'
    },
    traveler: {
      name: '探索中的睡眠旅人', name_en: 'Sleep Traveler', score: 70,
      desc: '你的睡眠还在找自己的形状。继续记录，规律会自己浮出水面。',
      desc_en: 'Your sleep is still looking for its shape. Keep recording — the pattern will surface on its own.'
    }
  };
  function pName(p) { return state.lang === 'en' ? p.name_en : p.name; }
  function pDesc(p) { return state.lang === 'en' ? p.desc_en : p.desc; }

  var TIPS = {
    coffee: {
      zh: '把咖啡因的关门时间定在<b>中午 12 点前</b>。半衰期约 5 小时，下午三点那杯，凌晨一点还在你血液里排队。',
      en: 'Close the caffeine window at <b>noon</b>. Half-life is about 5 hours — the 3pm cup is still queued in your blood at 1am.'
    },
    overwork: {
      zh: '给熬夜工作设一个<b>硬性收尾时间</b>（比如 23:30）。工作会自己膨胀填满时间，只有边界能拦住它。',
      en: 'Set a <b>hard cutoff</b> for late work (23:30, say). Work expands to fill the time; only a boundary stops it.'
    },
    phone: {
      zh: '睡前一小时把手机放到<b>伸手够不到</b>的地方。不是靠意志力，是靠距离。',
      en: 'Put the phone <b>out of arm\'s reach</b> one hour before bed. Not willpower — distance.'
    },
    late_bed: {
      zh: '别先盯着入睡时间，先固定<b>起床时间</b>。起床时间是锚，入睡时间会自己跟上来。',
      en: 'Don\'t chase bedtime — fix your <b>wake time</b> first. Wake time is the anchor; bedtime follows on its own.'
    },
    alcohol: {
      zh: '酒精让你更快睡着，但它会拆掉后半夜的深度睡眠。睡前 4 小时<b>停杯</b>，效果立竿见影。',
      en: 'Alcohol helps you fall asleep, then dismantles the second half of the night. <b>Stop 4 hours before bed</b> — the effect is immediate.'
    },
    latenight_food: {
      zh: '宵夜把消化的活儿留给了本该休息的身体。试着把晚餐往后挪一小时，替代掉宵夜。',
      en: 'Late food hands digestion to a body that should be resting. Move dinner an hour later instead.'
    },
    stress: {
      zh: '睡前 10 分钟做一次<b>「卸载」</b>：把明天要做的事写在纸上。写下来，大脑才肯放手。',
      en: 'Do a 10-minute <b>brain dump</b> before bed: write tomorrow\'s tasks on paper. The brain only lets go once it\'s written down.'
    },
    anxiety: {
      zh: '试试 4-7-8 呼吸（吸 4 秒、屏 7 秒、呼 8 秒），连续 4 轮。这是在手动拨慢你的交感神经。',
      en: 'Try 4-7-8 breathing (in 4, hold 7, out 8) for four rounds. You are manually downshifting your nervous system.'
    },
    gaming: {
      zh: '竞技类游戏会让皮质醇和心率在结束后还高位运行。把最后一局<b>提前到睡前 90 分钟</b>。',
      en: 'Competitive games leave cortisol and heart rate elevated after you stop. Move the last match to <b>90 minutes before bed</b>.'
    },
    hot: {
      zh: '入睡需要核心体温下降约 0.5℃。卧室 18–22℃、睡前热水澡（出浴后散热）反而助眠。',
      en: 'Falling asleep needs core temperature to drop ~0.5℃. Keep the room 18–22℃, and a hot shower helps — the cooling afterward is what works.'
    },
    noise: {
      zh: '固定白噪音能抹平突发声响的唤醒效应，比耳塞更容易坚持。',
      en: 'Steady white noise smooths out sudden sounds that would otherwise wake you — easier to sustain than earplugs.'
    },
    irregular: {
      zh: '作息不规律比睡得少更伤。先把<b>起床时间</b>钉死，其他变量会跟着收敛。',
      en: 'Irregularity hurts more than short sleep. Nail down your <b>wake time</b> and the rest of the variables converge.'
    },
    lowmood: {
      zh: '早晨 15 分钟的自然光，对情绪和褪黑素节律的帮助，比大多补剂都实在。',
      en: '15 minutes of morning daylight does more for mood and melatonin rhythm than most supplements.'
    },
    social: {
      zh: '深夜社交是很好的情绪补给，但把结束时间<b>提前半小时</b>，你会几乎不损失什么。',
      en: 'Late socializing is good fuel — but ending <b>30 minutes earlier</b> costs you almost nothing.'
    },
    sport: {
      zh: '把运动固定在<b>同一个时间段</b>，让它成为节律的锚点，而不是随机事件。',
      en: 'Fix exercise at the <b>same time of day</b> so it becomes a rhythm anchor, not a random event.'
    },
    yoga: {
      zh: '睡前拉伸是你已经验证过的开关，把它写进固定流程。',
      en: 'Stretching is a switch you have already tested — make it part of the fixed routine.'
    },
    walk: {
      zh: '白天的步行量在帮你累积睡眠压力，继续保持。',
      en: 'Daytime walking is building your sleep pressure. Keep it.'
    },
    shower: {
      zh: '热水澡的助眠作用来自出浴后的散热，安排在<b>睡前 60–90 分钟</b>最有效。',
      en: 'The benefit comes from cooling down afterward — schedule it <b>60–90 minutes before bed</b>.'
    },
    breath: {
      zh: '呼吸练习已经在起作用，把它固定在躺下后的第一件事。',
      en: 'Breathing work is already paying off — make it the first thing you do after lying down.'
    },
    nap: {
      zh: '午睡在帮你，但控制在 20 分钟内，别让它偷走晚上的睡眠压力。',
      en: 'Naps help, but keep them under 20 minutes so they don\'t steal tonight\'s sleep pressure.'
    },
    early_up: {
      zh: '早起当天睡得更好，说明你的节律偏早型，别硬扛着跟夜型人比。',
      en: 'Better sleep on early-rise days suggests a morning chronotype. Stop comparing yourself to night owls.'
    }
  };
  function tipFor(id) { var o = TIPS[id]; return o ? o[state.lang] : ''; }

  function analyze() {
    var ents = monthEntries();
    if (ents.length < 2) return null;
    var n = ents.length;
    var qs = ents.map(function (e) { return e.v.q; });
    var avg = qs.reduce(function (a, b) { return a + b; }, 0) / n;
    var variance = qs.reduce(function (a, q) { return a + (q - avg) * (q - avg); }, 0) / (n > 1 ? n - 1 : 1);
    var std = Math.sqrt(variance);
    var bi = 0, wi = 0;
    qs.forEach(function (q, i) { if (q > qs[bi]) bi = i; if (q < qs[wi]) wi = i; });

    var wd = [], we = [];
    ents.forEach(function (e) {
      var g = e.d.getDay();
      (g === 0 || g === 6 ? we : wd).push(e.v.q);
    });
    var meanOf = function (a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; };
    var wdAvg = meanOf(wd), weAvg = meanOf(we);
    var hrsAvg = meanOf(ents.filter(function (e) { return e.v.hours; }).map(function (e) { return e.v.hours; }));

    var factors = [], counts = {};
    ents.forEach(function (e) { (e.v.tags || []).forEach(function (x) { counts[x] = (counts[x] || 0) + 1; }); });
    Object.keys(counts).forEach(function (tid) {
      var w1 = [], w0 = [];
      ents.forEach(function (e) { ((e.v.tags || []).indexOf(tid) >= 0 ? w1 : w0).push(e.v.q); });
      if (!w1.length || !w0.length) return;
      var m1 = meanOf(w1), m0 = meanOf(w0), p = w1.length / n;
      factors.push({
        id: tid, name: tagById(tid).name, color: tagById(tid).color, count: w1.length,
        m1: m1, m0: m0, delta: m1 - m0, r: std > 0 ? ((m1 - m0) / std) * Math.sqrt(p * (1 - p)) : 0
      });
    });
    factors.sort(function (a, b) { return Math.abs(b.delta) - Math.abs(a.delta); });
    var f2 = factors.filter(function (f) { return f.count >= 2; });

    var byId = {};
    f2.forEach(function (f) { byId[f.id] = f; });

    return {
      n: n, avg: avg, std: std, best: ents[bi], worst: ents[wi],
      wdAvg: wdAvg, weAvg: weAvg, hrsAvg: hrsAvg,
      factors: f2.slice(0, 6), persona: pickPersona(avg, std, wdAvg, weAvg, byId), series: ents
    };
  }

  function pickPersona(avg, std, wdAvg, weAvg, byId) {
    var c = [];
    var add = function (k) { c.push(PERSONAS[k]); };
    if (avg >= 7.4 && std <= 1.6) add('steady');
    if (weAvg && wdAvg && weAvg - wdAvg >= 1.2) add('weekend');
    if (byId.coffee && byId.coffee.delta <= -0.9) add('caffeine');
    if (byId.overwork && byId.overwork.count >= 2 && byId.overwork.delta <= -0.6) add('grinder');
    if (byId.sport && byId.sport.delta >= 0.9) add('mover');
    if ((byId.stress || byId.anxiety) && (byId.stress || byId.anxiety).delta <= -0.9) add('weight');
    if (std >= 2.4) add('roller');
    if (avg <= 5.2) add('deficit');
    if (!c.length) add('traveler');
    c.sort(function (a, b) { return b.score - a.score; });
    var p = c[0];
    return { name: pName(p), desc: pDesc(p), alts: c.slice(1, 3).map(pName) };
  }

  function adviceFor(a) {
    var out = [], U = t('tip.unit');
    var neg = a.factors.filter(function (f) { return f.delta < -0.6; }).slice(0, 2);
    var pos = a.factors.filter(function (f) { return f.delta > 0.6; }).slice(0, 2);

    neg.forEach(function (f) {
      var tip = tipFor(f.id);
      out.push(tip
        ? t('a.neg', { name: f.name, n: f.count, d: Math.abs(f.delta).toFixed(1), u: U, tip: tip })
        : t('a.negPlain', { name: f.name, n: f.count, d: Math.abs(f.delta).toFixed(1), u: U }));
    });
    pos.forEach(function (f) {
      var tip = tipFor(f.id);
      out.push(tip
        ? t('a.pos', { name: f.name, d: f.delta.toFixed(1), u: U, tip: tip })
        : t('a.posPlain', { name: f.name, d: f.delta.toFixed(1), u: U }));
    });

    if (a.std >= 2.2) out.push(t('a.stdHigh', { d: a.std.toFixed(1) }));
    else if (a.std <= 1.3) out.push(t('a.stdLow', { d: a.std.toFixed(1) }));
    if (a.weAvg && a.wdAvg && a.weAvg - a.wdAvg >= 1.2) {
      out.push(t('a.weekend', { d: (a.weAvg - a.wdAvg).toFixed(1), u: U }));
    }
    if (out.length < 3) out.push(t('a.more'));
    return out.slice(0, 5);
  }

  /* ================= 画像渲染 ================= */
  function renderInsight() {
    var a = analyze(), box = $('insightBody');
    if (!a) {
      box.innerHTML = '<div class="empty-state">' + t('insight.min') + '</div>';
      $('insightHint').textContent = t('insight.fromAll');
      return;
    }
    $('insightHint').textContent = t('insight.from', { n: a.n });

    var ringPct = Math.round(clamp(a.avg / 10, 0, 1) * 100);
    var html = '<div class="persona">' +
      '<div class="pring" style="--ring-p:' + ringPct + '%;--ring-c:' + qColor(a.avg) + '"><span>' + a.avg.toFixed(1) + '</span></div>' +
      '<div><div class="pname">' + a.persona.name + '</div><div class="pdesc">' + a.persona.desc +
      (a.persona.alts.length ? ' <span style="color:var(--text-3)">' + t('f.also', { a: a.persona.alts.join(state.lang === 'en' ? ', ' : '、') }) + '</span>' : '') +
      '</div></div></div>';

    html += '<div class="metrics">' +
      metric(t('m.avg'), a.avg.toFixed(1), qColor(a.avg)) +
      metric(t('m.std'), a.std.toFixed(1), a.std > 2.2 ? '#FF9F6B' : '#4FD1A5') +
      metric(t('m.days'), a.n, '#E7EAF2') +
      metric(a.hrsAvg ? t('m.hours') : t('m.weekday'), a.hrsAvg ? a.hrsAvg.toFixed(1) + 'h' : (a.wdAvg ? a.wdAvg.toFixed(1) : '—'), '#9FD8FF') +
      '</div>';

    html += '<div class="spark-wrap"><div class="stitle">' + t('spark.title') + '</div>' + spark(a.series) + '</div>';

    if (a.factors.length) {
      var maxAbs = Math.max(0.8, Math.max.apply(null, a.factors.map(function (f) { return Math.abs(f.delta); })));
      html += '<div class="factors"><div class="ftitle">' + t('f.title') + '</div>';
      a.factors.forEach(function (f) {
        var w = clamp(Math.abs(f.delta) / maxAbs, 0.06, 1) * 50;
        html += '<div class="frow"><span class="fname" style="color:' + f.color + '">' + f.name + '</span>' +
          '<span class="fbar' + (f.delta < 0 ? ' neg' : ' pos') + '"><span class="faxis"></span><i style="width:' + w + '%"></i></span>' +
          '<span class="fval" style="color:' + (f.delta < 0 ? '#FF7A6B' : '#4FD1A5') + '">' + (f.delta > 0 ? '+' : '') + f.delta.toFixed(1) + '</span>' +
          '<span class="fcnt">' + t('f.days', { n: f.count }) + '</span></div>';
      });
      html += '</div>';
    }

    html += '<ul class="advice">' + adviceFor(a).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    box.innerHTML = html;

    $('vizStats').innerHTML =
      '<div><b style="color:' + qColor(a.avg) + '">' + a.avg.toFixed(1) + '</b><span>' + t('viz.avg') + '</span></div>' +
      '<div><b>' + a.n + '</b><span>' + t('viz.nodes') + '</span></div>' +
      '<div><b>' + a.std.toFixed(1) + '</b><span>' + t('viz.swing') + '</span></div>';
  }
  function metric(k, v, col) {
    return '<div class="metric"><div class="mk">' + k + '</div><div class="mv" style="color:' + col + '">' + v + '</div></div>';
  }
  function spark(series) {
    var W = 100, H = 30;
    var days = new Date(state.cursor.getFullYear(), state.cursor.getMonth() + 1, 0).getDate();
    var pts = series.map(function (e) {
      return { x: (e.d.getDate() - 1) / Math.max(1, days - 1) * W, y: H - ((e.v.q - 1) / 9) * (H - 6) - 3, q: e.v.q };
    });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(2) + ' ' + p.y.toFixed(2); }).join(' ');
    var area = d + ' L' + pts[pts.length - 1].x.toFixed(2) + ' ' + H + ' L' + pts[0].x.toFixed(2) + ' ' + H + ' Z';
    var dots = pts.map(function (p) {
      return '<circle cx="' + p.x.toFixed(2) + '" cy="' + p.y.toFixed(2) + '" r="1.1" fill="' + qColor(p.q) + '"/>';
    }).join('');
    var grad = pts.map(function (p, i) {
      return '<stop offset="' + (i / Math.max(1, pts.length - 1) * 100).toFixed(1) + '%" stop-color="' + qColor(p.q) + '"/>';
    }).join('');
    return '<svg class="spark" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">' + grad + '</linearGradient>' +
      '<linearGradient id="sgf" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="rgba(124,140,255,.28)"/><stop offset="1" stop-color="rgba(124,140,255,0)"/></linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#sgf)"/>' +
      '<path d="' + d + '" fill="none" stroke="url(#sg)" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>' +
      dots + '</svg>';
  }

  /* ================= 3D 视图 ================= */
  var viz = null;
  function initViz() {
    viz = new SphereViz($('sphere'), {
      onHover: function (h) {
        var tip = $('tooltip');
        if (!h) { tip.style.opacity = 0; return; }
        var p = h.point;
        var tags = p.tags.map(function (x) { return tagById(x).name; }).join(' · ');
        tip.innerHTML = '<b style="color:' + p.color + '">' + p.date.slice(5).replace('-', '/') + ' · ' +
          p.q + ' ' + qLabel(p.q) + '</b>' + (tags ? '<br>' + tags : '') +
          (p.note ? '<br><span style="color:#646D82">' + p.note + '</span>' : '');
        tip.style.left = h.sx + 'px'; tip.style.top = h.sy + 'px'; tip.style.opacity = 1;
      }
    });
    viz.onSpinChange = function (v) { $('spinBtn').classList.toggle('on', v); };
  }
  function refreshViz(play) {
    var g = buildGraph();
    viz.setData(g);
    var empty = g.points.length === 0;
    $('vizEmpty').classList.toggle('hide', !empty);
    renderInsight();
    if (play && !empty) viz.play();
    else if (empty) { viz.t = 1; $('vizStats').innerHTML = ''; }
  }

  /* ================= 示例数据 ================= */
  function demo() {
    var y = state.cursor.getFullYear(), m = state.cursor.getMonth();
    var days = new Date(y, m + 1, 0).getDate();
    var today = new Date();
    for (var d = 1; d <= days; d++) {
      var dt = new Date(y, m, d);
      if (dt > today) continue;
      if (Math.random() < 0.12) continue;
      var weekend = dt.getDay() === 0 || dt.getDay() === 6;
      var q = 6.6 + (weekend ? 1.1 : 0) + (Math.random() * 2 - 1);
      var tags = [];
      if (Math.random() < 0.42) { tags.push('coffee'); q -= 1.5; }
      if (Math.random() < 0.30) { tags.push('overwork'); q -= 1.8; }
      if (Math.random() < 0.32) { tags.push('sport'); q += 1.6; }
      if (Math.random() < 0.28) { tags.push('phone'); q -= 1.1; }
      if (Math.random() < 0.20) { tags.push('stress'); q -= 1.3; }
      if (Math.random() < 0.18) { tags.push('shower'); q += 0.9; }
      if (Math.random() < 0.15) { tags.push('alcohol'); q -= 1.4; }
      if (Math.random() < 0.14) { tags.push('nap'); q += 0.6; }
      if (weekend && Math.random() < 0.4) { tags.push('late_bed'); q -= 0.8; }
      if (Math.random() < 0.12) tags.push('travel');
      q = clamp(Math.round(q), 1, 10);
      state.data[dkey(y, m, d)] = {
        q: q, tags: tags,
        hours: clamp(+(q * 0.72 + 1.6).toFixed(1), 4, 9.5),
        bed: (23 + (Math.random() < 0.5 ? 0 : 1)) + ':' + (Math.random() < 0.5 ? '10' : '40'),
        note: ''
      };
    }
    save(); renderCalendar(); refreshViz(true);
  }

  /* ================= 语言切换 ================= */
  function setLang(l) {
    state.lang = l;
    save();
    applyStatic();
    renderWeekdays();
    renderCalendar();
    renderInsight();
    if ($('dayModal').classList.contains('on') && editing) openDay(editing);
    $('tooltip').style.opacity = 0;
  }

  /* ================= 事件 ================= */
  function bind() {
    $('prevBtn').onclick = function () {
      if (state.view === 'month') state.cursor.setMonth(state.cursor.getMonth() - 1);
      else state.cursor.setDate(state.cursor.getDate() - 7);
      renderCalendar();
    };
    $('nextBtn').onclick = function () {
      if (state.view === 'month') state.cursor.setMonth(state.cursor.getMonth() + 1);
      else state.cursor.setDate(state.cursor.getDate() + 7);
      renderCalendar();
    };
    $('todayBtn').onclick = function () { state.cursor = new Date(); renderCalendar(); };

    $('viewSwitch').querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        state.view = b.dataset.view;
        $('viewSwitch').querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        renderCalendar();
      };
    });

    $('langBtn').onclick = function () { setLang(state.lang === 'en' ? 'zh' : 'en'); };

    $('buildBtn').onclick = function () { refreshViz(true); };
    $('demoBtn').onclick = demo;
    $('clearBtn').onclick = function () {
      if (!confirm(t('clear.confirm', { p: monthLabel() }))) return;
      var y = state.cursor.getFullYear(), m = state.cursor.getMonth();
      Object.keys(state.data).forEach(function (k) {
        var d = parseKey(k);
        if (d.getFullYear() === y && d.getMonth() === m) delete state.data[k];
      });
      save(); renderCalendar(); refreshViz(false);
    };
    $('exportBtn').onclick = function () {
      var blob = new Blob([JSON.stringify({ data: state.data, custom: state.custom }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sleep-' + state.cursor.getFullYear() + '-' + pad(state.cursor.getMonth() + 1) + '.json';
      a.click();
    };
    $('shotBtn').onclick = function () {
      var a = document.createElement('a');
      a.href = viz.snapshot(); a.download = 'sleep-sphere.png'; a.click();
    };
    $('spinBtn').onclick = function () { viz.setSpin(!$('spinBtn').classList.contains('on')); };

    $('modalClose').onclick = closeDay;
    $('cancelDay').onclick = closeDay;
    $('dayModal').onclick = function (e) { if (e.target === $('dayModal')) closeDay(); };
    $('saveDay').onclick = saveDay;
    $('deleteDay').onclick = function () {
      if (!editing) return;
      delete state.data[editing];
      save(); closeDay(); renderCalendar(); refreshViz(false);
    };

    $('qRange').oninput = function () {
      $('qNum').value = this.value; $('qVal').textContent = this.value; markPreset(+this.value);
    };
    $('qNum').oninput = function () {
      var v = clamp(Math.round(+this.value || 7), 1, 10);
      $('qVal').textContent = v; $('qRange').value = v; markPreset(v);
    };
    $('qPresets').querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        var q = +b.dataset.q;
        $('qRange').value = q; $('qNum').value = q; $('qVal').textContent = q; markPreset(q);
      };
    });
    $('customTag').onkeydown = function (e) {
      if (e.key !== 'Enter') return;
      var v = this.value.trim();
      if (!v) return;
      var id = 'c_' + v;
      if (!state.custom.filter(function (c) { return c.id === id; }).length) {
        state.custom.push({ id: id, name: v, color: '#B9C3FF' });
        save();
      }
      this.value = '';
      var cur = [];
      $('tagGrid').querySelectorAll('.tag.on').forEach(function (el) { cur.push(el.dataset.id); });
      cur.push(id);
      renderTagGrid(cur);
    };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDay(); });
  }

  /* ================= 启动 ================= */
  load();
  initViz();
  bind();
  applyStatic();
  renderWeekdays();
  renderCalendar();
  refreshViz(false);

})();
