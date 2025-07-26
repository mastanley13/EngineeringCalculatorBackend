# 🔧 CORS Troubleshooting Guide

## 🚨 Current Issue

Your frontend at `https://engineer-brain-tool-mpds6q7ln-mastanley13s-projects.vercel.app` is getting CORS errors when trying to access the backend at `https://engineering-calc-api.vercel.app`.

**Error Message:**
```
Access to fetch at 'https://engineering-calc-api.vercel.app/api/health' from origin 'https://engineer-brain-tool-mpds6q7ln-mastanley13s-projects.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔍 Root Cause Analysis

The issue is that the backend API is not properly configured to handle CORS requests from your frontend domain. The preflight OPTIONS request is failing because the backend doesn't return the required CORS headers.

## ✅ Solutions (In Order of Priority)

### 1. **Backend CORS Configuration (Recommended)**

The backend needs to be updated to include proper CORS headers. The backend should handle OPTIONS requests and return these headers:

```javascript
// Backend CORS configuration needed
app.use(cors({
  origin: [
    'https://engineer-brain-tool-mpds6q7ln-mastanley13s-projects.vercel.app',
    'https://engineer-brain-tool.vercel.app',
    'http://localhost:5173', // for development
    'http://localhost:3000'  // for development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### 2. **Frontend Configuration Updates (Implemented)**

I've already implemented these changes:

- ✅ Simplified API requests to avoid triggering preflight
- ✅ Added Vite proxy for development
- ✅ Updated API test component with better diagnostics
- ✅ Removed unnecessary headers from GET requests

### 3. **Environment-Specific Solutions**

#### Development Environment
- ✅ Vite proxy is configured to bypass CORS during local development
- ✅ API requests use relative URLs when in development mode

#### Production Environment
- ❌ Backend CORS configuration needs to be updated
- ✅ Frontend is configured to use direct API URLs

## 🧪 Testing Steps

### 1. **Test Direct API Access**
Open your browser and navigate directly to:
```
https://engineering-calc-api.vercel.app/api/health
```

If this works, the API is functional but CORS is the issue.

### 2. **Use the API Test Component**
The updated API test component includes:
- ✅ Individual test buttons for each endpoint
- ✅ Direct fetch test button
- ✅ Environment configuration display
- ✅ CORS troubleshooting information

### 3. **Check Network Tab**
In browser dev tools, look for:
- OPTIONS requests (preflight)
- Missing CORS headers in responses
- 401/403 errors

## 🔧 Immediate Workarounds

### Option 1: Use a CORS Proxy (Temporary)
You can use a public CORS proxy for testing:

```javascript
// Temporary workaround - replace API_BASE_URL with:
const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://engineering-calc-api.vercel.app';
```

### Option 2: Browser Extension (Development Only)
Install a CORS browser extension for development testing.

### Option 3: Local Backend (Development Only)
Run the backend locally and use the Vite proxy.

## 📋 Backend Requirements

The backend needs these specific changes:

1. **Handle OPTIONS requests** for all endpoints
2. **Return CORS headers** in all responses:
   ```
   Access-Control-Allow-Origin: https://engineer-brain-tool-mpds6q7ln-mastanley13s-projects.vercel.app
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Allow-Credentials: true
   ```

3. **Support multiple origins** for different environments

## 🎯 Next Steps

1. **Contact Backend Developer** - Share this troubleshooting guide
2. **Test with Updated Frontend** - Use the new API test component
3. **Monitor Network Requests** - Check for CORS headers in responses
4. **Consider Alternative Solutions** - If backend changes aren't possible

## 📞 Support Information

- **Frontend URL**: `https://engineer-brain-tool-mpds6q7ln-mastanley13s-projects.vercel.app`
- **Backend URL**: `https://engineering-calc-api.vercel.app`
- **Development Proxy**: Configured in `vite.config.ts`
- **API Test Component**: Available in the dashboard

---

**✅ The frontend has been updated with CORS-friendly configurations and better error handling!** 