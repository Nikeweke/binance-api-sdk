
const keys = [
  'API_KEY',
  'SECRET_KEY',
]

// unit tests for env file
describe('env', () => {
  for (const key of keys) {
    it(`should have a ${key}`, () => {
      expect(process.env[key]).toBeDefined();
    });
  }
})