# Setup Guide - Data Collecting System

## Quick Start Guide

### 1. Prerequisites Check

Pastikan semua tools sudah terinstall:

```powershell
# Check Node.js version (harus >= 22.17.1)
node --version

# Check npm
npm --version

# Check PostgreSQL (harus running)
psql --version

# Check Redis (harus running)
redis-cli ping
# Should return: PONG
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Setup PostgreSQL Database

Buat database baru:

```sql
CREATE DATABASE data_collecting_system;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE data_collecting_system TO your_user;
```

### 4. Configure Environment

Copy dan edit file `.env`:

```powershell
cp .env.example .env
```

**PENTING**: Edit minimal config berikut di `.env`:

```env
# Database - sesuaikan dengan PostgreSQL Anda
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/data_collecting_system?schema=public

# JWT Secrets - GANTI dengan random string yang aman
JWT_SECRET=buatRandomStringDisini123!@#
JWT_REFRESH_SECRET=buatRandomStringLainDisini456!@#

# MQTT Broker - sesuaikan dengan broker Anda
MQTT_BROKER_URL=mqtt://your-broker-host:1883
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password
```

### 5. Setup Database Schema

```powershell
# Generate Prisma Client
npm run prisma:generate

# Run migrations (create tables)
npm run prisma:migrate

# Seed database (create admin user)
npm run prisma:seed
```

**Default Admin Login:**
- Username: `admin`
- Password: `Admin123!@#`

⚠️ **WAJIB** ganti password admin setelah first login!

### 6. Start Development Server

```powershell
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

### 7. Test API

Test health endpoint:

```powershell
curl http://localhost:3000/health
```

Test login:

```powershell
curl -X POST http://localhost:3000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"Admin123!@#\"}'
```

## Production Deployment

### 1. Build untuk Production

```powershell
npm run build
```

### 2. Setup Environment Production

Edit `.env` untuk production:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://prod_user:prod_pass@prod-host:5432/data_collecting_prod
```

### 3. Run Production Server

```powershell
npm start
```

## Troubleshooting

### Error: Cannot connect to PostgreSQL

```powershell
# Check PostgreSQL service
Get-Service postgresql*

# Start PostgreSQL if not running
Start-Service postgresql-x64-14
```

### Error: Cannot connect to Redis

```powershell
# Check Redis service
redis-cli ping

# If not installed, install Redis:
# Download from: https://github.com/microsoftarchive/redis/releases
```

### Error: MQTT connection failed

- Pastikan MQTT broker sudah running
- Check username/password di `.env`
- Check firewall/network access

### Error: Prisma Client not generated

```powershell
npm run prisma:generate
```

### View Database dengan Prisma Studio

```powershell
npm run prisma:studio
```

Browser akan terbuka di `http://localhost:5555`

## Next Steps

1. ✅ Login dengan admin account
2. ✅ Ganti password admin
3. ✅ Buat user baru via `/api/v1/auth/register`
4. ✅ Buat project pertama dengan site_id
5. ✅ Register devices untuk project
6. ✅ Publish test MQTT message
7. ✅ Query data via API

## Useful Commands

```powershell
# Development
npm run dev                 # Start dev server with hot-reload

# Build & Production
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run prisma:seed        # Seed database

# Code Quality
npm run lint               # Lint code
npm run lint:fix           # Fix linting issues
npm run format             # Format code with Prettier
```

## Support & Documentation

- Lihat [README.md](README.md) untuk API documentation
- Lihat [TODO.md](TODO.md) untuk implementation progress
- Check logs di `./logs/` folder

---

**Happy Coding! 🚀**
