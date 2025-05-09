# CricTo - Cricket Information App

A Next.js application for cricket match information, live scores, and news.

## Environment Setup

Before running the application, you need to set up environment variables. Create a `.env.local` file in the root of your project with the following variables:

```
# Base URL for API requests (replace with your actual development URL)
NEXT_PUBLIC_BASE_URL="http://localhost:3002"

# Rapid API Key for Cricbuzz API
RAPID_API_KEY="your-rapid-api-key-here"

# Rapid API Host (optional, as it's already set in the API routes)
RAPID_API_HOST="cricbuzz-cricket2.p.rapidapi.com"
```

### Obtaining a Rapid API Key

1. Sign up or log in at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Cricbuzz API](https://rapidapi.com/cricbuzz-cricbuzz-default/api/cricbuzz-cricket)
3. Copy your API key from the dashboard
4. Paste it in your `.env.local` file

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at http://localhost:3002.

## Features

- Live cricket scores
- Match history and details
- Cricket news
- Series information

## Error Handling & Performance

The application is designed with robust error handling:

- **API Error Handling**: Centralized error utilities for consistent API responses
- **Component Error Boundaries**: Isolates errors to prevent entire app crashes
- **Image Loading**: Optimized with placeholders, lazy loading, and error fallbacks
- **Loading States**: Skeleton loaders and spinner components for better UX
- **PWA Support**: Progressive Web App configuration for offline capability

## Development Notes

### Image Configuration

The project includes proper image domain configuration in `next.config.ts` to handle:
- Local images (via Next.js Image component)
- API-proxied images (via the custom /api/image endpoint)

### API Routes

The application includes proxy API routes to securely handle external API requests while protecting API keys.

### Responsive Design

All components are designed to work across devices with responsive breakpoints.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
