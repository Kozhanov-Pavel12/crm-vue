<template>
  <div>
    <div class="page-title">
      <h3>{{ localizeFilter("Record_History") }}</h3>
    </div>

    <div class="history-chart">
      <Pie ref="pie" :data="chartData" :options="chartOptions" />
    </div>

    <LoaderView v-if="loading" />

    <p class="center" v-else-if="!records.length">
      Записи отсутствуют!
      <router-link to="/record">Добавьте запись</router-link>
    </p>

    <section v-else>
      <HistoryTableView :records="items" />
      <paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="localizeFilter('Prev')"
        :next-text="localizeFilter('Next')"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import HistoryTableView from "@/components/HistoryTableView.vue";
import paginationMixin from "@/mixins/paginationMixin";
import Paginate from "vuejs-paginate-next";
import { Pie } from "vue-chartjs";
import localizeFilter from "@/utils/localizeFilter";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "history-view",
  data: () => ({
    loading: true,
    records: [],
    categories: [],
  }),
  mixins: [paginationMixin],
  components: {
    Pie,
    HistoryTableView,
    paginate: Paginate,
  },
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");
    this.categories = categories;
    this.setup(categories);
    this.loading = false;
  },
  computed: {
    chartData() {
      return {
        labels: this.categories.map((category) => category.title),
        datasets: [
          {
            label: "Расходы по категориям",
            data: this.categories.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === "outcome") {
                  total += r.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: [
              "#41B883",
              "#FF9500",
              "#E46651",
              "#00CC00",
              "#1049A9",
              "#AEF100",
              "#00CF75",
              "#FF0000",
              "#E9003A",
              "#BD008E",
              "#04869F",
              "#FFF400",
            ],
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
      };
    },
  },
  methods: {
    localizeFilter,
    setup(categories) {
      this.setupPagination(
        this.records.map((record) => {
          return {
            ...record,
            categoryName: categories.find((c) => c.id === record.categoryId)
              .title,
            typeClass: record.type === "income" ? "green" : "red",
            typeText: record.type === "income" ? "Доход" : "Расход",
          };
        })
      );
    },
  },
};
</script>
