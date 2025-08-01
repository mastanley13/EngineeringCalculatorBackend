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
}