export default function handler(req, res) {
  // Set CORS headers for cross-origin requests
  const origin = req.headers.origin;
  
  if (origin && (origin.includes('engineer-brain-tool') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
}