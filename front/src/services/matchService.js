import { matchAPI } from './api';

// Match Service - handles all match-related operations
export const matchService = {
  // Get matches for a tournament
  getTournamentMatches: async (tournamentId) => {
    try {
      const result = await matchAPI.getTournamentMatches(tournamentId);
      return result;
    } catch (error) {
      console.error('Error fetching tournament matches:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des matchs'
      };
    }
  },

  // Update match score
  updateMatchScore: async (matchId, scoreData) => {
    try {
      const result = await matchAPI.updateMatchScore(matchId, scoreData);
      return result;
    } catch (error) {
      console.error('Error updating match score:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du score'
      };
    }
  },

  // Get match by ID
  getMatchById: async (matchId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/matches/${matchId}`, {
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
          error: errorData.message || 'Erreur lors de la récupération du match'
        };
      }
    } catch (error) {
      console.error('Error fetching match:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération du match'
      };
    }
  },

  // Start a match
  startMatch: async (matchId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/matches/${matchId}/start`, {
        method: 'POST',
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
          error: errorData.message || 'Erreur lors du démarrage du match'
        };
      }
    } catch (error) {
      console.error('Error starting match:', error);
      return {
        success: false,
        error: 'Erreur lors du démarrage du match'
      };
    }
  },

  // End a match
  endMatch: async (matchId, finalScores) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/matches/${matchId}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalScores),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de la fin du match'
        };
      }
    } catch (error) {
      console.error('Error ending match:', error);
      return {
        success: false,
        error: 'Erreur lors de la fin du match'
      };
    }
  },

  // Update live score during match
  updateLiveScore: async (matchId, scoreUpdate) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/matches/${matchId}/score`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreUpdate),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de la mise à jour du score'
        };
      }
    } catch (error) {
      console.error('Error updating live score:', error);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du score'
      };
    }
  },

  // Get current ongoing matches
  getOngoingMatches: async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/matches/ongoing`, {
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
          error: errorData.message || 'Erreur lors de la récupération des matchs en cours'
        };
      }
    } catch (error) {
      console.error('Error fetching ongoing matches:', error);
      return {
        success: false,
        error: 'Erreur lors de la récupération des matchs en cours'
      };
    }
  },

  // Generate tournament bracket
  generateBracket: async (tournamentId, categoryId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/tournaments/${tournamentId}/categories/${categoryId}/bracket`, {
        method: 'POST',
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
          error: errorData.message || 'Erreur lors de la génération du bracket'
        };
      }
    } catch (error) {
      console.error('Error generating bracket:', error);
      return {
        success: false,
        error: 'Erreur lors de la génération du bracket'
      };
    }
  }
};

export default matchService;
