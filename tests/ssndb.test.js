import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Bulk SSN Generator', () => {
  let ssndbModule;
  let db;
  
  beforeAll(async () => {
    ssndbModule = await import('../src/ssndb.js');
    const dbPath = path.join(__dirname, '../data/names.db');
    db = new Database(dbPath, { readonly: true });
  });

  afterAll(() => {
    if (db) db.close();
  });

  test('database should have required tables', () => {
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table'"
    ).all();
    const tableNames = tables.map(t => t.name);
    
    expect(tableNames).toContain('females');
    expect(tableNames).toContain('males');
    expect(tableNames).toContain('surnames');
  });

  test('females table should have data', () => {
    const count = db.prepare('SELECT COUNT(*) as count FROM females').get();
    expect(count.count).toBeGreaterThan(0);
  });

  test('surnames table should have data', () => {
    const count = db.prepare('SELECT COUNT(*) as count FROM surnames').get();
    expect(count.count).toBeGreaterThan(0);
  });

  test('generateBulkSSN should return valid data', async () => {
    const results = await ssndbModule.default.generateBulkSSN(5);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    const firstResult = results[0];
    expect(firstResult).toHaveProperty('ssn');
    expect(firstResult).toHaveProperty('firstName');
    expect(firstResult).toHaveProperty('surname');
    expect(firstResult).toHaveProperty('gender');
    
    expect(firstResult.ssn).toMatch(/^\d{11}$/);
    expect(firstResult.gender).toMatch(/^[mf]$/);
    expect(typeof firstResult.firstName).toBe('string');
    expect(typeof firstResult.surname).toBe('string');
  });
});
