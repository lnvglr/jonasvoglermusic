import Vue from "vue";
import VueGtag from "vue-gtag";

export default ({ app }) => {
  Vue.use(
    VueGtag,
    {
      config: {
        id: "G-4ERRMFBFD4",
        anonymize_ip: true,
      }
    },
    app.router
  );
};
