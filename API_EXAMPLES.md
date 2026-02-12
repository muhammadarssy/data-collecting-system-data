# API Testing Examples

Contoh-contoh request untuk testing API dengan cURL atau Postman.

## Base URL

```
http://localhost:3000/api/v1
```

## 1. Authentication

### Register New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "TestPass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "testuser@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
}
```

**Simpan accessToken untuk request berikutnya!**

### Get Profile

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 2. Projects

### Create Project

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Solar Plant A",
    "siteId": "site001",
    "description": "Main solar plant facility"
  }'
```

### List Projects

```bash
curl -X GET http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Project Details

```bash
curl -X GET http://localhost:3000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Project

```bash
curl -X PUT http://localhost:3000/api/v1/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Solar Plant A - Updated",
    "description": "Updated description"
  }'
```

## 3. Devices

### Create Device

```bash
curl -X POST http://localhost:3000/api/v1/devices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device001",
    "deviceType": "CHINT",
    "name": "Power Meter 1",
    "description": "Main power meter",
    "projectId": "PROJECT_ID",
    "snGateway": "7011957300020111017"
  }'
```

**Device Types:** `EHUB`, `CHINT`, `INVERTER`

### List Devices by Project

```bash
curl -X GET "http://localhost:3000/api/v1/devices?projectId=PROJECT_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Device Details

```bash
curl -X GET http://localhost:3000/api/v1/devices/DEVICE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 4. Historical Data Queries

### Query Gateway (EHUB) History

```bash
curl -X GET "http://localhost:3000/api/v1/data/gateway?projectId=PROJECT_ID&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Query Parameters:**
- `projectId` - Filter by project
- `deviceId` - Filter by device
- `startDate` - ISO date (e.g., 2026-01-01T00:00:00Z)
- `endDate` - ISO date
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 1000)

### Query Chint Power Meter History

```bash
curl -X GET "http://localhost:3000/api/v1/data/chint?deviceId=DEVICE_ID&startDate=2026-02-01T00:00:00Z&endDate=2026-02-05T23:59:59Z" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Query Inverter Battery History

```bash
curl -X GET "http://localhost:3000/api/v1/data/inverter/battery?projectId=PROJECT_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Latest Device Data

```bash
curl -X GET http://localhost:3000/api/v1/data/device/DEVICE_ID/latest \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response contoh untuk Inverter:**
```json
{
  "success": true,
  "data": {
    "device": {
      "id": "...",
      "deviceId": "device001",
      "name": "Inverter 1",
      "deviceType": "INVERTER"
    },
    "latestData": {
      "battery": { ... },
      "inverter": { ... },
      "load": { ... },
      "mppt": { ... },
      "pv": { ... }
    }
  }
}
```

## 5. User Management

### List Users (for invitation)

```bash
curl -X GET "http://localhost:3000/api/v1/users?search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Invite User to Project

```bash
curl -X POST http://localhost:3000/api/v1/users/invite \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "projectId": "PROJECT_ID"
  }'
```

### Remove User from Project

```bash
curl -X DELETE http://localhost:3000/api/v1/users/PROJECT_ID/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "password": "NewPass123"
  }'
```

## 6. Testing with MQTT

### Publish Test History Data

**Gateway/EHUB Data:**
```bash
mosquitto_pub -t "data/site001/history/device001/system/7011957300020111017" \
  -m '{
    "_terminalTime": "2026-02-05 10:00:00.000",
    "_groupName": "HistoryEhub",
    "RunTime": "100:00:00",
    "RunSecond": "360000",
    "CloudOnline": "1",
    "UFreeSpace": "15000",
    "SysFreeSpace": "700"
  }'
```

**Chint Power Meter Data:**
```bash
mosquitto_pub -t "data/site001/history/device001/chint/7011957300020111017" \
  -m '{
    "_terminalTime": "2026-02-05 10:00:00.000",
    "_groupName": "HistoryChint1",
    "CHINT_1_pt": 4500.00,
    "CHINT_1_ua": 220.00,
    "CHINT_1_ia": 20.00,
    "CHINT_1_freq": 5000.00
  }'
```

**Inverter Battery Data:**
```bash
mosquitto_pub -t "data/site001/history/device001/battery1/7011957300020111017" \
  -m '{
    "_terminalTime": "2026-02-05 10:00:00.000",
    "_groupName": "HistoryBattery1",
    "INV_1_battStatus": 1,
    "INV_1_battVolt": 480,
    "INV_1_battCurr": 50,
    "INV_1_battPower": 2400
  }'
```

### Check if Data Saved

Setelah publish MQTT, tunggu beberapa detik lalu query via API:

```bash
curl -X GET "http://localhost:3000/api/v1/data/gateway?deviceId=DEVICE_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 7. PowerShell Examples (Windows)

### Login
```powershell
$body = @{
    username = "testuser"
    password = "TestPass123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$token = $response.data.accessToken
Write-Host "Token: $token"
```

### Query Data
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/projects" `
    -Method Get `
    -Headers $headers
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

## Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

**Tip:** Save your access token ke environment variable untuk kemudahan testing:

```bash
export TOKEN="your_access_token_here"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/projects
```

Atau di PowerShell:
```powershell
$env:TOKEN = "your_access_token_here"
curl -H "Authorization: Bearer $env:TOKEN" http://localhost:3000/api/v1/projects
```
