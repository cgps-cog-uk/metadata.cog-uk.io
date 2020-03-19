<template>
  <div class="data-grid">
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
          v-for="(row, index) in list"
          v-bind:key="index"
        >
          <td
            v-bind:title="row._error && row._error.message ? row._error.message : row._error"
          >
            <pending-icon
              v-if="row._status === 'Pending'"
              title="Pending"
            />
            <uploading-icon
              v-else-if="row._status === 'Uploading'"
            />
            <done-icon
              v-else-if="row._status === 'Uploaded'"
            />
            <error-icon
              v-else-if="row._status === 'Failed' || row._status === 'Duplicated'"
            />
          </td>
          <td
            v-for="header in data.headers"
            v-bind:key="header"
          >
            <warning-icon
              v-if="row._error && row._error.field === header"
              v-bind:title="row._error.message"
            />
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import ErrorIcon from "~/components/ErrorIcon.vue";
import DoneIcon from "~/components/DoneIcon.vue";
import WarningIcon from "~/components/WarningIcon.vue";
import PendingIcon from "~/components/PendingIcon.vue";
import UploadingIcon from "~/components/UploadingIcon.vue";

export default {
  components: {
    ErrorIcon,
    WarningIcon,
    DoneIcon,
    PendingIcon,
    UploadingIcon,
  },
  computed: {
    ...mapState({
      data: "data",
    }),
    ...mapGetters({
      list: "filteredList",
    }),
  },
};
</script>

<style scoped>
.data-grid {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 12px 18px 2px rgba(34,0,51,.04),0 6px 22px 4px rgba(7,48,114,.12),0 6px 10px -4px rgba(14,13,26,.12);
  padding: 8px;
  border: 0 solid #d7d7db;
}
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
