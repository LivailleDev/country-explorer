// Registers @testing-library/jest-dom matchers (e.g. toBeInTheDocument) on
// Vitest's expect and augments the types so TypeScript knows about them.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Tell React we're in a test environment so manual act(...) calls (used with
// fake timers in the useDebounce tests) don't warn.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Unmount React trees between tests so they don't leak into each other.
afterEach(() => {
  cleanup();
});
