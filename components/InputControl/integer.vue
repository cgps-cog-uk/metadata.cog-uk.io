<template>
  <v-text-field
    dense
    v-bind:hide-details="inline ? true : false"
    v-bind:hint="inline ? undefined : description"
    v-bind:label="label"
    v-bind:name="name"
    v-bind:required="required"
    v-bind:rules="rules"
    v-bind:value="value"
    outlined
    persistent-hint
    type="number"
    v-on:input="$emit('input', $event)"
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
    value: null,
  },
};
</script>
