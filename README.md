# Aldaleel - Your Smart Travel Companion 🌍✈️

Aldaleel is a comprehensive travel planning application that helps users create personalized travel itineraries, manage trips, and access essential travel information. Built with React Native and modern technologies, it provides a seamless travel planning experience.

## Features 🌟

### Authentication & Profile Management
- Secure user authentication system
- Profile customization with travel preferences
- Email verification system
- User stats tracking (trips, countries visited, saved places)

### Trip Planning & Management
- Create and manage travel itineraries
- Customizable trip details (destination, duration, dates)
- Special requirements handling (Halal food, accessibility, etc.)
- Transportation preferences
- Trip filtering and sorting capabilities
- Real-time trip status tracking (upcoming, planning, completed)

### Smart Travel Features
- AI-powered travel recommendations
- Visa requirement information
- Local events discovery
- Multi-language support
- Travel preferences customization

## Tech Stack 💻

### Mobile App (AldaleelApp)
- **Framework**: React Native
- **UI Styling**: TailwindCSS (NativeWind)
- **Navigation**: React Navigation
- **Icons**: Lucide React Native, Expo Vector Icons
- **State Management**: React Context API

### Backend (AldaleelMCP)
- **Server**: Node.js
- **API Gateway**: Express.js
- **AI Integration**: OpenAI API
- **Event Services**: Live Events API
- **Documentation**: OpenAPI/Swagger

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React Native development environment

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Aldaleel.git
cd AldaleelApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run android
# or
npm run ios
```

## Project Structure 📁

```
AldaleelApp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Application screens
│   │   ├── auth/      # Authentication screens
│   │   ├── home/      # Home and main features
│   │   ├── profile/   # User profile screens
│   │   └── trips/     # Trip management screens
│   ├── config/        # Configuration files
│   └── assets/        # Images and static assets
├── App.js             # Application entry point
└── tailwind.config.js # TailwindCSS configuration
```

## Dark Mode Support

We've implemented dark mode support in the app using the following changes:

1. **ThemeProvider**:
   - Created a new `ThemeProvider.js` in the root directory that manages theme state (light/dark/system) and theme colors
   - Uses AsyncStorage to persist user preferences
   - Provides a custom hook `useTheme()` to easily access theme settings throughout the app

2. **ThemeAwareComponent**:
   - Added a reusable component in `src/components/ThemeAwareComponent.js` 
   - Provides consistent styling, colors, and component wrappers for easy theme integration
   - Includes helper hooks like `useThemeAwareStyles()` to simplify accessing theme colors and styles

3. **ThemeSettings Screen**:
   - Updated to connect with the ThemeProvider context
   - Added proper dark mode styling to all UI elements
   - Made the theme switching functional

4. **App.js**:
   - Added ThemeProvider to the provider stack

5. **HomeScreen**:
   - Updated to support dark mode styling
   - Used ThemeProvider to conditionally render styles based on the current theme

### To-Do for Complete Dark Mode Support:

For all other screens that haven't been updated yet, apply the following pattern:

1. Import the ThemeProvider hooks:
   ```javascript 
   import { useTheme } from '../../../ThemeProvider';
   // Optional if needed:
   import { useThemeAwareStyles } from '../../components/ThemeAwareComponent';
   ```

2. Use the hook in your component:
   ```javascript
   const { isDarkMode, colors } = useTheme();
   ```

3. Update component styles to support dark mode:
   - Use conditional tailwind classes: `className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}`
   - Use conditional StatusBar: `barStyle={isDarkMode ? "light-content" : "dark-content"}`
   - Apply theme colors: `color={colors.primary}`

4. For components that need consistent styling, use the ThemeAwareComponent helpers:
   ```javascript
   const { styles, colors: themeColors } = useThemeAwareStyles();
   ```

### Testing Dark Mode

1. Go to the Theme Settings screen
2. Try each theme option (System, Light, Dark)
3. Verify all screens properly respond to theme changes
4. Check accessibility features still work with dark mode

## Application Structure and Flow 🔄

### Core Files and Purpose

| File | Purpose |
|------|---------|
| **package.json** | Manages dependencies including React Native/Expo, React Navigation, Supabase, React Query, NativeWind, and i18n |
| **App.js** | Main entry point that sets up navigation structure, authentication flow, and providers |
| **AuthProvider.js** | Manages user authentication state with AsyncStorage token persistence |
| **ThemeProvider.js** | Handles theme settings (light/dark/system mode and color themes) |
| **tailwind.config.js** | Configuration for TailwindCSS/NativeWind styling |
| **global.css** | Global CSS styles |

### Application Flow

1. **Authentication Flow**
   - App starts with **SplashScreen**
   - First-time users see **OnboardScreen** for app introduction
   - Users can login, sign up, verify account or reset password
   - **AuthProvider** maintains authentication state using AsyncStorage tokens

2. **Main Application Flow**
   - After authentication, users land on the **HomeScreen** dashboard
   - Users access travel information through specialized screens:
     - Visa information
     - Local customs
     - Currency
     - Health
     - Transportation
     - Language

3. **Key Features**
   - **Trip Planning**: Create trips, set preferences, view trip details
   - **AI Assistant**: Get intelligent travel assistance
   - **Profile Management**: Edit profile, set notifications, customize preferences
   - **Theme System**: Support for light/dark mode and multiple color themes
   - **Internationalization**: Multiple languages with RTL support for Arabic

### Technical Implementation
- **Navigation**: Stack-based navigation with React Navigation
- **State Management**: Context API for app-wide state and React Query for API data
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend Integration**: Supabase services
- **Device Storage**: AsyncStorage for persistent data
