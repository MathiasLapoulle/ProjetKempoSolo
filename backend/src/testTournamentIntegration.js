const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testTournamentCreation() {
  console.log('🧪 Testing Tournament Creation Integration...\n');
  
  try {
    // 1. First, let's test the tournament creation with minimal data
    console.log('1. Testing tournament creation with minimal data...');
    const minimalTournament = {
      name: 'Test Tournament Minimal',
      start_date: '2025-07-25',
      gender: 'male',
      rank: 'Ceinture Blanche',
      system: 'poule'
    };
    
    const response1 = await api.post('/tournaments', minimalTournament);
    console.log('✅ Minimal tournament created:', response1.data);
    
    // 2. Test tournament creation with all fields (like frontend sends)
    console.log('\n2. Testing tournament creation with all fields...');
    const fullTournament = {
      name: 'Test Tournament Full',
      start_date: '2025-07-30',
      city: 'Paris',
      gender: 'female',
      rank: 'Ceinture Jaune',
      system: 'elimination'
    };
    
    const response2 = await api.post('/tournaments', fullTournament);
    console.log('✅ Full tournament created:', response2.data);
    
    // 3. Test getting all tournaments
    console.log('\n3. Testing get all tournaments...');
    const getAllResponse = await api.get('/tournaments');
    console.log('✅ All tournaments retrieved:', getAllResponse.data.length, 'tournaments');
    
    // 4. Test getting a specific tournament
    console.log('\n4. Testing get specific tournament...');
    const tournamentId = response2.data.id;
    const getOneResponse = await api.get(`/tournaments/${tournamentId}`);
    console.log('✅ Specific tournament retrieved:', getOneResponse.data);
    
    // 5. Test the auxiliary endpoints that the frontend needs
    console.log('\n5. Testing auxiliary endpoints...');
    
    try {
      const ranksResponse = await api.get('/ranks');
      console.log('✅ Ranks endpoint working:', ranksResponse.data.length, 'ranks');
    } catch (error) {
      console.log('❌ Ranks endpoint failed:', error.response?.status || error.message);
    }
    
    try {
      const ageGroupsResponse = await api.get('/age-groups');
      console.log('✅ Age groups endpoint working:', ageGroupsResponse.data.length, 'age groups');
    } catch (error) {
      console.log('❌ Age groups endpoint failed:', error.response?.status || error.message);
    }
    
    try {
      const weightCategoriesResponse = await api.get('/weight-categories');
      console.log('✅ Weight categories endpoint working:', weightCategoriesResponse.data.length, 'weight categories');
    } catch (error) {
      console.log('❌ Weight categories endpoint failed:', error.response?.status || error.message);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Tournament creation with minimal data: ✅');
    console.log('- Tournament creation with full data: ✅');
    console.log('- Tournament retrieval (all): ✅');
    console.log('- Tournament retrieval (specific): ✅');
    console.log('- Auxiliary endpoints tested');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

// Run the test
testTournamentCreation();
