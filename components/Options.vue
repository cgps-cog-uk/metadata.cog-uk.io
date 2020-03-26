<template>
  <p class="options">
    <input
      id="interations"
      v-model="username"
      type="text"
      placeholder="Username"
    >
    <input
      id="interations"
      v-model="token"
      type="text"
      placeholder="Token"
    >
  </p>
</template>

<script>
export default {
  computed: {
    username: {
      get() {
        return this.$store.state.options.username;
      },
      set(username) {
        this.$store.commit("setOptions", { username });
      },
    },
    token: {
      get() {
        return this.$store.state.options.token;
      },
      set(token) {
        this.$store.commit("setOptions", { token });
      },
    },
  },
};
</script>

<style scoped>
.columns {
  display: flex;
  flex-direction: column;
}

.upload-files {
  width: 100%;
  padding: 64px 24px;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  border-width: 2px;
  border-style: dashed;
  border-radius: .25rem;
  border-color: rgba(21,20,26,.2);
}

svg {
  color: #0060df;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

input[type="file"] {
  width: 0;
  position: absolute;
  overflow: hidden;
  opacity: 0;
  height: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

input[type="text"] {
  padding: 4px 8px;
  margin: 4px 0;
  line-height: 1.5;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #d7d7db;
}
input[type="text"]:focus {
  border-color:#0060df;
}


.label-1 {
  font-weight: 700;
  padding-bottom: 8px;
  padding-top: 24px;
  text-align: center;
  font-size: 18px;
  letter-spacing: .05em;
}

.label-2 {
  font-size: 16px;
  text-align: center;
  padding-bottom: 24px;
}

label {
  background-color:#0060df;
  color:#fff;
  cursor: pointer;
  padding: 16px 24px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.into {
  padding: 0 24px;
  text-align: left;
}

.into h2 {
  font-size: 32px;
  padding-bottom: 8px;
  font-weight: 700;
}

.into p {
  line-height: 1.75;
  margin-top: 16px;
}

.options {
  display: flex;
  flex-direction: column;
}

@media (min-width:768px) {
  .columns {
    flex-direction: row;
  }
  .columns > div {
    width: 50%;
  }
}
</style>
