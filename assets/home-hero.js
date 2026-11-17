/**
 * Homepage hero carousel.
 * Rotates slides when autoplay is on, with a visible pause control,
 * and pauses for hover, keyboard focus, hidden tabs and reduced-motion users.
 */
if (!customElements.get('home-hero')) {
  class HomeHero extends HTMLElement {
    connectedCallback() {
      this.slides = Array.from(this.querySelectorAll('[data-slide]'));
      this.dots = Array.from(this.querySelectorAll('[data-dot]'));
      this.toggle = this.querySelector('[data-autoplay-toggle]');
      this.track = this.querySelector('[data-track]');
      this.index = 0;
      this.pauseReasons = new Set();
      if (this.slides.length < 2) return;

      this.interval = Number(this.dataset.speed || 6) * 1000;
      this.autoplay = this.dataset.autoplay === 'true';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.pauseReasons.add('motion');
      if (!this.autoplay) this.pauseReasons.add('user');

      this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.go(i)));
      this.toggle?.addEventListener('click', () => this.onToggle());
      this.addEventListener('pointerenter', () => this.pause('hover'));
      this.addEventListener('pointerleave', () => this.resume('hover'));
      this.addEventListener('focusin', () => this.pause('focus'));
      this.addEventListener('focusout', (e) => { if (!this.contains(e.relatedTarget)) this.resume('focus'); });
      this.onVisibility = () => (document.hidden ? this.pause('hidden') : this.resume('hidden'));
      document.addEventListener('visibilitychange', this.onVisibility);
      this.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') this.go(this.index + 1);
        if (e.key === 'ArrowLeft') this.go(this.index - 1);
      });
      this.sync();
      this.schedule();
    }

    disconnectedCallback() {
      clearTimeout(this.timer);
      document.removeEventListener('visibilitychange', this.onVisibility);
    }

    go(i) {
      this.index = (i + this.slides.length) % this.slides.length;
      this.sync();
      this.schedule();
    }

    sync() {
      this.slides.forEach((slide, i) => {
        const active = i === this.index;
        slide.classList.toggle('is-active', active);
        slide.toggleAttribute('inert', !active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      this.dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === this.index)));
      if (this.track) this.track.setAttribute('aria-live', this.pauseReasons.size ? 'polite' : 'off');
    }

    schedule() {
      clearTimeout(this.timer);
      if (this.pauseReasons.size) return;
      this.timer = setTimeout(() => this.go(this.index + 1), this.interval);
    }

    pause(reason) { this.pauseReasons.add(reason); this.schedule(); this.sync(); }
    resume(reason) { this.pauseReasons.delete(reason); this.schedule(); this.sync(); }

    onToggle() {
      const paused = this.pauseReasons.has('user');
      if (paused) this.resume('user'); else this.pause('user');
      this.toggle.setAttribute('aria-pressed', String(!paused ? true : false));
      this.toggle.setAttribute('aria-label', paused ? this.toggle.dataset.pauseLabel : this.toggle.dataset.playLabel);
      this.toggle.classList.toggle('is-paused', !paused);
    }
  }
  customElements.define('home-hero', HomeHero);
}
