// Test credentials for login testing
// In production, these should be stored in environment variables
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const TEST_CREDENTIALS = {
  VALID_EMAIL: process.env.TEST_EMAIL || "test@example.com",
  VALID_PASSWORD: process.env.TEST_PASSWORD || "testpassword123",
  INVALID_EMAIL: "unregistered@example.com",
  INVALID_PASSWORD: "WrongPassword",
  LOCKED_EMAIL: "lockeduser@example.com",
  TEMP_LOCKED_EMAIL: "temp.locked@example.com",
  PERM_LOCKED_EMAIL: "perm.locked@example.com"
};

export const TEST_EMAILS = {
  VALID: TEST_CREDENTIALS.VALID_EMAIL,
  INVALID_FORMAT: "invalid-email-format",
  MISSING_AT: "invalidemail.com",
  MISSING_DOMAIN: "user@",
  WITH_ALIAS: `${TEST_CREDENTIALS.VALID_EMAIL.split('@')[0]}+alias@${TEST_CREDENTIALS.VALID_EMAIL.split('@')[1]}`,
  UPPERCASE: TEST_CREDENTIALS.VALID_EMAIL.toUpperCase(),
  WITH_WHITESPACE: `  ${TEST_CREDENTIALS.VALID_EMAIL}  `,
  UNREGISTERED: "unregistered@example.com"
};

export const TEST_PASSWORDS = {
  VALID: TEST_CREDENTIALS.VALID_PASSWORD,
  INVALID: "WrongPassword",
  SHORT: "short",
  SPECIAL_CHARS: "!@#$%^&*()",
  EMPTY: ""
}; 