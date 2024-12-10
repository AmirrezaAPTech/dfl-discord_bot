// sessionManager.ts
const userSessions = new Map<string, boolean>();

// Check if a user has an active session
export const hasActiveSession = (userId: string): boolean => {
  return userSessions.has(userId);
};

// Start a session for a user
export const startSession = (userId: string): void => {
  userSessions.set(userId, true);
};

// End the session for a user
export const endSession = (userId: string): void => {
  userSessions.delete(userId);
};

// Optionally, you could add a session timeout or expiration if needed.
