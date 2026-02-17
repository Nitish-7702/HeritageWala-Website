#!/usr/bin/env pwsh
# Quick Production Build & Start Script

Write-Host "🚀 Heritage Wala - Fast Production Start" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Building optimized production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Starting production server..." -ForegroundColor Yellow
    Write-Host "   Open: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    npm run start
} else {
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    exit 1
}
