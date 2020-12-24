
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'johnlewis.com',
    timeout: 65000,
    country: 'UK',
    store: 'johnlewis',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    // const timeout = parameters.timeout ? parameters.timeout : 10000;

    // await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.setLoadImages(true);
    // await context.setFirstRequestTimeout(60000);
    await context.goto(url, { timeout: 75000, waitUntil: 'load', checkBlocked: true });
    /*
    await context.setBlockAds(false);
    await context.goto(`${url}`, {
      anti_fingerprint: true,
      discard_CSP_header: false,
      timeout: 100000,
      waitUntil: 'load',
    });

    */
  },
};
