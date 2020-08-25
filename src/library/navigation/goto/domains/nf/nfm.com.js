module.exports = {
  implements: "navigation/goto",
  parameterValues: {
    domain: "nfm.com",
    timeout: null,
    country: "US",
    store: "nfm",
    zipcode: "",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    context.setBlockAds(false);
    // context.goto(inputs.url, {
    //   // anti_fingerprint: true,
    //   waitUntil: "load",
    //   checkBlocked: true,
    // });
    // context.setFirstRequestTimeout(60000);
    context.setAntiFingerprint(true);
  },
};
