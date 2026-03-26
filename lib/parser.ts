import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { Language, Parser } from "web-tree-sitter";
import type { SupportedLanguage } from "@/lib/types";

const parserCache = new Map<SupportedLanguage, Parser>();
const languageCache = new Map<SupportedLanguage, Language>();
let initialized = false;

const GRAMMAR_URLS: Record<SupportedLanguage, string> = {
  javascript:
    "https://cdn.jsdelivr.net/npm/tree-sitter-javascript@0.25.0/tree-sitter-javascript.wasm",
  typescript:
    "https://cdn.jsdelivr.net/npm/tree-sitter-typescript@0.23.2/tree-sitter-typescript.wasm",
  python:
    "https://cdn.jsdelivr.net/npm/tree-sitter-python@0.25.0/tree-sitter-python.wasm",
};

async function loadLanguageFromUrl(url: string): Promise<Language> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load grammar: ${response.status} ${response.statusText}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  return Language.load(bytes);
}

export async function getParser(language: SupportedLanguage): Promise<Parser> {
  if (!initialized) {
    await Parser.init({
      locateFile(scriptName: string) {
        // Keep URL-like wasm paths untouched; only remap local parser runtime files.
        if (scriptName.endsWith(".wasm") && !/^[a-zA-Z]+:/.test(scriptName)) {
          return pathToFileURL(
            join(process.cwd(), "node_modules", "web-tree-sitter", scriptName),
          ).toString();
        }
        return scriptName;
      },
    });
    initialized = true;
  }

  const cached = parserCache.get(language);
  if (cached) return cached;

  let lang = languageCache.get(language);
  if (!lang) {
    lang = await loadLanguageFromUrl(GRAMMAR_URLS[language]);
    languageCache.set(language, lang);
  }

  const parser = new Parser();
  parser.setLanguage(lang);
  parserCache.set(language, parser);
  return parser;
}
