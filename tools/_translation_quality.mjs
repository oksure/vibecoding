// Mechanical checks catch specific factual corruption. They complement, rather
// than replace, editorial comparison of the generated English with the source.
const names = /\b(?:Karpathy|Willison|Collins|Meske|Copilot|Cursor|GitHub|OpenAI|Anthropic|Claude|ChatGPT|Codex|Gemini|LLM|GPT|SHRDLU|COBOL|FORTRAN|VisiCalc|SuperCalc|Lotus|Excel|MCP|API|TDD|CI|CD|Conway)\b/gi;
export function validateTranslation(source, target) {
  if (typeof target !== "string" || !target.trim()) throw new Error("Empty translation");
  const required = new Set([
    ...(source.match(/§\d+(?:\.\d+)*/g) || []),
    ...(source.match(/\b(?:19|20)\d{2}\b/g) || []),
    ...(source.match(/\b\d{4}-\d{2}-\d{2}\b/g) || []),
    ...(source.match(names) || [])
  ]);
  for (const value of required) {
    if (!target.toLowerCase().includes(value.toLowerCase())) throw new Error(`Translation changed or dropped ${value}: ${source.slice(0,100)}`);
  }
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  for (const [,year,month,day] of source.matchAll(/(\d{4})년\s*(\d{1,2})월(?:\s*(\d{1,2})일)?/g)) {
    const iso = year + "-" + month.padStart(2,"0");
    if (!target.includes(iso) && !target.toLowerCase().includes(months[Number(month)-1])) throw new Error(`Translation changed month ${year}-${month}`);
    if (day && !new RegExp(`\\b0?${Number(day)}\\b`).test(target)) throw new Error(`Translation dropped date ${year}-${month}-${day}`);
  }
  if (/\[?(?:translation|translated text|here is the translation)\]?:/i.test(target.slice(0,50))) throw new Error(`Translation includes commentary: ${target.slice(0,100)}`);
  const expected = [...source.matchAll(/<(\/?)v(\d+)(\/?)>/g)];
  const got = [...target.matchAll(/<(\/?)v(\d+)(\/?)>/g)];
  const signatures = matches => matches.map(x => x[0]).sort().join("|");
  if (signatures(expected) !== signatures(got)) throw new Error(`Changed inline markup: ${source.slice(0,100)} => ${target}`);
  return target;
}

