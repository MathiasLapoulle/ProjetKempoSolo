import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css';
import NavBar from './components/navbar/Navbar'
import Home from './pages/home/home'
import Competitors from "./pages/Competitors/Competitors";
import TournoiDetails from "./pages/TournoiDetails/ToutnoiDetails"
import Telecommande from "./pages/Telecommande/components/Telecommande";
import Scoreboard from "./pages/Scoreboard/Scoarboard";
import ScoreboardTournoi from "./pages/Scoreboard/ScoreboardTournoi";
import TournamentList from "./pages/TournamentList/TournamentList";
import OngoingTournaments from "./pages/OngoingTournaments/OngoingTournaments";
import TournamentBracketDemo from "./pages/TournamentBracketDemo/TournamentBracketDemo";
import BracketExample from "./pages/BracketExample/BracketExample";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          {/* Routes accessibles sans connexion */}
          <Route path='/' element={<div className='content'><Home /></div>} />
          <Route path='/tournois-encours' element={<div className='content'><OngoingTournaments /></div>} />
          <Route path='/login' element={<div className='content'><Login /></div>} />
          <Route path='/register' element={<div className='content'><Register /></div>} />
          <Route path='/forgot-password' element={<div className='content'><ForgotPassword /></div>} />
          <Route path='/reset-password/:userId/:token' element={<div className='content'><ResetPassword /></div>} />
          <Route path='/bracket-demo' element={<div className='content'><TournamentBracketDemo /></div>} />
          <Route path='/bracket-example' element={<div className='content'><BracketExample /></div>} />
          <Route path='/support' element={<div className='content'><Support /></div>} />
          
          {/* Routes accessibles aux utilisateurs connectés (user et admin) */}
          <Route path='/profile' element={
            <ProtectedRoute>
              <div className='content'><Profile /></div>
            </ProtectedRoute>
          } />
          <Route path='/competiteurs' element={
            <ProtectedRoute>
              <div className='content'><Competitors /></div>
            </ProtectedRoute>
          } />
          <Route path='/tournois' element={
            <ProtectedRoute>
              <div className='content'><TournamentList /></div>
            </ProtectedRoute>
          } />
          <Route path='/tournoiDetails/:id' element={
            <ProtectedRoute>
              <TournoiDetails />
            </ProtectedRoute>
          } />
          
          {/* Routes accessibles uniquement aux administrateurs */}
          <Route path='/telecommande' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className='content'><Telecommande /></div>
            </ProtectedRoute>
          } />
          <Route path='/scoreboard' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className='content'><Scoreboard /></div>
            </ProtectedRoute>
          } />
          <Route path='/scoreboard-tournoi' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className='content'><ScoreboardTournoi /></div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
