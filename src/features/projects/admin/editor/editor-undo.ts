import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';

const UNDO_HISTORY_LIMIT = 100;

export async function attachEditorUndo(
  editor: EditorJS,
  initialData: OutputData,
): Promise<void> {
  const { default: Undo } = await import('editorjs-undo');
  const undo = new Undo({ editor, maxLength: UNDO_HISTORY_LIMIT });
  undo.initialize(initialData);
}
