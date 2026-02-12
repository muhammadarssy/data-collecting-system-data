# Data Collecting System - MQTT & REST API

Sistem untuk mengumpulkan data dari MQTT broker (IoT devices) dan menyediakan REST API untuk akses, query, dan notifikasi real-time.

## 🚀 Features

- ✅ **Authentication & Authorization** - JWT-based dengan role admin/user
- ✅ **Project Management** - Kelola project dengan site_id unik
- ✅ **Device Management** - Register dan monitor devices (Gateway, Chint, Inverter)
- ✅ **MQTT Data Collection** - Continuous subscription untuk history data
- ✅ **Historical Data API** - Query data dengan filters dan pagination
- ✅ **User Invitation** - Username-based invitation ke project
- ✅ **Redis Queue** - Buffering MQTT messages untuk reliability
- 🚧 **SSE Notifications** - Real-time updates (coming soon)
- 🚧 **Notification Rules** - Custom alerts per device (coming soon)

## 📋 Prerequisites

- **Node.js** >= 22.17.1
- **PostgreSQL** >= 14
- **Redis** >= 6
- **MQTT Broker** (e.g., Mosquitto, EMQX)
- **npm** package manager

## 🛠️ Installation

### 1. Clone & Install Dependencies

```bash
# Navigate to project directory
cd data-collecting-system-data

# Install dependencies
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Application
NODE_ENV=development
PORT=3000

# Database (change to your PostgreSQL credentials)
DATABASE_URL=postgresql://username:password@localhost:5432/data_collecting?schema=public

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# MQTT Broker (configure your broker)
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=your_mqtt_user
MQTT_PASSWORD=your_mqtt_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (creates admin user)
npm run prisma:seed
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `Admin123!@#` (change this after first login!)

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── config/              # Configuration (DB, Redis, Logger, MQTT)
├── modules/
│   ├── auth/           # Authentication (login, register, JWT)
│   ├── users/          # User management
│   ├── projects/       # Project management (with site_id)
│   ├── devices/        # Device management
│   ├── mqtt/           # MQTT collectors (history & realtime)
│   ├── data/           # Historical data API
│   ├── notifications/  # Notification system
│   └── queue/          # Redis queue workers
├── shared/
│   ├── middleware/     # Express middlewares
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── constants/      # App constants
├── app.ts              # Express app setup
└── server.ts           # Server entry point

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Database seeder
```

## 🔌 API Endpoints

### Authentication

```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login
POST   /api/v1/auth/refresh      - Refresh token
GET    /api/v1/auth/profile      - Get current user [Auth]
```

### Users

```
GET    /api/v1/users/profile     - Get profile [Auth]
PUT    /api/v1/users/profile     - Update profile [Auth]
GET    /api/v1/users             - List users [Auth]
POST   /api/v1/users/invite      - Invite user to project [Auth]
DELETE /api/v1/users/:projectId/:userId - Remove user from project [Auth]
```

### Projects

```
POST   /api/v1/projects          - Create project [Auth]
GET    /api/v1/projects          - List user's projects [Auth]
GET    /api/v1/projects/:id      - Get project details [Auth]
PUT    /api/v1/projects/:id      - Update project [Auth]
DELETE /api/v1/projects/:id      - Delete project [Auth]
GET    /api/v1/projects/:id/users - Get project users [Auth]
```

### Devices

```
POST   /api/v1/devices           - Create device [Auth]
GET    /api/v1/devices           - List devices by project [Auth]
GET    /api/v1/devices/:id       - Get device details [Auth]
PUT    /api/v1/devices/:id       - Update device [Auth]
DELETE /api/v1/devices/:id       - Delete device [Auth]
```

## 📊 MQTT Topic Structure

```
data/<site_id>/<type_data>/<device_id>/<devices>/<sn_gateway>
```

**Example:**
```
data/mhsj3jqn0lok167x4buu/history/mhsikjck/system/7011957300020111049
```

**Supported Devices:**
- **Gateway (ehub/system)** - System monitoring
- **Chint** - Power meter data
- **Inverter** - Solar inverter (battery, inverter, load, mppt, pv data)

## 🔧 Development

```bash
# Run in development mode with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## 📝 Database Schema

### Main Tables:
- `users` - User accounts with roles
- `projects` - Projects with unique site_id
- `project_users` - User-project assignments
- `devices` - Registered devices
- `gateway_history_data` - Gateway historical data
- `chint_history_data` - Chint meter historical data
- `inverter_*_history` - Inverter data (battery, inverter, load, mppt, pv)
- `notification_rules` - Notification rules per device
- `notifications` - Notification history

## 🚦 Workflow

1. **User Registration/Login** → Get JWT token
2. **Create Project** → Specify site_id and add devices
3. **MQTT Collector** → Automatically subscribes to history topics
4. **Data Processing** → MQTT → Redis Queue → PostgreSQL
5. **API Query** → Retrieve historical data with filters
6. **Real-time** → SSE for live updates (coming soon)

## 🔐 Authentication

All protected endpoints require Bearer token:

```bash
Authorization: Bearer <your_jwt_token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:3000/api/v1/projects
```

## ⚙️ Configuration

### MQTT Settings
- History data: Continuous subscription to `data/+/history/#`
- Realtime data: Dynamic subscription per API request (coming soon)

### Queue Settings
- Concurrency: 5 workers (configurable)
- Max retries: 3 attempts
- Exponential backoff on failures

### Database
- PostgreSQL with Prisma ORM
- Automatic migrations
- Indexed for performance

## 🧪 Testing

Make sure PostgreSQL, Redis, and MQTT broker are running:

```bash
# Test database connection
npm run prisma:studio

# Test health endpoint
curl http://localhost:3000/health

# Test with sample MQTT publish
mosquitto_pub -t "data/testsite/history/device1/chint/gateway123" \
  -m '{"_terminalTime":"2026-02-05 10:00:00","_groupName":"HistoryChint1","pt":1000}'
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [MQTT.js Documentation](https://github.com/mqttjs/MQTT.js)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)

## ⚠️ Important Notes

1. **Change default passwords** in production
2. **Configure MQTT broker** credentials
3. **Setup PostgreSQL** with proper user permissions
4. **Redis** must be running before starting the app
5. **Use environment variables** for sensitive data

## 📞 Support

For issues or questions, refer to the TODO.md file for implementation progress.

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-05
