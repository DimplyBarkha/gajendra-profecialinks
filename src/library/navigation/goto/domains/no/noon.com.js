
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'noon.com',
    timeout: 2000000,
    country: 'SA',
    store: 'noon',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 2000000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    url = url.replace(/(.+)(noon\.com)(.+)/g,'https://www.$2$3'); // handles incorrect format "https://www.noon.comhttps://noon.com/saudi-en/product/N28903612A/p?o=cb2b110b8c01e95d"
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
  },
};
