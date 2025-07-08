# OutGrow App

A mobile learning platform for tech skill development with interactive quizzes and educational content

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


## Screenshots
![b9fd7894-ebfd-4fc2-84ae-a797560a07bf](https://github.com/user-attachments/assets/e1e1706d-9225-4f90-a8a0-cc91366392c2)
![b985d96b-89f6-4343-acdb-34b5adfc0025](https://github.com/user-attachments/assets/7c485842-f10e-4f89-b527-a09d5c22d772)
![bb21725a-2c0f-4f80-848d-ca768fcc0fcf](https://github.com/user-attachments/assets/98865fd9-c9a0-4765-a200-afb2d4379a12)
![c4c17d66-70cb-4472-8c92-5fe995f8199c](https://github.com/user-attachments/assets/e634411c-9e66-4661-ab95-bd3f0716618f)
![ca991005-c976-4fd7-b87e-4e0e2ad5bf39](https://github.com/user-attachments/assets/d821d7d8-95ce-4f1d-99b7-5348fb339206)
![e45940cb-2019-42a0-903c-4d34f95b3f6a](https://github.com/user-attachments/assets/685762f6-2e1a-473a-a9bb-ff44617aceb4)
![f3f61b85-2f19-462e-a05e-d15ea75b210b](https://github.com/user-attachments/assets/301a![1dfe1852-228f-4d39-8c57-455e66bbea32](https://github.com/user-attachments/assets/2145877d-a442-457a-aa3b-f0c79cb3f270)
![65ab7247-647e-4842-bcf8-eb8d01b99e91](https://github.com/user-attachments/assets/8a4fc6c6-bfcc-42fc-8b84-60a8c539b562)
![91fdf599-a034-4213-974a-0deefc54b81e](https://github.com/user-attachments/assets/60fd6059-46fd-450c-94be-d4785efb7860)
![5847ef18-8a27-4d74-b530-3b909a32ee3a](https://github.com/user-attachments/assets/9fd15cc1-334c-4566-8c60-fd96286ea77d)
![07224a67-ef59-45a8-b1cd-be16d0150d6a](https://github.com/user-attachments/assets/eb6c127b-a382-485b-9bd2-f83ada4c3709)
169b-a0ca-43ba-b67b-4973ca8f0b4a)

## Contributers:
1. SK Md Arshad Iqbal: Gemini integration in quiz and tips
2. Ritesh Singh: Authentication and Quiz Saving
3. Rudrapratap Padhan: Code Refactoring and Quiz Notification
4. Sucharita Mohanty: UI Desiging, and Tailwind Styles
5. Saipadma Dhal: Styling and Navigation

### Thanks, please check Releases tab for the lastest apk.

### Local build command if you have android sdk installed
> eas build --platform android --profile apk --local                                                                                                          

