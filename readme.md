# Random Names Generator

A Node.js project that generates random names from Wiktionary data, with support for Norwegian SSN generation.

## Project Structure

```
randomNames/
├── src/
│   ├── Names.js       # Main name generator
│   ├── ssn.js        # SSN generator
│   ├── ssndb.js      # Optimized bulk generator
│   └── femaleNames.js # Female names helper
├── tests/
│   └── names.test.js # Test suite
├── scripts/
│   └── ssn.sh        # Bulk SSN generation script
├── data/
│   ├── names.db      # SQLite database
│   ├── ssn.db        # SSN database
│   ├── Female_given_names.txt
│   ├── Male_given_names.txt
│   └── Surnames.txt
└── legacy/
    └── java/         # Original Java implementation
        ├── Names.java
        ├── testNames.sh
        └── randomNames.iml
```

## Prerequisites

- Node.js >= 14.0.0
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/devicemanager/randomNames.git
cd randomNames
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Basic Name Generation
```bash
npm start
```

### Generate Names with Norwegian SSN
```bash
npm run generate:ssn
```

### Bulk Generation (Optimized)
```bash
npm run generate:bulk > output.txt
```

### Development
```bash
npm run dev
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Database Structure

The SQLite database (names.db) contains three tables:
- females (female names)
- males (male names)
- surnames

## Legacy Code

The original Java implementation of this project can be found in the `legacy/java` directory. The project has been fully migrated to Node.js, but the Java version is kept for reference.

## License

ISC © René Geers
