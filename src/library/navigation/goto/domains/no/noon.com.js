
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'noon.com',
    timeout: null,
    country: 'AE',
    store: 'noon',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 40000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    url = `${url}#[!opt!]{"force200": true}[/!opt!]`;
    await context.goto(url, { timeout: timeout, waitUntil: 'load' });
  },
};
