<template>
  <div>
    <div class="page-title">
      <h3>{{ localizeFilter("ProfileTitle") }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="v$.name.$model"
          :class="{
            invalid: v$.name.$error,
          }"
        />
        <label for="description">{{ localizeFilter("Name") }}</label>
        <small
          class="helper-text invalid"
          v-for="(error, index) of v$.name.$errors"
          :key="index"
        >
          {{ localizeFilter("Message_EnterName") }}</small
        >
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ localizeFilter("Update") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import localizeFilter from "@/utils/localizeFilter";
import M from "materialize-css";
export default {
  setup: () => ({ v$: useVuelidate() }),
  name: "profile-view",
  data: () => ({
    name: "",
    isRuLocale: true,
  }),
  validations() {
    return {
      name: { required },
    };
  },
  mounted() {
    this.name = this.info.username;
    this.isRuLocale = this.info.locale === "ru-RU";
    setTimeout(() => {
      M.updateTextFields();
    }, 0);
  },
  computed: {
    ...mapGetters(["info"]),
  },
  methods: {
    ...mapActions(["updateInfo"]),
    async submitHandler() {
      if (this.v$.$invalid) {
        this.v$.$touch();
        return;
      }
      try {
        await this.updateInfo({
          username: this.name,
          locale: this.isRuLocale ? "ru-RU" : "en-US",
        });
      } catch (e) {
        console.log(e);
      }
    },
    localizeFilter,
  },
};
</script>

<style>
.switch {
  margin-bottom: 2rem;
}
</style>
