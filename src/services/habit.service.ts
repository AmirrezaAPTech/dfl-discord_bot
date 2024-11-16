import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API base URL

interface CompleteHabitData {
  userId: string;
  habitName: string;
  data: string;
}

export async function completeHabit(data: CompleteHabitData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/habits/complete`, data);
    return response.data;
  } catch (error) {
    // Ensure error is treated as AxiosError
    if (axios.isAxiosError(error)) {
      throw error as AxiosError;
    }
    throw error;
  }
}
