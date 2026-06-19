import type { BlockTool } from '@editorjs/editorjs';

export function createEditorDetailsEndTool() {
  return class EditorDetailsEndTool implements BlockTool {
    static get toolbox() {
      return {
        title: '접기 끝',
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3 8h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
      };
    }

    static get isReadOnlySupported() {
      return true;
    }

    render() {
      const marker = document.createElement('div');
      marker.className =
        'story-details-end-admin rounded-lg border border-dashed border-zinc-300 bg-zinc-100 px-4 py-2 text-center text-sm font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400';
      marker.textContent = '▼ 접기 섹션 끝';
      return marker;
    }

    save() {
      return {};
    }
  };
}
