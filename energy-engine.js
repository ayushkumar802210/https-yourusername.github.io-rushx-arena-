/* Deterministic energy calculations. Inputs are estimates unless backed by meter data. */
(function () {
  function applianceKwh(appliance) {
    return (Number(appliance.wattage) / 1000) * Number(appliance.quantity || 1) * Number(appliance.hoursPerDay ?? appliance.hours_per_day ?? 0) * Number(appliance.daysPerMonth ?? appliance.days_per_month ?? 30);
  }

  function billEstimate(kwh, rate) {
    return Math.max(0, Number(kwh) || 0) * Math.max(0, Number(rate) || 0);
  }

  function scenario(base, changes, rate) {
    var baseline = Number(base) || 0;
    var changed = Math.max(0, baseline + (Number(changes) || 0));
    return { baselineKwh: baseline, scenarioKwh: changed, differenceKwh: changed - baseline, differenceCost: billEstimate(changed - baseline, rate) };
  }

  function evCharging(input) {
    var distance = Math.max(0, Number(input.distanceKmPerDay) || 0);
    var efficiency = Math.max(0.01, Number(input.efficiencyWhPerKm) || 150);
    var days = Math.max(1, Number(input.daysPerMonth) || 30);
    var loss = Math.max(0, Number(input.lossPercent) || 10) / 100;
    var monthlyKwh = distance * efficiency / 1000 * days / (1 - Math.min(loss, 0.5));
    return { monthlyKwh: monthlyKwh, monthlyCost: billEstimate(monthlyKwh, input.rate) };
  }

  function solarScenario(input) {
    var load = Math.max(0, Number(input.loadKwh) || 0);
    var generation = Math.max(0, Number(input.capacityKw) || 0) * Math.max(0, Number(input.generationPerKw) || 0);
    var selfConsumption = Math.min(load, generation * Math.max(0, Math.min(1, Number(input.selfConsumptionRate) || 0.8)));
    return { generationKwh: generation, selfConsumptionKwh: selfConsumption, gridImportKwh: Math.max(0, load - selfConsumption), offsetKwh: selfConsumption };
  }

  function investigate(current, previous, evidence) {
    var currentKwh = Math.max(0, Number(current) || 0);
    var previousKwh = Math.max(0, Number(previous) || 0);
    var changePercent = previousKwh ? ((currentKwh - previousKwh) / previousKwh) * 100 : 0;
    var signals = [
      { name: "Cooling load", score: Number(evidence.coolingHours || 0) * 2, detail: "Reported AC usage change is the strongest available signal." },
      { name: "Water pump", score: Number(evidence.pumpHours || 0), detail: "Pump hours may explain part of the change." },
      { name: "Other appliances", score: Number(evidence.otherChanges || 0), detail: "Other appliance changes remain possible." }
    ].sort(function (a, b) { return b.score - a.score; });
    var total = signals.reduce(function (sum, signal) { return sum + signal.score; }, 0);
    var confidence = total >= 8 && Math.abs(changePercent) >= 10 ? "High" : total >= 3 ? "Medium" : "Low";
    return { changePercent: changePercent, leadingCause: signals[0].name, confidence: confidence, signals: signals, missing: total < 3 ? "Add appliance hours or tariff details to improve confidence." : "Confirm the usage change against your meter or bill." };
  }

  window.RushXArenaEngine = { applianceKwh: applianceKwh, billEstimate: billEstimate, scenario: scenario, evCharging: evCharging, solarScenario: solarScenario, investigate: investigate };
}());
