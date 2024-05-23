# njbltenant

## Development

To run the app in development mode, use the following command:
1. npm i
2. npm run dev


## Build and Production

To build the app for production, use the following command:
1. npm run build

To run the built app in production mode, use the following command:
1. npm run preview


## Environment Variables

This app uses environment variables which are stored in a `.env` file.


## Asset Chunk Changes

Every time a new build is created, asset chunks will have a hash in their name, causing the browser cache to be automatically cleared when deploying new versions.


## Session Data

Session data is stored using redux-persist(persist:root) with the key 'auth'. In this key you can find session data such as token, refreshToken, expiresIn, etc. The user data is also stored with session data, the key 'userData' includes all personal information of the user including id, email, firstname, lastname, role, users_job, users_level, etc.

