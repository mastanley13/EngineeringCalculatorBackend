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
    
    // Allow specific production domains
    const allowedOrigins = [
      'https://engineer-brain-tool.vercel.app',
      'https://engineering-calc-api.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
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

// Apply CORS middleware
app.use(cors(corsOptions));

// Add explicit OPTIONS handling for all routes
app.options('*', cors(corsOptions));

// Fallback CORS headers for additional safety
app.use((req, res, next) => {
  // Set CORS headers as a fallback
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Custom-Header');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

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

// --- CIVIL ENGINEERING ENDPOINTS ---

// Grade Percent Calculation
app.get('/api/grade-percent', (req, res) => {
  try {
    const { rise, run } = req.query;

    if (!rise || !run) {
      return res.status(400).json({ status: 'error', message: 'Missing rise or run parameters' });
    }

    const riseNum = parseFloat(rise);
    const runNum = parseFloat(run);

    if (isNaN(riseNum) || isNaN(runNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    if (runNum === 0) {
      return res.status(400).json({ status: 'error', message: 'Run cannot be zero (division by zero)' });
    }

    const gradePercent = (riseNum / runNum) * 100;

    const workShown = `
Given:
• Rise = ${riseNum} ft
• Run = ${runNum} ft

Calculation:
• Grade (%) = (Rise ÷ Run) × 100
• Grade (%) = (${riseNum} ÷ ${runNum}) × 100
• Grade (%) = ${gradePercent.toFixed(2)}%
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: `${gradePercent.toFixed(2)}%`,
        gradePercent: gradePercent.toFixed(2)
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Grade percent calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// Slope Angle Calculation
app.get('/api/slope-angle', (req, res) => {
  try {
    const { rise, run } = req.query;

    if (!rise || !run) {
      return res.status(400).json({ status: 'error', message: 'Missing rise or run parameters' });
    }

    const riseNum = parseFloat(rise);
    const runNum = parseFloat(run);

    if (isNaN(riseNum) || isNaN(runNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    if (runNum === 0) {
      return res.status(400).json({ status: 'error', message: 'Run cannot be zero (division by zero)' });
    }

    const angleRadians = Math.atan(riseNum / runNum);
    const angleDegrees = angleRadians * (180 / Math.PI);

    const workShown = `
Given:
• Rise = ${riseNum} ft
• Run = ${runNum} ft

Calculation:
• θ = arctan(Rise ÷ Run)
• θ = arctan(${riseNum} ÷ ${runNum})
• θ = arctan(${(riseNum/runNum).toFixed(4)})
• θ = ${angleDegrees.toFixed(2)}°
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: `${angleDegrees.toFixed(2)}°`,
        angleDegrees: angleDegrees.toFixed(2),
        angleRadians: angleRadians.toFixed(4)
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Slope angle calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// Horizontal Distance Calculation
app.get('/api/horizontal-distance', (req, res) => {
  try {
    const { rise, slope } = req.query;

    if (!rise || !slope) {
      return res.status(400).json({ status: 'error', message: 'Missing rise or slope parameters' });
    }

    const riseNum = parseFloat(rise);
    const slopeNum = parseFloat(slope);

    if (isNaN(riseNum) || isNaN(slopeNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    if (slopeNum === 0) {
      return res.status(400).json({ status: 'error', message: 'Slope cannot be zero (division by zero)' });
    }

    const run = riseNum / slopeNum;

    const workShown = `
Given:
• Rise = ${riseNum} ft
• Slope = ${slopeNum}

Calculation:
• Run = Rise ÷ Slope
• Run = ${riseNum} ÷ ${slopeNum}
• Run = ${run.toFixed(2)} ft
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: `${run.toFixed(2)} ft`,
        horizontalDistance: run.toFixed(2)
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Horizontal distance calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// Vertical Rise Calculation
app.get('/api/vertical-rise', (req, res) => {
  try {
    const { slope, run } = req.query;

    if (!slope || !run) {
      return res.status(400).json({ status: 'error', message: 'Missing slope or run parameters' });
    }

    const slopeNum = parseFloat(slope);
    const runNum = parseFloat(run);

    if (isNaN(slopeNum) || isNaN(runNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    const rise = slopeNum * runNum;

    const workShown = `
Given:
• Slope = ${slopeNum}
• Run = ${runNum} ft

Calculation:
• Rise = Slope × Run
• Rise = ${slopeNum} × ${runNum}
• Rise = ${rise.toFixed(2)} ft
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: `${rise.toFixed(2)} ft`,
        verticalRise: rise.toFixed(2)
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Vertical rise calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// --- GENERAL MATH ENDPOINTS ---

// Quadratic Equation Solver
app.get('/api/quadratic-equation', (req, res) => {
  try {
    const { a, b, c } = req.query;

    if (!a || !b || !c) {
      return res.status(400).json({ status: 'error', message: 'Missing a, b, or c parameters' });
    }

    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    if (isNaN(aNum) || isNaN(bNum) || isNaN(cNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    if (aNum === 0) {
      return res.status(400).json({ status: 'error', message: 'Coefficient "a" cannot be zero (not a quadratic equation)' });
    }

    const discriminant = (bNum * bNum) - (4 * aNum * cNum);
    
    let x1, x2, solutions;
    
    if (discriminant > 0) {
      x1 = (-bNum + Math.sqrt(discriminant)) / (2 * aNum);
      x2 = (-bNum - Math.sqrt(discriminant)) / (2 * aNum);
      solutions = `Two real solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
    } else if (discriminant === 0) {
      x1 = -bNum / (2 * aNum);
      solutions = `One real solution: x = ${x1.toFixed(4)}`;
    } else {
      const realPart = (-bNum / (2 * aNum)).toFixed(4);
      const imaginaryPart = (Math.sqrt(-discriminant) / (2 * aNum)).toFixed(4);
      solutions = `Two complex solutions: x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`;
    }

    const workShown = `
Given quadratic equation: ${aNum}x² + ${bNum}x + ${cNum} = 0

Step 1: Calculate discriminant
• Δ = b² - 4ac
• Δ = (${bNum})² - 4(${aNum})(${cNum})
• Δ = ${bNum * bNum} - ${4 * aNum * cNum}
• Δ = ${discriminant}

Step 2: Apply quadratic formula
• x = (-b ± √Δ) / 2a
• x = (${-bNum} ± √${discriminant}) / ${2 * aNum}

Result: ${solutions}
    `;

    const result = {
      primaryResult: solutions,
      discriminant: discriminant,
      hasRealSolutions: discriminant >= 0
    };

    if (discriminant >= 0) {
      if (discriminant > 0) {
        result.x1 = x1.toFixed(4);
        result.x2 = x2.toFixed(4);
      } else {
        result.x = x1.toFixed(4);
      }
    }

    return res.status(200).json({
      status: 'success',
      result: result,
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Quadratic equation calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// Trigonometric Functions
app.get('/api/trigonometric', (req, res) => {
  try {
    const { angle, unit = 'degrees', function: trigFunction } = req.query;

    if (!angle || !trigFunction) {
      return res.status(400).json({ status: 'error', message: 'Missing angle or function parameters' });
    }

    const angleNum = parseFloat(angle);

    if (isNaN(angleNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid angle value' });
    }

    if (!['sin', 'cos', 'tan'].includes(trigFunction)) {
      return res.status(400).json({ status: 'error', message: 'Function must be sin, cos, or tan' });
    }

    // Convert to radians if needed
    const angleInRadians = unit === 'degrees' ? angleNum * (Math.PI / 180) : angleNum;
    const angleDisplay = unit === 'degrees' ? `${angleNum}°` : `${angleNum} rad`;

    let result, functionName;
    
    switch (trigFunction) {
      case 'sin':
        result = Math.sin(angleInRadians);
        functionName = 'Sine';
        break;
      case 'cos':
        result = Math.cos(angleInRadians);
        functionName = 'Cosine';
        break;
      case 'tan':
        result = Math.tan(angleInRadians);
        functionName = 'Tangent';
        // Check for undefined values (e.g., tan(90°, 270°, etc.))
        if (!isFinite(result) || Math.abs(result) > 1e15) {
          return res.status(400).json({ status: 'error', message: 'Tangent is undefined for this angle (90°, 270°, etc.)' });
        }
        break;
    }

    const workShown = `
Given:
• Angle = ${angleDisplay}
• Function = ${functionName}

Calculation:
• ${trigFunction}(${angleDisplay}) = ${result.toFixed(6)}
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: result.toFixed(6),
        function: trigFunction,
        angle: angleNum,
        unit: unit,
        result: result.toFixed(6)
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Trigonometric calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// Percent Error Calculation
app.get('/api/percent-error', (req, res) => {
  try {
    const { experimental, theoretical } = req.query;

    if (!experimental || !theoretical) {
      return res.status(400).json({ status: 'error', message: 'Missing experimental or theoretical values' });
    }

    const expNum = parseFloat(experimental);
    const theoNum = parseFloat(theoretical);

    if (isNaN(expNum) || isNaN(theoNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    if (theoNum === 0) {
      return res.status(400).json({ status: 'error', message: 'Theoretical value cannot be zero (division by zero)' });
    }

    const percentError = Math.abs((expNum - theoNum) / theoNum) * 100;

    const workShown = `
Given:
• Experimental Value = ${expNum}
• Theoretical Value = ${theoNum}

Calculation:
• Percent Error = |Experimental - Theoretical| / Theoretical × 100%
• Percent Error = |${expNum} - ${theoNum}| / ${theoNum} × 100%
• Percent Error = |${(expNum - theoNum).toFixed(4)}| / ${theoNum} × 100%
• Percent Error = ${Math.abs(expNum - theoNum).toFixed(4)} / ${theoNum} × 100%
• Percent Error = ${percentError.toFixed(2)}%
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: `${percentError.toFixed(2)}%`,
        percentError: percentError.toFixed(2),
        absoluteError: Math.abs(expNum - theoNum).toFixed(4)
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Percent error calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// --- ELECTRICAL ENGINEERING ENDPOINTS ---

// Ohm's Law Calculator
app.get('/api/ohms-law', (req, res) => {
  try {
    const { voltage, current, resistance } = req.query;
    
    // Count how many parameters we have
    const params = [voltage, current, resistance].filter(p => p !== undefined && p !== '');
    
    if (params.length !== 2) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Provide exactly 2 of the 3 parameters: voltage, current, resistance' 
      });
    }

    const V = voltage ? parseFloat(voltage) : null;
    const I = current ? parseFloat(current) : null;
    const R = resistance ? parseFloat(resistance) : null;

    // Check for valid numbers
    if ((V !== null && isNaN(V)) || (I !== null && isNaN(I)) || (R !== null && isNaN(R))) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    let result, missing, workShown;

    if (V !== null && I !== null) {
      // Calculate R = V / I
      if (I === 0) {
        return res.status(400).json({ status: 'error', message: 'Current cannot be zero' });
      }
      const calculatedR = V / I;
      result = {
        primaryResult: `${calculatedR.toFixed(2)} Ω`,
        voltage: `${V} V`,
        current: `${I} A`,
        resistance: `${calculatedR.toFixed(2)} Ω`
      };
      workShown = `
Given:
• Voltage (V) = ${V} V
• Current (I) = ${I} A

Using Ohm's Law: V = I × R
Solving for Resistance: R = V ÷ I
• R = ${V} ÷ ${I}
• R = ${calculatedR.toFixed(2)} Ω
      `;
    } else if (V !== null && R !== null) {
      // Calculate I = V / R
      if (R === 0) {
        return res.status(400).json({ status: 'error', message: 'Resistance cannot be zero' });
      }
      const calculatedI = V / R;
      result = {
        primaryResult: `${calculatedI.toFixed(2)} A`,
        voltage: `${V} V`,
        current: `${calculatedI.toFixed(2)} A`,
        resistance: `${R} Ω`
      };
      workShown = `
Given:
• Voltage (V) = ${V} V
• Resistance (R) = ${R} Ω

Using Ohm's Law: V = I × R
Solving for Current: I = V ÷ R
• I = ${V} ÷ ${R}
• I = ${calculatedI.toFixed(2)} A
      `;
    } else if (I !== null && R !== null) {
      // Calculate V = I * R
      const calculatedV = I * R;
      result = {
        primaryResult: `${calculatedV.toFixed(2)} V`,
        voltage: `${calculatedV.toFixed(2)} V`,
        current: `${I} A`,
        resistance: `${R} Ω`
      };
      workShown = `
Given:
• Current (I) = ${I} A
• Resistance (R) = ${R} Ω

Using Ohm's Law: V = I × R
• V = ${I} × ${R}
• V = ${calculatedV.toFixed(2)} V
      `;
    }

    return res.status(200).json({
      status: 'success',
      result: result,
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Ohms law calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// Power Calculation (P = V × I)
app.get('/api/power-vi', (req, res) => {
  try {
    const { voltage, current, resistance } = req.query;
    
    let V = voltage ? parseFloat(voltage) : null;
    let I = current ? parseFloat(current) : null;
    let R = resistance ? parseFloat(resistance) : null;

    // Check for valid numbers
    if ((V !== null && isNaN(V)) || (I !== null && isNaN(I)) || (R !== null && isNaN(R))) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    let power, workShown;

    if (V !== null && I !== null) {
      // P = V × I
      power = V * I;
      workShown = `
Given:
• Voltage (V) = ${V} V
• Current (I) = ${I} A

Calculation:
• Power (P) = V × I
• P = ${V} × ${I}
• P = ${power.toFixed(2)} W
      `;
    } else if (V !== null && R !== null) {
      // P = V² / R
      if (R === 0) {
        return res.status(400).json({ status: 'error', message: 'Resistance cannot be zero' });
      }
      power = (V * V) / R;
      I = V / R; // Calculate current for display
      workShown = `
Given:
• Voltage (V) = ${V} V
• Resistance (R) = ${R} Ω

Calculation:
• Power (P) = V² ÷ R
• P = ${V}² ÷ ${R}
• P = ${V * V} ÷ ${R}
• P = ${power.toFixed(2)} W

Additional: Current (I) = V ÷ R = ${I.toFixed(2)} A
      `;
    } else if (I !== null && R !== null) {
      // P = I² × R
      power = (I * I) * R;
      V = I * R; // Calculate voltage for display
      workShown = `
Given:
• Current (I) = ${I} A
• Resistance (R) = ${R} Ω

Calculation:
• Power (P) = I² × R
• P = ${I}² × ${R}
• P = ${I * I} × ${R}
• P = ${power.toFixed(2)} W

Additional: Voltage (V) = I × R = ${V.toFixed(2)} V
      `;
    } else {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Provide at least voltage and current, or voltage and resistance, or current and resistance' 
      });
    }

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: `${power.toFixed(2)} W`,
        power: `${power.toFixed(2)} W`,
        voltage: V ? `${V.toFixed(2)} V` : 'Not provided',
        current: I ? `${I.toFixed(2)} A` : 'Not provided',
        resistance: R ? `${R.toFixed(2)} Ω` : 'Not provided'
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Power calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

// Series Resistance Calculator
app.get('/api/resistance-series', (req, res) => {
  try {
    const { resistances } = req.query;

    if (!resistances) {
      return res.status(400).json({ status: 'error', message: 'Missing resistances parameter' });
    }

    // Parse comma-separated resistances
    const resistanceArray = resistances.split(',').map(r => parseFloat(r.trim()));
    
    if (resistanceArray.some(isNaN)) {
      return res.status(400).json({ status: 'error', message: 'All resistance values must be valid numbers' });
    }

    if (resistanceArray.some(r => r < 0)) {
      return res.status(400).json({ status: 'error', message: 'Resistance values cannot be negative' });
    }

    if (resistanceArray.length < 2) {
      return res.status(400).json({ status: 'error', message: 'At least 2 resistances required for series calculation' });
    }

    const totalResistance = resistanceArray.reduce((sum, r) => sum + r, 0);
    
    const resistanceList = resistanceArray.map((r, i) => `R${i + 1} = ${r} Ω`).join('\n• ');
    const calculation = resistanceArray.map((r, i) => `R${i + 1}`).join(' + ');
    const values = resistanceArray.join(' + ');

    const workShown = `
Given Resistances in Series:
• ${resistanceList}

Series Resistance Formula:
• Rtotal = ${calculation}
• Rtotal = ${values}
• Rtotal = ${totalResistance.toFixed(2)} Ω

Note: In series circuits, total resistance equals the sum of all individual resistances.
    `;

    return res.status(200).json({
      status: 'success',
      result: {
        primaryResult: `${totalResistance.toFixed(2)} Ω`,
        totalResistance: `${totalResistance.toFixed(2)} Ω`,
        individualResistances: resistanceArray.map(r => `${r} Ω`),
        resistanceCount: resistanceArray.length
      },
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Series resistance calculation error:', err);
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
      // General
      test: '/api/test',
      health: '/api/health',
      
      // Civil Engineering
      slope: '/api/slope?rise=<value>&run=<value>',
      gradePercent: '/api/grade-percent?rise=<value>&run=<value>',
      slopeAngle: '/api/slope-angle?rise=<value>&run=<value>',
      horizontalDistance: '/api/horizontal-distance?rise=<value>&slope=<value>',
      verticalRise: '/api/vertical-rise?slope=<value>&run=<value>',
      
      // General Math
      quadraticEquation: '/api/quadratic-equation?a=<value>&b=<value>&c=<value>',
      trigonometric: '/api/trigonometric?angle=<value>&unit=degrees&function=sin',
      percentError: '/api/percent-error?experimental=<value>&theoretical=<value>',
      
      // Electrical Engineering
      ohmsLaw: '/api/ohms-law?voltage=<value>&current=<value> (provide any 2 of 3)',
      powerVI: '/api/power-vi?voltage=<value>&current=<value> (or with resistance)',
      resistanceSeries: '/api/resistance-series?resistances=10,20,30'
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
    availableEndpoints: [
      '/api/test', '/api/health',
      '/api/slope', '/api/grade-percent', '/api/slope-angle', '/api/horizontal-distance', '/api/vertical-rise',
      '/api/quadratic-equation', '/api/trigonometric', '/api/percent-error',
      '/api/ohms-law', '/api/power-vi', '/api/resistance-series'
    ]
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
