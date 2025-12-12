// Sentry Integration Stub
// Uncomment and configure when deploying to production with error monitoring

// import * as Sentry from "@sentry/node";

// export function initSentry() {
//   if (process.env.SENTRY_DSN) {
//     Sentry.init({
//       dsn: process.env.SENTRY_DSN,
//       environment: process.env.NODE_ENV || 'development',
//       tracesSampleRate: 1.0,
//       integrations: [
//         new Sentry.Integrations.Http({ tracing: true }),
//         new Sentry.Integrations.Express({ app }),
//       ],
//     });
//     console.log('Sentry initialized with DSN');
//     return true;
//   }
//   return false;
// }

// To enable Sentry:
// 1. npm install @sentry/node
// 2. Set SENTRY_DSN environment variable
// 3. Uncomment the code above
// 4. Import and call initSentry() at the top of server/index.js
