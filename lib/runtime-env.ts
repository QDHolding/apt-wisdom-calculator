// Runtime environment variable loader for production
export function loadRuntimeEnv() {
  // In production, try to load from multiple sources
  if (typeof window === 'undefined') {
    // Server-side: try direct process.env and file system
    try {
      // Try to read from .env.production file if it exists
      const fs = require('fs');
      const path = require('path');
      const envFile = path.join(process.cwd(), '.env.production');
      
      if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf-8');
        const envVars = envContent.split('\n')
          .filter(line => line.includes('='))
          .reduce((acc, line) => {
            const [key, ...values] = line.split('=');
            acc[key.trim()] = values.join('=').trim();
            return acc;
          }, {} as Record<string, string>);
        
        // Merge with process.env
        Object.assign(process.env, envVars);
        
        console.log('Loaded environment variables from .env.production:', Object.keys(envVars));
      }
    } catch (error) {
      console.error('Failed to load .env.production:', error);
    }
  }
}

// Auto-load on import
loadRuntimeEnv();
