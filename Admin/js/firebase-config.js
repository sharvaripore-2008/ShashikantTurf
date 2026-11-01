/**
 * Shashikant Turf - Firebase Integration Module
 * Provides Cloud Firestore Database, Firebase Authentication,
 * and Cloud Hosting synchronization.
 */

// Your web app's Firebase configuration
// Replace these values with your Firebase Project Configuration from Firebase Console:
// https://console.firebase.google.com/ -> Project Settings -> General -> Your apps -> Web app (</>)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "shashikant-turf.firebaseapp.com",
  projectId: "shashikant-turf",
  storageBucket: "shashikant-turf.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Check if user has replaced placeholder credentials
const isFirebaseConfigured = () => {
  return firebaseConfig && 
         firebaseConfig.apiKey && 
         firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};

let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;

// Initialize Firebase SDK if available
if (typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    firebaseAuth = firebase.auth();
    firestoreDb = firebase.firestore();
    console.log("🔥 Firebase SDK initialized successfully!");
  } catch (err) {
    console.warn("Firebase initialization note:", err.message);
  }
}

const FirebaseService = {
  config: firebaseConfig,

  isReady() {
    return isFirebaseConfigured() && firestoreDb !== null;
  },

  getDb() {
    return firestoreDb;
  },

  getAuth() {
    return firebaseAuth;
  },

  // ================= CLOUD FIRESTORE BOOKINGS =================
  async saveBooking(bookingData) {
    if (!this.isReady()) {
      console.log("Firebase not configured with active API key, skipping cloud Firestore sync.");
      return null;
    }
    try {
      const docRef = firestoreDb.collection("bookings").doc(bookingData.id || ("BK-" + Date.now()));
      const payload = {
        ...bookingData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await docRef.set(payload, { merge: true });
      console.log("✅ Booking synced to Firebase Firestore:", bookingData.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Firebase Firestore saveBooking error:", error);
      return null;
    }
  },

  async getBookings() {
    if (!this.isReady()) return [];
    try {
      const snapshot = await firestoreDb.collection("bookings").orderBy("createdAt", "desc").get();
      const bookings = [];
      snapshot.forEach(doc => bookings.push(doc.data()));
      return bookings;
    } catch (error) {
      console.error("Firebase Firestore getBookings error:", error);
      return [];
    }
  },

  async cancelBooking(bookingId) {
    if (!this.isReady()) return null;
    try {
      const docRef = firestoreDb.collection("bookings").doc(bookingId);
      await docRef.update({
        status: "Cancelled",
        cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      // Also log to cancellations collection
      await firestoreDb.collection("cancellations").add({
        bookingId: bookingId,
        cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
        reason: "Customer cancelled via website"
      });
      console.log("✅ Booking cancelled in Firebase Firestore:", bookingId);
      return { success: true };
    } catch (error) {
      console.error("Firebase Firestore cancelBooking error:", error);
      return null;
    }
  },

  // ================= FIREBASE AUTHENTICATION =================
  async registerUser(email, password, displayName) {
    if (!this.isReady() || !firebaseAuth) return null;
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (displayName) {
        await user.updateProfile({ displayName: displayName });
      }
      // Save profile in Firestore users collection
      await firestoreDb.collection("users").doc(user.uid).set({
        uid: user.uid,
        name: displayName || email.split('@')[0],
        email: email,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return user;
    } catch (error) {
      console.error("Firebase Auth registration error:", error);
      throw error;
    }
  },

  async loginUser(email, password) {
    if (!this.isReady() || !firebaseAuth) return null;
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Log login activity to Firestore
      try {
        await firestoreDb.collection("login_logs").add({
          email: email,
          userId: user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          ip: "Client Browser",
          device: navigator.userAgent
        });
      } catch (e) {
        // silent
      }
      
      return user;
    } catch (error) {
      console.error("Firebase Auth login error:", error);
      throw error;
    }
  },

  async logoutUser() {
    if (firebaseAuth) {
      try {
        await firebaseAuth.signOut();
      } catch (e) {
        console.warn("Firebase signout error:", e);
      }
    }
  }
};

// Export to window
if (typeof window !== 'undefined') {
  window.FirebaseService = FirebaseService;
  window.firebaseConfig = firebaseConfig;
}
