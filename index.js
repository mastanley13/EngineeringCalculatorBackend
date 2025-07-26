const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// --- CORS CONFIG ---
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log('CORS: Request from origin:', origin);
    
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:3000', 
      'http://localhost:4173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4173',
      'https://engineering-calc-api.vercel.app',
      'https://engineering-calc-api.vercel.app/',
      'https://engineer-brain-tool.vercel.app',
      'https://engineer-brain-tool.vercel.app/'
    ];
    
    // Allow any Vercel preview URLs for engineer-brain-tool
    if (origin.includes('engineer-brain-tool') && origin.includes('vercel.app')) {
      console.log('CORS: Allowing Vercel engineer-brain-tool origin:', origin);
      return callback(null, true);
    }
    
    // Allow any localhost development URLs
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('CORS: Allowing localhost development origin:', origin);
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS: Allowing whitelisted origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS: Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Custom-Header'],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false
};

app.use(cors(corsOptions));

// Add explicit OPTIONS handling for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'} - User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'Unknown'}`);
  next();
});

// Serve static files (for test-cors.html)
app.use(express.static(__dirname));

// --- TEST ENDPOINT ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS works! Backend is running successfully.' });
});

// --- SLOPE CALCULATION ENDPOINT ---
app.get('/api/slope', (req, res) => {

  try {
    const { rise, run } = req.query;

    if (!rise || !run) {
      return res.status(400).json({ status: 'error', message: 'Missing rise or run' });
    }

    const riseNum = parseFloat(rise);
    const runNum = parseFloat(run);

    if (isNaN(riseNum) || isNaN(runNum) || runNum === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid input values' });
    }

    const slope = (riseNum / runNum) * 100;
    const angle = Math.atan(riseNum / runNum) * (180 / Math.PI);

    const workShown = `
Given:
• Rise = ${riseNum} ft
• Run = ${runNum} ft

Calculations:
• Slope (%) = (Rise ÷ Run) × 100 = ${slope.toFixed(2)}%
• Angle = arctan(Rise ÷ Run) = ${angle.toFixed(2)}°
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        slope: slope.toFixed(2),
        angle: angle.toFixed(2),
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Slope calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// --- HEALTH CHECK ENDPOINT ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Engineering Calculator API is running'
  });
});

// --- ROOT ENDPOINT ---
app.get('/', (req, res) => {
  res.json({ 
    message: 'Engineering Calculator API',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      slope: '/api/slope?rise=<value>&run=<value>',
      health: '/api/health'
    },
    tools: {
      corsTest: '/test-cors.html'
    }
  });
});

// --- CORS TEST PAGE ---
app.get('/test-cors.html', (req, res) => {
  res.sendFile(__dirname + '/test-cors.html');
});

// --- SIMPLE TEST PAGE ---
app.get('/test-simple.html', (req, res) => {
  res.sendFile(__dirname + '/test-simple.html');
});

// --- CORS DEBUG PAGE ---
app.get('/debug-cors.html', (req, res) => {
  res.sendFile(__dirname + '/debug-cors.html');
});

// --- ERROR HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// --- 404 HANDLER ---
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    availableEndpoints: ['/api/test', '/api/slope', '/api/health']
  });
});

// --- START SERVER (only for local development) ---
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Engineering Calculator Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🧮 Slope calculator: http://localhost:${PORT}/api/slope?rise=10&run=100`);
  });
}

// --- EXPORT FOR VERCEL ---
module.exports = app;
