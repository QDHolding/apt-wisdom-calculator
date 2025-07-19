// Runtime environment variable loader for production
export function loadRuntimeEnv(): void {
  // In production, try to load from multiple sources
  if (typeof window === 'undefined') {
    // Server-side: try direct process.env and file system
    try {
      // Try to read from .env.production file if it exists
      const fs = require('fs');
      const path = require('path');
      const envFile = path.join(process.cwd(), '.env.production');
      
      if (fs.existsSync(envFile)) {
        const envContent: string = fs.readFileSync(envFile, 'utf-8');
        const envVars: Record<string, string> = envContent
          .split('\n')
          .filter((line: string) => line.trim() && line.includes('=') && !line.startsWith('#'))
          .reduce((acc: Record<string, string>, line: string) => {
            const equalIndex = line.indexOf('=');
            if (equalIndex > 0) {
              const key = line.substring(0, equalIndex).trim();
              const value = line.substring(equalIndex + 1).trim();
              acc[key] = value;
            }
            return acc;
          }, {});
        
        // Merge with process.env
        Object.assign(process.env, envVars);
        
        console.log('Loaded environment variables from .env.production:', Object.keys(envVars));
      } else {
        console.log('No .env.production file found at:', envFile);
      }
    } catch (error) {
      console.error('Failed to load .env.production:', error);
    }
  }
}

// Auto-load on import
loadRuntimeEnv();
