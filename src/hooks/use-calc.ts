import { useMemo } from 'react';
import { usePlanStore } from '@/stores/plan-store';
import { fmtK } from '@/lib/format';

export function useCalc() {
  const state = usePlanStore();

  return useMemo(() => {
    // Equipment
    const eqTotal = state.eqEspresso + state.eqGrinders + state.eqWater + state.eqFridge + state.eqIce + state.eqBlenders + state.eqPourover + state.eqColdbrew;
    const spTotal = state.spRenovation + state.spFurniture + state.spLighting + state.spSignage + state.spPOS + state.spAC + state.spSound;
    const laTotal = state.laBrand + state.laInventory + state.laMarketing + state.laPhoto;
    const lgTotal = state.lgLicense + state.lgLawyer;
    const deposit = state.monthlyRent * state.depositMonths + state.keyMoney;
    const totalStartup = eqTotal + spTotal + laTotal + lgTotal + deposit;

    // Supplies
    const supCoffee = (state.supEspressoKg * state.supEspressoPrice) + (state.supOriginKg * state.supOriginPrice) + (state.supDecafKg * state.supDecafPrice);
    const supMilk = ((state.supFullMilkL * state.supFullMilkPrice) + (state.supOatMilkL * state.supOatMilkPrice) + (state.supAlmondMilkL * state.supAlmondMilkPrice)) * 30;
    const supSyrups = state.supVanilla + state.supCaramel + state.supHazelnut + state.supChocolate + state.supHoney;
    const supDisp = state.supHotCups + state.supColdCups + state.supNapkins + state.supBags + state.supStraws + state.supStirrers;
    const supFood = state.supBakeryQty * state.supBakeryCost * 30;
    const totalSupplies = supCoffee + supMilk + supSyrups + supDisp + supFood;

    // Labor
    const roles = [
      { sal: state.salBarista1, on: state.onBarista1 },
      { sal: state.salBarista2, on: state.onBarista2 },
      { sal: state.salCleaner, on: state.onCleaner },
      { sal: state.salBarista3, on: state.onBarista3 },
      { sal: state.salShiftLead, on: state.onShiftLead },
      { sal: state.salSocial, on: state.onSocial },
      { sal: state.salKitchen, on: state.onKitchen },
      { sal: state.salManager, on: state.onManager },
    ];
    const baseSal = roles.filter(r => r.on).reduce((s, r) => s + r.sal, 0);
    const activeCount = roles.filter(r => r.on).length;
    const socialInsurance = baseSal * 0.1875;
    const transport = activeCount * 400;
    const eidBonus = baseSal / 12;
    const totalLabor = baseSal + socialInsurance + transport + eidBonus;

    // Menu
    const menuItems = Object.entries(state.menu);
    const avgPrices = menuItems.map(([, v]) => v.price).filter(p => p > 0);
    const calcAvgTicket = avgPrices.length > 0 ? avgPrices.reduce((a, b) => a + b, 0) / avgPrices.length : 60;
    const avgTicket = state.avgTicket || Math.round(calcAvgTicket);
    const menuMargins = menuItems.map(([k, v]) => ({
      key: k, ...v,
      margin: v.price > 0 ? ((v.price - v.cost) / v.price * 100) : 0,
    }));
    const avgMargin = menuMargins.length > 0 ? menuMargins.reduce((s, m) => s + m.margin, 0) / menuMargins.length : 0;

    // Revenue
    const dailyRevenue = state.dailyCustomers * avgTicket;
    const monthlyRevenue = dailyRevenue * 30;

    // Monthly costs
    const fixedCosts = state.opUtilities + state.opInternet + state.opMarketing + state.opMaintenance + state.opAccounting + state.opInsurance + state.opPOS + state.opMisc;
    const totalMonthlyOp = state.monthlyRent + totalLabor + totalSupplies + fixedCosts;

    // P&L
    const monthlyPL = monthlyRevenue - totalMonthlyOp;
    const breakEvenCustomers = avgTicket > 0 ? Math.ceil(totalMonthlyOp / 30 / avgTicket) : 0;

    // Savings
    const partnerMonthly = state.partners.reduce((s, p) => s + p.monthly, 0);
    const partnerCurrent = state.partners.reduce((s, p) => s + p.current, 0);
    const totalCurrent = partnerCurrent + state.goldReserves;
    const savingsTarget = state.savingsTarget;

    // Savings timeline
    const effectiveMonthly = partnerMonthly + (state.hasRentalIncome && state.rentalPhase === 'own' ? state.rentalIncome : 0);
    let monthlyRate = 0;
    if (state.splitMode) {
      const totalAlloc = state.allocGold + state.allocMudarabah + state.allocForex + state.allocStocks + state.allocEgp || 1;
      const weightedReturn = (state.allocGold / totalAlloc * state.returnGold) + (state.allocMudarabah / totalAlloc * state.returnMudarabah) + (state.allocForex / totalAlloc * state.returnForex) + (state.allocStocks / totalAlloc * state.returnStocks) + (state.allocEgp / totalAlloc * state.returnEgp);
      monthlyRate = weightedReturn / 100 / 12;
    } else {
      monthlyRate = (state.savingsReturn || 0) / 100 / 12;
    }

    const targetAfterGold = Math.max(savingsTarget - state.goldReserves, 0);
    let savBalance = partnerCurrent;
    let savMonths = 0;
    if (totalCurrent >= savingsTarget) {
      savMonths = 0;
    } else {
      while (savBalance < targetAfterGold && savMonths < 240) {
        savBalance += effectiveMonthly + savBalance * monthlyRate;
        savMonths++;
      }
    }
    const savPct = savingsTarget > 0 ? Math.min(totalCurrent / savingsTarget * 100, 100) : 0;

    // Savings log
    let logTotal = totalCurrent;
    state.savingsLog.forEach(e => {
      Object.values(e.entries || {}).forEach(v => { logTotal += (v || 0); });
      logTotal += (e.rental || 0);
    });
    const logPct = savingsTarget > 0 ? Math.min(logTotal / savingsTarget * 100, 100) : 0;

    // Selected area
    const selectedArea = state.areas.find(a => a.id === state.selectedArea);

    // Zakat
    const zkNet = (state.zkCash + state.zkInventory + state.zkReceivables) - (state.zkDebts + state.zkExpenses);
    const zkDue = zkNet >= state.zkNisab ? zkNet * 0.025 : 0;

    return {
      // Startup
      eqTotal, spTotal, laTotal, lgTotal, deposit, totalStartup,
      // Supplies
      supCoffee, supMilk, supSyrups, supDisp, supFood, totalSupplies,
      // Labor
      baseSal, activeCount, socialInsurance, transport, eidBonus, totalLabor,
      // Menu
      menuMargins, avgTicket, avgMargin,
      // Revenue
      dailyRevenue, monthlyRevenue,
      // Costs
      fixedCosts, totalMonthlyOp,
      // P&L
      monthlyPL, breakEvenCustomers,
      // Savings
      partnerMonthly, partnerCurrent, totalCurrent,
      savMonths, savPct, effectiveMonthly,
      // Log
      logTotal, logPct,
      // Area
      selectedArea,
      // Zakat
      zkNet, zkDue,
      // Formatted
      fmt: {
        totalStartup: fmtK(totalStartup),
        totalMonthlyOp: fmtK(totalMonthlyOp),
        monthlyRevenue: fmtK(monthlyRevenue),
        monthlyPL: (monthlyPL >= 0 ? '+' : '') + fmtK(monthlyPL),
      },
    };
  }, [state]);
}
