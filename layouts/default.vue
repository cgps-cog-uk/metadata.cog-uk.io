<template>
  <div class="full-container">
    <header>
      <h1>
        COG-UK
      </h1>
      <nav>
        <a
          href="https://cutt.ly/cog-uk-epicollect-docs"
          target="_blank"
          class="button--grey"
        >
          Help
        </a>
      </nav>
    </header>
    <main>
      <nuxt />
    </main>
    <footer>
      <span>
        Logged in as {{ user.email }}.
      </span>
      <ul>
        <li>
          <a href="mailto:support@cog-uk.io">support@cog-uk.io</a>
        </li>
        <li>
          <nuxt-link to="/">
            Upload
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/api">
            API
          </nuxt-link>
        </li>
        <li>
          <a href="/logout">
            Logout
          </a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      user: "user",
    }),
  },
};
</script>

<style scoped>
.full-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
}

header {
  width: 100%;
  height: 64px;
  min-height: 64px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

main {
  display: flex;
  position: relative;
  max-width: 64rem;
  /* height: 100%; */
  flex-grow: 1;

  /* flex: 1 1 0%; */
  align-self: center;
  align-items: center;
  margin: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  /* min-height: 20rem; */
  /* max-height: 36rem; */
  /* width: calc(100% - 3rem); */
  -moz-box-flex: 0;

  overflow: auto;
}

section {
  margin: 24px;
  background-color: #fff;
  box-shadow: 0 12px 18px 2px rgba(34,0,51,.04),0 6px 22px 4px rgba(7,48,114,.12),0 6px 10px -4px rgba(14,13,26,.12);
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  /* overflow: hidden; */
  /* min-height: 100%; */
  /* height: 100%; */
  border: 0 solid #d7d7db;
  /* min-height: 32rem; */
  /* max-height: 38rem; */
  text-align: left;
}

footer {
  width: 100%;
  padding: 8px 32px;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: .75rem;
  color: #4a4a4f;
  align-items: center;
  font-weight: 500;
}
footer ul {
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  display: flex;
  user-select: none;
  list-style: none;
  margin: 0;
  padding: 0;
}
footer ul li {
  margin: .5rem;
}
footer ul li a {
  color: inherit;
  text-decoration: none;
  background-color: initial;
}
</style>
