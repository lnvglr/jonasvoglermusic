import { bootstrap } from "vue-gtag";

export default ({ store }) => {
  if (!process.client) return;

  const getId = () => window.GTAG_ID || window.__GTAG_ID__ || "";

  const withId = async (fn) => {
    let attempts = 0;
    return new Promise((resolve) => {
      const tick = () => {
        const id = getId();
        if (id || attempts > 60) {
          resolve(fn(id));
          return;
        }
        attempts += 1;
        requestAnimationFrame(tick);
      };
      tick();
    });
  };

  const enableGa = () => {
    withId((id) => {
      if (!id) return;
      window[`ga-disable-${id}`] = false;
      const boot = () => {
        if (!window.__GA_BOOTSTRAPPED__) {
          bootstrap().then((gtag) => {
            window.__GA_BOOTSTRAPPED__ = true;
            if (typeof gtag === "function") {
              gtag("consent", "update", {
                analytics_storage: "granted",
                functionality_storage: "granted",
                security_storage: "granted",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
              });
              gtag("event", "page_view", {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname + window.location.search,
              });
            }
          });
        } else if (typeof window.gtag === "function") {
          window.gtag("consent", "update", {
            analytics_storage: "granted",
            functionality_storage: "granted",
            security_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          });
        }
      };
      // Defer one tick to ensure vue-gtag plugin finished
      setTimeout(boot, 0);
    });
  };

  const disableGa = () => {
    withId((id) => {
      if (!id) return;
      window[`ga-disable-${id}`] = true;
    });
  };

  // Initialize based on current consent
  // If vue-cookie-law already persisted consent, honor it immediately
  let persistedAccepted = null;
  try {
    const val = localStorage.getItem('cookie:accepted');
    if (val === 'true') persistedAccepted = true;
    if (val === 'false') persistedAccepted = false;
  } catch (e) {}

  if (persistedAccepted === true) {
    // Full consent previously granted
    store.dispatch('setCookieConsent', true);
    store.dispatch('setCookieTrackingConsent', true);
  }

  const functionalConsent = store.getters.getCookieConsent;
  const trackingConsent = store.getters.getCookieTrackingConsent;
  if (functionalConsent === true && trackingConsent === true) enableGa();
  else disableGa();

  // React to consent changes anywhere in the app
  store.watch(
    (state, getters) => ({
      functional: getters.getCookieConsent,
      tracking: getters.getCookieTrackingConsent,
    }),
    (val) => {
      if (val.functional === true && val.tracking === true) enableGa();
      else disableGa();
    }
  );
};


