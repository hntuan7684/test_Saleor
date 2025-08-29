import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const TEST_CREDENTIALS = {
    validUser: {
        email: "testaccount455@mailinator.com",
        password: "ValidPass123!"
    },
    alternativeUser: {
        email: process.env.TEST_EMAIL || "test@example.com",
        password: process.env.TEST_PASSWORD || "testpassword123"
    }
}; 