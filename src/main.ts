import { createApp, ref } from "vue";
import App from "./App.vue";

// const app = createApp(App).mount("#app");
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any)["vue"] = app;

const app = createApp(App);
const urlBase = ref("");
app.provide("urlBase", urlBase);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translation = ref({}) as any;
app.provide("translation", translation);
app.provide("i18n", (text: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mountedApp as any)?.translation?.[text] || text;
});
const mountedApp = app.mount("#app");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any)["vue"] = mountedApp;
