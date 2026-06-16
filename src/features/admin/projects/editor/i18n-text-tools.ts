import type { PartialI18n } from '@/modules/project-detail-page';
import { sanitizeHtml } from '@/lib/sanitize-html';
import {
  getActiveLocale,
  registerI18nTool,
  type I18nToolInstance,
} from './locale-context';

type I18nTextToolOptions = {
  toolboxTitle: string;
  toolboxIcon: string;
  className?: string;
  placeholder?: string;
};

type ToolData = {
  i18n?: PartialI18n;
};

type ToolConfig = {
  data: ToolData;
  readOnly?: boolean;
};

export function createI18nTextTool({
  toolboxTitle,
  toolboxIcon,
  className = '',
  placeholder = '',
}: I18nTextToolOptions) {
  return class I18nTextTool implements I18nToolInstance {
    static get toolbox() {
      return { title: toolboxTitle, icon: toolboxIcon };
    }

    static get isReadOnlySupported() {
      return true;
    }

    private data: ToolData;
    private readOnly: boolean;
    private element: HTMLElement | null = null;
    private unregister: (() => void) | null = null;

    constructor({ data, readOnly }: ToolConfig) {
      this.data = { i18n: data?.i18n ?? {} };
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const el = document.createElement('div');
      el.contentEditable = this.readOnly ? 'false' : 'true';
      el.className = [
        'outline-none min-h-[1.5rem] leading-relaxed',
        className,
      ]
        .filter(Boolean)
        .join(' ');
      if (placeholder) el.dataset.placeholder = placeholder;
      el.innerHTML = sanitizeHtml(this.getCurrentText());

      if (!this.readOnly) {
        el.addEventListener('input', () => {
          const locale = getActiveLocale();
          this.data.i18n = {
            ...this.data.i18n,
            [locale]: sanitizeHtml(el.innerHTML),
          };
        });
      }

      this.element = el;
      this.unregister = registerI18nTool(this);
      return el;
    }

    updateLocale() {
      if (!this.element) return;
      this.element.innerHTML = sanitizeHtml(this.getCurrentText());
    }

    save() {
      return { i18n: this.data.i18n ?? {} };
    }

    destroy() {
      this.unregister?.();
      this.unregister = null;
      this.element = null;
    }

    private getCurrentText() {
      const locale = getActiveLocale();
      return this.data.i18n?.[locale] ?? '';
    }
  };
}

export function createI18nHeaderTool() {
  return class I18nHeaderTool implements I18nToolInstance {
    static get toolbox() {
      return { title: 'Heading', icon: 'H' };
    }

    static get isReadOnlySupported() {
      return true;
    }

    private data: { i18n?: PartialI18n; level?: number };
    private readOnly: boolean;
    private wrapper: HTMLElement | null = null;
    private input: HTMLElement | null = null;
    private levelSelect: HTMLSelectElement | null = null;
    private unregister: (() => void) | null = null;

    constructor({ data, readOnly }: ToolConfig & { data: ToolData & { level?: number } }) {
      this.data = {
        i18n: data?.i18n ?? {},
        level: data?.level ?? 2,
      };
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.className = 'space-y-2';

      const levelSelect = document.createElement('select');
      levelSelect.className =
        'rounded border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900';
      [1, 2, 3, 4, 5, 6].forEach((level) => {
        const option = document.createElement('option');
        option.value = String(level);
        option.textContent = `H${level}`;
        if (level === (this.data.level ?? 2)) option.selected = true;
        levelSelect.appendChild(option);
      });
      levelSelect.disabled = this.readOnly;
      levelSelect.addEventListener('change', () => {
        this.data.level = Number(levelSelect.value) || 2;
      });

      const input = document.createElement('div');
      input.contentEditable = this.readOnly ? 'false' : 'true';
      input.className =
        'min-h-[2rem] text-2xl font-black outline-none tracking-tight';
      input.innerHTML = sanitizeHtml(this.getCurrentText());
      if (!this.readOnly) {
        input.addEventListener('input', () => {
          const locale = getActiveLocale();
          this.data.i18n = {
            ...this.data.i18n,
            [locale]: sanitizeHtml(input.innerHTML),
          };
        });
      }

      wrapper.appendChild(levelSelect);
      wrapper.appendChild(input);
      this.wrapper = wrapper;
      this.input = input;
      this.levelSelect = levelSelect;
      this.unregister = registerI18nTool(this);
      return wrapper;
    }

    updateLocale() {
      if (this.input) this.input.innerHTML = sanitizeHtml(this.getCurrentText());
    }

    save() {
      return {
        i18n: this.data.i18n ?? {},
        level: this.data.level ?? 2,
      };
    }

    destroy() {
      this.unregister?.();
      this.unregister = null;
      this.wrapper = null;
      this.input = null;
      this.levelSelect = null;
    }

    private getCurrentText() {
      const locale = getActiveLocale();
      return this.data.i18n?.[locale] ?? '';
    }
  };
}
