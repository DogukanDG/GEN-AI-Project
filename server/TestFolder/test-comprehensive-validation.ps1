$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzQxMDk0OTR9.KRZ5PIo4tPKDJKuU_qbJ6vvxVr1xIbAJnJCvuCMvdLg"
    "Content-Type" = "application/json"
}

# Test emergency/fictional request
$emergencyBody = @{
    "prompt" = "Aliens attacked the school and took one of the rooms hostage. I urgently need an air-conditioned room for 10 people."
} | ConvertTo-Json

Write-Host "Testing emergency/fictional request..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $emergencyBody -ContentType "application/json"
    Write-Host "❌ FAILED: Emergency request was accepted when it should be rejected" -ForegroundColor Red
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✅ SUCCESS: Emergency request correctly rejected" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

Write-Host "`n" -NoNewline

# Test another problematic case
$catBody = @{
    "prompt" = "I love cats and dogs. I want a cage for 45 cats."
} | ConvertTo-Json

Write-Host "Testing cat cage request..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $catBody -ContentType "application/json"
    Write-Host "❌ FAILED: Cat cage request was accepted when it should be rejected" -ForegroundColor Red
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✅ SUCCESS: Cat cage request correctly rejected" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

Write-Host "`n" -NoNewline

# Test valid request
$validBody = @{
    "prompt" = "Tomorrow we will have a meeting for 10 people, and I want to reserve a room with air conditioning."
} | ConvertTo-Json

Write-Host "Testing valid meeting request..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $validBody -ContentType "application/json"
    Write-Host "✅ SUCCESS: Valid meeting request accepted" -ForegroundColor Green
    Write-Host "Found $($response.data.rooms.Count) rooms" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: Valid meeting request was rejected" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
}
