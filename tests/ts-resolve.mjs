/**
 * Node's ESM resolver requires explicit file extensions; the app is bundler-resolved and so
 * uses extensionless relative imports and the `@/` alias. This hook teaches `node
 * --experimental-strip-types` both conventions so the test suite can import app modules
 * directly, with no build step and no duplicated source.
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

const ROOT = pathToFileURL(process.cwd() + '/').href;

register(
  'data:text/javascript,' +
    encodeURIComponent(`
      const ROOT = ${JSON.stringify(ROOT)};
      const CANDIDATES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
      export async function resolve(specifier, context, next) {
        let spec = specifier;
        if (spec.startsWith('@/')) spec = new URL(spec.slice(2), ROOT).href;
        try {
          return await next(spec, context);
        } catch (error) {
          for (const ext of CANDIDATES) {
            try { return await next(spec + ext, context); } catch {}
          }
          throw error;
        }
      }
    `),
  import.meta.url,
);
