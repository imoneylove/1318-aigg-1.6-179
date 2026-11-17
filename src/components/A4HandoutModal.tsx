import React, { useEffect, useState } from 'react';
import { Check, Download, X } from 'lucide-react';
import {
  CHARACTER_CAST,
  DISCLAIMER_TEXT,
  PRESENTATION_DECK_SUBTITLE,
  PRESENTATION_HEADLINE,
  SLIDES,
} from '../data/presentationContent';
import { generateColorfulHandoutPdf } from '../utils/pdfHandoutGenerator';

interface A4HandoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const thumbnailCache = new Map<string, string>();

function compressImageForPrint(src: string): Promise<string> {
  const cached = thumbnailCache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const targetW = 560;
        const targetH = 420;
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        const scale = Math.max(targetW / img.width, targetH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = (targetH - drawH) / 2;
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        thumbnailCache.set(src, dataUrl);
        resolve(dataUrl);
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export const A4HandoutModal: React.FC<A4HandoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [thumbMap, setThumbMap] = useState<Record<string, string>>({});
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating' | 'done'>('idle');

  useEffect(() => {
    if (!isOpen) return;
    setPdfStatus('idle');
    let active = true;
    const sources = [
      SLIDES[0].imageSrc,
      SLIDES[1].imageSrc,
      SLIDES[2].imageSrc,
      SLIDES[3].imageSrc,
      SLIDES[4].imageSrc,
      SLIDES[5].imageSrc,
    ];
    Promise.all(sources.map((src) => compressImageForPrint(src))).then((urls) => {
      if (!active) return;
      const nextMap: Record<string, string> = {};
      sources.forEach((src, i) => {
        nextMap[src] = urls[i];
      });
      setThumbMap(nextMap);
    });
    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getImg = (src: string) => thumbMap[src] ?? src;

  const handleDownloadPdf = async () => {
    if (pdfStatus === 'generating') return;
    setPdfStatus('generating');
    try {
      await generateColorfulHandoutPdf();
      setPdfStatus('done');
    } catch {
      setPdfStatus('idle');
      window.print();
    }
  };

  return (
    <div
      id="print-a4-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/65"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handout-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="print-a4-modal-shell"
        className="bg-[#FBF9F5] border border-stone-300 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-xl overflow-hidden"
      >
        {/* Top Action Bar (Hidden when printing) */}
        <div className="px-5 py-3.5 border-b border-stone-200 bg-[#F2EDE4] flex flex-wrap items-center justify-between gap-3 no-print">
          <div>
            <p className="text-xs font-medium text-[#B4432C]">
              全彩圖文雜誌版講義 · 完整收錄人物插畫、體溫計防線與資金斷鏈警訊
            </p>
            <h2
              id="handout-modal-title"
              className="font-editorial text-lg font-bold text-stone-900"
            >
              《i級投資客日記》隨堂彩色講義預覽
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden sm:inline text-xs text-stone-600">
              點擊直接匯出 3 頁全彩人物圖文 PDF 檔案
            </span>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfStatus === 'generating'}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 ${
                pdfStatus === 'done'
                  ? 'bg-[#15803D] text-[#FBF9F5] hover:bg-[#166534]'
                  : 'bg-[#B4432C] text-[#FBF9F5] hover:bg-[#933420]'
              }`}
            >
              {pdfStatus === 'done' ? (
                <Check className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Download className="w-4 h-4" aria-hidden="true" />
              )}
              <span>
                {pdfStatus === 'generating'
                  ? '正在產生彩色 PDF…'
                  : pdfStatus === 'done'
                    ? '已下載彩色 PDF（點此再存一份）'
                    : '下載彩色 PDF'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="關閉講義預覽"
              className="p-1.5 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-300/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable Full-Color Magazine Handout */}
        <div id="print-a4-scroll" className="overflow-y-auto p-4 sm:p-8 bg-[#EAE3D5]">
          <article
            id="print-a4-sheet"
            className="mx-auto bg-[#FBF9F5] text-stone-900 border border-stone-300 rounded-xl p-6 sm:p-10 max-w-[860px] space-y-6"
          >
            {/* Colorful Editorial Masthead */}
            <header
              className="masthead rounded-xl p-6 sm:p-7 text-[#FBF9F5] print-avoid-break bg-[#241E1C]"
              style={{
                background: 'linear-gradient(135deg, #1C1917 0%, #292524 58%, #9A3412 100%)',
              }}
            >
              <p className="text-xs tracking-widest text-[#FCD34D] font-medium">
                i級投資客日記 · 全彩理財簡報特刊
              </p>
              <h1 className="font-editorial text-xl sm:text-2xl font-bold leading-snug mt-2 text-balance">
                {PRESENTATION_HEADLINE}
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 leading-relaxed">
                {PRESENTATION_DECK_SUBTITLE}
              </p>
            </header>

            {/* Opening Wu Danru Note + Cast Trio */}
            <section className="rounded-xl bg-[#F2EDE4] border border-stone-200 p-5 print-avoid-break">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-5">
                  <img
                    src={getImg(SLIDES[0].imageSrc)}
                    alt={SLIDES[0].imageAlt}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/3] object-cover rounded-lg border border-stone-300"
                  />
                </div>
                <div className="sm:col-span-7 space-y-2.5">
                  <p className="text-xs font-bold tracking-wider text-[#B4432C]">
                    開場白｜咖啡端穩了，我們再來算帳
                  </p>
                  <p className="text-sm text-stone-800 leading-relaxed">
                    人生最怕什麼？不是沒趕上熱鬧，而是夢正做到最香甜、香檳剛開到一半，會計師突然拿著計算機來敲門！與其盯著紅綠數字懷疑人生，不如跟著三位主角——<strong>{CHARACTER_CAST[0].name}</strong>、<strong>{CHARACTER_CAST[1].name}</strong>與<strong>{CHARACTER_CAST[2].name}</strong>，把這場 AI 夢醒、資金斷鏈與不動產重返榮耀的大戲一次看明白。
                  </p>
                </div>
              </div>
            </section>

            {/* Colorful Illustrated Chapters */}
            <section className="space-y-4">
              {/* Chapter 1 */}
              <div className="rounded-xl bg-[#FBF9F5] border border-stone-200 p-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center print-avoid-break">
                <div className="sm:col-span-4">
                  <img
                    src={getImg(SLIDES[1].imageSrc)}
                    alt={SLIDES[1].imageAlt}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/3] object-cover rounded-lg border border-stone-200"
                  />
                </div>
                <div className="sm:col-span-8 space-y-2">
                  <p className="text-xs font-bold text-[#991B1B]">
                    第一幕｜AI 美夢意外破滅的三張現實帳單
                  </p>
                  <h3 className="font-editorial text-lg font-bold text-stone-900">
                    大砍 1.6 兆美元資本支出，電費單比想像力誠實
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    SemiAnalysis 將 2027–2030 年 AI 加速器資本支出大砍 <strong>1.6 兆美元</strong>，2030 年電力需求從 122.8 GW 砍掉 34% 剩 <strong>80.7 GW</strong>（少掉約 42 座核電廠），2028 年 HBM 記憶體需求也下修 30%。原因很人間：<strong>賺不回本</strong>（砸錢裝潢米其林餐廳，客人卻只點滷肉飯）、<strong>借不到錢</strong>（沒巨頭背書免談）、<strong>電網供不起</strong>。算盤打到最後，夢想還是要向物理低頭。
                  </p>
                </div>
              </div>

              {/* Chapter 2 */}
              <div className="rounded-xl bg-[#FBF9F5] border border-stone-200 p-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center print-avoid-break">
                <div className="sm:col-span-4">
                  <img
                    src={getImg(SLIDES[2].imageSrc)}
                    alt={SLIDES[2].imageAlt}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/3] object-cover rounded-lg border border-stone-200"
                  />
                </div>
                <div className="sm:col-span-8 space-y-2.5">
                  <p className="text-xs font-bold text-[#B4432C]">
                    第二幕｜誰留在餐廳洗碗？179.63 億賣超與「火燒連環船」
                  </p>
                  <h3 className="font-editorial text-lg font-bold text-stone-900">
                    買了 5 檔 ETF 以為分散？摘下面具全姓「台積電」，小心赤壁連環船！
                  </h3>
                  <div className="rounded-lg bg-[#FEF2F2] border border-[#B4432C] p-3 text-xs text-stone-800 leading-relaxed space-y-1">
                    <p className="font-bold text-[#991B1B]">
                      ★ 重點推導｜春江水暖鴨先知：為什麼散戶還在買，投信卻要先砍 179.63 億？
                    </p>
                    <p>
                      大盤暴跌當天散戶往往慢半拍、還在搶反彈，但基金經理人預見未來 1–3 天將湧現「大量贖回潮」。基金不能印鈔票，與其等明天買盤抽乾被迫殺在跌停板，不如趁現在市場還有承接力道，<strong>先行變現築好現金堤防</strong>，一舉打破連 24 買紀錄。
                    </p>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    台積電占大盤逾 40%（一度達 44.3%），<strong>0052 含積約 68.9%、0050／006208 近 60%</strong>，連主動式上限也從 10% 拉高到 25%——買五檔 ETF 就像與五個戴面具的人交往，情人節拆開全姓「台」名「積電」！逆風火燒連環船時，<strong>曹操（台積電）照樣走華容道當霸主，真正抬出場的是開槓桿又被鐵索鎖死的士兵</strong>；順風享受船速時，船邊永遠要掛好「低相關資產與現金緩衝」救生艇。
                  </p>
                </div>
              </div>

              {/* Chapter 3 */}
              <div className="rounded-xl bg-[#FBF9F5] border border-stone-200 p-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center print-avoid-break">
                <div className="sm:col-span-4">
                  <img
                    src={getImg(SLIDES[3].imageSrc)}
                    alt={SLIDES[3].imageAlt}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/3] object-cover rounded-lg border border-stone-200"
                  />
                </div>
                <div className="sm:col-span-8 space-y-2">
                  <p className="text-xs font-bold text-[#991B1B]">
                    第三幕｜紅綠體溫計看懂「反彈糖果」陷阱
                  </p>
                  <h3 className="font-editorial text-lg font-bold text-stone-900">
                    月跌 -11.32% 收到超速罰單，Put/Call 54.08% 仍在紅燈區
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    別用算命猜底部，看兩個體溫計：<strong>① 月 K 線超速罰單</strong>——單月急跌 <strong>-11.32%</strong>（超過 -10% 紅線）靠近「年線」易踩到彈簧反彈；<strong>② Put/Call Ratio 膽小鬼指數</strong>——目前僅 <strong>54.08%</strong>（<span className="text-[#991B1B] font-semibold">低於 70% 屬異常保守紅燈區</span>，須站上 <span className="text-[#15803D] font-semibold">85%–100%+ 才算正常偏多綠燈區</span>）。白話文就是「長空底下的短線急殺」：反彈會塞給你一顆糖吃，但別吃了糖就忘記寫功課。
                  </p>
                </div>
              </div>

              {/* Long-Bearish Two Defense Sentinels (S&P 500 + Financial Index) */}
              <div className="rounded-xl bg-[#FEF2F2] border border-[#B4432C] p-5 space-y-2 print-avoid-break">
                <p className="text-xs font-bold text-[#991B1B]">
                  全面轉空必看｜決定派對是否徹底熄燈的兩道最後防線
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-800 leading-relaxed">
                  <div>
                    <p className="font-bold text-stone-900 mb-1">
                      1. 全球與台股全面長空關鍵：美國 S&amp;P 500
                    </p>
                    <p>
                      台股這幾年每次急殺完還能爬起來創高，說穿了真的不是我們特別勇，全靠美國老大哥 <strong>S&amp;P 500 沒破線</strong>在撐腰！偏偏老大哥現在正在畫那個讓人手心冒汗的<strong>「頭肩頂右肩」</strong>，一旦正式跌破下方上升趨勢線，全球跟台股的長空大戲可就全面確立了。
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 mb-1">
                      2. 多頭最後一棒防線：台股金融類指數
                    </p>
                    <p>
                      科技股派對吵完一輪後，台股城門口還剩誰在拿盾牌撐場？就是平常不搶鏡、看似溫吞的<strong>金融股</strong>！它是多頭手裡最後一棒防線，萬一連這位最穩的守門員都跌破前低，最後一棒火炬一熄火，盤面就全面轉空，到時候真的該把錢包收好乖乖睡覺。
                    </p>
                  </div>
                </div>
              </div>

              {/* Chapter 4: Credit Crunch */}
              <div className="rounded-xl bg-[#FFFBEB] border border-[#B45309] p-5 space-y-3 print-avoid-break">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4">
                    <img
                      src={getImg(SLIDES[4].imageSrc)}
                      alt={SLIDES[4].imageAlt}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full aspect-[4/3] object-cover rounded-lg border border-stone-300"
                    />
                  </div>
                  <div className="sm:col-span-8">
                    <p className="text-xs font-bold text-[#991B1B]">
                      第四幕｜信用與銀行資金斷鏈三大警訊
                    </p>
                    <h3 className="font-editorial text-lg font-bold text-stone-900 mt-0.5">
                      早盤二次斷頭零寬限、可轉債全面破百、銀行年底抽銀根
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-800 leading-relaxed">
                  <div className="p-3 rounded-lg bg-[#FBF9F5] border border-stone-200">
                    <p className="font-bold text-[#991B1B] mb-1">1. 早盤二次斷頭指標</p>
                    <p>
                      先前已發過追繳令，近期個股再破底（如國巨、華新科創低）屬「二次追繳」，不再給兩天補錢寬限期，而是<strong>隔天一早開盤由券商直接斷頭砍出</strong>；加上怕追繳令寄回家被發現的自我了結賣壓，造成每日「早盤斷頭急殺 ➔ 護盤拉抬 ➔ 盤中接電話再砍」。遇追繳令務必直接減碼，切勿硬補錢。
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FBF9F5] border border-stone-200">
                    <p className="font-bold text-[#991B1B] mb-1">2. 可轉債異常破發崩跌</p>
                    <p>
                      過往理論價 92 元的新 CB（宜特、聯電）掛牌皆 110–128 元、隔日幾乎穩賺漲停；自「大聯大四」摔到 90 元（隔日 87–88 元）後全面破百——「華邦電四」95 元、「建新三」96 元，連周萬順家族（「一詮」已發到「一詮七」）的「立誠一（65971）」轉換市值 93 元且有 100 元賣回權保底，市價竟崩至 <strong>84–85 元</strong>。
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FBF9F5] border border-stone-200">
                    <p className="font-bold text-[#991B1B] mb-1">3. 銀行與信用三大斷鏈</p>
                    <p>
                      (1) 銀行 12 月放款見底，主動通知大戶年底無錢可借；(2) 部分機構對到期「不限用途款項借貸」不再給借新還舊；(3) 拒放 20 年低利房貸（「有得借就好、不敢問利率」），過去「四代同堂、五代同堂」層層質押開槓桿買房與套利者年底到期面臨斷鏈。
                    </p>
                  </div>
                </div>
              </div>

              {/* Chapter 5 */}
              <div className="rounded-xl bg-[#F2EDE4] border border-stone-300 p-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center print-avoid-break">
                <div className="sm:col-span-4">
                  <img
                    src={getImg(SLIDES[5].imageSrc)}
                    alt={SLIDES[5].imageAlt}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[4/3] object-cover rounded-lg border border-stone-300"
                  />
                </div>
                <div className="sm:col-span-8 space-y-2">
                  <p className="text-xs font-bold text-[#1E4D5C]">
                    第五幕｜不動產與冷灶悄悄「重返榮耀」
                  </p>
                  <h3 className="font-editorial text-lg font-bold text-stone-900">
                    沒人敢蓋新屋與擴廠的三五年，正是時間憋出大缺口的起點
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    當一個產業慘到連續幾年沒人敢擴廠，舊船報廢、老房折舊，但人類剛性需求不會歸零，「被動去庫存」就會累積出十年機會：就像 2015–2018 年航運業大缺船；大家嫌棄過時的不動產更是如此——多年供給不足後，<strong>東京新建商辦租金年漲約 20%（B 級商辦年漲 19%），房東收租成長率竟贏過一票科技業，穩穩重返榮耀</strong>！而中國固投年減 8.1%、房投年減 21.6%，住宅新開工從 8.81 億平米連四年縮到 <strong>4.30 億平米</strong>，居民消費佔 GDP 也停在 39%–40% 的低檔地板。人總要吃漢堡、穿衣服、住房子，留點清醒給冷灶，時間永遠是最有耐心的裁判。
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Thermometer Cheat Sheet */}
            <section className="rounded-xl border border-stone-200 bg-[#FBF9F5] p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs print-avoid-break">
              <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]">
                <span className="font-bold text-[#991B1B] block">異常警戒紅燈區</span>
                <span className="text-stone-800 mt-1 block">
                  Put/Call &lt; 70%（目前 54.08%）或單月跌幅破 -10%（目前 -11.32%）
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FCD34D]">
                <span className="font-bold text-[#B45309] block">警戒觀望琥珀區</span>
                <span className="text-stone-800 mt-1 block">
                  Put/Call 70%–84% 籌碼修復中，或單月跌幅進入 -8% 發燒區
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#ECFDF3] border border-[#86EFAC]">
                <span className="font-bold text-[#15803D] block">正常偏多綠燈區</span>
                <span className="text-stone-800 mt-1 block">
                  Put/Call 站穩 85%–100%+，搭配冷灶 7–10 年供給缺口重返榮耀
                </span>
              </div>
            </section>

            {/* Disclaimer */}
            <footer className="border-t border-stone-300 pt-3 text-xs text-stone-600 leading-relaxed print-avoid-break">
              <p className="font-bold text-stone-800 mb-1">免責聲明</p>
              <p>{DISCLAIMER_TEXT}</p>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
};
