# 🚀 Frontend Handoff: Engineering Calculator API Backend

## 📋 Overview
This document provides the frontend agent with all necessary information to connect to the Engineering Calculator API backend. The backend has been configured with proper CORS settings and is ready for frontend integration.

---

## 🔧 Backend Configuration Summary

### **Entry Point**: `index.js`
- **Framework**: Express.js with CORS middleware
- **Port**: 3001 (local development)
- **Production URL**: `https://engineering-calc-api.vercel.app`

### **CORS Configuration**
The backend is configured to accept requests from:
- ✅ `https://engineering-calc-api.vercel.app`
- ✅ `https://engineering-calc-api.vercel.app/`
- ✅ `https://engineering-calc-frontend.vercel.app` (if separate frontend)
- ✅ Local development URLs (localhost:5173, 3000, 4173)

---

## 🌐 Available API Endpoints

### 1. **Health Check**
```javascript
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-25T23:16:17.495Z",
  "message": "Engineering Calculator API is running"
}
```

### 2. **CORS Test**
```javascript
GET /api/test
```
**Response:**
```json
{
  "message": "CORS works! Backend is running successfully."
}
```

### 3. **Slope Calculator** ⭐ **MAIN ENDPOINT**
```javascript
GET /api/slope?rise=<value>&run=<value>
```
**Parameters:**
- `rise` (number): Rise in feet
- `run` (number): Run in feet

**Example Request:**
```javascript
fetch('https://engineering-calc-api.vercel.app/api/slope?rise=10&run=100')
```

**Success Response:**
```json
{
  "status": "success",
  "result": {
    "slope": "10.00",
    "angle": "5.71"
  },
  "workShown": "Given:\n• Rise = 10 ft\n• Run = 100 ft\n\nCalculations:\n• Slope (%) = (Rise ÷ Run) × 100 = 10.00%\n• Angle = arctan(Rise ÷ Run) = 5.71°"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Missing rise or run"
}
```

### 4. **API Information**
```javascript
GET /
```
**Response:**
```json
{
  "message": "Engineering Calculator API",
  "version": "1.0.0",
  "endpoints": {
    "test": "/api/test",
    "slope": "/api/slope?rise=<value>&run=<value>",
    "health": "/api/health"
  }
}
```

---

## 🔗 Frontend Integration Guide

### **Environment Setup**
Create environment variables in your frontend:

```javascript
// .env.local or environment config
VITE_API_BASE_URL=https://engineering-calc-api.vercel.app
// or for local development:
// VITE_API_BASE_URL=http://localhost:3001
```

### **API Service Functions**

#### **1. Basic Fetch Function**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://engineering-calc-api.vercel.app';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

#### **2. Slope Calculation Function**
```javascript
async function calculateSlope(rise, run) {
  try {
    const response = await apiRequest(`/api/slope?rise=${rise}&run=${run}`);
    
    if (response.status === 'success') {
      return {
        success: true,
        data: response.result,
        workShown: response.workShown
      };
    } else {
      return {
        success: false,
        error: response.message
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

#### **3. Health Check Function**
```javascript
async function checkApiHealth() {
  try {
    const response = await apiRequest('/api/health');
    return {
      success: true,
      data: response
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

### **React Component Example**
```jsx
import { useState, useEffect } from 'react';

function SlopeCalculator() {
  const [rise, setRise] = useState('');
  const [run, setRun] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    if (!rise || !run) {
      setError('Please enter both rise and run values');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await calculateSlope(rise, run);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to calculate slope. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Slope Calculator</h2>
      
      <div>
        <label>Rise (ft):</label>
        <input
          type="number"
          value={rise}
          onChange={(e) => setRise(e.target.value)}
          placeholder="Enter rise"
        />
      </div>
      
      <div>
        <label>Run (ft):</label>
        <input
          type="number"
          value={run}
          onChange={(e) => setRun(e.target.value)}
          placeholder="Enter run"
        />
      </div>
      
      <button onClick={handleCalculate} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate Slope'}
      </button>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      {result && (
        <div>
          <h3>Results:</h3>
          <p>Slope: {result.slope}%</p>
          <p>Angle: {result.angle}°</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Your Integration

### **1. Test API Connectivity**
```javascript
// Test if the API is reachable
const testConnection = async () => {
  try {
    const response = await fetch('https://engineering-calc-api.vercel.app/api/test');
    const data = await response.json();
    console.log('✅ API Connection:', data.message);
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
  }
};
```

### **2. Test Slope Calculation**
```javascript
// Test the main functionality
const testSlopeCalculation = async () => {
  try {
    const response = await fetch('https://engineering-calc-api.vercel.app/api/slope?rise=10&run=100');
    const data = await response.json();
    console.log('✅ Slope Calculation:', data);
  } catch (error) {
    console.error('❌ Slope Calculation Failed:', error);
  }
};
```

---

## ⚠️ Important Notes for Frontend Agent

### **CORS Headers**
- The backend automatically handles CORS preflight requests
- All necessary headers are set automatically
- No additional CORS configuration needed on frontend

### **Error Handling**
- Always check for `response.status === 'success'` in API responses
- Handle network errors gracefully
- Provide user-friendly error messages

### **Environment Configuration**
- Use environment variables for API URLs
- Support both development and production environments
- Test with both local and production URLs

### **Data Validation**
- Validate input on frontend before sending to API
- Handle API validation errors (missing parameters, invalid values)
- Provide clear feedback for user input errors

---

## 🚀 Deployment Checklist

### **Frontend Agent Tasks:**
1. ✅ Set up environment variables for API URLs
2. ✅ Implement API service functions
3. ✅ Create slope calculator component
4. ✅ Add error handling and loading states
5. ✅ Test with both local and production APIs
6. ✅ Deploy frontend to Vercel (or preferred platform)
7. ✅ Verify CORS works in production

### **Testing Checklist:**
- [ ] API health check works
- [ ] Slope calculation works with valid inputs
- [ ] Error handling works with invalid inputs
- [ ] Loading states display correctly
- [ ] CORS works in production environment

---

## 📞 Support Information

### **Backend Endpoints Summary:**
- **Production**: `https://engineering-calc-api.vercel.app`
- **Local Development**: `http://localhost:3001`
- **Main Endpoint**: `/api/slope?rise=<value>&run=<value>`

### **Expected Response Format:**
```json
{
  "status": "success|error",
  "result": {
    "slope": "10.00",
    "angle": "5.71"
  },
  "workShown": "Calculation details...",
  "message": "Error message (if status is error)"
}
```

---

**🎯 The backend is ready and waiting for your frontend integration! Good luck! 🚀** 