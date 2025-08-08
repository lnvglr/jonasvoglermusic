import Vue from "vue";
import VueGtag from "vue-gtag";

export default ({ app }) => {
  const measurementId = process.env.GTAG_ID || "G-4ERRMFBFD4";

  if (process.client) {
    // Prevent any accidental hits before explicit consent/bootstrapping
    window.__GTAG_ID__ = measurementId;
    window.GTAG_ID = measurementId;
    // Only set the flag if not already explicitly flipped by consent handler
    if (typeof window[`ga-disable-${measurementId}`] === 'undefined') {
      window[`ga-disable-${measurementId}`] = true;
    }
  }

  Vue.use(
    VueGtag,
    {
      config: {
        id: measurementId,
        params: {
          anonymize_ip: true,
          // Avoid double initial page_view; rely on router tracking
          send_page_view: false,
        },
      },
      debug: process.env.NODE_ENV !== 'production',
      // Respect consent: don't load until explicitly bootstrapped in CookieNotice
      enabled: false,
      bootstrap: false,
    },
    app.router
  );
};
