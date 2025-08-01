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

    let result, workShown;

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
}