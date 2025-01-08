declare module 'web-vitals' {
    export function onCLS(onPerfEntry: (metric: any) => void): void;
    export function onFID(onPerfEntry: (metric: any) => void): void;
    export function onFCP(onPerfEntry: (metric: any) => void): void;
    export function onLCP(onPerfEntry: (metric: any) => void): void;
    export function onTTFB(onPerfEntry: (metric: any) => void): void;
  }
  