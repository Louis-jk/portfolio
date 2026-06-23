import type { PartialI18n } from '@/modules/project-detail-page';
import { STORY_EDITOR_BODY_CLASS } from '@/constants/story-typography';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { normalizeParagraphHtml } from '@/lib/project-detail-page/paragraph-html';
import { getLeafContentEditable } from './editor-html-persistence';
import { registerI18nTool, type I18nToolInstance } from './locale-context';
import { getHeaderLevelClass } from './editor-header-styles';
import { attachContentEditableTextPaste } from './editor-text-paste';

type I18nTextToolOptions = {
  toolboxTitle: string;
  toolboxIcon: string;
  className?: string;
  placeholder?: string;
};

type ToolConfig = {
  data: Record<string, unknown>;
  readOnly?: boolean;
};

function readHtmlFromData(data: Record<string, unknown> | undefined): string {
  if (typeof data?.html === 'string') return data.html;
  const i18n = data?.i18n;
  if (i18n && typeof i18n === 'object' && 'ko' in i18n) {
    return String((i18n as PartialI18n).ko ?? '');
  }
  return '';
}

function readHtmlFromRoot(root: HTMLElement): string {
  const editable = getLeafContentEditable(root) ?? root;
  return normalizeParagraphHtml(sanitizeHtml(editable.innerHTML));
}

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

    private html = '';
    private readOnly: boolean;
    private element: HTMLElement | null = null;
    private unregister: (() => void) | null = null;
    private detachTextPaste: (() => void) | null = null;

    constructor({ data, readOnly }: ToolConfig) {
      this.html = readHtmlFromData(data);
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
      el.innerHTML = sanitizeHtml(this.html);

      if (!this.readOnly) {
        const syncHtml = () => {
          if (!this.element) return;
          this.html = readHtmlFromRoot(this.element);
        };
        el.addEventListener('input', syncHtml);
        this.detachTextPaste = attachContentEditableTextPaste(el, syncHtml);
      }

      this.element = el;
      this.unregister = registerI18nTool(this);
      return el;
    }

    updateLocale() {
      if (!this.element) return;
      this.element.innerHTML = sanitizeHtml(this.html);
    }

    syncActiveLocaleToData() {
      if (!this.element || this.readOnly) return;
      this.html = readHtmlFromRoot(this.element);
    }

    save() {
      this.syncActiveLocaleToData();
      return { html: this.html };
    }

    destroy() {
      this.detachTextPaste?.();
      this.detachTextPaste = null;
      this.unregister?.();
      this.unregister = null;
      this.element = null;
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

    private html = '';
    private level = 2;
    private readOnly: boolean;
    private wrapper: HTMLElement | null = null;
    private input: HTMLElement | null = null;
    private unregister: (() => void) | null = null;
    private detachTextPaste: (() => void) | null = null;

    constructor({ data, readOnly }: ToolConfig) {
      this.html = readHtmlFromData(data);
      this.level = Math.min(Math.max(Number(data?.level) || 2, 1), 6);
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const wrapper = document.createElement('div');
      const input = document.createElement('div');
      input.contentEditable = this.readOnly ? 'false' : 'true';
      input.dataset.headingLevel = String(this.level);
      input.className = [
        'outline-none min-h-[1.75rem] text-slate-900 dark:text-slate-100',
        getHeaderLevelClass(this.level),
      ].join(' ');
      input.innerHTML = sanitizeHtml(this.html);

      if (!this.readOnly) {
        const syncHtml = () => {
          if (!this.wrapper) return;
          this.html = sanitizeHtml(
            (getLeafContentEditable(this.wrapper) ?? input).innerHTML,
          );
        };
        input.addEventListener('input', syncHtml);
        this.detachTextPaste = attachContentEditableTextPaste(input, syncHtml);
      }

      wrapper.appendChild(input);
      this.wrapper = wrapper;
      this.input = input;
      this.unregister = registerI18nTool(this);
      return wrapper;
    }

    updateLocale() {
      if (!this.input) return;
      this.input.dataset.headingLevel = String(this.level);
      this.input.className = [
        'outline-none min-h-[1.75rem] text-slate-900 dark:text-slate-100',
        getHeaderLevelClass(this.level),
      ].join(' ');
      this.input.innerHTML = sanitizeHtml(this.html);
    }

    syncActiveLocaleToData() {
      if (!this.input || this.readOnly) return;
      const editable =
        (this.wrapper && getLeafContentEditable(this.wrapper)) ?? this.input;
      this.html = sanitizeHtml(editable.innerHTML);
    }

    save() {
      this.syncActiveLocaleToData();
      return { html: this.html, level: this.level };
    }

    destroy() {
      this.detachTextPaste?.();
      this.detachTextPaste = null;
      this.unregister?.();
      this.unregister = null;
      this.wrapper = null;
      this.input = null;
    }
  };
}
