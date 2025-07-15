import { tournamentAPI } from './api';

// Tournament Service - handles all tournament-related operations
export const tournamentService = {
  // Get all tournaments
  getAllTournaments: async () => {
    try {
      const result = await tournamentAPI.getAllTournaments();
      return result;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des tournois'
      };
    }
  },

  // Get tournament by ID
  getTournamentById: async (id) => {
    try {
      const result = await tournamentAPI.getTournamentById(id);
      return result;
    } catch (error) {
      console.error('Error fetching tournament:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération du tournoi'
      };
    }
  },

  // Create new tournament
  createTournament: async (tournamentData) => {
    try {
      const result = await tournamentAPI.createTournament(tournamentData);
      return result;
    } catch (error) {
      console.error('Error creating tournament:', error);
      return {
        success: false,
        error: 'Erreur lors de la création du tournoi'
      };
    }
  },

  // Update tournament
  updateTournament: async (id, tournamentData) => {
    try {
      const result = await tournamentAPI.updateTournament(id, tournamentData);
      return result;
    } catch (error) {
      console.error('Error updating tournament:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du tournoi'
      };
    }
  },

  // Delete tournament
  deleteTournament: async (id) => {
    try {
      // This would need to be implemented in the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de la suppression du tournoi'
        };
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      return {
        success: false,
        error: 'Erreur lors de la suppression du tournoi'
      };
    }
  },

  // Register for tournament
  registerForTournament: async (tournamentId, competitorData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitorData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de l\'inscription au tournoi'
        };
      }
    } catch (error) {
      console.error('Error registering for tournament:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'inscription au tournoi'
      };
    }
  },

  // Get tournament participants
  getTournamentParticipants: async (tournamentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/tournaments/${tournamentId}/participants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de la récupération des participants'
        };
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des participants'
      };
    }
  }
};

export default tournamentService;
