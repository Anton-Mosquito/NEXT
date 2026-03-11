// src/shared/lib/performance.ts

// ✅ Вимірювання часу render компонента
export function measureRender(componentName: string) {
  if (process.env.NODE_ENV !== "development")
    return { start: () => {}, end: () => {} };

  let startTime: number;

  return {
    start: () => {
      startTime = performance.now();
    },
    end: () => {
      const duration = performance.now() - startTime;
      if (duration > 16) {
        // > 1 frame (60fps)
        console.warn(
          `🐌 Slow render: ${componentName} took ${duration.toFixed(2)}ms`,
        );
      } else {
        console.log(`⚡ ${componentName}: ${duration.toFixed(2)}ms`);
      }
    },
  };
}

// ✅ Why-did-you-render helper (development)
export function trackRerenders(
  componentName: string,
  props: Record<string, unknown>,
  prevProps: Record<string, unknown>,
) {
  if (process.env.NODE_ENV !== "development") return;

  const changed = Object.keys(props).filter(
    (key) => props[key] !== prevProps[key],
  );

  if (changed.length > 0) {
    console.log(`🔄 ${componentName} re-rendered. Changed props:`, changed);
  }
}

// ✅ Вимірювання часу selector
export function measureSelector<T>(name: string, selector: () => T): T {
  if (process.env.NODE_ENV !== "development") return selector();

  const start = performance.now();
  const result = selector();
  const duration = performance.now() - start;

  if (duration > 1) {
    console.warn(`🐌 Slow selector "${name}": ${duration.toFixed(3)}ms`);
  }

  return result;
}
