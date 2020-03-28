<script>
export default {
  async fetch({ redirect, store }) {
    store.commit("setCredentials", {});
    redirect("/signin");
  },
};
</script>
