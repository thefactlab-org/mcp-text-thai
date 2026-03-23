/**
 * Keyboard mapping between QWERTY and Thai keyboard layouts
 */

// QWERTY to Thai keyboard mapping
export const QWERTY_TO_THAI: Record<string, string> = {
  // Top row numbers
  '1': 'ๅ',
  '2': '/',
  '3': '_',
  '4': 'ภ',
  '5': 'ถ',
  '6': 'ุ',
  '7': 'ึ',
  '8': 'ค',
  '9': 'ต',
  '0': 'จ',
  '-': 'ข',
  '=': 'ช',

  // Top row with Shift
  '!': '+',
  '@': '๑',
  '#': '๒',
  '$': '๓',
  '%': '๔',
  '^': 'ู',
  '&': '฿',
  '*': '๕',
  '(': '๖',
  ')': '๗',
  '_': '๘',
  '+': '๙',

  // QWERTY letters
  'q': 'ๆ',
  'w': 'ไ',
  'e': 'ำ',
  'r': 'พ',
  't': 'ะ',
  'y': 'ั',
  'u': 'ี',
  'i': 'ร',
  'o': 'น',
  'p': 'ย',
  '[': 'บ',
  ']': 'ล',

  'a': 'ฟ',
  's': 'ห',
  'd': 'ก',
  'f': 'ด',
  'g': 'เ',
  'h': '้',
  'j': '่',
  'k': 'า',
  'l': 'ส',
  ';': 'ว',
  "'": 'ง',

  'z': 'ผ',
  'x': 'ป',
  'c': 'แ',
  'v': 'อ',
  'b': 'ิ',
  'n': 'ื',
  'm': 'ท',
  ',': 'ม',
  '.': 'ใ',
  '/': 'ฝ',

  // QWERTY uppercase letters
  'Q': '๐',
  'W': '"',
  'E': 'ฎ',
  'R': 'ฑ',
  'T': 'ธ',
  'Y': 'ํ',
  'U': '๊',
  'I': 'ณ',
  'O': 'ฯ',
  'P': 'ญ',
  '{': 'ฐ',
  '}': ',',

  'A': 'ฤ',
  'S': 'ฆ',
  'D': 'ฏ',
  'F': 'โ',
  'G': 'ฌ',
  'H': '็',
  'J': '๋',
  'K': 'ษ',
  'L': 'ศ',
  ':': 'ซ',
  '"': '.',

  'Z': '(',
  'X': ')',
  'C': 'ฉ',
  'V': 'ฮ',
  'B': 'ฺ',
  'N': '์',
  'M': '?',
  '<': 'ฒ',
  '>': 'ฬ',
  '?': 'ฦ'
};

// Reverse mapping (Thai to QWERTY)
export const THAI_TO_QWERTY: Record<string, string> = Object.fromEntries(
  Object.entries(QWERTY_TO_THAI).map(([key, value]) => [value, key])
);

// Function to check if text contains Thai characters
export function containsThai(text: string): boolean {
  return /[\u0E00-\u0E7F]/.test(text);
}

// Function to check if text is likely typed with wrong keyboard layout
export function isLikelyWrongLayout(text: string): boolean {
  // Check if text contains English characters but user intended Thai
  // This is a simple heuristic - can be improved
  const hasEnglish = /[a-zA-Z]/.test(text);
  const hasNumbers = /[0-9]/.test(text);
  const hasSpecialChars = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~-]/.test(text);
  
  return hasEnglish || hasNumbers || hasSpecialChars;
}