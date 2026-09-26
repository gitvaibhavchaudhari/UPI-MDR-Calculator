/* ============ CONFIGURATION — edit these to change default rates ============ */
const CONFIG = {
  defaultMdrRate: 1,
  gstRate: 18,
  applyGstByDefault: true,
  mdrPresets: [0, 0.5, 1, 1.5, 2, 2.5],
  txnTypeDefaultRates: {
    upi: 1,
    upi_cc: 1.5,
    other: 1
  }
};


/* ============ CALCULATION LOGIC ============ */

function calculateMDR(amount, mdrRatePct, gstRatePct, applyGst) {
  const mdrAmount = amount * mdrRatePct / 100;
  const gstAmount = applyGst
    ? (mdrAmount * gstRatePct / 100)
    : 0;

  const totalCharges = mdrAmount + gstAmount;
  const netSettlement = amount - totalCharges;

  const effectiveCost =
    amount > 0 ? (totalCharges / amount) * 100 : 0;

  return {
    mdrAmount,
    gstAmount,
    totalCharges,
    netSettlement,
    effectiveCost
  };
}


function calculateMonthly(
  avgTxn,
  txnPerDay,
  workDays,
  mdrRatePct,
  gstRatePct,
  applyGst
) {
  const volume = avgTxn * txnPerDay * workDays;

  const r = calculateMDR(
    volume,
    mdrRatePct,
    gstRatePct,
    applyGst
  );

  return {
    volume,
    mdr: r.mdrAmount,
    gst: r.gstAmount,
    total: r.totalCharges,
    net: r.netSettlement
  };
}


/* ============ HELPERS ============ */

function formatINR(num) {
  if (isNaN(num)) return '₹0';

  const n = Math.round(num * 100) / 100;

  const parts = n.toFixed(2).split('.');

  let intPart = parts[0].replace('-', '');
  const sign = n < 0 ? '-' : '';

  let lastThree = intPart.slice(-3);
  let other = intPart.slice(0, -3);

  if (other !== '') {
    lastThree = ',' + lastThree;
  }

  const formatted =
    other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    lastThree;

  const decimals =
    parts[1] === '00'
      ? ''
      : '.' + parts[1];

  return '₹' + sign + formatted + decimals;
}


function parseNum(v) {
  if (v === undefined || v === null) {
    return NaN;
  }

  const cleaned = String(v)
    .replace(/,/g, '')
    .trim();

  if (cleaned === '') {
    return NaN;
  }

  return Number(cleaned);
}


function showError(el, show) {
  el.style.display = show ? 'block' : 'none';
}


/* ============ CALCULATOR WIRING ============ */

const amountEl = document.getElementById('amount');
const mdrRateEl = document.getElementById('mdrRate');
const mdrPresetEl = document.getElementById('mdrPreset');
const gstToggleEl = document.getElementById('gstToggle');

const errAmount = document.getElementById('err-amount');
const errMdr = document.getElementById('err-mdr');

const resultsEl = document.getElementById('results');


mdrRateEl.value = CONFIG.defaultMdrRate;
gstToggleEl.checked = CONFIG.applyGstByDefault;


/* ============ MDR PRESET BUTTONS ============ */

const presetBtns = document.getElementById('presetBtns');

CONFIG.mdrPresets.forEach(p => {

  const b = document.createElement('button');

  b.className =
    'preset-btn' +
    (p === CONFIG.defaultMdrRate ? ' active' : '');

  b.textContent = p + '%';
  b.type = 'button';

  b.addEventListener('click', () => {

    mdrRateEl.value = p;
    mdrPresetEl.value = String(p);

    [...presetBtns.children].forEach(c =>
      c.classList.remove('active')
    );

    b.classList.add('active');

    runCalculation();
  });

  presetBtns.appendChild(b);
});


mdrPresetEl.addEventListener('change', () => {

  if (mdrPresetEl.value !== 'custom') {
    mdrRateEl.value = mdrPresetEl.value;
  }

  runCalculation();
});


/* ============ VALIDATION ============ */

function validateInputs() {

  const amount = parseNum(amountEl.value);
  const mdr = parseNum(mdrRateEl.value);

  let ok = true;

  showError(errAmount, false);
  showError(errMdr, false);

  if (isNaN(amount) || amount < 0) {
    showError(errAmount, true);
    ok = false;
  }

  if (isNaN(mdr) || mdr < 0) {
    showError(errMdr, true);
    ok = false;
  }

  return ok
    ? { amount, mdr }
    : null;
}


/* ============ MAIN CALCULATION ============ */

function runCalculation() {

  const vals = validateInputs();

  if (!vals) {
    resultsEl.classList.remove('show');
    return;
  }

  const { amount, mdr } = vals;

  const r = calculateMDR(
    amount,
    mdr,
    CONFIG.gstRate,
    gstToggleEl.checked
  );


  document.getElementById('r-net').textContent =
    formatINR(r.netSettlement);

  document.getElementById('r-amount').textContent =
    formatINR(amount);

  document.getElementById('r-rate').textContent =
    mdr + '%';

  document.getElementById('r-mdramt').textContent =
    formatINR(r.mdrAmount);

  document.getElementById('r-gst').textContent =
    formatINR(r.gstAmount);

  document.getElementById('r-total').textContent =
    formatINR(r.totalCharges);

  document.getElementById('r-eff').textContent =
    r.effectiveCost.toFixed(2) + '%';


  /* Breakdown */

  const bd = document.getElementById('breakdown');

  bd.innerHTML = `
    <div class="bd-step">
      <span>Customer Payment</span>
      <strong>${formatINR(amount)}</strong>
    </div>

    <div class="bd-arrow">↓</div>

    <div class="bd-step">
      <span>MDR</span>
      <strong>${formatINR(r.mdrAmount)}</strong>
    </div>

    <div class="bd-arrow">↓</div>

    <div class="bd-step">
      <span>GST</span>
      <strong>${formatINR(r.gstAmount)}</strong>
    </div>

    <div class="bd-arrow">↓</div>

    <div class="bd-step total">
      <span>Merchant Settlement</span>
      <strong>${formatINR(r.netSettlement)}</strong>
    </div>
  `;


  document.getElementById('timestamp').textContent =
    'Calculated on ' +
    new Date().toLocaleString('en-IN');

  resultsEl.classList.add('show');


  resultsEl._last = {
    amount,
    mdr,
    gst: CONFIG.gstRate,
    gstApplied: gstToggleEl.checked,
    ...r
  };
}


/* ============ CALCULATE BUTTON ============ */

document
  .getElementById('calcBtn')
  .addEventListener('click', runCalculation);


/* Recalculate when inputs change */

[amountEl, mdrRateEl, gstToggleEl].forEach(el => {

  el.addEventListener('input', () => {

    if (resultsEl.classList.contains('show')) {
      runCalculation();
    }

  });

});


/* ============ RESET ============ */

document
  .getElementById('resetBtn')
  .addEventListener('click', () => {

    amountEl.value = '';

    mdrRateEl.value =
      CONFIG.defaultMdrRate;

    mdrPresetEl.value = '1';

    gstToggleEl.checked =
      CONFIG.applyGstByDefault;

    document.getElementById('txnType').value =
      'upi';

    resultsEl.classList.remove('show');

    showError(errAmount, false);
    showError(errMdr, false);

  });


/* ============ CLEAR ALL ============ */

document
  .getElementById('clearBtn')
  .addEventListener('click', () => {

    document
      .getElementById('resetBtn')
      .click();

  });


/* ============ COPY RESULTS ============ */

document
  .getElementById('copyBtn')
  .addEventListener('click', () => {

    const d = resultsEl._last;

    if (!d) return;

    const text = `UPI MDR Calculation
--------------------
Transaction Amount: ${formatINR(d.amount)}
MDR Rate: ${d.mdr}%
MDR Amount: ${formatINR(d.mdrAmount)}
GST on MDR: ${formatINR(d.gstAmount)}
Total Charges: ${formatINR(d.totalCharges)}
Net Settlement: ${formatINR(d.netSettlement)}
Effective Cost: ${d.effectiveCost.toFixed(2)}%`;


    navigator.clipboard
      ?.writeText(text)
      .then(() => {

        const btn =
          document.getElementById('copyBtn');

        const old =
          btn.textContent;

        btn.textContent = 'Copied!';

        setTimeout(
          () => btn.textContent = old,
          1500
        );

      })
      .catch(() => {});

  });


/* ============ PRINT REPORT ============ */

document
  .getElementById('printBtn')
  .addEventListener(
    'click',
    () => window.print()
  );


/* ============ MONTHLY ESTIMATOR ============ */

document
  .getElementById('monthlyBtn')
  .addEventListener('click', () => {

    const avg =
      parseNum(
        document.getElementById('avgTxn').value
      );

    const perDay =
      parseNum(
        document.getElementById('txnPerDay').value
      );

    const days =
      parseNum(
        document.getElementById('workDays').value
      );

    const mdr =
      parseNum(
        document.getElementById('monthlyMdr').value
      );


    if (
      [avg, perDay, days, mdr]
        .some(v => isNaN(v) || v < 0)
    ) {
      return;
    }


    const r = calculateMonthly(
      avg,
      perDay,
      days,
      mdr,
      CONFIG.gstRate,
      gstToggleEl.checked
    );


    document.getElementById('m-volume').textContent =
      formatINR(r.volume);

    document.getElementById('m-mdr').textContent =
      formatINR(r.mdr);

    document.getElementById('m-gst').textContent =
      formatINR(r.gst);

    document.getElementById('m-total').textContent =
      formatINR(r.total);

    document.getElementById('m-net').textContent =
      formatINR(r.net);


    document.getElementById('monthlyResults').style.display =
      'grid';

  });


/* ============ FAQ ============ */

const faqData = [

  [
    "What is MDR?",
    "MDR (Merchant Discount Rate) is a fee that may be deducted from a transaction amount for accepting a digital payment. It's typically set by the payment provider or agreed arrangement."
  ],

  [
    "Is MDR applicable to every UPI transaction?",
    "No. MDR applicability and rate depend on the payment provider, merchant category, transaction type, and current regulations. Some UPI transactions may have zero MDR."
  ],

  [
    "What is GST on MDR?",
    "GST may be charged on the MDR amount itself (not on the full transaction), at the applicable GST rate, currently modeled here as 18% and configurable."
  ],

  [
    "How is net settlement calculated?",
    "Net Settlement = Transaction Amount − (MDR Amount + GST on MDR)."
  ],

  [
    "Can I change the MDR rate?",
    "Yes. Use the preset dropdown or type any custom rate into the MDR field."
  ],

  [
    "Does UPI Credit Card have different charges?",
    "It can. UPI Credit Card transactions may carry different MDR arrangements compared to standard UPI — check with your provider."
  ],

  [
    "Are the results of this calculator official?",
    "No. This is an independent estimation tool, not affiliated with any bank, NPCI, or payment provider, and does not reflect official current rates."
  ],

  [
    "Why can actual settlement differ from the calculator?",
    "Real settlement can include provider-specific fees, rounding, taxes, refunds, chargebacks, or scheme rules not captured by this simplified estimator."
  ]

];


const faqList =
  document.getElementById('faqList');


faqData.forEach(([q, a]) => {

  const item =
    document.createElement('div');

  item.className =
    'faq-item';


  item.innerHTML = `
    <button class="faq-q">
      ${q}
      <span class="chev">⌄</span>
    </button>

    <div class="faq-a">
      <p>${a}</p>
    </div>
  `;


  item
    .querySelector('.faq-q')
    .addEventListener('click', () => {

      const wasOpen =
        item.classList.contains('open');

      document
        .querySelectorAll('.faq-item')
        .forEach(i =>
          i.classList.remove('open')
        );

      if (!wasOpen) {
        item.classList.add('open');
      }

    });


  faqList.appendChild(item);

});


/* ============ MOBILE NAVIGATION ============ */

document
  .getElementById('hamBtn')
  .addEventListener('click', () => {

    document
      .getElementById('mobileNav')
      .classList.toggle('open');

  });


document
  .querySelectorAll('#mobileNav a')
  .forEach(a => {

    a.addEventListener('click', () => {

      document
        .getElementById('mobileNav')
        .classList.remove('open');

    });

  });


/* ============ DARK MODE ============ */

const themeBtn =
  document.getElementById('themeToggle');


themeBtn.addEventListener('click', () => {

  const root =
    document.documentElement;

  const cur =
    root.getAttribute('data-theme');


  if (cur === 'dark') {

    root.setAttribute(
      'data-theme',
      'light'
    );

    themeBtn.textContent = '🌙';

  } else {

    root.setAttribute(
      'data-theme',
      'dark'
    );

    themeBtn.textContent = '☀️';

  }

});