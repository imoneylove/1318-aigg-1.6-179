import { jsPDF } from 'jspdf';
import {
  CHARACTER_CAST,
  DISCLAIMER_TEXT,
  PRESENTATION_DECK_SUBTITLE,
  PRESENTATION_HEADLINE,
  SLIDES,
} from '../data/presentationContent';

export const PDF_FILENAME = 'i級投資客日記_AI夢醒與不動產重返榮耀_彩色講義.pdf';

const PAGE_W = 1488;
const PAGE_H = 2104;
const MARGIN = 64;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  borderColor: string
) {
  ctx.save();
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.clip();

  if (img && img.width > 0 && img.height > 0) {
    const scale = Math.max(w / img.width, h / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const dx = x + (w - drawW) / 2;
    const dy = y + (h - drawH) / 2;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  } else {
    ctx.fillStyle = '#E7E5E4';
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.stroke();
  ctx.restore();
}

const NO_LINE_START_PUNCT = new Set([
  '。', '，', '、', '；', '：', '！', '？', '」', '』', '）', ')', '.', ',', '%', '％',
]);

function tokenizeForWrap(text: string): string[] {
  // Keep contiguous ASCII alphanumeric + decimal/percent/hyphen sequences together (e.g., 122.8, ETF, -11.32%)
  return text.match(/[A-Za-z0-9]+(?:[.%+-][A-Za-z0-9]+)*%?|./gu) ?? [];
}

export function wrapTextLines(
  measureFn: (text: string) => number,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (!para) {
      lines.push('');
      continue;
    }
    const tokens = tokenizeForWrap(para);
    let current = '';

    for (const token of tokens) {
      const candidate = current + token;
      if (
        measureFn(candidate) > maxWidth &&
        current.length > 0 &&
        !NO_LINE_START_PUNCT.has(token)
      ) {
        lines.push(current.trimEnd());
        current = token === ' ' ? '' : token;
      } else {
        current = candidate;
      }
    }
    if (current.length > 0) {
      lines.push(current.trimEnd());
    }
  }
  return lines;
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  color: string
): number {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  const lines = wrapTextLines((s) => ctx.measureText(s).width, text, maxWidth);
  lines.forEach((line, idx) => {
    ctx.fillText(line, x, y + idx * lineHeight);
  });
  ctx.restore();
  return y + lines.length * lineHeight;
}

interface ChapterBlockOptions {
  ctx: CanvasRenderingContext2D;
  y: number;
  h: number;
  bg: string;
  border: string;
  img: HTMLImageElement | null;
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  body: string;
}

function drawChapterCard({
  ctx,
  y,
  h,
  bg,
  border,
  img,
  eyebrow,
  eyebrowColor,
  title,
  body,
}: ChapterBlockOptions) {
  const cardW = PAGE_W - MARGIN * 2;
  const pad = 34;

  ctx.save();
  ctx.fillStyle = bg;
  drawRoundedRect(ctx, MARGIN, y, cardW, h, 18);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const imgW = 360;
  const imgH = 270;
  const imgX = MARGIN + pad;
  const imgY = y + Math.round((h - imgH) / 2);
  drawCoverImage(ctx, img, imgX, imgY, imgW, imgH, 14, '#D6D3D1');

  const textX = imgX + imgW + 38;
  const textW = cardW - pad * 2 - imgW - 38;
  let cursorY = y + pad;

  ctx.save();
  ctx.font = '700 21px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillStyle = eyebrowColor;
  ctx.textBaseline = 'top';
  ctx.fillText(eyebrow, textX, cursorY);
  ctx.restore();
  cursorY += 34;

  cursorY = drawWrappedText(
    ctx,
    title,
    textX,
    cursorY,
    textW,
    40,
    '700 28px "Fraunces", "Noto Serif TC", Georgia, serif',
    '#1C1917'
  );
  cursorY += 14;

  drawWrappedText(
    ctx,
    body,
    textX,
    cursorY,
    textW,
    36,
    '400 22px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#44403C'
  );
}

export async function generateColorfulHandoutPdf(): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 800)),
      ]);
    } catch {
      // Ignore font timing issues and use system fallback
    }
  }

  const [img0, img1, img2, img3, img5] = await Promise.all([
    loadImageElement(SLIDES[0].imageSrc),
    loadImageElement(SLIDES[1].imageSrc),
    loadImageElement(SLIDES[2].imageSrc),
    loadImageElement(SLIDES[3].imageSrc),
    loadImageElement(SLIDES[5].imageSrc),
  ]);

  // --- PAGE 1 ---
  const p1 = document.createElement('canvas');
  p1.width = PAGE_W;
  p1.height = PAGE_H;
  const ctx1 = p1.getContext('2d');
  if (!ctx1) throw new Error('Canvas 2D unavailable');

  ctx1.fillStyle = '#FBF9F5';
  ctx1.fillRect(0, 0, PAGE_W, PAGE_H);

  // Masthead banner
  const mastW = PAGE_W - MARGIN * 2;
  const mastH = 248;
  ctx1.save();
  const grad = ctx1.createLinearGradient(MARGIN, 56, MARGIN + mastW, 56 + mastH);
  grad.addColorStop(0, '#1C1917');
  grad.addColorStop(0.58, '#292524');
  grad.addColorStop(1, '#9A3412');
  ctx1.fillStyle = grad;
  drawRoundedRect(ctx1, MARGIN, 56, mastW, mastH, 20);
  ctx1.fill();
  ctx1.restore();

  ctx1.save();
  ctx1.font = '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx1.fillStyle = '#FCD34D';
  ctx1.textBaseline = 'top';
  ctx1.fillText('i級投資客日記 · 全彩理財簡報特刊', MARGIN + 42, 86);
  ctx1.restore();

  const titleEndY = drawWrappedText(
    ctx1,
    PRESENTATION_HEADLINE,
    MARGIN + 42,
    122,
    mastW - 84,
    44,
    '700 33px "Fraunces", "Noto Serif TC", Georgia, serif',
    '#FBF9F5'
  );

  drawWrappedText(
    ctx1,
    PRESENTATION_DECK_SUBTITLE,
    MARGIN + 42,
    titleEndY + 10,
    mastW - 84,
    28,
    '400 19px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#E7E5E4'
  );

  // Opening Trio Card
  drawChapterCard({
    ctx: ctx1,
    y: 324,
    h: 262,
    bg: '#F2EDE4',
    border: '#D6D3D1',
    img: img0,
    eyebrow: '開場白｜咖啡端穩了，我們再來算帳',
    eyebrowColor: '#B4432C',
    title: '夢做到最香甜時，會計師拿著計算機來敲門',
    body: `人生最怕什麼？不是沒趕上熱鬧，而是香檳剛開到一半，會計師突然拿著計算機來按電鈴！不如跟著三位主角——${CHARACTER_CAST[0].name}、${CHARACTER_CAST[1].name}與${CHARACTER_CAST[2].name}，把「AI 美夢降溫、資金斷鏈」與「不動產重返榮耀」一次算明白。`,
  });

  // Chapter 1 Card
  drawChapterCard({
    ctx: ctx1,
    y: 606,
    h: 428,
    bg: '#FBF9F5',
    border: '#D6D3D1',
    img: img1,
    eyebrow: '第一幕｜AI 美夢意外破滅的三張現實帳單',
    eyebrowColor: '#991B1B',
    title: '大砍 1.6 兆美元資本支出，電費單比想像力誠實',
    body: 'SemiAnalysis 將 2027–2030 年 AI 加速器資本支出大砍 1.6 兆美元，2030 年電力需求從 122.8 GW 砍掉 34% 剩 80.7 GW（少掉約 42 座核電廠），2028 年 HBM 需求下修 30%。原因很人間：\n1. 賺不回本：砸大錢裝潢米其林餐廳，客人進來卻只點滷肉飯。\n2. 借不到錢：債主清醒了，沒有大型科技巨頭背書免談。\n3. 電網供不起：算盤打到最後，夢想終究得向物理低頭。',
  });

  // Chapter 2 Card (Five Masks + Chibi Fleet + '春江水暖鴨先知' logic box)
  const ch2Y = 1054;
  const ch2H = 900;
  const ch2Pad = 32;
  ctx1.save();
  ctx1.fillStyle = '#FBF9F5';
  drawRoundedRect(ctx1, MARGIN, ch2Y, mastW, ch2H, 18);
  ctx1.fill();
  ctx1.strokeStyle = '#D6D3D1';
  ctx1.lineWidth = 2;
  ctx1.stroke();
  ctx1.restore();

  drawCoverImage(ctx1, img2, MARGIN + ch2Pad, ch2Y + 30, 340, 255, 14, '#D6D3D1');

  const ch2TextX = MARGIN + ch2Pad + 340 + 34;
  const ch2TextW = mastW - ch2Pad * 2 - 340 - 34;
  let ch2CurY = ch2Y + 28;

  ctx1.save();
  ctx1.font = '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx1.fillStyle = '#B4432C';
  ctx1.textBaseline = 'top';
  ctx1.fillText('第二幕｜179.63 億史上最大賣超 ╳ 赤壁火燒連環船', ch2TextX, ch2CurY);
  ctx1.restore();
  ch2CurY += 32;

  ch2CurY = drawWrappedText(
    ctx1,
    '買 5 檔 ETF 以為分散？不，你買了 5 張「鐵索連環船」船票！',
    ch2TextX,
    ch2CurY,
    ch2TextW,
    38,
    '700 26px "Fraunces", "Noto Serif TC", Georgia, serif',
    '#1C1917'
  );
  ch2CurY += 10;

  drawWrappedText(
    ctx1,
    '同時跟五個戴面具的人交往，情人節拆開全姓「台」名「積電」——台積電占大盤逾 40%（曾達 44.3%），0052 含積約 68.9%、0050／006208 近 60%，主動式單一持股上限也從 10% 拉高到 25%，全部被同一條大鐵鍊鎖死。',
    ch2TextX,
    ch2CurY,
    ch2TextW,
    32,
    '400 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#44403C'
  );

  // Box A: Chibi Iron-Chained Fleet Metaphor & Lifeboat Rule
  const fleetX = MARGIN + ch2Pad;
  const fleetY = ch2Y + 312;
  const fleetW = mastW - ch2Pad * 2;
  const fleetH = 204;
  ctx1.save();
  ctx1.fillStyle = '#F0F7F9';
  drawRoundedRect(ctx1, fleetX, fleetY, fleetW, fleetH, 14);
  ctx1.fill();
  ctx1.strokeStyle = '#1E4D5C';
  ctx1.lineWidth = 2.5;
  ctx1.stroke();
  ctx1.font = '700 22px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx1.fillStyle = '#1E4D5C';
  ctx1.textBaseline = 'top';
  ctx1.fillText('赤壁火燒連環船警訊｜曹操不會倒，倒的是船上沒救生艇的士兵', fleetX + 26, fleetY + 20);
  ctx1.restore();

  drawWrappedText(
    ctx1,
    '順風時萬船齊發看似最穩，但美股逆風外資提款一定優先砍最大權值股。曹操（台積電）技術與現金滿手，回檔兩三成照樣走華容道回北方當霸主；真正被抬出場的是高檔全倉甚至質押開槓桿的士兵——順風享受船速時，船邊永遠要掛好「低相關資產與現金緩衝」救生艇。',
    fleetX + 26,
    fleetY + 60,
    fleetW - 52,
    33,
    '500 19px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#1C1917'
  );

  // Box B: Prominent Highlight Callout inside Chapter 2
  const boxX = MARGIN + ch2Pad;
  const boxY = ch2Y + 534;
  const boxW = mastW - ch2Pad * 2;
  const boxH = 342;
  ctx1.save();
  ctx1.fillStyle = '#FEF2F2';
  drawRoundedRect(ctx1, boxX, boxY, boxW, boxH, 14);
  ctx1.fill();
  ctx1.strokeStyle = '#B4432C';
  ctx1.lineWidth = 3;
  ctx1.stroke();
  ctx1.font = '700 23px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx1.fillStyle = '#991B1B';
  ctx1.textBaseline = 'top';
  ctx1.fillText('★ 核心推導｜春江水暖鴨先知：為什麼散戶還在買，投信卻要先砍 179.63 億？', boxX + 26, boxY + 20);
  ctx1.restore();

  drawWrappedText(
    ctx1,
    '1. 散戶情緒與贖回總是慢盤面一拍：11/16 盤面急殺當天，許多散戶還在搶反彈或沒反應過來；但專業基金經理人非常清楚，恐慌新聞發酵 1–3 天後，解約與「大量贖回潮」就會接踵湧入。\n2. 基金無法印鈔票，必須提前築好現金堤防：面對預期中的贖回壓力，投信與其等到明天買盤抽乾、被迫殺在更低點或跌停板，不如趁現在盤面仍有承接力道，先行砍出權值股換取現金。\n3. 終結連 24 買的機構警訊：投信在 11/16 單日賣超 179.63 億元創史上最大，大資金已先搭計程車備好現金，留下沒掛救生艇的人在連環船上洗碗。',
    boxX + 26,
    boxY + 64,
    boxW - 52,
    33,
    '500 19px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#292524'
  );

  // Page 1 Footer
  ctx1.save();
  ctx1.strokeStyle = '#D6D3D1';
  ctx1.lineWidth = 1.5;
  ctx1.beginPath();
  ctx1.moveTo(MARGIN, 1988);
  ctx1.lineTo(PAGE_W - MARGIN, 1988);
  ctx1.stroke();
  ctx1.font = '500 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx1.fillStyle = '#57534E';
  ctx1.fillText('i級投資客日記 · 全彩隨堂講義', MARGIN, 2016);
  ctx1.textAlign = 'right';
  ctx1.fillText('第 1 / 3 頁', PAGE_W - MARGIN, 2016);
  ctx1.restore();

  // --- PAGE 2 ---
  const p2 = document.createElement('canvas');
  p2.width = PAGE_W;
  p2.height = PAGE_H;
  const ctx2 = p2.getContext('2d');
  if (!ctx2) throw new Error('Canvas 2D unavailable');

  ctx2.fillStyle = '#FBF9F5';
  ctx2.fillRect(0, 0, PAGE_W, PAGE_H);

  // Page 2 Header bar
  ctx2.save();
  ctx2.font = '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx2.fillStyle = '#B4432C';
  ctx2.textBaseline = 'top';
  ctx2.fillText('i級投資客日記 · 恐慌體溫計、長空防線與資金斷鏈警訊', MARGIN, 58);
  ctx2.strokeStyle = '#D6D3D1';
  ctx2.lineWidth = 1.5;
  ctx2.beginPath();
  ctx2.moveTo(MARGIN, 96);
  ctx2.lineTo(PAGE_W - MARGIN, 96);
  ctx2.stroke();
  ctx2.restore();

  // Chapter 3 Card
  drawChapterCard({
    ctx: ctx2,
    y: 116,
    h: 372,
    bg: '#FBF9F5',
    border: '#D6D3D1',
    img: img3,
    eyebrow: '第三幕｜紅綠體溫計看懂「反彈糖果」陷阱',
    eyebrowColor: '#991B1B',
    title: '月跌 -11.32% 收到超速罰單，Put/Call 54.08% 仍在紅燈區',
    body: '史詩級急殺後別用算命猜底部，看兩個體溫計：\n① 月 K 線超速罰單：單月跌破 -10% 至 -12%（目前 -11.32%）靠近「年線」容易踩到彈簧出現技術性反彈。\n② Put/Call Ratio 膽小鬼指數：目前僅 54.08%（低於 70% 屬異常偏低紅燈區；須站上 85%–100%+ 才算正常偏多綠燈區）。反彈會塞給你一顆糖，但別吃了糖就忘記寫功課。',
  });

  // Long-Bearish Two Defense Sentinels (S&P 500 + Financial Index)
  const defY = 508;
  const defW = PAGE_W - MARGIN * 2;
  const defH = 266;
  ctx2.save();
  ctx2.fillStyle = '#FEF2F2';
  drawRoundedRect(ctx2, MARGIN, defY, defW, defH, 16);
  ctx2.fill();
  ctx2.strokeStyle = '#B4432C';
  ctx2.lineWidth = 2.5;
  ctx2.stroke();
  ctx2.font = '700 22px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx2.fillStyle = '#991B1B';
  ctx2.textBaseline = 'top';
  ctx2.fillText('★ 全面轉空必看防線｜誰撐著最後一口氣？美國 S&P 500 右肩 × 台股金融股前低', MARGIN + 28, defY + 20);
  ctx2.restore();

  const colW = (defW - 84) / 2;
  drawWrappedText(
    ctx2,
    '① 全球與台股全面長空關鍵：美國 S&P 500',
    MARGIN + 28,
    defY + 62,
    colW,
    30,
    '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#1C1917'
  );
  drawWrappedText(
    ctx2,
    '台股過去急殺完還能創高，說穿了真的不是我們特別勇，全靠美國老大哥 S&P 500 沒破線撐腰！偏偏老大哥現在正在畫「頭肩頂右肩」，一旦正式跌破下方上升趨勢線，全球跟台股的長空可就全面確立了。',
    MARGIN + 28,
    defY + 98,
    colW,
    31,
    '400 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#292524'
  );

  const rightColX = MARGIN + 28 + colW + 28;
  drawWrappedText(
    ctx2,
    '② 多頭最後一棒防線：台股金融類指數',
    rightColX,
    defY + 62,
    colW,
    30,
    '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#1C1917'
  );
  drawWrappedText(
    ctx2,
    '科技股派對散場後，台股城門口還剩誰撐著最後一口氣？就是平常穩重不搶鏡的金融股！它是多頭最後一棒防線，若連這位守門員都跌破前低，最後一棒一熄火，盤面就會全面轉空。',
    rightColX,
    defY + 98,
    colW,
    31,
    '400 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#292524'
  );

  // 3-Color Thermometer Cheat Sheet
  const cheatY = 794;
  const cheatW = (PAGE_W - MARGIN * 2 - 40) / 3;
  const cheatH = 192;
  const zones = [
    {
      bg: '#FEF2F2',
      border: '#FCA5A5',
      titleColor: '#991B1B',
      title: '異常警戒紅燈區',
      desc: 'Put/Call < 70%（目前 54.08%）或單月跌幅破 -10%（目前 -11.32%），大戶極度保守。',
    },
    {
      bg: '#FFFBEB',
      border: '#FCD34D',
      titleColor: '#B45309',
      title: '警戒觀望琥珀區',
      desc: 'Put/Call 70%–84% 籌碼修復過渡期，或單月跌幅進入 -8%～-9.9% 發燒震盪帶。',
    },
    {
      bg: '#ECFDF3',
      border: '#86EFAC',
      titleColor: '#15803D',
      title: '正常偏多綠燈區',
      desc: 'Put/Call 站穩 85%–100%+ 結構健康，搭配 7–10 年冷灶供給缺口從容佈局。',
    },
  ];

  zones.forEach((z, idx) => {
    const x = MARGIN + idx * (cheatW + 20);
    ctx2.save();
    ctx2.fillStyle = z.bg;
    drawRoundedRect(ctx2, x, cheatY, cheatW, cheatH, 14);
    ctx2.fill();
    ctx2.strokeStyle = z.border;
    ctx2.lineWidth = 2;
    ctx2.stroke();
    ctx2.font = '700 21px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx2.fillStyle = z.titleColor;
    ctx2.textBaseline = 'top';
    ctx2.fillText(z.title, x + 22, cheatY + 22);
    ctx2.restore();

    drawWrappedText(
      ctx2,
      z.desc,
      x + 22,
      cheatY + 60,
      cheatW - 44,
      30,
      '400 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
      '#292524'
    );
  });

  // Chapter 4 Credit Crunch Spotlight on lower half of Page 2 (plenty of breathing room!)
  const ccY = 1016;
  const ccH = 920;
  ctx2.save();
  ctx2.fillStyle = '#FFFBEB';
  drawRoundedRect(ctx2, MARGIN, ccY, defW, ccH, 18);
  ctx2.fill();
  ctx2.strokeStyle = '#B45309';
  ctx2.lineWidth = 2.5;
  ctx2.stroke();
  ctx2.font = '700 21px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx2.fillStyle = '#991B1B';
  ctx2.textBaseline = 'top';
  ctx2.fillText('第四幕｜信用與銀行資金斷鏈三大警訊', MARGIN + 34, ccY + 28);
  ctx2.restore();

  drawWrappedText(
    ctx2,
    '早盤二次斷頭零寬限、可轉債全面破百、銀行年底抽銀根',
    MARGIN + 34,
    ccY + 66,
    defW - 68,
    40,
    '700 28px "Fraunces", "Noto Serif TC", Georgia, serif',
    '#1C1917'
  );

  const ccCards = [
    {
      title: '① 早盤急殺斷頭指標：二次追繳不再給兩天寬限，開盤直接斷頭',
      body: '前波下殺已發過一次追繳令，反彈喘息後近期再殺、個股陸續破底（如國巨、華新科創低）。因屬「二次追繳」，維持率不足不再有兩天補錢寬限期，而是隔天一早開盤直接由券商斷頭砍出；加上怕追繳令寄回家被家人發現的自我了結賣壓，形成每日早盤固定戲碼：「早盤券商斷頭砍出 ➔ 護盤基金拉抬 ➔ 盤中接獲追繳電話者再砍出」。遇追繳令務必直接減碼，切勿硬補錢。',
    },
    {
      title: '② 可轉債（CB）異常破發崩跌：連保底賣回權都擋不住現金潮',
      body: '過去新上市 CB（宜特、聯電）理論價值 92 元時掛牌皆 110–128 元、隔日幾乎穩賺漲停；自「大聯大四」摔到 90 元（隔日剩 87–88 元）後全面跌破百元面額——「華邦電四」95 元、「建新三」96 元；連發債老手（同老闆周萬順旗下「一詮」已發到「一詮七」）的「立誠一（65971）」，在轉換市值 93 元且具 100 元賣回權保底下，市價竟崩至 84–85 元。',
    },
    {
      title: '③ 銀行與信用市場三大資金斷鏈：房貸「有得借就不敢問利率」',
      body: '1. 銀行 12 月放款額度見底，罕見主動通知大戶年底無錢可借。\n2. 不限用途款項借貸抽銀根：部分機構對到期借款不再給借新還舊。\n3. 房貸極度緊縮：銀行拒放 20 年低利房貸，過去靠「四代同堂、五代同堂」層層質押開槓桿買房與套利者，年底到期將面臨資金斷鏈。',
    },
  ];

  let ccCurY = ccY + 130;
  ccCards.forEach((card) => {
    const innerH = 244;
    ctx2.save();
    ctx2.fillStyle = '#FBF9F5';
    drawRoundedRect(ctx2, MARGIN + 34, ccCurY, defW - 68, innerH, 12);
    ctx2.fill();
    ctx2.strokeStyle = '#E5DFD3';
    ctx2.lineWidth = 2;
    ctx2.stroke();
    ctx2.restore();

    drawWrappedText(
      ctx2,
      card.title,
      MARGIN + 56,
      ccCurY + 18,
      defW - 112,
      30,
      '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
      '#991B1B'
    );
    drawWrappedText(
      ctx2,
      card.body,
      MARGIN + 56,
      ccCurY + 56,
      defW - 112,
      30,
      '400 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
      '#292524'
    );
    ccCurY += innerH + 18;
  });

  // Page 2 Footer
  ctx2.save();
  ctx2.strokeStyle = '#D6D3D1';
  ctx2.lineWidth = 1.5;
  ctx2.beginPath();
  ctx2.moveTo(MARGIN, 1988);
  ctx2.lineTo(PAGE_W - MARGIN, 1988);
  ctx2.stroke();
  ctx2.font = '500 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx2.fillStyle = '#57534E';
  ctx2.textBaseline = 'top';
  ctx2.fillText('i級投資客日記 · 全彩隨堂講義', MARGIN, 2016);
  ctx2.textAlign = 'right';
  ctx2.fillText('第 2 / 3 頁', PAGE_W - MARGIN, 2016);
  ctx2.restore();

  // --- PAGE 3 ---
  const p3 = document.createElement('canvas');
  p3.width = PAGE_W;
  p3.height = PAGE_H;
  const ctx3 = p3.getContext('2d');
  if (!ctx3) throw new Error('Canvas 2D unavailable');

  ctx3.fillStyle = '#FBF9F5';
  ctx3.fillRect(0, 0, PAGE_W, PAGE_H);

  // Page 3 Header bar
  ctx3.save();
  ctx3.font = '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx3.fillStyle = '#1E4D5C';
  ctx3.textBaseline = 'top';
  ctx3.fillText('i級投資客日記 · 冷灶十年伏筆與角色備忘錄', MARGIN, 58);
  ctx3.strokeStyle = '#D6D3D1';
  ctx3.lineWidth = 1.5;
  ctx3.beginPath();
  ctx3.moveTo(MARGIN, 96);
  ctx3.lineTo(PAGE_W - MARGIN, 96);
  ctx3.stroke();
  ctx3.restore();

  // Chapter 5 Card (Cold Stove)
  drawChapterCard({
    ctx: ctx3,
    y: 118,
    h: 500,
    bg: '#F2EDE4',
    border: '#D6D3D1',
    img: img5,
    eyebrow: '第五幕｜不動產與冷灶悄悄「重返榮耀」',
    eyebrowColor: '#1E4D5C',
    title: '沒人敢蓋新屋與擴廠的三五年，正是時間憋出大缺口的起點',
    body: '當一個產業慘到連續幾年沒人敢擴廠，舊船報廢、老房折舊，但人類剛性需求不會歸零，「被動去庫存」就會悄悄累積出十年機會：就像 2015–2018 年航運業大缺船。\n\n一度被嫌棄的不動產更是如此——多年供給不足後，東京新建商辦租金年漲約 20%（B 級商辦年漲 19%），房東收租成長率竟贏過一票科技業，穩穩重返榮耀！中國固投年減 8.1%、房投年減 21.6%，住宅新開工從 8.81 億平米縮到 4.30 億平米，居民消費佔 GDP 停在 39%–40% 地板。人總要吃漢堡、穿衣服、住房子，時間永遠是最有耐心的裁判。',
  });

  // 3 Cold Stove Case Cards
  const csY = 648;
  const csH = 260;
  const coldCases = [
    {
      title: '東京商辦重返榮耀',
      metric: '新建 +20% · B辦 +19%',
      desc: '都心五區空室率跌破 2%，多年供給克制讓房東租金漲幅贏過一票科技業。',
    },
    {
      title: '中國開工腰斬與剛需地板',
      metric: '8.81 ➔ 4.30 億㎡',
      desc: '新開工連四年縮水，遠低於每年 8–10 億㎡ 剛需；居民消費佔 GDP 停在 39%–40% 地板。',
    },
    {
      title: '航運冷灶歷史前例',
      metric: '被動去庫存 ➔ 大缺船',
      desc: '2015–2018 年沒人敢造新船，老船淘汰後全球貨運剛需逼出十年大行情。',
    },
  ];

  coldCases.forEach((c, idx) => {
    const x = MARGIN + idx * (cheatW + 20);
    ctx3.save();
    ctx3.fillStyle = '#F0F7F9';
    drawRoundedRect(ctx3, x, csY, cheatW, csH, 14);
    ctx3.fill();
    ctx3.strokeStyle = '#A5CBD6';
    ctx3.lineWidth = 2;
    ctx3.stroke();
    ctx3.font = '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx3.fillStyle = '#1E4D5C';
    ctx3.textBaseline = 'top';
    ctx3.fillText(c.title, x + 22, csY + 22);
    ctx3.font = '700 18px "IBM Plex Mono", "Noto Sans TC", sans-serif';
    ctx3.fillStyle = '#B4432C';
    ctx3.fillText(c.metric, x + 22, csY + 58);
    ctx3.restore();

    drawWrappedText(
      ctx3,
      c.desc,
      x + 22,
      csY + 96,
      cheatW - 44,
      32,
      '400 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
      '#292524'
    );
  });

  // Cast Golden Quotes Strip
  const castY = 940;
  const castH = 240;
  CHARACTER_CAST.forEach((char, idx) => {
    const x = MARGIN + idx * (cheatW + 20);
    ctx3.save();
    ctx3.fillStyle = '#FBF9F5';
    drawRoundedRect(ctx3, x, castY, cheatW, castH, 14);
    ctx3.fill();
    ctx3.strokeStyle = '#D6D3D1';
    ctx3.lineWidth = 2;
    ctx3.stroke();
    ctx3.font = '700 19px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx3.fillStyle = '#1C1917';
    ctx3.textBaseline = 'top';
    ctx3.fillText(char.name, x + 22, castY + 22);
    ctx3.font = '500 16px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx3.fillStyle = '#1E4D5C';
    ctx3.fillText(char.role, x + 22, castY + 54);
    ctx3.restore();

    drawWrappedText(
      ctx3,
      `「${char.tagline}」`,
      x + 22,
      castY + 92,
      cheatW - 44,
      30,
      '400 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
      '#44403C'
    );
  });

  // Wu Danru Closing Memo Box
  ctx3.save();
  ctx3.fillStyle = '#F2EDE4';
  drawRoundedRect(ctx3, MARGIN, 1216, defW, 240, 16);
  ctx3.fill();
  ctx3.strokeStyle = '#D6D3D1';
  ctx3.lineWidth = 2;
  ctx3.stroke();
  ctx3.font = '700 22px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx3.fillStyle = '#B4432C';
  ctx3.textBaseline = 'top';
  ctx3.fillText('咖啡算盤小結｜派對散場後，留點清醒給真正耐得住時間的資產', MARGIN + 32, 1244);
  ctx3.restore();

  drawWrappedText(
    ctx3,
    '投資這場長跑，比的從來不是誰在舞台正中央喊得最大聲，而是潮水退去、券商早盤按賣出、銀行年底關上水龍頭時，你手裡有沒有穩穩端著咖啡。看懂美股 S&P 500 與金融股防線、別硬接二次追繳刀子，把眼光放回那些多年無人擴廠的不動產與剛性冷灶，時間永遠會替理性站崗。',
    MARGIN + 32,
    1290,
    defW - 64,
    36,
    '400 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#292524'
  );

  // Disclaimer & Page 3 Footer
  ctx3.save();
  ctx3.strokeStyle = '#D6D3D1';
  ctx3.lineWidth = 1.5;
  ctx3.beginPath();
  ctx3.moveTo(MARGIN, 1720);
  ctx3.lineTo(PAGE_W - MARGIN, 1720);
  ctx3.stroke();
  ctx3.font = '700 20px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx3.fillStyle = '#1C1917';
  ctx3.textBaseline = 'top';
  ctx3.fillText('免責聲明', MARGIN, 1744);
  ctx3.restore();

  drawWrappedText(
    ctx3,
    DISCLAIMER_TEXT,
    MARGIN,
    1780,
    PAGE_W - MARGIN * 2,
    30,
    '400 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    '#57534E'
  );

  ctx3.save();
  ctx3.strokeStyle = '#D6D3D1';
  ctx3.lineWidth = 1.5;
  ctx3.beginPath();
  ctx3.moveTo(MARGIN, 1988);
  ctx3.lineTo(PAGE_W - MARGIN, 1988);
  ctx3.stroke();
  ctx3.font = '500 18px "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx3.fillStyle = '#57534E';
  ctx3.textBaseline = 'top';
  ctx3.fillText('i級投資客日記 · 全彩隨堂講義', MARGIN, 2016);
  ctx3.textAlign = 'right';
  ctx3.fillText('第 3 / 3 頁', PAGE_W - MARGIN, 2016);
  ctx3.restore();

  // Assemble crisp 3-page A4 PDF and save immediately
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imgData1 = p1.toDataURL('image/jpeg', 0.9);
  const imgData2 = p2.toDataURL('image/jpeg', 0.9);
  const imgData3 = p3.toDataURL('image/jpeg', 0.9);

  doc.addImage(imgData1, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  doc.addPage('a4', 'portrait');
  doc.addImage(imgData2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  doc.addPage('a4', 'portrait');
  doc.addImage(imgData3, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

  doc.save(PDF_FILENAME);
}
