import * as Sentry from '@sentry/browser';

const CURRENT_ENV = import.meta.env.VITE_ENV || 'production';
const DSN = import.meta.env.VITE_SENTRY_DSN;

/**
 * Initializes Sentry error monitoring.
 * No-op unless VITE_SENTRY_DSN is set and environment is production.
 * Wires Sentry into ErrorHandler via window.errorTracker.
 */
export function initSentry() {
  if (CURRENT_ENV !== 'production' || !DSN) return;

  Sentry.init({
    dsn: DSN,
    environment: CURRENT_ENV,
    // Sample 100% of errors; reduce in future if volume is too high
    sampleRate: 1.0,
    // Capture unhandled promise rejections and global errors automatically
    integrations: [Sentry.browserTracingIntegration()],
    // No performance tracing (keep it minimal / free tier)
    tracesSampleRate: 0,
  });

  // Wire into existing ErrorHandler._trackError hook
  window.errorTracker = {
    captureException: (error, context) => {
      Sentry.withScope((scope) => {
        if (context?.operation) scope.setTag('operation', context.operation);
        if (context?.data) scope.setContext('data', context.data);
        Sentry.captureException(error);
      });
    },
  };
}
