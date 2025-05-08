import { API_URL } from '@/config';
import { Exercise, Workout, WorkoutExercise } from '@/types/workout';

class WorkoutService {
    async getWorkout(id: number): Promise<Workout> {
        const response = await fetch(`${API_URL}/workouts/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch workout');
        }
        return response.json();
    }

    async createWorkout(workout: Workout): Promise<Workout> {
        const response = await fetch(`${API_URL}/workouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workout),
        });
        if (!response.ok) {
            throw new Error('Failed to create workout');
        }
        return response.json();
    }

    async updateWorkout(id: number, workout: Workout): Promise<Workout> {
        const response = await fetch(`${API_URL}/workouts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workout),
        });
        if (!response.ok) {
            throw new Error('Failed to update workout');
        }
        return response.json();
    }

    async deleteWorkout(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/workouts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete workout');
        }
    }

    async getExercise(id: number): Promise<Exercise> {
        const response = await fetch(`${API_URL}/exercises/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exercise');
        }
        return response.json();
    }

    async createExercise(exercise: Exercise): Promise<Exercise> {
        const response = await fetch(`${API_URL}/exercises`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exercise),
        });
        if (!response.ok) {
            throw new Error('Failed to create exercise');
        }
        return response.json();
    }

    async updateExercise(id: number, exercise: Exercise): Promise<Exercise> {
        const response = await fetch(`${API_URL}/exercises/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exercise),
        });
        if (!response.ok) {
            throw new Error('Failed to update exercise');
        }
        return response.json();
    }

    async deleteExercise(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/exercises/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete exercise');
        }
    }
}

export const workoutService = new WorkoutService();
export type { Exercise, Workout, WorkoutExercise }; 