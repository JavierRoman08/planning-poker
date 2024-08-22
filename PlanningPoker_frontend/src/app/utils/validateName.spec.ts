import validateGameName from "./validateName";

describe('validateGameName', () => {

  it('should return false for names shorter than 5 characters', () => {
    const result = validateGameName('abc');
    expect(result.isValid).toBeFalse();
    expect(result.errorMessage).toBe('El nombre debe tener entre 5 y 20 caracteres.');
  });

  it('should return false for names longer than 20 characters', () => {
    const result = validateGameName('thisisaverylonggamename');
    expect(result.isValid).toBeFalse();
    expect(result.errorMessage).toBe('El nombre debe tener entre 5 y 20 caracteres.');
  });

  it('should return false for names with invalid characters', () => {
    const result = validateGameName('game_name');
    expect(result.isValid).toBeFalse();
    expect(result.errorMessage).toBe('El nombre no puede contener caracteres especiales.');
  });

  it('should return false for names with more than 3 numbers', () => {
    const result = validateGameName('game1234');
    expect(result.isValid).toBeFalse();
    expect(result.errorMessage).toBe('El nombre no puede tener más de 3 números.');
  });

  it('should return false for names that are only numbers', () => {
    const result = validateGameName('12345');
    expect(result.isValid).toBeFalse();
    expect(result.errorMessage).toBe('El nombre no puede estar compuesto solo por números.');
  });

  it('should return true for valid game names', () => {
    const result = validateGameName('game123');
    expect(result.isValid).toBeTrue();
    expect(result.errorMessage).toBeNull();
  });
});