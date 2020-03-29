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
      show-expand
      single-expand
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
          {{ group.toUpperCase() }}: {{ items.length }} {{ items.length === 1 ? "row" : "rows" }}
        </td>
      </template>
      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
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
        <v-icon
          v-else-if="item.Status === 'Failed'"
          class="v-data-table__expand-icon"
          v-bind:class="{ 'v-data-table__expand-icon--active': isExpanded }"
          v-bind:title="`${item._error}. Click to see details.`"
          v-on:click="expand(!isExpanded)"
        >
          {{ isExpanded ? "mdi-alert-circle" : "mdi-alert-circle-outline" }}
        </v-icon>
      </template>
      <!--
      <template v-slot:item="{ item, headers, isExpanded, expand }">
        <tr
          v-bind:class="{ expanded: isExpanded, expandable: (item.Status === 'Failed') }"
          v-on:click="(item.Status === 'Failed') ? expand(!isExpanded) : undefined"
        >
          <td
            v-for="header in headers"
            v-bind:key="header.name"
            class="text-start"
          >
            <template v-if="header.value === 'data-table-expand'">
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
              <v-icon
                v-else-if="item.Status === 'Failed'"
                class="v-data-table__expand-icon"
                v-bind:class="{ 'v-data-table__expand-icon--active': isExpanded }"
                title="Failed, click to see details."
              >
                {{ isExpanded ? "mdi-alert-circle" : "mdi-alert-circle-outline" }}
              </v-icon>
            </template>
            <template v-else>
              <warning-icon
                v-if="item._messages && item._messages[header.value]"
                v-bind:title="item._messages[header.value].map((x) => x.message).join('. ')"
              />
              {{ item[header.value] }}
            </template>
          </td>
        </tr>
      </template>
      -->
      <!--
      <template v-slot:expanded-item="{ headers, item }">
        <tr class="expanded-content">
          <td v-bind:colspan="headers.length">
            {{ item._error }}
          </td>
        </tr>
      </template>
      -->
      <template v-slot:expanded-item="{ headers, item }">
        <td
          v-for="header in headers"
          v-bind:key="header.name"
          class="text-start"
        >
          <warning-icon
            v-if="item._messages && item._messages[header.value]"
            v-bind:title="item._messages[header.value].map((x) => x.message).join('. ')"
          />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import DoneIcon from "~/components/DoneIcon.vue";
import WarningIcon from "~/components/WarningIcon.vue";
import PendingIcon from "~/components/PendingIcon.vue";
import UploadingIcon from "~/components/UploadingIcon.vue";

export default {
  components: {
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

.v-data-table >>> td {
  border: 1px solid transparent !important;
}

tr.expanded,
tr.expanded-content,
.v-data-table >>> .v-data-table__expanded {
  background: #eeeeee;
}
.v-data-table >>> .v-data-table__expanded__content {
  box-shadow: none;
}
.v-data-table >>> .v-data-table__expanded__content td {
  box-shadow: none;
  border-bottom: 16px solid #fff !important;
}
tr.expandable td {
  cursor: pointer;
}
.v-data-table >>> .v-data-table__expanded__row td,
tr.expanded td {
  border-bottom-color: transparent !important;
}
</style>
