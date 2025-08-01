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
}