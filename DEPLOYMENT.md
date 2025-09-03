# School Management API - Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- Git

### Installation Steps

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd school-management-api
npm install
```

2. **Database Setup:**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE school_management;

# Exit MySQL
exit
```

3. **Environment Configuration:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

4. **Start the application:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

5. **Verify installation:**
Open browser and visit: http://localhost:3000

## Production Deployment

### Option 1: VPS/Cloud Server

1. **Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

2. **Application Deployment:**
```bash
# Clone repository
git clone <repository-url>
cd school-management-api

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
# Edit .env with production values

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name school-api
pm2 startup
pm2 save
```

3. **Nginx Reverse Proxy (Optional):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Heroku Deployment

1. **Prepare for Heroku:**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: node server.js" > Procfile

# Initialize git
git init
git add .
git commit -m "Initial commit"
```

2. **Deploy to Heroku:**
```bash
# Create Heroku app
heroku create your-app-name

# Add MySQL addon
heroku addons:create cleardb:ignite

# Get database URL
heroku config:get CLEARDB_DATABASE_URL

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=your_cleardb_host
heroku config:set DB_USER=your_cleardb_user
heroku config:set DB_PASSWORD=your_cleardb_password
heroku config:set DB_NAME=your_cleardb_database

# Deploy
git push heroku main
```

### Option 3: Railway Deployment

1. **Setup Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add MySQL service
railway add mysql

# Deploy
railway up
```

## Environment Variables for Production

```bash
# Database
DB_HOST=your_production_host
DB_USER=your_production_user
DB_PASSWORD=your_production_password
DB_NAME=school_management
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=production
```

## Testing the Deployment

1. **Health Check:**
```bash
curl http://your-domain.com/
```

2. **Add a test school:**
```bash
curl -X POST http://your-domain.com/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "address": "123 Test Street",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

3. **List schools:**
```bash
curl "http://your-domain.com/listSchools?latitude=28.6139&longitude=77.2090"
```

## Monitoring and Maintenance

### PM2 Commands (VPS/Cloud)
```bash
# View status
pm2 status

# View logs
pm2 logs school-api

# Restart app
pm2 restart school-api

# Stop app
pm2 stop school-api

# Monitor
pm2 monit
```

### Database Backup
```bash
# Create backup
mysqldump -u username -p school_management > backup.sql

# Restore backup
mysql -u username -p school_management < backup.sql
```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong database passwords
   - Restrict database access

2. **Server Security:**
   - Keep Node.js updated
   - Use HTTPS in production
   - Implement rate limiting
   - Use firewall rules

3. **Database Security:**
   - Regular backups
   - Restrict MySQL access
   - Use SSL connections

## Performance Optimization

1. **Database Indexes:**
   - Already included in schema.sql
   - Monitor query performance

2. **Caching:**
   - Consider Redis for frequent queries
   - Implement API response caching

3. **Load Balancing:**
   - Use multiple server instances
   - Implement session management

## Troubleshooting

### Common Issues:

1. **Database Connection Failed:**
   - Check credentials in .env
   - Verify MySQL is running
   - Check firewall settings

2. **Port Already in Use:**
   - Change PORT in .env
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **Permission Errors:**
   - Check file permissions
   - Run with appropriate user privileges

4. **Memory Issues:**
   - Monitor with `pm2 monit`
   - Increase server memory
   - Optimize queries

## API Documentation

The API provides comprehensive endpoints:

- `GET /` - Health check
- `POST /addSchool` - Add new school
- `GET /listSchools` - Get schools by proximity
- `GET /schools` - Get all schools
- `GET /schools/:id` - Get school by ID

For detailed API documentation, see the Postman collection included in the project.
