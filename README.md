# OutGrow App

A mobile learning platform for tech skill development with interactive quizzes and educational content.

## Project Structure

```
/src
  /api            - API client functions for external services
    authApi.js    - Authentication API requests
    quizApi.js    - Quiz fetching from Gemini AI
  /auth           - Authentication logic
    authService.js - Login/register/session management
  /components     - Reusable UI components
    AppHeader.js  - App header component
    BottomNav.js  - Bottom navigation bar
    Timer.js      - Quiz timer component
  /config         - App configuration
    constants.js  - App-wide constants
    tipData.js    - Educational content data
  /context        - React context providers
    QuizContext.js - Quiz state management
  /hooks          - Custom React hooks
    useQuizState.js - Quiz interaction logic
  /navigation     - Navigation configuration
    AppNavigator.js - App navigation structure
  /screens        - App screens
    HomeScreen.js
    LoginScreen.js
    ProfileScreen.js
    QuizScreen.js
    SavedScreen.js
    SignupScreen.js
    TechDetailScreen.js
    TipDetailScreen.js
    TipScreen.js
  /styles         - Styling utilities
    theme.js      - App theme and shared styles
  /utils          - Utility functions
    validation.js - Form validation schemas
```

## Features

- Interactive tech quizzes powered by Google Gemini AI
- Educational tips and code examples
- User authentication
- Profile with quiz history and achievements
- Daily quiz notifications

## Technology Stack

- React Native / Expo
- Tailwind CSS (via NativeWind)
- Google Gemini API
- AsyncStorage for local persistence
- Expo Notifications for reminders

## Running the App

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

## Authentication

The app uses a simulated authentication flow with dummyjson.com API for demo purposes. In a production environment, this would be replaced with a real authentication service.

## Quiz Generation

Quizzes are generated using the Google Gemini API with carefully crafted prompts to create educational content. A fallback system ensures quizzes are available even if the API is unavailable.
