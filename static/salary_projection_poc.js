(() => {
  const money = new Intl.NumberFormat('en-CA', { style:'currency', currency:'CAD', maximumFractionDigits:0 });
  const body = document.querySelector('#projection-body');
  const currentSalary = document.querySelector('#current-salary');
  const defaultRaise = document.querySelector('#default-raise');
  const retirementDate = document.querySelector('#retirement-date');
  const status = document.querySelector('#save-status');
  const overrides = new Map();
  const actual = { year:2025, age:59, income:121700 };
  const endYear = 2034;

  function key(year, field) { return `${year}:${field}`; }
  function value(year, field, calculated) { return overrides.has(key(year, field)) ? overrides.get(key(year, field)) : calculated; }
  function retirementFraction(year) {
    const date = new Date(`${retirementDate.value}T00:00:00`);
    if (year < date.getFullYear()) return 1;
    if (year > date.getFullYear()) return 0;
    const start = new Date(year, 0, 1), end = new Date(year + 1, 0, 1);
    return Math.max(0, Math.min(1, (date - start) / (end - start)));
  }
  function editable(year, field, val, suffix='') {
    const overridden = overrides.has(key(year, field));
    return `<div class="cell-edit ${overridden ? 'override' : ''}"><input data-year="${year}" data-field="${field}" type="number" step="${field === 'raise' ? '.1' : '100'}" value="${Number(val).toFixed(field === 'raise' ? 1 : 0)}"><span>${suffix}</span><button class="reset-cell" data-reset="${key(year, field)}" title="Reset to calculated">Reset</button></div>`;
  }
  function render() {
    let salary = Number(currentSalary.value || 0);
    const defaultRate = Number(defaultRaise.value || 0);
    const retirementYear = new Date(`${retirementDate.value}T00:00:00`).getFullYear();
    let html = `<tr class="actual-row"><td><strong>${actual.year} Actual</strong></td><td>${actual.age}</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>${money.format(actual.income)}</strong></td><td><span class="source-badge">Historical actual</span></td></tr>`;
    for (let year=2026; year<=endYear; year++) {
      const age = actual.age + (year - actual.year);
      if (year > 2026) {
        const rate = value(year, 'raise', defaultRate);
        salary = salary * (1 + rate / 100);
      }
      const calculatedSalary = salary;
      salary = value(year, 'salary', calculatedSalary);
      const rateShown = year === 2026 ? 0 : value(year, 'raise', defaultRate);
      const bonus = value(year, 'bonus', 0);
      const fraction = retirementFraction(year);
      const employment = fraction > 0 ? (salary + bonus) * fraction : 0;
      const retired = year > retirementYear || fraction === 0;
      const partial = fraction > 0 && fraction < 1;
      const anyOverride = ['salary','raise','bonus'].some(field => overrides.has(key(year, field)));
      html += `<tr class="${retired ? 'retired-row' : ''}"><td>${year}</td><td>${age}</td><td>${retired ? '—' : editable(year,'salary',salary)}</td><td>${year===2026 || retired ? '—' : editable(year,'raise',rateShown,'%')}</td><td>${retired ? '—' : editable(year,'bonus',bonus)}</td><td>${partial ? `<span class="retirement-marker">${retirementDate.value}</span>` : retired ? 'Retired' : '—'}</td><td><strong>${money.format(employment)}</strong></td><td><span class="source-badge ${anyOverride ? 'override' : ''}">${anyOverride ? 'Override + calculated' : retired ? 'Retirement plan' : 'Calculated'}</span></td></tr>`;
    }
    body.innerHTML = html;
  }

  body.addEventListener('change', event => {
    const input = event.target.closest('input[data-field]');
    if (!input) return;
    overrides.set(key(input.dataset.year, input.dataset.field), Number(input.value));
    status.textContent = 'Unsaved scenario changes'; render();
  });
  body.addEventListener('click', event => {
    const button = event.target.closest('[data-reset]');
    if (!button) return;
    overrides.delete(button.dataset.reset); status.textContent = 'Unsaved scenario changes'; render();
  });
  [currentSalary, defaultRaise, retirementDate].forEach(el => el.addEventListener('change', () => { status.textContent='Unsaved scenario changes'; render(); }));
  document.querySelector('#save').addEventListener('click', () => { status.textContent='POC: scenario would now be persisted'; });
  document.querySelector('#save-as').addEventListener('click', () => { const name=prompt('Scenario name','Work one more year'); if(name){ const option=new Option(name,name,true,true); document.querySelector('#scenario').add(option); status.textContent=`POC: “${name}” created`; } });
  render();
})();
