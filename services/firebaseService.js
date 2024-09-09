const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const admin = require('firebase-admin');
const { BadRequest } = require('http-errors');
const path = require('path');
const Users = require('../models/userModel');

const clientSecretManager = new SecretManagerServiceClient();
const useGoogleCloudSecret = process.env.FIREBASE_USE_GOOGLE_CLOUD_SECRET;
const credentialsFilePathOrSecretName = process.env.FIREBASE_CREDENTIALS_FILE_PATH_OR_SECRET_NAME;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

async function accessGoogleCloudSecret(name, version = 'latest') {
  try {
    const projectId = process.env.GOOGLE_PROJECT_ID;
    if (!projectId) {
      throw new Error('Project ID is not defined');
    }
    const fullName = `projects/${projectId}/secrets/${name}/versions/${version}`;
    console.log("Full name",fullName);
    const [response] = await clientSecretManager.accessSecretVersion({ name: fullName });
    console.log("response: ",response);
    const payload = response.payload?.data?.toString();

    if (payload) {
      return JSON.parse(payload);
    }

    return payload;
  } catch (error) {
    console.error('Error accessing Google Cloud Secret Manager:', error);
    throw new BadRequest('Could not access Google Cloud Secret Manager.');
  }
}

async function initializeFirebaseAdmin() {
    if (!admin.apps.length) {
      try {
        let cert;
  
        if (useGoogleCloudSecret) {
          console.log('Fetching credentials from Google Cloud Secret Manager...');
          cert = await accessGoogleCloudSecret(credentialsFilePathOrSecretName);
          console.log('Fetched credentials:', cert);
        } else {
          console.log('Loading credentials from file...');
          const credentialsPath = path.resolve(__dirname, credentialsFilePathOrSecretName);
          console.log('Credentials file path:', credentialsPath);
          cert = require(credentialsPath);
          console.log('Loaded credentials:', cert);
        }
  
        if (cert) {
          admin.initializeApp({
            credential: admin.credential.cert(cert),
            databaseURL: databaseURL,
          });
          console.log('Firebase Admin initialized successfully.');
        } else {
          throw new Error('Credentials not provided.');
        }
      } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        throw new BadRequest('Could not initialize Firebase Admin.');
      }
    } else {
      console.log('Firebase Admin already initialized.');
    }
  }
  

async function getCustomToken(email) {
  await initializeFirebaseAdmin();
  console.log("in get function");
  const user = await Users.findOne({ where: { email: email } });
  if (!user) throw new BadRequest('User not found.');

  try {
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUser(user.id.toString());
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        firebaseUser = await admin.auth().createUser({
          uid: user.id.toString(),
          email: user.email,
        });
      } else {
        console.error('Error finding Firebase user:', error);
        throw new BadRequest('Error finding/creating Firebase user.');
      }
    }

    return await admin.auth().createCustomToken(firebaseUser.uid.toString());
  } catch (error) {
    console.error('Error generating Firebase token:', error);
    throw new BadRequest('Error generating Firebase token.');
  }
}

async function updateNotification(userId, notificationObj) {
  await initializeFirebaseAdmin();

  const database = admin.database();
  await database.ref(`status/${userId}/notification`).set({
    ...notificationObj,
    notification_lastchanged: admin.database.ServerValue.TIMESTAMP,
  });
}

async function updateNotificationManually(userId, notificationObj, notificationUrl) {
  await initializeFirebaseAdmin();

  const database = admin.database();
  await database.ref(notificationUrl).set({
    ...notificationObj,
    notification_lastchanged: admin.database.ServerValue.TIMESTAMP,
  });
}

module.exports = {
  initializeFirebaseAdmin,
  getCustomToken,
  updateNotification,
  updateNotificationManually,
};
