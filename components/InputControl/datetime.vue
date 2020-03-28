<template>
  <v-datetime-picker
    v-model="datetime"
    date-format="yyyy-mm-dd"
    scrollable
    time-format="hh:ss"
    v-bind:value="value"
    v-bind:text-field-props="textFieldProps"
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
  computed: {
    textFieldProps() {
      return {
        hideDetails: this.inline,
        hint: this.inline ? undefined : this.description,
        name: this.name,
        required: this.required,
        rules: this.rules,
        value: this.value,
        label: this.label,
        outlined: true,
      };
    },
  },
  methods: {
    handleInput($event) {
      this.$emit("input", $event);
      this.modal = false;
    },
  },
};
</script>
