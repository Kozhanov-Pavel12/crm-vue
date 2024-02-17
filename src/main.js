import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import messagePlugin from "@/utils/message.plugin";
import "materialize-css/dist/css/materialize.min.css";
import { initializeApp } from "firebase/app";
import tooltipDirective from "./directives/tooltip";
import "firebase/firestore";
import LoaderView from "@/components/app/LoaderView";
import "@firebase/auth";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import store from "./store";

const config = {
  apiKey: "AIzaSyAqbRbOwFdcu4FpV5Nub6URzebN3yfcB3o",
  authDomain: "crm-vue-9d255.firebaseapp.com",
  projectId: "crm-vue-9d255",
  storageBucket: "crm-vue-9d255.appspot.com",
  messagingSenderId: "120450804964",
  appId: "1:120450804964:web:26f2f38aa1ae98c92690f1",
  measurementId: "G-YGGZFLFD12",
  databaseURL:
    "https://crm-vue-9d255-default-rtdb.europe-west1.firebasedatabase.app",
};

const initializeAppSet = initializeApp(config);
const database = getDatabase(initializeAppSet);

let auth = getAuth();
onAuthStateChanged(auth, () => {
  const app = createApp(App);

  app
    .use(messagePlugin)
    .use(store)
    .use(router)
    .directive("tooltip", tooltipDirective)
    .component("LoaderView", LoaderView)
    .mount("#app");
});
