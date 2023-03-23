export const RESULTS_LENGTH = 5;

export type IBANValidationResult = {
  iban: string,
  valid: boolean,
  timestamp: number,
};

// from https://www.iban.com/structure
const IBAN_LENGTH = 22;
const COUNTRY_CODE = 'ME';

const calculateChecksum = (iban: string): number => {
  if (iban.length > 9) {
    const leftmostNine = iban.substring(0, 9);
    const mod97 = (Number(leftmostNine) % 97).toString();

    return calculateChecksum(iban.replace(leftmostNine, mod97));
  }

  return Number(iban) % 97;
};

export const validateIBAN = (iban: string) => {
  // Convert to basic format
  const basic = iban.replace(/[^a-zA-Z0-9]/g, '');

  if (
    basic.length !== IBAN_LENGTH ||
    basic.substring(0, 2) !== COUNTRY_CODE
  ) {
    return false;
  }

  // Move the first four characters of the IBAN to the right of the number
  const moved = `${basic.substring(4)}${basic.substring(0, 4)}`;

  // Convert the letters into numerics
  const converted = moved.replace(/[A-Za-z]/g, (char) =>
    (char.toUpperCase().charCodeAt(0) - 55).toString(),
  );

  // Validate check digits
  return calculateChecksum(converted) === 1;
};
