<template>
  <section>
    <h2>
      API Access
    </h2>

    <pre>
  curl \
    --request POST \
    --header "content-type: application/json; charset=UTF-8" \
    --header "access-token: {{ user.apiAccessToken }}" \
    --data 'JSON REQUEST BODY' \
    https://www.cog-uk.io/api/data/create/</pre>

    JSON Document Example:
    <pre>
    {
      {{ sampleJsonDocument }}
    }
    </pre>
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
          .join(",\n    ")
      );
    },
  },
};
</script>

<style scoped>
pre {
  max-width: 920px;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0;
  padding: 16px;
  background: #f9f9fa;
  font-size: 13px;
}
</style>
