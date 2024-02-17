import { getDatabase, ref, get, child, update } from "firebase/database";
import "firebase/database";
export default {
  state: {
    info: {},
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    clearInfo(state) {
      state.info = {};
    },
  },
  actions: {
    async updateInfo({ dispatch, commit, getters }, toUpdate) {
      const db = getDatabase();
      const uid = await dispatch("getUid");
      const updatedData = { ...getters.info, ...toUpdate };
      try {
        await update(ref(db, "users/" + uid + "/info"), updatedData);
        commit("setInfo", updatedData);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchInfo({ dispatch, commit }) {
      try {
        const db = ref(getDatabase());
        const uid = await dispatch("getUid");
        await get(child(db, "users/" + uid + "/info")).then((info) => {
          if (info.exists) {
            commit("setInfo", info.val());
          }
        });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
  getters: {
    info: (s) => s.info,
  },
};
