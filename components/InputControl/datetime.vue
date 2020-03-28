<template>
  <v-datetime-picker
    v-model="datetime"
    date-format="yyyy-mm-dd"
    v-bind:hide-details="inline ? true : false"
    v-bind:hint="inline ? undefined : description"
    v-bind:name="name"
    outlined
    v-bind:required="required"
    v-bind:rules="rules"
    scrollable
    time-format="hh:ss"
    v-bind:value="value"
    v-on:input="handleInput"
  />
</template>

<script>
export default {
  props: {
    description: String,
    inline: Boolean,
    label: String,
    name: String,
    required: Boolean,
    rules: Array,
    value: String,
  },
  data() {
    return {
      modal: false,
      datetime: new Date(),
    };
  },
  methods: {
    handleInput($event) {
      this.$emit("input", $event);
      this.modal = false;
    },
  },
};
</script>
