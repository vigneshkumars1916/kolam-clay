(() => {
  if (customElements.get('currency-converter')) return;

  const STORAGE_CURRENCY = 'kc-currency';
  const STORAGE_RATES = 'kc-rates';
  const RATES_MAX_AGE = 12 * 60 * 60 * 1000;
  const AED_PER_USD = 3.6725;
  const PRICE_PATTERN = /(?:Rs\.?\s?|₹\s?)(\d{1,3}(?:,\d{2,3})*(?:\.\d{1,2})?)(?:\s?INR)?/g;
  const SKIP_SELECTOR =
    'script, style, noscript, textarea, input, select, option, [data-cc-skip], currency-converter, .kc-money';

  const store = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        /* storage unavailable */
      }
    },
  };

  const state = {
    base: 'INR',
    currencies: ['INR'],
    current: 'INR',
    rates: { INR: 1 },
    live: true,
    observer: null,
    scheduled: false,
  };

  const formatters = {};

  function formatter(code) {
    if (!formatters[code]) {
      const locale = code === 'INR' ? 'en-IN' : 'en-US';
      formatters[code] = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return formatters[code];
  }

  function symbolFor(code) {
    if (code === 'INR') return '₹';
    const part = formatter(code)
      .formatToParts(0)
      .find((p) => p.type === 'currency');
    return part ? part.value : code;
  }

  function nameFor(code) {
    try {
      return new Intl.DisplayNames([document.documentElement.lang || 'en'], { type: 'currency' }).of(code);
    } catch (error) {
      return code;
    }
  }

  function parseFallback(text) {
    const rates = {};
    (text || '').split(/[,\n]/).forEach((pair) => {
      const [code, value] = pair.split(':').map((s) => s && s.trim());
      const rate = parseFloat(value);
      if (code && rate > 0) rates[code.toUpperCase()] = rate;
    });
    return rates;
  }

  function formatAmount(inr) {
    const code = state.current;
    const rate = code === state.base ? 1 : state.rates[code];
    if (!rate) return formatter(state.base).format(inr);
    return formatter(code).format(inr * rate);
  }

  function renderMoney(root = document) {
    root.querySelectorAll('.kc-money').forEach((el) => {
      const value = parseFloat(el.dataset.inr);
      if (!isNaN(value)) el.textContent = formatAmount(value);
    });
    document.documentElement.dataset.currency = state.current;
    document.querySelectorAll('[data-cc-note]').forEach((note) => {
      note.hidden = state.current === state.base;
      if (!note.dataset.template) note.dataset.template = note.textContent;
      note.textContent = note.dataset.template.replace('{currency}', state.current);
    });
  }

  function wrapPrices(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !/(Rs\.?|₹)\s?\d/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const text = node.nodeValue;
      const fragment = document.createDocumentFragment();
      let last = 0;
      text.replace(PRICE_PATTERN, (match, amount, offset) => {
        if (offset > last) fragment.append(text.slice(last, offset));
        const span = document.createElement('span');
        span.className = 'kc-money';
        span.dataset.inr = amount.replace(/,/g, '');
        span.textContent = formatAmount(parseFloat(span.dataset.inr));
        fragment.append(span);
        last = offset + match.length;
        return match;
      });
      if (last === 0) return;
      if (last < text.length) fragment.append(text.slice(last));
      node.replaceWith(fragment);
    });
  }

  function refresh() {
    state.scheduled = false;
    if (state.observer) state.observer.disconnect();
    wrapPrices(document.body);
    renderMoney();
    if (state.observer) state.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function schedule() {
    if (state.scheduled) return;
    state.scheduled = true;
    window.requestAnimationFrame(refresh);
  }

  async function loadLiveRates() {
    const wanted = state.currencies.filter((c) => c !== state.base && c !== 'AED');
    if (state.currencies.includes('AED') && !wanted.includes('USD')) wanted.push('USD');
    if (!wanted.length) return;

    const cached = JSON.parse(store.get(STORAGE_RATES) || 'null');
    if (cached && cached.base === state.base && Date.now() - cached.time < RATES_MAX_AGE) {
      Object.assign(state.rates, cached.rates);
      return;
    }

    try {
      const url = `https://api.frankfurter.dev/v1/latest?from=${state.base}&to=${wanted.join(',')}`;
      const response = await fetch(url);
      if (!response.ok) return;
      const data = await response.json();
      const rates = { ...data.rates };
      if (rates.USD) rates.AED = rates.USD * AED_PER_USD;
      Object.assign(state.rates, rates);
      store.set(STORAGE_RATES, JSON.stringify({ base: state.base, time: Date.now(), rates }));
      renderMoney();
    } catch (error) {
      /* keep backup rates */
    }
  }

  function setCurrency(code) {
    if (!state.currencies.includes(code)) code = state.currencies[0];
    state.current = code;
    store.set(STORAGE_CURRENCY, code);
    document.querySelectorAll('currency-converter').forEach((el) => el.update());
    renderMoney();
  }

  class CurrencyConverter extends HTMLElement {
    connectedCallback() {
      this.button = this.querySelector('.cc__button');
      this.list = this.querySelector('.cc__list');
      this.options = Array.from(this.querySelectorAll('.cc__option'));

      if (!CurrencyConverter.ready) {
        CurrencyConverter.ready = true;
        const config = JSON.parse(this.querySelector('[data-cc-config]').textContent);
        state.base = config.base;
        state.currencies = config.currencies.length ? config.currencies : [config.base];
        state.live = config.live;
        state.rates = { [state.base]: 1, ...parseFallback(config.fallback) };
        const saved = store.get(STORAGE_CURRENCY);
        state.current = state.currencies.includes(saved) ? saved : state.currencies[0];
        state.observer = new MutationObserver(schedule);
        refresh();
        if (state.live) loadLiveRates();
      }

      this.options.forEach((option) => {
        const code = option.dataset.currency;
        option.querySelector('.cc__option-symbol').textContent = symbolFor(code);
        option.querySelector('.cc__option-name').textContent = nameFor(code);
        option.addEventListener('click', () => {
          setCurrency(code);
          this.close();
          this.button.focus();
        });
      });

      this.button.addEventListener('click', () => (this.list.hidden ? this.open() : this.close()));
      this.addEventListener('keydown', (event) => this.onKeydown(event));
      document.addEventListener('click', (event) => {
        if (!this.contains(event.target)) this.close();
      });
      this.update();
    }

    update() {
      this.querySelector('[data-cc-symbol]').textContent = symbolFor(state.current);
      this.querySelector('[data-cc-code]').textContent = state.current;
      this.button.setAttribute('aria-label', `${this.button.dataset.label}: ${nameFor(state.current)}`);
      this.options.forEach((option) => {
        const selected = option.dataset.currency === state.current;
        option.setAttribute('aria-selected', selected);
      });
    }

    open() {
      this.list.hidden = false;
      this.button.setAttribute('aria-expanded', 'true');
      const selected = this.options.find((o) => o.getAttribute('aria-selected') === 'true') || this.options[0];
      if (selected) selected.focus();
    }

    close() {
      if (this.list.hidden) return;
      this.list.hidden = true;
      this.button.setAttribute('aria-expanded', 'false');
    }

    onKeydown(event) {
      if (event.key === 'Escape') {
        this.close();
        this.button.focus();
        return;
      }
      if (this.list.hidden) return;
      const index = this.options.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const next = this.options[(index + step + this.options.length) % this.options.length];
        next.focus();
      } else if ((event.key === 'Enter' || event.key === ' ') && index > -1) {
        event.preventDefault();
        this.options[index].click();
      }
    }
  }

  customElements.define('currency-converter', CurrencyConverter);
})();
