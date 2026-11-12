import path from 'node:path';
import type { Plugin } from 'vite';
import { ensurePrismMechanizedArtifacts } from './prismMechanizer.ts';

// Vite Build & Dev-Server Mechanization Plugin (scripts/prismVitePlugin.ts).
// - On buildStart (vite / vite build): runs content-addressed ensurePrismMechanizedArtifacts
//   (~15ms on SHA-256 cache hit; full .lex.tex -> TypeScript transpilation on model edit).
// - On configureServer (npm run dev): watches prism/src/ (.lex.tex) and prism/spec.json,
//   recompiling src/game/generatedPrismConstants.ts and src/game/generatedPrismRuntime.ts
//   automatically so live edits to formal Prism models trigger Vite HMR with zero manual CLI steps.
export function prismMechanizerVitePlugin(projectRoot: string): Plugin {
  const prismDir = path.join(projectRoot, 'prism');
  const prismSrcDir = path.join(prismDir, 'src');
  const specJsonPath = path.join(prismDir, 'spec.json');
  let compiling = false;

  const isPrismSourceFile = (filePath: string): boolean => {
    const resolved = path.resolve(filePath);
    return (
      resolved === specJsonPath ||
      (resolved.startsWith(prismSrcDir + path.sep) && resolved.endsWith('.lex.tex'))
    );
  };

  return {
    name: 'verdant-prism-mechanizer',
    buildStart() {
      const res = ensurePrismMechanizedArtifacts(projectRoot);
      if (!res.fromCache && (res.constantsChanged || res.runtimeChanged)) {
        console.log(
          `[prism:vite] Mechanized Prism model -> TypeScript in ${res.durationMs}ms (digest ${res.inputDigestSha256.slice(0, 12)}…)`,
        );
      }
    },
    configureServer(server) {
      if (process.env.DISABLE_HMR === 'true') return;
      server.watcher.add([prismSrcDir, specJsonPath]);
      const onPrismChange = (changedFile: string) => {
        if (compiling || !isPrismSourceFile(changedFile)) return;
        compiling = true;
        try {
          const res = ensurePrismMechanizedArtifacts(projectRoot);
          if (res.constantsChanged || res.runtimeChanged || res.specReport.specMdUpdated) {
            server.config.logger.info(
              `[prism:watch] Recompiled ${path.relative(projectRoot, changedFile)} -> TypeScript in ${res.durationMs}ms`,
              { timestamp: true },
            );
          }
        } catch (err) {
          server.config.logger.error(
            `[prism:watch] Mechanization error: ${err instanceof Error ? err.message : String(err)}`,
            { timestamp: true },
          );
        } finally {
          compiling = false;
        }
      };
      server.watcher.on('change', onPrismChange);
      server.watcher.on('add', onPrismChange);
      server.watcher.on('unlink', onPrismChange);
    },
  };
}
