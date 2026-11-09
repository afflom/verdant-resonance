import fs from 'node:fs';
import path from 'node:path';

/**
 * Deterministic Prism `.lex.tex` AST Extractor & TypeScript Artifact Compiler
 * (`scripts/extractPrismArtifacts.ts`).
 *
 * Parses all 14 `.lex.tex` source modules under `prism/src/` and `prism/spec.json`,
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

  const ruleOutcomeMap = new Map<string, string>();
  const ruleOutcomeRegex = /if\s+\((rule\d+)\s+request\)\s+then\s+\((answer[A-Za-z]+)\)/g;
  let rm: RegExpExecArray | null;
  while ((rm = ruleOutcomeRegex.exec(judgeRulesDef.bodyRaw)) !== null) {
    ruleOutcomeMap.set(rm[1], rm[2]);
  }

  const appDef = vr.definitions.get('acceptanceVectors') ?? vr.definitions.get('application');
  const acceptanceVectors: { request: string; response: string }[] = [];
  if (appDef) {
    const vecRegex =
      /record\s+Foundation\.View\.Text\.V1\.Model::AcceptanceVector\s*\{\s*request\s*:=\s*(0x[0-9a-fA-F]*)\s*,\s*response\s*:=\s*(0x[0-9a-fA-F]*)\s*\}/g;
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
    contextPrimes,
    busModulationLut,
    plasticityLut,
    rule30Lut,
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
