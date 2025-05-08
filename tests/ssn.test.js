import { fileURLToPath } from 'url';
import { dirname } from 'path';
import moment from 'moment';
import sqlite3 from 'sqlite3';
import generator from 'fodselsnummer-generator';

describe('SSN Generator', () => {
  let ssnModule;
  
  beforeAll(async () => {
    ssnModule = await import('../src/ssn.js');
  });

  test('should generate valid Norwegian SSN', () => {
    const date = moment().format('YYYY-MM-DD');
    const numbers = generator.generate(date, 'f');
    expect(numbers).toBeInstanceOf(Array);
    expect(numbers[0]).toMatch(/^\d{11}$/); // SSN should be 11 digits
  });

  test('should generate SSN with correct format', () => {
    const date = moment().format('YYYY-MM-DD');
    const numbers = generator.generate(date, 'f');
    const ssn = numbers[0];
    
    // Test date part format (first 6 digits)
    const datePart = ssn.substring(0, 6);
    expect(datePart).toMatch(/^\d{6}$/);
    
    // Test individual number (digits 7-9)
    const individualPart = ssn.substring(6, 9);
    expect(individualPart).toMatch(/^\d{3}$/);
    
    // Test control digits (last 2 digits)
    const controlDigits = ssn.substring(9);
    expect(controlDigits).toMatch(/^\d{2}$/);
  });
});
