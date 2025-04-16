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
