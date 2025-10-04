declare global {
  var __: (key: string) => string;
  interface Window {
    __: (key: string) => string;
  }
}


export function applyGlobalTranslationFix(): void {
  if (typeof global !== 'undefined') {
    if (!global.__) {
      global.__ = (key: string): string => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Translation Fallback] Server Key:', key);
        }
        return key;
      };
    }
  }
  
  if (typeof window !== 'undefined') {
    if (!window.__) {
      window.__ = (key: string): string => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Translation Fallback] Client Key:', key);
        }
        return key;
      };
    }
  }
}

applyGlobalTranslationFix();

export default applyGlobalTranslationFix;