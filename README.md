# Time Capsule 2.0

Welcome to the **Time Capsule** project! This web application allows users to create, store, and share digital "capsules" containing text, images, and videos. These capsules can be locked until a future date, opened collectively for significant events, or used as a communal space to record shared experiences.

---

## Features

- **User Authentication**: Sign up and log in using Google account.
- **Create Capsules**: Upload text, images, and videos, and set an unlock date.
- **Share Capsules**: Share capsules with friends or make them public.
- **Dashboard**: View and manage your personal and shared capsules.
- **Countdown Timer**: Track the time remaining until a capsule is unlocked.

---

## Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/AkshatBujethiya/Time-Capsule.git
cd time-capsule
```

### 2. Install Dependencies
Install the required Node.js modules:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
PORT=YOUR_PORT
MONGO_URI=YOUR_MONGO_URI
SESSION_SECRET=YOUR_SESSION_SECRET
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
CLOUDINARY_SECRET=YOUR_CLOUDINARY_SECRET
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
```

Replace the placeholders with your actual values:
- `PORT`: Your preferred port (e.g. 3000, 5000, 8080 etc)
- `MONGO_URI`: Your MongoDB connection string.
- `SESSION_SECRET`: A random string for session encryption.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth2 credentials from the [Google Cloud Console](https://console.cloud.google.com/).
- `CLOUDINARY_SECRET`, `CLOUDINARY_API_KEY` and `CLOUDINARY_CLOUD_NAME`: Cloudinary credentials from [Cloudinary](https://cloudinary.com/).

### 4. Start the Server
Run the application:
```bash
node app.js
```

The server will start on the specified port. Visit `http://localhost:YOUR_PORT` in your browser to access the application.

---

## For KrackHack 2025 submission

Demo Video: [Youtube link](https://youtu.be/C0o4-Lm6rLg)

---

## Usage

### 1. Sign Up/Log In
- Use Google OAuth2 to sign up or log in.

### 2. Create a Capsule
- Click the **Create Capsule** button on the dashboard.
- Fill in the capsule details (name, description, unlock date, and files).
- Choose the visibility (private, shared, or public).

### 3. View Capsules
- **My Capsules**: View your personal capsules.
- **Shared Capsules**: Access shared capsules via the sidebar.

### 4. Share Capsules
- Share capsules with specific friends by entering their email addresses.

### 5. Unlock Capsules
- Once the unlock date is reached, the capsule will be accessible.

---

## Project Structure

```
time-capsule/
├── app.js                # Main application file
├── models/               # MongoDB models (User, Capsule)
├── controllers/          # Route handlers (auth, capsule, friend)
├── routes/               # Express routes
├── views/                # EJS templates
├── public/               # Static files (CSS, JS, images)
├── configs/              # Configuration files (multer, passport)
├── .env                  # Environment variables
├── package.json          # Node.js dependencies and scripts
└── README.md             # Project documentation
```

---

## Dependencies

- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling.
- **Passport**: Authentication middleware.
- **Multer**: File upload handling.
- **EJS**: Templating engine for rendering views.
- **Tailwind CSS**: Utility-first CSS framework.

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request.

---

## Contact

For questions or feedback, feel free to reach out:

- **Email**: akshatbujethia27@gmail.com
- **GitHub**: [AkshatBujethiya](https://github.com/akshatbujethiya)

---

Enjoy building and using your Time Capsule! 🚀
