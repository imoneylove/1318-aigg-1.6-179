export type CharacterId = 'analyst' | 'muse' | 'frenchie';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  role: string;
  tagline: string;
  personality: string;
  signatureProps: string;
  portraitIllustration: string;
}

export interface SlideMeta {
  id: number;
  shortNavLabel: string;
  chapterCode: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  figureCaption: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    persona: CharacterId;
    reaction: string;
  }[];
}

export const PRESENTATION_HEADLINE =
  'AI 夢醒時分，誰留在餐廳洗碗？從 1.6 兆大砍單與 179 億賣超，看懂不動產為何悄悄「重返榮耀」';

export const PRESENTATION_DECK_SUBTITLE =
  '用算帳的幽默看穿一場派對：當科技造夢撞上電費單與台積電便當，沒人理的不動產與冷灶正靠時間熬出大缺口';

export const CHARACTER_CAST: CharacterProfile[] = [
  {
    id: 'analyst',
    name: '山景算帳主廚（男主）',
    role: '冷靜算帳派 · 說書人',
    tagline: '人生最怕香檳開到一半，會計師拿著計算機來敲門。',
    personality:
      '平頭俐落、深藍亞麻襯衫，眼神總帶著「早就寫在帳本裡」的從容。當全場高舉 AI 夢幻劇本乾杯時，他默默拿出電費單提醒大家：夢想很美，但物理與算盤從不陪你演戲。',
    signatureProps: '熱咖啡、復古計算機、電費帳本',
    portraitIllustration: './src/assets/images/cast_analyst_solo_1794954700814.jpg',
  },
  {
    id: 'muse',
    name: '旗袍靈魂偵探（女主）',
    role: '幽默吐槽官 · 便當開箱專家',
    tagline: '買了十檔名字超夢幻的 ETF，打開木盒怎麼全都是台積電？',
    personality:
      '側分黑髮搭配金色花葉耳環、珍珠翠玉項鍊與青花柔粉旗袍。語氣像跟閨蜜喝下午茶聊理財那樣犀利好笑，專拆「排骨便當換文青木盒」的話術，提醒大家吃了反彈糖果別忘了寫功課。',
    signatureProps: '文青木盒便當、糖果罐、超長帳單',
    portraitIllustration: './src/assets/images/cast_muse_solo_1794954701397.jpg',
  },
  {
    id: 'frenchie',
    name: '法鬥帳房小白（吉祥物）',
    role: '體溫計守護犬 · 洗碗苦主兼冷灶房東',
    tagline: '派對最擠的地方別去搶蛋糕，回黃籃子顧冷灶才睡得著。',
    personality:
      '圓滾大眼與粉嫩吐舌的白色法國鬥牛犬。白天戴著黃手套替高檔追價的資金洗盤子，晚上則守在沒人看好的不動產與冷灶旁打盹，等著時間幫房租與剛性需求討回公道。',
    signatureProps: '黃色洗衣籃、粉紅與正紅胸背帶、洗碗海綿',
    portraitIllustration: './src/assets/images/cast_frenchie_solo_1794954702635.jpg',
  },
];

export const SLIDES: SlideMeta[] = [
  {
    id: 0,
    shortNavLabel: '序幕',
    chapterCode: '序幕 · 算帳開場',
    title: 'AI 夢醒時分，誰留在餐廳洗碗？',
    subtitle: '1.6 兆大砍單與 179 億賣超背後的幽默，看懂不動產為何悄悄「重返榮耀」',
    imageSrc: './src/assets/images/cover_trio_editorial_1794940876673.jpg',
    imageAlt: '算帳主廚、旗袍偵探與白色法鬥小白拿著計算機與超長帳單的插畫',
    figureCaption: 'Fig. 0 — 夢做到最香甜的時候，偏偏會計師拿著計算機來敲門。',
  },
  {
    id: 1,
    shortNavLabel: 'AI算帳',
    chapterCode: '第一幕 · 電費單敲門',
    title: '當 1.6 兆美元的 AI 美夢，撞上電費單與數學題',
    subtitle: 'SemiAnalysis 大砍 2027–2030 資本支出 1.6 兆美元，2030 電力砍 34% 剩 80.7 GW',
    imageSrc: './src/assets/images/slide_capex_braised_pork_1794940877183.jpg',
    imageAlt: '米其林餐廳銀盤上放著一碗滷肉飯，一旁電表與帳本閃爍著現實警訊',
    figureCaption: 'Fig. 1 — 花幾億裝潢米其林餐廳，客人走進來卻只點一碗滷肉飯。',
  },
  {
    id: 2,
    shortNavLabel: '台積電ETF',
    chapterCode: '第二幕 · 179億洗碗與連環船',
    title: '買 5 檔 ETF 以為分散？不，你買了 5 張「鐵索連環船」船票',
    subtitle: '摘下面具全姓台積電（大盤 >40%、0052 達 68.9%），11/16 投信狂砍 179.63 億創史上最大',
    imageSrc: './src/assets/images/slide_dishwashing_bento_1794940879511.jpg',
    imageAlt: '白色法鬥站在木凳上洗碗，旗袍偵探打開文青木盒發現排骨便當，算帳主廚搭計程車離場',
    figureCaption: 'Fig. 2 — 順風萬船齊發看起來最穩，但火燒連環船時，曹操不會倒，倒的是沒掛救生艇的士兵。',
  },
  {
    id: 3,
    shortNavLabel: '恐慌防線',
    chapterCode: '第三幕 · 體溫與防線',
    title: '雙體溫計測速＋美股右肩與金融最後防線',
    subtitle: '單月 -11.32%、Put/Call 54.08% 亮紅燈；緊盯 S&P 500 右肩與金融類股前低',
    imageSrc: './src/assets/images/slide_thermometer_check_1794940879892.jpg',
    imageAlt: '算帳主廚手拿溫度計與超速罰單，法鬥盯著彈簧儀表板，旗袍偵探舉著糖果罐',
    figureCaption: 'Fig. 3 — 跌深了市場會塞一顆糖給你，但老大哥與守門員沒守住就別硬撐。',
  },
  {
    id: 4,
    shortNavLabel: '資金斷鏈',
    chapterCode: '第四幕 · 信用斷鏈警訊',
    title: '早盤直接斷頭、CB 破百、銀行年末抽銀根',
    subtitle: '二次追繳零寬限、可轉債保底失靈、年底放款見底與多代質押面臨斷鏈',
    imageSrc: './src/assets/images/slide_credit_crunch_1794954699480.jpg',
    imageAlt: '銀行大理石金庫大廳裡，算帳主廚剪開紅色追繳通知、旗袍偵探持放大鏡檢視跌破百元的可轉債憑證、法鬥守著乾涸水龍頭與空撲滿',
    figureCaption: 'Fig. 4 — 潮水退得太急時，連原本號稱「保底」的借錢管道都會一起縮手。',
  },
  {
    id: 5,
    shortNavLabel: '冷灶榮耀',
    chapterCode: '第五幕 · 不動產重返榮耀',
    title: '不動產悄悄重返榮耀？十年伏筆躲在冷灶裡',
    subtitle: '東京商辦租金年漲 19%～20% 贏過科技業，中國新開工連四年縮水等時間發酵',
    imageSrc: './src/assets/images/slide_cold_stove_horizon_1794940882085.jpg',
    imageAlt: '遠方舞台喧鬧擁擠，前景兩人一狗守在溫暖鑄鐵冷灶旁看著貨輪模型與漢堡',
    figureCaption: 'Fig. 5 — 沒人敢擴廠的冷灶裡，老天正用「被動去庫存」幫房東與實業存大缺口。',
  },
  {
    id: 6,
    shortNavLabel: '測驗',
    chapterCode: '終章 · 算帳本色測驗',
    title: '咖啡端穩了嗎？測測你在派對散場後是哪一派',
    subtitle: '三個幽默情境題，揭曉你的投資性格（右上角可下載 3 頁全彩 PDF 講義）',
    imageSrc: './src/assets/images/slide_quiz_finale_1794954699172.jpg',
    imageAlt: '黃昏木露台咖啡座上，三位主角端穩茶杯與咖啡、拿著性格測驗卡齊聚核對算帳結果',
    figureCaption: 'Fig. 6 — 投資這場長跑，比的從來不是誰夢得最美，而是誰最後沒留在廚房洗碗。',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: '1. AI 資本支出大砍 1.6 兆、電網少 42 座核電廠，你的第一反應？',
    options: [
      {
        id: 'q1_a',
        label: '先拿計算機對電費單，物理天花板不陪市場演戲',
        persona: 'analyst',
        reaction: '標準算帳主廚！122.8 砍剩 80.7 GW 就是最誠實的答案。',
      },
      {
        id: 'q1_b',
        label: '看看客人點龍蝦還是滷肉飯，賺不回本就先微笑退場',
        persona: 'muse',
        reaction: '一針見血！裝潢再氣派，滷肉飯營收追不上燒錢速度。',
      },
      {
        id: 'q1_c',
        label: '抱著小被被退到門口，改看沒人蓋的新屋與收租冷灶',
        persona: 'frenchie',
        reaction: '小白點頭：派對越擠越危險，早點去冷灶佔好位！',
      },
    ],
  },
  {
    id: 'q2',
    prompt: '2. 買了 5 檔 ETF 摘下面具全姓台積電，投信還狂砍 179.63 億…',
    options: [
      {
        id: 'q2_a',
        label: '早就識破這只是 5 張鐵索連環船票，船邊先掛好救生艇',
        persona: 'muse',
        reaction: 'X 光眼無誤！曹操走華容道不倒，沒掛救生艇的士兵才危險。',
      },
      {
        id: 'q2_b',
        label: '瞄一眼 Put/Call 僅 54.08%（遠低於 85% 綠燈），糖果舔一口就寫功課',
        persona: 'analyst',
        reaction: '紀律滿分！大戶還在極度保守區，反彈糖果別吃太急。',
      },
      {
        id: 'q2_c',
        label: '投信都先搭計程車走了，我領完反彈糖就回黃籃子睡覺',
        persona: 'frenchie',
        reaction: '保命哲學滿分！絕不當最後一個留在船艙洗碗的人。',
      },
    ],
  },
  {
    id: 'q3',
    prompt: '3. 東京商辦租金年漲兩成反超科技股，未來十年心力放哪？',
    options: [
      {
        id: 'q3_a',
        label: '鎖定多年沒人擴廠的不動產與冷灶，等時間憋出大缺口',
        persona: 'frenchie',
        reaction: '冷灶重返榮耀派！供給縮水多年後，房東定價權自然回來。',
      },
      {
        id: 'q3_b',
        label: '緊盯吃漢堡、穿衣、住房子的剛性消費地板，時間會當裁判',
        persona: 'analyst',
        reaction: '算帳派金句：剛性需求地板不可能變零。',
      },
      {
        id: 'q3_c',
        label: '遠離最後一塊蛋糕的擁擠舞台，看懂門道再優雅出手',
        persona: 'muse',
        reaction: '淡定優雅！投資比的是活得久，不是每場熱鬧都要湊。',
      },
    ],
  },
];

export const DISCLAIMER_TEXT =
  '本文內容僅為全球總體經濟數據、產業歷史週期與金融市場籌碼結構之客觀整理與思維分享，絕非任何投資建議、個別標的推薦或買賣操作依據。金融市場波動劇烈，任何投資決策前請務必獨立思考，並審慎評估自身風險承受能力，盈虧自負。';
