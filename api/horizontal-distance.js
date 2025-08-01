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
}