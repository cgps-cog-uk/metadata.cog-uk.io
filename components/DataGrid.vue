<template>
  <div class="data-grid">
    <v-data-table
      v-model="selected"
      dense
      disable-pagination
      group-by="Status"
      v-bind:headers="headers"
      hide-default-footer
      item-key="_id"
      v-bind:items="list"
      v:bind-show-select="false"
    >
      <template v-slot:group.header="{ group, groupBy, items, headers, isOpen, toggle, remove }">
        <td
          class="group-header text-start"
          v-bind:colspan="headers.length"
        >
          <v-btn
            class="ma-0"
            small
            icon
            v-on:click="toggle"
          >
            <v-icon>
              {{ isOpen ? "mdi-minus" : "mdi-plus" }}
            </v-icon>
          </v-btn>
          {{ group }}: {{ items.length }} {{ items.length === 1 ? "row" : "rows" }}
        </td>
      </template>
      <template v-slot:item._icon="{ item }">
        <pending-icon
          v-if="item.Status === 'Pending'"
          title="Pending"
        />
        <uploading-icon
          v-else-if="item.Status === 'Uploading'"
        />
        <done-icon
          v-else-if="item.Status === 'Uploaded'"
        />
        <error-icon
          v-else-if="item.Status === 'Failed'"
          v-bind:title="item._error"
        />
      </template>
    </v-data-table>
    <!-- <table>
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
          <td>
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
              v-else-if="row._status === 'Failed'"
              v-bind:title="row._error"
            />
          </td>
          <td
            v-for="header in data.headers"
            v-bind:key="header"
          >
            <warning-icon
              v-if="row._messages && row._messages[header]"
              v-bind:title="row._messages[header].map((x) => x.message).join('. ')"
            />
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table> -->
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
  data() {
    return {
      selected: [],
    };
  },
  computed: {
    ...mapState({
      data: "data",
    }),
    ...mapGetters({
      list: "filteredList",
      headers: "dataGridHeaders",
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
  overflow: auto;
}
section {
  overflow: auto;
}
.v-data-table >>> th {
  position: relative;
}
.v-data-table >>> .v-data-table-header__icon {
  position: absolute;
  right: 0;
  top: calc(50% - 10px);
}
.group-header {
  padding-left: 2px;
}
</style>
