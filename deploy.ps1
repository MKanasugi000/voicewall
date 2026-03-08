# VoiceWall Auto Build and Deploy Script
# Usage: powershell -ExecutionPolicy Bypass -File deploy.ps1

Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "=== VoiceWall Auto Build and Deploy ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/5] npm install ..." -ForegroundColor Yellow
npm install --silent 2>$null
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[2/5] Building ..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "  Build OK!" -ForegroundColor Green

Write-Host "[3/5] Git commit ..." -ForegroundColor Yellow
git add .
$s = git status --porcelain
if ($s) {
    $t = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "Update: $t"
    Write-Host "  Committed!" -ForegroundColor Green
} else {
    Write-Host "  No changes - skip" -ForegroundColor Gray
}

Write-Host "[4/5] Git push ..." -ForegroundColor Yellow
git push origin main
Write-Host "  Pushed!" -ForegroundColor Green

Write-Host "[5/5] Vercel deploy ..." -ForegroundColor Yellow
vercel --prod --yes
Write-Host "  Deployed!" -ForegroundColor Green

Write-Host ""
Write-Host "=== All Done! ===" -ForegroundColor Green
Write-Host "Site: https://voicewall.vercel.app" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close"
