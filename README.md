# 🚀 Together App (Frontend)

A cross-platform mobile and web application built with **React Native** and **Expo**. This project focuses on a modern user experience, unified routing with **Expo Router**, and containerized web deployment using **Docker** and **Nginx**.

## 🛠 Tech Stack

### Development Environment
* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Expo](https://expo.dev/) (SDK 54) & [React Native](https://reactnative.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Linting:** [ESLint](https://eslint.org/) (with `eslint-config-expo`)

### Core Libraries & UI
* **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
* **UI Library:** React Native Elements & [Expo Vector Icons](https://icons.expo.fyi/)
* **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
* **Gesture Handling:** [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
* **Assets:** Expo Image & Expo Font

### Web & Containerization
* **Web Bundler:** Metro (Expo Web)
* **Production Server:** [Nginx](https://nginx.org/) (Alpine)
* **Containerization:** Docker & Docker Compose

---

## 📂 Project Structure

```text
.
├── app                 # Expo Router pages & layouts (File-based routing)
│   ├── _layout.tsx     # Root layout configuration
│   ├── index.tsx       # Home entry point
│   └── ...             # Other screens
├── assets              # Static assets (Images, Fonts)
├── components          # Reusable UI components (Buttons, Inputs, Cards)
├── constants           # App-wide constants (Colors, Theme, Config)
├── hooks               # Custom React hooks (useColorScheme, etc.)
├── scripts             # Utility scripts (e.g., reset-project)
├── styles              # Shared stylesheets and style definitions
├── types               # TypeScript interface and type definitions
├── Dockerfile          # Multi-stage Docker build for Web
├── docker-compose.yml  # Container orchestration configuration
├── app.json            # Expo configuration (Name, Slug, Plugins)
└── package.json        # Dependencies and Scripts
````

## Local Development Setup

### 1. Prerequisites
* **Node.js** (LTS recommended)
* **npm** (comes with Node.js)
* **Expo Go** app on your physical device (Android/iOS) or an Emulator.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone <repository-url>

# Install dependencies
npm install
```

### 3. Run Locally

Start the development server with Expo:

```bash
# Start the development server
npx expo start
