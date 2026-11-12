import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  renderGeneratedPrismConstantsSource,
  verifyNoUnprovedTrueLiteralsInFoundationModules,
  loadAllPrismModules,
  writeFileIfChanged,
} from './extractPrismArtifacts.ts';

/**
 * Prism Model Mechanizer & LexLean-to-TypeScript Compiler (`scripts/prismMechanizer.ts`).
 *
 * Mechanizes the entire Verdant Resonance implementation directly from the formal Prism model:
 *  1. Parses all `.lex.tex` modules (`inductive`, `structure`, `definition`, `theorem`) in topological order.
 *  2. Compiles every `.lex.tex` `inductive`, `structure`, and `definition` across all 27 modules into
 *     native, strictly-typed, zero-allocation TypeScript (`src/game/generatedPrismRuntime.ts`),
 *     eliminating hand-maintained LUT boilerplate and manual formula duplication.
 *  3. Auto-discovers every `breaks*` counterexample refuter, `verify*` constructive predicate, and
 *     `step*` function across all 27 modules into `GENERATED_PRISM_MECHANIZED_MANIFEST`.
 *  4. Synchronizes & validates `prism/spec.json` <-> `prism/SPEC.md` <-> `prism/src/VerdantResonance.lex.tex`
 *     (choice byte parsers, `rule1..ruleN`, `encodeAnswer`, and hex `acceptanceVectors`) without manual hex math.
 *  5. Maintains a content-addressed SHA-256 incremental cache (`node_modules/.cache/prism-mechanizer-state.json`)
 *     for sub-5ms no-op checks during `vite dev` and `vite build`.
 */

export interface LexFieldDecl {
  name: string;
  type: string;
}

export interface LexInductiveDecl {
  moduleName: string;
  name: string;
  constructors: { name: string; fields: LexFieldDecl[] }[];
}

export interface LexStructureDecl {
  moduleName: string;
  name: string;
  fields: LexFieldDecl[];
}

export interface LexParamDecl {
  name: string;
  type: string;
}

export interface LexFullDefinition {
  moduleName: string;
  name: string;
  parameters: LexParamDecl[];
  resultType: string;
  bodyRaw: string;
  recursiveArgument?: string;
}

export interface LexFullTheorem {
  moduleName: string;
  name: string;
  parameters: LexParamDecl[];
  statementRaw: string;
}

export interface FullLexModule {
  moduleName: string;
  filePath: string;
  rawText: string;
  imports: string[];
  inductives: LexInductiveDecl[];
  structures: LexStructureDecl[];
  definitions: Map<string, LexFullDefinition>;
  theorems: LexFullTheorem[];
}

const JS_RESERVED_WORDS = new Set([
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
  'await',
  'arguments',
  'eval',
]);

function safeLocalIdent(name: string): string {
  return JS_RESERVED_WORDS.has(name) ? `_kw_${name}` : name;
}

export function moduleToTsSlug(moduleName: string): string {
  return moduleName.replace(/\./g, '_');
}

function findBalancedDelimiter(
  text: string,
  openIdx: number,
  openChar: string,
  closeChar: string,
): { content: string; endIdx: number } {
  let depth = 0;
  let inString = false;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && text[i - 1] !== '\\') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        return {
          content: text.slice(openIdx + 1, i),
          endIdx: i,
        };
      }
    }
  }
  throw new Error(`Unbalanced '${openChar}' starting at index ${openIdx}`);
}

function splitTopLevelCommaList(inner: string): string[] {
  const items: string[] = [];
  let pDepth = 0;
  let bDepth = 0;
  let cDepth = 0;
  let inStr = false;
  let start = 0;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === '"' && inner[i - 1] !== '\\') {
      inStr = !inStr;
      continue;
    }
    if (inStr) continue;
    if (ch === '(') pDepth++;
    else if (ch === ')') pDepth--;
    else if (ch === '[') bDepth++;
    else if (ch === ']') bDepth--;
    else if (ch === '{') cDepth++;
    else if (ch === '}') cDepth--;
    else if (ch === ',' && pDepth === 0 && bDepth === 0 && cDepth === 0) {
      const piece = inner.slice(start, i).trim();
      if (piece) items.push(piece);
      start = i + 1;
    }
  }
  const tail = inner.slice(start).trim();
  if (tail) items.push(tail);
  return items;
}

function extractTopLevelBlockField(blockContent: string, fieldName: string): string | null {
  const regex = new RegExp(`(?:^|,|\\n)\\s*${fieldName}\\s*:\\s*`, 'm');
  const match = regex.exec(blockContent);
  if (!match) return null;
  const start = match.index + match[0].length;
  let pDepth = 0;
  let bDepth = 0;
  let cDepth = 0;
  let inString = false;
  let i = start;
  for (; i < blockContent.length; i++) {
    const ch = blockContent[i];
    if (ch === '"' && blockContent[i - 1] !== '\\') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === '(') pDepth++;
    else if (ch === ')') pDepth--;
    else if (ch === '[') bDepth++;
    else if (ch === ']') bDepth--;
    else if (ch === '{') cDepth++;
    else if (ch === '}') cDepth--;
    else if (ch === ',' && pDepth === 0 && bDepth === 0 && cDepth === 0) {
      break;
    }
  }
  return blockContent.slice(start, i).trim();
}

function parseParamList(paramsRaw: string | null): LexParamDecl[] {
  if (!paramsRaw) return [];
  const trimmed = paramsRaw.trim();
  const inner = trimmed.startsWith('[') && trimmed.endsWith(']') ? trimmed.slice(1, -1).trim() : trimmed;
  if (!inner) return [];
  return splitTopLevelCommaList(inner).map((entry) => {
    const colonIdx = entry.indexOf(':');
    if (colonIdx === -1) {
      return { name: entry.trim(), type: 'Nat' };
    }
    return {
      name: entry.slice(0, colonIdx).trim(),
      type: entry.slice(colonIdx + 1).trim(),
    };
  });
}

function parseStructFields(fieldsRaw: string | null): LexFieldDecl[] {
  if (!fieldsRaw) return [];
  const trimmed = fieldsRaw.trim();
  const inner = trimmed.startsWith('[') && trimmed.endsWith(']') ? trimmed.slice(1, -1).trim() : trimmed;
  if (!inner) return [];
  return splitTopLevelCommaList(inner).map((item) => {
    const braceIdx = item.indexOf('{');
    const body = braceIdx !== -1 ? findBalancedDelimiter(item, braceIdx, '{', '}').content : item;
    const name = extractTopLevelBlockField(body, 'name') ?? 'unknown';
    const type = extractTopLevelBlockField(body, 'type') ?? 'Nat';
    return { name, type };
  });
}

export function parseFullLexModule(filePath: string): FullLexModule {
  const rawText = fs.readFileSync(filePath, 'utf8');
  const modMatch = rawText.match(/\\begin\{lexlean\}\{([^}]+)\}/);
  const moduleName = modMatch ? modMatch[1] : path.basename(filePath, '.lex.tex');

  const imports: string[] = [];
  const importRegex = /\\importmodule\{([^}]+)\}/g;
  let impMatch: RegExpExecArray | null;
  while ((impMatch = importRegex.exec(rawText)) !== null) {
    imports.push(impMatch[1]);
  }

  const inductives: LexInductiveDecl[] = [];
  const structures: LexStructureDecl[] = [];
  const definitions = new Map<string, LexFullDefinition>();
  const theorems: LexFullTheorem[] = [];

  const declRegex = /\b(inductive|structure|definition|theorem)\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = declRegex.exec(rawText)) !== null) {
    const kind = match[1];
    const openBraceIdx = match.index + match[0].length - 1;
    const { content, endIdx } = findBalancedDelimiter(rawText, openBraceIdx, '{', '}');
    declRegex.lastIndex = endIdx + 1;

    const name = extractTopLevelBlockField(content, 'name');
    if (!name) continue;

    if (kind === 'inductive') {
      const ctorsRaw = extractTopLevelBlockField(content, 'constructors') ?? '[]';
      const innerCtors =
        ctorsRaw.startsWith('[') && ctorsRaw.endsWith(']') ? ctorsRaw.slice(1, -1).trim() : ctorsRaw;
      const constructors = innerCtors
        ? splitTopLevelCommaList(innerCtors).map((ctorItem) => {
            const bIdx = ctorItem.indexOf('{');
            const cBody =
              bIdx !== -1 ? findBalancedDelimiter(ctorItem, bIdx, '{', '}').content : ctorItem;
            return {
              name: extractTopLevelBlockField(cBody, 'name') ?? 'Unknown',
              fields: parseStructFields(extractTopLevelBlockField(cBody, 'fields')),
            };
          })
        : [];
      inductives.push({ moduleName, name, constructors });
    } else if (kind === 'structure') {
      const fields = parseStructFields(extractTopLevelBlockField(content, 'fields'));
      structures.push({ moduleName, name, fields });
    } else if (kind === 'definition') {
      const parameters = parseParamList(extractTopLevelBlockField(content, 'parameters'));
      const resultType = extractTopLevelBlockField(content, 'result') ?? 'Nat';
      const bodyRaw = extractTopLevelBlockField(content, 'body') ?? '';
      const recursiveArgument = extractTopLevelBlockField(content, 'recursive_argument') ?? undefined;
      definitions.set(name, {
        moduleName,
        name,
        parameters,
        resultType,
        bodyRaw,
        recursiveArgument,
      });
    } else if (kind === 'theorem') {
      const parameters = parseParamList(extractTopLevelBlockField(content, 'parameters'));
      const statementRaw = extractTopLevelBlockField(content, 'statement') ?? '';
      theorems.push({
        moduleName,
        name,
        parameters,
        statementRaw,
      });
    }
  }

  return {
    moduleName,
    filePath,
    rawText,
    imports,
    inductives,
    structures,
    definitions,
    theorems,
  };
}

export function loadFullPrismModuleGraph(prismSrcDir: string): FullLexModule[] {
  const byName = new Map<string, FullLexModule>();
  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.lex.tex')) {
        const parsed = parseFullLexModule(full);
        byName.set(parsed.moduleName, parsed);
      }
    }
  }
  walk(prismSrcDir);

  const visited = new Set<string>();
  const ordered: FullLexModule[] = [];
  const sortedNames = [...byName.keys()].sort((a, b) => a.localeCompare(b));

  function visit(modName: string) {
    if (visited.has(modName)) return;
    visited.add(modName);
    const mod = byName.get(modName);
    if (!mod) return;
    for (const imp of mod.imports) {
      visit(imp);
    }
    ordered.push(mod);
  }

  for (const name of sortedNames) {
    visit(name);
  }
  return ordered;
}

function stripOuterParens(raw: string): string {
  let expr = raw.trim();
  while (expr.startsWith('(') && expr.endsWith(')')) {
    let depth = 0;
    let inStr = false;
    let balanced = true;
    for (let i = 0; i < expr.length - 1; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') depth++;
      else if (ch === ')') {
        depth--;
        if (depth === 0) {
          balanced = false;
          break;
        }
      }
    }
    if (balanced) {
      expr = expr.slice(1, -1).trim();
    } else {
      break;
    }
  }
  return expr;
}

function tokenizeTopLevelExpr(expr: string): string[] {
  const tokens: string[] = [];
  let pDepth = 0;
  let bDepth = 0;
  let cDepth = 0;
  let inStr = false;
  let tokStart = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
    if (inStr) continue;
    if (ch === '(') pDepth++;
    else if (ch === ')') pDepth--;
    else if (ch === '[') bDepth++;
    else if (ch === ']') bDepth--;
    else if (ch === '{') cDepth++;
    else if (ch === '}') cDepth--;
    else if (/\s/.test(ch) && pDepth === 0 && bDepth === 0 && cDepth === 0) {
      if (i > tokStart) {
        const piece = expr.slice(tokStart, i).trim();
        if (piece) tokens.push(piece);
      }
      tokStart = i + 1;
    }
  }
  if (tokStart < expr.length) {
    const tail = expr.slice(tokStart).trim();
    if (tail) tokens.push(tail);
  }
  return tokens;
}

export function compileLexTypeToTs(
  rawType: string,
  currentModule: string,
  moduleMap: Map<string, FullLexModule>,
): string {
  const t = stripOuterParens(rawType);
  if (t === 'Nat' || t === 'UInt8' || t === 'UInt16' || t === 'UInt32' || t === 'UInt64') {
    return 'bigint';
  }
  if (t === 'Bool') return 'boolean';
  if (t === 'String') return 'string';
  if (t === 'Bytes') return 'PrismBytes';
  if (t === 'Ordering') return 'PrismOrdering';

  if (t.startsWith('Option ')) {
    const inner = t.slice('Option '.length).trim();
    return `PrismOption<${compileLexTypeToTs(inner, currentModule, moduleMap)}>`;
  }
  if (t.startsWith('List ')) {
    const inner = t.slice('List '.length).trim();
    return `ReadonlyArray<${compileLexTypeToTs(inner, currentModule, moduleMap)}>`;
  }
  if (t.includes('::')) {
    const [mod, sym] = t.split('::');
    return `${moduleToTsSlug(mod)}_${sym}`;
  }

  const curMod = moduleMap.get(currentModule);
  if (curMod) {
    if (
      curMod.structures.some((s) => s.name === t) ||
      curMod.inductives.some((ind) => ind.name === t)
    ) {
      return `${moduleToTsSlug(currentModule)}_${t}`;
    }
    for (const imp of curMod.imports) {
      const impMod = moduleMap.get(imp);
      if (
        impMod &&
        (impMod.structures.some((s) => s.name === t) ||
          impMod.inductives.some((ind) => ind.name === t))
      ) {
        return `${moduleToTsSlug(imp)}_${t}`;
      }
    }
  }
  return `${moduleToTsSlug(currentModule)}_${t}`;
}

interface CompileContext {
  currentModule: string;
  moduleMap: Map<string, FullLexModule>;
  nextTempId: () => number;
}

function findKeywordAtTopLevel(expr: string, keyword: string, startOffset: number): { index: number; length: number } | null {
  let pDepth = 0;
  let bDepth = 0;
  let cDepth = 0;
  let inStr = false;
  for (let i = startOffset; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '"' && expr[i - 1] !== '\\') {
      inStr = !inStr;
      continue;
    }
    if (inStr) continue;
    if (ch === '(') pDepth++;
    else if (ch === ')') pDepth--;
    else if (ch === '[') bDepth++;
    else if (ch === ']') bDepth--;
    else if (ch === '{') cDepth++;
    else if (ch === '}') cDepth--;
    if (pDepth === 0 && bDepth === 0 && cDepth === 0 && /\s/.test(ch)) {
      const tail = expr.slice(i);
      const m = new RegExp(`^\\s+${keyword}\\s+`).exec(tail);
      if (m) {
        return { index: i, length: m[0].length };
      }
    }
  }
  return null;
}

function compileLexExprToTs(
  exprRaw: string,
  ctx: CompileContext,
  localEnv: Record<string, string>,
  usedLocals: Set<string>,
): string {
  const expr = stripOuterParens(exprRaw);

  if (expr === 'true') return 'true';
  if (expr === 'false') return 'false';
  if (/^\d+$/.test(expr)) return `${expr}n`;
  if (/^0x[0-9a-fA-F]*$/.test(expr)) {
    return `_hex(${JSON.stringify(expr.slice(2))})`;
  }
  if (expr.startsWith('"') && expr.endsWith('"')) {
    return JSON.stringify(expr.slice(1, -1));
  }

  const typedUintMatch = expr.match(/^(\d+)\s*:\s*UInt\d+$/);
  if (typedUintMatch) {
    return `${typedUintMatch[1]}n`;
  }

  if (Object.prototype.hasOwnProperty.call(localEnv, expr)) {
    const mapped = localEnv[expr];
    usedLocals.add(mapped);
    return mapped;
  }

  // Unroll consecutive `let` bindings into a flat arrow IIFE block
  if (expr.startsWith('let ')) {
    const steps: { tsIdent: string; valCode: string; stepUsed: Set<string> }[] = [];
    let cursor = expr;
    let blockEnv = { ...localEnv };
    const seenNamesInBlock = new Set<string>(Object.values(localEnv));

    while (cursor.startsWith('let ')) {
      const assignIdx = cursor.indexOf(':=');
      if (assignIdx === -1) break;
      const header = cursor.slice(4, assignIdx).trim();
      const rawVarName = header.split(':')[0].trim();

      let pDepth = 0;
      let bDepth = 0;
      let cDepth = 0;
      let inStr = false;
      let semiIdx = -1;
      for (let i = assignIdx + 2; i < cursor.length; i++) {
        const ch = cursor[i];
        if (ch === '"' && cursor[i - 1] !== '\\') inStr = !inStr;
        if (inStr) continue;
        if (ch === '(') pDepth++;
        else if (ch === ')') pDepth--;
        else if (ch === '[') bDepth++;
        else if (ch === ']') bDepth--;
        else if (ch === '{') cDepth++;
        else if (ch === '}') cDepth--;
        else if (ch === ';' && pDepth === 0 && bDepth === 0 && cDepth === 0) {
          semiIdx = i;
          break;
        }
      }
      if (semiIdx === -1) {
        throw new Error(`Malformed let expression without ';' in ${ctx.currentModule}: ${cursor}`);
      }
      const valRaw = cursor.slice(assignIdx + 2, semiIdx).trim();
      const stepUsed = new Set<string>();
      const valCode = compileLexExprToTs(valRaw, ctx, blockEnv, stepUsed);
      for (const u of stepUsed) usedLocals.add(u);

      let tsIdent = safeLocalIdent(rawVarName);
      if (seenNamesInBlock.has(tsIdent)) {
        tsIdent = `${tsIdent}_${ctx.nextTempId()}`;
      }
      seenNamesInBlock.add(tsIdent);
      steps.push({ tsIdent, valCode, stepUsed });
      blockEnv = { ...blockEnv, [rawVarName]: tsIdent };
      cursor = stripOuterParens(cursor.slice(semiIdx + 1).trim());
    }

    const bodyUsed = new Set<string>();
    const finalCode = compileLexExprToTs(cursor, ctx, blockEnv, bodyUsed);
    for (const u of bodyUsed) usedLocals.add(u);

    // Compute transitive liveness backwards across the unrolled let bindings
    const live = new Set<string>(bodyUsed);
    const neededFlags = new Array<boolean>(steps.length).fill(false);
    for (let i = steps.length - 1; i >= 0; i--) {
      if (live.has(steps[i].tsIdent)) {
        neededFlags[i] = true;
        for (const u of steps[i].stepUsed) {
          live.add(u);
        }
      }
    }

    const lines: string[] = [];
    for (let i = 0; i < steps.length; i++) {
      if (neededFlags[i]) {
        lines.push(`const ${steps[i].tsIdent} = ${steps[i].valCode};`);
      } else {
        lines.push(`void (${steps[i].valCode});`);
      }
    }
    lines.push(`return ${finalCode};`);
    return `(() => { ${lines.join(' ')} })()`;
  }

  // `record StructName { f1 := v1, ... }`
  if (expr.startsWith('record ')) {
    const braceStart = expr.indexOf('{');
    const structTypeRaw = expr.slice('record '.length, braceStart).trim();
    const tsStructType = compileLexTypeToTs(structTypeRaw, ctx.currentModule, ctx.moduleMap);
    const { content } = findBalancedDelimiter(expr, braceStart, '{', '}');
    const fieldAssigns = splitTopLevelCommaList(content).map((f) => {
      const eqIdx = f.indexOf(':=');
      const k = f.slice(0, eqIdx).trim();
      const vRaw = f.slice(eqIdx + 2).trim();
      const vCode = compileLexExprToTs(vRaw, ctx, localEnv, usedLocals);
      return `${k}: ${vCode}`;
    });
    return `({ ${fieldAssigns.join(', ')} } as ${tsStructType})`;
  }

  // `if <cond> then <t> else <e>`
  if (expr.startsWith('if ') || expr.startsWith('if\n') || expr.startsWith('if\t')) {
    const thenMatch = findKeywordAtTopLevel(expr, 'then', 2);
    if (!thenMatch) {
      throw new Error(`Missing 'then' in if-expression in ${ctx.currentModule}: ${expr}`);
    }
    const elseMatch = findKeywordAtTopLevel(expr, 'else', thenMatch.index + thenMatch.length);
    if (!elseMatch) {
      throw new Error(`Missing 'else' in if-expression in ${ctx.currentModule}: ${expr}`);
    }
    const condRaw = expr.slice(2, thenMatch.index).trim();
    const thenRaw = expr.slice(thenMatch.index + thenMatch.length, elseMatch.index).trim();
    const elseRaw = expr.slice(elseMatch.index + elseMatch.length).trim();

    const condCode = compileLexExprToTs(condRaw, ctx, localEnv, usedLocals);
    const thenCode = compileLexExprToTs(thenRaw, ctx, localEnv, usedLocals);
    const elseCode = compileLexExprToTs(elseRaw, ctx, localEnv, usedLocals);
    return `(${condCode} ? ${thenCode} : ${elseCode})`;
  }

  // `match <scrutinee> | pat1 => body1 | pat2 => body2`
  if (expr.startsWith('match ')) {
    let pDepth = 0;
    let bDepth = 0;
    let cDepth = 0;
    let inStr = false;
    const armIndices: number[] = [];
    for (let i = 6; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') pDepth++;
      else if (ch === ')') pDepth--;
      else if (ch === '[') bDepth++;
      else if (ch === ']') bDepth--;
      else if (ch === '{') cDepth++;
      else if (ch === '}') cDepth--;
      else if (ch === '|' && pDepth === 0 && bDepth === 0 && cDepth === 0) {
        armIndices.push(i);
      }
    }

    const scrutineeRaw = expr.slice(6, armIndices[0]).trim();
    const scrutineeCode = compileLexExprToTs(scrutineeRaw, ctx, localEnv, usedLocals);
    const scrutVar = `_m${ctx.nextTempId()}`;

    const arms = armIndices.map((idx, a) => {
      const end = a + 1 < armIndices.length ? armIndices[a + 1] : expr.length;
      const armText = expr.slice(idx + 1, end).trim();
      const arrowIdx = armText.indexOf('=>');
      return {
        pat: armText.slice(0, arrowIdx).trim(),
        bodyRaw: armText.slice(arrowIdx + 2).trim(),
      };
    });

    // Option match: Option.none / Option.some x
    const noneArm = arms.find((a) => a.pat === 'Option.none');
    const someArm = arms.find((a) => a.pat.startsWith('Option.some '));
    if (noneArm && someArm) {
      const bindRaw = someArm.pat.slice('Option.some '.length).trim();
      const bindIdent = `${safeLocalIdent(bindRaw)}_${ctx.nextTempId()}`;
      const noneCode = compileLexExprToTs(noneArm.bodyRaw, ctx, localEnv, usedLocals);
      const armUsed = new Set<string>();
      const someCode = compileLexExprToTs(
        someArm.bodyRaw,
        ctx,
        { ...localEnv, [bindRaw]: bindIdent },
        armUsed,
      );
      for (const u of armUsed) {
        if (u !== bindIdent) usedLocals.add(u);
      }
      const paramDecl = armUsed.has(bindIdent) ? bindIdent : `_${bindIdent}`;
      return `((${scrutVar}) => ${scrutVar}.tag === 'none' ? ${noneCode} : ((${paramDecl}) => ${someCode})(${scrutVar}.value))(${scrutineeCode})`;
    }

    // Nat match: Nat.zero / Nat.succ x
    const zeroArm = arms.find((a) => a.pat === 'Nat.zero');
    const succArm = arms.find((a) => a.pat.startsWith('Nat.succ '));
    if (zeroArm && succArm) {
      const bindRaw = succArm.pat.slice('Nat.succ '.length).trim();
      const bindIdent = `${safeLocalIdent(bindRaw)}_${ctx.nextTempId()}`;
      const zeroCode = compileLexExprToTs(zeroArm.bodyRaw, ctx, localEnv, usedLocals);
      const armUsed = new Set<string>();
      const succCode = compileLexExprToTs(
        succArm.bodyRaw,
        ctx,
        { ...localEnv, [bindRaw]: bindIdent },
        armUsed,
      );
      for (const u of armUsed) {
        if (u !== bindIdent) usedLocals.add(u);
      }
      const paramDecl = armUsed.has(bindIdent) ? bindIdent : `_${bindIdent}`;
      return `((${scrutVar}) => ${scrutVar} <= 0n ? ${zeroCode} : ((${paramDecl}) => ${succCode})(${scrutVar} - 1n))(${scrutineeCode})`;
    }

    // Bool match: Bool.true / Bool.false
    const trueArm = arms.find((a) => a.pat === 'Bool.true');
    const falseArm = arms.find((a) => a.pat === 'Bool.false');
    if (trueArm && falseArm) {
      const trueCode = compileLexExprToTs(trueArm.bodyRaw, ctx, localEnv, usedLocals);
      const falseCode = compileLexExprToTs(falseArm.bodyRaw, ctx, localEnv, usedLocals);
      return `(${scrutineeCode} ? ${trueCode} : ${falseCode})`;
    }

    throw new Error(`Unsupported match arms in ${ctx.currentModule}: ${expr}`);
  }

  // Binary operators in LexLean precedence order
  const binaryOps: { lexOp: string; tsOp: string }[] = [
    { lexOp: '||', tsOp: '||' },
    { lexOp: '&&', tsOp: '&&' },
    { lexOp: '<=?', tsOp: '<=' },
    { lexOp: '<?', tsOp: '<' },
    { lexOp: '=?', tsOp: '===' },
    { lexOp: '+', tsOp: '+' },
  ];
  for (const { lexOp, tsOp } of binaryOps) {
    let pDepth = 0;
    let bDepth = 0;
    let cDepth = 0;
    let inStr = false;
    const token = ` ${lexOp} `;
    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') pDepth++;
      else if (ch === ')') pDepth--;
      else if (ch === '[') bDepth++;
      else if (ch === ']') bDepth--;
      else if (ch === '{') cDepth++;
      else if (ch === '}') cDepth--;
      if (pDepth === 0 && bDepth === 0 && cDepth === 0 && expr.slice(i, i + token.length) === token) {
        const leftRaw = expr.slice(0, i).trim();
        const rightRaw = expr.slice(i + token.length).trim();
        if (lexOp === '+' && stripOuterParens(leftRaw) === stripOuterParens(rightRaw)) {
          const single = compileLexExprToTs(leftRaw, ctx, localEnv, usedLocals);
          const dupVar = `_dup${ctx.nextTempId()}`;
          return `((${dupVar}) => (${dupVar} + ${dupVar}))(${single})`;
        }
        const left = compileLexExprToTs(leftRaw, ctx, localEnv, usedLocals);
        const right = compileLexExprToTs(rightRaw, ctx, localEnv, usedLocals);
        return `(${left} ${tsOp} ${right})`;
      }
    }
  }

  const tokens = tokenizeTopLevelExpr(expr);
  if (tokens.length === 0) {
    throw new Error(`Empty expression in ${ctx.currentModule}`);
  }

  // Prefix `not`
  if (tokens[0] === 'not') {
    const inner = compileLexExprToTs(tokens.slice(1).join(' '), ctx, localEnv, usedLocals);
    return `(!${inner})`;
  }

  // Field projection: `project targetObj fieldName`
  if (tokens[0] === 'project') {
    const targetCode = compileLexExprToTs(tokens[1], ctx, localEnv, usedLocals);
    const fieldName = tokens[2];
    return `${targetCode}.${fieldName}`;
  }

  // Option constructors: `ctor Option.none [T]` or `ctor Option.some [T] val`
  if (tokens[0] === 'ctor') {
    const ctorName = tokens[1];
    const bracketType = tokens[2]?.replace(/^\[|\]$/g, '').trim() ?? 'Nat';
    const tsInnerType = compileLexTypeToTs(bracketType, ctx.currentModule, ctx.moduleMap);
    if (ctorName === 'Option.none') {
      return `({ tag: 'none' } as PrismOption<${tsInnerType}>)`;
    }
    if (ctorName === 'Option.some') {
      const valCode = compileLexExprToTs(tokens[3], ctx, localEnv, usedLocals);
      return `({ tag: 'some', value: ${valCode} } as PrismOption<${tsInnerType}>)`;
    }
    throw new Error(`Unsupported constructor ${ctorName} in ${ctx.currentModule}`);
  }

  // List constructors `(nil T)` and unrolled `(cons h1 (cons h2 ... (nil T)))`
  if (tokens[0] === 'nil') {
    const elemType = compileLexTypeToTs(tokens.slice(1).join(' '), ctx.currentModule, ctx.moduleMap);
    return `([] as ReadonlyArray<${elemType}>)`;
  }
  if (tokens[0] === 'cons') {
    const elems: string[] = [];
    let curTokens = tokens;
    let tailCode: string | null = null;
    while (curTokens[0] === 'cons') {
      elems.push(compileLexExprToTs(curTokens[1], ctx, localEnv, usedLocals));
      const nextRaw = stripOuterParens(curTokens[2]);
      const nextTokens = tokenizeTopLevelExpr(nextRaw);
      if (nextTokens[0] === 'cons') {
        curTokens = nextTokens;
      } else if (nextTokens[0] === 'nil') {
        const elemType = compileLexTypeToTs(
          nextTokens.slice(1).join(' '),
          ctx.currentModule,
          ctx.moduleMap,
        );
        return `([${elems.join(', ')}] as ReadonlyArray<${elemType}>)`;
      } else {
        tailCode = compileLexExprToTs(nextRaw, ctx, localEnv, usedLocals);
        break;
      }
    }
    return tailCode ? `[${elems.join(', ')}, ...${tailCode}]` : `[${elems.join(', ')}]`;
  }

  // Primitive operations: `prim <op> <arg1> ... [: <ResultType>]`
  if (tokens[0] === 'prim') {
    const op = tokens[1];
    const colonIdx = tokens.indexOf(':');
    const argTokens = colonIdx === -1 ? tokens.slice(2) : tokens.slice(2, colonIdx);
    const args = argTokens.map((a) => compileLexExprToTs(a, ctx, localEnv, usedLocals));
    switch (op) {
      case 'multiply':
        return `_natMul(${args[0]}, ${args[1]})`;
      case 'subtract':
        return `_natSub(${args[0]}, ${args[1]})`;
      case 'quotient':
        return `_natQuot(${args[0]}, ${args[1]}${args[2] ? `, ${args[2]}` : ''})`;
      case 'remainder':
        return `_natRem(${args[0]}, ${args[1]}${args[2] ? `, ${args[2]}` : ''})`;
      case 'equal':
        return `_valEq(${args[0]}, ${args[1]})`;
      case 'length':
        return `BigInt(${args[0]}.length)`;
      case 'to_nat':
        return `${args[0]}`;
      case 'index':
        return `_bytesIndex(${args[0]}, ${args[1]})`;
      case 'slice':
        return `_bytesSlice(${args[0]}, ${args[1]}, ${args[2]})`;
      case 'append':
        return `_bytesAppend(${args[0]}, ${args[1]})`;
      case 'compare_bytes':
        return `_bytesCmp(${args[0]}, ${args[1]})`;
      default:
        throw new Error(`Unsupported prim op '${op}' in ${ctx.currentModule}`);
    }
  }

  // Definition call: `fn arg1 arg2` or `Module.Name::fn arg1 arg2`
  const fnToken = tokens[0];
  let targetModule = ctx.currentModule;
  let defName = fnToken;
  if (fnToken.includes('::')) {
    const parts = fnToken.split('::');
    targetModule = parts[0];
    defName = parts[1];
  }
  const targetModObj = ctx.moduleMap.get(targetModule);
  if (!targetModObj || !targetModObj.definitions.has(defName)) {
    throw new Error(
      `Unknown definition '${targetModule}::${defName}' referenced in ${ctx.currentModule} (${expr})`,
    );
  }
  const compiledArgs = tokens
    .slice(1)
    .map((t) => compileLexExprToTs(t, ctx, localEnv, usedLocals));
  return `${moduleToTsSlug(targetModule)}_${defName}(${compiledArgs.join(', ')})`;
}

export interface MechanizedPredicateDescriptor {
  moduleName: string;
  name: string;
  parameters: { name: string; lexType: string }[];
  resultType: string;
}

export function computePrismSourceDigest(prismDir: string): string {
  const hash = crypto.createHash('sha256');
  const specJsonPath = path.join(prismDir, 'spec.json');
  if (fs.existsSync(specJsonPath)) {
    hash.update('spec.json\0');
    hash.update(fs.readFileSync(specJsonPath));
    hash.update('\0');
  }
  const srcDir = path.join(prismDir, 'src');
  const lexFiles: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.lex.tex')) lexFiles.push(full);
    }
  }
  walk(srcDir);
  lexFiles.sort((a, b) => a.localeCompare(b));
  for (const file of lexFiles) {
    const rel = path.relative(prismDir, file).replace(/\\/g, '/');
    hash.update(`${rel}\0`);
    hash.update(fs.readFileSync(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

export function renderGeneratedPrismRuntimeSource(prismDir: string): string {
  const prismSrcDir = path.join(prismDir, 'src');
  const orderedModules = loadFullPrismModuleGraph(prismSrcDir);
  const moduleMap = new Map<string, FullLexModule>(orderedModules.map((m) => [m.moduleName, m]));

  // Verify Foundation purity on every compile
  const legacyModules = loadAllPrismModules(prismSrcDir);
  verifyNoUnprovedTrueLiteralsInFoundationModules(legacyModules);

  const sourceTreeDigestSha256 = computePrismSourceDigest(prismDir);

  const typeLines: string[] = [];
  const fnLines: string[] = [];
  const namespaceEntries: string[] = [];

  let inductiveCount = 0;
  let structureCount = 0;
  let definitionCount = 0;
  let theoremCount = 0;

  const counterexamplePredicates: MechanizedPredicateDescriptor[] = [];
  const verificationPredicates: MechanizedPredicateDescriptor[] = [];
  const domainStepFunctions: MechanizedPredicateDescriptor[] = [];

  for (const mod of orderedModules) {
    const modSlug = moduleToTsSlug(mod.moduleName);
    theoremCount += mod.theorems.length;

    for (const ind of mod.inductives) {
      inductiveCount++;
      const unionArms = ind.constructors.map((c) => JSON.stringify(c.name)).join(' | ') || 'never';
      typeLines.push(`export type ${modSlug}_${ind.name} = ${unionArms};`);
    }

    for (const st of mod.structures) {
      structureCount++;
      const fieldLines = st.fields.map(
        (f) => `  readonly ${f.name}: ${compileLexTypeToTs(f.type, mod.moduleName, moduleMap)};`,
      );
      typeLines.push(
        `export interface ${modSlug}_${st.name} {\n${fieldLines.join('\n')}\n}`,
      );
    }

    const modPropLines: string[] = [];
    for (const [defName, def] of mod.definitions.entries()) {
      definitionCount++;
      let tempCounter = 0;
      const ctx: CompileContext = {
        currentModule: mod.moduleName,
        moduleMap,
        nextTempId: () => tempCounter++,
      };

      const paramTsIdents = def.parameters.map((p) => safeLocalIdent(p.name));
      const localEnv: Record<string, string> = {};
      for (let i = 0; i < def.parameters.length; i++) {
        localEnv[def.parameters[i].name] = paramTsIdents[i];
      }

      const usedLocals = new Set<string>();
      const bodyCode = compileLexExprToTs(def.bodyRaw, ctx, localEnv, usedLocals);
      const retTsType = compileLexTypeToTs(def.resultType, mod.moduleName, moduleMap);
      const exportFnName = `${modSlug}_${defName}`;

      if (def.parameters.length === 0) {
        const cacheVar = `_c_${exportFnName}`;
        fnLines.push(
          `let ${cacheVar}: ${retTsType} | undefined;\nexport function ${exportFnName}(): ${retTsType} {\n  return ${cacheVar} !== undefined ? ${cacheVar} : (${cacheVar} = ${bodyCode});\n}`,
        );
      } else if (
        def.recursiveArgument &&
        def.parameters.length === 1 &&
        stripOuterParens(def.parameters[0].type) === 'Nat'
      ) {
        const pIdent = paramTsIdents[0];
        const memoVar = `_memo_${exportFnName}`;
        fnLines.push(
          `const ${memoVar} = new Map<bigint, ${retTsType}>();\nexport function ${exportFnName}(${pIdent}: bigint): ${retTsType} {\n  const hit = ${memoVar}.get(${pIdent});\n  if (hit !== undefined) return hit;\n  const val = ${bodyCode};\n  ${memoVar}.set(${pIdent}, val);\n  return val;\n}`,
        );
      } else {
        const paramSig = def.parameters
          .map((p, idx) => {
            const pIdent = paramTsIdents[idx];
            const emittedName = usedLocals.has(pIdent) ? pIdent : `_${pIdent}`;
            const pType = compileLexTypeToTs(p.type, mod.moduleName, moduleMap);
            return `${emittedName}: ${pType}`;
          })
          .join(', ');
        fnLines.push(
          `export function ${exportFnName}(${paramSig}): ${retTsType} {\n  return ${bodyCode};\n}`,
        );
      }

      modPropLines.push(`    ${JSON.stringify(defName)}: ${exportFnName},`);

      const descriptor: MechanizedPredicateDescriptor = {
        moduleName: mod.moduleName,
        name: defName,
        parameters: def.parameters.map((p) => ({ name: p.name, lexType: stripOuterParens(p.type) })),
        resultType: stripOuterParens(def.resultType),
      };

      if (defName.startsWith('breaks') && descriptor.resultType === 'Bool') {
        counterexamplePredicates.push(descriptor);
      } else if (defName.startsWith('verify') && descriptor.resultType === 'Bool') {
        verificationPredicates.push(descriptor);
      } else if (defName.startsWith('step') && descriptor.resultType === 'Nat') {
        domainStepFunctions.push(descriptor);
      }
    }

    namespaceEntries.push(
      `  ${JSON.stringify(mod.moduleName)}: {\n${modPropLines.join('\n')}\n  },`,
    );
  }

  const manifest = {
    sourceTreeDigestSha256,
    moduleCount: orderedModules.length,
    inductiveCount,
    structureCount,
    definitionCount,
    theoremCount,
    modules: orderedModules.map((m) => ({
      moduleName: m.moduleName,
      imports: m.imports,
      inductiveCount: m.inductives.length,
      structureCount: m.structures.length,
      definitionCount: m.definitions.size,
      theoremCount: m.theorems.length,
    })),
    counterexamplePredicates,
    verificationPredicates,
    domainStepFunctions,
  };

  return `// AUTO-GENERATED BY \`scripts/prismMechanizer.ts\` DIRECTLY FROM ALL 27 \`/prism/src/**/*.lex.tex\` MODULES.
// DO NOT EDIT THIS FILE BY HAND — EVERY TYPE, RECORD, AND FUNCTION IS MECHANICALLY TRANSPILED FROM FORMAL PRISM LEXLEAN.

export type PrismBytes = Uint8Array;
export type PrismOrdering = 'lt' | 'eq' | 'gt';
export type PrismOption<T> =
  | { readonly tag: 'none' }
  | { readonly tag: 'some'; readonly value: T };

const _utf8Encoder = new TextEncoder();
const _utf8Decoder = new TextDecoder('utf-8', { fatal: false });
const _hexCache = new Map<string, Uint8Array>();

function _hex(hex: string): Uint8Array {
  const cached = _hexCache.get(hex);
  if (cached) return cached;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    out[i >> 1] = parseInt(hex.slice(i, i + 2), 16);
  }
  _hexCache.set(hex, out);
  return out;
}

export function encodeUtf8ToPrismBytes(text: string): Uint8Array {
  return _utf8Encoder.encode(text);
}

export function decodePrismBytesToUtf8(bytes: Uint8Array): string {
  return _utf8Decoder.decode(bytes);
}

export function toPrismNat(value: number | bigint): bigint {
  if (typeof value === 'bigint') return value >= 0n ? value : 0n;
  if (!Number.isFinite(value) || value <= 0) return 0n;
  return BigInt(Math.round(value));
}

function _natSub(a: bigint, b: bigint): bigint {
  const d = a - b;
  return d > 0n ? d : 0n;
}

function _natMul(a: bigint, b: bigint): bigint {
  return a * b;
}

function _natQuot(a: bigint, b: bigint, fallback = 0n): bigint {
  return b === 0n ? fallback : a / b;
}

function _natRem(a: bigint, b: bigint, fallback = 0n): bigint {
  return b === 0n ? fallback : a % b;
}

function _bytesAppend(left: Uint8Array, right: Uint8Array): Uint8Array {
  const out = new Uint8Array(left.length + right.length);
  out.set(left, 0);
  out.set(right, left.length);
  return out;
}

function _bytesIndex(value: Uint8Array, offset: bigint): PrismOption<bigint> {
  if (offset < 0n || offset >= BigInt(value.length)) {
    return { tag: 'none' };
  }
  return { tag: 'some', value: BigInt(value[Number(offset)]) };
}

function _bytesSlice(value: Uint8Array, start: bigint, count: bigint): PrismOption<Uint8Array> {
  const len = BigInt(value.length);
  if (start < 0n || count < 0n || start + count > len) {
    return { tag: 'none' };
  }
  const st = Number(start);
  return { tag: 'some', value: value.subarray(st, st + Number(count)) };
}

function _bytesCmp(left: Uint8Array, right: Uint8Array): PrismOrdering {
  const len = Math.min(left.length, right.length);
  for (let i = 0; i < len; i++) {
    if (left[i] < right[i]) return 'lt';
    if (left[i] > right[i]) return 'gt';
  }
  if (left.length < right.length) return 'lt';
  if (left.length > right.length) return 'gt';
  return 'eq';
}

function _valEq(a: unknown, b: unknown): boolean {
  if (a instanceof Uint8Array && b instanceof Uint8Array) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return a === b;
}

// ============================================================================
// Mechanized TypeScript Types Transpiled from Formal LexLean Structures
// ============================================================================

${typeLines.join('\n\n')}

// ============================================================================
// Mechanized Executable Functions Transpiled from Formal LexLean Definitions
// ============================================================================

${fnLines.join('\n\n')}

// ============================================================================
// High-Level Compiled Prism Dispatch Helpers & Module Namespace Registry
// ============================================================================

export function dispatchPrismTextRequest(requestText: string): string {
  return decodePrismBytesToUtf8(VerdantResonance_dispatch(encodeUtf8ToPrismBytes(requestText)));
}

export function decodePrismTextRequest(
  requestText: string,
): PrismOption<VerdantResonance_Request> {
  const bytes = encodeUtf8ToPrismBytes(requestText);
  if (bytes.length > 184) return { tag: 'none' };
  return VerdantResonance_decodeField1(bytes, 0n);
}

export const PRISM_COMPILED_MODULES = {
${namespaceEntries.join('\n')}
} as const;

export type PrismCompiledModuleName = keyof typeof PRISM_COMPILED_MODULES;

export const GENERATED_PRISM_MECHANIZED_MANIFEST = ${JSON.stringify(manifest, null, 2)} as const;
`;
}

// ============================================================================
// Declarative `prism/spec.json` <-> `prism/SPEC.md` & `VerdantResonance.lex.tex`
// ============================================================================

function kebabToPascal(s: string): string {
  return s
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function encodeUtf8ToHexLiteral(text: string): string {
  return `0x${Buffer.from(text, 'utf8').toString('hex')}`;
}

export function renderPrismSpecMarkdown(rawSpec: any): string {
  const fieldRows = rawSpec.fields
    .map((f: any) => {
      if (f.kind === 'choice') {
        const vals = f.values.map((v: string) => `\`${v}\``).join(', ');
        return `| \`${f.name}\` | choice | ${vals} |`;
      }
      return `| \`${f.name}\` | number | whole number from ${f.min ?? 0} up to ${f.max ?? 100} |`;
    })
    .join('\n');

  const outcomeList = rawSpec.outcomes.map((o: string) => `\`${o}\``).join(', ');

  const ruleLines = rawSpec.rules
    .map((r: any, idx: number) => {
      const formattedSays = r.says.endsWith(`the answer is ${r.then}.`)
        ? `${r.says.slice(0, -(`${r.then}.`.length))}\`${r.then}\`.`
        : r.says;
      return `- **${r.id}** ${formattedSays} (\`rule${idx + 1}\`)`;
    })
    .join('\n');

  const propLines = rawSpec.properties
    .map((p: any, idx: number) => {
      const invId = `inv${String(idx + 1).padStart(3, '0')}Holds`;
      const formattedSays = p.says.replace(`answers ${p.then}`, `answers \`${p.then}\``);
      return `- **${p.id}** ${formattedSays} proved by Lean. (theorem \`${invId}\`)`;
    })
    .join('\n');

  const exampleLines = rawSpec.examples
    .map((ex: any) => `- \`${ex.request}\` gives \`${ex.response}\``)
    .join('\n');

  return `# ${rawSpec.title}

<!-- Generated by Prism from prism/spec.json. Change the app through your agent with /prism, not by editing this file. -->

${rawSpec.purpose}

## Request

A request is one line of ${rawSpec.fields.length} fields separated by single spaces, in this order. Anything else is answered \`invalid\`.

| Field | Kind | Accepts |
| --- | --- | --- |
${fieldRows}

The answer is one of ${outcomeList}, or \`invalid\`.

## Rules

The first rule that matches decides.

${ruleLines}
- **Otherwise** the answer is \`${rawSpec.otherwise}\`.

## Properties

${propLines}

## Examples

${exampleLines}

## What is proved and what is tested

Lean proves each property marked proved above, for every request that decodes, with no exceptions and no sampling. The proof is about \`judge\`, the function the WebAssembly guest runs, because both come from the same model.

The parsing of requests is tested, not proved: the acceptance vectors in the app replay through the built guest, including malformed and oversized requests.

Nothing here says the rules are the right rules. That is the part only you can judge.

## Files

- \`prism/spec.json\` is this spec as data.
- \`src/VerdantResonance.lex.tex\` is the LexLean model generated from it. It is the single source of the app.
`;
}

export function compileSpecRuleBodyToLex(rule: any): string {
  const condExprs = rule.when.map((c: any) => {
    const proj = `(project request ${c.field})`;
    if (c.op === 'is') {
      const sym = `${c.field}${kebabToPascal(String(c.value))}`;
      return `(${proj} =? (${sym}))`;
    }
    if (c.op === '=') {
      return `(${proj} =? ${c.value})`;
    }
    if (c.op === '<=') {
      return `(${proj} <=? ${c.value})`;
    }
    if (c.op === '<') {
      return `(${proj} <? ${c.value})`;
    }
    if (c.op === '>=') {
      return `(${c.value} <=? ${proj})`;
    }
    if (c.op === '>') {
      return `(${c.value} <? ${proj})`;
    }
    throw new Error(`Unsupported condition op '${c.op}' in spec rule ${rule.id}`);
  });
  let acc = condExprs[0];
  for (let i = 1; i < condExprs.length; i++) {
    acc = `(${acc} && ${condExprs[i]})`;
  }
  return acc;
}

export function compileSpecChoiceParserBodyToLex(field: any): string {
  let expr = '(ctor Option.none [Nat])';
  for (let i = field.values.length - 1; i >= 0; i--) {
    const v = field.values[i];
    const hex = encodeUtf8ToHexLiteral(v);
    const sym = `${field.name}${kebabToPascal(v)}`;
    expr = `(if (prim equal value ${hex} : Bool) then (ctor Option.some [Nat] (${sym})) else ${expr})`;
  }
  return expr;
}

export function compileSpecEncodeAnswerBodyToLex(outcomes: string[]): string {
  let expr = encodeUtf8ToHexLiteral('invalid');
  for (let i = outcomes.length - 1; i >= 0; i--) {
    const o = outcomes[i];
    const sym = `answer${kebabToPascal(o)}`;
    const hex = encodeUtf8ToHexLiteral(o);
    expr = `(if (code =? (${sym})) then ${hex} else ${expr})`;
  }
  return expr;
}

export function compileAcceptanceVectorConsListToLex(
  vectors: ReadonlyArray<{ readonly requestHex: string; readonly responseHex: string }>,
): string {
  let expr = '(nil Foundation.View.Text.V1.Model::AcceptanceVector)';
  for (let i = vectors.length - 1; i >= 0; i--) {
    const v = vectors[i];
    expr = `(cons (record Foundation.View.Text.V1.Model::AcceptanceVector {request := ${v.requestHex}, response := ${v.responseHex}}) ${expr})`;
  }
  return expr;
}

const BOUNDARY_SWEEP_SENTINEL_HEX = encodeUtf8ToHexLiteral(
  'meadow chime-lily observe dawn dormant 0 0',
);

function syncSpecExamplesInAcceptanceVectors(
  lexSource: string,
  examples: ReadonlyArray<{ readonly request: string; readonly response: string }>,
): string {
  const marker = 'acceptanceVectors := (';
  const markerIdx = lexSource.indexOf(marker);
  if (markerIdx === -1) return lexSource;
  const openParenIdx = markerIdx + marker.length - 1;
  const { content, endIdx } = findBalancedDelimiter(lexSource, openParenIdx, '(', ')');
  const fullExpr = `(${content})`;

  const vecRegex =
    /AcceptanceVector\s*\{request\s*:=\s*(0x[0-9a-fA-F]*),\s*response\s*:=\s*(0x[0-9a-fA-F]*)\}/g;
  const existingVectors: Array<{ requestHex: string; responseHex: string }> = [];
  let vm: RegExpExecArray | null;
  while ((vm = vecRegex.exec(fullExpr)) !== null) {
    existingVectors.push({ requestHex: vm[1], responseHex: vm[2] });
  }
  if (existingVectors.length === 0) return lexSource;

  const boundaryIdx = existingVectors.findIndex(
    (v) => v.requestHex === BOUNDARY_SWEEP_SENTINEL_HEX,
  );
  const tailVectors =
    boundaryIdx >= 0 ? existingVectors.slice(boundaryIdx) : existingVectors.slice(examples.length);

  const exampleVectors = examples.map((ex) => ({
    requestHex: encodeUtf8ToHexLiteral(ex.request),
    responseHex: encodeUtf8ToHexLiteral(ex.response),
  }));

  const expectedConsExpr = compileAcceptanceVectorConsListToLex([
    ...exampleVectors,
    ...tailVectors,
  ]);
  if (expectedConsExpr === fullExpr) return lexSource;
  return lexSource.slice(0, openParenIdx) + expectedConsExpr + lexSource.slice(endIdx + 1);
}

function replaceLexDefinitionBody(lexSource: string, defName: string, newBody: string): string {
  const declRegex = /\bdefinition\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = declRegex.exec(lexSource)) !== null) {
    const openBraceIdx = m.index + m[0].length - 1;
    const { content, endIdx } = findBalancedDelimiter(lexSource, openBraceIdx, '{', '}');
    const name = extractTopLevelBlockField(content, 'name');
    if (name === defName) {
      const bodyMatch = /(?:^|,|\n)(\s*body\s*:\s*)/m.exec(content);
      if (!bodyMatch) return lexSource;
      const bodyValueStartInContent = bodyMatch.index + bodyMatch[0].length;
      let pDepth = 0;
      let bDepth = 0;
      let cDepth = 0;
      let inStr = false;
      let i = bodyValueStartInContent;
      for (; i < content.length; i++) {
        const ch = content[i];
        if (ch === '"' && content[i - 1] !== '\\') inStr = !inStr;
        if (inStr) continue;
        if (ch === '(') pDepth++;
        else if (ch === ')') pDepth--;
        else if (ch === '[') bDepth++;
        else if (ch === ']') bDepth--;
        else if (ch === '{') cDepth++;
        else if (ch === '}') cDepth--;
        else if (ch === ',' && pDepth === 0 && bDepth === 0 && cDepth === 0) {
          break;
        }
      }
      const absStart = openBraceIdx + 1 + bodyValueStartInContent;
      const absEnd = openBraceIdx + 1 + i;
      return lexSource.slice(0, absStart) + newBody + lexSource.slice(absEnd);
    }
    declRegex.lastIndex = endIdx + 1;
  }
  return lexSource;
}

export interface SpecMechanizationReport {
  specMdInSync: boolean;
  specMdUpdated: boolean;
  lexParsersAndRulesInSync: boolean;
  lexUpdated: boolean;
  driftDetails: string[];
}

export function syncOrCheckSpecToLexAndMarkdown(
  prismDir: string,
  options: { write: boolean },
): SpecMechanizationReport {
  const specJsonPath = path.join(prismDir, 'spec.json');
  const specMdPath = path.join(prismDir, 'SPEC.md');
  const verdantLexPath = path.join(prismDir, 'src', 'VerdantResonance.lex.tex');

  const rawSpec = JSON.parse(fs.readFileSync(specJsonPath, 'utf8'));
  const driftDetails: string[] = [];

  // 1. Check / sync prism/SPEC.md
  const expectedSpecMd = renderPrismSpecMarkdown(rawSpec);
  const currentSpecMd = fs.existsSync(specMdPath) ? fs.readFileSync(specMdPath, 'utf8') : '';
  const specMdInSync = currentSpecMd === expectedSpecMd;
  let specMdUpdated = false;
  if (!specMdInSync) {
    driftDetails.push('prism/SPEC.md differs from mechanized prism/spec.json projection');
    if (options.write) {
      specMdUpdated = writeFileIfChanged(specMdPath, expectedSpecMd);
    }
  }

  // 2. Check / sync choice parsers, rule1..ruleN, and encodeAnswer in VerdantResonance.lex.tex
  let lexText = fs.readFileSync(verdantLexPath, 'utf8');
  const originalLexText = lexText;

  for (const field of rawSpec.fields) {
    if (field.kind === 'choice') {
      const parserDefName = `parse${kebabToPascal(field.name)}`;
      const expectedBody = compileSpecChoiceParserBodyToLex(field);
      const patched = replaceLexDefinitionBody(lexText, parserDefName, expectedBody);
      if (patched !== lexText) {
        driftDetails.push(`VerdantResonance::${parserDefName} hex parser drifted from spec.json`);
        lexText = patched;
      }
    }
  }

  for (let i = 0; i < rawSpec.rules.length; i++) {
    const ruleDefName = `rule${i + 1}`;
    const expectedRuleBody = compileSpecRuleBodyToLex(rawSpec.rules[i]);
    const patched = replaceLexDefinitionBody(lexText, ruleDefName, expectedRuleBody);
    if (patched !== lexText) {
      driftDetails.push(
        `VerdantResonance::${ruleDefName} (${rawSpec.rules[i].id}) drifted from spec.json`,
      );
      lexText = patched;
    }
  }

  const expectedEncodeBody = compileSpecEncodeAnswerBodyToLex(rawSpec.outcomes);
  const patchedEncode = replaceLexDefinitionBody(lexText, 'encodeAnswer', expectedEncodeBody);
  if (patchedEncode !== lexText) {
    driftDetails.push('VerdantResonance::encodeAnswer hex outcomes drifted from spec.json');
    lexText = patchedEncode;
  }

  const patchedVectors = syncSpecExamplesInAcceptanceVectors(lexText, rawSpec.examples);
  if (patchedVectors !== lexText) {
    driftDetails.push(
      'VerdantResonance::application.acceptanceVectors positive examples drifted from spec.json',
    );
    lexText = patchedVectors;
  }

  const lexParsersAndRulesInSync = lexText === originalLexText;
  let lexUpdated = false;
  if (!lexParsersAndRulesInSync && options.write) {
    lexUpdated = writeFileIfChanged(verdantLexPath, lexText);
  }

  return {
    specMdInSync,
    specMdUpdated,
    lexParsersAndRulesInSync,
    lexUpdated,
    driftDetails,
  };
}

// ============================================================================
// Incremental Content-Addressed Cache & End-to-End Mechanization Orchestrator
// ============================================================================

interface MechanizerCacheState {
  inputDigestSha256: string;
  constantsSha256: string;
  runtimeSha256: string;
  specMdSha256: string;
  updatedAtIso: string;
}

function sha256OfString(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function sha256OfFile(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function computeFullPipelineInputDigest(projectRoot: string): string {
  const prismDir = path.join(projectRoot, 'prism');
  const hash = crypto.createHash('sha256');
  hash.update(computePrismSourceDigest(prismDir));
  for (const scriptRel of ['scripts/extractPrismArtifacts.ts', 'scripts/prismMechanizer.ts']) {
    const full = path.join(projectRoot, scriptRel);
    if (fs.existsSync(full)) {
      hash.update(scriptRel);
      hash.update(fs.readFileSync(full));
    }
  }
  return hash.digest('hex');
}

export interface MechanizeRunResult {
  fromCache: boolean;
  durationMs: number;
  inputDigestSha256: string;
  constantsChanged: boolean;
  runtimeChanged: boolean;
  specReport: SpecMechanizationReport;
}

export function ensurePrismMechanizedArtifacts(
  projectRoot: string = process.cwd(),
  options: { force?: boolean; checkOnly?: boolean } = {},
): MechanizeRunResult {
  const t0 = performance.now();
  const prismDir = path.join(projectRoot, 'prism');
  const prismSrcDir = path.join(prismDir, 'src');
  const specMdPath = path.join(prismDir, 'SPEC.md');
  const constantsOutPath = path.join(projectRoot, 'src', 'game', 'generatedPrismConstants.ts');
  const runtimeOutPath = path.join(projectRoot, 'src', 'game', 'generatedPrismRuntime.ts');
  const cachePath = path.join(
    projectRoot,
    'node_modules',
    '.cache',
    'prism-mechanizer-state.json',
  );

  if (!options.force && !options.checkOnly && fs.existsSync(cachePath)) {
    try {
      const cached: MechanizerCacheState = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const currentInputDigest = computeFullPipelineInputDigest(projectRoot);
      if (
        cached.inputDigestSha256 === currentInputDigest &&
        sha256OfFile(constantsOutPath) === cached.constantsSha256 &&
        sha256OfFile(runtimeOutPath) === cached.runtimeSha256 &&
        sha256OfFile(specMdPath) === cached.specMdSha256
      ) {
        return {
          fromCache: true,
          durationMs: Number((performance.now() - t0).toFixed(2)),
          inputDigestSha256: currentInputDigest,
          constantsChanged: false,
          runtimeChanged: false,
          specReport: {
            specMdInSync: true,
            specMdUpdated: false,
            lexParsersAndRulesInSync: true,
            lexUpdated: false,
            driftDetails: [],
          },
        };
      }
    } catch {
      // Proceed with full mechanized compile on corrupt/stale cache
    }
  }

  const specReport = syncOrCheckSpecToLexAndMarkdown(prismDir, {
    write: !options.checkOnly,
  });

  const expectedConstants = renderGeneratedPrismConstantsSource(prismSrcDir);
  const expectedRuntime = renderGeneratedPrismRuntimeSource(prismDir);

  if (options.checkOnly) {
    const currentConstants = fs.existsSync(constantsOutPath)
      ? fs.readFileSync(constantsOutPath, 'utf8')
      : '';
    const currentRuntime = fs.existsSync(runtimeOutPath)
      ? fs.readFileSync(runtimeOutPath, 'utf8')
      : '';
    const constantsChanged = currentConstants !== expectedConstants;
    const runtimeChanged = currentRuntime !== expectedRuntime;
    if (constantsChanged) {
      specReport.driftDetails.push(
        'src/game/generatedPrismConstants.ts is out of date with prism/src/**/*.lex.tex',
      );
    }
    if (runtimeChanged) {
      specReport.driftDetails.push(
        'src/game/generatedPrismRuntime.ts is out of date with prism/src/**/*.lex.tex',
      );
    }
    return {
      fromCache: false,
      durationMs: Number((performance.now() - t0).toFixed(2)),
      inputDigestSha256: computeFullPipelineInputDigest(projectRoot),
      constantsChanged,
      runtimeChanged,
      specReport,
    };
  }

  const constantsChanged = writeFileIfChanged(constantsOutPath, expectedConstants);
  const runtimeChanged = writeFileIfChanged(runtimeOutPath, expectedRuntime);
  const finalInputDigest = computeFullPipelineInputDigest(projectRoot);

  const nextCache: MechanizerCacheState = {
    inputDigestSha256: finalInputDigest,
    constantsSha256: sha256OfString(expectedConstants),
    runtimeSha256: sha256OfString(expectedRuntime),
    specMdSha256: sha256OfFile(specMdPath) ?? '',
    updatedAtIso: new Date().toISOString(),
  };
  try {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    fs.writeFileSync(cachePath, JSON.stringify(nextCache, null, 2), 'utf8');
  } catch {
    // Non-fatal if node_modules/.cache is read-only
  }

  return {
    fromCache: false,
    durationMs: Number((performance.now() - t0).toFixed(2)),
    inputDigestSha256: finalInputDigest,
    constantsChanged,
    runtimeChanged,
    specReport,
  };
}

export interface LeanAttestationSummary {
  available: boolean;
  attestationId: string | null;
  buildId: string | null;
  declarationCount: number;
  allOk: boolean;
  observedAxioms: string[];
  sorryDetected: boolean;
}

export function inspectLeanAttestationStatus(
  projectRoot: string = process.cwd(),
): LeanAttestationSummary {
  const verifiedDir = path.join(projectRoot, 'prism', '.lexlean', 'verified');
  if (!fs.existsSync(verifiedDir)) {
    return {
      available: false,
      attestationId: null,
      buildId: null,
      declarationCount: 0,
      allOk: false,
      observedAxioms: [],
      sorryDetected: false,
    };
  }

  const dirs = fs
    .readdirSync(verifiedDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const attPath = path.join(verifiedDir, d.name, 'attestation.json');
      const mtimeMs = fs.existsSync(attPath) ? fs.statSync(attPath).mtimeMs : 0;
      return { name: d.name, attPath, mtimeMs };
    })
    .filter((d) => d.mtimeMs > 0)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (dirs.length === 0) {
    return {
      available: false,
      attestationId: null,
      buildId: null,
      declarationCount: 0,
      allOk: false,
      observedAxioms: [],
      sorryDetected: false,
    };
  }

  const latest = JSON.parse(fs.readFileSync(dirs[0].attPath, 'utf8'));
  const declarations: any[] = Array.isArray(latest.declarations) ? latest.declarations : [];
  const axiomSet = new Set<string>();
  let allOk = declarations.length > 0;
  for (const decl of declarations) {
    if (decl.result !== 'ok') allOk = false;
    if (Array.isArray(decl.observed)) {
      for (const ax of decl.observed) axiomSet.add(String(ax));
    }
  }
  const observedAxioms = [...axiomSet].sort();
  const sorryDetected = observedAxioms.some((a) => a.toLowerCase().includes('sorry'));

  return {
    available: true,
    attestationId: latest.attestation_id ?? dirs[0].name,
    buildId: latest.build_id ?? null,
    declarationCount: declarations.length,
    allOk,
    observedAxioms,
    sorryDetected,
  };
}
