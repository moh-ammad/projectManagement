
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