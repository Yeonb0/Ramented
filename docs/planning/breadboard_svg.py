# 브레드보드 SVG 생성 (표와 같은 ID만 사용)
import html, sys
W, H = 1700, 1200
BG, FG, DIM, ACC, SYS, STO, WARN = '#1a1a1a', '#e0e0e0', '#8a8a8a', '#d9a066', '#7fb3d5', '#a3c585', '#e57373'
lines, boxes, texts = [], [], []
pos = {}

def t(x, y, s, size=13, fill=FG, weight='normal', anchor='start', layer=None):
  (layer if layer is not None else texts).append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" text-anchor="{anchor}">{html.escape(s)}</text>')

def place(pid, title, x, y, items, w=290):
  boxes.append(f'<rect x="{x}" y="{y}" width="{w}" height="30" rx="6" fill="#2b2b2b" stroke="{ACC}"/>')
  t(x + 10, y + 20, f'{pid}  {title}', 14, ACC, 'bold')
  pos[pid] = (x, y, w, 30)
  yy = y + 52
  for iid, label in items:
    if iid.startswith('P'):
      t(x + 10, yy, f'{iid}  {label}', 12, ACC, 'bold')
    else:
      t(x + 14, yy, iid, 12, ACC, 'bold'); t(x + 50, yy, label, 12)
    pos[iid] = (x, yy - 13, w, 18)
    yy += 22

def node(nid, label, x, y, color, w=230):
  boxes.append(f'<rect x="{x}" y="{y}" width="{w}" height="38" rx="4" fill="#232323" stroke="{color}"/>')
  t(x + 8, y + 16, nid, 12, color, 'bold'); t(x + 8, y + 31, label, 11)
  pos[nid] = (x, y, w, 38)

def pt(i, side):
  x, y, w, h = pos[i]
  return {'r': (x + w, y + h / 2), 'l': (x, y + h / 2), 't': (x + w / 2, y), 'b': (x + w / 2, y + h)}[side]

def path(points, dashed=False, color=FG, label=None, lpos=None):
  d = ' stroke-dasharray="5 4"' if dashed else ''
  m = 'ahd' if dashed else 'ah'
  ps = ' '.join(f'{x},{y}' for x, y in points)
  lines.append(f'<polyline points="{ps}" fill="none" stroke="{color}" stroke-width="1.5"{d} marker-end="url(#{m}{color[1:]})"/>')
  if label:
    x, y = lpos if lpos else points[len(points) // 2]
    t(x + 4, y - 5, label, 11, color)

def go(a, sa, b, sb, via=(), **k):
  path([pt(a, sa), *via, pt(b, sb)], **k)

# 화면 층 (열 : c0 30, c1 370, c2 710, c3 1080, c4 1390)
place('P1', '지도 (탭)', 30, 80, [('U2', '가게 마커 (기본 / 통과 n개 / 흐림)'), ('U3', '불러오는 중'), ('U4', '실패 + 다시 시도'), ('U5', '필터 결과 0곳 안내 + 필터 끄기'), ('P1.1', '필터 바'), ('U6', '해산물 제외 칩'), ('U7', '국물 칩 : 청탕 / 백탕 / 비빔'), ('P1.2', '가게 미리보기 시트'), ('U8', '이름 · 영업 상태 · 통과 n개'), ('U9', '가게 보기')])
place('P2', '가게 상세', 370, 80, [('U10', '가게 이름 · 주소'), ('U11', '영업 상태 + 근거 문구'), ('U12', '이벤트 한 줄'), ('U13', '메뉴 행 : 메뉴명 · 종류 · ★ (n명) · 배지'), ('U14', '제보하기'), ('U15', '인스타 열기'), ('U16', '카카오맵에서 보기'), ('U17', '불러오는 중 / 실패')])
place('P3', '메뉴 상세', 710, 80, [('U18', '메뉴명 · 가격 · 종류'), ('U19', '해산물 · 국물 : 값 · 상태 · 근거 · 마지막 확인'), ('U20', '★ 평균 (n명) / 아직 평가 없음'), ('U21', '다녀왔어요 (기록하기)'), ('U22', '불러오는 중 / 실패')], w=320)
place('P4', '방문 기록 작성', 1080, 80, [('U23', '기록할 메뉴'), ('U24', '별점 1 ~ 5 (필수)'), ('U25', '방문일'), ('U26', '해산물 태깅 + 근거'), ('U27', '국물 태깅'), ('U28', '저장'), ('U29', '저장 실패 (입력 유지)')], w=260)
place('P7', '내 기록 (탭)', 1390, 80, [('U37', '내 기록 목록'), ('U38', '빈 상태 → 지도'), ('U39', '로그인 안 됨 → 로그인')], w=280)
place('P8', '프로필 (탭)', 1390, 230, [('U40', '로그인 상태 · 로그아웃')], w=280)
place('P5', '제보 작성 (모달)', 370, 410, [('U30', '오늘 휴무 / 오늘 영업 / 이벤트'), ('U31', '근거 : 직접 가봄 / 인스타'), ('U32', '이벤트 한 줄 + 유효 기간'), ('U33', '보내기'), ('U34', '실패 메시지')])
place('P6', '로그인 / 회원가입', 1080, 410, [('U35', '로그인 / 가입'), ('U36', '실패 메시지')], w=260)
place('P10', '외부 앱 (인스타 · 카카오맵)', 30, 440, [], w=290)
node('N8', '로그인 확인 (없으면 S9 저장)', 870, 410, ACC, w=190)
node('N14', '외부 링크 열기', 30, 510, SYS, w=290)

# 서버 층
boxes.append(f'<line x1="20" y1="640" x2="{W-20}" y2="640" stroke="#3a3a3a" stroke-dasharray="2 6"/>')
t(30, 662, 'P9 서버 (API) — 파생 값은 여기서 계산하고 화면은 결과만 받는다', 13, SYS, 'bold')
node('N15', '필터 상태 갱신 → 다시 조회', 40, 690, SYS, w=270)
node('N1', '지도 데이터 조회', 40, 750, SYS, w=270)
node('N12', '마커 그리기', 40, 810, SYS, w=125)
node('N3', '필터 판정', 185, 810, SYS, w=125)
node('N6', '가게 상세 조회', 380, 690, SYS, w=240)
node('N11', '제보 저장 (24시간 / 7일)', 380, 750, SYS, w=240)
node('N4', '영업 상태 (제보 > 정기 시간)', 380, 870, SYS, w=240)
node('N7', '메뉴 상세 조회', 720, 690, SYS, w=220)
node('N5', '별점 집계 (회원별 최근 1개)', 720, 750, SYS, w=220)
node('N2', '속성 확정 규칙 (B5 · B9)', 720, 870, WARN, w=220)
node('N9', '로그인 · 가입 처리', 1090, 690, SYS, w=240)
node('N10', '기록 저장 (검증 → S5 · S6)', 1090, 750, SYS, w=240)
node('N16', '로그아웃 (토큰 삭제)', 1400, 690, SYS, w=260)
node('N13', '내 기록 조회', 1400, 750, SYS, w=260)

# 저장소 층
t(1620, 958, '저장소', 13, STO, 'bold', 'end')
for sid, label, x in [('S8', '필터 상태', 40), ('S1', '가게 (정기 영업시간)', 210), ('S7', '제보', 380), ('S2', '메뉴 (시드 속성)', 550), ('S3', '라멘 종류', 720), ('S5', '방문 기록', 890), ('S6', '속성 태깅', 1060), ('S4', '회원 · 토큰', 1230), ('S9', '로그인 후 이어갈 동작', 1400)]:
  node(sid, label, x, 965, STO, w=150 if sid != 'S9' else 200)

# 대표 흐름 (주황)
go('U2', 'r', 'U8', 'r', via=[(334, 127), (334, 303)], color=ACC)
go('U9', 'r', 'P2', 'l', via=[(346, 325), (346, 95)], color=ACC, label='①', lpos=(346, 215))
go('U13', 'r', 'P3', 'l', via=[(686, 193), (686, 95)], color=ACC, label='②', lpos=(686, 150))
go('U21', 'b', 'N8', 't', via=[(870, 300), (965, 300)], color=ACC, label='③', lpos=(905, 300))
go('N8', 'r', 'P4', 'l', via=[(1070, 429), (1070, 95)], color=ACC, label='로그인됨', lpos=(1074, 330))
go('U28', 'r', 'N10', 'r', via=[(1360, 237), (1360, 769)], color=ACC, label='④', lpos=(1360, 500))
go('N10', 'l', 'N7', 'r', via=[(1010, 769), (1010, 709)], color=ACC, label='⑤ 돌아와 다시 조회', lpos=(950, 740))
go('N7', 't', 'U20', 'r', via=[(830, 620), (1045, 620), (1045, 171)], dashed=True, color=ACC)
# 로그인 갈래
go('N8', 'b', 'P6', 'l', via=[(965, 470), (1060, 470), (1060, 425)], color=WARN, label='토큰 없음', lpos=(970, 485))
go('U35', 'b', 'N9', 't', via=[(1210, 660)])
go('N9', 'r', 'P4', 'r', via=[(1376, 709), (1376, 95)], dashed=True, color=DIM, label='S9의 동작으로', lpos=(1250, 395))
# 필터
go('U6', 'l', 'N15', 'l', via=[(18, 237), (18, 709)])
go('N15', 'b', 'N1', 't')
go('N1', 'b', 'N3', 't', via=[(175, 790), (247, 790)])
go('N1', 'b', 'N12', 't', via=[(102, 790)], dashed=True, color=DIM)
go('N12', 'r', 'U2', 'r', via=[(175, 829), (175, 860), (322, 860), (322, 127)], dashed=True, color=DIM)
go('N2', 'l', 'N3', 'b', via=[(660, 889), (660, 850), (247, 850)], dashed=True, color=DIM)
# 제보 · 가게 상세
go('U14', 'r', 'N8', 'l', via=[(660, 215), (700, 215), (700, 400), (850, 400), (850, 429)])
go('N8', 'l', 'P5', 'r', via=[(850, 429), (690, 429), (690, 425)])
go('U33', 'r', 'N11', 'r', via=[(680, 523), (680, 769)])
go('N11', 't', 'N6', 'b')
go('N6', 'r', 'N4', 'r', via=[(640, 709), (640, 889)])
go('N6', 'l', 'U11', 'l', via=[(358, 709), (358, 149)], dashed=True, color=DIM, label='영업 상태 + 근거 문구', lpos=(240, 600))
go('U15', 'l', 'N14', 'r', via=[(362, 237), (362, 529)])
go('N14', 't', 'P10', 'b')
# 저장소
go('S8', 't', 'N1', 'l', via=[(60, 940), (28, 940), (28, 769)], dashed=True, color=STO)
go('S1', 't', 'N4', 'b', via=[(285, 935), (450, 935)], dashed=True, color=STO)
go('S7', 't', 'N4', 'b', via=[(455, 935), (500, 935)], dashed=True, color=STO)
go('N11', 'b', 'S7', 't', via=[(500, 800), (520, 800), (520, 955), (430, 955)], color=STO)
go('S2', 't', 'N2', 'b', via=[(625, 940), (780, 940)], dashed=True, color=STO)
go('S6', 't', 'N2', 'b', via=[(1135, 945), (860, 945)], dashed=True, color=STO)
go('S5', 't', 'N5', 'b', via=[(965, 800), (870, 800)], dashed=True, color=STO)
go('N10', 'b', 'S5', 't', via=[(1210, 915), (965, 915)], color=STO)
go('N10', 'b', 'S6', 't', via=[(1210, 930), (1135, 930)], color=STO)
go('N9', 'r', 'S4', 't', via=[(1345, 709), (1345, 950), (1305, 950)], color=STO)

notes = [
  ('①②③④⑤ = 대표 흐름 : 지도 → 가게 상세 → 메뉴 상세 → (로그인 확인) → 기록 저장 → 메뉴 상세가 새 별점 · 속성으로 다시 그려짐', ACC),
  ('B1 : 해산물 제외는 "미포함 확정"만 통과 → 출시 직후 결과 0곳 가능 (T2, U5). 지인 베타 태깅으로 채운다', WARN),
  ('B9 : 미포함 확정 뒤 "들어있음" 1개 → 변경 의심, 필터에서 빠짐 (T9). 국물은 다수결만', WARN),
  ('B4 : 시드 값은 표를 세지 않는 초기값. 태깅 확정 시 근거가 "방문자 n명"으로 바뀐다', WARN),
  ('형태만 시드에 넣고 (라멘 / 츠케멘 / 마제소바 · 비빔) 타레 · 온도는 v2.0 밖 → 마커는 기본 / 통과 n개 / 흐림 세 모양', WARN),
]
for i, (s, c) in enumerate(notes):
  t(30, 1050 + i * 22, s, 12, c)
t(30, 1180, '표 (breadboard.md) 가 기준이다. 이 그림은 대표 흐름과 주요 갈래만 그리며, 표에 없는 동작은 없다', 11, DIM)

colors = [FG, DIM, ACC, SYS, STO, WARN]
defs = ''.join(f'<marker id="ah{c[1:]}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="{c}"/></marker><marker id="ahd{c[1:]}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="{c}"/></marker>' for c in colors)
head = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="NanumSquareRound, Pretendard, sans-serif">', f'<defs>{defs}</defs>', f'<rect width="{W}" height="{H}" fill="{BG}"/>']
title = []
t(30, 34, '라멘타쿠 v2.0 — Breadboard (selected-design, draft)', 18, FG, 'bold', layer=title)
t(30, 54, '실선 = 동작 흐름 · 점선 = 데이터 / 보이는 결과 · 위 = 화면, 아래 = 서버 계산과 저장소', 12, DIM, layer=title)
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(head + title + lines + boxes + texts + ['</svg>']))
