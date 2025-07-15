# Frontend-Backend Connection Guide

## 🎯 Overview
This document explains how the frontend React components are connected to the backend Node.js/Hono API routes.

## 📁 Architecture

### Backend Routes Structure
```
Backend API Endpoints:
├── /auth/register          → User registration
├── /auth/login            → User login
├── /users/me              → Get current user profile
├── /users/profile         → Update user profile
├── /users/change-password → Change password
├── /users/forgot-password → Request password reset
├── /users/reset-password  → Reset password with token
├── /tournaments           → Tournament CRUD operations
├── /competitors           → Competitor management
├── /matches              → Match management
├── /age-groups           → Age group data
└── /weight-categories    → Weight category data
```

### Frontend Services Structure
```
Frontend Services:
├── services/
│   ├── api.js              → Base API configuration & auth calls
│   ├── tournamentService.js → Tournament-related operations
│   ├── matchService.js     → Match & scoring operations
│   └── index.js           → Service exports & configuration
```

## 🔗 Component-Route Connections

### 1. Authentication Components

#### **Register Component** (`/src/pages/Auth/Register.js`)
- **Backend Route**: `POST /auth/register`
- **Service Used**: `authAPI.register()`
- **Data Flow**:
  ```javascript
  User fills form → authAPI.register(userData) → Backend creates user + JWT → Frontend stores token + redirects
  ```

#### **Login Component** (`/src/pages/Auth/Login.js`)  
- **Backend Route**: `POST /auth/login`
- **Service Used**: `authAPI.login()`
- **Data Flow**:
  ```javascript
  User enters credentials → authAPI.login(email, password) → Backend validates + returns JWT → Frontend stores token + updates auth state
  ```

#### **ForgotPassword Component** (`/src/pages/Auth/ForgotPassword.js`)
- **Backend Route**: `POST /users/forgot-password`
- **Service Used**: `authAPI.forgotPassword()`
- **Data Flow**:
  ```javascript
  User enters email → authAPI.forgotPassword(email) → Backend sends reset email → Frontend shows success message
  ```

#### **ResetPassword Component** (`/src/pages/Auth/ResetPassword.js`)
- **Backend Route**: `POST /users/reset-password`
- **Service Used**: `authAPI.resetPassword()`
- **Data Flow**:
  ```javascript
  User clicks email link → Frontend extracts token → User sets new password → authAPI.resetPassword(token, password) → Backend updates password
  ```

#### **Profile Component** (`/src/pages/Auth/Profile.js`)
- **Backend Routes**: 
  - `GET /users/me` (get profile)
  - `PUT /users/profile` (update profile)
  - `PUT /users/change-password` (change password)
- **Services Used**: `authAPI.getCurrentUser()`, `authAPI.updateProfile()`, `authAPI.changePassword()`

### 2. Tournament Components

#### **TournamentList Component** (`/src/pages/TournamentList/`)
- **Backend Route**: `GET /tournaments`
- **Service Used**: `tournamentService.getAllTournaments()`
- **Data Flow**:
  ```javascript
  Component loads → tournamentService.getAllTournaments() → Backend returns tournament list → Frontend displays tournaments
  ```

#### **CreateTournament Component** (`/src/pages/CreateTournament/`)
- **Backend Route**: `POST /tournaments`
- **Service Used**: `tournamentService.createTournament()`
- **Data Flow**:
  ```javascript
  User fills form → tournamentService.createTournament(data) → Backend creates tournament → Frontend redirects to tournament list
  ```

#### **TournamentDetails Component** (`/src/pages/TournoiDetails/`)
- **Backend Routes**:
  - `GET /tournaments/:id` (get tournament details)
  - `GET /tournaments/:id/participants` (get participants)
- **Service Used**: `tournamentService.getTournamentById()`, `tournamentService.getTournamentParticipants()`

### 3. Match & Scoring Components

#### **Scoreboard Component** (`/src/pages/Scoreboard/`)
- **Backend Routes**:
  - `GET /matches/tournament/:id` (get tournament matches)
  - `PUT /matches/:id` (update match scores)
- **Service Used**: `matchService.getTournamentMatches()`, `matchService.updateMatchScore()`

#### **OngoingTournaments Component** (`/src/pages/OngoingTournaments/`)
- **Backend Route**: `GET /matches/ongoing`
- **Service Used**: `matchService.getOngoingMatches()`

#### **TournamentBracket Component** (`/src/components/TournamentBracket/`)
- **Backend Routes**:
  - `GET /matches/tournament/:id` (get bracket data)
  - `POST /tournaments/:id/categories/:categoryId/bracket` (generate bracket)
- **Service Used**: `matchService.getTournamentMatches()`, `matchService.generateBracket()`

### 4. Competitor Components

#### **Competitors Component** (`/src/pages/Competitors/`)
- **Backend Routes**:
  - `GET /competitors` (get all competitors)
  - `POST /competitors` (create competitor)
- **Service Used**: `competitorAPI.getAllCompetitors()`, `competitorAPI.createCompetitor()`

## 🔐 Authentication Flow

### JWT Token Management
1. **Login/Register** → Backend returns JWT token
2. **Frontend stores token** in localStorage
3. **API service** automatically includes token in headers
4. **Backend middleware** validates token for protected routes
5. **Auto logout** if token expires or is invalid

### AuthContext Integration
```javascript
// AuthContext provides global auth state
const { user, isAuthenticated, login, logout, register } = useAuth();

// Components use auth context for:
// - Checking if user is logged in
// - Getting current user data
// - Triggering login/logout
// - Protecting routes
```

## 📡 API Service Architecture

### Base API Configuration (`api.js`)
- **Axios instance** with base URL configuration
- **Request interceptor** adds JWT token to headers
- **Response interceptor** handles token expiration
- **Error handling** with consistent error messages

### Service Pattern
Each service follows this pattern:
```javascript
export const serviceAPI = {
  operation: async (params) => {
    try {
      const response = await api.method(endpoint, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
```

## 🔄 Data Flow Examples

### Complete Registration Flow
```
1. User fills registration form
2. Frontend validates form data
3. authAPI.register(userData) called
4. Backend POST /auth/register
5. Backend validates data
6. Backend creates user in database
7. Backend returns JWT token + user data
8. Frontend stores token
9. Frontend updates auth context
10. Frontend redirects to dashboard
```

### Tournament Creation Flow
```
1. User fills tournament form
2. tournamentService.createTournament(data) called
3. Backend POST /tournaments
4. Backend validates user permissions
5. Backend creates tournament in database
6. Backend returns tournament data
7. Frontend updates tournament list
8. Frontend shows success message
```

### Live Score Update Flow
```
1. Admin updates score on scoreboard
2. matchService.updateLiveScore(matchId, scores) called
3. Backend PUT /matches/:id/score
4. Backend validates permissions
5. Backend updates match in database
6. Backend returns updated match data
7. Frontend updates scoreboard display
8. (Optional) WebSocket broadcast to spectators
```

## 🛡️ Security & Error Handling

### Protected Routes
- All API requests include JWT token in Authorization header
- Backend middleware validates token for protected endpoints
- Frontend automatically redirects to login if token expires

### Error Handling Pattern
```javascript
// Consistent error handling across all services
try {
  const result = await serviceAPI.operation(params);
  if (result.success) {
    // Handle success
  } else {
    // Handle API error
    setError(result.error);
  }
} catch (error) {
  // Handle network/unexpected errors
  setError('Une erreur inattendue est survenue');
}
```

## 🚀 Usage Examples

### Using Authentication Service
```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { login, user, isAuthenticated } = useAuth();
  
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      // User is logged in, auth context updated
    } else {
      setError(result.error);
    }
  };
};
```

### Using Tournament Service
```javascript
import { tournamentService } from '../services';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  
  useEffect(() => {
    const fetchTournaments = async () => {
      const result = await tournamentService.getAllTournaments();
      if (result.success) {
        setTournaments(result.data);
      }
    };
    fetchTournaments();
  }, []);
};
```

This architecture ensures:
- ✅ Consistent API communication
- ✅ Proper error handling
- ✅ Secure authentication
- ✅ Maintainable code structure
- ✅ Real-time data updates
- ✅ Scalable service architecture
