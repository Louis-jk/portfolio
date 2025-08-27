import React from 'react';
import { LuShare2 } from 'react-icons/lu';

interface ShareButtonProps {
  onShareClick: () => void;
}

function ShareButton({ onShareClick }: ShareButtonProps) {
  const handleShare = async () => {
    // PC와 모바일 구분
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile && navigator.share) {
      // 모바일에서는 네이티브 공유 사용
      const url = window.location.href;
      const title = 'Joonho Kim Portfolio';
      const text = 'Frontend Developer Joonho Kim';

      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (err) {
        // 사용자가 공유를 취소한 경우는 정상적인 동작이므로 에러 로그를 출력하지 않음
        if (err instanceof Error && err.name === 'AbortError') {
          // 공유 취소 - 아무것도 하지 않음
          return;
        }
      }
    } else {
      // PC에서는 모달 열기
      onShareClick();
    }
  };

  return (
    <div
      onClick={handleShare}
      className='inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer'
    >
      <LuShare2 className='w-4 h-4' />
    </div>
  );
}

export default ShareButton;
