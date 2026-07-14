import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
      });
      return true;
    },
    [timeout]
  );

  return { isCopied, copyToClipboard };
}
