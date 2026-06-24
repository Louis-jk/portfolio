export function ProjectFormDraftBanner({ onDiscard }: { onDiscard: () => void }) {
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm text-purple-900 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-100'>
      <p>
        작성 중이던 내용을 복구했습니다. 이미지 미리보기가 없으면 다시 업로드해
        주세요.
      </p>
      <button
        type='button'
        onClick={onDiscard}
        className='shrink-0 rounded-lg border border-purple-300 px-3 py-1.5 text-xs font-bold hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-900/60'
      >
        초안 삭제
      </button>
    </div>
  );
}
