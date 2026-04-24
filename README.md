# Election Process Education Assistant - PromptWars Challenge 2

## Project Overview

The **Election Process Education Assistant** is a modern, accessible web application designed to help citizens navigate the complexities of the electoral process. Built with a high-contrast "Gov-Tech" aesthetic, the platform provides clear, highly accurate, and unbiased information regarding upcoming elections, voter registration procedures, and civic rights. 

This project was developed as a submission for **PromptWars Challenge 2**, emphasizing rapid, AI-assisted development, strict accessibility compliance (WCAG 2.1 AA), and a production-ready, highly optimized architecture suitable for instant serverless deployment.

---

## Features

- **Non-partisan AI Guide**: A built-in chat interface powered by the Google Gemini AI. It acts as an interactive assistant capable of answering user questions about voting locations, rights, and deadlines in a neutral, informative manner. Includes input sanitization and graceful fallback handling.
- **Interactive Timeline Visualizer**: A responsive, dynamically sorted chronological timeline that highlights critical election events (e.g., Early Voting dates, Registration Deadlines). 
- **Strict Accessibility (a11y)**: The entire application is built with screen readers in mind. It features `aria-live` regions for dynamic AI responses, hidden `sr-only` context labels, and semantic HTML structure.
- **Single-Page Application (SPA) Routing**: Seamless, state-based navigation for secondary pages (Privacy Policy, Accessibility Statement, Contact Us) ensuring a fast user experience without unnecessary page reloads.

---

## Tech Stack

This project leverages a cutting-edge, lightweight stack optimized for speed and developer experience:

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) for lightning-fast hot module replacement and optimized builds.
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) configured for aggressive tree-shaking to keep the production bundle incredibly small.
- **AI Integration**: Official `@google/generative-ai` SDK to securely interface with the Gemini API.
- **Testing**: Jest & React Testing Library setup for component rendering verification and API mocking.
- **Containerization**: A highly optimized, multi-stage **Docker** configuration utilizing `node:alpine` and `nginx:alpine` to ensure final image sizes remain under 20MB.
- **Deployment**: Configured out-of-the-box for **Google Cloud Run** with custom Nginx SPA routing mapped to port `8080` for instant cold starts.

---

## How to Run it Locally

You can run this project locally either through standard Node.js or via Docker.

### Prerequisites
1. Create a `.env` file in the root directory (Note: This file is ignored by git).
2. Add your Google Gemini API key:
   ```env
   API_KEY=your_api_key_here
   ```

### Method 1: Using Node.js (Development Mode)
1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

### Method 2: Using Docker (Production Simulation)
To test exactly how the app will behave when deployed to Google Cloud Run:
1. Build the multi-stage Docker image, passing your key as a build argument:
   ```bash
   docker build --build-arg API_KEY=your_key_here -t election-app .
   ```
2. Run the container, binding port 8080:
   ```bash
   docker run -p 8080:8080 election-app
   ```
3. Open `http://localhost:8080` in your browser.
