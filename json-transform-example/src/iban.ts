export function normalizeIBAN(input: string) {
    return input.toUpperCase().replace(/[^0-9A-Z]/g, '');
}

export function isValidIBAN(input: string) {
    // Remove space and make uppercase.
    const iban = input.toUpperCase().replace(/[ ]/g, '');
    // Match and capture (1) the country code, (2) the check digits, and (3) the rest
    const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
    // check syntax and length
    if (!code || iban.length !== CODE_LENGTHS[code![1]]) {
        return false;
    }
    // rearrange country code and check digits, and convert chars to ints
    const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter: string) {
        return "" + (letter.charCodeAt(0) - 55);
    });
    // final check
    return calculateMod(digits, 97) === 1;
}

// supported country codes and the corresponding lengths of the account numbers
const CODE_LENGTHS: { [key: string]: number; } = {
    AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
    CH: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
    FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
    HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
    LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
    MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
    RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,
    AL: 28, BY: 28, CR: 22, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25,
    SV: 28, TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
};

function calculateMod(str: string, mod: number): number {
    const n = str.length;
    if (n <= 10) {
        return parseInt(str) % mod;
    }
    const first = str.substring(0, n - 10);
    const second = str.substring(n - 10);
    return (calculateMod(first, mod) * (Math.pow(10, 10) % mod) + parseInt(second) % mod) % mod;
}
