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
    const { a, b, c } = req.query;

    if (!a || !b || !c) {
      return res.status(400).json({ status: 'error', message: 'Missing a, b, or c parameters' });
    }

    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    if (isNaN(aNum) || isNaN(bNum) || isNaN(cNum)) {
      return res.status(400).json({ status: 'error', message: 'Invalid numeric values' });
    }

    if (aNum === 0) {
      return res.status(400).json({ status: 'error', message: 'Coefficient "a" cannot be zero (not a quadratic equation)' });
    }

    const discriminant = (bNum * bNum) - (4 * aNum * cNum);
    
    let x1, x2, solutions;
    
    if (discriminant > 0) {
      x1 = (-bNum + Math.sqrt(discriminant)) / (2 * aNum);
      x2 = (-bNum - Math.sqrt(discriminant)) / (2 * aNum);
      solutions = `Two real solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
    } else if (discriminant === 0) {
      x1 = -bNum / (2 * aNum);
      solutions = `One real solution: x = ${x1.toFixed(4)}`;
    } else {
      const realPart = (-bNum / (2 * aNum)).toFixed(4);
      const imaginaryPart = (Math.sqrt(-discriminant) / (2 * aNum)).toFixed(4);
      solutions = `Two complex solutions: x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`;
    }

    const workShown = `
Given quadratic equation: ${aNum}x² + ${bNum}x + ${cNum} = 0

Step 1: Calculate discriminant
• Δ = b² - 4ac
• Δ = (${bNum})² - 4(${aNum})(${cNum})
• Δ = ${bNum * bNum} - ${4 * aNum * cNum}
• Δ = ${discriminant}

Step 2: Apply quadratic formula
• x = (-b ± √Δ) / 2a
• x = (${-bNum} ± √${discriminant}) / ${2 * aNum}

Result: ${solutions}
    `;

    const result = {
      primaryResult: solutions,
      discriminant: discriminant,
      hasRealSolutions: discriminant >= 0
    };

    if (discriminant >= 0) {
      if (discriminant > 0) {
        result.x1 = x1.toFixed(4);
        result.x2 = x2.toFixed(4);
      } else {
        result.x = x1.toFixed(4);
      }
    }

    return res.status(200).json({
      status: 'success',
      result: result,
      workShown: workShown.trim()
    });

  } catch (err) {
    console.error('Quadratic equation calculation error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message
    });
  }
}