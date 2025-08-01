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
}