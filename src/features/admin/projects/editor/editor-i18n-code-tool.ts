import { STORY_CODE_BLOCK_CLASS } from '@/constants/story-typography';
import { registerI18nTool, type I18nToolInstance } from './locale-context';

function readCodeFromData(data: Record<string, unknown> | undefined): string {
  if (typeof data?.code === 'string') return data.code;
  const i18n = data?.i18n;
  if (i18n && typeof i18n === 'object' && 'ko' in i18n) {
    return String((i18n as { ko?: string }).ko ?? '');
  }
  return '';
}

export function createI18nCodeTool() {
  return class I18nCodeTool implements I18nToolInstance {
    static get toolbox() {
      return {
        title: 'Code',
        icon: '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 3.5L1 7l3.5 3.5M9.5 3.5L13 7l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      };
    }

    static get isReadOnlySupported() {
      return true;
    }

    static get enableLineBreaks() {
      return true;
    }

    private code = '';
    private readOnly: boolean;
    private textarea: HTMLTextAreaElement | null = null;
    private unregister: (() => void) | null = null;

    constructor({
      data,
      readOnly,
    }: {
      data?: Record<string, unknown>;
      readOnly?: boolean;
    }) {
      this.code = readCodeFromData(data);
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const textarea = document.createElement('textarea');
      textarea.className = `${STORY_CODE_BLOCK_CLASS} min-h-[200px] w-full resize-y font-mono text-sm`;
      textarea.spellcheck = false;
      textarea.readOnly = this.readOnly;
      textarea.dataset.placeholder = 'Enter code or mermaid diagram…';
      textarea.value = this.code;

      if (!this.readOnly) {
        textarea.addEventListener('input', () => {
          this.code = textarea.value;
        });
      }

      this.textarea = textarea;
      this.unregister = registerI18nTool(this);
      return textarea;
    }

    updateLocale() {
      if (!this.textarea) return;
      this.textarea.value = this.code;
    }

    syncActiveLocaleToData() {
      if (!this.textarea || this.readOnly) return;
      this.code = this.textarea.value;
    }

    save() {
      this.syncActiveLocaleToData();
      return { code: this.code };
    }

    destroy() {
      this.unregister?.();
      this.textarea = null;
    }
  };
}
