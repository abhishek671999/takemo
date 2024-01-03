importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyAMPOlnoOlFo9-sPZgZprlmsrkUChedl_k",
    authDomain: "takemo-test.firebaseapp.com",
    projectId: "takemo-test",
    storageBucket: "takemo-test.appspot.com",
    messagingSenderId: "550413425066",
    appId: "1:550413425066:web:046165dd34d5a36188b3d3",
    measurementId: "G-TMQ6MYX01P"
});
const messaging = firebase.messaging();
