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
}