module.exports = {
  implements: "navigation/goto",
  parameterValues: {
    domain: "intermarche.com",
    timeout: null,
    country: "FR",
    store: "intermarche",
    zipcode: "",
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: "load",
      checkBlocked: true,
      antiCaptchaOptions: {
        type: "RECAPTCHA",
      },
    });
    await context.waitForNavigation();
  },
};
