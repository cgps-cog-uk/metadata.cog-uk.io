<template>
  <section>
    <div
      v-if="wasAdded"
    >
      <v-alert type="success">
        Entry was added successfully.
      </v-alert>
      <v-btn
        color="primary"
        v-on:click="resetForm"
      >
        Add another entry
      </v-btn>
      <v-btn
        to="/"
        text
      >
        Go back
      </v-btn>
    </div>

    <v-form
      v-else
      v-model="isFormValid"
    >
      <h2>
        Add New Entry
      </h2>
      <v-alert
        v-if="!!error"
        type="error"
      >
        {{ error.message || error }}
      </v-alert>
      <v-expansion-panels
        v-model="sections"
        multiple
        accordion
      >
        <v-expansion-panel>
          <v-expansion-panel-header>Samples</v-expansion-panel-header>
          <v-expansion-panel-content>
            <input-control
              v-for="(arg, index) in formInputs"
              v-if="arg.section === 'samples'"
              v-bind:key="index"
              v-model="formValues[arg.name]"
              v-bind:description="arg.description"
              v-bind:enum-values="arg.enum"
              v-bind:label="arg.name"
              v-bind:name="arg.name"
              v-bind:required="arg.required"
              v-bind:type="arg.type"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>Library</v-expansion-panel-header>
          <v-expansion-panel-content v-if="sections.includes(1)">
            <input-control
              v-for="(arg, index) in formInputs"
              v-if="arg.section === 'library'"
              v-bind:key="index"
              v-model="formValues[arg.name]"
              v-bind:description="arg.description"
              v-bind:enum-values="arg.enum"
              v-bind:label="arg.name"
              v-bind:name="arg.name"
              v-bind:required="arg.required"
              v-bind:type="arg.type"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>Sequencing</v-expansion-panel-header>
          <v-expansion-panel-content v-if="sections.includes(2)">
            <input-control
              v-for="(arg, index) in formInputs"
              v-if="arg.section === 'sequencing'"
              v-bind:key="index"
              v-model="formValues[arg.name]"
              v-bind:description="arg.description"
              v-bind:enum-values="arg.enum"
              v-bind:label="arg.name"
              v-bind:name="arg.name"
              v-bind:required="arg.required"
              v-bind:type="arg.type"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-btn
        v-bind:disabled="!isFormValid"
        color="primary"
        v-on:click="submitForm"
      >
        ADD
      </v-btn>
      <v-btn
        to="/"
        text
      >
        Go back
      </v-btn>
    </v-form>
  </section>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import InputControl from "~/components/InputControl/index.vue";

export default {
  middleware: "auth",
  components: {
    InputControl,
  },
  data() {
    return {
      formValues: {},
      isFormValid: false,
      wasAdded: false,
      error: null,
      sections: [0],
    };
  },
  computed: {
    ...mapState({
      user: "user",
    }),
    ...mapGetters({
      formInputs: "formInputs",
    }),
  },
  methods: {
    submitForm() {
      const request = {
        biosamples: [ this.formValues ],
      };
      this.$axios.$post("/api/data/submit/", request)
        .then(() => {
          this.wasAdded = true;
        })
        .catch((err) => {
          console.log(err);
          this.error = err.response.data.error;
        });
    },
    resetForm() {
      this.formValues = {};
      this.isFormValid = false;
      this.wasAdded = false;
    },
  },
};
</script>

<style scoped>
section {
  width: 100%;
}
.v-expansion-panels {
  margin: 16px 0;
}
@media (min-width:768px) {
  section {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
