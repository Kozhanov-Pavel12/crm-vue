<template>
  <div>
    <div class="page-title">
      <h3>{{ localizeFilter("Menu_Categories") }}</h3>
    </div>
    <section>
      <LoaderView v-if="loading" />
      <div class="row" v-else>
        <CategoryCreateView @created="addNewCategory" />
        <CategoryEditView
          v-if="categories.length"
          :categories="categories"
          :key="categories.length + updateCount"
          @updated="updateCategories"
        />
        <p v-else class="center">Категории отсутствуют!</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreateView from "@/components/CategoryCreateView";
import CategoryEditView from "@/components/CategoryEditView";
import localizeFilter from "@/utils/localizeFilter";
export default {
  name: "categoriesView",
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0,
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
  },
  components: {
    CategoryCreateView,
    CategoryEditView,
  },
  methods: {
    localizeFilter,
    addNewCategory(category) {
      this.categories.push(category);
      console.log(this.categories);
    },
    updateCategories(category) {
      const idx = this.categories.findIndex((c) => c.id === category.id);
      this.categories[idx].title = category.title;
      this.categories[idx].limit = category.limit;
      this.updateCount++;
    },
  },
};
</script>
