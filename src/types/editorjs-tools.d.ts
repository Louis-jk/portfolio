declare module '@editorjs/embed' {
  import type { BlockToolConstructable } from '@editorjs/editorjs';
  const Embed: BlockToolConstructable;
  export default Embed;
}

declare module '@editorjs/code' {
  import type { BlockToolConstructable } from '@editorjs/editorjs';
  const CodeTool: BlockToolConstructable;
  export default CodeTool;
}

declare module '@editorjs/delimiter' {
  import type { BlockToolConstructable } from '@editorjs/editorjs';
  const Delimiter: BlockToolConstructable;
  export default Delimiter;
}

declare module '@editorjs/table' {
  import type { BlockToolConstructable } from '@editorjs/editorjs';
  const Table: BlockToolConstructable;
  export default Table;
}

declare module '@editorjs/image' {
  import type { BlockToolConstructable } from '@editorjs/editorjs';
  const ImageTool: BlockToolConstructable;
  export default ImageTool;
}
