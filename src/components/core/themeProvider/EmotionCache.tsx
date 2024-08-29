import React, { useState } from 'react';
import createCache from '@emotion/cache';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

interface Registry {
  cache: EmotionCache;
  flush: () => { name: string; isGlobal: boolean }[];
}

export interface EmotionCacheProviderProps {
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
  CacheProvider?: (props: { value: EmotionCache; children: React.ReactNode }) => React.JSX.Element | null;
  children: React.ReactNode;
}

export default function EmotionCacheProvider(props: EmotionCacheProviderProps): React.JSX.Element {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const [registry] = useState<Registry>(() => {
    const cache = createCache(options);
    cache.compat = true;
    
    const prevInsert = cache.insert;
    let inserted: { name: string; isGlobal: boolean }[] = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }

      return prevInsert(...args);
    };

    const flush = (): { name: string; isGlobal: boolean }[] => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  // This part is replaced from useServerInsertedHTML with a useEffect to inject styles
  React.useEffect(() => {
    const inserted = registry.flush();

    if (inserted.length > 0) {
      let styles = '';
      let dataEmotionAttribute = registry.cache.key;

      const globals: { name: string; style: string }[] = [];

      inserted.forEach(({ name, isGlobal }) => {
        const style = registry.cache.inserted[name];

        if (typeof style !== 'boolean' && style) {
          if (isGlobal) {
            globals.push({ name, style });
          } else {
            styles += style;
            dataEmotionAttribute += ` ${name}`;
          }
        }
      });

      globals.forEach(({ name, style }) => {
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-emotion', `${registry.cache.key}-global ${name}`);
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
      });

      if (styles) {
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-emotion', dataEmotionAttribute);
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
      }
    }
  }, [registry]);

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
