import { theme } from '../src/theme/theme';

describe('Design Tokens (Theme)', () => {
  it('should export colors with expected keys', () => {
    expect(theme).toHaveProperty('colors');
    expect(theme.colors).toHaveProperty('forest');
  });

  it('should export typography with expected keys', () => {
    expect(theme).toHaveProperty('typography');
    expect(theme.typography).toHaveProperty('h1');
  });

  it('should export spacing', () => {
    expect(theme).toHaveProperty('spacing');
  });

  it('should export radius', () => {
    expect(theme).toHaveProperty('radius');
  });
});
