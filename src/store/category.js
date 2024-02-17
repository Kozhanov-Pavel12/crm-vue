import {
  getDatabase,
  ref,
  set,
  push,
  child,
  update,
  get,
} from "firebase/database";
import "firebase/database";
export default {
  actions: {
    async fetchCategories({ commit, dispatch }) {
      const uid = await dispatch("getUid");
      const db = getDatabase();
      let newArray = [];
      try {
        await get(ref(db, "users/" + uid + "/categories")).then(
          (info) => {
            const categories = info.val() || {};
            Object.keys(categories).forEach((key) => {
              newArray.push({
                title: categories[key].title,
                limit: categories[key].limit,
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
    async fetchCategoryById({ commit, dispatch }, id) {
      const uid = await dispatch("getUid");
      const db = getDatabase();
      let currentCategory = {};
      try {
        await get(ref(db, "users/" + uid + "/categories/" + id)).then(
          (info) => {
            const category = info.val() || {};
            currentCategory = { ...category, id: id };
          },
          {
            onlyOnce: true,
          }
        );
        return currentCategory;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createCategory({ commit, dispatch }, details) {
      const { title, limit } = details;
      const uid = await dispatch("getUid");
      const db = getDatabase();
      try {
        const newPostKey = push(child(ref(db), "categories")).key;
        const category = await set(
          ref(db, "users/" + uid + "/categories/" + newPostKey),
          {
            title,
            limit,
          }
        );
        return {
          title,
          limit,
          id: newPostKey,
        };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateCategory({ commit, dispatch }, details) {
      const { title, limit, id } = details;
      const uid = await dispatch("getUid");
      const db = getDatabase();
      try {
        await update(ref(db, "users/" + uid + "/categories/" + id), {
          title,
          limit,
        });
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
};
