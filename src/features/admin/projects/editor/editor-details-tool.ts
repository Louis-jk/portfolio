import type { BlockTool } from '@editorjs/editorjs';
import type { PartialI18n } from '@/modules/project-detail-page';
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
import { attachContentEditableTextPaste } from './editor-text-paste';

type DetailsData = {
  i18n?: PartialI18n;
  defaultOpen?: boolean;
};

const CHEVRON_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function createEditorDetailsTool() {
  return class EditorDetailsTool implements BlockTool, I18nToolInstance {
    static get toolbox() {
      return {
        title: '접기',
        icon: CHEVRON_ICON,
      };
    }

    static get isReadOnlySupported() {
      return true;
    }

    private data: DetailsData;
    private readOnly: boolean;
    private summaryEl: HTMLElement | null = null;
    private defaultOpenInput: HTMLInputElement | null = null;
    private unregister: (() => void) | null = null;
    private detachTextPaste: (() => void) | null = null;

    constructor({
      data,
      readOnly,
    }: {
      data: DetailsData;
      readOnly?: boolean;
    }) {
      this.data = {
        i18n: data?.i18n ?? {},
        defaultOpen: Boolean(data?.defaultOpen),
      };
      this.readOnly = Boolean(readOnly);
    }

    render() {
      const wrapper = document.createElement('div');
      wrapper.className =
        'story-details-admin rounded-xl border border-purple-200 bg-purple-50/60 p-4 dark:border-purple-500/30 dark:bg-purple-950/20';

      const hint = document.createElement('p');
      hint.className =
        'mb-3 text-xs font-medium text-purple-700 dark:text-purple-300';
      hint.textContent =
        '▶ 1) 제목 입력 → 2) 바로 아래에 코드·이미지 등 추가 → 3) 「접기 끝」 블록으로 닫기';

      const summary = document.createElement('div');
      summary.contentEditable = this.readOnly ? 'false' : 'true';
      summary.dataset.placeholder = '접기 제목 (예: 상세 아키텍처 및 데이터 흐름 다이어그램 보기)';
      summary.className =
        'min-h-[1.75rem] rounded-lg border border-purple-200 bg-white px-3 py-2 text-base leading-snug text-slate-800 outline-none dark:border-purple-500/30 dark:bg-zinc-950 dark:text-slate-100';
      this.applyDisplayText(summary);

      if (!this.readOnly) {
        const syncToLocale = () => {
          const locale = getActiveLocale();
          this.data.i18n = {
            ...this.data.i18n,
            [locale]: sanitizeHtml(summary.innerHTML),
          };
          summary.classList.remove('text-zinc-400', 'italic');
          summary.dataset.i18nFallback = 'false';
        };

        summary.addEventListener('input', syncToLocale);
        this.detachTextPaste = attachContentEditableTextPaste(summary, syncToLocale);
      }

      const options = document.createElement('label');
      options.className =
        'mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(this.data.defaultOpen);
      checkbox.disabled = this.readOnly;
      checkbox.addEventListener('change', () => {
        this.data.defaultOpen = checkbox.checked;
      });
      options.appendChild(checkbox);
      options.append('처음부터 펼쳐 두기');

      wrapper.append(hint, summary, options);
      this.summaryEl = summary;
      this.defaultOpenInput = checkbox;
      this.unregister = registerI18nTool(this);
      return wrapper;
    }

    updateLocale() {
      if (!this.summaryEl) return;
      this.applyDisplayText(this.summaryEl);
    }

    syncActiveLocaleToData() {
      if (!this.summaryEl || this.readOnly) return;
      const locale = getActiveLocale();
      this.data.i18n = {
        ...this.data.i18n,
        [locale]: sanitizeHtml(this.summaryEl.innerHTML),
      };
    }

    save() {
      this.syncActiveLocaleToData();
      return {
        i18n: this.data.i18n ?? {},
        defaultOpen: Boolean(this.data.defaultOpen),
      };
    }

    destroy() {
      this.detachTextPaste?.();
      this.detachTextPaste = null;
      this.unregister?.();
      this.unregister = null;
      this.summaryEl = null;
      this.defaultOpenInput = null;
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
