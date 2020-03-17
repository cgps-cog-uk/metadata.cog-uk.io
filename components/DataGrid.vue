<template>
  <section>
    <table>
      <thead>
        <tr>
          <th>
            Status
          </th>
          <th
            v-for="header in data.headers"
            v-bind:key="header"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data.entries"
          v-bind:key="index"
        >
          <td
            v-bind:title="row._error"
          >
            {{ row._status }}
          </td>
          <td
            v-for="header in data.headers"
            v-bind:key="header"
          >
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      data: "data",
    }),
  },
};
</script>

<style scoped>
section {
  overflow: auto;
}
table {
  width: 100%;
}
th {
  background-color: #f9f9fa;
  padding: 8px 0;
}
td {
  padding: 4px 0;
}
</style>
