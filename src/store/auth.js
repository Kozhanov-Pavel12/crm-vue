import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "firebase/database";
export default {
  actions: {
    async login({ dispatch, commit }, details) {
      const { email, password } = details;
      try {
        await signInWithEmailAndPassword(getAuth(), email, password);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async logout({ commit }) {
      const auth = getAuth();
      await signOut(auth);
      commit("clearInfo");
    },
    getUid() {
      const user = getAuth().currentUser;
      return user ? user.uid : null;
    },
    async register({ dispatch, commit }, details) {
      const { email, password, name } = details;
      const db = getDatabase();
      try {
        await createUserWithEmailAndPassword(getAuth(), email, password, name);
        const uid = await dispatch("getUid");
        await set(ref(db, "users/" + uid + "/info"), {
          bill: 1000,
          username: name,
          locale: "ru-RU",
        });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
};
