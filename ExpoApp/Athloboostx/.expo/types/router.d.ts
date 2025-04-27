/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/createPost` | `/(tabs)/explore` | `/(tabs)/nutritions` | `/(tabs)/profile` | `/_sitemap` | `/changePassword` | `/createPost` | `/editExercise` | `/editProfile` | `/explore` | `/login` | `/manageWorkout` | `/nutritions` | `/profile` | `/register` | `/settings`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
