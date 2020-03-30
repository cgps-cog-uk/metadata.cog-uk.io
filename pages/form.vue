<template>
  <section>
    <div
      v-if="wasAdded"
    >
      <v-alert type="success">
        Biosample was submitted successfully.
      </v-alert>
      <v-btn
        color="primary"
        v-on:click="resetForm"
      >
        Submit another Biosample
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
        Submit Biosample
      </h2>
      <v-alert
        v-if="!!error"
        type="error"
      >
        {{ error.message || error }}
      </v-alert>
      <v-expansion-panels
        v-model="expandedSections"
        multiple
        accordion
      >
        <v-expansion-panel>
          <v-expansion-panel-header>Samples</v-expansion-panel-header>
          <v-expansion-panel-content>
            <input-control
              v-for="(arg, index) in biosampleSectionInputs"
              v-bind:key="arg.name"
              v-model="formValues[arg.name]"
              v-bind:description="arg.description"
              v-bind:error-messages="messages[arg.name]"
              v-bind:enum-values="arg.enum"
              v-bind:label="arg.label"
              v-bind:name="arg.name"
              v-bind:required="arg.required"
              v-bind:type="arg.type"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>Library</v-expansion-panel-header>
          <v-expansion-panel-content>
            <input-control
              v-for="(arg, index) in librarySectionInputs"
              v-bind:key="arg.name"
              v-model="formValues[arg.name]"
              v-bind:description="arg.description"
              v-bind:enum-values="arg.enum"
              v-bind:label="arg.label"
              v-bind:name="arg.name"
              v-bind:required="expandedSections.includes(librarySectionIndex) && arg.required"
              v-bind:type="arg.type"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>Sequencing</v-expansion-panel-header>
          <v-expansion-panel-content>
            <input-control
              v-for="(arg, index) in sequencingSectionInputs"
              v-bind:key="arg.name"
              v-model="formValues[arg.name]"
              v-bind:description="arg.description"
              v-bind:enum-values="arg.enum"
              v-bind:label="arg.label"
              v-bind:name="arg.name"
              v-bind:required="expandedSections.includes(sequencingIndex) && arg.required"
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
        SUBMIT
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
import { mapGetters } from "vuex";

import InputControl from "~/components/InputControl/index.vue";

export default {
  middleware: "auth",
  components: {
    InputControl,
  },
  data() {
    return {
      error: null,
      expandedSections: [ 0 ],
      formValues: {},
      isFormValid: false,
      librarySectionIndex: 1,
      messages: {},
      sequencingIndex: 2,
      wasAdded: false,
    };
  },
  computed: {
    ...mapGetters({
      formInputs: "formInputs",
    }),
    biosampleSectionInputs() {
      return this.formInputs.filter((x) => x.section === "biosample");
    },
    librarySectionInputs() {
      return this.formInputs.filter((x) => x.section === "library");
    },
    sequencingSectionInputs() {
      return this.formInputs.filter((x) => x.section === "sequencing");
    },
  },
  methods: {
    submitForm() {
      this.$axios.$post("/api/data/submit/", this.formValues)
        .then((results) => {
          this.wasAdded = results.ok;
          for (const key of Object.keys(results.messages)) {
            this.messages[key] = results.messages[key].map((x) => x.message).join(". ");
          }
          if (!results.ok) {
            this.error = `Errors in the following fields: ${Object.keys(results.messages).join(", ")}`;
          }
        })
        .catch((err) => {
          console.error(err);
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
.v-form >>> .v-input {
  margin-bottom: 16px;
}
@media (min-width:768px) {
  section {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
