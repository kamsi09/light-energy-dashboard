/// <reference types="vite/client" />

declare module '*.tsx' {
  import type { FC } from 'react';
  const content: FC;
  export default content;
}
