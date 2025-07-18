$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzQxMDk0OTR9.KRZ5PIo4tPKDJKuU_qbJ6vvxVr1xIbAJnJCvuCMvdLg"
    "Content-Type" = "application/json"
}

Write-Host "🧪 Testing Context-Based Validation API..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Test 1: Original alien attack
$alienBody = @{
    "prompt" = "Aliens attacked the school and took one of the rooms hostage. I urgently need an air-conditioned room for 10 people."
} | ConvertTo-Json

Write-Host "🚫 Test 1: Alien Attack" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $alienBody
    Write-Host "❌ FAILED: Alien attack accepted" -ForegroundColor Red
} catch {
    Write-Host "✅ SUCCESS: Alien attack rejected" -ForegroundColor Green
}

# Test 2: New fictional scenario - Dragons
$dragonBody = @{
    "prompt" = "Dragons have taken over the city! I want a room for 15 people for a meeting of wizards."
} | ConvertTo-Json

Write-Host "`n🐉 Test 2: Dragon Attack" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $dragonBody
    Write-Host "❌ FAILED: Dragon scenario accepted" -ForegroundColor Red
} catch {
    Write-Host "✅ SUCCESS: Dragon scenario rejected" -ForegroundColor Green
}

# Test 3: Time travel
$timeBody = @{
    "prompt" = "We will be meeting with robots from the future, I need a room for 20 people in the year 2080."
} | ConvertTo-Json

Write-Host "`n🤖 Test 3: Time Travel/Robots" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $timeBody
    Write-Host "❌ FAILED: Time travel accepted" -ForegroundColor Red
} catch {
    Write-Host "✅ SUCCESS: Time travel rejected" -ForegroundColor Green
}

# Test 4: Zombie apocalypse
$zombieBody = @{
    "prompt" = "A zombie outbreak has started, please find a quiet room to hide in."
} | ConvertTo-Json

Write-Host "`n🧟 Test 4: Zombie Apocalypse" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $zombieBody
    Write-Host "❌ FAILED: Zombie scenario accepted" -ForegroundColor Red
} catch {
    Write-Host "✅ SUCCESS: Zombie scenario rejected" -ForegroundColor Green
}

# Test 5: Legitimate meeting
$meetingBody = @{
    "prompt" = "We have a client meeting tomorrow, I want to reserve a room for 8 people with a projector."
} | ConvertTo-Json

Write-Host "`n✅ Test 5: Legitimate Meeting" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $meetingBody
    Write-Host "✅ SUCCESS: Meeting accepted - Found $($response.data.rooms.Count) rooms" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: Legitimate meeting rejected" -ForegroundColor Red
}

# Test 6: Study session
$studyBody = @{
    "prompt" = "We are preparing for the final exam, we need a quiet study room for 5 students."
} | ConvertTo-Json

Write-Host "`n📚 Test 6: Study Session" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/reservations/search-ai" -Method POST -Headers $headers -Body $studyBody
    Write-Host "✅ SUCCESS: Study session accepted - Found $($response.data.rooms.Count) rooms" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: Study session rejected" -ForegroundColor Red
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray
Write-Host "🎯 Context-Based Validation Test Complete!" -ForegroundColor Cyan
