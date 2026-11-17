import type { CharacterId } from '../data/presentationContent';

export type SliderZone = 'normal' | 'warning' | 'danger' | 'cold';

export interface ZoneVisualStyle {
  zone: SliderZone;
  hex: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  statusTag: string;
}

export interface CapexStressResult {
  remainingGridGw: number;
  cutGridGw: number;
  gridCutPct: number;
  nuclearPlantsCut: number;
  hbmDemandDropPct: number;
  capexCutTrillions: number;
  capexZone: SliderZone;
  gridZone: SliderZone;
  verdictTitle: string;
  verdictDetail: string;
}

export interface ThermometerStatus {
  monthlyDropPct: number;
  feverStage: 'normal' | 'fever' | 'overspeed';
  dropZone: SliderZone;
  feverLabel: string;
  feverAdvice: string;
  putCallRatio: number;
  putCallStage: 'cautious' | 'neutral' | 'bullish_stable';
  putCallZone: SliderZone;
  putCallLabel: string;
  overallDiagnosis: string;
}

export interface ColdStoveSimulation {
  caseId: 'shipping' | 'tokyo' | 'china';
  title: string;
  yearsElapsed: number;
  cycleZone: SliderZone;
  activeSupplyIndex: number;
  rigidDemandIndex: number;
  supplyGapPct: number;
  stageLabel: string;
  headlineMetric: string;
  narrativeNote: string;
}

export interface QuizOutcome {
  winner: CharacterId;
  counts: Record<CharacterId, number>;
  title: string;
  summary: string;
}

export function getZoneVisualStyle(zone: SliderZone): ZoneVisualStyle {
  switch (zone) {
    case 'normal':
      return {
        zone,
        hex: '#15803D',
        textClass: 'text-[#15803D]',
        bgClass: 'bg-[#ECFDF3]',
        borderClass: 'border-[#86EFAC]',
        statusTag: '正常健康',
      };
    case 'warning':
      return {
        zone,
        hex: '#B45309',
        textClass: 'text-[#B45309]',
        bgClass: 'bg-[#FFFBEB]',
        borderClass: 'border-[#FCD34D]',
        statusTag: '警戒震盪',
      };
    case 'danger':
      return {
        zone,
        hex: '#991B1B',
        textClass: 'text-[#991B1B]',
        bgClass: 'bg-[#FEF2F2]',
        borderClass: 'border-[#FCA5A5]',
        statusTag: '異常警戒',
      };
    case 'cold':
    default:
      return {
        zone: 'cold',
        hex: '#1E4D5C',
        textClass: 'text-[#1E4D5C]',
        bgClass: 'bg-[#F0F7F9]',
        borderClass: 'border-[#A5CBD6]',
        statusTag: '冷灶潛伏',
      };
  }
}

export function getAmbientBackdropStyle(zone: SliderZone | 'neutral'): string {
  switch (zone) {
    case 'danger':
      return 'bg-[#FDF1F0]';
    case 'warning':
      return 'bg-[#FFF9EB]';
    case 'normal':
      return 'bg-[#EEF9F1]';
    case 'cold':
      return 'bg-[#EDF5F8]';
    case 'neutral':
    default:
      return 'bg-[#FBF9F5]';
  }
}

export interface SlideThemePalette {
  themeLabel: string;
  backdropGradient: string;
  accentGradient: string;
  frameGradient: string;
}

export function getSlideThemePalette(
  slideIndex: number,
  zone: SliderZone | 'neutral'
): SlideThemePalette {
  switch (slideIndex) {
    case 0:
      return {
        themeLabel: '晨光咖啡暖金漸層',
        backdropGradient: 'linear-gradient(135deg, #FBF9F5 0%, #F5EBDD 52%, #EDE0CE 100%)',
        accentGradient: 'linear-gradient(90deg, #292524 0%, #B4432C 55%, #D97706 100%)',
        frameGradient: 'linear-gradient(135deg, #E7DAC6 0%, #F5EDE0 100%)',
      };
    case 1:
      if (zone === 'normal') {
        return {
          themeLabel: '滿電綠燈翡翠漸層',
          backdropGradient: 'linear-gradient(135deg, #F4FBF6 0%, #E0F4E6 55%, #CDEBD8 100%)',
          accentGradient: 'linear-gradient(90deg, #15803D 0%, #0D9488 100%)',
          frameGradient: 'linear-gradient(135deg, #BBE4C9 0%, #E8F7ED 100%)',
        };
      }
      if (zone === 'warning') {
        return {
          themeLabel: '電費警戒琥珀漸層',
          backdropGradient: 'linear-gradient(135deg, #FFFDF4 0%, #FEF2CF 55%, #FCE2AD 100%)',
          accentGradient: 'linear-gradient(90deg, #B45309 0%, #D97706 100%)',
          frameGradient: 'linear-gradient(135deg, #F8DDA4 0%, #FFF7E0 100%)',
        };
      }
      return {
        themeLabel: '電網過載赤焰漸層',
        backdropGradient: 'linear-gradient(135deg, #FFFBF6 0%, #FCECE2 50%, #F8D5C6 100%)',
        accentGradient: 'linear-gradient(90deg, #991B1B 0%, #D97706 60%, #F59E0B 100%)',
        frameGradient: 'linear-gradient(135deg, #F2C3B2 0%, #FCEEE7 100%)',
      };
    case 2:
      return {
        themeLabel: '赤壁連環船火紅漸層',
        backdropGradient: 'linear-gradient(135deg, #FDF7F5 0%, #FCE6E0 52%, #F6CFC5 100%)',
        accentGradient: 'linear-gradient(90deg, #7F1D1D 0%, #B4432C 55%, #EA580C 100%)',
        frameGradient: 'linear-gradient(135deg, #EEBEB2 0%, #FCECE8 100%)',
      };
    case 3:
      if (zone === 'normal') {
        return {
          themeLabel: '體溫正常薄荷綠漸層',
          backdropGradient: 'linear-gradient(135deg, #F2FBF5 0%, #DCF3E4 55%, #C6EAD4 100%)',
          accentGradient: 'linear-gradient(90deg, #15803D 0%, #059669 100%)',
          frameGradient: 'linear-gradient(135deg, #B5E4C5 0%, #E7F7EC 100%)',
        };
      }
      if (zone === 'warning') {
        return {
          themeLabel: '發燒觀望暖橘漸層',
          backdropGradient: 'linear-gradient(135deg, #FFFDF3 0%, #FEF0C7 55%, #FDE09C 100%)',
          accentGradient: 'linear-gradient(90deg, #B45309 0%, #EA580C 100%)',
          frameGradient: 'linear-gradient(135deg, #F8D894 0%, #FFF6DF 100%)',
        };
      }
      return {
        themeLabel: '高燒急殺警戒紅漸層',
        backdropGradient: 'linear-gradient(135deg, #FDF5F5 0%, #FAD9D9 52%, #F4C0C0 100%)',
        accentGradient: 'linear-gradient(90deg, #7F1D1D 0%, #DC2626 100%)',
        frameGradient: 'linear-gradient(135deg, #EEB6B6 0%, #FDEBEB 100%)',
      };
    case 4:
      if (zone === 'normal') {
        return {
          themeLabel: '維持率安全青碧漸層',
          backdropGradient: 'linear-gradient(135deg, #F2FAF6 0%, #DBF0E6 55%, #C8E5D8 100%)',
          accentGradient: 'linear-gradient(90deg, #15803D 0%, #1E4D5C 100%)',
          frameGradient: 'linear-gradient(135deg, #B9DEC8 0%, #E8F6EE 100%)',
        };
      }
      if (zone === 'warning') {
        return {
          themeLabel: '初次追繳金沙警戒漸層',
          backdropGradient: 'linear-gradient(135deg, #FFFBF2 0%, #F7E8C8 55%, #EDD6AC 100%)',
          accentGradient: 'linear-gradient(90deg, #B45309 0%, #64748B 100%)',
          frameGradient: 'linear-gradient(135deg, #E8CFA0 0%, #FBF3E2 100%)',
        };
      }
      return {
        themeLabel: '金庫斷鏈寒灰酒紅漸層',
        backdropGradient: 'linear-gradient(135deg, #FCF6F7 0%, #F2DFE4 52%, #E5CFD7 100%)',
        accentGradient: 'linear-gradient(90deg, #4C1D24 0%, #991B1B 55%, #64748B 100%)',
        frameGradient: 'linear-gradient(135deg, #D9C1CA 0%, #F7ECEF 100%)',
      };
    case 5:
      if (zone === 'cold') {
        return {
          themeLabel: '冷灶青霜潛伏漸層',
          backdropGradient: 'linear-gradient(135deg, #F2F8FA 0%, #DCEBF0 55%, #C7DDE7 100%)',
          accentGradient: 'linear-gradient(90deg, #1E4D5C 0%, #3B82A6 100%)',
          frameGradient: 'linear-gradient(135deg, #BAD4DF 0%, #ECF5F8 100%)',
        };
      }
      if (zone === 'warning') {
        return {
          themeLabel: '去庫存暖爐醞釀漸層',
          backdropGradient: 'linear-gradient(135deg, #FAF8F2 0%, #EFE7D4 52%, #E3D8BC 100%)',
          accentGradient: 'linear-gradient(90deg, #B45309 0%, #1E4D5C 100%)',
          frameGradient: 'linear-gradient(135deg, #DDD0B1 0%, #F7F3E8 100%)',
        };
      }
      return {
        themeLabel: '不動產金穗重返榮耀漸層',
        backdropGradient: 'linear-gradient(135deg, #F3FAF5 0%, #DFF2E4 50%, #EFE7CD 100%)',
        accentGradient: 'linear-gradient(90deg, #1E4D5C 0%, #15803D 55%, #B45309 100%)',
        frameGradient: 'linear-gradient(135deg, #C7DFC6 0%, #F4F1E2 100%)',
      };
    case 6:
    default:
      return {
        themeLabel: '終章晨曦茶席漸層',
        backdropGradient: 'linear-gradient(135deg, #FBF9F5 0%, #EFE8D8 50%, #E1ECE6 100%)',
        accentGradient: 'linear-gradient(90deg, #1E4D5C 0%, #B4432C 55%, #D97706 100%)',
        frameGradient: 'linear-gradient(135deg, #D5DFDA 0%, #F5EFE2 100%)',
      };
  }
}

export function clampSlideIndex(index: number, totalSlides: number): number {
  if (totalSlides <= 0) return 0;
  return Math.max(0, Math.min(index, totalSlides - 1));
}

export function computeCapexStress(
  capexCutTrillions: number,
  gridTargetGw: number
): CapexStressResult {
  const baselineGw = 122.8;
  const clampedGrid = Math.max(60, Math.min(122.8, Number(gridTargetGw.toFixed(1))));
  const clampedCut = Math.max(0, Math.min(1.6, Number(capexCutTrillions.toFixed(2))));

  const cutGridGw = Number((baselineGw - clampedGrid).toFixed(1));
  const gridCutPct = Number((((baselineGw - clampedGrid) / baselineGw) * 100).toFixed(1));
  const nuclearPlantsCut = Number(cutGridGw.toFixed(1));
  const hbmDemandDropPct = Number(((clampedCut / 1.6) * 30).toFixed(1));

  const capexZone: SliderZone =
    clampedCut >= 1.1 ? 'danger' : clampedCut >= 0.4 ? 'warning' : 'normal';
  const gridZone: SliderZone =
    clampedGrid < 92 ? 'danger' : clampedGrid < 110 ? 'warning' : 'normal';

  let verdictTitle = '美夢全開：銀行排隊送錢';
  let verdictDetail = '假設電網無限供電、人人都點頂級龍蝦套餐，帳本還沒拿出來算。';

  if (capexZone === 'danger' || gridZone === 'danger') {
    verdictTitle = '夢醒算帳：電費單與數學題一起敲門';
    verdictDetail = `四年大砍 ${clampedCut.toFixed(1)} 兆美元、少掉 ${cutGridGw} 座核電廠供電（-${gridCutPct}%），2028 年 HBM 需求同步砍 ${hbmDemandDropPct}%——夢想終究要向物理低頭。`;
  } else if (capexZone === 'warning' || gridZone === 'warning') {
    verdictTitle = '債主清醒：沒有巨頭背書免談';
    verdictDetail = '米其林餐廳裝潢好了，卻發現進來的客人有一半只想點滷肉飯。';
  }

  return {
    remainingGridGw: clampedGrid,
    cutGridGw,
    gridCutPct,
    nuclearPlantsCut,
    hbmDemandDropPct,
    capexCutTrillions: clampedCut,
    capexZone,
    gridZone,
    verdictTitle,
    verdictDetail,
  };
}

export function magnitudeToMonthlyDrop(dropMagnitudePct: number): number {
  const clamped = Math.max(0, Math.min(15, Number(dropMagnitudePct.toFixed(2))));
  return clamped === 0 ? 0 : -clamped;
}

export function computeThermometerStatus(
  monthlyDropPct: number,
  putCallRatio: number
): ThermometerStatus {
  const drop = Number(monthlyDropPct.toFixed(2));
  const pcr = Number(putCallRatio.toFixed(2));

  let feverStage: ThermometerStatus['feverStage'] = 'normal';
  let dropZone: SliderZone = 'normal';
  let feverLabel = '正常波動';
  let feverAdvice = '單月漲跌還在日常呼吸範圍內，咖啡端得穩穩的。';

  if (drop <= -10) {
    feverStage = 'overspeed';
    dropZone = 'danger';
    feverLabel = '異常急殺 · 收到超速罰單';
    feverAdvice =
      '單月跌破 -10% 至 -12% 紅線，靠近「年線」容易踩到彈簧出現技術性反彈，市場會塞一顆糖給你，但功課別忘寫。';
  } else if (drop <= -8) {
    feverStage = 'fever';
    dropZone = 'warning';
    feverLabel = '體溫發燒警戒（> 8%）';
    feverAdvice = '已進入月線發燒區，短線震盪加劇，先管好雙手別亂接刀。';
  }

  let putCallStage: ThermometerStatus['putCallStage'] = 'cautious';
  let putCallZone: SliderZone = 'danger';
  let putCallLabel = '異常偏低 · 大戶超級保守（< 70%）';

  if (pcr >= 85) {
    putCallStage = 'bullish_stable';
    putCallZone = 'normal';
    putCallLabel = '正常健康 · 結構回穩偏多（85%+）';
  } else if (pcr >= 70) {
    putCallStage = 'neutral';
    putCallZone = 'warning';
    putCallLabel = '警戒過渡 · 籌碼修復中（70%–84%）';
  }

  const overallDiagnosis =
    feverStage === 'overspeed' && putCallStage === 'cautious'
      ? '長空底下的短線急殺：反彈糖果隨時會掉下來，但長線大戶根本還沒翻多。'
      : feverStage === 'normal' && putCallStage === 'bullish_stable'
        ? '體溫正常、膽小鬼退散：結構相對安穩，可以好好喝杯咖啡挑好菜。'
        : '乖離與籌碼還在拔河：千萬別因為吃了反彈糖，就誤以為派對又重開了。';

  return {
    monthlyDropPct: drop,
    feverStage,
    dropZone,
    feverLabel,
    feverAdvice,
    putCallRatio: pcr,
    putCallStage,
    putCallZone,
    putCallLabel,
    overallDiagnosis,
  };
}

export interface DefenseLineVerdict {
  zone: SliderZone;
  headline: string;
  sp500Note: string;
  financeNote: string;
  summary: string;
}

export function computeDefenseLineVerdict(
  sp500Broken: boolean,
  financeBroken: boolean
): DefenseLineVerdict {
  const sp500Note = sp500Broken
    ? '美國 S&P 500 正式跌破上升趨勢線：右肩成形向下突破，全球與台股全面長空正式確立。'
    : '美國 S&P 500 正在測試「頭肩頂右肩」：台股過去急殺都能創高，說穿了全靠美國老大哥還沒破線撐腰！';

  const financeNote = financeBroken
    ? '台股金融類指數跌破前低：平常最穩重的守門員退場，最後一棒正式熄火、盤面全面轉空！'
    : '台股金融類指數是最後防線：科技股亂成一團時，全靠穩重的金融大哥扛著最後一棒撐住城門。';

  if (sp500Broken && financeBroken) {
    return {
      zone: 'danger',
      headline: '雙防線失守：長空確立、最後一棒也熄火',
      sp500Note,
      financeNote,
      summary:
        '美國老大哥跌破趨勢線、連台股最後撐盤的金融股都破前低熄火——這時別再跟市場硬碰硬，抱緊現金顧好本金最重要。',
    };
  }

  if (sp500Broken || financeBroken) {
    return {
      zone: 'danger',
      headline: sp500Broken
        ? '警報拉響：S&P 500 破線，全面長空確立'
        : '警報拉響：金融最後一棒破底熄火，全面轉空',
      sp500Note,
      financeNote,
      summary: sp500Broken
        ? '連最大靠山 S&P 500 都從右肩跌破上升趨勢線，台股就不再有「急殺創高」的免死金牌了。'
        : '平常不搶戲的金融類指數一旦跌破前低，代表多頭最後一棒熄火，別指望奇蹟自己走進門。',
    };
  }

  return {
    zone: 'warning',
    headline: '兩道防線緊繃警戒中：右肩別踩空、金融別破低',
    sp500Note,
    financeNote,
    summary:
      '美股 S&P 500 還沒正式破線、金融股還在門口撐著最後一棒，但緊盯這兩個位置——哪一邊踩空，長空劇本就會立刻接管舞台。',
  };
}

export type MarginCallStage = 'safe_166' | 'first_call_130' | 'second_call_forced';

export interface MarginRuleEvaluation {
  stage: MarginCallStage;
  zone: SliderZone;
  maintenanceRatioLabel: string;
  ruleBadge: string;
  headline: string;
  detail: string;
}

export function evaluateMarginCallStage(stage: MarginCallStage): MarginRuleEvaluation {
  switch (stage) {
    case 'safe_166':
      return {
        stage,
        zone: 'normal',
        maintenanceRatioLabel: '166.7%（台股六成融資起點）',
        ruleBadge: '安全水位 · 未觸及 130% 追繳線',
        headline: '整戶維持率充足，尚無斷頭危機',
        detail:
          '以台股常見自備四成、融資六成計算，初始整戶維持率約 166.7%（1 ÷ 0.6）。只要守在 130% 法定門檻之上，就不會收到券商追繳令。',
      };
    case 'first_call_130':
      return {
        stage,
        zone: 'warning',
        maintenanceRatioLabel: '< 130%（首次跌破法定追繳線）',
        ruleBadge: '首波追繳 · 還有兩天（T+2）補錢寬限',
        headline: '萬箭齊發：第一次收到追繳令還有兩天喘息',
        detail:
          '依台股制度，整戶維持率首度跌破 130% 會發出追繳通知，投資人還有兩個營業日（T+2）補繳現金或靠反彈拉回維持率。',
      };
    case 'second_call_forced':
    default:
      return {
        stage: 'second_call_forced',
        zone: 'danger',
        maintenanceRatioLabel: '再度破底 < 130%（二次追繳觸發）',
        ruleBadge: '零寬限期 · 隔日早盤開盤直接斷頭',
        headline: '國巨、華新科等破底觸發「二次追繳」：開門直接砍',
        detail:
          '因為前面已經發過一次追繳令，反彈後再度破底導致維持率不足時，不再有兩天寬限期！隔天一早開盤券商直接斷頭市價砍出；保命鐵則：遇追繳令務必直接減碼，切勿硬補錢。',
      };
  }
}

export function computeCreditCrunchZone(
  subTab: 'margin' | 'cb' | 'bank',
  marginStage: MarginCallStage,
  cbCompareMode: 'crunch' | 'past'
): SliderZone {
  if (subTab === 'margin') {
    return evaluateMarginCallStage(marginStage).zone;
  }
  if (subTab === 'cb') {
    return cbCompareMode === 'past' ? 'normal' : 'danger';
  }
  return 'danger';
}

export function computeColdStoveSimulation(
  yearsElapsed: number,
  caseId: 'shipping' | 'tokyo' | 'china'
): ColdStoveSimulation {
  const years = Math.max(1, Math.min(10, Math.round(yearsElapsed)));
  const activeSupplyIndex = Number(Math.max(48, 100 - years * 4.8).toFixed(1));
  const rigidDemandIndex = Number((94 + years * 1.4).toFixed(1));
  const supplyGapPct = Number(
    Math.max(0, ((rigidDemandIndex - activeSupplyIndex) / rigidDemandIndex) * 100).toFixed(1)
  );

  const cycleZone: SliderZone =
    years >= 7 ? 'normal' : years >= 4 ? 'warning' : 'cold';

  let stageLabel = '第 1–3 年冷灶期：沒人想逛、建商不敢動工';
  if (years >= 7) {
    stageLabel = '第 7–10 年重返榮耀：供給缺口大爆發';
  } else if (years >= 4) {
    stageLabel = '第 4–6 年被動去庫存：舊產能老了、新供給跟不上';
  }

  if (caseId === 'shipping') {
    return {
      caseId,
      title: '2015–2018 全球航運業冷灶',
      yearsElapsed: years,
      cycleZone,
      activeSupplyIndex,
      rigidDemandIndex,
      supplyGapPct,
      stageLabel,
      headlineMetric: '舊船報廢 ➔ 全球搶船位',
      narrativeNote:
        '慘到三五年沒人敢造船，老船一艘艘報廢，全球貨物要運送的剛需卻不曾歸零，幾年過後運力缺口一現身，全市場搶著排隊訂船位。',
    };
  }

  if (caseId === 'tokyo') {
    return {
      caseId,
      title: '日本東京商辦重返榮耀',
      yearsElapsed: years,
      cycleZone,
      activeSupplyIndex,
      rigidDemandIndex,
      supplyGapPct,
      stageLabel,
      headlineMetric: '新建商辦年漲 20%・B 級辦年漲 19%',
      narrativeNote:
        '多年沒人敢大手筆蓋新商辦，如今東京核心五區空室率跌破 2%，新建商辦租金年漲約 20%（創 32 年新高）、B 級辦也年漲 19%——房東收租竟然贏過一票科技股！',
    };
  }

  return {
    caseId,
    title: '中國開工腰斬與剛性消費地板',
    yearsElapsed: years,
    cycleZone,
    activeSupplyIndex,
    rigidDemandIndex,
    supplyGapPct,
    stageLabel,
    headlineMetric: '新開工 8.81 ➔ 4.30 億㎡・消費率約 40%',
    narrativeNote:
      '固定資產投資年減 8.1%、房地產投資年減 21.6%；住宅新開工從 8.81 億平米連四年縮到 4.30 億平米，遠低於每年約 8–10 億平米剛需；居民消費佔 GDP 也停在 39%–40% 的低檔地板——人總要吃漢堡、穿衣服、睡覺，地板不可能變零。',
  };
}

export function scoreSurvivalQuiz(
  selections: Record<string, CharacterId>
): QuizOutcome {
  const counts: Record<CharacterId, number> = {
    analyst: 0,
    muse: 0,
    frenchie: 0,
  };

  Object.values(selections).forEach((persona) => {
    if (persona in counts) {
      counts[persona] += 1;
    }
  });

  let winner: CharacterId = 'analyst';
  if (counts.muse > counts[winner]) winner = 'muse';
  if (counts.frenchie > counts[winner]) winner = 'frenchie';

  if (winner === 'analyst') {
    return {
      winner,
      counts,
      title: '你是「咖啡端穩的算帳主廚」',
      summary:
        '熱鬧時不跟著衝動，急殺時先拿計算機量體溫。你知道 Put/Call 沒站回 85% 綠燈前，反彈糖果舔一口就好，絕不把功課丟一邊。',
    };
  }
  if (winner === 'muse') {
    return {
      winner,
      counts,
      title: '你是「一眼看穿台積電便當的旗袍偵探」',
      summary:
        '管它包了十種文青木盒還是取了夢幻基金名，你一掀蓋子就知道裡面裝的都是同一塊台積電排骨。絕不留在散場餐廳替大資金洗碗！',
    };
  }
  return {
    winner,
    counts,
    title: '你是「靜待重返榮耀的法鬥冷灶守護神」',
    summary:
      '不跟別人在擁擠舞台搶最後一塊蛋糕，反而懂得抱著黃籃子守在沒人理的不動產與冷灶旁。因為你相信時間永遠是最有耐心的裁判。',
  };
}
