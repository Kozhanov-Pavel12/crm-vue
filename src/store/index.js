import { createStore } from "vuex";
import auth from "./auth";
import info from "./info";
import category from "./category";
import record from "./record";

export default createStore({
  state: {
    error: null,
  },
  getters: {
    error: (s) => s.error,
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state, error) {
      state.error = null;
    },
  },
  actions: {
    async fetchCurrency() {
      const key = process.env.VUE_APP_CURRENCY;
      const res = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${key}&currencies=EUR%2CUSD%2CRUB&base_currency=EUR`
      );
      const responseJson = await res.json();
      const response = {
        base: "EUR",
        date: new Date().toLocaleDateString(),
        rates: responseJson.data,
      };
      return response;
    },
  },
  modules: { auth, info, category, record },
});
