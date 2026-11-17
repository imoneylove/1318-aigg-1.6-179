import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampSlideIndex,
  computeCapexStress,
  computeColdStoveSimulation,
  computeCreditCrunchZone,
  computeDefenseLineVerdict,
  computeThermometerStatus,
  evaluateMarginCallStage,
  getAmbientBackdropStyle,
  getSlideThemePalette,
  getZoneVisualStyle,
  magnitudeToMonthlyDrop,
  scoreSurvivalQuiz,
} from './presentationLogic';

test('clampSlideIndex keeps index within valid range for 7 slides', () => {
  assert.equal(clampSlideIndex(-2, 7), 0);
  assert.equal(clampSlideIndex(4, 7), 4);
  assert.equal(clampSlideIndex(9, 7), 6);
  assert.equal(clampSlideIndex(0, 0), 0);
});

test('computeCapexStress assigns danger zone at 1.6T cut and 80.7 GW', () => {
  const res = computeCapexStress(1.6, 80.7);
  assert.equal(res.remainingGridGw, 80.7);
  assert.equal(res.cutGridGw, 42.1);
  assert.equal(res.gridCutPct, 34.3);
  assert.equal(res.hbmDemandDropPct, 30);
  assert.equal(res.capexZone, 'danger');
  assert.equal(res.gridZone, 'danger');

  const safe = computeCapexStress(0.1, 120);
  assert.equal(safe.capexZone, 'normal');
  assert.equal(safe.gridZone, 'normal');
});

test('computeThermometerStatus assigns red danger below 70% Put/Call and green above 85%', () => {
  assert.equal(magnitudeToMonthlyDrop(0), 0);
  assert.equal(magnitudeToMonthlyDrop(11.32), -11.32);
  assert.equal(magnitudeToMonthlyDrop(20), -15);

  const panic = computeThermometerStatus(magnitudeToMonthlyDrop(11.32), 54.08);
  assert.equal(panic.dropZone, 'danger');
  assert.equal(panic.putCallZone, 'danger');
  assert.equal(getZoneVisualStyle(panic.putCallZone).hex, '#991B1B');
  assert.equal(getAmbientBackdropStyle(panic.putCallZone), 'bg-[#FDF1F0]');

  const neutral = computeThermometerStatus(magnitudeToMonthlyDrop(8.5), 76);
  assert.equal(neutral.dropZone, 'warning');
  assert.equal(neutral.putCallZone, 'warning');

  const healthy = computeThermometerStatus(magnitudeToMonthlyDrop(3.5), 92);
  assert.equal(healthy.dropZone, 'normal');
  assert.equal(healthy.putCallZone, 'normal');
  assert.equal(getZoneVisualStyle(healthy.putCallZone).hex, '#15803D');
  assert.equal(getAmbientBackdropStyle(healthy.putCallZone), 'bg-[#EEF9F1]');
});

test('computeDefenseLineVerdict evaluates S&P 500 and financial index breakouts accurately', () => {
  const holding = computeDefenseLineVerdict(false, false);
  assert.equal(holding.zone, 'warning');
  assert.ok(holding.sp500Note.includes('頭肩頂右肩'));

  const spBroken = computeDefenseLineVerdict(true, false);
  assert.equal(spBroken.zone, 'danger');
  assert.ok(spBroken.headline.includes('長空確立'));

  const bothBroken = computeDefenseLineVerdict(true, true);
  assert.equal(bothBroken.zone, 'danger');
  assert.ok(bothBroken.financeNote.includes('熄火'));
});

test('evaluateMarginCallStage and computeCreditCrunchZone reflect real 130% statutory rules', () => {
  const safe = evaluateMarginCallStage('safe_166');
  assert.equal(safe.zone, 'normal');
  assert.ok(safe.maintenanceRatioLabel.includes('166.7%'));

  const firstCall = evaluateMarginCallStage('first_call_130');
  assert.equal(firstCall.zone, 'warning');
  assert.ok(firstCall.ruleBadge.includes('T+2'));

  const secondCall = evaluateMarginCallStage('second_call_forced');
  assert.equal(secondCall.zone, 'danger');
  assert.ok(secondCall.detail.includes('切勿硬補錢'));

  assert.equal(computeCreditCrunchZone('margin', 'safe_166', 'crunch'), 'normal');
  assert.equal(computeCreditCrunchZone('margin', 'second_call_forced', 'crunch'), 'danger');
  assert.equal(computeCreditCrunchZone('cb', 'second_call_forced', 'past'), 'normal');
  assert.equal(computeCreditCrunchZone('cb', 'second_call_forced', 'crunch'), 'danger');
  assert.equal(computeCreditCrunchZone('bank', 'safe_166', 'past'), 'danger');
});

test('computeColdStoveSimulation transitions from cold to normal boom over 10 years', () => {
  const yr2 = computeColdStoveSimulation(2, 'china');
  const yr9 = computeColdStoveSimulation(9, 'china');
  assert.equal(yr2.cycleZone, 'cold');
  assert.equal(yr9.cycleZone, 'normal');
  assert.ok(yr9.supplyGapPct > yr2.supplyGapPct);
});

test('scoreSurvivalQuiz aggregates character persona counts accurately', () => {
  const outcome = scoreSurvivalQuiz({
    q1: 'muse',
    q2: 'muse',
    q3: 'analyst',
  });
  assert.equal(outcome.winner, 'muse');
  assert.equal(outcome.counts.muse, 2);
  assert.equal(outcome.counts.analyst, 1);
  assert.equal(outcome.counts.frenchie, 0);
});

test('getSlideThemePalette returns distinct per-slide theme gradients and reacts to zone', () => {
  const s0 = getSlideThemePalette(0, 'normal');
  const s2 = getSlideThemePalette(2, 'neutral');
  const s4Danger = getSlideThemePalette(4, 'danger');
  const s4Normal = getSlideThemePalette(4, 'normal');
  const s5Cold = getSlideThemePalette(5, 'cold');
  const s5Normal = getSlideThemePalette(5, 'normal');

  assert.ok(s0.backdropGradient.includes('linear-gradient'));
  assert.notEqual(s0.backdropGradient, s2.backdropGradient);
  assert.notEqual(s2.backdropGradient, s4Danger.backdropGradient);
  assert.notEqual(s4Danger.backdropGradient, s4Normal.backdropGradient);
  assert.notEqual(s5Cold.backdropGradient, s5Normal.backdropGradient);
});
