<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ localizeFilter("Edit") }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
          <label>{{ localizeFilter("Select_Category") }}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="v$.title.$model"
            :class="{
              invalid: v$.title.$error,
            }"
          />
          <label for="name">{{ localizeFilter("Title") }}</label>
          <span
            class="helper-text invalid"
            v-for="(error, index) of v$.title.$errors"
            :key="index"
            >{{ localizeFilter("Enter_Title") }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="v$.limit.$model"
            :class="{
              invalid: v$.limit.$error,
            }"
          />
          <label for="limit">{{ localizeFilter("Limit") }}</label>
          <span
            class="helper-text invalid"
            v-for="(error, index) of v$.limit.$errors"
            :key="index"
            >{{ localizeFilter("Minimum_Value") }} 100</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ localizeFilter("Update") }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import localizeFilter from "@/utils/localizeFilter";
export default {
  setup: () => ({ v$: useVuelidate() }),
  props: ["categories"],
  data: () => ({
    select: null,
    title: "",
    limit: 100,
    current: null,
  }),
  validations() {
    return {
      title: { required },
      limit: { minValue: minValue(100) },
    };
  },
  watch: {
    current(catId) {
      const { title, limit } = this.categories.find((c) => c.id === catId);
      this.title = title;
      this.limit = limit;
    },
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select);
    M.updateTextFields();
  },
  beforeUnmount() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  methods: {
    localizeFilter,
    async submitHandler() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }
      const formData = {
        id: this.current,
        title: this.title,
        limit: this.limit,
      };
      try {
        await this.$store.dispatch("updateCategory", formData);
        this.$message("Категория была обновлена");
        this.$emit("updated", formData);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
