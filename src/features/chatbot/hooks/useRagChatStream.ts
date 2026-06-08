'use client';

import { useCallback } from 'react';

type StreamRagReplyArgs = {
  messageId: string;
  message: string;
  locale: string;
  onChunk: (messageId: string, text: string) => void;
  onComplete: (messageId: string, relatedProjectIds: number[]) => void;
  onError: (messageId: string) => void;
};

function parseRelatedProjectIds(header: string | null) {
  return (header ?? '')
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function useRagChatStream() {
  const streamRagReply = useCallback(async (args: StreamRagReplyArgs) => {
    const messageId = args.messageId;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: args.message, locale: args.locale }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Failed to fetch chat response: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      const relatedProjectIds = parseRelatedProjectIds(
        response.headers.get('x-rag-project-ids'),
      );

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        args.onChunk(messageId, fullText);
      }

      args.onComplete(messageId, relatedProjectIds);
      return messageId;
    } catch (error) {
      console.error('RAG chat error:', error);
      args.onError(messageId);
      return messageId;
    }
  }, []);

  return { streamRagReply };
}
