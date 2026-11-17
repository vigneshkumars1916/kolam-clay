(() => {
  if (customElements.get('delivery-estimate')) return;

  const TIME_ZONE = 'Asia/Kolkata';
  const dayFormat = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: TIME_ZONE });

  function studioNow() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return { date: new Date(Date.UTC(get('year'), get('month') - 1, get('day'), 12)), hour: get('hour') };
  }

  function addWorkingDays(date, days) {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setUTCDate(result.getUTCDate() + 1);
      if (result.getUTCDay() !== 0) added += 1;
    }
    return result;
  }

  class DeliveryEstimate extends HTMLElement {
    connectedCallback() {
      const dispatch = Number(this.dataset.dispatch) || 0;
      const cutoff = Number(this.dataset.cutoff);
      const now = studioNow();
      let start = now.date;
      const afterCutoff = !isNaN(cutoff) && now.hour >= cutoff;
      if (start.getUTCDay() === 0 || afterCutoff) start = addWorkingDays(start, 1);
      const shipped = addWorkingDays(start, dispatch);

      this.querySelectorAll('.delivery-estimate__row').forEach((row) => {
        const min = Number(row.dataset.min);
        const max = Number(row.dataset.max);
        if (!min && !max) return;
        const from = dayFormat.format(addWorkingDays(shipped, min));
        const to = dayFormat.format(addWorkingDays(shipped, Math.max(min, max)));
        row.querySelector('[data-date]').textContent = from === to ? from : `${from} – ${to}`;
      });
    }
  }

  customElements.define('delivery-estimate', DeliveryEstimate);
})();
