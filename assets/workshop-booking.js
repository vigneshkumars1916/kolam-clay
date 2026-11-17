/**
 * Workshop booking: a month calendar on top of the session radios.
 * Without JavaScript the radios still work on their own; the calendar only filters them by date.
 */
if (!customElements.get('media-switcher')) {
  customElements.define('media-switcher', class extends HTMLElement {
    connectedCallback() {
      this.tabs = [...this.querySelectorAll('[role="tab"]')];
      this.tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => this.select(i));
        tab.addEventListener('keydown', (e) => {
          const keys = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: this.tabs.length - 1 };
          if (!(e.key in keys)) return;
          e.preventDefault();
          const next = (keys[e.key] + this.tabs.length) % this.tabs.length;
          this.select(next);
          this.tabs[next].focus();
        });
      });
    }
    select(index) {
      this.tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    }
  });
}

if (!customElements.get('workshop-booking')) {
  class WorkshopBooking extends HTMLElement {
    connectedCallback() {
      this.sessions = JSON.parse(this.querySelector('[data-sessions]').textContent);
      this.slots = [...this.querySelectorAll('[data-slot]')];
      this.idInput = this.querySelector('[data-session-input]');
      this.qty = this.querySelector('[data-qty]');
      this.submit = this.querySelector('.workshop__submit');
      this.status = this.querySelector('[data-status]');
      this.calendar = this.querySelector('[data-calendar]');
      this.grid = this.querySelector('[data-grid]');
      this.monthLabel = this.querySelector('[data-month]');

      this.dates = [...new Set(this.sessions.map((s) => s.date).filter(Boolean))].sort();
      this.months = [...new Set(this.dates.map((d) => d.slice(0, 7)))];

      const checked = this.querySelector('input[type="radio"]:checked') || this.querySelector('input[type="radio"]:not(:disabled)');
      const current = this.sessions.find((s) => String(s.id) === checked?.value);
      this.selectedDate = current?.date || this.dates[0];
      this.monthIndex = Math.max(0, this.months.indexOf((this.selectedDate || '').slice(0, 7)));

      this.addEventListener('change', (e) => { if (e.target.matches('input[type="radio"]')) this.onSession(e.target); });
      this.querySelectorAll('[data-step]').forEach((btn) => btn.addEventListener('click', () => this.step(Number(btn.dataset.step))));
      this.qty.addEventListener('change', () => this.clampQty());
      this.querySelector('[data-prev]')?.addEventListener('click', () => this.moveMonth(-1));
      this.querySelector('[data-next]')?.addEventListener('click', () => this.moveMonth(1));

      if (this.dates.length) {
        this.calendar.hidden = false;
        this.classList.add('has-calendar');
        this.renderCalendar();
        this.filterSlots();
      }
      if (checked) this.onSession(checked, true);
    }

    moveMonth(delta) {
      this.monthIndex = Math.min(this.months.length - 1, Math.max(0, this.monthIndex + delta));
      this.renderCalendar();
    }

    renderCalendar() {
      const [year, month] = this.months[this.monthIndex].split('-').map(Number);
      const first = new Date(Date.UTC(year, month - 1, 1));
      const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
      const lead = (first.getUTCDay() + 6) % 7; // weeks start on Monday
      const locale = document.documentElement.lang || 'en';
      this.monthLabel.textContent = first.toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
      this.querySelector('[data-prev]').disabled = this.monthIndex === 0;
      this.querySelector('[data-next]').disabled = this.monthIndex === this.months.length - 1;

      const weekdays = [...Array(7)].map((_, i) => new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }));
      let html = '<div class="cal__row cal__row--head" role="row">' + weekdays.map((d) => `<span role="columnheader" class="cal__dow">${d}</span>`).join('') + '</div>';
      const cells = [];
      for (let i = 0; i < lead; i++) cells.push('<span role="gridcell" class="cal__cell"></span>');
      for (let day = 1; day <= daysInMonth; day++) {
        const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const daySessions = this.sessions.filter((s) => s.date === iso);
        if (!daySessions.length) {
          cells.push(`<span role="gridcell" class="cal__cell cal__cell--off">${day}</span>`);
          continue;
        }
        const open = daySessions.some((s) => s.available);
        const selected = iso === this.selectedDate;
        const label = new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
        cells.push(`<span role="gridcell" class="cal__cell"><button type="button" class="cal__day${open ? '' : ' is-full'}${selected ? ' is-selected' : ''}" data-date="${iso}" aria-pressed="${selected}" aria-label="${label}${open ? '' : ' – ' + this.dataset.fullLabel}">${day}</button></span>`);
      }
      while (cells.length % 7) cells.push('<span role="gridcell" class="cal__cell"></span>');
      for (let i = 0; i < cells.length; i += 7) html += `<div class="cal__row" role="row">${cells.slice(i, i + 7).join('')}</div>`;
      this.grid.innerHTML = html;
      this.grid.querySelectorAll('[data-date]').forEach((btn) => btn.addEventListener('click', () => this.pickDate(btn.dataset.date)));
    }

    pickDate(iso) {
      this.selectedDate = iso;
      this.renderCalendar();
      this.filterSlots();
      const firstOpen = this.slots.find((slot) => slot.dataset.date === iso && !slot.querySelector('input').disabled);
      const input = (firstOpen || this.slots.find((slot) => slot.dataset.date === iso))?.querySelector('input');
      if (input && !input.disabled) {
        input.checked = true;
        this.onSession(input);
      } else {
        this.setButton(false);
      }
    }

    filterSlots() {
      this.slots.forEach((slot) => { slot.hidden = slot.dataset.date !== this.selectedDate; });
      this.classList.add('is-filtered');
    }

    onSession(input, silent = false) {
      const session = this.sessions.find((s) => String(s.id) === input.value);
      if (!session) return;
      this.idInput.value = session.id;
      const max = session.seats == null ? 99 : Math.max(1, session.seats);
      this.qty.max = max;
      this.clampQty();
      this.setButton(session.available);
      if (!silent && this.status) {
        this.status.textContent = '';
        requestAnimationFrame(() => { this.status.textContent = `${session.dateLabel}, ${session.time}`; });
      }
      const url = new URL(window.location.href);
      url.searchParams.set('variant', session.id);
      window.history.replaceState({}, '', url.toString());
    }

    setButton(available) {
      this.submit.disabled = !available;
      this.submit.querySelector('span').textContent = available ? this.dataset.bookLabel : this.dataset.fullLabel;
    }

    step(delta) {
      this.qty.value = Number(this.qty.value || 1) + delta;
      this.clampQty();
    }

    clampQty() {
      const max = Number(this.qty.max) || 99;
      const value = Math.min(max, Math.max(1, parseInt(this.qty.value, 10) || 1));
      this.qty.value = value;
    }
  }
  customElements.define('workshop-booking', WorkshopBooking);
}
