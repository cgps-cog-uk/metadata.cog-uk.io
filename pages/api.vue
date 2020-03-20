<template>
  <section>
    <h2>
      API Access
    </h2>

    <pre>
  curl \
    --request POST \
    --header "Content-type: application/json; charset=UTF-8" \
    --header "access-token: {{ user.apiAccessToken }}" \
    --data '{ {{ sampleJsonDocument }} }' \
    https://www.cog-uk.io/api/data/create/</pre>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  middleware: "authenticated",
  components: {
  },
  computed: {
    ...mapState({
      user: "user",
      formManifest: "formManifest",
    }),
    sampleJsonDocument() {
      return (
        this.formManifest
          .map((x) => `"${x.question.toLowerCase()}": ""`)
          .join(", ")
      );
    },
  },
};
</script>

<style scoped>
section > div {
  display: flex;
  flex-direction: column;
}
pre {
  max-width: 920px;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 32px 0;
  padding: 16px;
  background: #f9f9fa;
}
</style>
