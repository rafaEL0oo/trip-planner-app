# ✈️ Trip Planner App

A collaborative travel planning web application built with React and Firebase. Plan your perfect trip with friends through voting, rating, and commenting on hotels and activities.

## 🌟 Features

### 🏨 Hotel Planning
- **Share Hotel Links**: Add hotel options with automatic link previews
- **Vote System**: Thumbs up/down and heart reactions for hotel preferences
- **Smart Previews**: Clean hotel titles with "Go to link" and "Copy link" buttons
- **Real-time Voting**: See vote counts and change your decision anytime

### 🎯 Activity Planning
- **Activity Rating**: Rate activities from "Not Interested" to "Must Do!"
- **Descriptive Labels**: User-friendly rating options instead of numbers
- **Single Vote Logic**: One vote per user with change decision option
- **Vote Filtering**: Only shows rating options that have received votes

### 💬 Collaboration Features
- **Comments System**: Add comments to hotels and activities
- **Expandable Comments**: Show latest comment by default, expand to see all
- **User Authentication**: Simple login system with persistent sessions
- **Real-time Updates**: All changes sync instantly across users

### 🎨 Travel-Themed Design
- **Modern UI**: Clean, travel-inspired design with green gradients
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- **Travel Icons**: Flight icons, travel emojis, and adventure-focused language
- **Smooth Animations**: Hover effects and transitions throughout

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trip-planner-app.git
   cd trip-planner-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Anonymous)
   - Copy your Firebase config to `src/firebase.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Firebase Setup

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com)
- Click "Create a project"
- Follow the setup wizard

### 2. Enable Firestore Database
- In your Firebase project, go to "Firestore Database"
- Click "Create database"
- Choose "Start in test mode" (for development)
- Select a location for your database

### 3. Enable Authentication
- Go to "Authentication" in your Firebase console
- Click "Get started"
- Go to "Sign-in method" tab
- Enable "Anonymous" authentication

### 4. Get Firebase Config
- Go to Project Settings (gear icon)
- Scroll down to "Your apps"
- Click "Web" icon to add a web app
- Copy the Firebase configuration object
- Replace the config in `src/firebase.js`

## 📱 Features Overview

### Homepage
- **Travel-themed hero section** with flight icons and gradients
- **Feature cards** showing app capabilities
- **Responsive design** that works on all devices
- **Call-to-action** to start planning

### Trip Creation
- **Trip details form** with title, destination, description, and dates
- **Unique URL generation** for sharing with friends
- **User authentication** with persistent login

### Trip Planning
- **Hotel voting** with thumbs up/down and heart reactions
- **Activity rating** with descriptive labels
- **Comments system** with expandable history
- **Real-time collaboration** with instant updates

## 🎨 Design System

### Colors
- **Primary Green**: `#2E7D32` (Travel/nature green)
- **Secondary Orange**: `#FF6F00` (Sunset orange)
- **Tertiary Blue**: `#1976D2` (Sky blue)

### Typography
- **Font Family**: Inter, Roboto, Helvetica, Arial
- **Headings**: Travel green with bold weights
- **Body Text**: Clean, readable typography

### Components
- **Cards**: Rounded corners with travel-themed shadows
- **Buttons**: Gradient backgrounds with hover animations
- **Chips**: Rounded pill shapes for modern feel

## 🚀 Deployment

### GitHub Pages
This app is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** triggers automatic deployment
2. **GitHub Actions** builds and deploys the app
3. **Live URL** will be available at `https://yourusername.github.io/trip-planner-app`

### Manual Deployment
```bash
# Build the app
npm run build

# Deploy to your preferred hosting service
# The build folder contains the production files
```

## 🛠️ Technology Stack

- **Frontend**: React 19, Material-UI, React Router
- **Backend**: Firebase Firestore, Firebase Authentication
- **Styling**: Material-UI with custom travel theme
- **Deployment**: GitHub Pages with GitHub Actions
- **State Management**: React Context API

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the component library
- Firebase for backend services
- React team for the amazing framework
- Travel community for inspiration

---

**Happy Travel Planning! ✈️🌍**