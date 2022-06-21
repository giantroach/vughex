import { createApp, ref } from "vue";
import App from "./App.vue";

// const app = createApp(App).mount("#app");
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any)["vue"] = app;

const app = createApp(App);
const urlBase = ref("");
app.provide("urlBase", urlBase);
const mountedApp = app.mount("#app");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any)["vue"] = mountedApp;
