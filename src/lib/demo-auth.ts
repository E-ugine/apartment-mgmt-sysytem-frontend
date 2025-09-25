// Demo users for testing the authentication system
export const demoUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@apartmentpro.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Administrator',
    role: 'landlord' as const,
    phoneNumber: '+1-555-0101',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'caretaker1',
    email: 'caretaker@apartmentpro.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'caretaker' as const,
    phoneNumber: '+1-555-0102',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    username: 'tenant1',
    email: 'tenant@apartmentpro.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'tenant' as const,
    phoneNumber: '+1-555-0103',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    username: 'agent1',
    email: 'agent@apartmentpro.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'agent' as const,
    phoneNumber: '+1-555-0104',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Simulate JWT token generation
export const generateMockTokens = (user: typeof demoUsers[0]) => {
  const accessToken = `mock_access_token_${user.id}_${Date.now()}`;
  const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;
  return { access: accessToken, refresh: refreshToken };
};

// Mock API responses for development
export const mockAuthApi = {
  login: async (credentials: { username: string; password: string }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = demoUsers.find(u => u.username === credentials.username);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }
    
    const tokens = generateMockTokens(user);
    const { password, ...userWithoutPassword } = user;
    
    return {
      ...tokens,
      user: userWithoutPassword,
    };
  },
  
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const { password, ...userWithoutPassword } = demoUsers[0];
    return userWithoutPassword;
  },
  
  refreshToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tokens = generateMockTokens(demoUsers[0]);
    return tokens;
  },
};