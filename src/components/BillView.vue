<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">{{ localizeFilter("Currency_Account") }}</span>

        <p v-for="cur of currencies" :key="cur" class="currency-line">
          <span>{{ currencyFilter(getCurrency(cur), cur) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import currencyFilter from "@/utils/currencyFilter";
import localizeFilter from "@/utils/localizeFilter";
export default {
  props: ["rates"],
  data: () => ({
    currencies: ["RUB", "USD", "EUR"],
  }),
  computed: {
    base() {
      return (
        this.$store.getters.info.bill / (this.rates["RUB"] / this.rates["EUR"])
      );
    },
  },
  methods: {
    getCurrency(currency) {
      return Math.floor(this.base * this.rates[currency]);
    },
    currencyFilter,
    localizeFilter,
  },
};
</script>
