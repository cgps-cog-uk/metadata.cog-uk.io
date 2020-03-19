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
                  {{ error }}.
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
section {
  margin: 24px;
  background-color: #fff;
  box-shadow: 0 12px 18px 2px rgba(34,0,51,.04),0 6px 22px 4px rgba(7,48,114,.12),0 6px 10px -4px rgba(14,13,26,.12);
  padding: 32px;
  flex-direction: row;
  display: flex;
  border-radius: 16px;
  width: 100%;
  /* overflow: hidden; */
  /* min-height: 100%; */
  /* height: 100%; */
  border: 0 solid #d7d7db;
  /* min-height: 32rem; */
  /* max-height: 38rem; */
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
