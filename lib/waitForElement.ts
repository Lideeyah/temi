/**
 * Wait for a ref to be populated by React's commit.
 *
 * Setting state that mounts a <video> and then reaching for videoRef.current on the next line
 * does not work: React has not rendered yet, the ref is still null, and the stream is assigned to
 * nothing. The camera light comes on, the element stays black, and there is no error anywhere —
 * the most confusing shape a bug can take.
 *
 * Polling on animation frames costs a frame or two and removes the race entirely.
 */
export async function waitForElement<T extends HTMLElement>(
  ref: { current: T | null },
  timeoutMs = 2000,
): Promise<T | null> {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    if (ref.current) return ref.current;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return ref.current;
}
