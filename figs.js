/* ══════════════════════════════════════════════════════════════
   자동화설비 실기 도면게임 — 그림 모음 (그림08 · 2026-09-30)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html(📖 배우기 · 수업 슬라이드)이 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', draw:function(){ … } }
     어느 장에 붙는지는 lesson.js 의 fig:'키' 가 정한다 — 배우기와 수업 슬라이드가 같은 원고를 쓴다.

   그림 내용의 근거
     · lesson.js 각 장의 본문(요점 · 기호 카드). 수치는 본문에 있는 것만 썼다(∅40 · R13 · C4 · R3 · ±0.1).
     · 선의 종류 · 절단선 · 해칭 · 상세도 표기는 KS 기계제도 관례(굵은 실선 · 파선 · 가는 1점쇄선).
     · 공개도면 20장(images/*.png)은 모양을 확인하는 참고로만 봤다. 잘라 붙이지 않았다 —
       실제 도면 크롭은 따로 images/lesson/ 에 있고 그 장들은 그대로 둔다.
     · 제도 그림이라 색은 최소로 쓰고 선 종류로 구분한다.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout;

  var THICK = 2.4, THIN = 1;
  function thick(x1, y1, x2, y2) { return line(x1, y1, x2, y2, { w: THICK }); }
  function hidden(x1, y1, x2, y2) { return line(x1, y1, x2, y2, { w: 1.4, dash: 'hidden' }); }
  function center(x1, y1, x2, y2) { return line(x1, y1, x2, y2, { w: THIN, dash: 'center', c: C.ink }); }
  function rect(x, y, w, h, o) { o = o || {}; return box(x, y, w, h, { fill: o.fill || C.paper, c: C.ink, w: o.w || THICK, r: 0 }); }
  function divider(x, y1, y2) { return line(x, y1, x, y2, { c: C.grayM, w: 1.4, dash: '6 5' }); }
  /* 해칭: 사각형 안 45° 가는 실선 */
  function hatch(x, y, w, h) { return F.hatch(x, y, w, h, { gap: 8, w: 0.9, c: C.ink }); }
  /* 원호(각도는 도) */
  function arc(cx, cy, r, a0, a1, o) {
    o = o || {};
    var p0 = [cx + r * Math.cos(a0 * Math.PI / 180), cy + r * Math.sin(a0 * Math.PI / 180)],
      p1 = [cx + r * Math.cos(a1 * Math.PI / 180), cy + r * Math.sin(a1 * Math.PI / 180)];
    var large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
    return F.path('M' + p0[0].toFixed(1) + ',' + p0[1].toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large + ' ' + sweep + ' ' +
      p1[0].toFixed(1) + ',' + p1[1].toFixed(1), { w: o.w || THICK, c: o.c || C.ink, dash: o.dash, fill: o.fill });
  }
  function circ(cx, cy, r, o) { o = o || {}; return F.circle(cx, cy, r, { fill: o.fill || 'none', c: o.c || C.ink, w: o.w || THICK }); }
  function tag(x, y, s, o) { o = o || {}; return t(x, y, s, { a: o.a || 'm', b: 1, size: o.size || 15, c: o.c || C.ink }); }
  function note(x, y, s, o) { o = o || {}; return t(x, y, s, { a: o.a || 'm', size: o.size || 13, c: o.c || C.sub }); }

  return {

  /* ─────────── 2. 선과 뷰 ─────────── */
  lines: { cap: '선의 종류 — 굵은 실선은 보이는 모서리, 파선은 숨은 모서리, 1점쇄선은 중심, 가는 실선은 치수 (숫자는 예시)',
    draw: function () {
      var s = '';
      /* 부품: 가운데 구멍이 관통한 블록 (정면도) */
      s += rect(34, 60, 140, 110);
      s += hidden(88, 60, 88, 170) + hidden(120, 60, 120, 170);
      s += center(104, 44, 104, 186);
      s += F.dim(34, 170, 174, 170, '60', { off: 30, side: -1 });
      s += F.num(22, 52, 1, { c: C.ink, r: 10, size: 12 }) + F.num(88, 46, 2, { c: C.ink, r: 10, size: 12 }) +
        F.num(106, 30, 3, { c: C.ink, r: 10, size: 12 }) + F.num(190, 200, 4, { c: C.ink, r: 10, size: 12 });
      /* 범례 */
      var y0 = 50, dy = 44, lx = 222;
      var rows = [['굵은 실선', '외형선 — 보이는 모서리'], ['파선', '숨은선 — 안 보이는 모서리'],
        ['가는 1점쇄선', '중심선 · 피치원'], ['가는 실선', '치수선 · 지시선 · 해칭']];
      for (var i = 0; i < 4; i++) {
        var y = y0 + i * dy;
        s += F.num(lx, y, i + 1, { c: C.ink, r: 10, size: 12 });
        if (i === 0) s += thick(lx + 16, y, lx + 58, y);
        if (i === 1) s += hidden(lx + 16, y, lx + 58, y);
        if (i === 2) s += center(lx + 16, y, lx + 58, y);
        if (i === 3) s += line(lx + 16, y, lx + 58, y, { w: THIN });
        s += t(lx + 66, y - 8, rows[i][0], { b: 1, size: 14 }) + t(lx + 66, y + 10, rows[i][1], { size: 13, c: C.sub });
      }
      return F.svg(480, 236, s);
    } },

  'section-detail': { cap: '단면 A-A 는 A–A 선을 따라 자른 모습, 상세도 A (2:1)는 A 부분만 2배로 키운 그림 — 적힌 숫자는 실제 치수 그대로',
    draw: function () {
      var s = tag(120, 22, '단면 A-A', { c: C.ink }) + tag(362, 22, '상세도 A  2:1');
      s += divider(240, 14, 272);
      /* 위: 정면도(구멍이 있는 판) + 절단선 */
      s += rect(40, 44, 160, 60);
      s += circ(120, 74, 16, { w: 2 });
      s += line(18, 74, 222, 74, { w: 1, dash: 'center' });
      s += line(18, 74, 34, 74, { w: 3 }) + line(206, 74, 222, 74, { w: 3 });
      s += arrow(22, 74, 22, 58, { w: 1.4, head: 8 }) + arrow(218, 74, 218, 58, { w: 1.4, head: 8 });
      s += t(22, 48, 'A', { a: 'm', b: 1, size: 15 }) + t(218, 48, 'A', { a: 'm', b: 1, size: 15 });
      /* 아래: 자른 면 — 해칭 */
      var y = 150, h = 40;
      s += hatch(40, y, 64, h) + hatch(136, y, 64, h);
      s += rect(40, y, 64, h, { fill: 'none' }) + rect(136, y, 64, h, { fill: 'none' });
      s += thick(104, y, 136, y) + thick(104, y + h, 136, y + h);
      s += center(120, y - 10, 120, y + h + 10);
      s += arrow(120, 110, 120, 140, { c: C.sub, w: 1.4, head: 8 });
      s += note(120, 214, '잘린 면에만 빗금(해칭)', { c: C.ink });
      s += note(120, 234, '구멍 자리는 비어 있다');
      /* 오른쪽: 작은 홈 + 상세도 */
      var bx = 262, by = 70;
      s += F.poly([[bx, by], [bx + 40, by], [bx + 40, by + 8], [bx + 48, by + 8], [bx + 48, by], [bx + 84, by], [bx + 84, by + 40], [bx, by + 40]],
        { close: 1, w: 2, fill: C.paper });
      s += circ(bx + 44, by + 4, 16, { w: 1, c: C.ink });
      s += t(bx + 66, by - 16, 'A', { b: 1, size: 15 });
      s += note(bx + 42, by + 62, '원래 크기');
      /* 2배 */
      var dx = 360, dy = 118, k = 2;
      s += circ(dx + 48, dy + 40, 70, { w: 1, c: C.ink });
      s += F.poly([[dx - 6, dy + 24], [dx + 40, dy + 24], [dx + 40, dy + 24 + 8 * k], [dx + 40 + 8 * k, dy + 24 + 8 * k],
        [dx + 40 + 8 * k, dy + 24], [dx + 100, dy + 24]], { w: 2.4 });
      s += F.dim(dx + 40, dy + 24, dx + 56, dy + 24, '2', { off: 14 });
      s += note(362, 250, '그림만 2배 · 숫자(2)는 실제 치수', { c: C.orange });
      return F.svg(480, 272, s);
    } },

  /* ─────────── 3. 크기 기호 ─────────── */
  'dia-rad': { cap: '∅ 는 원 전체를 가로지른 지름, R 은 중심에서 바깥까지의 반지름 — 둥근 모서리에는 R',
    draw: function () {
      var s = tag(120, 22, '∅40 = 지름') + tag(360, 22, 'R13 = 반지름');
      s += divider(240, 14, 240);
      /* 지름 */
      s += circ(120, 122, 70);
      s += center(38, 122, 202, 122) + center(120, 40, 120, 204);
      s += arrow(120 - 49.5, 122 + 49.5, 120 + 49.5, 122 - 49.5, { both: 1, w: 1, head: 9 });
      s += t(146, 136, '∅40', { b: 1, size: 16, c: C.blue });
      s += note(120, 222, '원 전체를 가로지른 거리', { c: C.ink });
      /* 반지름 — 둥근 모서리 */
      var x0 = 290, y0 = 70, r = 52;
      s += F.path('M' + x0 + ',' + (y0 + 130) + ' V' + y0 + ' H' + (x0 + 120) + ' A' + r + ',' + r + ' 0 0 1 ' + (x0 + 120 + r) + ',' + (y0 + r) +
        ' V' + (y0 + 130), { w: THICK });
      var cx = x0 + 120, cy = y0 + r;
      s += line(cx - 8, cy, cx + 8, cy, { w: 1 }) + line(cx, cy - 8, cx, cy + 8, { w: 1 });
      s += arrow(cx, cy, cx + r * Math.cos(-Math.PI / 4), cy + r * Math.sin(-Math.PI / 4), { w: 1, head: 9 });
      s += t(cx - 30, cy + 26, 'R13', { b: 1, size: 16, c: C.orange });
      s += note(360, 222, '중심에서 바깥(원호)까지', { c: C.ink });
      s += note(240, 256, 'R13 을 지름 13 으로 넣으면 크기가 절반이 된다', { c: C.red });
      return F.svg(480, 274, s);
    } },

  'thru-blind': { cap: '관통(THRU · Drill THRU)은 반대편까지 뚫은 구멍 — 깊이(DP)가 적힌 구멍은 그만큼만 판다 (단면)',
    draw: function () {
      var s = tag(120, 24, '관통 · THRU') + tag(360, 24, '깊이만큼만 · DP');
      s += divider(240, 14, 230);
      var y = 60, h = 110;
      /* 관통 */
      s += hatch(40, y, 60, h) + hatch(140, y, 60, h) + rect(40, y, 60, h, { fill: 'none' }) + rect(140, y, 60, h, { fill: 'none' });
      s += thick(100, y, 140, y) + thick(100, y + h, 140, y + h);
      s += center(120, y - 14, 120, y + h + 14);
      s += arrow(120, 38, 120, y + h + 26, { c: C.blue, w: 1.6, head: 9 });
      s += note(120, 206, '반대편까지 뚫는다', { c: C.ink });
      /* 막힌 구멍 */
      var x = 280, d = 40, dp = 64;
      s += F.poly([[x, y], [x + 60, y], [x + 60, y + dp], [x + 80, y + dp + 12], [x + 100, y + dp], [x + 100, y], [x + 160, y],
        [x + 160, y + h], [x, y + h]], { close: 1, w: THICK, fill: C.paper });
      s += '<clipPath id="tbclip"><polygon points="' + [[x, y], [x + 60, y], [x + 60, y + dp], [x + 80, y + dp + 12], [x + 100, y + dp], [x + 100, y],
        [x + 160, y], [x + 160, y + h], [x, y + h]].map(function (p) { return p.join(','); }).join(' ') + '"/></clipPath>';
      s += '<g clip-path="url(#tbclip)">' + hatch(x, y, 160, h) + '</g>';
      s += F.poly([[x, y], [x + 60, y], [x + 60, y + dp], [x + 80, y + dp + 12], [x + 100, y + dp], [x + 100, y], [x + 160, y],
        [x + 160, y + h], [x, y + h]], { close: 1, w: THICK });
      s += center(x + 80, y - 14, x + 80, y + h + 14);
      s += line(x + 100, y + dp, x + 166, y + dp, { w: 1 }) + F.dim(x + 160, y, x + 160, y + dp, '깊이', { off: 14, side: -1 });
      s += note(360, 206, '바닥이 막혀 있다', { c: C.ink });
      return F.svg(480, 230, s);
    } },

  'chamfer-fillet': { cap: 'C4 는 모서리를 45° 로 4mm 잘라 낸 모따기, R3 은 반지름 3 으로 둥글린 필렛(라운드)',
    draw: function () {
      var s = tag(120, 24, 'C4 — 45° 모따기') + tag(360, 24, 'R3 — 둥글리기');
      s += divider(240, 14, 220);
      var k = 12; /* 1mm = 12px 로 키워 그림 */
      /* 모따기 */
      var x0 = 40, y0 = 70, c = 4 * k;
      s += F.poly([[x0, y0 + 130], [x0, y0], [x0 + 150 - c, y0], [x0 + 150, y0 + c], [x0 + 150, y0 + 130]], { w: THICK });
      s += line(x0 + 150 - c, y0, x0 + 150, y0, { w: 1, dash: '3 3', c: C.sub }) + line(x0 + 150, y0, x0 + 150, y0 + c, { w: 1, dash: '3 3', c: C.sub });
      s += F.dim(x0 + 150 - c, y0, x0 + 150, y0, '4', { off: 18 });
      s += F.dim(x0 + 150, y0, x0 + 150, y0 + c, '4', { off: 18, side: -1 });
      s += t(x0 + 150 - c / 2 - 6, y0 + c / 2 + 18, '45°', { size: 14, c: C.blue, b: 1 });
      s += note(120, 214, '양쪽으로 4씩 — 비스듬히 자른다', { c: C.ink });
      /* 필렛 */
      var x1 = 280, r = 3 * k * 1.4;
      s += F.path('M' + x1 + ',' + (y0 + 130) + ' V' + y0 + ' H' + (x1 + 150 - r) + ' A' + r + ',' + r + ' 0 0 1 ' + (x1 + 150) + ',' + (y0 + r) +
        ' V' + (y0 + 130), { w: THICK });
      var cx = x1 + 150 - r, cy = y0 + r;
      s += line(cx - 6, cy, cx + 6, cy, { w: 1 }) + line(cx, cy - 6, cx, cy + 6, { w: 1 });
      s += arrow(cx, cy, cx + r * 0.707, cy - r * 0.707, { w: 1, head: 8 });
      s += t(cx - 36, cy + 14, 'R3', { b: 1, size: 16, c: C.orange });
      s += note(360, 214, '모서리를 원호로 둥글린다', { c: C.ink });
      return F.svg(480, 232, s);
    } },

  /* ─────────── 4. 정밀도 ─────────── */
  tol: { cap: '100 ±0.1 — 99.9 에서 100.1 사이면 합격. 공차가 작을수록 더 정밀하게 만들어야 한다',
    draw: function () {
      var s = t(240, 26, '100 ± 0.1', { a: 'm', b: 1, size: 20 });
      var x0 = 40, x1 = 440, y = 110;
      function X(v) { return x0 + (v - 99.8) / 0.4 * (x1 - x0); }
      s += box(X(99.9), y - 18, X(100.1) - X(99.9), 36, { fill: C.greenL, c: C.green, r: 4, w: 1.6 });
      s += box(x0, y - 18, X(99.9) - x0, 36, { fill: C.redL, c: C.red, r: 4, w: 1.2 }) + box(X(100.1), y - 18, x1 - X(100.1), 36, { fill: C.redL, c: C.red, r: 4, w: 1.2 });
      s += t((X(99.9) + X(100.1)) / 2, y, '합격', { a: 'm', b: 1, size: 17, c: C.green, halo: false });
      s += t((x0 + X(99.9)) / 2, y, '불합격', { a: 'm', b: 1, size: 14, c: C.red, halo: false }) +
        t((X(100.1) + x1) / 2, y, '불합격', { a: 'm', b: 1, size: 14, c: C.red, halo: false });
      [99.8, 99.9, 100, 100.1, 100.2].forEach(function (v) {
        s += line(X(v), y + 20, X(v), y + 30, { w: 1.4 }) + t(X(v), y + 44, String(v), { a: 'm', size: 14, b: v === 100 ? 1 : 0 });
      });
      s += arrow(X(100), 62, X(100), y - 22, { w: 1.4, head: 8, c: C.ink }) + note(X(100), 52, '기준 치수 100');
      s += note(240, 196, '공차가 안 붙은 치수에는 주서의 일반공차가 적용된다', { c: C.ink });
      return F.svg(480, 216, s);
    } },

  /* ─────────── 5. 위치와 기준 ─────────── */
  'datum-dim': { cap: '치수에는 출발점이 있다 — 기준면에서 잰 구멍 위치, 구멍 중심 사이 거리, 전체 길이는 서로 다른 값',
    draw: function () {
      var s = '';
      var x0 = 70, y0 = 70, w = 340, h = 100, hx = [150, 330], hy = 120;
      s += rect(x0, y0, w, h);
      hx.forEach(function (x) { s += circ(x, hy, 16, { w: 2 }) + center(x, y0 - 12, x, y0 + h + 12) + center(x - 26, hy, x + 26, hy); });
      /* 기준면 */
      s += line(x0, y0 - 6, x0, y0 + h + 6, { w: 4, c: C.blue });
      for (var i = 0; i < 6; i++) s += line(x0 - 4, y0 + 8 + i * 18, x0 - 14, y0 + 18 + i * 18, { w: 1, c: C.blue });
      s += t(x0 - 18, y0 - 18, '기준면', { a: 'm', b: 1, size: 14, c: C.blue });
      /* 치수 — 위쪽: 기준면 → 첫 구멍, 구멍 사이 */
      s += F.dim(x0, y0, hx[0], y0, '위치', { off: 26 });
      s += F.dim(hx[0], y0, hx[1], y0, '구멍 중심 거리', { off: 26 });
      /* 아래쪽: 전체 길이 */
      s += F.dim(x0, y0 + h, x0 + w, y0 + h, '전체 길이', { off: 30, side: -1 });
      s += note(240, 234, '화살표가 어디에 닿았는지 보면 무엇을 잰 값인지 안다', { c: C.ink });
      return F.svg(480, 250, s);
    } },

  /* ─────────── 6. 부품 이름 ─────────── */
  parts1: { cap: '보스 · 플랜지 · 리브 · 스포크(살) — 문제에서 이름으로 가리키는 곳',
    draw: function () {
      var s = '';
      /* 플랜지 + 보스 + 리브 (정면) */
      var fx = 20, fy = 186, fw = 250, fh = 22, bx = 115, bw = 60, bt = 70;
      s += rect(fx, fy, fw, fh, { fill: C.grayL });
      s += rect(bx, bt, bw, fy - bt, { fill: C.grayL });
      s += F.poly([[bx, fy], [bx - 62, fy], [bx, bt + 40]], { close: 1, w: THICK, fill: C.grayL }) +
        F.poly([[bx + bw, fy], [bx + bw + 62, fy], [bx + bw, bt + 40]], { close: 1, w: THICK, fill: C.grayL });
      s += thick(bx, bt, bx, fy) + thick(bx + bw, bt, bx + bw, fy);
      s += hidden(bx + 18, bt, bx + 18, fy + fh) + hidden(bx + bw - 18, bt, bx + bw - 18, fy + fh) + center(bx + bw / 2, bt - 12, bx + bw / 2, fy + fh + 12);
      s += callout(bx + bw, bt + 16, 206, 58, '보스', { c: C.ink, b: 1, tc: C.blue, size: 15 });
      s += callout(fx + 210, fy + 11, 226, 238, '플랜지', { c: C.ink, b: 1, tc: C.blue, size: 15, a: 's' });
      s += callout(bx - 34, fy - 20, 30, 128, '리브', { c: C.ink, b: 1, tc: C.blue, size: 15, a: 's' });
      s += note(120, 262, '보스는 두껍게 · 플랜지는 넓게 편 판');
      s += divider(296, 20, 270);
      /* 스포크 바퀴 */
      var cx = 390, cy = 130;
      s += circ(cx, cy, 70, { fill: C.grayL }) + circ(cx, cy, 56, { fill: C.paper });
      for (var k = 0; k < 4; k++) {
        var a = k * Math.PI / 2 + Math.PI / 4, ca = Math.cos(a), sa = Math.sin(a), px = -sa * 6, py = ca * 6;
        s += F.poly([[cx + ca * 18 + px, cy + sa * 18 + py], [cx + ca * 57 + px, cy + sa * 57 + py], [cx + ca * 57 - px, cy + sa * 57 - py],
          [cx + ca * 18 - px, cy + sa * 18 - py]], { close: 1, w: 1.8, fill: C.grayL });
      }
      s += circ(cx, cy, 20, { fill: C.grayL }) + circ(cx, cy, 8, { fill: C.paper, w: 1.8 });
      s += callout(cx + 30, cy + 30, 420, 234, '스포크(살)', { c: C.ink, b: 1, tc: C.blue, size: 15, a: 'm' });
      s += note(390, 262, '중심과 바깥 테를 잇는 살');
      return F.svg(480, 280, s);
    } },

  parts2: { cap: '칼라 · 장공(슬롯) · 훅 · 브래킷 — 장공은 안쪽 폭이 구멍 크기',
    draw: function () {
      var s = divider(240, 14, 300) + line(14, 156, 466, 156, { c: C.grayM, w: 1.4, dash: '6 5' });
      /* 칼라: 축을 감싸는 짧은 원통 */
      s += tag(120, 26, '칼라');
      s += rect(30, 80, 180, 28, { fill: C.paper, w: 1.8 }) + rect(92, 68, 56, 52, { fill: C.grayL });
      s += center(20, 94, 220, 94);
      s += note(120, 140, '축을 감싸는 짧은 원통');
      /* 장공 */
      s += tag(360, 26, '장공 (슬롯)');
      s += rect(270, 50, 180, 84, { fill: C.grayL });
      s += F.path('M318,74 H402 A18,18 0 0 1 402,110 H318 A18,18 0 0 1 318,74 Z', { w: THICK, fill: C.paper });
      s += F.dim(300, 74, 300, 110, '폭', { off: 0 });
      s += note(360, 146, '안쪽 폭 = 구멍 크기');
      /* 훅 */
      s += tag(120, 178, '훅');
      s += F.path('M60,210 H150 V250 A28,28 0 0 1 94,250 V236', { w: 9, c: C.grayM });
      s += F.path('M60,210 H150 V250 A28,28 0 0 1 94,250 V236', { w: 1.6, c: C.ink });
      s += note(120, 294, '갈고리 모양으로 파인 부분');
      /* 브래킷 */
      s += tag(360, 178, '브래킷');
      s += hatch(270, 196, 14, 90) + line(284, 196, 284, 286, { w: 2 });
      s += F.poly([[284, 206], [304, 206], [304, 256], [420, 256], [420, 276], [284, 276]], { close: 1, w: THICK, fill: C.grayL });
      s += box(340, 232, 60, 24, { fill: C.paper, c: C.sub, r: 3, w: 1.2, label: '받칠 것', size: 12, lc: C.sub });
      s += note(360, 294, '무언가를 받쳐 붙이는 부품');
      return F.svg(480, 310, s);
    } },

  /* ─────────── 7. 실기 진행 ─────────── */
  'model-order': { cap: '모델링 순서 — 큰 덩어리부터 만들고, 구멍 다음, 모따기·필렛은 맨 마지막에',
    draw: function () {
      var s = '', xs = [20, 176, 332], nm = ['① 큰 덩어리', '② 구멍', '③ 모따기 · 필렛'];
      for (var i = 0; i < 3; i++) {
        var x = xs[i], y = 70;
        s += tag(x + 64, 36, nm[i], { c: i === 2 ? C.orange : C.ink });
        if (i < 2) s += rect(x, y, 128, 84, { fill: C.grayL });
        else s += F.path('M' + x + ',' + (y + 84) + ' V' + (y + 10) + ' L' + (x + 10) + ',' + y + ' H' + (x + 116) + ' A12,12 0 0 1 ' + (x + 128) + ',' + (y + 12) +
          ' V' + (y + 84) + ' Z', { w: THICK, fill: C.grayL });
        if (i >= 1) s += circ(x + 36, y + 42, 13, { fill: C.paper, w: 2 }) + circ(x + 92, y + 42, 13, { fill: C.paper, w: 2 });
        if (i < 2) s += arrow(x + 134, y + 42, xs[i + 1] - 6, y + 42, { w: 2, head: 9 });
      }
      s += callout(342, 72, 360, 184, 'C · R 은 뼈대를 다 만든 뒤', { c: C.orange, tc: C.orange, b: 1, size: 14, a: 'm' });
      s += note(240, 214, '먼저 넣으면 나중에 치수를 고칠 때 형상이 깨진다', { c: C.ink });
      return F.svg(480, 234, s);
    } }

  };
})();
