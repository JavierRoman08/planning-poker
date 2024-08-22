export default function validateGameName(gameName: string): { isValid: boolean, errorMessage: string | null } {
    let errorMessage: string | null;

    const hasInvalidChars = /[_.#,*\\/-]/.test(gameName);
    const isOnlyNumbers = /^\d+$/.test(gameName);
    const hasMoreThanThreeNumbers = (gameName.match(/\d/g) || []).length > 3;
    const isLengthValid = gameName.length >= 5 && gameName.length <= 20;

    if (hasInvalidChars) {
      errorMessage = "El nombre no puede contener caracteres especiales.";
      return {isValid: false, errorMessage};
    }
    if (isOnlyNumbers) {
      errorMessage = "El nombre no puede estar compuesto solo por números.";
      return {isValid: false, errorMessage};
    }
    if (hasMoreThanThreeNumbers) {
      errorMessage = "El nombre no puede tener más de 3 números.";
      return {isValid: false, errorMessage};
    }
    if (!isLengthValid) {
      errorMessage = "El nombre debe tener entre 5 y 20 caracteres.";
      return {isValid: false, errorMessage};
    }

    errorMessage = null;
    return {isValid: true, errorMessage};
  }