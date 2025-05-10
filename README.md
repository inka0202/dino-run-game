# Dino Run Game

## Description

**Dino Run** is a web-based game inspired by the iconic Chrome offline Dino runner. The player controls a dinosaur that must avoid obstacles (cactus) in an endless 2D runner environment.
The game supports two modes:

- **Guest Mode** — play without logging in, no score saved.
- **Account Mode** — register/login and have your high scores saved securely.

This project demonstrates the integration of **frontend** and **backend** technologies, covering authentication, API interaction, database management, and game development using JavaScript and p5.js.

---

## Features

- 🎮 **2D Endless Runner Game**: A simple, animated game using p5.js for rendering and physics.
- 👥 **Two Game Modes**:
  - _Guest_: quick play without account.
  - _User_: register, log in and save personal high scores.
- 🔐 **JWT Authentication**:
  - Protected API routes with tokens.
  - Token is stored in localStorage and attached to authenticated requests.
- 🗃️ **High Score Saving**:
  - Each user's high score is stored in a database.
  - Scores are submitted to the server after each game session via secure POST requests.
- 🧠 **Smart UI**: Displays user’s highest score with the label `HI 00045`.
- ❌ **Session Handling**: Expired or missing tokens redirect the user to the login page.
- 🛡️ **Security Features**:
  - Passwords are hashed using bcrypt before storing.
  - Content Security Policy (CSP) headers implemented to reduce XSS risks by controlling resource loading.
  - JWTs used to secure API requests and protect private routes.
- ⚠️ **Limitations**:
  - No multiplayer functionality.
  - Browser-based only (no mobile app).
  - Email verification is not included.

---

## Tech Stack

### 🔧 Frontend

- **HTML/CSS/JavaScript** — for UI and interactivity.
- **p5.js** — for game rendering and animation.
- **Vanilla JS** — handling logic, UI state, and fetch requests.
- **localStorage** — storing JWT tokens client-side.

### 🔧 Backend

- **Node.js + Express** — server-side framework, API handling.
- **JWT (jsonwebtoken)** — secure token-based authentication.
- **bcrypt** — password hashing.
- **SQLite** — lightweight database for users and scores.
- **REST API** — organized endpoints for authentication and gameplay data.

### 🛠 Tools

- **VS Code** — development environment.
- **Git + GitHub** — version control and collaboration.

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/inka0202/dino-run-game.git
cd dino-run-game
```

### 2. Install Dependencies

Backend:

```bash
cd dino-run-game
npm install
```

**Make sure you have Node.js installed.**

### 3. Environment Configuration

Create a **.env** file inside the **dino-run-game/** folder:

```bash
 JWT_SECRET=your_jwt_secret_key
 PORT=5000
```

- Instead of your_jwt_secret_key, enter your secret key to generate JWT tokens.
- ⚠️ Important: The port must always be PORT=5000, since frontend files use hardcoded requests like http://localhost:5000/api/.... Changing the port will break communication.

### 4. Start the Server

```bash
cd dino-run-game
node server.js
```

or

```bash
cd dino-run-game
npm start
```

### 5. Launch the Frontend

The frontend does not need a separate server for local testing. Just open HTML files in a browser (for example, [public/index.html](http://localhost:5000/index.html)), or you can configure a local server through any utility (for example, live-server or http-server).

---

## Play the Game!

Dino Run is designed to be a fun and addicting experience! As you dodge cacti and jump over obstacles, your goal is to reach the highest possible score while enjoying the simple but engaging mechanics. With the high score feature, you can challenge your friends and keep improving your performance.

- Play as a guest for a quick session, or log in to save your scores and compete against your own records.

- The game is easy to get into but hard to master, making it perfect for casual gaming moments or longer, competitive play.

Ready to jump? Enjoy the game, and may the highest score win! 🏆

---

## License

This project is licensed under the MIT License.
