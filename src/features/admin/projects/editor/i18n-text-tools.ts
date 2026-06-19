import type { PartialI18n } from '@/modules/project-detail-page';
import { STORY_EDITOR_BODY_CLASS } from '@/constants/story-typography';
import {
  isAdminI18nFallback,
  resolveAdminI18nText,
} from '@/lib/project-detail-page/block-utils';
import { sanitizeHtml } from '@/lib/sanitize-html';
import {
  getActiveLocale,
  registerI18nTool,
  type I18nToolInstance,
} from './locale-context';
import { getHeaderLevelClass } from './editor-header-styles';
import { attachContentEditableTextPaste } from './editor-text-paste';

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
    private detachTextPaste: (() => void) | null = null;

    constructor({ data, readOnly }: ToolConfig) {
      this.data = { i18n: data?.i18n ?? {} };
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const el = document.createElement('div');
      el.contentEditable = this.readOnly ? 'false' : 'true';
      el.className = [
        'outline-none min-h-[1.5rem]',
        STORY_EDITOR_BODY_CLASS,
        className,
      ]
        .filter(Boolean)
        .join(' ');
      if (placeholder) el.dataset.placeholder = placeholder;
      this.applyDisplayText(el);

      if (!this.readOnly) {
        const syncToLocale = () => {
          const locale = getActiveLocale();
          this.data.i18n = {
            ...this.data.i18n,
            [locale]: sanitizeHtml(el.innerHTML),
          };
          el.classList.remove('text-zinc-400', 'italic');
          el.dataset.i18nFallback = 'false';
        };

        el.addEventListener('input', syncToLocale);
        this.detachTextPaste = attachContentEditableTextPaste(el, syncToLocale);
      }

      this.element = el;
      this.unregister = registerI18nTool(this);
      return el;
    }

    updateLocale() {
      if (!this.element) return;
      this.applyDisplayText(this.element);
    }

    syncActiveLocaleToData() {
      if (!this.element || this.readOnly) return;
      const locale = getActiveLocale();
      this.data.i18n = {
        ...this.data.i18n,
        [locale]: sanitizeHtml(this.element.innerHTML),
      };
    }

    save() {
      this.syncActiveLocaleToData();
      return { i18n: this.data.i18n ?? {} };
    }

    destroy() {
      this.detachTextPaste?.();
      this.detachTextPaste = null;
      this.unregister?.();
      this.unregister = null;
      this.element = null;
    }

    private applyDisplayText(el: HTMLElement) {
      const locale = getActiveLocale();
      const i18n = this.data.i18n;
      const text = resolveAdminI18nText(i18n, locale);
      const isFallback = isAdminI18nFallback(i18n, locale);

      el.innerHTML = sanitizeHtml(text);
      el.classList.toggle('text-zinc-400', isFallback);
      el.classList.toggle('italic', isFallback);
      el.dataset.i18nFallback = isFallback ? 'true' : 'false';
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
    private unregister: (() => void) | null = null;
    private detachTextPaste: (() => void) | null = null;

    constructor({ data, readOnly }: ToolConfig & { data: ToolData & { level?: number } }) {
      this.data = {
        i18n: data?.i18n ?? {},
        level: data?.level ?? 2,
      };
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const wrapper = document.createElement('div');
      const level = Math.min(Math.max(this.data.level ?? 2, 1), 6);

      const input = document.createElement('div');
      input.contentEditable = this.readOnly ? 'false' : 'true';
      input.dataset.headingLevel = String(level);
      input.className = [
        'outline-none min-h-[1.75rem] text-slate-900 dark:text-slate-100',
        getHeaderLevelClass(level),
      ].join(' ');
      this.applyDisplayText(input);
      if (!this.readOnly) {
        const syncToLocale = () => {
          const locale = getActiveLocale();
          this.data.i18n = {
            ...this.data.i18n,
            [locale]: sanitizeHtml(input.innerHTML),
          };
          input.classList.remove('text-zinc-400', 'italic');
          input.dataset.i18nFallback = 'false';
        };

        input.addEventListener('input', syncToLocale);
        this.detachTextPaste = attachContentEditableTextPaste(input, syncToLocale);
      }

      wrapper.appendChild(input);
      this.wrapper = wrapper;
      this.input = input;
      this.unregister = registerI18nTool(this);
      return wrapper;
    }

    updateLocale() {
      if (!this.input) return;
      const level = Math.min(Math.max(this.data.level ?? 2, 1), 6);
      this.input.dataset.headingLevel = String(level);
      this.input.className = [
        'outline-none min-h-[1.75rem] text-slate-900 dark:text-slate-100',
        getHeaderLevelClass(level),
      ].join(' ');
      this.applyDisplayText(this.input);
    }

    syncActiveLocaleToData() {
      if (!this.input || this.readOnly) return;
      const locale = getActiveLocale();
      this.data.i18n = {
        ...this.data.i18n,
        [locale]: sanitizeHtml(this.input.innerHTML),
      };
    }

    save() {
      this.syncActiveLocaleToData();
      return {
        i18n: this.data.i18n ?? {},
        level: this.data.level ?? 2,
      };
    }

    destroy() {
      this.detachTextPaste?.();
      this.detachTextPaste = null;
      this.unregister?.();
      this.unregister = null;
      this.wrapper = null;
      this.input = null;
    }

    private applyDisplayText(el: HTMLElement) {
      const locale = getActiveLocale();
      const i18n = this.data.i18n;
      const text = resolveAdminI18nText(i18n, locale);
      const isFallback = isAdminI18nFallback(i18n, locale);

      el.innerHTML = sanitizeHtml(text);
      el.classList.toggle('text-zinc-400', isFallback);
      el.classList.toggle('italic', isFallback);
      el.dataset.i18nFallback = isFallback ? 'true' : 'false';
    }
  };
}
