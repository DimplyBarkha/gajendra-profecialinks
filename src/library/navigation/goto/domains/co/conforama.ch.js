
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'Conforama.ch',
    timeout: 40000,
    country: 'CH',
    store: 'Conforama',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    // console.log(zipcode);
    // if (zipcode || storeId) {
    //   await dependencies.setZipCode(inputs);
    // }
  },
};
