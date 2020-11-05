module.exports = {
  implements: "navigation/goto",
  parameterValues: {
    domain: "americanas.com.br",
    timeout: null,
    country: "BR",
    store: "americanas",
    zipcode: "",
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setFirstRequestTimeout(60000);
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(url, {
      block_ads: false,
      timeout: 60000,
      waitUntil: "load",
      load_all_resources: true,
      images_enabled: true,
    });
  },
};
