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

### How to Manage Your API Key in Google Cloud Run
This project is configured for **Runtime Environment Injection**. This means you don't need to bake your API key into the image.

1. **In the Cloud Console**: Go to your Cloud Run service -> **Edit & Deploy New Revision**.
2. **Variables**: Under the "Variables & Secrets" tab, add an Environment Variable:
   - **Name**: `VITE_API_KEY`
   - **Value**: `your_actual_gemini_key`
3. **Deploy**: Click Deploy. The app will automatically pick up the new key without a rebuild!

### Local Development
To run locally, you can still use a `.env` file:
```env
VITE_API_KEY=your_key_here
```

### Local Docker Test
To test the production behavior locally:
```bash
docker build -t election-app .
docker run -p 8080:8080 -e VITE_API_KEY=your_key_here election-app
```
3. Open `http://localhost:8080` in your browser.
