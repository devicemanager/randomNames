import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Names Generator', () => {
  let Names;
  
  beforeAll(async () => {
    Names = (await import('../src/Names.js')).default;
  });

  test('should be defined', () => {
    expect(Names).toBeDefined();
  });

  test('should return a string when generating a name', async () => {
    const name = await Names.generateName();
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });

  test('should contain both first name and surname', async () => {
    const name = await Names.generateName();
    const parts = name.split(',').map(part => part.trim());
    expect(parts).toHaveLength(2);
  });

  test('should not return empty name parts', async () => {
    const name = await Names.generateName();
    const parts = name.split(',').map(part => part.trim());
    parts.forEach(part => {
      expect(part.length).toBeGreaterThan(0);
    });
  });

  test('should generate different names on subsequent calls', async () => {
    const name1 = await Names.generateName();
    const name2 = await Names.generateName();
    expect(name1).not.toBe(name2);
  });
});
