/* SphereViz — 零依赖的伪 3D 球体渲染器（Canvas 2D 透视投影）
 * 输入：points / edges / faces，输出：可拖拽旋转的发光球体结构
 */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeOut(x) { return 1 - Math.pow(1 - x, 3); }

  function hexToRgb(hex) {
    hex = (hex || '#ffffff').replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, a) {
    var c = hexToRgb(hex);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  // 两点之间的球面弧（按平均半径），让连线贴在球壳上
  function makeArc(a, b, seg) {
    var la = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) || 1;
    var lb = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z) || 1;
    var R = (la + lb) / 2;
    var ax = a.x / la, ay = a.y / la, az = a.z / la;
    var bx = b.x / lb, by = b.y / lb, bz = b.z / lb;
    var dot = clamp(ax * bx + ay * by + az * bz, -1, 1);
    var om = Math.acos(dot), out = [];
    if (om < 0.002) { out.push([a.x, a.y, a.z], [b.x, b.y, b.z]); return out; }
    var so = Math.sin(om);
    for (var i = 0; i <= seg; i++) {
      var t = i / seg, s1 = Math.sin((1 - t) * om) / so, s2 = Math.sin(t * om) / so;
      out.push([(ax * s1 + bx * s2) * R, (ay * s1 + by * s2) * R, (az * s1 + bz * s2) * R]);
    }
    return out;
  }

  function SphereViz(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onHover = opts.onHover || function () { };

    this.points = [];
    this.edges = [];
    this.faces = [];

    this.theme = opts.theme || {};
    this.yaw = opts.yaw != null ? opts.yaw : -0.75;
    this.pitch = opts.pitch != null ? opts.pitch : 0.34;
    this.dist = opts.dist != null ? opts.dist : 3.5;
    this.speed = opts.speed != null ? opts.speed : 0.0022;
    this.baseR = 1;
    this.spinning = true;

    this.t = 1;
    this.animating = false;
    this._animStart = 0;
    this.animDur = 2300;

    this.pointer = { x: -1e5, y: -1e5, inside: false };
    this.hoverIdx = -1;

    this._px = [];
    this.dpr = Math.min(global.devicePixelRatio || 1, 2);
    this.stars = this._makeStars(190);
    this.mesh = this._makeMesh();

    this._bind();
    this.resize();
    if (global.ResizeObserver) {
      new ResizeObserver(this.resize.bind(this)).observe(canvas);
    } else {
      global.addEventListener('resize', this.resize.bind(this));
    }
    this._bound = this._loop.bind(this);
    requestAnimationFrame(this._bound);
  }

  SphereViz.prototype._makeStars = function (n) {
    var s = [];
    for (var i = 0; i < n; i++) {
      var u = Math.random() * 2 - 1, th = Math.random() * TAU;
      var r = Math.sqrt(1 - u * u), R = 8 + Math.random() * 6;
      s.push({
        x: Math.cos(th) * r * R, y: u * R, z: Math.sin(th) * r * R,
        a: 0.15 + Math.random() * 0.55, sz: Math.random() < 0.12 ? 1.6 : 0.9
      });
    }
    return s;
  };

  // 球面参考网格（经线 + 纬线）
  SphereViz.prototype._makeMesh = function () {
    var lines = [], i, j, seg = 48;
    for (i = 0; i < 12; i++) {
      var lon = (i / 12) * TAU, pts = [];
      for (j = 0; j <= seg; j++) {
        var lat = -Math.PI / 2 + (j / seg) * Math.PI;
        pts.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]);
      }
      lines.push(pts);
    }
    for (i = 1; i < 7; i++) {
      var la = -Math.PI / 2 + (i / 7) * Math.PI, p2 = [], rr = Math.cos(la), yy = Math.sin(la);
      for (j = 0; j <= seg; j++) {
        var a = (j / seg) * TAU;
        p2.push([Math.cos(a) * rr, yy, Math.sin(a) * rr]);
      }
      lines.push(p2);
    }
    return lines;
  };

  SphereViz.prototype.resize = function () {
    var c = this.canvas;
    var w = c.clientWidth || 600, h = c.clientHeight || 400;
    this.dpr = Math.min(global.devicePixelRatio || 1, 2);
    c.width = Math.round(w * this.dpr);
    c.height = Math.round(h * this.dpr);
    this.w = w; this.h = h;
    this.cx = w / 2; this.cy = h / 2;
    this.fov = Math.min(w, h) * 0.82;
  };

  SphereViz.prototype._bind = function () {
    var self = this, c = this.canvas, drag = null, last = null;

    function pos(e) {
      var r = c.getBoundingClientRect();
      var t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    }
    function down(e) {
      drag = pos(e); last = { yaw: self.yaw, pitch: self.pitch };
      self.spinning = false;
      if (self.onSpinChange) self.onSpinChange(false);
      if (e.touches) e.preventDefault();
    }
    function move(e) {
      var p = pos(e);
      self.pointer.x = p.x; self.pointer.y = p.y; self.pointer.inside = true;
      if (drag) {
        self.yaw = last.yaw + (p.x - drag.x) * 0.0075;
        self.pitch = clamp(last.pitch + (p.y - drag.y) * 0.0060, -1.35, 1.35);
        if (e.touches) e.preventDefault();
      }
    }
    function up() { drag = null; }
    function leave() { self.pointer.inside = false; self.pointer.x = -1e5; }

    c.addEventListener('mousedown', down);
    global.addEventListener('mousemove', move);
    global.addEventListener('mouseup', up);
    c.addEventListener('mouseleave', leave);
    c.addEventListener('touchstart', down, { passive: false });
    c.addEventListener('touchmove', move, { passive: false });
    global.addEventListener('touchend', up);
    c.addEventListener('wheel', function (e) {
      e.preventDefault();
      self.dist = clamp(self.dist + e.deltaY * 0.0016, 1.9, 7.5);
    }, { passive: false });
  };

  SphereViz.prototype.setData = function (d) {
    this.points = d.points || [];
    this.edges = d.edges || [];
    this.faces = d.faces || [];
    this.baseR = d.baseR || 1;
    this._px = new Array(this.points.length);
    var pts = this.points;
    for (var i = 0; i < this.edges.length; i++) {
      var e = this.edges[i];
      if (!e._arc) e._arc = makeArc(pts[e.a], pts[e.b], 12);
    }
  };

  SphereViz.prototype.play = function () {
    this.t = 0; this.animating = true; this._animStart = performance.now();
  };

  SphereViz.prototype.setSpin = function (v) {
    this.spinning = v;
    if (this.onSpinChange) this.onSpinChange(v);
  };

  SphereViz.prototype.snapshot = function () {
    return this.canvas.toDataURL('image/png');
  };

  SphereViz.prototype._dotR = function (pt, s) {
    var d = (this.theme && this.theme.dot) || [0.020, 0.030];
    return clamp((d[0] + d[1] * (pt.qn || 0.5)) * s, 2, 26);
  };

  SphereViz.prototype._proj = function (x, y, z, out) {
    var cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    var x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    var cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    var y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    z2 += this.dist;
    out.z = z2;
    if (z2 < 0.15) { out.ok = false; return out; }
    var s = this.fov / z2;
    out.x = this.cx + x1 * s;
    out.y = this.cy - y1 * s;
    out.s = s; out.ok = true;
    return out;
  };

  SphereViz.prototype._loop = function (now) {
    requestAnimationFrame(this._bound);
    if (this.animating) {
      var e = (now - this._animStart) / this.animDur;
      this.t = e >= 1 ? 1 : easeOut(clamp(e, 0, 1));
      if (e >= 1) this.animating = false;
    }
    if (this.spinning) this.yaw += this.speed;
    this._draw();
  };

  SphereViz.prototype._draw = function () {
    var ctx = this.ctx, i, j, p, pr;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    // 背景
    var th = this.theme || {};
    var bg = ctx.createRadialGradient(this.cx, this.cy * 1.25, 0, this.cx, this.cy, Math.max(this.w, this.h) * 0.8);
    bg.addColorStop(0, th.bg0 || '#141C2A');
    bg.addColorStop(0.55, th.bg1 || '#0C1119');
    bg.addColorStop(1, th.bg2 || '#070A0F');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.w, this.h);

    var tmp = { x: 0, y: 0, z: 0, s: 0, ok: false };

    // 星空
    ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < this.stars.length; i++) {
      var st = this.stars[i];
      pr = this._proj(st.x, st.y, st.z, tmp);
      if (!pr.ok) continue;
      ctx.fillStyle = 'rgba(' + (th.star || '190,205,255') + ',' + st.a * 0.55 + ')';
      ctx.beginPath(); ctx.arc(pr.x, pr.y, st.sz, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    // 球体参考网格
    ctx.lineWidth = 1;
    for (i = 0; i < this.mesh.length; i++) {
      var line = this.mesh[i], started = false;
      ctx.beginPath();
      for (j = 0; j < line.length; j++) {
        pr = this._proj(line[j][0] * this.baseR, line[j][1] * this.baseR, line[j][2] * this.baseR, tmp);
        if (!pr.ok) { started = false; continue; }
        if (!started) { ctx.moveTo(pr.x, pr.y); started = true; }
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.strokeStyle = th.mesh || 'rgba(140,165,235,0.055)';
      ctx.stroke();
    }

    var pts = this.points, n = pts.length;
    if (!n) { this.onHover(null); return; }

    // 计算所有点投影 + 出现动画
    var appear = this.animating || this.t < 1 ? this.t : 1;
    var show = [];
    for (i = 0; i < n; i++) {
      p = pts[i];
      var t0 = 0.04 + 0.52 * (n > 1 ? i / (n - 1) : 0);
      var a = clamp((appear - t0) / 0.20, 0, 1);
      a = easeOut(a);
      pr = this._proj(p.x, p.y, p.z, tmp);
      var o = this._px[i] || (this._px[i] = {});
      o.x = pr.x; o.y = pr.y; o.z = pr.z; o.s = pr.s; o.ok = pr.ok; o.a = a;
      if (a > 0.02 && pr.ok) show.push(i);
    }

    // ---- 面：线组成面
    var faces = [];
    for (i = 0; i < this.faces.length; i++) {
      var f = this.faces[i];
      var A = this._px[f.a], B = this._px[f.b], C = this._px[f.c];
      if (!A || !B || !C || !A.ok || !B.ok || !C.ok) continue;
      var ma = Math.min(A.a, B.a, C.a);
      var ft0 = 0.30 + 0.45 * (i / Math.max(1, this.faces.length - 1));
      var fa = clamp((appear - ft0) / 0.28, 0, 1);
      if (ma <= 0.02 || fa <= 0.01) continue;
      faces.push({ A: A, B: B, C: C, col: f.color, alpha: f.alpha * easeOut(fa) * ma, z: (A.z + B.z + C.z) / 3 });
    }
    faces.sort(function (a, b) { return b.z - a.z; });
    ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < faces.length; i++) {
      var fc = faces[i];
      ctx.fillStyle = rgba(fc.col, fc.alpha);
      ctx.beginPath();
      ctx.moveTo(fc.A.x, fc.A.y); ctx.lineTo(fc.B.x, fc.B.y); ctx.lineTo(fc.C.x, fc.C.y);
      ctx.closePath(); ctx.fill();
    }

    // ---- 线
    var edges = [];
    for (i = 0; i < this.edges.length; i++) {
      var e2 = this.edges[i];
      var P = this._px[e2.a], Q = this._px[e2.b];
      if (!P || !Q || !P.ok || !Q.ok) continue;
      var m2 = Math.min(P.a, Q.a);
      var et0 = 0.16 + 0.5 * (Math.max(e2.a, e2.b) / Math.max(1, n - 1));
      var ea = clamp((appear - et0) / 0.24, 0, 1);
      if (m2 <= 0.02 || ea <= 0.01) continue;
      edges.push({ P: P, Q: Q, arc: e2._arc, col: e2.color, w: e2.w, s: P.s, a: easeOut(ea) * m2, z: (P.z + Q.z) / 2 });
    }
    edges.sort(function (a, b) { return b.z - a.z; });
    ctx.lineCap = 'round';
    for (i = 0; i < edges.length; i++) {
      var ed = edges[i];
      var fade = clamp((this.dist + 0.9 - ed.z) / 1.1, 0.30, 1);
      ctx.strokeStyle = rgba(ed.col, (0.10 + 0.46 * ed.a * (0.45 + 0.55 * ed.w)) * fade);
      ctx.lineWidth = clamp((0.0035 + 0.011 * ed.w) * ed.s, 0.45, 3.4);
      ctx.beginPath();
      var started = false;
      for (var ai = 0; ai < ed.arc.length; ai++) {
        var ar = ed.arc[ai];
        pr = this._proj(ar[0], ar[1], ar[2], tmp);
        if (!pr.ok) { started = false; continue; }
        if (!started) { ctx.moveTo(pr.x, pr.y); started = true; }
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.stroke();
    }

    // ---- 点
    var order = show.slice().sort(function (a, b) { return _px_z(this, b) - _px_z(this, a); }.bind(this));
    var hover = -1, hd = 16;
    for (i = 0; i < order.length; i++) {
      var idx = order[i], o = this._px[idx], pt = pts[idx];
      var r = this._dotR(pt, o.s);
      var gr = r * 2.3;
      var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, gr);
      g.addColorStop(0, rgba(pt.color, 0.96 * o.a));
      g.addColorStop(0.26, rgba(pt.color, 0.26 * o.a));
      g.addColorStop(1, rgba(pt.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(o.x, o.y, gr, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba('#ffffff', 0.94 * o.a);
      ctx.beginPath(); ctx.arc(o.x, o.y, r * 0.52, 0, TAU); ctx.fill();

      if (this.pointer.inside) {
        var dx = this.pointer.x - o.x, dy = this.pointer.y - o.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < hd) { hd = d; hover = idx; }
      }
    }

    // hover 高亮环
    if (hover >= 0) {
      var ho = this._px[hover], hp = pts[hover];
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(ho.x, ho.y, this._dotR(hp, ho.s) + 6, 0, TAU); ctx.stroke();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = rgba(hp.color, 0.8);
      ctx.beginPath(); ctx.arc(ho.x, ho.y, this._dotR(hp, ho.s) + 11, 0, TAU); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalCompositeOperation = 'source-over';

    if (hover !== this.hoverIdx) {
      this.hoverIdx = hover;
      var ho2 = hover >= 0 ? this._px[hover] : null;
      this.onHover(hover >= 0 ? { point: pts[hover], sx: ho2.x, sy: ho2.y } : null);
    } else if (hover >= 0) {
      var ho3 = this._px[hover];
      this.onHover({ point: pts[hover], sx: ho3.x, sy: ho3.y });
    }
  };

  function _px_z(self, i) { return self._px[i].z; }

  global.SphereViz = SphereViz;
  global.vizColor = { rgba: rgba };
})(window);
