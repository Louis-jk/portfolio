import { describe, expect, it } from 'vitest';
import {
  captureI18nTextBlocksFromDom,
  getLeafContentEditable,
  normalizeEditorOutputForSave,
  prepareEditorOutputForLoad,
} from '@/features/projects/admin/editor/editor-html-persistence';

describe('getLeafContentEditable', () => {
  it('returns the deepest contenteditable when nested', () => {
    const root = document.createElement('div');
    const outer = document.createElement('div');
    outer.setAttribute('contenteditable', 'true');
    const inner = document.createElement('div');
    inner.setAttribute('contenteditable', 'true');
    inner.innerHTML = '<code class="story-inline-code">api</code>';
    outer.append(inner);
    root.append(outer);

    expect(getLeafContentEditable(root)?.innerHTML).toContain('story-inline-code');
  });
});

describe('captureI18nTextBlocksFromDom', () => {
  it('reads paragraph html from live block holder', () => {
    const holder = document.createElement('div');
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    editable.innerHTML = 'use <code class="story-inline-code">service</code>';
    holder.append(editable);

    const editor = {
      blocks: {
        getBlocksCount: () => 1,
        getBlockByIndex: () => ({ name: 'paragraph', holder }),
      },
    };

    const captured = captureI18nTextBlocksFromDom(editor, {
      time: 1,
      version: '2.29.0',
      blocks: [{ type: 'paragraph', data: { html: 'use service' } }],
    });

    expect(captured.blocks[0]?.data.html).toContain(
      '<code class="story-inline-code">service</code>',
    );
  });
});

describe('editor html persistence', () => {
  it('round-trips inline code in paragraph html', () => {
    const saved = normalizeEditorOutputForSave({
      time: 1,
      version: '2.29.0',
      blocks: [
        {
          type: 'paragraph',
          data: {
            html: '<code class="story-inline-code">ApiResponse&lt;T, ErrorCode&gt;</code>',
          },
        },
      ],
    });

    const loaded = prepareEditorOutputForLoad(saved);
    expect(loaded.blocks[0]?.data.html).toContain(
      'ApiResponse&lt;T, ErrorCode&gt;',
    );
    expect(loaded.blocks[0]?.data.html).toContain('<code');
  });

  it('prepares table cells for safe render', () => {
    const loaded = prepareEditorOutputForLoad({
      time: 1,
      version: '2.29.0',
      blocks: [
        {
          type: 'table',
          data: {
            content: [['<code class="story-inline-code">api-client</code>']],
          },
        },
      ],
    });

    const cell = (loaded.blocks[0]?.data.content as string[][])[0][0];
    expect(cell).toContain('<code class="story-inline-code">api-client</code>');
  });

  it('converts legacy backticks in table cells on load', () => {
    const loaded = prepareEditorOutputForLoad({
      time: 1,
      version: '2.29.0',
      blocks: [
        {
          type: 'table',
          data: { content: [['`api-client`']] },
        },
      ],
    });

    const cell = (loaded.blocks[0]?.data.content as string[][])[0][0];
    expect(cell).toContain('<code class="story-inline-code">api-client</code>');
  });
});
