import { initializeApp } from "firebase/app";

// NOTE: The following values are placeholders.
// For React Native Firebase (Native SDK), the configuration is primarily
// loaded from `android/app/google-services.json` and `ios/GoogleService-Info.plist`.
const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain:
"your-project.firebaseapp.com",

projectId:
"your-project-id",

storageBucket:
"your-project.appspot.com",

messagingSenderId:
"YOUR_ID",

appId:
"YOUR_APP_ID"

};


export const app = initializeApp(firebaseConfig);