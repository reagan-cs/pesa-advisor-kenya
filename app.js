/* =====================================================
   PESA ADVISOR KENYA — Senior Financial Advisor Engine
   Payment: M-Pesa → WhatsApp screenshot verification
   Contact: 0114129044
   ===================================================== */

const CONFIG = {
  MPESA_NUMBER: '0114129044',
  WHATSAPP_NUMBER: '254114129044',
};

const PLANS = {
  basic:    { name: 'Basic',    amount: 10,  label: 'Quick Snapshot' },
  hustler:  { name: 'Hustler',  amount: 29,  label: 'Full Analysis'  },
  biashara: { name: 'Biashara', amount: 99,  label: 'Business Strategy' },
};

const LOAN_DATA = {
  mshwari: {
    name: 'M-Shwari', provider: 'Safaricom × NCBA',
    rate: 7.5, rateLabel: '7.5% / month', maxAmount: 50000, term: '30 days',
    pros: ['No documents needed', 'Limit grows with good history', 'Instant via *234#', 'Early repayment rewarded'],
    cons: ['30-day window only', 'Low limit for new users', 'Needs active M-Pesa history'],
    verdict: 'Best starter loan for most Kenyans. Low cost, fast, no paperwork.',
    howTo: 'Dial *234# → Loans & Savings → M-Shwari → Apply',
  },
  kcb: {
    name: 'KCB M-Pesa', provider: 'KCB × Safaricom',
    rate: 8.64, rateLabel: '8.64% / month', maxAmount: 1000000, term: '6 months',
    pros: ['Up to KSh 1M limit', '6-month repayment window', 'Great for business capital'],
    cons: ['Slightly higher rate', 'Needs strong M-Pesa usage history', 'Stricter credit scoring'],
    verdict: 'Best for business owners needing capital above KSh 50,000.',
    howTo: 'Open M-Pesa → Loans & Savings → KCB M-Pesa Loan',
  },
  fuliza: {
    name: 'Fuliza', provider: 'Safaricom overdraft',
    rate: 30, rateLabel: '1% per DAY + fee', maxAmount: 50000, term: 'Rolling',
    pros: ['Instant, no application', 'Auto-activates when balance low', 'Available 24/7'],
    cons: ['1% PER DAY — very expensive', 'Easy to forget it accumulates', 'Debt trap if held long'],
    verdict: '⚠ DANGER: Only use for 1–2 days max. KSh 5,000 for 7 days = KSh 350 extra.',
    howTo: 'Automatic when M-Pesa balance low. Activate via *234#',
  },
  tala: {
    name: 'Tala', provider: 'Tala Mobile',
    rate: 13, rateLabel: '11–15% / month', maxAmount: 30000, term: '21–61 days',
    pros: ['No M-Pesa account required', 'Fast approval in minutes', 'Good for non-Safaricom users'],
    cons: ['Higher interest than M-Shwari', 'Aggressive repayment reminders', 'Needs smartphone + data'],
    verdict: 'Good if you don\'t have M-Pesa. Higher cost — compare carefully.',
    howTo: 'Download Tala app → Sign up with National ID → Apply',
  },
  equity: {
    name: 'Equity EazzyLoan', provider: 'Equity Bank',
    rate: 3, rateLabel: '3% / month flat', maxAmount: 3000000, term: '1–12 months',
    pros: ['Lowest rate in Kenya (3%/mo)', 'Up to KSh 3M limit', 'Up to 12 months to repay', 'Bank-backed'],
    cons: ['Must have Equity account', 'Stricter qualification', 'Slower than mobile loans'],
    verdict: 'Best overall value for medium to large loans. Open Equity account first.',
    howTo: 'Open Equity Mobile app → Loans → EazzyLoan → Apply',
  },
  branch: {
    name: 'Branch', provider: 'Branch International',
    rate: 26, rateLabel: '17–35% / month', maxAmount: 70000, term: '1–12 months',
    pros: ['Higher limit than Tala', 'No bank account needed', 'Longer repayment available'],
    cons: ['Very high interest (up to 35%)', 'Immediate CRB reporting on default', 'Rate varies per user'],
    verdict: '⚠ Last resort only. Rates are among the highest in Kenya.',
    howTo: 'Download Branch app → Verify with National ID → Apply',
  },
};

// ── STATE ────────────────────────────────────────────
let state = {
  currentPlan: 'hustler',
  intake: {},
};

// ── SPLASH ──────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    if (splash) splash.classList.add('hide');
    if (app) app.style.display = 'block';
  }, 1500);
});

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── LOAN FILTER ─────────────────────────────────────
function filterLoans(tag, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.loan-card').forEach(card => {
    const tags = card.dataset.tags || '';
    card.classList.toggle('hidden', tag !== 'all' && !tags.includes(tag));
  });
}

// ── LOAN MODAL ──────────────────────────────────────
function selectLoan(id) {
  const l = LOAN_DATA[id];
  if (!l) return;
  const pros = l.pros.map(p => `<li><i class="ti ti-check"></i>${p}</li>`).join('');
  const cons = l.cons.map(c => `<li><i class="ti ti-x"></i>${c}</li>`).join('');
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-loan-header">
      <div class="modal-loan-name">${l.name}</div>
      <div class="modal-loan-provider">${l.provider}</div>
    </div>
    <div class="modal-stats">
      <div class="mstat green"><div class="mstat-label">Rate</div><div class="mstat-val">${l.rateLabel}</div></div>
      <div class="mstat"><div class="mstat-label">Max Loan</div><div class="mstat-val">KSh ${l.maxAmount.toLocaleString()}</div></div>
      <div class="mstat"><div class="mstat-label">Term</div><div class="mstat-val">${l.term}</div></div>
    </div>
    <div class="verdict-box">${l.verdict}</div>
    <div class="pros-cons">
      <div><div class="pc-title green-txt">✓ Pros</div><ul class="pc-list green-list">${pros}</ul></div>
      <div><div class="pc-title red-txt">✗ Cons</div><ul class="pc-list red-list">${cons}</ul></div>
    </div>
    <div class="how-to-box"><strong>How to apply:</strong> ${l.howTo}</div>
  `;
  document.getElementById('loanModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('loanModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('loanModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ── CALCULATOR ──────────────────────────────────────
function calcUpdate() {
  const amount   = parseInt(document.getElementById('sliderAmount').value);
  const rate     = parseFloat(document.getElementById('sliderRate').value);
  const interest = Math.round(amount * rate / 100);
  const excise   = Math.round(interest * 0.20);
  const total    = amount + interest + excise;
  const daily    = Math.round(total / 30);
  const apr      = Math.round(rate * 12);
  document.getElementById('calcAmount').textContent  = 'KSh ' + amount.toLocaleString();
  document.getElementById('calcRate').textContent    = rate.toFixed(1) + '%';
  document.getElementById('rTotal').textContent      = 'KSh ' + total.toLocaleString();
  document.getElementById('rPrincipal').textContent  = 'KSh ' + amount.toLocaleString();
  document.getElementById('rInterest').textContent   = 'KSh ' + interest.toLocaleString();
  document.getElementById('rExcise').textContent     = 'KSh ' + excise.toLocaleString();
  document.getElementById('rTotalRow').textContent   = 'KSh ' + total.toLocaleString();
  document.getElementById('rDaily').textContent      = 'KSh ' + daily.toLocaleString() + '/day';
  document.getElementById('rAPR').textContent        = apr + '% p.a.';
}

function setPreset(rate, btn) {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sliderRate').value = rate;
  calcUpdate();
}
calcUpdate();

// ── PAYMENT MODAL ───────────────────────────────────
function openPay(plan) {
  state.currentPlan = plan || 'hustler';
  selectPlan(state.currentPlan);
  showPayStep(1);
  document.getElementById('payModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePayModal() {
  document.getElementById('payModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('payModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closePayModal();
});

function selectPlan(planId) {
  state.currentPlan = planId;
  document.querySelectorAll('.plan-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('plan-' + planId)?.classList.add('selected');
  const p = PLANS[planId];
  const btn = document.getElementById('proceedBtn');
  if (btn) btn.innerHTML = `Continue with KSh ${p.amount} plan <i class="ti ti-arrow-right"></i>`;
}

function showPayStep(n) {
  document.querySelectorAll('.pay-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === n);
  });
}

// ── STEP 1 → STEP 2: Intake questionnaire ───────────
function proceedToIntake() {
  showPayStep(2);
}

// ── STEP 2: Validate intake and go to M-Pesa step ───
function proceedToMpesa() {
  const name    = document.getElementById('intakeName').value.trim();
  const purposeEl  = document.querySelector('input[name="purpose"]:checked');
  const income  = document.getElementById('intakeIncome').value;
  const existingEl = document.querySelector('input[name="existing"]:checked');
  const purpose = purposeEl ? purposeEl.value : '';
  const existing = existingEl ? existingEl.value : '';

  // Validate all fields
  let valid = true;
  if (!name)     { showErr('errName', true);    valid = false; } else { showErr('errName', false); }
  if (!purpose)  { showErr('errPurpose', true); valid = false; } else { showErr('errPurpose', false); }
  if (!income)   { showErr('errIncome', true);  valid = false; } else { showErr('errIncome', false); }
  if (!existing) { showErr('errExisting', true);valid = false; } else { showErr('errExisting', false); }
  if (!valid) return;

  // Save intake data
  state.intake = {
    name,
    purpose,
    income,
    existing,
    loanAmount: parseInt(document.getElementById('sliderAmount')?.value || 10000),
    loanRate:   parseFloat(document.getElementById('sliderRate')?.value || 7.5),
  };

  // Update M-Pesa step details
  const plan = PLANS[state.currentPlan];
  document.getElementById('instrAmount').textContent = plan.amount;
  document.getElementById('instrPlan').textContent   = plan.name;
  document.getElementById('instrName2').textContent  = name;

  showPayStep(3);
}

function showErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
}

// ── STEP 3: Copy M-Pesa number ──────────────────────
function copyNumber() {
  navigator.clipboard.writeText(CONFIG.MPESA_NUMBER).then(() => {
    const btn = document.getElementById('copyBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-check"></i> Copied!';
    btn.style.cssText += ';background:#1D9E75;color:#fff;border-color:#1D9E75';
    setTimeout(() => { btn.innerHTML = orig; btn.style.cssText = ''; }, 2500);
  });
}

// ── STEP 3 → STEP 4: Open WhatsApp ──────────────────
function iHavePaid() {
  const plan = PLANS[state.currentPlan];
  const { name, purpose, income, existing, loanAmount, loanRate } = state.intake;

  const purposeLabel = {
    stock:      'Stock / Biashara goods',
    school:     'School fees / Education',
    emergency:  'Emergency / Haraka',
    rent:       'Rent / Housing',
    equipment:  'Equipment / Vifaa',
    farming:    'Farming / Kilimo',
    other:      'Other purpose',
  }[purpose] || purpose;

  const incomeLabel = {
    under10: 'Under KSh 10,000/month',
    '10to30': 'KSh 10,000–30,000/month',
    '30to50': 'KSh 30,000–50,000/month',
    above50: 'Above KSh 50,000/month',
  }[income] || income;

  const msg = encodeURIComponent(
`Habari! 👋 Mimi ni *${name}*.

Nimetuma *KSh ${plan.amount}* kwa M-Pesa nambari *${CONFIG.MPESA_NUMBER}* — *${plan.name} Plan*.

📋 Maelezo yangu:
• Ninahitaji kukopa: KSh ${loanAmount.toLocaleString()} @ ${loanRate}%/mwezi
• Sababu ya mkopo: ${purposeLabel}
• Mapato yangu kwa mwezi: ${incomeLabel}
• Nina mikopo mingine: ${existing === 'yes' ? 'Ndiyo' : existing === 'no' ? 'Hapana' : 'Fuliza tu'}

Ninatuma screenshot ya M-Pesa yangu hapa chini. Tafadhali nitumie ushauri wangu wa kibinafsi. Asante! 🙏`
  );

  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  showPayStep(4);
}

// ── ADVICE ENGINE ── Used when you reply on WhatsApp
// This function generates the professional advice report
// that you (the owner) can copy-paste to send to the customer
function generateAdvisorReport(intake) {
  const { name, purpose, income, existing, loanAmount, loanRate } = intake;
  const interest  = Math.round(loanAmount * loanRate / 100);
  const excise    = Math.round(interest * 0.20);
  const total     = loanAmount + interest + excise;
  const daily     = Math.round(total / 30);
  const weekly    = Math.round(total / 4);
  const incomeNum = { under10: 8000, '10to30': 20000, '30to50': 40000, above50: 60000 }[income] || 15000;
  const debtRatio = Math.round((total / incomeNum) * 100);
  const isRisky   = debtRatio > 30;
  const isExisting = existing !== 'no';

  // Best lender recommendation logic
  let recommended, reason, warning = '';
  if (loanAmount <= 50000 && loanRate <= 8) {
    recommended = 'M-Shwari';
    reason = 'Low amount, low rate — M-Shwari is your cheapest option with no documents needed.';
  } else if (loanAmount > 50000 && loanAmount <= 1000000) {
    recommended = 'KCB M-Pesa';
    reason = 'For this amount, KCB M-Pesa gives you up to 6 months to repay — far better than 30-day pressure.';
  } else if (loanAmount > 1000000) {
    recommended = 'Equity EazzyLoan';
    reason = 'Only Equity handles amounts this large at a reasonable rate (3%/month). Open an Equity account this week.';
  } else {
    recommended = 'M-Shwari';
    reason = 'Start here to build credit history. After 3 repayments, upgrade to KCB M-Pesa for larger needs.';
  }

  if (isExisting) warning = '⚠ You currently have existing loans. Avoid borrowing until you have cleared at least one — multiple loans multiply your CRB risk significantly.';
  if (isRisky)    warning = (warning ? warning + '\n\n' : '') + `⚠ This loan (KSh ${total.toLocaleString()} repayment) represents ${debtRatio}% of your monthly income. Financial advisors recommend staying below 30%.`;

  const purposeAdvice = {
    stock:     `Good reason to borrow. Stock loans are productive — the goods you buy should generate profit to repay the loan. Rule: your stock profit margin must exceed ${loanRate}% monthly.`,
    school:    `Education is a valid investment. However, school fee loans should be short-term. If fees are recurring each term, consider a savings plan (M-Shwari savings) rather than repeated borrowing.`,
    emergency: `Emergencies justify borrowing. But after this crisis, please build an emergency fund of at least KSh ${Math.round(loanAmount * 0.5).toLocaleString()} in M-Shwari savings so next time you don't need to borrow.`,
    rent:      `Borrowing for rent is a warning sign — it means expenses exceed income. After paying this rent, urgently reduce monthly expenses or increase income before the next rent cycle.`,
    equipment: `Equipment loans are good if the equipment generates income. Calculate: will this equipment earn enough to repay KSh ${daily.toLocaleString()}/day? If yes, proceed. If not, the loan doesn't make financial sense.`,
    farming:   `Agricultural loans are seasonal. Align your repayment date with your harvest/sale date. Never take a 30-day loan for farming — it will mature before your crop is ready. Use KCB M-Pesa (6 months) instead.`,
    other:     `Ensure this loan is for something that either generates income or is a true necessity. Loans for consumption (food, entertainment) should be avoided — they leave you poorer.`,
  }[purpose] || '';

  // Weekly repayment plan
  const w1 = Math.ceil(total * 0.30);
  const w2 = Math.ceil(total * 0.30);
  const w3 = Math.ceil(total * 0.25);
  const w4 = total - w1 - w2 - w3;

  return { recommended, reason, warning, purposeAdvice, total, interest, excise, daily, weekly, debtRatio, isRisky, w1, w2, w3, w4, incomeNum };
}

// Make generator available globally for owner's reference
window.generateAdvisorReport = generateAdvisorReport;
window.state = state;

console.log('%c🇰🇪 Pesa Advisor Kenya', 'font-size:16px;font-weight:bold;color:#1D9E75');
console.log('%cTip: To generate an advice report for a customer, call:\ngenerateAdvisorReport(state.intake)', 'font-size:12px;color:#888');

// ── PROGRESS BAR UPDATE ─────────────────────────────
function updateProgress(step) {
  const pct = { 1: '25%', 2: '50%', 3: '75%', 4: '100%' }[step] || '25%';
  document.getElementById('ppFill').style.width = pct;
  document.querySelectorAll('.pp-lbl').forEach((el, i) => {
    el.classList.toggle('active', i + 1 <= step);
  });
}

// Override showPayStep to also update progress
const _origShow = showPayStep;
window.showPayStep = function(n) {
  _origShow(n);
  updateProgress(n);
};

// Override proceedToIntake to update progress
const _origIntake = proceedToIntake;
window.proceedToIntake = function() {
  _origIntake();
  updateProgress(2);
};

// Override iHavePaid to update progress
const _origPaid = iHavePaid;
window.iHavePaid = function() {
  _origPaid();
  updateProgress(4);
};

// Sync radio buttons to hidden select-like state
document.addEventListener('change', e => {
  if (e.target.name === 'purpose') {
    document.getElementById('errPurpose').style.display = 'none';
    state.intake.purpose = e.target.value;
  }
  if (e.target.name === 'existing') {
    document.getElementById('errExisting').style.display = 'none';
    state.intake.existing = e.target.value;
  }
});
