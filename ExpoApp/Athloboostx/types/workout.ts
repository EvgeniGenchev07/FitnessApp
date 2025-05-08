export interface Set {
    reps: number;
    weight: number;
    restTime: number;
}

export interface Exercise {
    id?: number;
    name: string;
    muscleGroups: string[];
    sets: Set[];
    estimatedTime: number;
}

export interface WorkoutExercise {
    exercise: Exercise;
    sets: Set[];
}

export interface Workout {
    id?: number;
    name: string;
    date: string;
    workoutExercises: WorkoutExercise[];
} 