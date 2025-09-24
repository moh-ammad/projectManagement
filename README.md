# Digital Bevy Employee Portal 🏢

A comprehensive role-based project management system designed specifically for **Digital Bevy Pvt Ltd** employees. This internal portal enables efficient project tracking, task management, and team collaboration with a hierarchical access control system.

## 🌟 Overview

The Digital Bevy Employee Portal follows a real-world organizational hierarchy:
- **Admin** (CEO/Project Owner) creates projects and assigns them to Managers
- **Manager** (Team Lead) breaks projects into tasks and assigns them to team members
- **User** (Employee) works on assigned tasks and updates progress

## ✨ Key Features

### 🔐 Role-Based Access Control
- **Admin**: Full system control, project creation, user management
- **Manager**: Project breakdown, task assignment, team monitoring
- **User**: Task execution, progress tracking, personal dashboard

### 📊 Project & Task Management
- Hierarchical project-to-task breakdown
- Real-time status updates
- Priority and deadline management
- Time tracking with estimated vs actual hours

### 📈 Analytics & Reporting
- Role-specific dashboards
- Activity logging and audit trails
- Progress tracking and metrics
- Team performance insights

### 🎨 Modern UI/UX
- Responsive design (mobile + desktop)
- Clean, professional interface
- Intuitive navigation
- Real-time notifications

## 🏗️ System Architecture

### Tech Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Development**: Vite, Nodemon, Concurrently

### Project Structure
```
digital-bevy-portal/
├── backend/                 # Node.js/Express API
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & logging middleware
│   └── index.js           # Server entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── contexts/      # React contexts
│   │   └── App.jsx        # Main app component
│   └── public/            # Static assets
└── start.sh              # Development startup script
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-bevy-portal
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the `backend` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/digital_bevy_portal
   
   # Authentication
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   
   # Server
   PORT=3001
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Make sure MongoDB is running
   mongod
   
   # The application will create collections automatically
   ```

5. **Start Development Servers**
   ```bash
   # From project root
   chmod +x start.sh
   ./start.sh
   ```
   
   Or manually:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001

## 📖 How to Use

### Initial Setup
1. **First User Registration**: The first registered user automatically becomes an Admin
2. **Admin Dashboard**: Access full system controls and user management
3. **Create Organizational Structure**: Add Managers and Users

### Workflow Example

#### 1. Admin Creates Project
```
Admin logs in → Projects → Create New Project
- Title: "Website Redesign"
- Assign to: Manager (John Doe)
- Priority: High
- Deadline: 2024-01-15
```

#### 2. Manager Breaks Down Project
```
Manager logs in → Tasks → Create New Task
- Project: "Website Redesign"
- Task: "Frontend UI Design"
- Assign to: User (Jane Smith)
- Estimated Hours: 20
- Due Date: 2024-01-10
```

#### 3. User Executes Task
```
User logs in → My Tasks → Update Status
- Status: In Progress → Completed
- Actual Hours: 18
- Notes: "Completed ahead of schedule"
```

### Role-Specific Features

#### 👑 Admin Features
- Create and assign projects to managers
- Manage all users (create, update, deactivate)
- View system-wide analytics
- Access complete activity logs
- System configuration

#### 👨‍💼 Manager Features
- View assigned projects
- Break projects into tasks
- Assign tasks to team members
- Monitor team progress
- Generate team reports

#### 👤 User Features
- View assigned tasks
- Update task status and log hours
- Track personal progress
- Access personal dashboard

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Production start
npm test         # Run tests
```

#### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Users
- `GET /api/users` - List users (role-based)
- `POST /api/users` - Create user (Admin/Manager)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

#### Projects
- `GET /api/projects` - List projects (role-based)
- `POST /api/projects` - Create project (Admin only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Tasks
- `GET /api/tasks` - List tasks (role-based)
- `POST /api/tasks` - Create task (Manager only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Activities
- `GET /api/activities` - Activity logs (Admin/Manager)
- `GET /api/activities/stats` - Activity statistics

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'manager', 'user'],
  manager: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  isActive: Boolean
}
```

#### Project Model
```javascript
{
  title: String,
  description: String,
  status: ['pending', 'in-progress', 'completed', 'cancelled'],
  assignedTo: ObjectId (ref: User, role: manager),
  createdBy: ObjectId (ref: User),
  priority: ['low', 'medium', 'high'],
  startDate: Date,
  endDate: Date
}
```

#### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User, role: user),
  assignedBy: ObjectId (ref: User, role: manager),
  status: ['pending', 'in-progress', 'completed', 'cancelled'],
  priority: ['low', 'medium', 'high'],
  estimatedHours: Number,
  actualHours: Number,
  dueDate: Date
}
```

## 🤝 Contributing

We welcome contributions from Digital Bevy team members! Here's how to contribute:

### Development Setup
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add task filtering functionality"
   ```
6. **Push and create Pull Request**

### Contribution Guidelines

#### Code Standards
- **JavaScript**: Use ES6+ features, async/await
- **React**: Functional components with hooks
- **CSS**: Tailwind CSS classes, responsive design
- **API**: RESTful endpoints, proper HTTP status codes

#### Commit Convention
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

#### Pull Request Process
1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Request review** from team leads
5. **Address feedback** promptly

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration tests
npm run test:integration
```

## 📝 License

This project is proprietary software owned by **Digital Bevy Pvt Ltd**. All rights reserved.

**Internal Use Only** - This software is intended solely for use by Digital Bevy employees and authorized personnel.

## 🆘 Support

For technical support or questions:

- **Internal Issues**: Contact the Development Team
- **Bug Reports**: Create an issue in the internal repository
- **Feature Requests**: Discuss with your Manager or Admin

## 📊 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] File attachment support
- [ ] Team chat integration
- [ ] Calendar integration
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Advanced search and filtering

### Version History
- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Task management system
- **v1.2.0** - Activity logging and audit trails
- **v1.3.0** - Enhanced UI/UX and mobile responsiveness

---

**Built with ❤️ for Digital Bevy Pvt Ltd**

*Empowering our team with efficient project management and collaboration tools.*# projectManagement
