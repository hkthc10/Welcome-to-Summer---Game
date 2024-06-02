// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDn6O28WR36fqshXNPCXr-iflmk9GVvQoI",
  authDomain: "mindx-jsi-ab5fb.firebaseapp.com",
  databaseURL: "https://mindx-jsi-ab5fb-default-rtdb.firebaseio.com",
  projectId: "mindx-jsi-ab5fb",
  storageBucket: "mindx-jsi-ab5fb.appspot.com",
  messagingSenderId: "190653651532",
  appId: "1:190653651532:web:bb172bd475346d579ef2e9",
  measurementId: "G-1TJ2H1XN26"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();