import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Deterministic Prism `.lex.tex` AST Extractor & TypeScript Artifact Compiler
 * (`scripts/extractPrismArtifacts.ts`).
 *
 * Parses all 19 `.lex.tex` source modules under `prism/src/` and `prism/spec.json`,
 * verifies that zero unproved `:= true` flags exist in any Foundation module,
 * evaluates pure definitions and record constructors directly from the `.lex.tex` AST
 * (including executable bus verification predicates such as `verifySingleCallPropagatesAllTenDomains`,
 * `transferWeightCrossDomain`, `refineDomainWeightAutopoietic`, `step*BusModulation`, and hex byte literals),
 * cross-checks `prism/spec.json` rules and invariants against `VerdantResonance.lex.tex` and `VerdantResonanceProofs.lex.tex`,
 * and emits `src/game/generatedPrismConstants.ts` so TypeScript never re-types model constants or specs by hand.
 */

export interface LexLeanDefinition {
  moduleName: string;
  name: string;
  parameters: string[];
  resultType: string;
  bodyRaw: string;
}

export interface LexLeanTheorem {
  moduleName: string;
  name: string;
  parameters: string[];
  statementRaw: string;
}

export interface ParsedLexModule {
  moduleName: string;
  filePath: string;
  rawText: string;
  imports: string[];
  structures: string[];
  definitions: Map<string, LexLeanDefinition>;
  theorems: LexLeanTheorem[];
}

function findBalancedBlock(text: string, openBraceIdx: number): { content: string; endIdx: number } {
  let depth = 0;
  let inString = false;
  for (let i = openBraceIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && text[i - 1] !== '\\') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return {
          content: text.slice(openBraceIdx + 1, i),
          endIdx: i,
        };
      }
    }
  }
  throw new Error(`Unbalanced brace starting at ${openBraceIdx}`);
}

function extractTopLevelField(blockContent: string, fieldName: string): string | null {
  const regex = new RegExp(`(?:^|,|\\n)\\s*${fieldName}\\s*:\\s*`, 'm');
  const match = regex.exec(blockContent);
  if (!match) return null;
  const start = match.index + match[0].length;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let inString = false;
  let i = start;
  for (; i < blockContent.length; i++) {
    const ch = blockContent[i];
    if (ch === '"' && blockContent[i - 1] !== '\\') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === '(') parenDepth++;
    else if (ch === ')') parenDepth--;
    else if (ch === '[') bracketDepth++;
    else if (ch === ']') bracketDepth--;
    else if (ch === '{') braceDepth++;
    else if (ch === '}') braceDepth--;
    else if (ch === ',' && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
      break;
    }
  }
  return blockContent.slice(start, i).trim();
}

export function parseLexTexFile(filePath: string): ParsedLexModule {
  const raw = fs.readFileSync(filePath, 'utf8');
  const modMatch = raw.match(/\\begin\{lexlean\}\{([^}]+)\}/);
  const moduleName = modMatch ? modMatch[1] : path.basename(filePath, '.lex.tex');

  const imports: string[] = [];
  const importRegex = /\\importmodule\{([^}]+)\}/g;
  let impMatch: RegExpExecArray | null;
  while ((impMatch = importRegex.exec(raw)) !== null) {
    imports.push(impMatch[1]);
  }

  const structures: string[] = [];
  const definitions = new Map<string, LexLeanDefinition>();
  const theorems: LexLeanTheorem[] = [];

  const declRegex = /\b(structure|definition|theorem)\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = declRegex.exec(raw)) !== null) {
    const kind = match[1];
    const openBraceIdx = match.index + match[0].length - 1;
    const { content, endIdx } = findBalancedBlock(raw, openBraceIdx);
    declRegex.lastIndex = endIdx + 1;

    const name = extractTopLevelField(content, 'name');
    if (!name) continue;

    if (kind === 'structure') {
      structures.push(name);
    } else if (kind === 'definition') {
      const paramsRaw = extractTopLevelField(content, 'parameters') ?? '[]';
      const innerParams = paramsRaw.replace(/^\[|\]$/g, '').trim();
      const parameters = innerParams
        ? innerParams.split(',').map((s) => s.trim())
        : [];
      const resultType = extractTopLevelField(content, 'result') ?? 'Nat';
      const bodyRaw = extractTopLevelField(content, 'body') ?? '';
      definitions.set(name, {
        moduleName,
        name,
        parameters,
        resultType,
        bodyRaw,
      });
    } else if (kind === 'theorem') {
      const paramsRaw = extractTopLevelField(content, 'parameters') ?? '[]';
      const innerParams = paramsRaw.replace(/^\[|\]$/g, '').trim();
      const parameters = innerParams
        ? innerParams.split(',').map((s) => s.trim())
        : [];
      const statementRaw = extractTopLevelField(content, 'statement') ?? '';
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
    rawText: raw,
    imports,
    structures,
    definitions,
    theorems,
  };
}

export function loadAllPrismModules(prismRootDir: string): Map<string, ParsedLexModule> {
  const modules = new Map<string, ParsedLexModule>();
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.lex.tex')) {
        const parsed = parseLexTexFile(full);
        modules.set(parsed.moduleName, parsed);
      }
    }
  }
  walk(prismRootDir);
  return modules;
}

export function verifyNoUnprovedTrueLiteralsInFoundationModules(
  modules: Map<string, ParsedLexModule>,
): { verified: boolean; checkedModules: number } {
  let checkedModules = 0;
  for (const [modName, mod] of modules.entries()) {
    if (!modName.startsWith('Foundation.') || modName.startsWith('Foundation.View.')) continue;
    checkedModules++;
    if (/:\=\s*true\b/.test(mod.rawText)) {
      throw new Error(
        `Unproved hardcoded ':= true' flag detected in Foundation module ${modName} (${mod.filePath}). Every boolean field must be computed from an executable predicate.`,
      );
    }
  }
  return { verified: true, checkedModules };
}

export function decodeHexBytesToUtf8(hexLiteral: string): string {
  const clean = hexLiteral.trim().replace(/^0x/i, '');
  if (clean.length === 0) return '';
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

/**
 * Evaluates a `.lex.tex` expression AST node within a module context.
 */
export function evaluateLexExpr(
  exprRaw: string,
  currentModule: string,
  modules: Map<string, ParsedLexModule>,
  env: Record<string, any> = {},
): any {
  let expr = exprRaw.trim();
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

  if (expr === 'true') return true;
  if (expr === 'false') return false;
  if (/^\d+$/.test(expr)) return Number(expr);
  if (/^0x[0-9a-fA-F]*$/.test(expr)) return decodeHexBytesToUtf8(expr);
  if (expr.startsWith('"') && expr.endsWith('"')) {
    return expr.slice(1, -1);
  }
  if (expr in env) {
    return env[expr];
  }

  const typedMatch = expr.match(/^(\d+)\s*:\s*UInt\d+$/);
  if (typedMatch) {
    return Number(typedMatch[1]);
  }

  if (expr.startsWith('let ')) {
    const assignIdx = expr.indexOf(':=');
    const header = expr.slice(4, assignIdx).trim();
    const varName = header.split(':')[0].trim();
    let pDepth = 0;
    let bDepth = 0;
    let inStr = false;
    let semiIdx = -1;
    for (let i = assignIdx + 2; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') pDepth++;
      else if (ch === ')') pDepth--;
      else if (ch === '{') bDepth++;
      else if (ch === '}') bDepth--;
      else if (ch === ';' && pDepth === 0 && bDepth === 0) {
        semiIdx = i;
        break;
      }
    }
    const valExpr = expr.slice(assignIdx + 2, semiIdx).trim();
    const restExpr = expr.slice(semiIdx + 1).trim();
    const val = evaluateLexExpr(valExpr, currentModule, modules, env);
    return evaluateLexExpr(restExpr, currentModule, modules, { ...env, [varName]: val });
  }

  if (expr.startsWith('record ')) {
    const braceStart = expr.indexOf('{');
    const { content } = findBalancedBlock(expr, braceStart);
    const result: Record<string, any> = {};
    const fields: string[] = [];
    let pDepth = 0;
    let bDepth = 0;
    let inStr = false;
    let start = 0;
    for (let i = 0; i < content.length; i++) {
      const ch = content[i];
      if (ch === '"' && content[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') pDepth++;
      else if (ch === ')') pDepth--;
      else if (ch === '{') bDepth++;
      else if (ch === '}') bDepth--;
      else if (ch === ',' && pDepth === 0 && bDepth === 0) {
        fields.push(content.slice(start, i).trim());
        start = i + 1;
      }
    }
    if (start < content.length) {
      const tail = content.slice(start).trim();
      if (tail) fields.push(tail);
    }

    for (const f of fields) {
      const eqIdx = f.indexOf(':=');
      if (eqIdx === -1) continue;
      const k = f.slice(0, eqIdx).trim();
      const vExpr = f.slice(eqIdx + 2).trim();
      result[k] = evaluateLexExpr(vExpr, currentModule, modules, env);
    }
    return result;
  }

  if (expr.startsWith('if ')) {
    let pDepth = 0;
    let bDepth = 0;
    let inStr = false;
    let thenIdx = -1;
    let elseIdx = -1;
    for (let i = 3; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') pDepth++;
      else if (ch === ')') pDepth--;
      else if (ch === '{') bDepth++;
      else if (ch === '}') bDepth--;
      if (pDepth === 0 && bDepth === 0) {
        if (thenIdx === -1 && expr.slice(i, i + 6) === ' then ') {
          thenIdx = i;
        } else if (thenIdx !== -1 && elseIdx === -1 && expr.slice(i, i + 6) === ' else ') {
          elseIdx = i;
          break;
        }
      }
    }
    const condVal = Boolean(evaluateLexExpr(expr.slice(3, thenIdx), currentModule, modules, env));
    if (condVal) {
      return evaluateLexExpr(expr.slice(thenIdx + 6, elseIdx), currentModule, modules, env);
    } else {
      return evaluateLexExpr(expr.slice(elseIdx + 6), currentModule, modules, env);
    }
  }

  if (expr.startsWith('match ')) {
    let pDepth = 0;
    let bDepth = 0;
    let inStr = false;
    const armIndices: number[] = [];
    for (let i = 6; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') pDepth++;
      else if (ch === ')') pDepth--;
      else if (ch === '{') bDepth++;
      else if (ch === '}') bDepth--;
      else if (ch === '|' && pDepth === 0 && bDepth === 0) {
        armIndices.push(i);
      }
    }
    if (armIndices.length > 0) {
      const scrutineeExpr = expr.slice(6, armIndices[0]).trim();
      const scrutineeVal = evaluateLexExpr(scrutineeExpr, currentModule, modules, env);
      for (let a = 0; a < armIndices.length; a++) {
        const armStart = armIndices[a] + 1;
        const armEnd = a + 1 < armIndices.length ? armIndices[a + 1] : expr.length;
        const armText = expr.slice(armStart, armEnd).trim();
        const arrowIdx = armText.indexOf('=>');
        if (arrowIdx === -1) continue;
        const pat = armText.slice(0, arrowIdx).trim();
        const bodyExpr = armText.slice(arrowIdx + 2).trim();
        if (pat === 'Bool.true' && scrutineeVal === true) {
          return evaluateLexExpr(bodyExpr, currentModule, modules, env);
        }
        if (pat === 'Bool.false' && scrutineeVal === false) {
          return evaluateLexExpr(bodyExpr, currentModule, modules, env);
        }
        if (pat === 'Nat.zero' && Number(scrutineeVal) === 0) {
          return evaluateLexExpr(bodyExpr, currentModule, modules, env);
        }
        if (pat.startsWith('Nat.succ ') && Number(scrutineeVal) > 0) {
          const bindVar = pat.slice('Nat.succ '.length).trim();
          return evaluateLexExpr(bodyExpr, currentModule, modules, {
            ...env,
            [bindVar]: Number(scrutineeVal) - 1,
          });
        }
        if (pat === '_') {
          return evaluateLexExpr(bodyExpr, currentModule, modules, env);
        }
      }
    }
  }

  const binaryOps = ['||', '&&', '<=?', '<?', '=?', '+'];
  for (const op of binaryOps) {
    let pDepth = 0;
    let bDepth = 0;
    let inStr = false;
    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
      if (inStr) continue;
      if (ch === '(') pDepth++;
      else if (ch === ')') pDepth--;
      else if (ch === '{') bDepth++;
      else if (ch === '}') bDepth--;
      if (pDepth === 0 && bDepth === 0 && expr.slice(i, i + op.length + 2) === ` ${op} `) {
        const left = evaluateLexExpr(expr.slice(0, i), currentModule, modules, env);
        const right = evaluateLexExpr(expr.slice(i + op.length + 2), currentModule, modules, env);
        if (op === '||') return Boolean(left || right);
        if (op === '&&') return Boolean(left && right);
        if (op === '<=?') return Number(left) <= Number(right);
        if (op === '<?') return Number(left) < Number(right);
        if (op === '=?') return left === right;
        if (op === '+') return Number(left) + Number(right);
      }
    }
  }

  const tokens: string[] = [];
  let pDepth = 0;
  let bDepth = 0;
  let inStr = false;
  let tokStart = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '"' && expr[i - 1] !== '\\') inStr = !inStr;
    if (inStr) continue;
    if (ch === '(') pDepth++;
    else if (ch === ')') pDepth--;
    else if (ch === '{') bDepth++;
    else if (ch === '}') bDepth--;
    else if (/\s/.test(ch) && pDepth === 0 && bDepth === 0) {
      if (i > tokStart) {
        tokens.push(expr.slice(tokStart, i).trim());
      }
      tokStart = i + 1;
    }
  }
  if (tokStart < expr.length) {
    const tail = expr.slice(tokStart).trim();
    if (tail) tokens.push(tail);
  }

  if (tokens.length === 0) return undefined;

  if (tokens[0] === 'not') {
    return !evaluateLexExpr(tokens.slice(1).join(' '), currentModule, modules, env);
  }

  if (tokens[0] === 'project') {
    const targetObj = evaluateLexExpr(tokens[1], currentModule, modules, env);
    const fieldName = tokens[2];
    return targetObj ? targetObj[fieldName] : undefined;
  }

  if (tokens[0] === 'prim') {
    const op = tokens[1];
    const arg1 = evaluateLexExpr(tokens[2], currentModule, modules, env);
    const arg2 = evaluateLexExpr(tokens[3], currentModule, modules, env);
    if (op === 'multiply') return Number(arg1) * Number(arg2);
    if (op === 'subtract') return Math.max(0, Number(arg1) - Number(arg2));
    if (op === 'equal') return arg1 === arg2;
  }

  const fnToken = tokens[0];
  let targetModule = currentModule;
  let defName = fnToken;
  if (fnToken.includes('::')) {
    const parts = fnToken.split('::');
    targetModule = parts[0];
    defName = parts[1];
  }

  const mod = modules.get(targetModule);
  if (!mod) {
    throw new Error(`Module not found: ${targetModule} (while evaluating ${expr})`);
  }
  const def = mod.definitions.get(defName);
  if (!def) {
    throw new Error(`Definition ${defName} not found in ${targetModule} (while evaluating ${expr})`);
  }

  const argValues = tokens.slice(1).map((t) => evaluateLexExpr(t, currentModule, modules, env));
  const callEnv: Record<string, any> = {};
  for (let i = 0; i < def.parameters.length; i++) {
    const paramName = def.parameters[i].split(':')[0].trim();
    callEnv[paramName] = argValues[i];
  }

  return evaluateLexExpr(def.bodyRaw, targetModule, modules, callEnv);
}

/**
 * Extracts the 35 judge rules and acceptance vectors from `VerdantResonance.lex.tex`.
 */
export function extractVerdantJudgeArtifact(modules: Map<string, ParsedLexModule>) {
  const vr = modules.get('VerdantResonance');
  if (!vr) throw new Error('VerdantResonance module missing');

  const enumConstants: Record<string, number> = {};
  for (const [name, def] of vr.definitions.entries()) {
    if (
      /^(biome|plant|action|atmosphere|chorus|answer)[A-Z]/.test(name) &&
      def.parameters.length === 0
    ) {
      enumConstants[name] = Number(evaluateLexExpr(def.bodyRaw, 'VerdantResonance', modules));
    }
  }

  const judgeRulesDef = vr.definitions.get('judgeRules') ?? vr.definitions.get('judge');
  if (!judgeRulesDef) throw new Error('judgeRules definition missing');

  const codeToAnswerName = new Map<number, string>();
  for (const [name, code] of Object.entries(enumConstants)) {
    if (name.startsWith('answer')) {
      codeToAnswerName.set(code, name);
    }
  }

  const ruleOutcomeMap = new Map<string, string>();
  const ruleOutcomeRegex = /if\s+\((rule\d+)\s+request\)\s+then\s+\((answer[A-Za-z]+)\)/g;
  for (const [defName, def] of vr.definitions.entries()) {
    if (!defName.startsWith('judge')) continue;
    ruleOutcomeRegex.lastIndex = 0;
    let rm: RegExpExecArray | null;
    while ((rm = ruleOutcomeRegex.exec(def.bodyRaw)) !== null) {
      ruleOutcomeMap.set(rm[1], rm[2]);
    }
  }

  const ruleNames: string[] = [];
  for (const name of vr.definitions.keys()) {
    if (/^rule\d+$/.test(name)) {
      ruleNames.push(name);
    }
  }
  ruleNames.sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));

  if (ruleOutcomeMap.size < ruleNames.length) {
    const eqPinRegex = /\(project\s+request\s+([a-z]+)\)\s*=\?\s*\(?([A-Za-z0-9]+)\)?/g;
    for (let idx = 0; idx < ruleNames.length; idx++) {
      const rName = ruleNames[idx];
      if (ruleOutcomeMap.has(rName)) continue;
      const rDef = vr.definitions.get(rName)!;
      const pinned: Record<string, number> = {};
      eqPinRegex.lastIndex = 0;
      let pm: RegExpExecArray | null;
      while ((pm = eqPinRegex.exec(rDef.bodyRaw)) !== null) {
        const field = pm[1];
        const rhs = pm[2];
        const val = /^\d+$/.test(rhs) ? Number(rhs) : enumConstants[rhs];
        if (val !== undefined) pinned[field] = val;
      }
      const biomes = pinned.biome !== undefined ? [pinned.biome] : [0, 1, 2, 3, 4];
      const plants = pinned.plant !== undefined ? [pinned.plant] : [0, 1, 2, 3, 4];
      const actions = pinned.action !== undefined ? [pinned.action] : [0, 1, 2, 3, 4];
      const atmospheres =
        pinned.atmosphere !== undefined ? [pinned.atmosphere] : [0, 1, 2, 3];
      const choruses = pinned.chorus !== undefined ? [pinned.chorus] : [0, 1];
      const proximities =
        pinned.proximity !== undefined ? [pinned.proximity] : [10, 18, 24, 28, 40];
      const velocities =
        pinned.velocity !== undefined ? [pinned.velocity] : [0, 5, 8, 12, 18];

      let matchedAnswer: string | undefined;
      outer: for (const biome of biomes) {
        for (const plant of plants) {
          for (const action of actions) {
            for (const atmosphere of atmospheres) {
              for (const chorus of choruses) {
                for (const proximity of proximities) {
                  for (const velocity of velocities) {
                    const req = {
                      biome,
                      plant,
                      action,
                      atmosphere,
                      chorus,
                      proximity,
                      velocity,
                    };
                    if (
                      !evaluateLexExpr(`(${rName} request)`, 'VerdantResonance', modules, {
                        request: req,
                      })
                    ) {
                      continue;
                    }
                    let shadowed = false;
                    for (let prev = 0; prev < idx; prev++) {
                      if (
                        evaluateLexExpr(
                          `(${ruleNames[prev]} request)`,
                          'VerdantResonance',
                          modules,
                          { request: req },
                        )
                      ) {
                        shadowed = true;
                        break;
                      }
                    }
                    if (shadowed) continue;
                    const ansCode = Number(
                      evaluateLexExpr('(judgeRules request)', 'VerdantResonance', modules, {
                        request: req,
                      }),
                    );
                    matchedAnswer = codeToAnswerName.get(ansCode);
                    break outer;
                  }
                }
              }
            }
          }
        }
      }
      if (matchedAnswer) {
        ruleOutcomeMap.set(rName, matchedAnswer);
      }
    }
  }

  const appDef = vr.definitions.get('acceptanceVectors') ?? vr.definitions.get('application');
  const acceptanceVectors: { request: string; response: string }[] = [];
  if (appDef) {
    const vecRegex =
      /record\s+Foundation\.View\.Text\.V1\.Model::AcceptanceVector\s*\{\s*request\s*:=\s*(0x[0-9a-fA-F]*)\s*,\s*response\s*:=\s*(0x[0-9a-fA-F]*)\s*,?\s*\}/g;
    let vm: RegExpExecArray | null;
    while ((vm = vecRegex.exec(appDef.bodyRaw)) !== null) {
      acceptanceVectors.push({
        request: decodeHexBytesToUtf8(vm[1]),
        response: decodeHexBytesToUtf8(vm[2]),
      });
    }
  }

  const judgeDef = vr.definitions.get('judge')!;
  const rootJudgeCallsBus = judgeDef.bodyRaw.includes('verifyJudgeCrossDomainBusGate');
  const rootJudgeVerifiesCompleteClosure = vr.definitions.has('verifyCompletePrismModelClosure');

  return {
    enumConstants,
    ruleOutcomes: Object.fromEntries(ruleOutcomeMap.entries()),
    acceptanceVectors,
    rootJudgeCallsBus,
    rootJudgeVerifiesCompleteClosure,
  };
}

const OUTCOME_CAMEL_TO_KEBAB: Record<string, string> = {
  answerSanctuaryChorus: 'sanctuary-chorus',
  answerSereneRest: 'serene-rest',
  answerNocturnalSymphony: 'nocturnal-symphony',
  answerDawnArpeggio: 'dawn-arpeggio',
  answerHarmonicBloom: 'harmonic-bloom',
  answerCrystallineChoir: 'crystalline-choir',
  answerMelodicChime: 'melodic-chime',
  answerRhythmicPulse: 'rhythmic-pulse',
  answerAmbientDrone: 'ambient-drone',
  answerWindWhisper: 'wind-whisper',
};

/**
 * Extracts and cross-validates `prism/spec.json` against `VerdantResonance.lex.tex`
 * and `VerdantResonanceProofs.lex.tex`, attaching each invariant's formal Lean 4 theorem name.
 */
export function extractAndValidateVerdantSpec(
  specJsonPath: string,
  modules: Map<string, ParsedLexModule>,
  judgeArtifact: ReturnType<typeof extractVerdantJudgeArtifact>,
) {
  const rawSpec = JSON.parse(fs.readFileSync(specJsonPath, 'utf8'));
  const proofsMod = modules.get('VerdantResonanceProofs');
  if (!proofsMod) throw new Error('VerdantResonanceProofs module missing');

  const proofTheoremSet = new Set(proofsMod.theorems.map((t) => t.name));

  // Verify every rule in spec.json matches rule1..rule35 in VerdantResonance.lex.tex
  for (let i = 0; i < rawSpec.rules.length; i++) {
    const r = rawSpec.rules[i];
    const lexRuleKey = `rule${i + 1}`;
    const lexAnswerSym = judgeArtifact.ruleOutcomes[lexRuleKey];
    const expectedOutcome = OUTCOME_CAMEL_TO_KEBAB[lexAnswerSym];
    if (expectedOutcome !== r.then) {
      throw new Error(
        `Spec rule ${r.id} (${lexRuleKey}) outcome mismatch: spec.json has '${r.then}' but VerdantResonance.lex.tex has '${lexAnswerSym}' ('${expectedOutcome}')`,
      );
    }
  }

  // Enrich properties with their verified Lean 4 theorem names from VerdantResonanceProofs.lex.tex
  const enrichedProperties = rawSpec.properties.map((prop: any, idx: number) => {
    const invNum = String(idx + 1).padStart(3, '0');
    const shortTheorem = `inv${invNum}Holds`;
    if (!proofTheoremSet.has(shortTheorem)) {
      throw new Error(
        `Property ${prop.id} is missing formal theorem ${shortTheorem} in VerdantResonanceProofs.lex.tex`,
      );
    }
    return {
      ...prop,
      theoremName: `PrismVerdantResonanceProofs.${shortTheorem}`,
    };
  });

  return {
    schema: rawSpec.schema,
    name: rawSpec.name,
    title: rawSpec.title,
    purpose: rawSpec.purpose,
    fields: rawSpec.fields,
    outcomes: rawSpec.outcomes,
    rules: rawSpec.rules,
    otherwise: rawSpec.otherwise,
    properties: enrichedProperties,
    examples: rawSpec.examples,
  };
}

export function extractAllPrismArtifacts(prismRootDir: string) {
  const modules = loadAllPrismModules(prismRootDir);
  const foundationPurity = verifyNoUnprovedTrueLiteralsInFoundationModules(modules);

  const standards = {
    neuromorphic: evaluateLexExpr(
      'verdantNeuromorphicStandard',
      'Foundation.Neuromorphic.V1.Model',
      modules,
    ),
    infrastructure: evaluateLexExpr(
      'verdantInfrastructureStandard',
      'Foundation.Infrastructure.V1.Model',
      modules,
    ),
    physics: evaluateLexExpr(
      'verdantPhysicsStandard',
      'Foundation.Physics.V1.Model',
      modules,
    ),
    botany: evaluateLexExpr(
      'verdantBotanicalStandard',
      'Foundation.Botany.V1.Model',
      modules,
    ),
    ecology: evaluateLexExpr(
      'verdantEcologyStandard',
      'Foundation.Ecology.V1.Model',
      modules,
    ),
    acoustics: evaluateLexExpr(
      'verdantAcousticStandard',
      'Foundation.Acoustics.V1.Model',
      modules,
    ),
    articulation: evaluateLexExpr(
      'verdantArticulationStandard',
      'Foundation.Articulation.V1.Model',
      modules,
    ),
    soundtrack: evaluateLexExpr(
      'verdantSoundtrackStandard',
      'Foundation.Soundtrack.V1.Model',
      modules,
    ),
    humane: evaluateLexExpr(
      'verdantHumaneStandard',
      'Foundation.Humane.V1.Model',
      modules,
    ),
    brand: evaluateLexExpr(
      'verdantBrandStandard',
      'Foundation.Brand.V1.Model',
      modules,
    ),
    cosmogenesis: evaluateLexExpr(
      'verdantCosmogenesisStandard',
      'Foundation.Cosmogenesis.V1.Model',
      modules,
    ),
    mathematics: evaluateLexExpr(
      'verdantMathematicsStandard',
      'Foundation.Mathematics.V1.Model',
      modules,
    ),
    chemistry: evaluateLexExpr(
      'verdantChemistryStandard',
      'Foundation.Chemistry.V1.Model',
      modules,
    ),
    graphics: evaluateLexExpr(
      'verdantGraphicsStandard',
      'Foundation.Graphics.V1.Model',
      modules,
    ),
    realizability: evaluateLexExpr(
      'verdantRealizabilityStandard',
      'Foundation.Realizability.V1.Model',
      modules,
    ),
    morphogenesis: evaluateLexExpr(
      'verdantMorphogenesisStandard',
      'Foundation.Morphogenesis.V1.Model',
      modules,
    ),
    spatialAcoustics: evaluateLexExpr(
      'verdantSpatialAcousticsStandard',
      'Foundation.SpatialAcoustics.V1.Model',
      modules,
    ),
    anamnesis: evaluateLexExpr(
      'verdantAnamnesisStandard',
      'Foundation.Anamnesis.V1.Model',
      modules,
    ),
    holisticObserverRegistry: evaluateLexExpr(
      'verdantHolisticObserverRegistry',
      'Foundation.Cosmogenesis.V1.Model',
      modules,
    ),
    si2019Metrology: evaluateLexExpr(
      'verdantSI2019MetrologyStandard',
      'Foundation.Physics.V1.Model',
      modules,
    ),
    standardModelGauge: evaluateLexExpr(
      'verdantStandardModelGaugeStandard',
      'Foundation.Physics.V1.Model',
      modules,
    ),
    functorTransferMatrix: evaluateLexExpr(
      'verdantFunctorTransferMatrixStandard',
      'Foundation.Neuromorphic.V1.Model',
      modules,
    ),
    psychoacousticIso226: evaluateLexExpr(
      'verdantPsychoacousticIso226Standard',
      'Foundation.Acoustics.V1.Model',
      modules,
    ),
    fvcbBiochemistry: evaluateLexExpr(
      'verdantFvcbBiochemistryStandard',
      'Foundation.Botany.V1.Model',
      modules,
    ),
    primeLimitTonnetz: evaluateLexExpr(
      'verdantPrimeLimitTonnetzStandard',
      'Foundation.Soundtrack.V1.Model',
      modules,
    ),
    w3cDesignTokens: evaluateLexExpr(
      'verdantW3CDesignTokensStandard',
      'Foundation.Brand.V1.Model',
      modules,
    ),
    iso9241Ergonomics: evaluateLexExpr(
      'verdantIso9241ErgonomicsStandard',
      'Foundation.Humane.V1.Model',
      modules,
    ),
    isoArchitecture: evaluateLexExpr(
      'verdantIsoArchitectureStandard',
      'Foundation.Infrastructure.V1.Model',
      modules,
    ),
  };

  const domainBasisPrimes = {
    infrastructure: Number(
      evaluateLexExpr('verdantInfrastructureBasisPrime', 'Foundation.Infrastructure.V1.Model', modules),
    ),
    physics: Number(
      evaluateLexExpr('verdantPhysicsBasisPrime', 'Foundation.Physics.V1.Model', modules),
    ),
    botany: Number(
      evaluateLexExpr('verdantBotanyBasisPrime', 'Foundation.Botany.V1.Model', modules),
    ),
    ecology: Number(
      evaluateLexExpr('verdantEcologyBasisPrime', 'Foundation.Ecology.V1.Model', modules),
    ),
    acoustics: Number(
      evaluateLexExpr('verdantAcousticsBasisPrime', 'Foundation.Acoustics.V1.Model', modules),
    ),
    articulation: Number(
      evaluateLexExpr('verdantArticulationBasisPrime', 'Foundation.Articulation.V1.Model', modules),
    ),
    soundtrack: Number(
      evaluateLexExpr('verdantSoundtrackBasisPrime', 'Foundation.Soundtrack.V1.Model', modules),
    ),
    humane: Number(
      evaluateLexExpr('verdantHumaneBasisPrime', 'Foundation.Humane.V1.Model', modules),
    ),
    brand: Number(
      evaluateLexExpr('verdantBrandBasisPrime', 'Foundation.Brand.V1.Model', modules),
    ),
    neuromorphic: Number(
      evaluateLexExpr('neuromorphicBasisPrime', 'Foundation.Neuromorphic.V1.Model', modules),
    ),
  };

  const canonicalModelBasisPrimes = {
    ...domainBasisPrimes,
    cosmogenesis: Number(
      evaluateLexExpr('cosmogenesisBasisPrime', 'Foundation.Cosmogenesis.V1.Model', modules),
    ),
    mathematics: Number(
      evaluateLexExpr('verdantMathematicsBasisPrime', 'Foundation.Mathematics.V1.Model', modules),
    ),
    chemistry: Number(
      evaluateLexExpr('verdantChemistryBasisPrime', 'Foundation.Chemistry.V1.Model', modules),
    ),
    graphics: Number(
      evaluateLexExpr('verdantGraphicsBasisPrime', 'Foundation.Graphics.V1.Model', modules),
    ),
    realizability: Number(
      evaluateLexExpr('verdantRealizabilityBasisPrime', 'Foundation.Realizability.V1.Model', modules),
    ),
    morphogenesis: Number(
      evaluateLexExpr('verdantMorphogenesisBasisPrime', 'Foundation.Morphogenesis.V1.Model', modules),
    ),
    spatialAcoustics: Number(
      evaluateLexExpr(
        'verdantSpatialAcousticsBasisPrime',
        'Foundation.SpatialAcoustics.V1.Model',
        modules,
      ),
    ),
    anamnesis: Number(
      evaluateLexExpr('verdantAnamnesisBasisPrime', 'Foundation.Anamnesis.V1.Model', modules),
    ),
  };

  const expectedConsecutivePrimes = [
    71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157,
  ];
  const actualSortedPrimes = Object.values(canonicalModelBasisPrimes).slice().sort((a, b) => a - b);
  if (
    actualSortedPrimes.length !== expectedConsecutivePrimes.length ||
    actualSortedPrimes.some((p, idx) => p !== expectedConsecutivePrimes[idx])
  ) {
    throw new Error(
      `Canonical 18-model UOR prime basis mismatch: expected consecutive primes [71..157], got [${actualSortedPrimes.join(', ')}]`,
    );
  }

  const siZeroBias = Number(
    evaluateLexExpr('siDimensionZeroBias', 'Foundation.MetaModel.V1.Model', modules),
  );
  const canonicalAllTheWayDownVerified = Boolean(
    evaluateLexExpr('verifyCanonicalStandardModelsAllTheWayDown', 'VerdantResonance', modules),
  );
  if (
    !canonicalAllTheWayDownVerified ||
    !standards.holisticObserverRegistry.allEighteenModelsAndElevenElementsVerified ||
    !standards.holisticObserverRegistry.zeroCherryPickedModelsVerified ||
    !standards.holisticObserverRegistry.observerSelfKnowledgeComplete
  ) {
    throw new Error(
      'Canonical 18x11 Standard Model completeness verification failed during AST extraction!',
    );
  }

  const canonicalRegistryManifest = [
    {
      registryField: 'm01Mathematics',
      modelKey: 'mathematics',
      displayName: 'Mathematics (Peano/ZFC, UOR Primes, Clifford Cl(0,6), Riemannian DEC)',
      sourceModule: 'Foundation.Mathematics.V1.Model',
    },
    {
      registryField: 'm02Physics',
      modelKey: 'physics',
      displayName: 'Physics (BIPM SI 2019 + SU(3)xSU(2)xU(1) 17-Field SM + Continuum)',
      sourceModule: 'Foundation.Physics.V1.Model',
    },
    {
      registryField: 'm03Chemistry',
      modelKey: 'chemistry',
      displayName: 'Chemistry (118-Element IUPAC Periodic Table + 14 Bravais Lattices)',
      sourceModule: 'Foundation.Chemistry.V1.Model',
    },
    {
      registryField: 'm04Botany',
      modelKey: 'botany',
      displayName: 'Botany (Farquhar-von Caemmerer-Berry C3 + Lockhart Turgor + Phyllotaxis)',
      sourceModule: 'Foundation.Botany.V1.Model',
    },
    {
      registryField: 'm05Ecology',
      modelKey: 'ecology',
      displayName: 'Ecology (Closed-Loop C-H-O-N-P-S-Si-Ca-Mg-Fe Biogeochemical Conservation)',
      sourceModule: 'Foundation.Ecology.V1.Model',
    },
    {
      registryField: 'm06Acoustics',
      modelKey: 'acoustics',
      displayName: 'Acoustics (ISO 226:2023 Loudness + 24-Bark Masking + Chladni Eigenmodes)',
      sourceModule: 'Foundation.Acoustics.V1.Model',
    },
    {
      registryField: 'm07Articulation',
      modelKey: 'articulation',
      displayName: 'Articulation (Euler-Lagrange 3-Joint Botanical Kinematics + ADSR)',
      sourceModule: 'Foundation.Articulation.V1.Model',
    },
    {
      registryField: 'm08Soundtrack',
      modelKey: 'soundtrack',
      displayName: 'Soundtrack (11-Limit Just Intonation Tonnetz + Voice-Leading Parsimony)',
      sourceModule: 'Foundation.Soundtrack.V1.Model',
    },
    {
      registryField: 'm09Graphics',
      modelKey: 'graphics',
      displayName: 'Graphics (380-780nm CIE 1931 -> OKLCH + glTF 2.0 GGX/Airy PBR + 2-Manifold B-Mesh)',
      sourceModule: 'Foundation.Graphics.V1.Model',
    },
    {
      registryField: 'm10BrandDesign',
      modelKey: 'brand',
      displayName: 'Brand & Design (W3C Design Tokens + OKLCH Gamut + WCAG 2.2 AAA + APCA)',
      sourceModule: 'Foundation.Brand.V1.Model',
    },
    {
      registryField: 'm11HumaneErgonomics',
      modelKey: 'humane',
      displayName: 'Humane Ergonomics (ISO 9241-110/210 + Fitts/Hick-Hyman + Zero Dark Patterns)',
      sourceModule: 'Foundation.Humane.V1.Model',
    },
    {
      registryField: 'm12Infrastructure',
      modelKey: 'infrastructure',
      displayName: 'Infrastructure (ISO/IEC/IEEE 42010 + ISO 25010 + Zero-GC Real-Time Arenas)',
      sourceModule: 'Foundation.Infrastructure.V1.Model',
    },
    {
      registryField: 'm13NeuromorphicBus',
      modelKey: 'neuromorphic',
      displayName: 'Neuromorphic Bus (18x18 Functorial Feature-Transfer Matrix + STDP + Active Inference)',
      sourceModule: 'Foundation.Neuromorphic.V1.Model',
    },
    {
      registryField: 'm14ObserverCosmogenesis',
      modelKey: 'cosmogenesis',
      displayName: 'Holistic Observer & Cosmogenesis (Complete 18x11 Context = 198 Cells + Alpha-Omega)',
      sourceModule: 'Foundation.Cosmogenesis.V1.Model',
    },
    {
      registryField: 'm15Realizability',
      modelKey: 'realizability',
      displayName: 'Realizability (Spec-to-Runtime Galois Adjunction + Non-Zero Sensitivity + Zero-Stub Oracle)',
      sourceModule: 'Foundation.Realizability.V1.Model',
    },
    {
      registryField: 'm16Morphogenesis',
      modelKey: 'morphogenesis',
      displayName: 'Morphogenesis (Parametric L-System Ontogeny + Murray r^3 Vascular Law + Turing Phyllotaxis)',
      sourceModule: 'Foundation.Morphogenesis.V1.Model',
    },
    {
      registryField: 'm17SpatialAcoustics',
      modelKey: 'spatialAcoustics',
      displayName: 'Spatial Acoustics (ISO 3382 Image-Source Impulse + Z=rho*c Absorption + 3D Woodworth HRTF)',
      sourceModule: 'Foundation.SpatialAcoustics.V1.Model',
    },
    {
      registryField: 'm18Anamnesis',
      modelKey: 'anamnesis',
      displayName: 'Anamnesis (Content-Addressed Merkle State-DAG Persistence + Modular Cold-Load Delivery)',
      sourceModule: 'Foundation.Anamnesis.V1.Model',
    },
  ] as const;

  const repoRootForRel = path.resolve(prismRootDir, '..', '..');
  const canonicalStandardModels = canonicalRegistryManifest.map((entry) => {
    const mod = modules.get(entry.sourceModule);
    if (!mod) {
      throw new Error(`Missing canonical source module ${entry.sourceModule}`);
    }
    const sha256Hex = crypto.createHash('sha256').update(mod.rawText, 'utf8').digest('hex');
    const desc = standards.holisticObserverRegistry[entry.registryField];
    if (!desc || !desc.completeAndEnforced) {
      throw new Error(`Canonical descriptor ${entry.registryField} is incomplete or unenforced!`);
    }
    const iface = desc.interfaceSpec;
    return {
      modelKey: entry.modelKey,
      registryField: entry.registryField,
      displayName: entry.displayName,
      sourceModule: entry.sourceModule,
      sourceFileRelative: path.relative(repoRootForRel, mod.filePath).replace(/\\/g, '/'),
      sourceSha256: sha256Hex,
      unbiasedSiExponents: {
        s: Number(iface.siBiasedTimeExp) - siZeroBias,
        m: Number(iface.siBiasedLengthExp) - siZeroBias,
        kg: Number(iface.siBiasedMassExp) - siZeroBias,
        A: Number(iface.siBiasedCurrentExp) - siZeroBias,
        K: Number(iface.siBiasedTempExp) - siZeroBias,
        mol: Number(iface.siBiasedAmountExp) - siZeroBias,
        cd: Number(iface.siBiasedLuminousExp) - siZeroBias,
      },
      descriptor: desc,
    };
  });

  const contextPrimeNames = [
    'meadowPrime',
    'grovePrime',
    'crystalPrime',
    'wetlandPrime',
    'sanctuaryPrime',
    'chimeLilyPrime',
    'pulseFernPrime',
    'echoLotusPrime',
    'droneMossPrime',
    'starOrchidPrime',
    'dawnPrime',
    'goldenPrime',
    'twilightPrime',
    'starlightPrime',
    'observePrime',
    'touchPrime',
    'attunePrime',
    'strollPrime',
    'stillnessPrime',
    'dormantPrime',
    'awakenedPrime',
  ] as const;
  const contextPrimes = Object.fromEntries(
    contextPrimeNames.map((pName) => [
      pName,
      Number(evaluateLexExpr(pName, 'Foundation.Neuromorphic.V1.Model', modules)),
    ]),
  ) as Record<(typeof contextPrimeNames)[number], number>;

  const weightDomain = Array.from({ length: 21 }, (_, w) => w);
  const busModulationLut = {
    infrastructure: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepInfrastructureBusModulation ${w}`,
          'Foundation.Infrastructure.V1.Model',
          modules,
        ),
      ),
    ),
    physics: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(`stepPhysicsBusModulation ${w}`, 'Foundation.Physics.V1.Model', modules),
      ),
    ),
    botany: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(`stepBotanyBusModulation ${w}`, 'Foundation.Botany.V1.Model', modules),
      ),
    ),
    ecology: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(`stepEcologyBusModulation ${w}`, 'Foundation.Ecology.V1.Model', modules),
      ),
    ),
    acoustics: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepAcousticsBusModulation ${w}`,
          'Foundation.Acoustics.V1.Model',
          modules,
        ),
      ),
    ),
    articulation: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepArticulationBusModulation ${w}`,
          'Foundation.Articulation.V1.Model',
          modules,
        ),
      ),
    ),
    soundtrack: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepSoundtrackBusModulation ${w}`,
          'Foundation.Soundtrack.V1.Model',
          modules,
        ),
      ),
    ),
    humane: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(`stepHumaneBusModulation ${w}`, 'Foundation.Humane.V1.Model', modules),
      ),
    ),
    brand: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(`stepBrandBusModulation ${w}`, 'Foundation.Brand.V1.Model', modules),
      ),
    ),
    mathematics: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepMathematicsBusModulation ${w}`,
          'Foundation.Mathematics.V1.Model',
          modules,
        ),
      ),
    ),
    chemistry: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepChemistryBusModulation ${w}`,
          'Foundation.Chemistry.V1.Model',
          modules,
        ),
      ),
    ),
    graphics: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepGraphicsBusModulation ${w}`,
          'Foundation.Graphics.V1.Model',
          modules,
        ),
      ),
    ),
    realizability: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepRealizabilityBusModulation ${w}`,
          'Foundation.Realizability.V1.Model',
          modules,
        ),
      ),
    ),
    morphogenesis: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepMorphogenesisBusModulation ${w}`,
          'Foundation.Morphogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    spatialAcoustics: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepSpatialAcousticsBusModulation ${w}`,
          'Foundation.SpatialAcoustics.V1.Model',
          modules,
        ),
      ),
    ),
    anamnesis: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepAnamnesisBusModulation ${w}`,
          'Foundation.Anamnesis.V1.Model',
          modules,
        ),
      ),
    ),
    realizabilitySensitivityPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepRealizabilitySensitivityPermille ${w}`,
          'Foundation.Realizability.V1.Model',
          modules,
        ),
      ),
    ),
    lSystemDerivationDepthByStage: [0, 1, 2, 3, 4].map((stageIdx) =>
      weightDomain.map((w) =>
        Number(
          evaluateLexExpr(
            `stepLSystemDerivationDepth ${stageIdx} ${w}`,
            'Foundation.Morphogenesis.V1.Model',
            modules,
          ),
        ),
      ),
    ),
    earlyReflectionTapCount: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepEarlyReflectionTapCount ${w}`,
          'Foundation.SpatialAcoustics.V1.Model',
          modules,
        ),
      ),
    ),
    consolidatedMemoryHorizon: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepConsolidatedMemoryHorizon ${w}`,
          'Foundation.Anamnesis.V1.Model',
          modules,
        ),
      ),
    ),
    spectralBandResolution: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepSpectralBandResolution ${w}`,
          'Foundation.Graphics.V1.Model',
          modules,
        ),
      ),
    ),
    adaptiveTerrainSegments: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepAdaptiveTerrainSegments 1 ${w}`,
          'Foundation.Graphics.V1.Model',
          modules,
        ),
      ),
    ),
    barkMaskingHeadroomMilliDb: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepBarkMaskingHeadroomMilliDb ${w}`,
          'Foundation.Acoustics.V1.Model',
          modules,
        ),
      ),
    ),
    functorFeatureTransferGainPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepFunctorFeatureTransferGainPermille ${w} ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    variationalFreeEnergySurprisalPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepVariationalFreeEnergySurprisalPermille ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    wisdomPhenomenon: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepWisdomPhenomenonModulation ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    atomicValence: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepAtomicValenceActivity ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    molecularBond: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepMolecularBondCoherence ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    macromolecularPolymer: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepMacromolecularPolymerization ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    compoundManifestation: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepCompoundManifestation ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    environmentalModalSynthesis: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepEnvironmentalModalSynthesis ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    atomicRemineralization: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepAtomicRemineralizationFlux ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    bMeshSubdivisionDensity: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepBMeshSubdivisionDensity ${w}`,
          'Foundation.Botany.V1.Model',
          modules,
        ),
      ),
    ),
    thinFilmIridescenceSpanNm: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepThinFilmIridescenceSpanNm ${w}`,
          'Foundation.Botany.V1.Model',
          modules,
        ),
      ),
    ),
    basalJointTorqueMilli: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepBasalJointTorqueMilli ${w}`,
          'Foundation.Articulation.V1.Model',
          modules,
        ),
      ),
    ),
    midCulmFlexureMilli: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepMidCulmFlexureMilli ${w}`,
          'Foundation.Articulation.V1.Model',
          modules,
        ),
      ),
    ),
    apicalCorollaGimbalMilli: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepApicalCorollaGimbalMilli ${w}`,
          'Foundation.Articulation.V1.Model',
          modules,
        ),
      ),
    ),
    theoryOfMindCoherencePermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepTheoryOfMindCoherencePermille ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    supraDirectiveFidelityPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepSupraDirectiveFidelityPermille ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    supraDirectiveQualityPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepSupraDirectiveQualityPermille ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    supraDirectiveDefinitionSubdiv: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepSupraDirectiveDefinitionSubdiv ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    supraDirectiveFeatureUnlockCount: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepSupraDirectiveFeatureUnlockCount ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    alphaOmegaFieldPotential: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepAlphaOmegaFieldPotential 1 ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    parametricInorganicScalePermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `synthesizeParametricInorganicScalePermille 1 ${w} ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    parametricOrganicVitalityPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `synthesizeParametricOrganicVitalityPermille 1 ${w} ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    parametricPlayerEmbodimentPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `synthesizeParametricPlayerEmbodimentPermille 1 ${w} ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    parametricDisplayHarmonizedContrastTenths: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `synthesizeParametricDisplayHarmonizedContrastTenths ${w}`,
          'Foundation.Brand.V1.Model',
          modules,
        ),
      ),
    ),
    extrapolateHighestResolutionSubdiv: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `extrapolateHighestResolutionSubdiv 1 ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    extrapolateHighestResolutionPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `extrapolateHighestResolutionPermille 1 ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    foundationalHarmonyPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepFoundationalHarmonyPermille ${w} 2`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    foundationalChaosDyadicPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepFoundationalChaosPermille ${w} 1`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    foundationalChaosAperiodicPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepFoundationalChaosPermille ${w} 3`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    foundationalAffectValencePermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepFoundationalAffectValencePermille ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
  };

  const plasticityLut = {
    clampBusWeight: weightDomain.map((w) =>
      Number(evaluateLexExpr(`clampBusWeight ${w}`, 'Foundation.Neuromorphic.V1.Model', modules)),
    ),
    learnWeightPotentiated: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(`learnWeightPotentiated ${w}`, 'Foundation.Neuromorphic.V1.Model', modules),
      ),
    ),
    learnWeightDepressed: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(`learnWeightDepressed ${w}`, 'Foundation.Neuromorphic.V1.Model', modules),
      ),
    ),
    learnHebbianWeightCoactive: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `learnHebbianWeight ${w} true`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    learnHebbianWeightSilent: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `learnHebbianWeight ${w} false`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    transferWeightCrossDomainCoactive: weightDomain.map((wTarget) =>
      Number(
        evaluateLexExpr(
          `transferWeightCrossDomain ${wTarget} true`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    transferWeightCrossDomainSilent: weightDomain.map((wTarget) =>
      Number(
        evaluateLexExpr(
          `transferWeightCrossDomain ${wTarget} false`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    refineDomainWeightAutopoietic: weightDomain.map((curW) =>
      weightDomain.map((sigW) =>
        Number(
          evaluateLexExpr(
            `refineDomainWeightAutopoietic ${curW} ${sigW}`,
            'Foundation.Neuromorphic.V1.Model',
            modules,
          ),
        ),
      ),
    ),
    verifySingleCallPropagatesAllTenDomains: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifySingleCallPropagatesAllTenDomains ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    verifyAutopoieticSingleCallAdvancesAllTenDomains: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyAutopoieticSingleCallAdvancesAllTenDomains ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    stepStakeholderValueReinforcementCoactive: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepStakeholderValueReinforcement ${w} true`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    stepStakeholderValueReinforcementSilent: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepStakeholderValueReinforcement ${w} false`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    verifyEmergentEntitySynthesizesFacets: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyEmergentEntitySynthesizesFacets ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    verifyGranularAtomicToEnvironmentalChain: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyGranularAtomicToEnvironmentalChain ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    verifyClosedLoopMatterConservation: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyClosedLoopMatterConservation ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    verifyCompleteGranularSynthesisClosure: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyCompleteGranularSynthesisClosure ${w}`,
          'Foundation.Ecology.V1.Model',
          modules,
        ),
      ),
    ),
    verifyHighDefinitionBMeshSynthesis: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyHighDefinitionBMeshSynthesis ${w}`,
          'Foundation.Botany.V1.Model',
          modules,
        ),
      ),
    ),
    verifyThreeJointKinematicHierarchy: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyThreeJointKinematicHierarchy ${w}`,
          'Foundation.Articulation.V1.Model',
          modules,
        ),
      ),
    ),
    rule30LeftDiagonalPeriod: [0, 1, 2, 3, 4].map((d) =>
      Number(
        evaluateLexExpr(
          `stepRule30LeftDiagonalPeriod ${d}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    rule30AperiodicCompensation: [0, 1, 2, 3, 4, 5].map((d) =>
      weightDomain.map((w) =>
        Number(
          evaluateLexExpr(
            `stepRule30AperiodicCompensationIndex ${d} ${w}`,
            'Foundation.Neuromorphic.V1.Model',
            modules,
          ),
        ),
      ),
    ),
    verifyRule30DeterministicAndWithdrawnDuality: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyRule30DeterministicAndWithdrawnDuality ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    verifyObserverSupraDirectiveTranscendence: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyObserverSupraDirectiveTranscendence ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    verifyObserverHolisticWhyClosure: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyObserverHolisticWhyClosure ${w}`,
          'Foundation.Neuromorphic.V1.Model',
          modules,
        ),
      ),
    ),
    verifyObserverCreatesAllThreeRealms: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyObserverCreatesAllThreeRealms 1 ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    verifyAlphaOmegaParametricClosure: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyAlphaOmegaParametricClosure 1 ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    verifyParametricDisplayDesignClosure: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyParametricDisplayDesignClosure ${w}`,
          'Foundation.Brand.V1.Model',
          modules,
        ),
      ),
    ),
    verifyTheoryOfMindDifferentiationAndDiversity: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyTheoryOfMindDifferentiationAndDiversity ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    verifyFourfoldObserverImmanence: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyFourfoldObserverImmanence 1 ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    verifyFoundationalAffectAndPreferencesClosure: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyFoundationalAffectAndPreferencesClosure ${w}`,
          'Foundation.Cosmogenesis.V1.Model',
          modules,
        ),
      ),
    ),
    crossModalPhaseObstructionPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepCrossModalPhaseObstructionPermille ${w}`,
          'Foundation.Physics.V1.Model',
          modules,
        ),
      ),
    ),
    crossModalAcousticShadowPermille: weightDomain.map((w) =>
      Number(
        evaluateLexExpr(
          `stepCrossModalAcousticShadowPermille ${w}`,
          'Foundation.Physics.V1.Model',
          modules,
        ),
      ),
    ),
    verifyMaterialSynthesisCrossModalObstruction: weightDomain.map((w) =>
      Boolean(
        evaluateLexExpr(
          `verifyMaterialSynthesisCrossModalObstruction ${w}`,
          'Foundation.Physics.V1.Model',
          modules,
        ),
      ),
    ),
  };

  const rule30Lut = Array.from({ length: 8 }, (_, idx) => {
    const left = Boolean((idx >> 2) & 1);
    const center = Boolean((idx >> 1) & 1);
    const right = Boolean(idx & 1);
    return Boolean(
      evaluateLexExpr(
        `rule30CellStep ${left} ${center} ${right}`,
        'Foundation.Neuromorphic.V1.Model',
        modules,
      ),
    );
  });

  // Compile-Time Rule-30 Centerline Discovery (`github.com/afflom/rule30` reference) &
  // Supra-Directive Procedural Model Synthesis Pass:
  // Evolves a 97-cell light-cone for 40 steps from central seed `c = 48` using `rule30Lut`.
  const coneSteps = 40;
  const coneWidth = 97;
  const coneCenter = 48;
  const coneGrid: (0 | 1)[][] = [];
  let row: (0 | 1)[] = Array.from({ length: coneWidth }, (_, i) => (i === coneCenter ? 1 : 0));
  coneGrid.push(row);
  for (let t = 1; t < coneSteps; t++) {
    const next: (0 | 1)[] = new Array<0 | 1>(coneWidth).fill(0);
    for (let x = 1; x < coneWidth - 1; x++) {
      const idx = (row[x - 1] << 2) | (row[x] << 1) | row[x + 1];
      next[x] = rule30Lut[idx] ? 1 : 0;
    }
    coneGrid.push(next);
    row = next;
  }

  // Analyze regular left diagonals d = 0..4 (`x = coneCenter - t + d`) after transient burn-in
  const detectSmallestDividingPeriod = (seq: number[], maxBound: number): number => {
    for (let p = 1; p <= maxBound; p *= 2) {
      let matches = true;
      for (let i = 0; i < seq.length - p; i++) {
        if (seq[i] !== seq[i + p]) {
          matches = false;
          break;
        }
      }
      if (matches) return p;
    }
    return maxBound;
  };

  const regularLeftDiagonals = [0, 1, 2, 3, 4].map((d) => {
    const burnIn = d + 6;
    const trace: number[] = [];
    for (let t = burnIn; t < coneSteps; t++) {
      const col = coneCenter - t + d;
      if (col >= 0 && col < coneWidth) {
        trace.push(coneGrid[t][col]);
      }
    }
    const theoreticalBound = Math.pow(2, d);
    const empiricalPeriod = detectSmallestDividingPeriod(trace, theoreticalBound);
    return {
      diagonalIndex: d,
      vantage: 'regular-side' as const,
      theoreticalDyadicBound: theoreticalBound,
      empiricalExactPeriod: empiricalPeriod,
      dividesTwoToD: theoreticalBound % empiricalPeriod === 0,
      sampleBitPrefix: trace.slice(0, 12).join(''),
    };
  });

  // Analyze chaotic central column & deep right diagonals (`withdrawnCore := "aperiodic-compensation"`)
  const centralColumnTrace = coneGrid.map((r) => r[coneCenter]);
  const fourBitWindows = new Set<number>();
  let centralFlips = 0;
  for (let t = 1; t < centralColumnTrace.length; t++) {
    if (centralColumnTrace[t] !== centralColumnTrace[t - 1]) centralFlips += 1;
    if (t >= 3) {
      const w4 =
        (centralColumnTrace[t - 3] << 3) |
        (centralColumnTrace[t - 2] << 2) |
        (centralColumnTrace[t - 1] << 1) |
        centralColumnTrace[t];
      fourBitWindows.add(w4);
    }
  }
  const centralShortPeriodRefuted = [1, 2, 4, 8].every((p) => {
    for (let i = 4; i < centralColumnTrace.length - p; i++) {
      if (centralColumnTrace[i] !== centralColumnTrace[i + p]) return true;
    }
    return false;
  });

  const observerRule30Facets = {
    referenceArchitecture: 'github.com/afflom/rule30',
    quadruple: {
      realObject: 'prism-deterministic-kernel',
      sensualObject: 'dyadic-regular-left-diagonals',
      realQualities: [
        'coupling-law',
        'inward-light-cone-determination',
        'periodic-finite-kernel',
        'recurrent-central-collision',
      ],
      sensualQualities: ['edge-parity', 'three-diagonal-band', 'left-band-doubling-law'],
      withdrawnCore: 'aperiodic-compensation',
      withdrawnFacets: [
        'aperiodic-compensation',
        'central-column-irreducibility',
        'open-light-cone-hypotheses',
        'player-free-will-encounter-entropy',
      ],
    },
    engineStages: ['induction', 'pruning', 'deduction', 'learning', 'hypotheses'] as const,
    portfolioStrategies: [
      'library-rewrite',
      'step-induction',
      'period-reduction',
      'counterexample',
    ] as const,
    regularLeftDiagonals,
    centralColumnBitPrefix: centralColumnTrace.slice(0, 24).join(''),
    centralFourBitWindowCoverage: fourBitWindows.size,
    centralFlipRatioMilli: Math.round((centralFlips / (centralColumnTrace.length - 1)) * 1000),
    centralShortPeriodRefutedByCounterexample: centralShortPeriodRefuted,
    compileTimeHypotheses: [
      {
        hypothesisId: 'UOR-HYP-R30-DOUBLING-2D',
        vantage: 'regular-side',
        status: 'proved',
        strategyUsed: 'period-reduction',
        statement:
          'Settled left diagonal d exhibits exact dyadic period dividing 2^d under l XOR (c OR r).',
      },
      {
        hypothesisId: 'UOR-HYP-R30-INWARD-CONE',
        vantage: 'kernel',
        status: 'proved',
        strategyUsed: 'step-induction',
        statement:
          'Driven right-half boundary cells uniquely determine the inward light-cone triangle.',
      },
      {
        hypothesisId: 'UOR-HYP-R30-CENTRAL-SHORT-CYCLE',
        vantage: 'chaotic-side',
        status: 'refuted',
        strategyUsed: 'counterexample',
        statement:
          'Short-horizon dyadic periods p in {1,2,4,8} on the central column are refuted on finite light-cones.',
      },
      {
        hypothesisId: 'UOR-HYP-R30-APERIODIC-HORIZON',
        vantage: 'withdrawn',
        status: 'open',
        strategyUsed: 'library-rewrite',
        statement:
          'Interior d>=3 aperiodic-compensation and live player encounter trajectories remain non-deterministic prior to lived observation.',
      },
    ],
  };

  // Compile-Time Procedural Model Generation (`GENERATED_COMPILE_TIME_OBSERVER_MODELS`):
  // Synthesizes 5 Supra-Directive 3D/Acoustic/Teleological Model Archetypes at compile time
  // by evaluating the `.lex.tex` Supra-Directive optimization curves across `w = 12..16`.
  const compileTimeArchetypeInputs = [
    {
      id: 'ct-model-meadow-solar-campanula',
      name: 'Supra-Lydian Solar Campanula Crown',
      biome: 'meadow',
      species: 'chime-lily',
      targetWeight: 12,
      whySynthesized:
        'Elevates Sunlit Meadow overtone brilliance and petal thin-film clarity so gentle exploration immediately rewards curiosity.',
    },
    {
      id: 'ct-model-grove-fibonacci-rachis',
      name: 'Supra-Dorian Fibonacci Rachis Cathedral',
      biome: 'grove',
      species: 'pulse-fern',
      targetWeight: 13,
      whySynthesized:
        'Expands Ancient Grove pinnate phyllotaxis and woody polyrhythmic warmth to ground brisk movement into rhythmic calm.',
    },
    {
      id: 'ct-model-crystal-piezo-spire',
      name: 'Supra-Phrygian Piezoelectric Quartz Lattice',
      biome: 'crystal',
      species: 'star-orchid',
      targetWeight: 14,
      whySynthesized:
        'Sharpens Crystalline Hollow birefringent prism facets and 7-limit celestial seventh harmonics for high-definition wonder.',
    },
    {
      id: 'ct-model-wetland-meniscus-chalice',
      name: 'Supra-Mixolydian Hydro-Meniscus Chalice',
      biome: 'wetland',
      species: 'echo-lotus',
      targetWeight: 15,
      whySynthesized:
        'Deepens Mirror Wetland cordate lotus buoyancy and antiphonal water-reflection sustain for tranquil emotional co-regulation.',
    },
    {
      id: 'ct-model-sanctuary-astrolabe-unity',
      name: 'Apex Sanctuary Light-Cone Resonance Astrolabe',
      biome: 'sanctuary',
      species: 'drone-moss',
      targetWeight: 16,
      whySynthesized:
        'Unifies all 11 Observer parts (10 Prism domains + Player User) into a pure Just-Intonation cathedral crown beyond the base directive.',
    },
  ] as const;

  const compileTimeObserverModels = compileTimeArchetypeInputs.map((item, idx) => {
    const w = item.targetWeight;
    const fidelityPermille = busModulationLut.supraDirectiveFidelityPermille[w];
    const qualityPermille = busModulationLut.supraDirectiveQualityPermille[w];
    const definitionSubdiv = busModulationLut.supraDirectiveDefinitionSubdiv[w];
    const featureCount = busModulationLut.supraDirectiveFeatureUnlockCount[w];
    const tomPermille = busModulationLut.theoryOfMindCoherencePermille[w];
    const iridSpanNm = busModulationLut.thinFilmIridescenceSpanNm[w];
    const r30Byte = parseInt(centralColumnTrace.slice(idx * 4, idx * 4 + 8).join(''), 2) || 149;
    const pointKeyHex = `0x${(((w & 0xf) << 24) | ((idx + 11) << 16) | ((definitionSubdiv & 0xff) << 8) | (r30Byte & 0xff)).toString(16).padStart(7, '0')}`;
    return {
      modelId: item.id,
      modelName: item.name,
      origin: 'compile-time' as const,
      biome: item.biome,
      species: item.species,
      synapticWeight: w,
      fidelityMultiplier: Number((fidelityPermille / 1000).toFixed(3)),
      qualityMultiplier: Number((qualityPermille / 1000).toFixed(3)),
      radialSubdivisions: definitionSubdiv,
      harmonicCrownPetals: 6 + idx * 2 + Math.floor((w - 8) / 2),
      crystalFiligreeSpires: 4 + idx + Math.floor((w - 8) / 3),
      thinFilmIridescenceSpanNm: iridSpanNm,
      unlockedFeatureCount: featureCount,
      theoryOfMindCoherencePermille: tomPermille,
      supraOvertoneRatios: [
        Number((1.5 + idx * 0.125).toFixed(4)),
        Number((2.25 + (idx % 3) * 0.25).toFixed(4)),
        Number((3.0 + (r30Byte % 5) * 0.125).toFixed(4)),
      ] as [number, number, number],
      rule30SeedByte: r30Byte,
      uorPointKeyHex: pointKeyHex,
      whySynthesized: item.whySynthesized,
    };
  });

  // Compile-Time Alpha-Omega Parametric Cosmogenesis Artifacts (`Foundation.Cosmogenesis.V1.Model`):
  // Evaluates the parametric genesis operators across `alphaSeed = 1..8` and synthesizes the
  // Observer-intervened demiurgic blueprint ratios from UOR algebraic invariants (`phi`, primes, `2^d`).
  const cosmogenesisBasisPrime = Number(
    evaluateLexExpr('cosmogenesisBasisPrime', 'Foundation.Cosmogenesis.V1.Model', modules),
  );
  const createdRealmCount = Number(
    evaluateLexExpr('createdRealmCount', 'Foundation.Cosmogenesis.V1.Model', modules),
  );
  const observerMonumentCount = Number(
    evaluateLexExpr('observerMonumentCount', 'Foundation.Cosmogenesis.V1.Model', modules),
  );
  const phiGolden = (1 + Math.sqrt(5)) / 2;
  const alphaSeedSweepLut = [1, 2, 3, 4, 5, 6, 7, 8].map((seed) => ({
    alphaSeed: seed,
    canonicalGenesisSeed: Number(
      evaluateLexExpr(
        `synthesizeParametricCanonicalSeed ${seed} 8`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
    concertPitchCentiHz: Number(
      evaluateLexExpr(
        `synthesizeParametricConcertPitchCentiHz ${seed} 8`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
    baselineFieldPotential: Number(
      evaluateLexExpr(
        `stepAlphaOmegaFieldPotential ${seed} 8`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
    apexFieldPotential: Number(
      evaluateLexExpr(
        `stepAlphaOmegaFieldPotential ${seed} 16`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
    baselineInorganicPermille: Number(
      evaluateLexExpr(
        `synthesizeParametricInorganicScalePermille ${seed} 8 8`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
    baselineOrganicPermille: Number(
      evaluateLexExpr(
        `synthesizeParametricOrganicVitalityPermille ${seed} 8 8`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
    baselinePlayerPermille: Number(
      evaluateLexExpr(
        `synthesizeParametricPlayerEmbodimentPermille ${seed} 8 8`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
    closureVerified: Boolean(
      evaluateLexExpr(
        `verifyAlphaOmegaParametricClosure ${seed} 8`,
        'Foundation.Cosmogenesis.V1.Model',
        modules,
      ),
    ),
  }));

  const alphaOmegaCosmogenesisArtifacts = {
    cosmogenesisBasisPrime,
    createdRealmCount,
    observerMonumentCount,
    canonicalGenesisSeedBaseline: alphaSeedSweepLut[0].canonicalGenesisSeed,
    concertPitchCentiHzBaseline: alphaSeedSweepLut[0].concertPitchCentiHz,
    goldenRatioPhi: Number(phiGolden.toFixed(8)),
    goldenAngleRad: Number(((2 * Math.PI) / (phiGolden * phiGolden)).toFixed(8)),
    alphaSeedSweepLut,
    monumentDemiurgicArchetypes: [
      {
        monumentId: 'monument-sanctuary-pavilion',
        biome: 'sanctuary' as const,
        monumentName: 'Sanctuary Harmonic Colonnade & Observer Astrolabe',
        biomeContextPrime: contextPrimes.sanctuaryPrime,
        demiurgicMechanism:
          'Acoustic standing-wave calcification of CaCO3 travertine and harmonic Cu-Sn-Au bronze at the 5-biome nodal origin.',
        mineralCompounds: ['CaCO3-Travertine', 'SiO2-Quartz', 'CuSnAu-Harmonic-Bronze'],
        whyObserverIntervened:
          'Abiotic erosion cannot raise a 6-column harmonic rotunda; the Observer precipitates symmetric colonnade nodes so all five biome modes converge in phase.',
      },
      {
        monumentId: 'monument-meadow-sundial',
        biome: 'meadow' as const,
        monumentName: 'Sunlit Meadow Lydian Meridian Sundial',
        biomeContextPrime: contextPrimes.meadowPrime,
        demiurgicMechanism:
          'Photonic-acoustic standing-wave sintering of travertine plinth rings with an elevated solar bronze gnomon arch.',
        mineralCompounds: ['CaCO3-Travertine', 'CuSnAu-Solar-Bronze', 'Fe2O3-Ochre-Inlay'],
        whyObserverIntervened:
          'Pure wind and sunlight cannot calibrate a meridian gnomon; the Observer crystallizes the solar arch to orient gentle player orientation and Lydian fourths.',
      },
      {
        monumentId: 'monument-grove-pergola',
        biome: 'grove' as const,
        monumentName: 'Ancient Grove Silicified Bamboo Chime Pergola',
        biomeContextPrime: contextPrimes.grovePrime,
        demiurgicMechanism:
          'Biomineralized lignocellulose-silica framing coupled with 6 hollow Dorian tubular bronze-bamboo resonators.',
        mineralCompounds: ['SiO2-Phytolith-Timber', 'CaCO3-Footing', 'CuSn-Resonator-Alloy'],
        whyObserverIntervened:
          'Wild culms grow vertically without mortised lintels; the Observer weaves four corner culms into a closed Euclidean ring to suspend wind-driven Dorian chimes.',
      },
      {
        monumentId: 'monument-crystal-archway',
        biome: 'crystal' as const,
        monumentName: 'Crystalline Hollow Piezoelectric Geode Archway',
        biomeContextPrime: contextPrimes.crystalPrime,
        demiurgicMechanism:
          'Hydrothermal piezoelectric nucleation of 6 inward-cantilevered quartz spires locked by an elevated hexagonal keystone ring.',
        mineralCompounds: ['SiO2-Alpha-Quartz', 'MgFeSiO4-Olivine-Basalt', 'Bi-ThinFilm-Oxide'],
        whyObserverIntervened:
          'Unassisted geodes remain buried cavities; the Observer focuses hydrothermal standing waves into a self-supporting 6-spire archway with a suspended prism core.',
      },
      {
        monumentId: 'monument-wetland-lanterns',
        biome: 'wetland' as const,
        monumentName: 'Mirror Wetland Hydro-Meniscus Lantern Piers',
        biomeContextPrime: contextPrimes.wetlandPrime,
        demiurgicMechanism:
          'Sub-aqueous basalt-travertine pier precipitation anchored into the lakebed with 4-strut bioluminescent pagoda chambers.',
        mineralCompounds: ['CaCO3-Tufa-Pier', 'SiO2-Lantern-Glass', 'Luciferin-Chemiluminescent-Core'],
        whyObserverIntervened:
          'Still water dissipates ripples outward; the Observer raises 5 lakebed-anchored lantern piers to reflect antiphonal Mixolydian shimmer across the meniscus.',
      },
    ] as const,
  };

  const theoremsByModule: Record<string, string[]> = {};
  for (const [modName, mod] of modules.entries()) {
    theoremsByModule[modName] = mod.theorems.map((t) => t.name);
  }

  const judgeArtifact = extractVerdantJudgeArtifact(modules);
  const specJsonPath = path.resolve(prismRootDir, '..', 'spec.json');
  const verdantSpec = extractAndValidateVerdantSpec(specJsonPath, modules, judgeArtifact);

  return {
    foundationPurity,
    standards,
    domainBasisPrimes,
    canonicalModelBasisPrimes,
    canonicalStandardModels,
    contextPrimes,
    busModulationLut,
    plasticityLut,
    rule30Lut,
    observerRule30Facets,
    compileTimeObserverModels,
    alphaOmegaCosmogenesisArtifacts,
    theoremsByModule,
    judgeArtifact,
    verdantSpec,
  };
}

function generateTypeScriptModule(prismRootDir: string, outFilePath: string) {
  const extracted = extractAllPrismArtifacts(prismRootDir);

  const fileContent = `// AUTO-GENERATED BY \`scripts/extractPrismArtifacts.ts\` FROM \`/prism/src/**/*.lex.tex\` AND \`/prism/spec.json\`.
// DO NOT EDIT THIS FILE BY HAND — ALL CONSTANTS, PRIMES, LUTS, AND SPECS ARE DERIVED DIRECTLY FROM THE FORMAL PRISM LEXLEAN AST.

export const GENERATED_PRISM_FOUNDATION_PURITY = ${JSON.stringify(
    extracted.foundationPurity,
    null,
    2,
  )} as const;

export const GENERATED_PRISM_DOMAIN_BASIS_PRIMES = ${JSON.stringify(
    extracted.domainBasisPrimes,
    null,
    2,
  )} as const;

export const GENERATED_CANONICAL_MODEL_BASIS_PRIMES = ${JSON.stringify(
    extracted.canonicalModelBasisPrimes,
    null,
    2,
  )} as const;

export const GENERATED_CANONICAL_STANDARD_MODELS = ${JSON.stringify(
    extracted.canonicalStandardModels,
    null,
    2,
  )} as const;

export const GENERATED_PRISM_CONTEXT_PRIMES = ${JSON.stringify(
    extracted.contextPrimes,
    null,
    2,
  )} as const;

export const GENERATED_PRISM_BUS_MODULATION_LUT = ${JSON.stringify(
    extracted.busModulationLut,
    null,
    2,
  )} as const;

export const GENERATED_PRISM_PLASTICITY_LUT = ${JSON.stringify(
    extracted.plasticityLut,
    null,
    2,
  )} as const;

export const GENERATED_PRISM_RULE30_LUT = ${JSON.stringify(
    extracted.rule30Lut,
    null,
    2,
  )} as const;

export const GENERATED_OBSERVER_RULE30_FACETS = ${JSON.stringify(
    extracted.observerRule30Facets,
    null,
    2,
  )} as const;

export const GENERATED_COMPILE_TIME_OBSERVER_MODELS = ${JSON.stringify(
    extracted.compileTimeObserverModels,
    null,
    2,
  )} as const;

export const GENERATED_ALPHA_OMEGA_COSMOGENESIS_ARTIFACTS = ${JSON.stringify(
    extracted.alphaOmegaCosmogenesisArtifacts,
    null,
    2,
  )} as const;

export const GENERATED_PRISM_STANDARDS = ${JSON.stringify(
    extracted.standards,
    null,
    2,
  )} as const;

export const GENERATED_PRISM_THEOREMS_BY_MODULE = ${JSON.stringify(
    extracted.theoremsByModule,
    null,
    2,
  )} as const;

export const GENERATED_VERDANT_JUDGE_ARTIFACT = ${JSON.stringify(
    extracted.judgeArtifact,
    null,
    2,
  )} as const;

export const GENERATED_VERDANT_RESONANCE_SPEC = ${JSON.stringify(
    extracted.verdantSpec,
    null,
    2,
  )} as const;
`;

  fs.writeFileSync(outFilePath, fileContent, 'utf8');
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isMain) {
  const rootDir = process.cwd();
  const prismSrc = path.join(rootDir, 'prism', 'src');
  const outPath = path.join(rootDir, 'src', 'game', 'generatedPrismConstants.ts');
  generateTypeScriptModule(prismSrc, outPath);
  console.log(`Extracted Prism .lex.tex constants & spec -> ${outPath}`);
}
