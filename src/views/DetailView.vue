<template>
  <div>
    <LoaderView v-if="loading" />

    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a @click.prevent class="breadcrumb">
          {{ record.type === "income" ? "Доход" : "Расход" }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="[record.type === 'income' ? 'green' : 'red']"
          >
            <div class="card-content white-text">
              <p>Описание: {{ record.description }}</p>
              <p>Сумма: {{ currencyFilter(record.amount) }}</p>
              <p>Категория: {{ record.categoryName }}</p>

              <small>{{ new Date(record.date).toLocaleDateString() }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="center" v-else>Такой записи нет!</p>
  </div>
</template>

<script>
import currencyFilter from "@/utils/currencyFilter";
export default {
  name: "detail-view",
  data: () => ({
    record: null,
    loading: true,
  }),
  methods: {
    currencyFilter,
  },
  async mounted() {
    const id = this.$route.params.id;
    const record = await this.$store.dispatch("fetchRecordById", id);
    const category = await this.$store.dispatch(
      "fetchCategoryById",
      record.categoryId
    );
    this.record = {
      ...record,
      categoryName: category.title,
    };
    this.loading = false;
  },
};
</script>
