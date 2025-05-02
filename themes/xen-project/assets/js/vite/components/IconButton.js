import { LitElement, html, css } from 'lit';

export class IconButton extends LitElement {
  static properties = {
    href: { type: String },
    target: { type: String },
  };

  // Allow UnoCSS to inject styles using shadow DOM
  static styles = css`
    @unocss-placeholder
  `;

  constructor() {
    super();
    this.href = '';
    this.target = '_blank';
  }

  render() {
    return html`
      <a
        href="${this.href}"
        target="${this.target}"
        rel="noopener noreferrer"
        class="uno-py-3 uno-rounded-lg uno-bg-action uno-text-white uno-text-xl uno-px-7 uno-font-light uno-border-none uno-decoration-none hover:uno-bg-action-hover uno-transition-all uno-duration-300 uno-flex uno-flex-row uno-flex-wrap uno-items-center uno-gap-x-4 uno-ease-in-out uno-parent active:uno-bg-action-active hover:uno-decoration-none uno-cursor-pointer uno-outline-offset-4 focus:uno-outline-action uno-outline-4"
      >
        <slot></slot>
        <div class="i-fa6-solid-arrow-up-right-from-square uno-transition-transform parent-hover:uno-translate-x-[0.3em] uno-duration-300 uno-ease-in-out uno-text-lg"></div>
      </a>
    `;
  }
}

customElements.define('icon-button', IconButton);