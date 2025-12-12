import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const WEBHOOK_URL = process.env.SENTRY_WEBHOOK_URL;
const PAYMENT_GATEWAY_TIMEOUT = parseInt(process.env.PAYMENT_GATEWAY_TIMEOUT || '5000', 10); // Default 5 seconds
const PAYMENT_GATEWAY_RESPONSE_TIME = parseInt(process.env.PAYMENT_GATEWAY_RESPONSE_TIME || '2000', 10); // Simulated response time

app.use(cors());
app.use(express.json());

// Parse stack trace into structured frames for AI analysis
function parseStackTrace(stack) {
  if (!stack) return [];

  return stack
    .split('\n')
    .slice(1) // Skip the error message line
    .map(line => {
      const match = line.match(/at\s+(.+?)\s+\((.+):(\d+):(\d+)\)/) ||
                    line.match(/at\s+(.+):(\d+):(\d+)/);
      if (match) {
        if (match.length === 5) {
          return {
            function: match[1],
            filename: match[2],
            lineno: parseInt(match[3]),
            colno: parseInt(match[4]),
          };
        } else {
          return {
            function: '<anonymous>',
            filename: match[1],
            lineno: parseInt(match[2]),
            colno: parseInt(match[3]),
          };
        }
      }
      return { raw: line.trim() };
    })
    .filter(frame => frame.filename || frame.raw);
}

// Send error to webhook with full stack trace for AI debugging
async function sendAlert(error, context = {}) {
  if (!WEBHOOK_URL) {
    console.log('SENTRY_WEBHOOK_URL not set, skipping webhook notification');
    return;
  }

  const stackFrames = parseStackTrace(error.stack);

  const payload = {
    event: 'alert',
    triggered_at: new Date().toISOString(),
    level: context.level || 'error',
    culprit: context.culprit || 'checkout-service',
    message: error.message || error,
    environment: process.env.NODE_ENV || 'production',
    project: 'nightowl-tickets',
    url: `http://localhost:${PORT}${context.path || '/'}`,

    // Full exception info for AI analysis
    exception: {
      type: error.name || 'Error',
      value: error.message,
      stacktrace: {
        frames: stackFrames,
        raw: error.stack,
      },
    },

    // Context for debugging
    context: {
      service: context.culprit,
      endpoint: context.path,
      method: 'POST',
      ...context,
    },

    // Suggested fix hints
    tags: {
      error_type: context.mode === 'hard-crash' ? 'fatal' : 'recoverable',
      service: 'checkout-service',
      component: 'payment-gateway',
    },
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`Webhook sent: ${response.status}`);
  } catch (err) {
    console.error('Failed to send webhook:', err.message);
  }
}

// Simulate payment gateway call with timeout
async function processPayment(email, movieId, price) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Payment gateway did not respond in time'));
    }, PAYMENT_GATEWAY_TIMEOUT);

    // Simulate payment processing
    setTimeout(() => {
      clearTimeout(timeout);
      resolve({
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        movieId,
        price,
      });
    }, PAYMENT_GATEWAY_RESPONSE_TIME);
  });
}

app.post('/api/checkout', async (req, res) => {
  const { email, movieId, price } = req.body;

  try {
    // Process payment with timeout handling
    const result = await processPayment(email, movieId, price);
    
    console.log({
      service: "checkout-service",
      path: "/api/checkout",
      status: "success",
      details: { email, movieId, price, transactionId: result.transactionId },
    });

    res.status(200).json({
      status: "success",
      service: "checkout-service",
      transactionId: result.transactionId,
      message: "Payment processed successfully"
    });
  } catch (error) {
    // Create real Error to capture stack trace
    const timeoutError = new Error("CheckoutServiceTimeoutError: Payment gateway did not respond in time");
    timeoutError.name = "CheckoutServiceTimeoutError";

    console.error({
      service: "checkout-service",
      path: "/api/checkout",
      error: timeoutError.message,
      mode: "soft-fail",
      details: { email, movieId, price },
      stack: timeoutError.stack,
    });

    await sendAlert(timeoutError, {
      level: 'error',
      culprit: 'checkout-service',
      path: '/api/checkout',
      mode: 'soft-fail',
      request_data: { email, movieId, price },
    });

    res.status(500).json({
      status: "error",
      service: "checkout-service",
      code: "CheckoutServiceTimeoutError",
      message: "Payment gateway did not respond in time"
    });
  }
});

app.post('/api/checkout-hard-crash', async (req, res) => {
  // Create real Error to capture stack trace
  const error = new Error("CheckoutServiceFatalError: Unrecoverable failure in payment workflow");
  error.name = "CheckoutServiceFatalError";

  console.error({
    service: "checkout-service",
    path: "/api/checkout-hard-crash",
    error: error.message,
    mode: "hard-crash",
    timestamp: new Date().toISOString(),
    stack: error.stack,
  });

  await sendAlert(error, {
    level: 'fatal',
    culprit: 'checkout-service',
    path: '/api/checkout-hard-crash',
    mode: 'hard-crash',
  });

  res.status(500).json({
    status: "error",
    service: "checkout-service",
    code: "CheckoutServiceFatalError",
    message: "Unrecoverable failure in payment workflow"
  });
});

app.listen(PORT, () => {
  console.log(`NightOwl Tickets backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Payment Gateway Timeout: ${PAYMENT_GATEWAY_TIMEOUT}ms`);
  console.log(`Payment Gateway Response Time: ${PAYMENT_GATEWAY_RESPONSE_TIME}ms`);

  if (WEBHOOK_URL) {
    console.log('Webhook alerts: ENABLED');
  } else {
    console.log('Webhook alerts: DISABLED (set SENTRY_WEBHOOK_URL to enable)');
  }
});
