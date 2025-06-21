# Expo Fullstack Starter

A comprehensive starter template for building full-stack, cross-platform applications using Expo. It integrates a powerful tech stack including NativeWind for styling, tRPC for typesafe APIs, and Turso for a lightweight, fast database. This template is designed to get you up and running quickly with a solid foundation, complete with a pre-configured Google OAuth flow.

## Features

- **UI & Styling:**
  - **NativeWind v4:** Use Tailwind CSS for styling your React Native application.
  - **Dark/Light Mode:** The application supports both dark and light themes with persistent state.
  - **Adaptive Navigation Bar:** The Android Navigation Bar color automatically matches the current theme.
- **Component Library:**
  - A set of common, reusable components built with `react-native-reusables`, providing a developer experience similar to ShadCN for React Native. Includes `ThemeToggle`, `Avatar`, `Button`, `Card`, `Progress`, `Text`, `Tooltip`, and more.
- **Full-stack Architecture:**
  - **Expo API Routes:** Leverage file-based routing for your server-side logic.
  - **tRPC:** End-to-end typesafe APIs, ensuring your frontend and backend are always in sync.
- **Authentication:**
  - Pre-configured Google OAuth flow. (Credit: [betomoedano/expo-oauth-example](https://github.com/betomoedano/expo-oauth-example))
- **Database:**
  - **Turso:** Integrated with TursoDB, a fast and lightweight edge database.
  - **Drizzle ORM:** A modern TypeScript ORM for database schema management and queries.

## Tech Stack

- **Framework:** [Expo](https://expo.dev/)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) / [Tailwind CSS](https://tailwindcss.com/)
- **API Layer:** [tRPC](https://trpc.io/) on [Expo API Routes](https://docs.expo.dev/router/reference/api-routes/)
- **Database:** [Turso](https://turso.tech/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Navigation:** [React Navigation](https://reactnavigation.org/)
- **State Management:** [React Query](https://tanstack.com/query/latest)
- **UI Primitives:** [@rn-primitives](https://rn-primitives.vercel.app/)
- **Schema Validation:** [Zod](https://zod.dev/)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Bun](https://bun.sh/) installed. (Or Node.js and npm)
- Expo CLI installed: `npm install -g expo-cli`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd expo-fullstack-starter
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
    Alternatively, you can use npm:
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file by copying `.env.example` and fill in the required values for your database and authentication providers.
4.  **Push database schema:**
    Run the following command to sync your schema with your Turso database.
    ```bash
    npm run db:push
    ```

## Available Scripts

All scripts can be run with `bun run <script_name>` or `npm run <script_name>`.

- `dev`: Starts the development server for all platforms (iOS, Android, Web).
- `dev:web`: Starts the development server for Web only.
- `android`: Runs the app on a connected Android device or emulator.
- `ios`: Runs the app on a connected iOS device or simulator.
- `db:push`: Pushes your Drizzle schema changes to the database.
- `db:generate`: Generates Drizzle migration files based on schema changes.
- `web:build`: Creates a production-ready build for the web platform.
- `web:deploy`: Deploys the web build using EAS Deploy.
- `clean`: Removes `node_modules` and the `.expo` cache directory for a clean reinstall.
