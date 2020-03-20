<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login to COG-UK</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="email"
                    type="email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-email"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  v-bind:disabled="!email"
                  color="primary"
                  v-on:click="login"
                >
                  Login
                </v-btn>
              </v-card-actions>
              <v-overlay
                absolute
                v-bind:value="mode !== 'input'"
              >
                <v-progress-circular
                  v-if="mode === 'sending'"
                  indeterminate
                  color="primary"
                />
                <p
                  v-else-if="mode === 'sent'"
                  style="padding-top: 80px"
                >
                  Login link has been sent to <strong>{{ email }}</strong>
                </p>
                <p
                  v-else
                >
                  <br>
                  {{ message }}.
                </p>
              </v-overlay>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  layout: "login",
  data() {
    return {
      email: "",
      mode: "input",
      message: "",
    };
  },
  methods: {
    login() {
      this.mode = "sending";
      this.$axios.$post("/auth/passwordless/", { user: this.email })
        .then(() => {
          this.mode = "sent";
        })
        .catch((err) => {
          this.mode = "error";
          this.message = err;
        });
    },
  },
};
</script>

<style scoped>
.v-card {
  position: relative;
}
input {
  border: 1px solid #d7d7db;
  padding-left: .5rem;
  padding-right: .5rem;
  padding-top: .25rem;
  padding-bottom: .25rem;
  height: 3rem;
  border-radius: .5rem;
}
button {
  background-color:#0060df;
  color:#fff;
  cursor: pointer;
  padding: 16px 24px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 16px;
  border: 1px solid #d7d7db;
}
</style>
