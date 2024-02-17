<template>
  <div>
    <div class="page-title">
      <h3>{{ localizeFilter("Menu_NewRecord") }}</h3>
    </div>

    <LoaderView v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ localizeFilter("No_Categiry") }}
      <router-link to="/categories">{{
        localizeFilter("Add_Category")
      }}</router-link>
    </p>

    <form @submit.prevent="submitHandler" class="form" v-else>
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c of categories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>{{ localizeFilter("Select_Category") }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ localizeFilter("Income") }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ localizeFilter("Expenditure") }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="v$.amount.$model"
          :class="{
            invalid: v$.amount.$error,
          }"
        />
        <label for="amount">{{ localizeFilter("Total") }}</label>
        <span
          class="helper-text invalid"
          v-for="(error, index) of v$.amount.$errors"
          :key="index"
          >Минимальная величина: 1</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="v$.description.$model"
          :class="{
            invalid: v$.description.$error,
          }"
        />
        <label for="description">{{ localizeFilter("Description") }}</label>
        <span
          class="helper-text invalid"
          v-for="(error, index) of v$.description.$errors"
          :key="index"
          >{{ localizeFilter("Enter_Description") }}</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ localizeFilter("Create") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import M from "materialize-css";
import { useVuelidate } from "@vuelidate/core";
import localizeFilter from "@/utils/localizeFilter";
import { required, minValue } from "@vuelidate/validators";
import { mapGetters } from "vuex";
export default {
  name: "record-view",
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    categories: [],
    loading: true,
    select: null,
    category: null,
    type: "outcome",
    amount: 1,
    description: "",
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories.length) {
      this.category = this.categories[0].id;
    }

    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select);
      M.updateTextFields();
    }, 0);
  },
  beforeUnmount() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.amount;
    },
  },
  methods: {
    localizeFilter,
    async submitHandler() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }

      if (this.canCreateRecord) {
        const formData = {
          categoryId: this.category,
          amount: this.amount,
          description: this.description,
          type: this.type,
          date: new Date().toJSON(),
        };
        try {
          await this.$store.dispatch("createRecord", formData);

          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch("updateInfo", { bill });

          this.amount = 1;
          this.description = "";
          this.v$.$reset();
          this.$message("Запись была добавлена");
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$message(
          `На счете недостаточно средств. (${this.amount - this.info.bill})`
        );
      }
    },
  },
  validations() {
    return {
      amount: { minValue: minValue(1) },
      description: { required },
    };
  },
};
</script>
