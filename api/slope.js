export default function handler(req, res) {
  // Always send CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Respond to CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    console.error('Function crashed:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
}