// Environment variable configuration with fallbacks
export const getEnvVar = (key: string): string | undefined => {
  // Try multiple sources for environment variables
  const value = 
    process.env[key] ||                    // Standard process.env
    (global as any).__ENV__?.[key] ||      // Global fallback
    (typeof window !== 'undefined' && (window as any).__ENV__?.[key]); // Client-side fallback

  if (!value) {
    console.warn(`Environment variable ${key} not found`);
  }

  return value;
};

export const config = {
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY'),
  },
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY'),
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  },
};

// Debug logging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Environment config loaded:', {
    hasOpenAI: !!config.openai.apiKey,
    hasStripeSecret: !!config.stripe.secretKey,
    hasStripePublic: !!config.stripe.publishableKey,
    hasWebhookSecret: !!config.stripe.webhookSecret,
  });
}
