export default function ({ store, redirect, req }) {
  if (!store.getters.isAuthenticated) {
    return redirect("/signin");
  }
  return null;
}
