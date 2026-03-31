import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Parse MySQL INSERT VALUES: rows of 8 single-quoted fields ('' = escaped ') */
function parseInsertValues(sql) {
  const valuesIdx = sql.indexOf("VALUES");
  if (valuesIdx === -1) throw new Error("No VALUES in SQL");
  let i = sql.indexOf("(", valuesIdx);
  if (i === -1) throw new Error("No opening paren after VALUES");
  const rows = [];

  function readQuotedString() {
    if (sql[i] !== "'") throw new Error(`Expected ' at ${i}`);
    i++;
    let s = "";
    while (i < sql.length) {
      const c = sql[i];
      if (c === "'") {
        if (sql[i + 1] === "'") {
          s += "'";
          i += 2;
          continue;
        }
        i++;
        return s;
      }
      s += c;
      i++;
    }
    throw new Error("Unterminated string");
  }

  while (i < sql.length) {
    while (i < sql.length && /[\s,]/.test(sql[i])) i++;
    if (i >= sql.length || sql[i] === ";") break;
    if (sql[i] !== "(") {
      i++;
      continue;
    }
    i++;
    const fields = [];
    for (let f = 0; f < 8; f++) {
      while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r" || sql[i] === "\t") i++;
      fields.push(readQuotedString());
      while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r" || sql[i] === "\t") i++;
      if (f < 7) {
        if (sql[i] !== ",")
          throw new Error(
            `Expected , after field ${f} at ${i}, got ${JSON.stringify(sql.slice(i, i + 20))}`
          );
        i++;
      }
    }
    rows.push(fields);
    while (sql[i] === " " || sql[i] === "\n" || sql[i] === "\r" || sql[i] === "\t") i++;
    if (sql[i] !== ")") throw new Error(`Expected ) at ${i}`);
    i++;
  }

  return rows.map(([id, title, description, level, tag, hint, boilerplate, test_cases]) => ({
    id,
    title,
    description,
    level,
    tag,
    hint: hint || null,
    boilerplate: boilerplate || "",
    test_cases: test_cases || "[]",
  }));
}

const sqlPath =
  process.argv[2] || path.join(__dirname, "..", "data", "insert_questions.sql");

const dbPath = path.join(__dirname, "..", "data", "questions.db");

console.log(`Reading SQL from: ${sqlPath}`);

const sql = fs.readFileSync(sqlPath, "utf8");
const questions = parseInsertValues(sql);

if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS question_bank (
    id          TEXT NOT NULL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    level       TEXT NOT NULL CHECK(level IN ('easy', 'medium', 'hard')),
    tag         TEXT NOT NULL,
    hint        TEXT,
    boilerplate TEXT,
    test_cases  TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_question_bank_tag ON question_bank(tag);
  CREATE INDEX IF NOT EXISTS idx_question_bank_level ON question_bank(level);
`);

const insert = db.prepare(`
  INSERT INTO question_bank (id, title, description, level, tag, hint, boilerplate, test_cases)
  VALUES (@id, @title, @description, @level, @tag, @hint, @boilerplate, @test_cases)
`);

const insertMany = db.transaction((qs) => {
  for (const q of qs) insert.run(q);
});

insertMany(questions);
db.close();

console.log(`✓ Seeded ${questions.length} questions into ${dbPath}`);
