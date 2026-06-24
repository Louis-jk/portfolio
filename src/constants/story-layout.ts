/**
 * Shared story column width — admin Editor.js and public story overlay.
 * 1280px (max-w-7xl): wide enough for images/diagrams, readable line length for prose.
 */
export const STORY_CONTENT_MAX_CLASS = 'mx-auto w-full max-w-7xl';

export const STORY_CONTENT_SHELL_CLASS = `${STORY_CONTENT_MAX_CLASS} px-6 lg:px-8`;

/** Bottom padding so last lines clear floating close + chatbot FABs on mobile. */
export const OVERLAY_FAB_SAFE_PADDING_CLASS = 'pb-32';

/** Show scroll-to-top FAB only after scrolling past this offset (px). */
export const SCROLL_TO_TOP_REVEAL_PX = 160;
