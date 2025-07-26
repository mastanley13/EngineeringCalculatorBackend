# 🔧 CORS Fixes Applied - Engineering Calculator API

## ✅ Changes Made

### 1. **Enhanced Express.js CORS Configuration** (`index.js`)

**Before:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Limited origin checking
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

**After:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:3000', 
      'http://localhost:4173',
      'https://engineering-calc-api.vercel.app',
      'https://engineering-calc-api.vercel.app/',
      'https://engineer-brain-tool.vercel.app',
      'https://engineer-brain-tool.vercel.app/'
    ];
    
    // Allow any Vercel preview URLs for engineer-brain-tool
    if (origin.includes('engineer-brain-tool') && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow any localhost development URLs
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Add explicit OPTIONS handling for all routes
app.options('*', cors(corsOptions));
```

### 2. **Updated Vercel Configuration** (`vercel.json`)

**Before:**
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

**After:**
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
        "Access-Control-Allow-Credentials": "true"
      }
    }
  ]
}
```

### 3. **Created CORS Test Tool** (`test-cors.html`)

A comprehensive test page that can:
- Test all API endpoints
- Test CORS preflight requests
- Test local vs production endpoints
- Show detailed error information
- Test with credentials

## 🧪 Testing Instructions

### 1. **Test the Backend Locally**
```bash
# Start the backend
npm start

# Open test-cors.html in your browser
# Or visit: http://localhost:3001/test-cors.html
```

### 2. **Test Production Backend**
```bash
# Deploy to Vercel
vercel --prod

# Open test-cors.html from your frontend domain
# Or visit: https://engineering-calc-api.vercel.app/test-cors.html
```

### 3. **Test from Frontend**
Use the test page to verify CORS works from your frontend domain:
- `https://engineer-brain-tool.vercel.app`
- `https://engineer-brain-tool-mpds6q7ln-mastanley13s-projects.vercel.app`
- Any localhost development URLs

## 🔍 What These Fixes Address

### **CORS Preflight Issues**
- ✅ Explicit OPTIONS request handling
- ✅ Proper CORS headers in Vercel configuration
- ✅ Support for all HTTP methods including HEAD

### **Origin Restrictions**
- ✅ Allow all Vercel preview URLs for engineer-brain-tool
- ✅ Allow all localhost development URLs
- ✅ Support for credentials (cookies, auth headers)

### **Header Support**
- ✅ Extended allowed headers list
- ✅ Support for custom headers
- ✅ Proper content-type handling

### **Error Handling**
- ✅ Better error logging for blocked origins
- ✅ Graceful handling of missing origins
- ✅ Proper status codes for preflight requests

## 🚀 Deployment Steps

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix CORS configuration for frontend integration"
   git push
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Test the deployment:**
   - Visit: `https://engineering-calc-api.vercel.app/api/health`
   - Use the test page: `https://engineering-calc-api.vercel.app/test-cors.html`
   - Test from your frontend application

## 📋 Expected Results

After deployment, your frontend should be able to:
- ✅ Make GET requests to all API endpoints
- ✅ Handle CORS preflight requests successfully
- ✅ Work with credentials if needed
- ✅ Support all Vercel preview URLs

## 🔧 Troubleshooting

If CORS issues persist:

1. **Check the test page** for specific error messages
2. **Verify deployment** - ensure changes are live on Vercel
3. **Check browser console** for detailed CORS error messages
4. **Test with curl** to bypass browser CORS:
   ```bash
   curl -H "Origin: https://engineer-brain-tool.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://engineering-calc-api.vercel.app/api/health
   ```

## 📞 Support

If you continue to experience CORS issues:
1. Check the browser's Network tab for the exact error
2. Verify the frontend URL is in the allowed origins list
3. Ensure the backend is properly deployed with the new configuration
4. Use the test page to isolate the specific issue

---

**✅ All CORS configurations have been updated and should resolve the frontend integration issues!** 