# PowerShell Deployment Script for Engineering Calculator API
# This script helps deploy the CORS fixes to Vercel

Write-Host "🚀 Deploying Engineering Calculator API with CORS fixes..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "index.js")) {
    Write-Host "❌ Error: index.js not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if we're logged in to Vercel
try {
    $vercelWhoami = vercel whoami
    Write-Host "✅ Logged in as: $vercelWhoami" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Vercel. Please run 'vercel login' first." -ForegroundColor Red
    exit 1
}

# Show what will be deployed
Write-Host "`n📋 Files to be deployed:" -ForegroundColor Cyan
Get-ChildItem -Name "*.js", "*.json", "*.html", "*.md" | ForEach-Object {
    Write-Host "  - $_" -ForegroundColor White
}

Write-Host "`n🔧 CORS Configuration Summary:" -ForegroundColor Cyan
Write-Host "  - Enhanced Express.js CORS with Vercel preview URL support" -ForegroundColor White
Write-Host "  - Updated vercel.json with CORS headers" -ForegroundColor White
Write-Host "  - Added explicit OPTIONS request handling" -ForegroundColor White
Write-Host "  - Created comprehensive CORS test tool" -ForegroundColor White

# Ask for confirmation
Write-Host "`n❓ Do you want to deploy to production? (y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "`n🚀 Deploying to production..." -ForegroundColor Green
    
    try {
        $deployOutput = vercel --prod
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "`n📊 Test your deployment:" -ForegroundColor Cyan
        Write-Host "  - Health check: https://engineering-calc-api.vercel.app/api/health" -ForegroundColor White
        Write-Host "  - CORS test: https://engineering-calc-api.vercel.app/test-cors.html" -ForegroundColor White
        Write-Host "  - Slope calculator: https://engineering-calc-api.vercel.app/api/slope?rise=10&run=100" -ForegroundColor White
        
        Write-Host "`n🔗 Frontend Integration:" -ForegroundColor Cyan
        Write-Host "  Your frontend should now be able to access the API without CORS errors." -ForegroundColor White
        Write-Host "  Test from: https://engineer-brain-tool.vercel.app" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n📝 Deployment cancelled. You can run 'vercel --prod' manually when ready." -ForegroundColor Yellow
}

Write-Host "`n✅ Script completed!" -ForegroundColor Green 