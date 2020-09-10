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
            <section>
              <center>
                <h1>Sign in with Majora</h1>
                <img title="Sign in with Majora" src="/images/majora.png" class="majora">
              </center>
              <v-form>
                <v-btn
                  block
                  color="#eb34c3"
                  class="loginButton"
                  depressed
                  large
                  type="submit"
                  v-on:click="loginToTest"
                >
                  Sign in with Majora test credentials
                </v-btn>
                <v-btn
                  block
                  color="#eeeeee"
                  depressed
                  large
                  type="submit"
                  v-on:click="loginToProduction"
                >
                  Sign in with Majora production credentials
                </v-btn>
                <footer>
                  <strong
                    v-show="mode === 'error'"
                  >
                    Invalid credentials
                  </strong>
                </footer>
              </v-form>
              <v-progress-linear
                v-if="mode === 'sending'"
                indeterminate
              />
              <v-overlay
                absolute
                v-bind:value="mode === 'sending'"
              />
            </section>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  middleware: "auth",
  auth: "guest",
  layout: "login",
  data() {
    return {
      mode: "input",
    };
  },
  computed: {
  },
  methods: {
    loginToTest($event) {
      $event.preventDefault();
      this.mode = "sending";
      this.$auth.loginWith("majoraTest")
        .catch((err) => {
          this.mode = "error";
        });
    },
    loginToProduction($event) {
      $event.preventDefault();
      this.mode = "sending";
      this.$auth.loginWith("majoraProduction")
        .catch((err) => {
          this.mode = "error";
        });
    },
  },
};
</script>

<style scoped>
section {
  position: relative;
  /* min-height: 500px; */
  padding: 48px 40px 0px 40px;
  font-size: 14px;
  line-height: 1.4286;
  border-radius: 8px;
  border: 1px solid #dadce0;
}
.v-form {
  padding: 24px 0 0 0;
}
.v-form footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.v-progress-linear {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.v-btn {
  margin-left: auto;
}

.v-overlay--active >>> .v-overlay__scrim {
  opacity: 0.14 !important;
}
</style>
