<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ localizeFilter("Create") }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
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
          {{ localizeFilter("Create") }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import localizeFilter from "@/utils/localizeFilter";
import M from "materialize-css";
export default {
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    title: "",
    limit: 100,
  }),
  mounted() {
    M.updateTextFields();
  },
  methods: {
    localizeFilter,
    async submitHandler() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }
      const formData = {
        title: this.title,
        limit: this.limit,
      };
      try {
        const category = await this.$store.dispatch("createCategory", formData);
        this.title = "";
        this.limit = 100;
        this.v$.$reset();
        this.$message("Категория была создана");
        this.$emit("created", category);
      } catch (e) {
        console.log(e);
      }
    },
  },
  validations() {
    return {
      title: { required },
      limit: { minValue: minValue(100) },
    };
  },
};
</script>
