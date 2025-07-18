$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzQxMDk0OTR9.KRZ5PIo4tPKDJKuU_qbJ6vvxVr1xIbAJnJCvuCMvdLg"
    "Content-Type" = "application/json"
}

# Test invalid request
$invalidBody = @{
    "prompt" = "I love cats and dogs, I want a cage for 45 cats"
} | ConvertTo-Json

Write-Host "Testing invalid request..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $invalidBody -ContentType "application/json"
    Write-Host "❌ FAILED: Request was accepted when it should be rejected" -ForegroundColor Red
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✅ SUCCESS: Request correctly rejected" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

Write-Host "`n" -NoNewline

# Test valid request
$validBody = @{
    "prompt" = "I want a meeting room for 5 people, with a projector"
} | ConvertTo-Json

Write-Host "Testing valid request..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $validBody -ContentType "application/json"
    Write-Host "✅ SUCCESS: Valid request accepted" -ForegroundColor Green
    Write-Host "Found $($response.data.rooms.Count) rooms" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: Valid request was rejected" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
}
