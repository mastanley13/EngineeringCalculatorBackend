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
}