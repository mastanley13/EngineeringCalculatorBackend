# CORS Fix Deployment Script
# This script helps redeploy the backend with CORS fixes

Write-Host "🔧 Engineering Calculator API - CORS Fix Deployment" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "index.js")) {
    Write-Host "❌ index.js not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Cyan

# Show what files were modified
Write-Host "`n📝 Files modified for CORS fix:" -ForegroundColor Yellow
Write-Host "  • index.js - Enhanced CORS configuration" -ForegroundColor White
Write-Host "  • api/slope.js - Updated CORS headers" -ForegroundColor White
Write-Host "  • vercel.json - Added explicit route for /api/slope" -ForegroundColor White
Write-Host "  • Test/cors-test.html - Created CORS test page" -ForegroundColor White

# Ask for confirmation
Write-Host "`n🚀 Ready to deploy CORS fixes?" -ForegroundColor Yellow
$confirm = Read-Host "Type 'yes' to continue or 'no' to cancel"

if ($confirm -ne "yes") {
    Write-Host "❌ Deployment cancelled." -ForegroundColor Red
    exit 0
}

# Deploy to Vercel
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Green
try {
    vercel --prod
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test the deployment
Write-Host "`n🧪 Testing deployment..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "https://engineering-calc-api.vercel.app/api/health" -Method Get
    Write-Host "✅ Health check passed: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Health check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   This might be normal if the deployment is still processing." -ForegroundColor Yellow
}

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait 1-2 minutes for deployment to fully propagate" -ForegroundColor White
Write-Host "2. Test your frontend at: https://engineer-brain-tool.vercel.app" -ForegroundColor White
Write-Host "3. Use the test page: https://engineering-calc-api.vercel.app/Test/cors-test.html" -ForegroundColor White
Write-Host "4. Check browser console for any remaining CORS errors" -ForegroundColor White

Write-Host "`n🎉 CORS fix deployment completed!" -ForegroundColor Green 