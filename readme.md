# Setlist Manager

A mobile application built with React Native and Expo that helps musicians manage their setlists, collaborate with band members, and organize songs for performances.

## Features

- 🎵 Create and manage setlists
- 👥 Invite band members to collaborate
- 📱 Cross-platform (iOS, Android, Web)
- 🎸 Song management with duration tracking
- 📅 Event scheduling with date and location
- 🔄 Real-time updates and collaboration
- 🔒 Secure authentication
- ⏱️ Built-in visual metronome

## Tech Stack

### Frontend
- React Native
- Expo Router (for navigation)
- React Hook Form (form management)
- React Native Paper (UI components)
- TypeScript
- dayjs (date handling)

### Backend & Infrastructure
- Firebase
  - Authentication
  - Realtime Database
  - Cloud Storage
- Expo (development platform)

### Development Tools
- TypeScript
- Prettier
- Metro bundler
- Babel

## Project Structure

The application follows Expo Router's file-based routing convention with the following main directories:

- `/app` - Main application routes and screens
- `/components` - Reusable UI components
- `/constants` - Theme and configuration constants
- `/utils` - Helper functions and utilities

## Getting Started

1. Clone the repository
2. Install dependencies: npm install
3. 3. Create a `firebaseConfig.js` file with your Firebase credentials
4. Start the development server: yarn start


## Environment Setup

Make sure to set up your Firebase configuration in a `firebaseConfig.js` file (not included in version control). The application expects the following Firebase services to be configured:

- Authentication with Email/Password
- Realtime Database
- Cloud Storage

## Development

The project uses Expo's development tools. You can run the app in different environments:
