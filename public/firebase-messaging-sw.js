// firebase-messaging-sw.js

// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the firebaseConfig object.
// Replace with your app's Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyC8yWzvw6gVJrPnzbpVJS5gUCsRsl6PygU",
  authDomain: "laylamp-95cda.firebaseapp.com",
  projectId: "laylamp-95cda",
  storageBucket: "laylamp-95cda.appspot.com",
  messagingSenderId: "620680552232",
  appId: "1:620680552232:web:1f3f78852de76fbcd23a1d"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Your icon file
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
