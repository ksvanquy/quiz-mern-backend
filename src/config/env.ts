import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || '';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';

/**
 * Verify that all required environment secrets are properly configured
 * Should be called at server startup
 */
export const verifySecretsLoaded = (): void => {
  const missingSecrets: string[] = [];
  
  if (!process.env.ACCESS_TOKEN_SECRET) {
    missingSecrets.push('ACCESS_TOKEN_SECRET');
  }
  if (!process.env.REFRESH_TOKEN_SECRET) {
    missingSecrets.push('REFRESH_TOKEN_SECRET');
  }
  
  if (missingSecrets.length > 0) {
    throw new Error(
      `🔐 CRITICAL: Missing required environment secrets: ${missingSecrets.join(', ')}\n` +
      `Please set these in your .env file with strong random values.`
    );
  }
  
  // Warn if secrets appear to be placeholder/weak values
  if (process.env.ACCESS_TOKEN_SECRET?.includes('your_') || 
      process.env.REFRESH_TOKEN_SECRET?.includes('your_') ||
      process.env.ACCESS_TOKEN_SECRET?.length! < 32 ||
      process.env.REFRESH_TOKEN_SECRET?.length! < 32) {
    console.warn(
      '⚠️  WARNING: JWT secrets appear to be weak or placeholder values.\n' +
      '   For production, use strong random values (min 32 characters).\n' +
      '   Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
};
