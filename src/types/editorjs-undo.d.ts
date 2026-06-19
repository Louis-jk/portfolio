declare module 'editorjs-undo' {
  import type EditorJS from '@editorjs/editorjs';
  import type { OutputData } from '@editorjs/editorjs';

  export default class Undo {
    constructor(options: {
      editor: EditorJS;
      maxLength?: number;
      onUpdate?: () => void;
      config?: {
        debounceTimer?: number;
        shortcuts?: { undo?: string | string[]; redo?: string | string[] };
      };
    });

    initialize(data: OutputData): void;
    clear(): void;
    undo(): void;
    redo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
  }
}
