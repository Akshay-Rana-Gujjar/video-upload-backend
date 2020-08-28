var firebase = require("firebase");

var firebaseConfig = {
    apiKey: "AIzaSyCi99LL-o5tkBkn4-q-8rYtXf0uEtayK4Y",
    authDomain: "video-upload-app-73cb0.firebaseapp.com",
    databaseURL: "https://video-upload-app-73cb0.firebaseio.com",
    projectId: "video-upload-app-73cb0",
    storageBucket: "video-upload-app-73cb0.appspot.com",
    messagingSenderId: "483872441155",
    appId: "1:483872441155:web:1b45bd24764c96968ee5f6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

module.exports = firebase;