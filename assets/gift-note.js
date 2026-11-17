/**
 * Saves a gift note (max 40 characters) on a cart line without a page reload,
 * then refreshes the cart drawer or cart page so totals and lines stay in sync.
 */
if (!customElements.get('gift-note-field')) {
  class GiftNoteField extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('input');
      this.button = this.querySelector('.gift-note__save');
      this.count = this.querySelector('[data-count]');
      this.status = this.querySelector('[data-status]');
      this.input.addEventListener('input', () => { this.count.textContent = this.input.value.length; });
      this.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.save(); } });
      this.button.addEventListener('click', () => this.save());
    }

    async save() {
      const value = this.input.value.trim().slice(0, 40);
      const properties = JSON.parse(this.querySelector('[data-properties]').textContent || '{}') || {};
      if (value) properties['Gift note'] = value; else delete properties['Gift note'];
      this.button.disabled = true;
      this.setAttribute('aria-busy', 'true');
      try {
        const res = await fetch(`${window.routes.cart_change_url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ line: Number(this.dataset.line), quantity: Number(this.dataset.quantity), properties }),
        });
        if (!res.ok) throw new Error(String(res.status));
        this.announce(this.dataset.savedLabel);
        const host = this.closest('cart-drawer-items, cart-items');
        if (host && typeof host.onCartUpdate === 'function') await host.onCartUpdate();
      } catch (error) {
        this.announce(window.cartStrings?.error || 'Error');
      } finally {
        this.button.disabled = false;
        this.removeAttribute('aria-busy');
      }
    }

    announce(text) {
      this.status.textContent = '';
      requestAnimationFrame(() => { this.status.textContent = text; });
    }
  }
  customElements.define('gift-note-field', GiftNoteField);
}
