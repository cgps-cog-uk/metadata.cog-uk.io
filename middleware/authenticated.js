export default function ({ store, redirect, req }) {
  if (!store.getters.isAuthenticated) {
    return redirect("/login");
  }
  return null;
}
