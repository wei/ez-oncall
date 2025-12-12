# NightOwl Tickets

A modern full-stack application for booking last-minute movie tickets for late-night showings. This is a fictional service designed to demonstrate incident response tooling and error monitoring capabilities.

## Features

- **Dark Theme UI**: Clean, modern interface optimized for late-night browsing
- **Checkout Flow**: Complete checkout process with intentional error scenarios
- **Error Monitoring Ready**: Pre-configured to work with Sentry and other error monitoring tools
- **DevOps Testing**: Built-in controls to trigger backend failures for testing incident response

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js (Node.js)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

### Production Build

Build the frontend for production:

```bash
npm run build
```

Run the backend server only:

```bash
npm start
```

## API Endpoints

### POST /api/checkout

Normal checkout endpoint that returns a 500 error to simulate a payment gateway timeout.

**Request:**
```json
{
  "email": "user@example.com",
  "movieId": "neon-midnight",
  "price": 24
}
```

**Response (500):**
```json
{
  "status": "error",
  "service": "checkout-service",
  "code": "CheckoutServiceTimeoutError",
  "message": "Payment gateway did not respond in time"
}
```

### POST /api/checkout-hard-crash

Triggers a fatal backend crash by throwing an unhandled exception. This endpoint is designed to test error monitoring tools and incident response workflows.

When called, the backend process will:
1. Log a detailed error to console
2. Throw an unhandled exception
3. Terminate the process

## Error Monitoring Integration

### Sentry Setup (Optional)

The backend includes a configuration stub for Sentry integration. To enable:

1. Install Sentry SDK:
```bash
npm install @sentry/node
```

2. Set environment variable:
```bash
export SENTRY_DSN="your-sentry-dsn-here"
```

3. Uncomment the Sentry initialization code in `server/sentry-config.js`

4. Import and initialize in `server/index.js`

## Deployment

### DigitalOcean / VPS Deployment

This application is designed to run on a long-lived server like a DigitalOcean droplet:

1. Set up your server with Node.js
2. Clone the repository
3. Install dependencies: `npm install`
4. Build the frontend: `npm run build`
5. Use a process manager like PM2 to run the backend:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name nightowl-backend
   ```
6. Set up nginx to serve the frontend build and proxy API requests to the backend
7. Configure environment variables including `SENTRY_DSN` if using error monitoring

## DevOps Testing

The application includes a "For DevOps" panel that allows you to:

- **Trigger hard checkout crash**: Intentionally crashes the backend process to test error monitoring and incident response workflows

This is useful for:
- Testing Sentry or other error monitoring integrations
- Demonstrating incident response tools like EZ OnCall
- Training DevOps teams on production incident handling

## Architecture

```
NightOwl Tickets/
├── server/              # Express backend
│   ├── index.js        # Main server file with API routes
│   └── sentry-config.js # Sentry integration stub
├── src/                # React frontend
│   ├── components/     # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FeaturedShows.tsx
│   │   ├── DevOpsPanel.tsx
│   │   ├── Footer.tsx
│   │   └── CheckoutModal.tsx
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
└── package.json       # Dependencies and scripts
```

## License

This is a fictional demo application for testing incident response tooling.
