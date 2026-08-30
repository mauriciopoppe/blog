/* ==========================================================================
 * UX Interaction Principles - live examples
 *
 * Self-contained module that renders the demo controls for the UX principles
 * note (/notes/ux-interaction-principles/). Uses only theme CSS custom
 * properties and the title/content font convention, so every example adapts
 * to light and dark themes.
 * ========================================================================== */

const DEMO_CSS = `
  .ux-demo { display: grid; gap: 16px; font-family: var(--family-serif, system-ui, serif); }
  .ux-demo-pair { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
  .ux-card { border-radius: 10px; overflow: hidden; }
  .ux-card-header { font-family: var(--family-sans, system-ui, sans-serif); font-size: 0.72rem; font-weight: 600; padding: 10px 14px; border-bottom: 1px solid var(--ring-border); }
  .ux-card-body { padding: 12px 14px 14px; font-size: 0.85rem; line-height: 1.5; }
  /* Passive surface: flat, subtle border, no elevation, default cursor */
  .ux-passive { background: var(--grey-dark); border: 1px solid var(--ring-border); cursor: default; }
  .ux-passive .ux-card-header { color: var(--grey-light); }
  .ux-passive .ux-card-body { color: var(--grey-light); }
  /* Interactive surface: primary-tinted border, layered elevation, top highlight, pointer, chevron */
  .ux-interactive { background: var(--grey-dark); border: 1px solid var(--ring-border); cursor: pointer; box-shadow: var(--elevation-raised); }
  .ux-interactive .ux-card-header { color: var(--grey-light); display: flex; justify-content: space-between; align-items: center; }
  .ux-interactive .ux-card-body { color: var(--grey-lighter); }
  .ux-interactive:hover { border-color: var(--accent-border); background: var(--accent-tint); box-shadow: var(--elevation-deep); }
  /* Active / current card: solid primary border, primary-tinted background */
  .ux-card.ux-active { background: rgba(var(--primary), 0.16); border: 1px solid rgb(var(--primary)); box-shadow: var(--elevation-raised); }
  .ux-card.ux-active .ux-card-header { color: rgb(var(--primary)); display: flex; justify-content: space-between; align-items: center; }
  .ux-card.ux-active .ux-card-body { color: var(--grey-lighter); }
  .ux-chevron { font-weight: 700; }
  /* Design tokens swatches */
  @media (min-width: 860px) {
    #ux-demo-tokens {
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--grey-darker);
      padding: 10px 0;
      border-bottom: 1px solid var(--ring-border);
    }
  }
  .ux-swatches { display: flex; flex-wrap: wrap; gap: 6px; }
  .ux-tokens-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ux-swatches { flex: 1 1 auto; }
  .ux-swatch { display: flex; align-items: center; gap: 6px; flex: 1 1 auto; white-space: nowrap; background: var(--grey-dark); border: 1px solid var(--ring-border); border-radius: 7px; padding: 5px 8px; font-family: var(--family-sans, system-ui, sans-serif); font-size: 0.62rem; color: var(--grey-lighter); }
  .ux-swatch-swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--ring-border); flex-shrink: 0; }
  .ux-theme-toggle { flex-shrink: 0; appearance: none; -webkit-appearance: none; font-family: var(--family-serif, system-ui, serif); font-size: 0.72rem; font-weight: 600; line-height: 1; padding: 6px 12px; border-radius: 6px; background: var(--grey-dark); border: 1px solid var(--ring-border); color: var(--grey-light); cursor: pointer; box-shadow: var(--elevation-subtle); }
  .ux-theme-toggle:hover { color: rgb(var(--primary)); border-color: var(--accent-border); background: var(--accent-tint); box-shadow: var(--elevation-raised); filter: none; }
  .ux-theme-toggle:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; }
  @media (min-width: 860px) {
    .ux-swatches { flex-wrap: nowrap; }
    .ux-swatch { flex: 1 1 0; min-width: 0; }
  }
  /* Typography: sans title over serif content */
  .ux-typo { display: grid; gap: 6px; background: var(--grey-dark); border: 1px solid var(--ring-border); border-radius: 10px; padding: 14px 16px; }
  .ux-typo-title { font-family: var(--family-sans, system-ui, sans-serif); font-size: 1.05rem; font-weight: 700; color: var(--grey-lighter); }
  .ux-typo-body { font-family: var(--family-serif, system-ui, serif); font-size: 0.9rem; line-height: 1.6; color: var(--grey-light); }
  /* Four interaction states */
  .ux-states { display: flex; flex-wrap: wrap; gap: 10px; }
  .ux-btn { font-family: var(--family-serif, system-ui, serif); font-size: 0.85rem; font-weight: 600; padding: 6px 12px; border-radius: 6px; background: var(--grey-dark); border: 1px solid var(--ring-border); color: var(--grey-light); cursor: pointer; box-shadow: var(--elevation-subtle); }
  .ux-btn:hover { color: rgb(var(--primary)); border-color: var(--accent-border); background: var(--accent-tint); box-shadow: var(--elevation-raised); filter: none; }
  .ux-btn.ux-hover { color: rgb(var(--primary)); border-color: var(--accent-border); background: var(--accent-tint); box-shadow: var(--elevation-raised); filter: none; }
  .ux-btn.ux-focus { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; }
  .ux-btn.ux-active { background: rgba(var(--primary), 0.16); color: rgb(var(--primary)); border-color: var(--accent-border); box-shadow: var(--elevation-subtle); transform: translateY(1px); }
  .ux-btn:disabled, .ux-btn:disabled:hover { opacity: 0.45; cursor: not-allowed; box-shadow: none; filter: none; transform: none; color: var(--grey-light); border-color: var(--ring-border); }
  /* Tags and pills */
  .ux-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .ux-tag-pill { display: inline-block; padding: 4px 12px; border-radius: 999px; font-family: var(--family-serif, system-ui, serif); font-size: 0.72rem; font-weight: 600; }
  .ux-tag-neutral { background: var(--grey-dark); border: 1px solid var(--ring-border); color: var(--grey-light); cursor: default; }
  .ux-tag-primary { background: var(--grey-dark); border: 1px solid var(--ring-border); color: var(--grey-light); cursor: pointer; box-shadow: var(--elevation-subtle); }
  .ux-tag-hover { color: rgb(var(--primary)); border-color: var(--accent-border); background: var(--accent-tint); box-shadow: var(--elevation-raised); }
  .ux-tag-pill:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; }
  .ux-tag-active { background: rgba(var(--primary), 0.16); color: rgb(var(--primary)); border-color: var(--accent-border); box-shadow: var(--elevation-subtle); }
  /* Single-select (radio / segmented) */
  .ux-radio-group { display: inline-flex; border: 1px solid var(--ring-border); border-radius: 6px; background: var(--grey-dark); box-shadow: var(--elevation-subtle); overflow: hidden; }
  .ux-radio-option { appearance: none; font-family: var(--family-serif, system-ui, serif); font-size: 0.8rem; font-weight: 600; padding: 6px 12px; background: transparent; color: var(--grey-light); cursor: pointer; }
  .ux-radio-option:hover { color: rgb(var(--primary)); background: var(--accent-tint); filter: none; }
  .ux-radio-option:focus-visible { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: -2px; }
  .ux-radio-option.is-selected { background: rgba(var(--primary), 0.16); color: rgb(var(--primary)); }
  /* Links */
  .ux-links { display: flex; flex-direction: column; gap: 10px; font-family: var(--family-serif, system-ui, serif); font-size: 0.9rem; }
  .ux-link { color: rgb(var(--primary)); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .ux-link.ux-link-hover { filter: drop-shadow(var(--link-glow)); }
  .ux-link.ux-link-focus { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; }
  /* Accessibility: visible focus ring */
  .ux-focus-demo { display: flex; gap: 12px; flex-wrap: wrap; }
  /* Range slider */
  .ux-range-stack { display: grid; gap: 12px; max-width: 360px; }
  .ux-range-item { display: grid; grid-template-columns: 76px 1fr; gap: 10px; align-items: center; }
  .ux-range-label { font-family: var(--family-sans, system-ui, sans-serif); font-size: 0.7rem; color: var(--grey-light); }
  .ux-range { -webkit-appearance: none; appearance: none; width: 100%; height: 22px; background: transparent; cursor: pointer; --range-fill: 50%; }
  .ux-range::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%); }
  .ux-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); margin-top: -5px; box-shadow: var(--elevation-subtle); }
  .ux-range::-moz-range-track { height: 6px; border-radius: 999px; background: var(--ring-border); }
  .ux-range::-moz-range-progress { height: 6px; border-radius: 999px; background: rgb(var(--primary)); }
  .ux-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: rgb(var(--primary)); border: 2px solid var(--grey); box-shadow: var(--elevation-subtle); }
  .ux-range:hover::-webkit-slider-thumb, .ux-range.ux-range-hover::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
  .ux-range:hover::-moz-range-thumb, .ux-range.ux-range-hover::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(var(--primary), 0.15); }
  .ux-range:focus-visible, .ux-range.ux-range-focus { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; border-radius: 999px; }
  .ux-range:disabled, .ux-range:disabled:hover { opacity: 0.45; cursor: not-allowed; }
  /* Text input */
  .ux-input-stack { display: grid; gap: 12px; max-width: 360px; }
  .ux-input-item { display: grid; grid-template-columns: 96px 1fr; gap: 10px; align-items: center; }
  .ux-input-label { font-family: var(--family-sans, system-ui, sans-serif); font-size: 0.7rem; color: var(--grey-light); }
  .ux-input { font-family: var(--family-serif, system-ui, serif); font-size: 0.85rem; line-height: 1.25; padding: 6px 12px; border-radius: 6px; background: var(--grey-dark); border: 1px solid var(--ring-border); color: var(--grey-light); box-shadow: var(--elevation-subtle); width: 100%; }
  .ux-input::placeholder { color: var(--grey-light); opacity: 0.6; }
  .ux-input:hover, .ux-input.ux-input-hover { border-color: var(--accent-border); }
  .ux-input:focus-visible, .ux-input.ux-input-focus { outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px; border-color: var(--accent-border); }
  .ux-input:disabled, .ux-input:disabled:hover { opacity: 0.45; cursor: not-allowed; }
`;

function injectStyle() {
  if (document.getElementById('ux-demo-style')) return;
  const style = document.createElement('style');
  style.id = 'ux-demo-style';
  style.textContent = DEMO_CSS;
  document.head.appendChild(style);
}

function mount(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

export function initUxDemo() {
  injectStyle();

  mount(
    'ux-demo-tokens',
    `
      <div class="ux-demo">
        <div class="ux-tokens-row">
          <div class="ux-swatches">
            <div class="ux-swatch"><span class="ux-swatch-swatch" style="background: var(--grey-darker)"></span>--grey-darker</div>
            <div class="ux-swatch"><span class="ux-swatch-swatch" style="background: var(--grey-dark)"></span>--grey-dark</div>
            <div class="ux-swatch"><span class="ux-swatch-swatch" style="background: var(--grey)"></span>--grey</div>
            <div class="ux-swatch"><span class="ux-swatch-swatch" style="background: var(--grey-light)"></span>--grey-light</div>
            <div class="ux-swatch"><span class="ux-swatch-swatch" style="background: var(--grey-lighter)"></span>--grey-lighter</div>
            <div class="ux-swatch"><span class="ux-swatch-swatch" style="background: rgb(var(--primary))"></span>--primary</div>
          </div>
          <button class="ux-theme-toggle" id="ux-theme-toggle" type="button">&#9728;&#65039; Light</button>
        </div>
      </div>
    `
  );

  const themeToggle = document.getElementById('ux-theme-toggle');
  if (themeToggle) {
    const setToggleLabel = () => {
      const isLight = document.documentElement.dataset.theme === 'light';
      themeToggle.textContent = isLight ? '\uD83C\uDF19 Dark' : '\u2600\uFE0F Light';
    };
    setToggleLabel();
    themeToggle.addEventListener('click', () => {
      document.documentElement.dataset.theme =
        document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      setToggleLabel();
    });
  }

  mount(
    'ux-demo-typography',
    `
      <div class="ux-demo">
        <div class="ux-typo">
          <div class="ux-typo-title">Section title (sans)</div>
          <div class="ux-typo-body">Body copy, labels, and descriptions use the serif family to match the article reading font. This is the content font.</div>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-surfaces',
    `
      <div class="ux-demo">
        <div class="ux-demo-pair">
          <div class="ux-card ux-passive">
            <div class="ux-card-header">Passive</div>
            <div class="ux-card-body">A static panel or metric readout. Flat, subtle border, default cursor, no elevation.</div>
          </div>
          <div class="ux-card ux-interactive">
            <div class="ux-card-header"><span>Clickable</span><span class="ux-chevron">&#8594;</span></div>
            <div class="ux-card-body">A card you can interact with. Primary-tinted border, raised with a top highlight, pointer cursor, chevron.</div>
          </div>
          <div class="ux-card ux-active">
            <div class="ux-card-header"><span>Active</span><span class="ux-chevron">&#8594;</span></div>
            <div class="ux-card-body">The current page or selected item. Solid primary border and primary-tinted background.</div>
          </div>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-states',
    `
      <div class="ux-demo">
        <div class="ux-states">
          <button class="ux-btn" type="button">Default</button>
          <button class="ux-btn ux-hover" type="button">Hover</button>
          <button class="ux-btn ux-focus" type="button">Focus</button>
          <button class="ux-btn ux-active" type="button">Active</button>
          <button class="ux-btn" type="button" disabled>Disabled</button>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-tags',
    `
      <div class="ux-demo">
        <div class="ux-tags">
          <span class="ux-tag-pill ux-tag-neutral">Neutral</span>
          <span class="ux-tag-pill ux-tag-primary">Selectable</span>
          <span class="ux-tag-pill ux-tag-primary ux-tag-hover">Hover</span>
          <span class="ux-tag-pill ux-tag-active">Active</span>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-radio',
    `
      <div class="ux-demo">
        <div class="ux-radio-group" role="radiogroup" aria-label="Single-select example">
          <button class="ux-radio-option is-selected" type="button" role="radio" aria-checked="true">Option A</button>
          <button class="ux-radio-option" type="button" role="radio" aria-checked="false">Option B</button>
          <button class="ux-radio-option" type="button" role="radio" aria-checked="false">Option C</button>
        </div>
      </div>
    `
  );

  const radioGroup = document.querySelector('.ux-radio-group');
  if (radioGroup) {
    radioGroup.addEventListener('click', (event) => {
      const option = event.target.closest('.ux-radio-option');
      if (!option) return;
      radioGroup.querySelectorAll('.ux-radio-option').forEach((o) => {
        o.classList.remove('is-selected');
        o.setAttribute('aria-checked', 'false');
      });
      option.classList.add('is-selected');
      option.setAttribute('aria-checked', 'true');
    });
  }

  mount(
    'ux-demo-links',
    `
      <div class="ux-demo">
        <div class="ux-links">
          <a class="ux-link" href="#">Default link</a>
          <a class="ux-link ux-link-hover" href="#">Hover</a>
          <a class="ux-link ux-link-focus" href="#">Focus</a>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-accessibility',
    `
      <div class="ux-demo">
        <div class="ux-focus-demo">
          <button class="ux-btn ux-focus" type="button">Visible focus ring</button>
          <button class="ux-btn" type="button">Default</button>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-slider',
    `
      <div class="ux-demo">
        <div class="ux-range-stack">
          <div class="ux-range-item"><span class="ux-range-label">Default</span><input class="ux-range" type="range" min="0" max="100" value="50" style="--range-fill: 50%" aria-label="Default slider"></div>
          <div class="ux-range-item"><span class="ux-range-label">Hover</span><input class="ux-range ux-range-hover" type="range" min="0" max="100" value="50" style="--range-fill: 50%" aria-label="Hover slider"></div>
          <div class="ux-range-item"><span class="ux-range-label">Focus</span><input class="ux-range ux-range-focus" type="range" min="0" max="100" value="50" style="--range-fill: 50%" aria-label="Focus slider"></div>
          <div class="ux-range-item"><span class="ux-range-label">Active</span><input class="ux-range ux-range-active" type="range" min="0" max="100" value="75" style="--range-fill: 75%" aria-label="Active slider"></div>
          <div class="ux-range-item"><span class="ux-range-label">Disabled</span><input class="ux-range" type="range" min="0" max="100" value="50" style="--range-fill: 50%" disabled aria-label="Disabled slider"></div>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-input',
    `
      <div class="ux-demo">
        <div class="ux-input-stack">
          <div class="ux-input-item"><label class="ux-input-label" for="ux-input-default">Default</label><input class="ux-input" id="ux-input-default" type="text" aria-label="Default input"></div>
          <div class="ux-input-item"><label class="ux-input-label" for="ux-input-placeholder">Placeholder</label><input class="ux-input" id="ux-input-placeholder" type="text" placeholder="e.g. quaternion slerp" aria-label="Placeholder input"></div>
          <div class="ux-input-item"><label class="ux-input-label" for="ux-input-filled">Filled</label><input class="ux-input" id="ux-input-filled" type="text" value="mauriciopoppe" aria-label="Filled input"></div>
          <div class="ux-input-item"><label class="ux-input-label" for="ux-input-hover">Hover</label><input class="ux-input ux-input-hover" id="ux-input-hover" type="text" value="hover state" aria-label="Hover input"></div>
          <div class="ux-input-item"><label class="ux-input-label" for="ux-input-focus">Focus</label><input class="ux-input ux-input-focus" id="ux-input-focus" type="text" value="focus state" aria-label="Focus input"></div>
          <div class="ux-input-item"><label class="ux-input-label" for="ux-input-disabled">Disabled</label><input class="ux-input" id="ux-input-disabled" type="text" value="disabled" disabled aria-label="Disabled input"></div>
        </div>
      </div>
    `
  );

  mount(
    'ux-demo-widget-frame',
    `
      <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
        <header class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
          <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary">Sample widget frame</div>
          <div class="tw-text-sm tw-text-[var(--grey-light)]">Optional descriptor</div>
        </header>
        <div class="tw-p-2.5">
          <div class="tw-font-serif tw-text-[0.85rem] tw-leading-relaxed tw-text-[var(--grey-light)] tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-3 tw-py-2">The body is a slot. Any content, controls, or diagrams go here.</div>
        </div>
      </div>
    `
  );

  const PRESET_BASE = 'tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-leading-none tw-px-[8px] tw-py-[5px] tw-cursor-pointer';
  const PRESET_INACTIVE = PRESET_BASE + ' tw-bg-transparent tw-text-[var(--grey-light)]';
  const PRESET_ACTIVE = PRESET_BASE + ' tw-bg-primary-soft tw-text-primary';
  const MODE_BASE = 'tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-leading-none tw-px-[8px] tw-py-[5px] tw-cursor-pointer';
  const MODE_INACTIVE = MODE_BASE + ' tw-bg-transparent tw-text-[var(--grey-light)]';
  const MODE_ACTIVE = MODE_BASE + ' tw-bg-primary-soft tw-text-primary';
  const CTRL = 'tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-[8px] tw-py-[5px] tw-rounded-[5px] tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-text-[var(--grey-light)] tw-cursor-pointer tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-bg-primary-soft hover:tw-text-primary hover:tw-shadow-raised hover:tw-filter-none';
  const CTRL_ACTIVE = 'tw-flex-1 tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-[8px] tw-py-[5px] tw-rounded-[5px] tw-border tw-border-[var(--accent-border)] tw-bg-primary-soft tw-text-primary tw-cursor-pointer tw-shadow-subtle';

  mount(
    'ux-demo-layout',
    `
      <div class="ux-demo">
        <div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
          <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
            <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary">Quaternion SLERP vs Euler LERP Flight Simulator</div>
            <div class="tw-text-sm tw-text-[var(--grey-light)]">3D Geodesic vs Decoupled Interpolation</div>
          </div>
          <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 max-[860px]:tw-grid-cols-1">
            <form class="tw-flex tw-flex-col tw-gap-3">
              <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]" for="widget-name">Simulation name</label>
                <input class="ux-input" id="widget-name" type="text" placeholder="e.g. quaternion slerp" aria-label="Simulation name">
              </div>
              <div class="tw-flex tw-flex-col tw-gap-1">
                <span class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]">Interpolation</span>
                <div class="tw-flex tw-w-full tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden">
                  <button type="button" class="js-mode ${MODE_ACTIVE}">Quaternion SLERP</button>
                  <button type="button" class="js-mode ${MODE_INACTIVE}">Euler Angle LERP</button>
                </div>
              </div>
              <div class="tw-flex tw-flex-col tw-gap-1">
                <span class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]">Preset</span>
                <div class="tw-flex tw-w-full tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden">
                  <button type="button" class="js-preset ${PRESET_ACTIVE}">Gimbal 90°</button>
                  <button type="button" class="js-preset ${PRESET_INACTIVE}">Aerobatic Flip</button>
                  <button type="button" class="js-preset ${PRESET_INACTIVE}">Banked Turn</button>
                </div>
              </div>
              <div class="tw-flex tw-flex-col tw-gap-1">
                <div class="tw-flex tw-items-center tw-justify-between">
                  <label class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]" for="widget-t">Progress</label>
                  <span class="tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-text-primary" id="widget-t-value">t = 0.00</span>
                </div>
                <input type="range" class="ux-range" id="widget-t" min="0" max="1" step="0.01" value="0" style="--range-fill: 0%">
              </div>
              <div class="tw-flex tw-gap-[6px]">
                <button class="${CTRL}" type="button">&#8249; Step back</button>
                <button class="${CTRL_ACTIVE}" type="button">&#9654; Play Flight</button>
                <button class="${CTRL}" type="button">Step forward &#8250;</button>
              </div>
              <button class="ux-btn tw-w-full" type="button">&#9654; Launch simulation</button>
              <div class="tw-font-serif tw-text-[0.85rem] tw-leading-relaxed tw-text-[var(--grey-light)] tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-3 tw-py-2">The preset description and current mode.</div>
            </form>
            <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden">
              <div class="tw-absolute tw-top-2 tw-left-2 tw-flex tw-items-center tw-gap-1.5 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-px-2.5 tw-py-1.5 tw-font-sans tw-text-[11px] tw-text-[var(--grey-light)]">
                <span class="tw-font-semibold tw-text-primary" id="canvas-mode-label">SLERP</span>
                <span class="tw-text-[var(--grey)]">/</span>
                <span id="canvas-t-value">t = 0.00</span>
              </div>
              <div class="tw-absolute tw-bottom-2 tw-left-2 tw-flex tw-items-center tw-gap-3 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-px-2.5 tw-py-1.5 tw-font-sans tw-text-[11px] tw-text-[var(--grey-light)]">
                <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-h-2 tw-w-2 tw-rounded-full" style="background: rgb(var(--primary))"></span>Body</span>
                <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-h-2 tw-w-2 tw-rounded-full" style="background: var(--grey-light)"></span>Path</span>
                <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-h-2 tw-w-2 tw-rounded-full" style="background: var(--grey)"></span>Axis</span>
              </div>
              <div class="tw-absolute tw-bottom-2 tw-right-2 tw-flex tw-h-16 tw-w-24 tw-items-center tw-justify-center tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-font-sans tw-text-[10px] tw-text-[var(--grey-light)]">Minimap</div>
            </div>
          </div>
        </div>
      </div>
    `
  );

  const widget = document.getElementById('ux-demo-layout');
  if (widget) {
    widget.querySelectorAll('.js-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        widget.querySelectorAll('.js-preset').forEach((b) => {
          b.className = 'js-preset ' + (b === btn ? PRESET_ACTIVE : PRESET_INACTIVE);
        });
      });
    });
    widget.querySelectorAll('.js-mode').forEach((btn) => {
      btn.addEventListener('click', () => {
        widget.querySelectorAll('.js-mode').forEach((b) => {
          b.className = 'js-mode ' + (b === btn ? MODE_ACTIVE : MODE_INACTIVE);
        });
        const modeLabel = widget.querySelector('#canvas-mode-label');
        if (modeLabel) modeLabel.textContent = btn.textContent;
      });
    });
    const slider = widget.querySelector('input[type="range"]');
    const tValue = widget.querySelector('#widget-t-value');
    const canvasT = widget.querySelector('#canvas-t-value');
    if (slider) {
      const syncFill = () => {
        const pct = (Number(slider.value) / (Number(slider.max) - Number(slider.min))) * 100;
        slider.style.setProperty('--range-fill', pct + '%');
        if (tValue) tValue.textContent = 't = ' + Number(slider.value).toFixed(2);
        if (canvasT) canvasT.textContent = 't = ' + Number(slider.value).toFixed(2);
      };
      syncFill();
      slider.addEventListener('input', syncFill);
    }
  }
}

if (typeof window !== 'undefined') {
  initUxDemo();
}
