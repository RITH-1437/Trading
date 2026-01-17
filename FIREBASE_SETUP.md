# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `trading-discipline` (or any name you prefer)
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create Project"

## Step 2: Enable Realtime Database

1. In your Firebase project, click on "Realtime Database" in the left menu
2. Click "Create Database"
3. Choose location (choose closest to you)
4. Start in **test mode** (allows read/write for 30 days)
   - Later you can add security rules
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. Click on the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon `</>`
5. Register your app:
   - App nickname: `trading-discipline-web`
   - Don't check "Firebase Hosting"
   - Click "Register app"
6. Copy the `firebaseConfig` object

## Step 4: Update Firebase Configuration

1. Open `src/firebase.ts` in your project
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

## Step 5: Security Rules (Optional but Recommended)

After testing, update your Realtime Database rules:

1. Go to Realtime Database → Rules tab
2. Replace with these rules:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Warning:** These rules allow anyone to read/write. For production, you should add authentication.

## Step 6: Deploy

1. Build and deploy:

   ```bash
   npm run build
   npm run deploy
   ```

2. Share the URL with your friends:
   ```
   https://RITH-1437.github.io/Trading
   ```

## How It Works

- **Real-time sync**: All users see the same data instantly
- **No refresh needed**: Changes appear automatically
- **Shared database**: Everyone with the URL sees the same trades
- **Persistent**: Data survives page refreshes

## Troubleshooting

If you see errors:

1. Make sure you've replaced ALL placeholder values in `firebase.ts`
2. Check that Realtime Database is enabled in Firebase Console
3. Verify the database URL matches exactly (including `-default-rtdb`)
4. Check browser console for specific error messages
