<template>
  <div>
    <div class="page-title">
      <h3>{{ localizeFilter("Menu_Planning") }}</h3>
      <h4>{{ currencyFilter(info.bill) }}</h4>
    </div>

    <LoaderView v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ localizeFilter("No_Categiry") }}
      <router-link to="/categories">{{
        localizeFilter("Add_Category")
      }}</router-link>
    </p>

    <section v-else>
      <div v-for="cat of categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ currencyFilter(cat.spend) }} из {{ currencyFilter(cat.limit) }}
        </p>
        <div class="progress" v-tooltip="cat.tooltipContent">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{ width: cat.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import localizeFilter from "@/utils/localizeFilter";
import currencyFilter from "@/utils/currencyFilter";
export default {
  name: "planing-view",
  data: () => ({
    loading: true,
    categories: [],
  }),
  computed: {
    ...mapGetters(["info"]),
  },
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.categories = categories.map((category) => {
      const spend = records
        .filter((r) => r.categoryId === category.id)
        .filter((r) => r.type === "outcome")
        .reduce((total, record) => {
          return (total += +record.amount);
        }, 0);

      const percent = (100 * spend) / category.limit;

      const progressPercent = percent > 100 ? 100 : percent;

      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

      const tooltipValue = category.limit - spend;
      const tooltipContent = `${
        tooltipValue < 0
          ? localizeFilter("Remains")
          : localizeFilter("Exceeding")
      } ${currencyFilter(Math.abs(tooltipValue))}`;

      return {
        ...category,
        progressPercent,
        progressColor,
        spend,
        tooltipContent,
      };
    });
    this.loading = false;
  },
  methods: {
    currencyFilter,
    localizeFilter,
  },
};
</script>
