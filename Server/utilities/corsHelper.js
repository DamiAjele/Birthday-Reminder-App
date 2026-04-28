// Helper to provide CORS options and log denied origins for debugging
const DEFAULT_ALLOWED = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5173',
];

function getCorsOptions() {
  const allowed = Array.from(new Set(DEFAULT_ALLOWED.concat(process.env.EXTRA_ALLOWED_ORIGINS ? process.env.EXTRA_ALLOWED_ORIGINS.split(',') : [])));

  return {
    origin(origin, callback) {
      // Allow requests with no origin (e.g., server-to-server or same-origin)
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) {
        return callback(null, true);
      }
      // Log denied origin for debugging
      console.warn(`CORS denied origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };
}

module.exports = getCorsOptions;
