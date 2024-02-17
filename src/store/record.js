import { getDatabase, ref, set, push, child, get } from "firebase/database";
import "firebase/database";
export default {
  actions: {
    async createRecord({ commit, dispatch }, details) {
      const uid = await dispatch("getUid");
      const db = getDatabase();
      try {
        const newRecordKey = push(child(ref(db), "records")).key;
        return await set(
          ref(db, "users/" + uid + "/records/" + newRecordKey),
          details
        );
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchRecords({ commit, dispatch }) {
      const uid = await dispatch("getUid");
      const db = getDatabase();
      let newArray = [];
      try {
        await get(ref(db, "users/" + uid + "/records")).then(
          (info) => {
            const records = info.val() || {};
            Object.keys(records).forEach((key) => {
              newArray.push({
                amount: records[key].amount,
                categoryId: records[key].categoryId,
                date: records[key].date,
                description: records[key].description,
                type: records[key].type,
                id: key,
              });
            });
          },
          {
            onlyOnce: true,
          }
        );
        return newArray;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchRecordById({ commit, dispatch }, id) {
      const uid = await dispatch("getUid");
      const db = getDatabase();
      let currentRecord = {};
      try {
        await get(ref(db, "users/" + uid + "/records/" + id)).then(
          (info) => {
            const record = info.val() || {};
            currentRecord = { ...record, id: id };
          },
          {
            onlyOnce: true,
          }
        );
        return currentRecord;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
};
