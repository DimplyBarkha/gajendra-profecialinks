
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.ch',
    timeout: 35000,
    country: 'CH',
    store: 'mediamarkt',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.goto(`${url}`, {
      anti_fingerprint: true,
      discard_CSP_header: false,
      timeout: 100000,
      waitUntil: 'load',
    });
  },
};
