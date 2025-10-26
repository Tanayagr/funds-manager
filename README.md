# FundsBook

FundsBook is a simple and intuitive mobile application designed for managing personal or group funds. Built with React Native and Expo, it leverages Firebase for real-time data synchronization and user authentication.

This project also serves as a practical exercise for learning and practicing development with Google's Gemini Code Assist, Expo, and Firebase's serverless capabilities.

## Features

- **User Authentication:** Secure sign-up and sign-in with email and password, including a "Forgot Password" feature.
- **Bookshelf Management:** Organize your finances by creating multiple "bookshelves." Users can own and delete their shelves.
- **Book Management:** Within each bookshelf, create individual "books" to track different funds or projects.
- **Real-time Updates:** Data is synchronized in real-time across devices using Firebase Firestore.
- **Modern Navigation:** Utilizes Expo Router for file-based routing and clean navigation logic.
- **Optimized Data Fetching:** Books are fetched on-demand when a user navigates to a specific bookshelf, ensuring the app is scalable and efficient.

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Backend & Database:** Firebase (Authentication & Firestore)
- **State Management:** React Context API

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (LTS version recommended)
- `npm` or `yarn`
- Expo Go app on your mobile device

### Installation

1. **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd FundsBook
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up Firebase:**
    - Create a Firebase project in the Firebase Console.
    - Enable Firestore and Authentication (Email/Password).
    - Create a `.env` file in the root of the project and add your Firebase project credentials. Use the following as a template:

    ```
    EXPO_PUBLIC_FIREBASE_API_KEY="AIza..."
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    EXPO_PUBLIC_FIREBASE_PROJECT_ID="..."
    EXPO_PUBLIC_FIREBASE_APP_ID="..."
    ```

4. **Run the application:**

    ```bash
    npx expo start
    ```

    Scan the QR code with the Expo Go app on your phone.
