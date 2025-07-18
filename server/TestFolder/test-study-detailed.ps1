$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzQxMDk0OTR9.KRZ5PIo4tPKDJKuU_qbJ6vvxVr1xIbAJnJCvuCMvdLg"
    "Content-Type" = "application/json"
}

$studyBody = @{
    "prompt" = "We are preparing for the final exam. We need a quiet study room for 5 students."
} | ConvertTo-Json

Write-Host "Testing study session request..." -ForegroundColor Yellow
Write-Host "Request: We are preparing for the final exam. We need a quiet study room for 5 students." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $studyBody -ContentType "application/json"
    
    Write-Host "✅ SUCCESS: Study session accepted!" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor Green
    Write-Host "Rooms found: $($response.data.rooms.Count)" -ForegroundColor Green
    
    if ($response.data.requirements) {
        Write-Host "Requirements parsed:" -ForegroundColor Cyan
        $response.data.requirements | Format-List
    }
    
} catch {
    Write-Host "❌ FAILED: Study session rejected" -ForegroundColor Red
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Yellow
    
    # Try to get more details from response
    if ($_.ErrorDetails.Message) {
        try {
            $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "Server Error: $($errorJson.message)" -ForegroundColor Red
        } catch {
            Write-Host "Raw Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
}
