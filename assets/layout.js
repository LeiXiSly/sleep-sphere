/* Layout Study — 双语排版稿 / 缩放 / 示意日历 / 双球体 */
(function () {
  'use strict';
  var GA = Math.PI * (3 - Math.sqrt(5));

  /* ================= 词库 ================= */
  var S = {
    en: {
      'brand.k1': 'SLEEP SPHERE', 'brand.k2': 'A MONTH IN ONE STRUCTURE',
      'p1.cap': 'FIG. 01 — One month, as a shape',
      'p1.word': 'Grow a month<br />into a structure',
      'p1.t1': 'RECORD', 'p1.t2': 'OBSERVE', 'p1.t3': 'BUILD',
      'p1.desc': 'Give each night a score from 1 to 10, tag what happened that day. By month\'s end it grows into a shape on its own — <b>how you sleep, and what keeps dragging you down, becomes visible at a glance.</b>',
      'p1.fl': 'A SELF-OBSERVATION TOOL FOR SLEEP',
      'p1.fr': 'Data stays in your browser · No account · v1.0',

      'tag.ill': 'illustrative',
      'p2.title': 'Why draw sleep<br />at all',
      'p2.a': 'Sleep is the hardest thing to observe in yourself. You remember when you lay down last night, but not what has been stealing your deep sleep across thirty days.',
      'p2.b': 'A table can record it, but it cannot let you see it. Once a month is arranged into a sphere, <b>which day collapsed, which line pulls which — the shape tells the truth for you.</b>',
      'p2.c': 'Thirty days of numbers do not turn into insight on their own. They need to be arranged into <b>a form you can look at, rotate, and walk into</b> — then the question becomes concrete.',
      'p2.d': 'So this tool does one thing only: turn abstract, subjective feeling into a structure the eye can read.',
      'p2.c1': 'Most reported factors', 'p2.c2': 'Who is logging', 'p2.c3': 'Three windows in a day',
      'p2.n1': 'Bar length = how often the factor was logged (0–100)',
      'p2.day': 'Daytime', 'p2.eve': 'Evening', 'p2.night': 'Before bed',
      'p2.lg1': 'Draining', 'p2.lg2': 'Restorative', 'p2.lg3': 'Neutral',
      'p2.e': 'The same person, the same tag, at a different hour — and it may act in the opposite direction on those hours of the night. <b>That is why it has to be logged day by day.</b>',
      'p2.quote': 'The body tolerates “less” better<br />than it tolerates “unpredictable”.',
      'p2.fr': 'Figures are illustrative, not empirical statistics',

      'p3.title': 'Twenty seconds<br />a day',
      'p3.hi': 'High', 'p3.mid': 'Okay', 'p3.lo': 'Low', 'p3.none': 'Not logged',
      'p3.s1t': 'Pick a day', 'p3.s1': 'Tap any cell in the calendar. Month and week views both.',
      'p3.s2t': 'Give a score', 'p3.s2': 'Slider, five presets, or just type a number. 1 to 10, no decimals.',
      'p3.s3t': 'Tag what happened', 'p3.s3': 'Coffee, a run, a late proposal — pick from the tags, or add your own.',
      'p3.s4t': 'Build the structure', 'p3.s4': 'One click, and the sphere grows point by point. More days, more complete.',
      'p3.scale': 'Quality scale', 'p3.sc1': '1 · Terrible', 'p3.sc2': '5 · Okay', 'p3.sc3': '10 · Great',
      'p3.tags': 'Tags available', 'p3.tagsn': '25 · in 5 groups',
      'p3.fr': 'All data kept in localStorage, never uploaded',

      'p4.k1': 'STRUCTURE', 'p4.k2': 'Build',
      'p4.nodes': 'Nodes', 'p4.edges': 'Edges', 'p4.faces': 'Faces',
      'p4.drag': 'Drag to rotate · scroll to zoom',
      'p4.title': 'Points, lines, planes',
      'p4.l1t': 'Point · one day', 'p4.l1': 'The higher the score, the further from the core and the brighter. Where it collapses, you see it at once.',
      'p4.l2t': 'Line · two days linked', 'p4.l2': 'Days next to each other, or sharing the same event — both had coffee, both were grinding — that makes a line.',
      'p4.l3t': 'Plane · one habit', 'p4.l3': 'Three lines enclose an area. When the same tag keeps showing up, it grows into a plane on its own.',
      'p4.note': 'Logged dates spiral down the sphere, from the pole at the start of the month to the pole at the end. After thirty days, what you see is not a table — it is a person\'s architecture.',
      'p4.fr': 'Rendered in real time · Canvas 2D',

      'p5.title': 'It tells you<br />who you are',
      'p5.name': 'Caffeine Overdraft',
      'p5.desc': 'Coffee lifts you through the day, then quietly pulls its hands away at night. That 3pm latte is still queued in your bloodstream at 1am.',
      'p5.note': '24 days logged · 9 rule sets',
      'p5.also': 'Also · Midnight Grinder',
      'p5.m1': 'Avg quality', 'p5.m2': 'Volatility', 'p5.m3': 'Days logged', 'p5.m4': 'Avg hours',
      'p5.c1': 'What moves your sleep', 'p5.u': 'unit: pts',
      'p5.n1': 'Left: drags down　Right: lifts up　—　compares days with and without the tag',
      'p5.c2': 'To try this month',
      'p5.a1': 'Close the caffeine window at <b>noon</b>. Half-life is about 5 hours — the 3pm cup is still queued in your blood at 1am.',
      'p5.a2': 'Set a <b>hard cutoff</b> for late work (23:30, say). Work expands to fill the time; only a boundary stops it.',
      'p5.a3': 'Fix exercise at the <b>same time of day</b>, so it becomes a rhythm anchor rather than a random event.',
      'p5.quote': 'Steady beats the occasional<br />perfect night.',
      'p5.best': '10/24 · 9 pts', 'p5.worst': '10/20 · 4 pts',
      'p5.fr': 'Portrait from 9 rule sets — not a medical diagnosis',

      'p6.title': 'What happens at night<br />is invisible by day.',
      'p6.sub': 'So you turn it into a shape.',
      'p6.cta': 'Open Sleep Sphere →',
      'p6.i1': 'A self-observation tool for sleep. Record, build, read — three steps, no barrier to entry.',
      'p6.i2': 'Hand-written Canvas 2D perspective rendering, zero dependencies. Data lives in the browser, never uploaded, no sign-up.',
      'p6.i3': 'Chinese / English interface, one tap to switch.<br />25 tags, fully customisable.',

      'f.work': 'Working late', 'f.coffee': 'Coffee', 'f.screen': 'Screen / scrolling',
      'f.stress': 'Emotional stress', 'f.sport': 'Exercise', 'f.shower': 'Hot shower',
      'f.phone': 'Doom-scrolling', 'tag.add': '+ Custom'
    },

    zh: {
      'brand.k1': 'SLEEP SPHERE', 'brand.k2': '睡眠球体',
      'p1.cap': 'FIG. 01 — 一个月的形状',
      'p1.word': '把一个月<br />长成一座建筑',
      'p1.t1': '记录', 'p1.t2': '观察', 'p1.t3': '生成',
      'p1.desc': '每晚给一个 1–10 分，勾几件当天发生的事。月底，它会自己长成一个形状——<b>你睡得好不好，被什么拖着，一眼能看见。</b>',
      'p1.fl': '一个关于睡眠的自观测工具',
      'p1.fr': '数据只存在你的浏览器里 · 无需注册 · v1.0',

      'tag.ill': '示意',
      'p2.title': '为什么要把<br />睡眠画出来',
      'p2.a': '睡眠是最难自省的东西。你记得昨晚几点躺下，却记不住连续三十天里，究竟是什么在偷走你的深睡。',
      'p2.b': '表格能记录，但不能让你看见。当一个月被摆成一个球体，<b>哪一天塌陷、哪条线牵着哪条线，形状会替你说实话。</b>',
      'p2.c': '三十天的数字不会自动变成洞察。它需要被摆成一个<b>可以看、可以转、可以走进去的形状</b>——然后问题就变得具体了。',
      'p2.d': '所以这个工具只做一件事：把抽象的主观感受，转成可以被眼睛读取的结构。',
      'p2.c1': '最常被提到的影响因素', 'p2.c2': '记录到的人群分布', 'p2.c3': '一天里，影响睡眠的三个时段',
      'p2.n1': '条形长度 = 该因素被记录的频次（0–100）',
      'p2.day': '白天', 'p2.eve': '傍晚', 'p2.night': '睡前',
      'p2.lg1': '消耗', 'p2.lg2': '修复', 'p2.lg3': '中性',
      'p2.e': '同一个人，同一个标签，出现在不同时段，对夜里那几小时的作用可能完全相反。<b>这就是为什么必须一天一天地记。</b>',
      'p2.quote': '「身体最怕的不是睡得少，<br />是永远猜不到明天。」',
      'p2.fr': '图示数据为版式示意，非实证统计',

      'p3.title': '一天，二十秒',
      'p3.hi': '质量高', 'p3.mid': '一般', 'p3.lo': '质量低', 'p3.none': '未记录',
      'p3.s1t': '选一天', 'p3.s1': '点日历上的任意格子，当月、当周都能切。',
      'p3.s2t': '给个分', 'p3.s2': '滑块、五个预设，或者直接敲数字。1 到 10，没有小数点。',
      'p3.s3t': '标几件事', 'p3.s3': '喝了咖啡、去跑步、熬夜赶方案——从标签里勾选，也可以自己加。',
      'p3.s4t': '生成结构', 'p3.s4': '点一下，球体逐点长出来。记录越多，建筑越完整。',
      'p3.scale': '质量刻度', 'p3.sc1': '1 · 很差', 'p3.sc2': '5 · 一般', 'p3.sc3': '10 · 很好',
      'p3.tags': '可用标签', 'p3.tagsn': '25 个 · 分 5 组',
      'p3.fr': '所有数据保存在 localStorage，不上传',

      'p4.k1': 'STRUCTURE', 'p4.k2': '生成',
      'p4.nodes': '节点', 'p4.edges': '连线', 'p4.faces': '面',
      'p4.drag': '拖动旋转 · 滚轮缩放',
      'p4.title': '点、线、面',
      'p4.l1t': '点 · 一天', 'p4.l1': '分数越高，离球心越远、越亮。塌陷的地方，一眼就能看见。',
      'p4.l2t': '线 · 两次关联', 'p4.l2': '日子相邻，或者共享同一件事（都喝了咖啡、都在赶工），就有一条线。',
      'p4.l3t': '面 · 一段习惯', 'p4.l3': '三条线合围成区域。同一个标签反复出现时，它会自己长成一块面。',
      'p4.note': '记录的日期沿球面螺旋下行，从月初的极点到月末的极点。三十天后，你看到的不是一张表，是一个人的建筑。',
      'p4.fr': '实时渲染 · Canvas 2D',

      'p5.title': '它会告诉你<br />你是个什么样的人',
      'p5.name': '咖啡因透支者',
      'p5.desc': '咖啡把你白天托起来，又在夜里悄悄把手抽走。那杯下午的拿铁，凌晨一点还在你血液里排队。',
      'p5.note': '24 天记录 · 9 类规则匹配',
      'p5.also': '兼有 · 深夜赶工型',
      'p5.m1': '平均质量', 'p5.m2': '波动', 'p5.m3': '记录天数', 'p5.m4': '平均时长',
      'p5.c1': '什么在影响你的睡眠', 'p5.u': '单位：分',
      'p5.n1': '左：拉低　右：拉高　—　对比「有 / 无该标签」两组的平均分',
      'p5.c2': '这个月，可以试试',
      'p5.a1': '把咖啡因的关门时间定在<b>中午 12 点前</b>。半衰期约 5 小时，下午三点那杯，凌晨一点还在排队。',
      'p5.a2': '给熬夜工作设一个<b>硬性收尾时间</b>。工作会自己膨胀填满时间，只有边界能拦住它。',
      'p5.a3': '把运动固定在<b>同一时间段</b>，让它成为节律的锚，而不是随机事件。',
      'p5.quote': '「稳，比偶尔睡到 9 分<br />更重要。」',
      'p5.best': '10/24 · 9 分', 'p5.worst': '10/20 · 4 分',
      'p5.fr': '画像由 9 类规则匹配生成，非医学诊断',

      'p6.title': '夜里的事，<br />白天看不出来。',
      'p6.sub': '所以你把它做成了一个形状。',
      'p6.cta': '打开睡眠球体 →',
      'p6.i1': '一个关于睡眠的自观测工具。记录、生成、阅读，三步，不设门槛。',
      'p6.i2': 'Canvas 2D 手写透视渲染，零依赖；数据存在浏览器本地，不上传、不注册。',
      'p6.i3': '中文 / English 双语界面，一键切换。<br />25 个记录标签，可自定义。',

      'f.work': '熬夜工作', 'f.coffee': '喝咖啡', 'f.screen': '屏幕 / 刷手机',
      'f.stress': '情绪压力', 'f.sport': '运动', 'f.shower': '睡前热水澡',
      'f.phone': '刷手机到深夜', 'tag.add': '+ 自定义'
    }
  };

  var WEEK = {
    en: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    zh: ['一', '二', '三', '四', '五', '六', '日']
  };
  var TAGS = {
    en: ['Coffee', 'Strong tea', 'Alcohol', 'Late-night food', 'Exercise', 'Stretching / yoga', 'Long walk',
      'Hot shower', 'Feeling unwell', 'Medication', 'Worked late', 'Gaming', 'Doom-scrolling', 'Nap',
      'Very late bedtime', 'Early rise', 'Irregular schedule', 'Travel', 'High stress', 'Anxiety',
      'Low mood', 'Late socialising', 'Breathing / meditation', 'Room too hot / cold', 'Noise'],
    zh: ['喝咖啡', '浓茶', '饮酒', '吃宵夜', '运动', '拉伸瑜伽', '长时间走路', '睡前热水澡', '身体不适',
      '吃药', '熬夜工作', '打游戏', '刷手机到深夜', '午睡', '入睡很晚', '早起', '作息不规律', '出差/旅行',
      '压力大', '焦虑', '情绪低落', '社交到很晚', '呼吸/冥想', '房间太热/太冷', '噪音']
  };

  var state = { lang: 'en' };

  function $(id) { return document.getElementById(id); }
  function t(k) { return (S[state.lang] && S[state.lang][k]) || S.en[k] || k; }

  function applyLang() {
    document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
    document.body.setAttribute('data-lang', state.lang);
    var i, els = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < els.length; i++) els[i].textContent = t(els[i].getAttribute('data-i18n'));
    els = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) els[i].innerHTML = t(els[i].getAttribute('data-i18n-html'));
    if ($('langFab')) $('langFab').textContent = state.lang === 'en' ? '中文' : 'EN';
    if ($('calWeek')) {
      $('calWeek').innerHTML = WEEK[state.lang].map(function (w) { return '<span>' + w + '</span>'; }).join('');
    }
    if ($('tagList')) {
      $('tagList').innerHTML = TAGS[state.lang].map(function (x) {
        return '<span class="tg">' + x + '</span>';
      }).join('') + '<span class="tg add">' + t('tag.add') + '</span>';
    }
  }

  /* ================= 颜色 ================= */
  function hexRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function mix(a, b, k) {
    var A = hexRgb(a), B = hexRgb(b);
    return '#' + [0, 1, 2].map(function (i) {
      var v = Math.round(A[i] + (B[i] - A[i]) * k).toString(16);
      return v.length < 2 ? '0' + v : v;
    }).join('');
  }

  /* ================= 缩放 ================= */
  var stage = $('stage');
  var viewport = document.querySelector('.viewport');
  var isStatic = /[?&]static/.test(location.search);
  function fit() {
    if (isStatic) { viewport.style.height = 'auto'; return; }
    var k = Math.min(1, (window.innerWidth - 40) / 1600);
    stage.style.transform = 'scale(' + k + ')';
    viewport.style.height = Math.ceil(stage.offsetHeight * k + 40) + 'px';
  }
  window.addEventListener('resize', fit);

  var one = location.search.match(/[?&]p=(\d+)/);
  if (one) {
    var pgs = document.querySelectorAll('.page');
    for (var pi = 0; pi < pgs.length; pi++) {
      if (pi !== (+one[1]) - 1) pgs[pi].style.display = 'none';
    }
  }

  /* ================= 03 示意日历 ================= */
  var SCORES = [
    6, 7, 5, 4, 6, 8, 9, 7, 5, 4, null, 6, 7, 8, 6, 5, 7, 8,
    6, 5, 4, null, 7, 9, 8, 7, 6, 7, 8, 6, 5
  ];
  function renderCal() {
    var box = $('calDemo');
    if (!box) return;
    var html = '';
    [28, 29, 30].forEach(function (d) {
      html += '<div class="cell other"><span class="cn">' + d + '</span></div>';
    });
    for (var d = 1; d <= 31; d++) {
      var q = SCORES[d - 1];
      if (q == null) {
        html += '<div class="cell"><span class="cn">' + d + '</span>' +
          '<span class="cq" style="color:#D8D8D8">—</span></div>';
      } else {
        var col = q <= 4 ? '#C2C2C2' : q <= 6 ? 'rgba(196,18,30,.40)' : q <= 8 ? 'rgba(196,18,30,.72)' : '#C4121E';
        html += '<div class="cell"><span class="cn">' + d + '</span>' +
          '<span class="cq" style="color:' + col + '">' + q + '</span>' +
          '<span class="cbar" style="background:' + col + ';width:' + (q * 10) + '%"></span></div>';
      }
    }
    html += '<div class="cell other"><span class="cn">1</span></div>';
    box.innerHTML = html;
  }

  /* ================= 球体（示意） ================= */
  var DAYS = [
    { q: 6, t: ['coffee'] }, { q: 7, t: ['sport'] }, { q: 5, t: ['overwork', 'coffee'] },
    { q: 4, t: ['overwork', 'phone'] }, { q: 6, t: ['coffee'] }, { q: 8, t: ['sport', 'shower'] },
    { q: 9, t: ['sport'] }, { q: 7, t: ['nap'] }, { q: 5, t: ['stress'] },
    { q: 4, t: ['coffee', 'overwork'] }, { q: 6, t: ['coffee'] }, { q: 7, t: ['sport'] },
    { q: 8, t: ['shower'] }, { q: 6, t: ['alcohol'] }, { q: 5, t: ['alcohol', 'late'] },
    { q: 7, t: ['sport'] }, { q: 8, t: ['sport', 'shower'] }, { q: 6, t: ['coffee'] },
    { q: 5, t: ['overwork'] }, { q: 4, t: ['overwork', 'stress'] }, { q: 6, t: ['coffee', 'phone'] },
    { q: 7, t: ['sport'] }, { q: 9, t: ['sport', 'shower'] }, { q: 8, t: ['early'] }
  ];

  function angDist(a, b) {
    var la = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) || 1;
    var lb = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z) || 1;
    var d = (a.x * b.x + a.y * b.y + a.z * b.z) / (la * lb);
    return Math.acos(Math.max(-1, Math.min(1, d)));
  }

  function build(days, colorFn) {
    var n = days.length, pts = [], edges = [], faces = [];
    days.forEach(function (d, i) {
      var qn = (d.q - 1) / 9;
      var y = n === 1 ? 0 : 1 - 2 * (i / (n - 1));
      var rad = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * GA;
      var r = 0.74 + 0.26 * qn;
      pts.push({
        x: Math.cos(th) * rad * r, y: y * r, z: Math.sin(th) * rad * r,
        q: d.q, qn: qn, color: colorFn(qn), tags: d.t, date: '10/' + (i + 1)
      });
    });

    for (var i = 0; i < n - 1; i++) {
      var c = mix(pts[i].color, pts[i + 1].color, .5);
      edges.push({ a: i, b: i + 1, w: 0.86, color: c });
      if (Math.abs(pts[i].q - pts[i + 1].q) <= 1) edges.push({ a: i, b: i + 1, w: 0.24, color: c });
    }

    var tagIdx = {};
    days.forEach(function (d, i) {
      d.t.forEach(function (tg) { (tagIdx[tg] = tagIdx[tg] || []).push(i); });
    });
    Object.keys(tagIdx).forEach(function (tg) {
      var idx = tagIdx[tg];
      if (idx.length < 2) return;
      var col = mix(colorFn(0.5), '#5E5E5E', 0.62);
      for (var j = 0; j < idx.length - 1; j++) {
        if (angDist(pts[idx[j]], pts[idx[j + 1]]) > 1.28) continue;
        edges.push({ a: idx[j], b: idx[j + 1], w: 0.5, color: col });
      }
      for (var k = 0; k < idx.length - 2; k++) {
        if (angDist(pts[idx[k]], pts[idx[k + 2]]) > 1.42) continue;
        faces.push({ a: idx[k], b: idx[k + 1], c: idx[k + 2], color: colorFn(0.6), alpha: 0.075 });
      }
    });

    for (var m = 0; m < n - 2; m++) {
      var avg = (pts[m].q + pts[m + 1].q + pts[m + 2].q) / 3;
      faces.push({ a: m, b: m + 1, c: m + 2, color: colorFn((avg - 1) / 9), alpha: 0.05 });
    }
    return { points: pts, edges: edges, faces: faces, baseR: 1 };
  }

  var darkTheme = {
    bg0: '#1E1E1E', bg1: '#191919', bg2: '#141414',
    mesh: 'rgba(255,255,255,0.05)', star: '255,255,255',
    dot: [0.021, 0.030]
  };

  function initSphere(canvasId, colorFn, opts) {
    var c = $(canvasId);
    if (!c || !window.SphereViz) return;
    var v = new SphereViz(c, {
      theme: darkTheme, dist: opts.dist, yaw: opts.yaw, pitch: opts.pitch, speed: opts.speed
    });
    v.setData(build(DAYS, colorFn));
    v.t = 1; v.animating = false;
    return v;
  }

  /* ================= 启动 ================= */
  try {
    var saved = localStorage.getItem('sleepSphere.lang');
    if (saved === 'zh' || saved === 'en') state.lang = saved;
  } catch (e) { }

  applyLang();
  renderCal();
  fit();
  setTimeout(fit, 60);

  // 封面：灰白点，与红色标题拉开层次
  initSphere('coverSphere', function (qn) { return mix('#777777', '#FFFFFF', qn); },
    { dist: 1.98, yaw: -0.9, pitch: 0.30, speed: 0.0012 });
  // 结构页：灰 → 主红
  initSphere('mainSphere', function (qn) { return mix('#8A8A8A', '#C4121E', qn); },
    { dist: 2.08, yaw: -0.7, pitch: 0.34, speed: 0.0016 });

  if ($('langFab')) {
    $('langFab').onclick = function () {
      state.lang = state.lang === 'en' ? 'zh' : 'en';
      try { localStorage.setItem('sleepSphere.lang', state.lang); } catch (e) { }
      applyLang();
      fit();
    };
  }

  setTimeout(fit, 400);
})();
