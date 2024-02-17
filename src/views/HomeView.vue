<template>
  <div>
    <div class="page-title">
      <h3>{{ localizeFilter("Menu_Bill") }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <LoaderView v-if="loading" />

    <div v-else class="row">
      <BillView :rates="currency.rates" />
      <CurrencyView :rates="currency.rates" :date="currency.date" />
    </div>
  </div>
</template>

<script>
import BillView from "@/components/BillView.vue";
import CurrencyView from "@/components/CurrencyView.vue";
import localizeFilter from "@/utils/localizeFilter";
// @ is an alias to /src

export default {
  name: "HomeView",
  data: () => ({
    loading: true,
    currency: null,
  }),
  async mounted() {
    this.currency = await this.$store.dispatch("fetchCurrency");
    this.loading = false;
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.currency = await this.$store.dispatch("fetchCurrency");
      this.loading = false;
    },
    localizeFilter,
  },
  components: {
    BillView,
    CurrencyView,
  },
};
</script>
