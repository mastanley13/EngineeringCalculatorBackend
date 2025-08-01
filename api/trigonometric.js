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
}