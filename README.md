# Cruze Calendar 📅

Cruze is a sophisticated, high-performance personal schedule manager designed for the modern professional. Built with a focus on UI/UX excellence, it features interactive 3D flipping appointment cards, intelligent travel calculations, and seamless AI-powered team management.

![Cruze Calendar Interface](https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200&h=400)

## ✨ Core Features

- **Interactive 3D Appointment Cards**: A unique card-based system where users can click to flip between a visual meeting summary and a detailed agenda/notes view.
- **Multiple View Modalities**: Effortlessly switch between Day, Week, Month, and Quarter views to maintain both granular and high-level perspectives of your time.
- **Travel Intelligence**: Automatic estimation of travel time and distance between consecutive appointments based on location metadata.
- **AI-Powered Sync**: Integration with **Google Gemini API** for group integrity verification and cloud synchronization simulation.
- **Universal Event Sharing**: Share specific meetings via unique, Base64-encoded URLs.
- **PWA Optimized**: Designed for mobile and desktop "installation" with offline-ready capabilities.
- **Team & Contact Management**: Robust systems for managing recurring groups and shared contact lists.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Data Persistence**: LocalStorage with Export/Import capabilities.
- **Icons**: [Heroicons](https://heroicons.com/)

## 🚀 Getting Started & GitHub Setup

To add these files to your repository at `https://github.com/sghoshsd/Cruze-calendar.git`, run the following commands in your project root:

1. **Initialize and Push to GitHub**:
   ```bash
   # Initialize a local git repository
   git init

   # Add all files
   git add .

   # Commit the files
   git commit -m "Initial commit: Cruze Calendar release"

   # Add your remote origin
   git remote add origin https://github.com/sghoshsd/Cruze-calendar.git

   # Rename branch to main
   git branch -M main

   # Push to GitHub
   git push -u origin main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📦 Data Management

Cruze prioritizes user privacy and data portability. You can find the **Data Management** tools in the header:
- **Export**: Save your entire schedule as a JSON backup.
- **Import**: Merge existing backups into your current instance.
- **CSV Export**: Export filtered search results for external reporting.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with passion for productivity and aesthetics.*
