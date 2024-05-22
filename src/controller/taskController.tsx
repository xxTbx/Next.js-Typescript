import { Task } from "@/types"

//Reference: Fullstækk LMS/kurs
const API_URL = 'http://localhost:3000/api/restapi';

export const taskFetch = async (
  task_random: string, 
  task_count: string
): Promise<Task[]> => {
  const apiUrl = `${API_URL}?type=${task_random}&count=${task_count}`;

  console.log('Fetching tasks from:', apiUrl);

  const response = await fetch(apiUrl, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
  }

  const result = await response.json() as { success: boolean; data: Task[] };

  console.log('Tasks fetched successfully:', result.data);
  return result.data;
};

export default {
  taskFetch
};
