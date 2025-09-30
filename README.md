
# Digital Bevy Employee Project Management System

Internal project management platform designed specifically for Digital Bevy team members. Streamlines project assignments, task tracking, and team collaboration with role-based access control.

## Features

- **Employee Management**: Admin, Manager, and Employee access levels
- **Project Tracking**: Create and monitor projects with real-time status updates
- **Task Assignment**: Assign tasks with deadlines and priority levels
- **Email Notifications**: Automated alerts for assignments and deadlines
- **Dashboard**: Personal workspace with project overview and statistics
- **Activity History**: Complete log of all project and task activities
- **Weekly Reports**: Automated progress summaries sent via email

## Technology Stack

**Backend**: Node.js, Express.js, MongoDB, JWT Authentication  
**Frontend**: React, Vite, Tailwind CSS  
**Email**: Nodemailer with SMTP support

## Requirements

- Node.js 18+
- MongoDB 6+
- SMTP email account (Gmail recommended)

## Installation

```bash
# 1. Clone repository
git clone https://github.com/mahe-gi/projectManagement.git
cd projectManagement

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Setup environment
cd ../backend
# Create .env file with your configuration
```

## Configuration

Create `.env` file in backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/project_management_system

# Authentication
JWT_SECRET=your_secure_jwt_secret_here

# Email (Gmail recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Email Setup (Gmail)
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the 16-character password in SMTP_PASS

## Running

```bash
# Quick start (recommended)
chmod +x start.sh
./start.sh
```

**OR manually:**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

**Access**: http://localhost:5173

## First Time Setup

1. Start the application
2. Go to http://localhost:5173
3. Register first admin account
4. Login and configure email notifications in Settings

## How to Use

### User Roles

**Admin**
- Manage all employees and projects
- Configure system settings and email notifications
- View system-wide reports and activity

**Manager** 
- Create and manage projects
- Assign tasks to team members
- Monitor team progress

**Employee**
- View assigned tasks and projects
- Update task status and progress
- Receive email notifications for deadlines

### Basic Workflow

1. **Admin** sets up employees and assigns managers
2. **Manager** creates projects and assigns tasks
3. **Employee** receives email notification of new tasks
4. **Employee** updates task progress as work is completed
5. **System** sends automatic deadline reminders and progress reports

## Email Notifications

The system automatically sends:
- Task assignment notifications
- Deadline reminders (1-7 days before due date)
- Weekly progress reports
- Overdue task alerts

## Troubleshooting

**Cannot login**: Check username/password and ensure account is active  
**No email notifications**: Verify SMTP settings in .env file  
**Database connection failed**: Ensure MongoDB is running  
**Port 3000 in use**: Change PORT in .env or stop other services

## License

MIT License