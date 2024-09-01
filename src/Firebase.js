// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC8yWzvw6gVJrPnzbpVJS5gUCsRsl6PygU",
//   authDomain: "laylamp-95cda.firebaseapp.com",
//   projectId: "laylamp-95cda",
//   storageBucket: "laylamp-95cda.appspot.com",
//   messagingSenderId: "620680552232",
//   appId: "1:620680552232:web:1f3f78852de76fbcd23a1d"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// // Initialize Firebase Messaging
// const messaging = getMessaging(firebaseApp);

// // Function to request FCM token
// export const requestFCMToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//       const token = await getToken(messaging, {
//         vapidKey: 'BMdCOo1TE6zlUDjpdi03kimgbxmexKp-6qcmM4a0d4oFQnfxlEepOA2KP7UEWQfYBrgdsImVR_ccZDU7EQtjQko' // Your public VAPID key
//       });
//       console.log('FCM Token:', token);
//       return token;
//     } else {
//       console.log('Notification permission not granted');
//     }
//   } catch (error) {
//     console.error('Error getting FCM token:', error);
//   }
// };

// // Handle incoming messages
// onMessage(messaging, (payload) => {
//   console.log('Message received:', payload);
// });

// export { messaging };
