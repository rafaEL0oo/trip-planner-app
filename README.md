# Trip Rating App

A collaborative trip planning web application built with React and Firebase. Users can create trip pages, share them with friends via unique URLs, and collaboratively vote on hotels and rate activities.

## Features

### 🏨 Hotel Voting
- Add hotel options with URLs
- Friends can vote with three options:
  - ❌ Don't Like
  - 👍 Like  
  - ⭐ Awesome
- Real-time vote counting

### 🎯 Activity Rating
- Add activity suggestions with descriptions
- Rate activities from 1-5 stars:
  - 1: Not Interested
  - 2: Maybe
  - 3: Interested
  - 4: Really Want To Do
  - 5: Must Do It
- Average rating calculation

### 💬 Comments System
- Comment on both hotels and activities
- Real-time comment display
- Anonymous commenting (can be extended with authentication)

### 🔗 Easy Sharing
- Generate unique URLs for each trip
- Share trip links with friends instantly
- No registration required

## Tech Stack

- **Frontend**: React 19, Material-UI
- **Backend**: Firebase Firestore
- **Routing**: React Router DOM
- **Styling**: Material-UI with custom theme

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Update `src/firebase.js` with your configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Start Development Server
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Usage

1. **Create a Trip**: Click "Create New Trip" and fill in trip details
2. **Share the Trip**: Use the "Share Trip" button to copy the unique URL
3. **Add Hotels**: Share hotel booking links for friends to vote on
4. **Add Activities**: Suggest activities with descriptions for rating
5. **Vote & Rate**: Friends can vote on hotels and rate activities
6. **Comment**: Add comments to discuss options

## Project Structure

```
src/
├── components/
│   ├── HomePage.js          # Landing page with features
│   ├── CreateTrip.js        # Trip creation form
│   └── TripPage.js          # Main trip page with voting/rating
├── firebase.js              # Firebase configuration
└── App.js                   # Main app component with routing
```

## Firebase Collections

### trips
- `id`: Unique trip identifier
- `title`: Trip title
- `destination`: Trip destination
- `description`: Trip description
- `startDate`: Trip start date
- `endDate`: Trip end date
- `hotels`: Array of hotel objects with votes and comments
- `activities`: Array of activity objects with ratings and comments
- `createdAt`: Creation timestamp

## Future Enhancements

- User authentication and profiles
- Real-time updates with Firebase listeners
- Image uploads for hotels and activities
- Trip templates
- Email notifications
- Mobile app version
- Advanced analytics and insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own trip planning needs!