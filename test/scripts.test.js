const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

function run(script, env = {}) {
    return execFileSync(process.execPath, [script], {
        cwd: root,
        env: { ...process.env, ...env },
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
    });
}

function isValidSsn(ssn) {
    if (!/^\d{11}$/.test(ssn)) return false;
    const d = ssn.split('').map(Number);
    const k1w = [3, 7, 6, 1, 8, 9, 4, 5, 2];
    const k2w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const control = (weights) => {
        const r = 11 - (weights.reduce((sum, w, i) => sum + w * d[i], 0) % 11);
        return r === 11 ? 0 : r;
    };
    return control(k1w) === d[9] && control(k2w) === d[10];
}

function sexOf(ssn) {
    return Number(ssn[8]) % 2 === 1 ? 'm' : 'f';
}

test('Names.js prints "first, surname"', () => {
    const out = run('Names.js').trim();
    assert.match(out, /^[^,]+, [^,]+$/);
});

test('ssn.js prints a valid female SSN with a name', () => {
    const [ssn, first, surname] = run('ssn.js').trim().split(', ');
    assert.ok(isValidSsn(ssn), `invalid SSN ${ssn}`);
    assert.strictEqual(sexOf(ssn), 'f');
    assert.ok(first && surname);
});

test('ssndb.js emits unique, valid SSNs matching sex, including the first number per date', () => {
    const lines = run('ssndb.js', { SSN_DAYS: '4' }).trim().split('\n');
    const generator = require('fodselsnummer-generator');
    const seen = new Set();

    for (const line of lines) {
        const [ssn, sex, first, surname] = line.split(',');
        assert.ok(isValidSsn(ssn), `invalid SSN ${ssn}`);
        assert.strictEqual(sexOf(ssn), sex, `sex mismatch in ${line}`);
        assert.ok(first && surname, `missing name in ${line}`);
        assert.ok(!seen.has(ssn), `duplicate SSN ${ssn}`);
        seen.add(ssn);
    }

    const now = Date.now();
    let expected = 0;
    for (let i = 1; i < 4; i++) {
        const date = new Date(now - i * 24 * 3600 * 1000).toISOString().slice(0, 10);
        for (const sex of ['m', 'f']) {
            const numbers = generator.generate(date, sex).filter((n) => sexOf(n) === sex);
            expected += numbers.length;
            assert.ok(seen.has(numbers[0]), `first SSN ${numbers[0]} for ${date}/${sex} missing`);
        }
    }
    assert.strictEqual(lines.length, expected);
});

test('femaleNames.json matches Female_given_names.txt', () => {
    const json = JSON.parse(fs.readFileSync(path.join(root, 'femaleNames.json'), 'utf8'));
    const txt = fs.readFileSync(path.join(root, 'Female_given_names.txt'), 'utf8')
        .split('\n').filter((line) => line !== '');
    assert.deepStrictEqual(json.map((entry) => entry.femaleName), txt);
});

test('removed dependencies are gone and moment is patched', () => {
    const pkg = require(path.join(root, 'package.json'));
    for (const name of ['sqlite3', 'math', 'csvtojson']) {
        assert.ok(!(name in pkg.dependencies), `${name} still a dependency`);
    }
    const moment = require(require.resolve('moment/package.json', { paths: [require.resolve('fodselsnummer-generator')] }));
    const [major, minor] = moment.version.split('.').map(Number);
    assert.ok(major > 2 || (major === 2 && minor >= 31), `moment ${moment.version} < 2.31.0`);
});
